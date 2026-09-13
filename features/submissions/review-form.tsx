"use client";

import { useActionState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileClock,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { Button, FormMessage, Textarea } from "@/components/ui";
import type { PublicationStatus } from "@/lib/supabase/database.types";
import { reviewPublication } from "./actions";

export function ReviewForm({
  id,
  status,
}: {
  id: string;
  status: PublicationStatus;
}) {
  const [state, action, pending] = useActionState(reviewPublication, {});
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={id} />

      {status === "submitted" && (
        <div className="space-y-4">
          <FormMessage tone="warning" title="Ready to start review">
            Starting review changes the researcher-visible status to Under
            review.
          </FormMessage>
          <Button name="decision" value="under_review" disabled={pending}>
            {pending ? "Starting review…" : "Start review"}
          </Button>
        </div>
      )}

      {status === "under_review" && (
        <div className="space-y-5">
          <div>
            <label htmlFor="review-note">Review note</label>
            <Textarea
              id="review-note"
              name="note"
              maxLength={4000}
              rows={5}
              aria-describedby="review-note-help"
              placeholder="Add clear feedback for the researcher."
            />
            <p id="review-note-help" className="field-help">
              Required for Request changes and Reject (3–4000 characters).
              Optional for Publish.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button name="decision" value="published" disabled={pending}>
              <CheckCircle2 aria-hidden="true" size={16} />
              Publish
            </Button>
            <Button
              name="decision"
              value="changes_requested"
              disabled={pending}
              variant="secondary"
            >
              <RefreshCw aria-hidden="true" size={16} />
              Request changes
            </Button>
            <Button
              name="decision"
              value="rejected"
              disabled={pending}
              variant="danger"
              className="sm:col-span-2"
            >
              <XCircle aria-hidden="true" size={16} />
              Reject
            </Button>
          </div>
        </div>
      )}

      {status === "published" && (
        <FormMessage tone="success" title="Published">
          This record is available in the public publication directory.
        </FormMessage>
      )}
      {status === "changes_requested" && (
        <FormMessage tone="warning" title="Waiting for researcher changes">
          The researcher can read the feedback and resubmit an updated record.
        </FormMessage>
      )}
      {status === "rejected" && (
        <FormMessage tone="error" title="Submission rejected">
          This submission is closed. Its review history remains available to the
          administrator and submitting researcher.
        </FormMessage>
      )}
      {status === "draft" && (
        <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 text-sm text-[var(--color-text-muted)]">
          <FileClock aria-hidden="true" className="mt-0.5 shrink-0" size={18} />
          <p>This draft has not been submitted for review.</p>
        </div>
      )}
      {pending && (
        <p role="status" className="text-sm text-[var(--color-text-muted)]">
          Recording decision…
        </p>
      )}
      {state?.error && (
        <div className="flex items-start gap-2">
          <AlertCircle
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-[var(--color-danger)]"
            size={18}
          />
          <FormMessage tone="error" className="flex-1">
            {state.error}
          </FormMessage>
        </div>
      )}
    </form>
  );
}
