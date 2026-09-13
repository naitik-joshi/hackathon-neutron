import Link from "next/link";
import { DemoBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui";
import type {
  CitationReadiness,
  RelatedWork,
  SavedPublicationContext,
  TopicSuggestion,
} from "./types";

function RelatedWorkSection({ items }: { items: RelatedWork[] }) {
  return (
    <section aria-labelledby="related-work-title">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 id="related-work-title" className="font-sans text-sm font-bold">
          Potentially related work
        </h3>
        <span className="text-xs text-[var(--color-text-subtle)]">
          {items.length} published {items.length === 1 ? "record" : "records"}
        </span>
      </div>
      {items.length ? (
        <ul className="mt-3 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {items.map((item) => (
            <li key={item.id} className="py-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{item.overlapLevel} overlap</Badge>
                <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                  {item.overlapPercent}% lexical overlap
                </span>
                <DemoBadge demo={item.isDemo} />
              </div>
              <Link
                href={`/publications/${item.slug}`}
                className="text-link mt-2 inline-block font-semibold"
              >
                View published record: {item.title}
              </Link>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                {item.year ? `${item.year} · ` : ""}
                Shared terms: {item.sharedTerms.join(" · ")}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-[var(--color-text-muted)]">
          No strongly related published Hub records were found. This does not
          establish originality.
        </p>
      )}
      <p className="mt-3 text-xs leading-5 text-[var(--color-text-subtle)]">
        Similarity is based on textual overlap with published Hub records and is
        not a plagiarism determination.
      </p>
    </section>
  );
}

function TopicSection({
  suggestions,
  keywords,
}: {
  suggestions: TopicSuggestion[];
  keywords: string[];
}) {
  return (
    <section aria-labelledby="topics-title">
      <h3 id="topics-title" className="font-sans text-sm font-bold">
        Research topics
      </h3>
      {suggestions.length ? (
        <ul className="mt-3 space-y-2">
          {suggestions.map((suggestion) => (
            <li key={suggestion.id} className="text-sm">
              <Link
                href={`/research/${suggestion.slug}`}
                className="text-link font-semibold"
              >
                {suggestion.name}
              </Link>{" "}
              <span className="text-[var(--color-text-muted)]">
                · {suggestion.confidence} suggestion · matches{" "}
                {suggestion.matchingTerms.join(", ")}
              </span>{" "}
              <DemoBadge demo={suggestion.isDemo} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          No existing research area matched strongly enough to suggest.
        </p>
      )}
      <div
        className="mt-4 flex flex-wrap gap-2"
        aria-label="Suggested keywords"
      >
        {keywords.length ? (
          keywords.map((keyword) => <Badge key={keyword}>{keyword}</Badge>)
        ) : (
          <span className="text-sm text-[var(--color-text-muted)]">
            No useful keywords could be extracted.
          </span>
        )}
      </div>
      <p className="mt-3 text-xs leading-5 text-[var(--color-text-subtle)]">
        Suggestions come from the title, abstract, and existing Hub taxonomy.
        Review them before using them.
      </p>
    </section>
  );
}

function CitationSection({ result }: { result: CitationReadiness }) {
  const statusLabel = {
    "no-references": "No references provided",
    "review-recommended": "Review recommended",
    "looks-complete": "Looks complete",
  }[result.status];

  return (
    <section aria-labelledby="citation-readiness-title">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3
          id="citation-readiness-title"
          className="font-sans text-sm font-bold"
        >
          Citation readiness
        </h3>
        <Badge>{statusLabel}</Badge>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-[var(--color-text-muted)]">References</dt>
          <dd className="font-bold">{result.referenceCount}</dd>
        </div>
        <div>
          <dt className="text-[var(--color-text-muted)]">With a year</dt>
          <dd className="font-bold">{result.withYearCount}</dd>
        </div>
        <div>
          <dt className="text-[var(--color-text-muted)]">Duplicates</dt>
          <dd className="font-bold">{result.duplicateCount}</dd>
        </div>
        <div>
          <dt className="text-[var(--color-text-muted)]">DOIs / URLs</dt>
          <dd className="font-bold">
            {result.doiCount} / {result.urlCount}
          </dd>
        </div>
      </dl>
      {result.warnings.length ? (
        <ul className="mt-4 space-y-2 text-sm">
          {result.warnings.map((warning) => (
            <li key={warning.code} className="border-l-2 border-amber-500 pl-3">
              {warning.message} Lines {warning.lineNumbers.join(", ")}.
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-[var(--color-text-muted)]">
          No obvious formatting or completeness warnings were found.
        </p>
      )}
      <p className="mt-3 text-xs leading-5 text-[var(--color-text-subtle)]">
        This checks formatting and completeness patterns only. It does not
        verify that a source exists, supports the research, follows a citation
        style, or is academically correct.
      </p>
    </section>
  );
}

export function PreflightResults({
  result,
  includeCitations = true,
}: {
  result: SavedPublicationContext & { citationReadiness?: CitationReadiness };
  includeCitations?: boolean;
}) {
  return (
    <div className="divide-y divide-[var(--color-border)]">
      <div className="pb-5">
        <RelatedWorkSection items={result.relatedWork} />
      </div>
      <div className="py-5">
        <TopicSection
          suggestions={result.topicSuggestions}
          keywords={result.keywords}
        />
      </div>
      {includeCitations && result.citationReadiness ? (
        <div className="pt-5">
          <CitationSection result={result.citationReadiness} />
        </div>
      ) : null}
    </div>
  );
}
