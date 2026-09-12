"use client";

import { useActionState } from "react";
import { reviewPublication } from "./actions";
import { Button, Textarea } from "@/components/ui";
import type { PublicationStatus } from "@/lib/supabase/database.types";
import { CheckCircle2, AlertCircle, PlayCircle, RefreshCw, XCircle, FileClock } from "lucide-react";

export function ReviewForm({
  id,
  status,
}: {
  id: string;
  status: PublicationStatus;
}) {
  const [state, action, pending] = useActionState(reviewPublication, {});

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="id" value={id} />

      {status === "submitted" && (
        <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-5 space-y-4">
          <div className="flex items-start gap-3">
            <PlayCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-amber-900">
                Manuscript Awaiting Initial Editorial Triage
              </h4>
              <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">
                Initiating formal review moves this manuscript from the intake triage queue into active peer and editorial review. Authors will see the status updated to &ldquo;Under Review&rdquo;.
              </p>
            </div>
          </div>
          <div>
            <Button
              name="decision"
              value="under_review"
              disabled={pending}
              className="btn-academic bg-[#0F2042] text-white hover:bg-[#1B365D] text-xs font-semibold px-4 py-2"
            >
              {pending ? "Initiating review..." : "Initiate Formal Review"}
            </Button>
          </div>
        </div>
      )}

      {status === "under_review" && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 space-y-5 shadow-xs">
          <div className="space-y-1.5 border-b border-slate-100 pb-3">
            <h4 className="text-sm font-semibold text-slate-900 font-serif">
              Formal Editorial Verdict Formulation
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Verify research merit, ethical compliance, and institutional metadata. Publishing immediately releases this manuscript to the public index. Requesting changes or rejecting requires detailed, actionable feedback.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="review-note"
              className="block text-xs font-mono uppercase tracking-wider text-slate-700 font-semibold"
            >
              Editorial Feedback / Author Guidance
            </label>
            <Textarea
              id="review-note"
              name="note"
              maxLength={4000}
              rows={4}
              aria-describedby="review-note-help"
              placeholder="Provide constructive feedback, required revisions, or acceptance notes..."
              className="w-full font-sans text-xs md:text-sm p-3 border border-slate-300 rounded focus:ring-1 focus:ring-slate-900 leading-relaxed"
            />
            <p id="review-note-help" className="text-[0.7rem] text-slate-500">
              Required for change requests and rejections (3–4000 characters). Optional when approving for publication.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              name="decision"
              value="published"
              disabled={pending}
              className="bg-[#0F766E] hover:bg-[#0d645e] text-white text-xs font-medium px-4 py-2"
            >
              Approve & Publish
            </Button>
            <Button
              name="decision"
              value="changes_requested"
              disabled={pending}
              variant="secondary"
              className="text-xs font-medium px-4 py-2 border-slate-300 hover:bg-slate-50"
            >
              Request Changes
            </Button>
            <Button
              name="decision"
              value="rejected"
              disabled={pending}
              variant="danger"
              className="text-xs font-medium px-4 py-2"
            >
              Reject Submission
            </Button>
          </div>
        </div>
      )}

      {status === "published" && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#0F766E] shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-900 leading-relaxed">
            <strong className="block font-semibold text-emerald-950">
              Manuscript Officially Published
            </strong>
            This record has cleared peer review, received editorial approval, and is publicly indexed and searchable in the IJMR research repository.
          </div>
        </div>
      )}

      {status === "changes_requested" && (
        <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-4 flex items-start gap-3">
          <RefreshCw className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <strong className="block font-semibold text-amber-950">
              Awaiting Author Revisions
            </strong>
            The submitter has been issued editorial change instructions. The record is locked from further review decisions until the researcher submits a revised version.
          </div>
        </div>
      )}

      {status === "rejected" && (
        <div className="rounded-lg border border-rose-200 bg-rose-50/60 p-4 flex items-start gap-3">
          <XCircle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-900 leading-relaxed">
            <strong className="block font-semibold text-rose-950">
              Submission Declined
            </strong>
            This submission has been formally rejected. The record remains archived in the private audit ledger with its recorded rejection notes.
          </div>
        </div>
      )}

      {status === "draft" && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 flex items-start gap-3">
          <FileClock className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 leading-relaxed">
            <strong className="block font-semibold text-slate-900">
              Unsubmitted Author Draft
            </strong>
            This manuscript is currently in draft status and has not yet been submitted by the researcher for editorial intake.
          </div>
        </div>
      )}

      {pending && (
        <p role="status" className="text-xs text-slate-500 font-mono italic animate-pulse">
          Transacting review decision to database ledger...
        </p>
      )}

      {state?.error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
          <div className="text-xs text-red-800 font-medium">
            {state.error}
          </div>
        </div>
      )}
    </form>
  );
}
