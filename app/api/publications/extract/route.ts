import {
  MAX_DOCUMENT_BYTES,
  validateResearchDocumentFile,
} from "@/features/publications/document-schema";
import {
  authorizeResearcherApi,
  extractPublicationFromDocument,
  requestBodyTooLarge,
} from "@/features/publications/server-intake";

export async function POST(request: Request) {
  if (requestBodyTooLarge(request, MAX_DOCUMENT_BYTES + 64 * 1024)) {
    return Response.json(
      { error: "The document must be 10 MB or smaller." },
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
      { error: "Choose a .docx or .pdf article document." },
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

  try {
    const fields = await extractPublicationFromDocument(file);
    const missingFields = Object.entries(fields)
      .filter(([, value]) => !value)
      .map(([field]) => field);
    return Response.json({ fields, missingFields });
  } catch {
    return Response.json(
      {
        error:
          "This file could not be read as a text-based DOCX or PDF. Use the official article template and try again.",
      },
      { status: 422 },
    );
  }
}
