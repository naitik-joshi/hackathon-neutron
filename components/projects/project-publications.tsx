import Link from "next/link";
import { BookOpen, ExternalLink, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui";
import { DemoBadge } from "@/components/shared/status-badge";
import type { Publication } from "@/lib/supabase/database.types";

export function ProjectPublications({
  publications,
}: {
  publications: Publication[];
}) {
  if (publications.length === 0) {
    return (
      <Card className="bg-slate-50/50 border-dashed border-slate-300">
        <h3 className="text-xl">Peer-Reviewed Outputs</h3>
        <p className="mt-2 text-sm text-slate-600">
          This project is currently active in the laboratory phase. Manuscripts and pre-prints are undergoing peer review and will appear here once approved by the editorial desk.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-slate-900">
          Peer-Reviewed Outputs & Pre-prints ({publications.length})
        </h3>
      </div>

      <div className="grid gap-4">
        {publications.map((pub) => {
          const title = pub.title.replace(/^DEMO DATA — /, "");
          const abstract = pub.abstract.replace(/^DEMO DATA — /, "");

          return (
            <Card key={pub.id} className="p-6 transition-all hover:border-blue-300">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    <BookOpen size={12} aria-hidden="true" />
                    IJMR {pub.year ?? "Recent"}
                  </span>
                  <DemoBadge demo={pub.is_demo} />
                </div>
                {pub.doi && (
                  <span className="font-mono text-xs text-slate-400">
                    DOI: {pub.doi}
                  </span>
                )}
              </div>

              <h4 className="text-xl font-bold text-slate-900 hover:text-blue-700 transition-colors">
                <Link href={`/publications/${pub.slug}`}>
                  {title}
                </Link>
              </h4>

              <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">
                {abstract}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs">
                <Link
                  href={`/publications/${pub.slug}`}
                  className="text-link inline-flex items-center gap-1 font-semibold"
                >
                  Read full paper <ArrowRight size={13} aria-hidden="true" />
                </Link>

                {pub.doi && (
                  <a
                    href={`https://doi.org/${encodeURIComponent(pub.doi)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    View DOI Record <ExternalLink size={12} aria-hidden="true" />
                  </a>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
