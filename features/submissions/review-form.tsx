"use client";
import { useActionState } from "react";
import { reviewPublication } from "./actions";
import { Button, Textarea } from "@/components/ui";
import type { PublicationStatus } from "@/lib/supabase/database.types";
export function ReviewForm({
  id,
  status,
}: {
  id: string;
  status: PublicationStatus;
}) {
  const [state, action, pending] = useActionState(reviewPublication, {});
  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="id" value={id} />
      {status === "submitted" && (
        <Button name="decision" value="under_review" disabled={pending}>
          Start review
        </Button>
      )}
      {status === "under_review" && (
        <>
          <p className="text-sm text-slate-600">
            Approve only after checking the title, abstract, attribution and any
            demo label. Publishing makes this record visible to everyone.
          </p>
          <div className="space-y-4">
            <div>
              <label htmlFor="review-note">
                Review feedback (required for changes or rejection)
              </label>
              <Textarea
                id="review-note"
                name="note"
                maxLength={4000}
                rows={4}
                aria-describedby="review-note-help"
              />
              <p id="review-note-help" className="field-help">
                Give a concrete next step. Feedback is private to the submitter
                and administrators. A note is optional when publishing.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button name="decision" value="published" disabled={pending}>
                Approve and publish
              </Button>
              <Button
                name="decision"
                value="changes_requested"
                disabled={pending}
                variant="secondary"
              >
                Request changes
              </Button>
              <Button
                name="decision"
                value="rejected"
                disabled={pending}
                variant="danger"
              >
                Reject
              </Button>
            </div>
          </div>
        </>
      )}
      {pending && <p role="status">Saving review decision…</p>}
      {state.error && (
        <p role="alert" className="alert alert-error">
          {state.error}
        </p>
      )}
    </form>
  );
}
