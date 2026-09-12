import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getViewer } from "@/lib/auth/viewer";
import { BrandLogo } from "@/components/shared/ijmr-logo";
import { SiteNavigation } from "./site-navigation";

export async function SiteHeader() {
  const viewer = await getViewer();

  return (
    <header className="site-header">
      <div className="bg-[var(--color-navy)] text-[var(--color-text-on-dark)]">
        <div className="mx-auto flex min-h-8 w-[calc(100%-2rem)] max-w-7xl items-center justify-between gap-4 py-1 text-xs">
          <span>Islington College research community</span>
          <div className="flex items-center gap-4">
            <Link href="/events" className="hidden hover:underline sm:inline">
              Events
            </Link>
            <Link
              href="/opportunities"
              className="hidden hover:underline sm:inline"
            >
              Opportunities
            </Link>
            <a
              href="https://ijmr.islingtoncollege.edu.np/index.php/IJMR"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:underline"
            >
              IJMR journal <ExternalLink size={12} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
      <div className="relative mx-auto flex min-h-18 w-[calc(100%-2rem)] max-w-7xl items-center justify-between gap-4 py-3">
        <Link href="/" aria-label="Islington R&D Digital Hub home">
          <BrandLogo compact priority />
        </Link>
        <SiteNavigation role={viewer?.role} displayName={viewer?.displayName} />
      </div>
    </header>
  );
}
