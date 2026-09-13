"use client";

import { useMemo, useState, useTransition } from "react";
import { Button, FormMessage, Textarea } from "@/components/ui";
import { runPublicationPreflight } from "./actions";
import { PreflightResults } from "./preflight-results";
import type { PublicationPreflightResult } from "./types";

function fingerprint(title: string, abstract: string, referencesText: string) {
  return JSON.stringify([title.trim(), abstract.trim(), referencesText.trim()]);
}

export function SubmissionReadiness({
  title,
  abstract,
  currentPublicationId,
}: {
  title: string;
  abstract: string;
  currentPublicationId?: string;
}) {
  const [referencesText, setReferencesText] = useState("");
  const [result, setResult] = useState<PublicationPreflightResult>();
  const [resultFingerprint, setResultFingerprint] = useState<string>();
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const currentFingerprint = useMemo(
    () => fingerprint(title, abstract, referencesText),
    [title, abstract, referencesText],
  );
  const stale = Boolean(result && resultFingerprint !== currentFingerprint);

  function runReadiness() {
    setError(undefined);
    startTransition(async () => {
      const response = await runPublicationPreflight({
        title,
        abstract,
        referencesText,
        currentPublicationId,
      });
      if (response.error || !response.data) {
        setError(response.error ?? "Submission readiness could not run.");
        return;
      }
      setResult(response.data);
      setResultFingerprint(currentFingerprint);
    });
  }

  return (
    <section
      aria-labelledby="readiness-title"
      className="workspace-panel border-[var(--color-border-strong)] bg-[var(--color-surface-muted)] p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="workspace-overline">Advisory check</p>
          <h2 id="readiness-title" className="mt-2 workspace-section-title">
            Submission readiness
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
            Compare your draft with published Hub research, review suggested
            topics, and check basic reference completeness. Results guide your
            preparation and never prevent submission.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          disabled={pending}
          onClick={runReadiness}
        >
          {pending ? "Checking…" : result ? "Run again" : "Run readiness check"}
        </Button>
      </div>

      <div className="mt-5">
        <label
          htmlFor={`preflight-references-${currentPublicationId ?? "new"}`}
        >
          References for readiness check
        </label>
        <Textarea
          id={`preflight-references-${currentPublicationId ?? "new"}`}
          value={referencesText}
          onChange={(event) => setReferencesText(event.target.value)}
          maxLength={30000}
          placeholder="Paste one reference per line"
          className="min-h-32"
          aria-describedby={`preflight-references-help-${currentPublicationId ?? "new"}`}
        />
        <p
          id={`preflight-references-help-${currentPublicationId ?? "new"}`}
          className="mt-2 text-xs leading-5 text-[var(--color-text-muted)]"
        >
          References are analyzed for readiness only and are not stored with
          this submission.
        </p>
      </div>

      <div aria-live="polite" aria-atomic="true" className="mt-4">
        {pending ? (
          <p className="text-sm font-semibold text-[var(--color-text-muted)]">
            Checking published research and reference patterns…
          </p>
        ) : error ? (
          <FormMessage tone="error">{error}</FormMessage>
        ) : stale ? (
          <FormMessage tone="warning" title="Draft changed">
            Run readiness again to refresh these results before relying on them.
          </FormMessage>
        ) : result ? (
          <FormMessage tone="success" title="Readiness check complete">
            Review the advisory results below. You may submit with or without
            addressing them.
          </FormMessage>
        ) : (
          <p className="text-sm text-[var(--color-text-muted)]">
            You can run Submission Readiness before submitting.
          </p>
        )}
      </div>

      {result ? (
        <div className={`mt-6 ${stale ? "opacity-60" : ""}`}>
          <PreflightResults result={result} />
        </div>
      ) : null}
    </section>
  );
}
