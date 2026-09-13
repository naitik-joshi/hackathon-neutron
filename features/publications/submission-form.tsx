"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FileText, WandSparkles } from "lucide-react";
import { Button, FormMessage, Input, Textarea } from "@/components/ui";
import { SubmissionReadiness } from "@/features/preflight/submission-readiness";
import type { ExtractedPublication } from "./template-parser";

const emptyFields: ExtractedPublication = {
  title: "",
  abstract: "",
  authors: "",
  affiliations: "",
  submittedOn: "",
  correspondence: "",
  keywords: "",
  introduction: "",
  literatureReview: "",
  methodology: "",
  resultsAndDiscussion: "",
  conclusion: "",
  disclosureStatement: "",
  ethicalApproval: "",
  consentToParticipate: "",
  consentToPublish: "",
  dataAvailability: "",
  aiTools: "",
  authorContributions: "",
  funding: "",
  competingInterests: "",
  acknowledgements: "",
  references: "",
};

const articleSections: { key: keyof ExtractedPublication; label: string }[] = [
  { key: "introduction", label: "Introduction" },
  { key: "literatureReview", label: "Literature and related work" },
  { key: "methodology", label: "Methodology / approach" },
  { key: "resultsAndDiscussion", label: "Results and discussion" },
  { key: "conclusion", label: "Conclusion" },
];

const disclosureFields: { key: keyof ExtractedPublication; label: string }[] = [
  { key: "disclosureStatement", label: "Disclosure statement" },
  { key: "ethicalApproval", label: "Ethical approval" },
  { key: "consentToParticipate", label: "Consent to participate" },
  { key: "consentToPublish", label: "Consent to publish" },
  { key: "dataAvailability", label: "Data availability statement" },
  { key: "aiTools", label: "Use of AI tools" },
  { key: "authorContributions", label: "Authors’ contributions" },
  { key: "funding", label: "Funding" },
  { key: "competingInterests", label: "Competing interests" },
  { key: "acknowledgements", label: "Acknowledgements" },
  { key: "references", label: "References" },
];

type ApiResult = {
  error?: string;
  fields?: ExtractedPublication;
  missingFields?: string[];
  redirectTo?: string;
};

