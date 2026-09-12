import Link from "next/link";
export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-[#000922] text-slate-200">
      <div className="page-shell grid gap-8 md:grid-cols-3">
        <div>
          <h2 className="text-xl text-white">Islington R&D Digital Hub</h2>
          <p className="mt-3 text-sm text-slate-300">
            Discover research, understand its connections and find your next
            step. Fictional records are visibly marked DEMO DATA.
          </p>
        </div>
        <nav
          aria-label="Footer research navigation"
          className="grid gap-3 text-sm"
        >
          {[
            ["/research", "Research areas"],
            ["/researchers", "Researchers"],
            ["/projects", "Projects"],
            ["/publications", "Publications"],
          ].map(([url, label]) => (
            <Link
              key={url}
              href={url}
              className="underline focus-visible:outline-white"
            >
              {label}
            </Link>
          ))}
        </nav>
        <nav
          aria-label="Footer participation navigation"
          className="grid gap-3 text-sm"
        >
          <Link
            href="/events"
            className="underline focus-visible:outline-white"
          >
            Events — coming soon
          </Link>
          <Link
            href="/opportunities"
            className="underline focus-visible:outline-white"
          >
            Opportunities — coming soon
          </Link>
          <Link
            href="/auth/sign-in"
            className="underline focus-visible:outline-white"
          >
            Sign in
          </Link>
          <Link
            href="/auth/sign-up"
            className="underline focus-visible:outline-white"
          >
            Create a student account
          </Link>
        </nav>
      </div>
    </footer>
  );
}
