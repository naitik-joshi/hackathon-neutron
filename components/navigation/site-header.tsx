import Link from "next/link";
import {
  Bookmark,
  Bell,
  Search,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { IJMRLogo } from "@/components/shared/ijmr-logo";
import { getViewer } from "@/lib/auth/viewer";
import { signOut } from "@/features/auth/actions";

const navLinks = [
  { href: "/", label: "Discover" },
  { href: "/publications", label: "Research Papers" },
  { href: "/researchers", label: "Researchers" },
  { href: "/projects", label: "Projects" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/events", label: "Community" },
  { href: "/researcher/publications/new", label: "Submit Research" },
];

export async function SiteHeader() {
  const viewer = await getViewer();

  const workspaceHref =
    viewer?.role === "admin"
      ? "/admin"
      : viewer?.role === "researcher"
        ? "/researcher"
        : "/account";

  return (
    <header className="site-header">
      <div className="site-header-inner">
        {/* Brand Monogram */}
        <Link href="/" className="inline-flex items-center gap-2 hover:opacity-95">
          <IJMRLogo />
        </Link>

        {/* Primary Desktop Nav Links */}
        <nav
          aria-label="Main navigation"
          className="hidden xl:flex items-center gap-6"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs tracking-tight font-semibold text-slate-700 hover:text-[#0F2042] transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Controls & Utilities */}
        <div className="flex items-center gap-3">
          {/* Quick Search Shortcut Pill */}
          <Link
            href="/publications"
            className="hidden sm:inline-flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500 hover:border-slate-300 hover:bg-white transition-all shadow-xs"
          >
            <Search size={13} className="text-slate-400" />
            <span>Quick search</span>
            <kbd className="rounded bg-slate-200/80 px-1 py-0.5 text-[0.65rem] font-mono font-medium text-slate-600">
              ⌘K
            </kbd>
          </Link>

          {/* Bookmark Counter */}
          <Link
            href="/publications"
            className="relative hidden md:inline-flex items-center justify-center p-1.5 text-slate-600 hover:text-[#0F2042] transition-colors"
            title="Saved Papers"
          >
            <Bookmark size={18} />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#9E1B32] text-[0.625rem] font-bold text-white">
              3
            </span>
          </Link>

          {/* Notification Bell */}
          <button
            type="button"
            className="relative p-1.5 text-slate-600 hover:text-[#0F2042] transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute 1 top-1 right-1 h-2 w-2 rounded-full bg-[#9E1B32]" />
          </button>

          {/* High-Emphasis Action: Submit Paper */}
          <Link
            href="/researcher/publications/new"
            className="hidden sm:inline-flex items-center gap-1.5 rounded bg-[#0F2042] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1E3A8A] transition-colors"
          >
            Submit Paper
          </Link>

          {/* User / Workspace Account Dropdown */}
          {viewer ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <Link
                href={workspaceHref}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#E5EEFF] px-2.5 py-1 text-xs font-medium text-[#0F2042] hover:bg-[#DCE9FF] transition-colors"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0F2042] text-[0.625rem] font-bold text-white uppercase">
                  {viewer.displayName?.charAt(0) || "U"}
                </div>
                <span className="hidden lg:inline capitalize font-semibold">
                  {viewer.role}
                </span>
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors"
                  title="Sign out"
                >
                  <LogOut size={16} />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <Link
                href="/auth/sign-in"
                className="text-xs font-semibold text-slate-700 hover:text-[#0F2042]"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Mobile Menu Dropdown */}
          <details className="mobile-menu xl:hidden">
            <summary>
              <ChevronDown size={16} />
            </summary>
            <div className="mobile-menu-panel z-50">
              <nav className="grid gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#0F2042]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-3 pt-3 border-t border-slate-200">
                <Link
                  href="/researcher/publications/new"
                  className="flex w-full items-center justify-center rounded bg-[#0F2042] py-2 text-xs font-semibold text-white"
                >
                  Submit Paper
                </Link>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