export function SubmissionForm() {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [fields, setFields] = useState(emptyFields);
  const [extracted, setExtracted] = useState(false);
  const [busy, setBusy] = useState<"extract" | "submit" | null>(null);
  const [message, setMessage] = useState<{
    tone: "success" | "warning" | "error";
    text: string;
  } | null>(null);

  function update(key: keyof ExtractedPublication, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  async function extractDocument() {
    const file = fileInput.current?.files?.[0];
    if (!file) {
      setMessage({ tone: "error", text: "Choose a Word .docx file first." });
      return;
    }
    setBusy("extract");
    setMessage(null);
    const form = new FormData();
    form.set("file", file);
    try {
      const response = await fetch("/api/publications/extract", {
        method: "POST",
        body: form,
      });
      const result = (await response.json()) as ApiResult;
      if (!response.ok || !result.fields) {
        setMessage({
          tone: "error",
          text: result.error || "The document could not be extracted.",
        });
        return;
      }
      setFields(result.fields);
      setExtracted(true);
      setMessage({
        tone: result.missingFields?.length ? "warning" : "success",
        text: result.missingFields?.length
          ? "Extraction finished. Some optional fields were not found; review and edit the fields below."
          : "Extraction finished. Review and edit the fields below before submitting.",
      });
    } catch {
      setMessage({
        tone: "error",
        text: "The extraction service is unavailable. Please try again.",
      });
    } finally {
      setBusy(null);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!extracted) {
      setMessage({
        tone: "error",
        text: "Extract the uploaded document before submitting.",
      });
      return;
    }
    setBusy("submit");
    setMessage(null);
    try {
      const response = await fetch("/api/publications/submit", {
        method: "POST",
        body: new FormData(event.currentTarget),
      });
      const result = (await response.json()) as ApiResult;
      if (!response.ok || !result.redirectTo) {
        setMessage({
          tone: "error",
          text: result.error || "The publication could not be submitted.",
        });
        return;
      }
      router.push(result.redirectTo);
      router.refresh();
    } catch {
      setMessage({
        tone: "error",
        text: "The submission service is unavailable. Please try again.",
      });
    } finally {
      setBusy(null);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-7" aria-label="New publication">
      <fieldset className="space-y-4">
        <legend className="font-sans text-base font-bold text-[var(--color-ink)]">
          1. Upload the article
        </legend>
        <p className="text-sm text-[var(--color-text-muted)]">
          Start with a completed .docx based on the official article template.
          The file stays private until an administrator publishes the record.
        </p>
        <div>
          <label htmlFor="article-file">Article document *</label>
          <Input
            ref={fileInput}
            id="article-file"
            name="file"
            type="file"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            required
            onChange={() => {
              setExtracted(false);
              setMessage(null);
            }}
          />
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            Word .docx only, maximum 10 MB.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={extractDocument}
          disabled={busy !== null}
        >
          <WandSparkles aria-hidden="true" size={16} />
          {busy === "extract" ? "Extracting…" : "Extract article details"}
        </Button>
      </fieldset>

      {message && <FormMessage tone={message.tone}>{message.text}</FormMessage>}

      {extracted && (
        <>
          <fieldset className="space-y-5">
            <legend className="font-sans text-base font-bold text-[var(--color-ink)]">
              2. Review the extracted details
            </legend>
            <p className="text-sm text-[var(--color-text-muted)]">
              Edit anything that was not extracted correctly. Only title and
              abstract are required; all other fields may be left blank.
            </p>
            <div>
              <label htmlFor="title">Title *</label>
              <Input
                name="title"
                id="title"
                value={fields.title}
                onChange={(event) => update("title", event.target.value)}
                required
                minLength={3}
                maxLength={240}
              />
            </div>
            <div>
              <label htmlFor="authors">Authors</label>
              <Textarea
                name="authors"
                id="authors"
                className="min-h-24"
                value={fields.authors || ""}
                onChange={(event) => update("authors", event.target.value)}
                maxLength={2000}
              />
            </div>
            <div>
              <label htmlFor="affiliations">Affiliations</label>
              <Textarea
                name="affiliations"
                id="affiliations"
                className="min-h-24"
                value={fields.affiliations || ""}
                onChange={(event) => update("affiliations", event.target.value)}
                maxLength={4000}
              />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="submittedOn">Submitted on</label>
                <Input
                  name="submittedOn"
                  id="submittedOn"
                  value={fields.submittedOn || ""}
                  onChange={(event) =>
                    update("submittedOn", event.target.value)
                  }
                  maxLength={100}
                />
              </div>
              <div>
                <label htmlFor="correspondence">Correspondence</label>
                <Input
                  name="correspondence"
                  id="correspondence"
                  value={fields.correspondence || ""}
                  onChange={(event) =>
                    update("correspondence", event.target.value)
                  }
                  maxLength={500}
                />
              </div>
            </div>
            <div>
              <label htmlFor="abstract">Abstract *</label>
              <Textarea
                name="abstract"
                id="abstract"
                value={fields.abstract}
                onChange={(event) => update("abstract", event.target.value)}
                required
                minLength={20}
                maxLength={12000}
              />
            </div>
            <div>
              <label htmlFor="keywords">Keywords</label>
              <Input
                name="keywords"
                id="keywords"
                value={fields.keywords || ""}
                onChange={(event) => update("keywords", event.target.value)}
                maxLength={1000}
              />
            </div>
            {articleSections.map(({ key, label }) => (
              <div key={key}>
                <label htmlFor={key}>{label}</label>
                <Textarea
                  name={key}
                  id={key}
                  value={fields[key] || ""}
                  onChange={(event) => update(key, event.target.value)}
                  maxLength={key === "resultsAndDiscussion" ? 50000 : 30000}
                />
              </div>
            ))}
          </fieldset>

          <details className="workspace-panel p-5">
            <summary className="cursor-pointer font-sans font-bold text-[var(--color-ink)]">
              Disclosure, acknowledgements and references
            </summary>
            <div className="mt-5 space-y-5">
              {disclosureFields.map(({ key, label }) => (
                <div key={key}>
                  <label htmlFor={key}>{label}</label>
                  <Textarea
                    name={key}
                    id={key}
                    className="min-h-24"
                    value={fields[key] || ""}
                    onChange={(event) => update(key, event.target.value)}
                    maxLength={key === "references" ? 50000 : 5000}
                  />
                </div>
              ))}
            </div>
          </details>

          <fieldset className="space-y-5">
            <legend className="font-sans text-base font-bold text-[var(--color-ink)]">
              3. Submit for review
            </legend>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="doi">DOI (optional)</label>
                <Input
                  name="doi"
                  id="doi"
                  maxLength={200}
                  placeholder="10.1234/example"
                />
              </div>
              <div>
                <label htmlFor="year">Year (optional)</label>
                <Input
                  name="year"
                  id="year"
                  type="number"
                  min={1900}
                  max={2100}
                />
              </div>
            </div>
            <label className="flex min-h-11 items-start gap-3">
              <input name="is_demo" type="checkbox" className="mt-1" />
              <span>
                This is fictional demonstration content. Display DEMO DATA.
              </span>
            </label>
          </fieldset>
          <SubmissionReadiness
            title={fields.title}
            abstract={fields.abstract}
          />
          <p className="flex gap-2 text-sm leading-6 text-slate-600">
            <FileText aria-hidden="true" className="mt-1 shrink-0" size={16} />
            Submission sends the record and its private document for
            administrative review. It becomes public only after an administrator
            publishes it.
          </p>
          <Button disabled={busy !== null} aria-disabled={busy !== null}>
            {busy === "submit" ? "Submitting…" : "Submit for review"}
          </Button>
        </>
      )}
    </form>
  );
}
