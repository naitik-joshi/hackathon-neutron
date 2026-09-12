import Link from "next/link";
import { ChevronDown, FlaskConical, LogOut, UserRound } from "lucide-react";
import { signOut } from "@/features/auth/actions";
import { getViewer } from "@/lib/auth/viewer";
import { buttonVariants } from "@/components/ui";

const publicLinks = [
  { href: "/research", label: "Discover research" },
  { href: "/projects", label: "Projects" },
  { href: "/publications", label: "Publications" },
];

function AccountLinks({
  viewer,
  compact = false,
}: {
  viewer: Awaited<ReturnType<typeof getViewer>>;
  compact?: boolean;
}) {
  if (!viewer) {
    return (
      <div className={compact ? "grid gap-2" : "flex items-center gap-2"}>
        <Link
          href="/auth/sign-in"
          className={buttonVariants({ variant: "ghost" })}
        >
          Sign in
        </Link>
        <Link href="/auth/sign-up" className={buttonVariants()}>
          Create account
        </Link>
      </div>
    );
  }

  const workspace =
    viewer.role === "admin"
      ? { href: "/admin", label: "Admin workspace" }
      : viewer.role === "researcher"
        ? { href: "/researcher", label: "Researcher workspace" }
        : { href: "/account", label: "Your account" };

  return (
    <div className={compact ? "grid gap-2" : "flex items-center gap-2"}>
      <Link
        href={workspace.href}
        className={buttonVariants({ variant: "soft" })}
      >
        <UserRound aria-hidden="true" size={16} /> {workspace.label}
      </Link>
      <form action={signOut}>
        <button className={buttonVariants({ variant: "ghost" })}>
          <LogOut aria-hidden="true" size={16} /> Sign out
        </button>
      </form>
    </div>
  );
}

export async function SiteHeader() {
  const viewer = await getViewer();

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link
          href="/"
          className="brand-link"
          aria-label="Islington R&D Hub home"
        >
          <span className="brand-mark">
            <FlaskConical aria-hidden="true" size={20} />
          </span>
          <span>
            <strong>Islington</strong>
            <span className="block text-xs font-medium text-slate-500">
              Research & Development
            </span>
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-7 lg:flex"
        >
          {publicLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <AccountLinks viewer={viewer} />
        </div>

        <details className="mobile-menu lg:hidden">
          <summary>
            Menu <ChevronDown aria-hidden="true" size={16} />
          </summary>
          <div className="mobile-menu-panel">
            <nav aria-label="Mobile navigation" className="grid gap-1">
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="mobile-nav-link"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 border-t border-slate-200 pt-4">
              <AccountLinks viewer={viewer} compact />
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
