import Link from "next/link";
import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { BrandLogo } from "@/components/shared/ijmr-logo";

const journalLinks = [
  ["https://ijmr.islingtoncollege.edu.np/index.php/IJMR", "IJMR journal"],
  [
    "https://ijmr.islingtoncollege.edu.np/index.php/IJMR/about/submissions",
    "Submission guidance",
  ],
  [
    "https://ijmr.islingtoncollege.edu.np/index.php/IJMR/aims-scope",
    "Aims and scope",
  ],
  [
    "https://ijmr.islingtoncollege.edu.np/index.php/IJMR/ethics-policies",
    "Ethics and policies",
  ],
  [
    "https://ijmr.islingtoncollege.edu.np/index.php/IJMR/peer-review-process",
    "Peer-review process",
  ],
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[var(--color-navy)] text-slate-200">
      <div className="h-1 bg-[linear-gradient(90deg,var(--brand-spectrum-red),var(--brand-spectrum-yellow),var(--brand-spectrum-green),var(--brand-spectrum-teal),var(--brand-spectrum-blue))]" />
      <div className="page-shell grid gap-10 lg:grid-cols-[1.35fr_0.8fr_0.8fr_1fr]">
        <div>
          <BrandLogo className="brand-lockup-dark" />
          <p className="mt-5 max-w-sm text-sm text-slate-300">
            A connected discovery and participation layer for Islington
            research. IJMR provides the journal and academic publishing context.
          </p>
          <p className="mt-3 text-xs text-slate-400">
            Fictional institutional records remain visibly marked DEMO DATA.
          </p>
        </div>
        <FooterGroup title="Discover">
          <Link href="/research">Research areas</Link>
          <Link href="/researchers">Researchers</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/publications">Publications</Link>
        </FooterGroup>
        <FooterGroup title="Participate">
          <Link href="/auth/sign-in">Sign in</Link>
          <Link href="/auth/sign-up">Create student account</Link>
          <Link href="/events">Events</Link>
          <Link href="/opportunities">Opportunities</Link>
        </FooterGroup>
        <FooterGroup title="Official IJMR resources">
          {journalLinks.map(([href, label]) => (
            <a key={href} href={href} target="_blank" rel="noreferrer">
              {label}{" "}
              <ExternalLink className="inline" size={12} aria-hidden="true" />
            </a>
          ))}
        </FooterGroup>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-[calc(100%-2rem)] max-w-7xl flex-wrap justify-between gap-2 py-5 text-xs text-slate-400">
          <span>Islington College R&amp;D Digital Hub</span>
          <span>Discover → Understand → Connect → Participate</span>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <nav aria-label={title} className="grid content-start gap-3 text-sm">
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      <div className="grid gap-2.5 text-slate-300 [&_a]:w-fit [&_a]:underline-offset-4 [&_a]:transition-colors [&_a]:hover:text-white [&_a]:hover:underline">
        {children}
      </div>
    </nav>
  );
}
