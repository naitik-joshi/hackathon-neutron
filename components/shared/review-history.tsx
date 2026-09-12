import { MessageSquareText } from "lucide-react";
import { Card } from "@/components/ui";
import { StatusBadge } from "@/components/shared/status-badge";
import type { PublicationReview } from "@/lib/supabase/database.types";

export function ReviewHistory({ reviews }: { reviews: PublicationReview[] }) {
  return (
    <section aria-labelledby="review-history-title">
      <div className="mb-4 flex items-center gap-2">
        <MessageSquareText
          aria-hidden="true"
          size={20}
          className="text-blue-700"
        />
        <h2 id="review-history-title" className="text-2xl">
          Review history
        </h2>
      </div>
      {reviews.length === 0 ? (
        <Card className="border-dashed bg-slate-50/60">
          <h3 className="text-lg">No review activity yet</h3>
          <p className="mt-2 text-sm text-slate-600">
            Feedback and workflow decisions will appear here after an R&D
            reviewer begins the review.
          </p>
        </Card>
      ) : (
        <ol className="space-y-3">
          {reviews.map((review) => (
            <li key={review.id}>
              <Card className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <StatusBadge status={review.decision} />
                  <time
                    className="text-xs text-slate-500"
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
                <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">
                  {review.note || "No written feedback was added."}
                </p>
                <p className="mt-3 text-xs text-slate-500">R&D reviewer</p>
              </Card>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
