import { publicationSchema } from "@/lib/validation/publication";
import {
  MAX_DOCUMENT_BYTES,
  RESEARCH_DOCUMENT_BUCKET,
  getResearchDocumentDetails,
  metadataFromForm,
  validateResearchDocumentFile,
} from "@/features/publications/document-schema";
import {
  authorizeResearcherApi,
  extractPublicationFromDocument,
  requestBodyTooLarge,
} from "@/features/publications/server-intake";

function validationMessage(issues: { message: string }[]) {
  return issues.map((issue) => issue.message).join(" ");
}

export async function POST(request: Request) {
  if (requestBodyTooLarge(request, MAX_DOCUMENT_BYTES + 512 * 1024)) {
    return Response.json(
      { error: "The complete submission must be smaller than 10.5 MB." },
      { status: 413 },
    );
  }

  const auth = await authorizeResearcherApi();
  if ("response" in auth) return auth.response;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Upload a valid form." }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json(
      { error: "Upload and extract the article document first." },
      { status: 400 },
    );
  }
  const fileError = validateResearchDocumentFile(file);
  if (fileError) {
    return Response.json(
      { error: fileError },
      { status: file.size > MAX_DOCUMENT_BYTES ? 413 : 422 },
    );
  }

  const publication = publicationSchema.safeParse({
    title: form.get("title"),
    abstract: form.get("abstract"),
    doi: form.get("doi"),
    year: form.get("year"),
    is_demo: form.get("is_demo") === "on",
  });
  const metadata = metadataFromForm(form);
  if (!publication.success || !metadata.success) {
    const issues = [
      ...(publication.success ? [] : publication.error.issues),
      ...(metadata.success ? [] : metadata.error.issues),
    ];
    return Response.json({ error: validationMessage(issues) }, { status: 422 });
  }

  try {
    const extracted = await extractPublicationFromDocument(file);
    if (extracted.title.length < 3 || extracted.abstract.length < 20) {
      return Response.json(
        {
          error:
            "The uploaded document must contain a completed Full Article Title and Abstract from the official template.",
        },
        { status: 422 },
      );
    }
  } catch {
    return Response.json(
      { error: "The uploaded DOCX or PDF document could not be verified." },
      { status: 422 },
    );
  }

  const document = getResearchDocumentDetails(file);
  if (!document) {
    return Response.json(
      { error: "Unsupported document format." },
      { status: 422 },
    );
  }
  const id = crypto.randomUUID();
  const documentPath = `${auth.profile.id}/${id}.${document.extension}`;
  const upload = await auth.client.storage
    .from(RESEARCH_DOCUMENT_BUCKET)
    .upload(documentPath, file, {
      contentType: document.contentType,
      upsert: false,
    });
  if (upload.error) {
    return Response.json(
      {
        error:
          "The document could not be stored. Confirm that the private ResearchFileData bucket and its policies are configured.",
      },
      { status: 503 },
    );
  }

  const slugBase =
    publication.data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 70) || "publication";
  const { error } = await auth.client.from("publications").insert({
    id,
    ...publication.data,
    slug: `${slugBase}-${id}`,
    submitted_by: auth.profile.id,
    status: "submitted",
    document_path: documentPath,
    document_name: file.name.slice(0, 255),
    document_mime_type: document.contentType,
    document_metadata: metadata.data,
  });
  if (error) {
    await auth.client.storage
      .from(RESEARCH_DOCUMENT_BUCKET)
      .remove([documentPath]);
    return Response.json(
      { error: "Your submission could not be saved. Please try again." },
      { status: 500 },
    );
  }

  return Response.json(
    { publicationId: id, redirectTo: "/researcher/publications?submitted=1" },
    { status: 201 },
  );
}
