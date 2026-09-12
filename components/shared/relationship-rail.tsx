import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utilities/cn";

export type RelationshipStep = {
  label: string;
  detail: string;
  href?: string;
  current?: boolean;
  available?: boolean;
};

export function RelationshipRail({ steps }: { steps: RelationshipStep[] }) {
  return (
    <nav aria-label="Research relationships" className="relationship-rail">
      <p className="section-kicker px-5 pt-5 sm:px-6">Follow the connections</p>
      <ol className="relationship-rail-list">
        {steps.map((step, index) => {
          const available = step.available !== false;
          const content = (
            <>
              <span className="relationship-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <strong className="block font-semibold text-inherit">
                  {step.label}
                </strong>
                <span className="mt-1 block text-xs text-muted">
                  {step.detail}
                </span>
              </span>
              {step.href && available && !step.current && (
                <ArrowRight
                  size={15}
                  className="ml-auto shrink-0"
                  aria-hidden="true"
                />
              )}
            </>
          );

          return (
            <li key={`${step.label}-${index}`} className="min-w-0">
              {step.href && available && !step.current ? (
                <Link
                  href={step.href}
                  className="relationship-step interactive-surface"
                >
                  {content}
                </Link>
              ) : (
                <div
                  aria-current={step.current ? "page" : undefined}
                  className={cn(
                    "relationship-step",
                    step.current && "relationship-step-current",
                    !available && "relationship-step-empty",
                  )}
                >
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
