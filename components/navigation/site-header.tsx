import Link from "next/link";
import { BookOpen, LogOut, Menu } from "lucide-react";
import { getViewer } from "@/lib/auth/viewer";
import { signOut } from "@/features/auth/actions";
const links = [
  ["/", "Home"],
  ["/research", "Research areas"],
  ["/researchers", "Researchers"],
  ["/projects", "Projects"],
  ["/publications", "Publications"],
];
export async function SiteHeader() {
  const viewer = await getViewer();
  const href =
    viewer?.role === "admin"
      ? "/admin"
      : viewer?.role === "researcher"
        ? "/researcher"
        : "/account";
  const label =
    viewer?.role === "admin"
      ? "Admin workspace"
      : viewer?.role === "researcher"
        ? "Researcher workspace"
        : "Account";
  return (
    <header className="site-header">
      <div className="mx-auto flex min-h-16 w-[calc(100%-2rem)] max-w-7xl flex-wrap items-center justify-between gap-3 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold"
          aria-label="Islington R&D Hub home"
        >
          <BookOpen size={24} aria-hidden="true" />
          <span>
            Islington{" "}
            <span className="block text-xs text-slate-600">
              R&D Digital Hub
            </span>
          </span>
        </Link>
        <nav aria-label="Main navigation" className="hidden xl:flex gap-5">
          {links.map(([url, text]) => (
            <Link
              key={url}
              href={url}
              className="text-sm font-semibold hover:underline"
            >
              {text}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {viewer ? (
            <>
              <Link
                href={href}
                aria-label={label}
                className="text-sm underline"
              >
                <span className="sm:hidden">Account</span>
                <span className="hidden sm:inline">{label}</span>
              </Link>
              <form action={signOut}>
                <button type="submit" aria-label="Sign out" className="p-2">
                  <LogOut size={18} aria-hidden="true" />
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/sign-in" className="text-sm underline">
                Sign in
              </Link>
              <Link
                href="/auth/sign-up"
                className="hidden sm:inline-flex btn-academic-primary"
              >
                Create account
              </Link>
            </>
          )}
          <details className="mobile-menu xl:hidden">
            <summary aria-label="Open navigation menu">
              <Menu size={18} aria-hidden="true" />
              <span className="sr-only">Menu</span>
            </summary>
            <div className="mobile-menu-panel">
              <nav aria-label="Mobile navigation" className="grid gap-1">
                {links.map(([url, text]) => (
                  <Link
                    key={url}
                    href={url}
                    className="rounded p-3 text-sm hover:bg-slate-100"
                  >
                    {text}
                  </Link>
                ))}
                {!viewer && (
                  <Link
                    href="/auth/sign-up"
                    className="rounded p-3 text-sm underline"
                  >
                    Create account
                  </Link>
                )}
              </nav>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
