import { MessageSquareText } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import type { PublicationReview } from "@/lib/supabase/database.types";

export function ReviewHistory({ reviews }: { reviews: PublicationReview[] }) {
  return (
    <section
      className="workspace-section"
      aria-labelledby="review-history-title"
    >
      <div className="workspace-section-heading justify-start">
        <MessageSquareText
          aria-hidden="true"
          size={20}
          className="text-[var(--color-action)]"
        />
        <h2 id="review-history-title" className="workspace-section-title">
          Review history
        </h2>
      </div>
      {reviews.length === 0 ? (
        <div className="workspace-panel border-dashed p-5">
          <h3 className="font-sans text-sm font-bold">
            No review activity yet
          </h3>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Feedback and workflow decisions will appear here after an R&D
            reviewer begins the review.
          </p>
        </div>
      ) : (
        <ol className="workspace-panel">
          {reviews.map((review) => (
            <li key={review.id} className="workspace-record">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <StatusBadge status={review.decision} />
                <time
                  className="text-xs text-[var(--color-text-subtle)]"
                  dateTime={review.created_at}
                >
                  {new Date(review.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    timeZone: "UTC",
                  })}
                </time>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-6 text-[var(--color-text)]">
                {review.note || "No written feedback was added."}
              </p>
              <p className="text-xs text-[var(--color-text-subtle)]">
                R&amp;D reviewer
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
