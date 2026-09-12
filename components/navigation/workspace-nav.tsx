"use client";

import Link from "next/link";
import { ArrowUpRight, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { signOut } from "@/features/auth/actions";
import { cn } from "@/lib/utilities/cn";

export type WorkspaceLink = { href: string; label: string };

export function WorkspaceNav({
  title,
  identity,
  links,
}: {
  title: string;
  identity: string;
  links: WorkspaceLink[];
}) {
  const pathname = usePathname();
  const activeHref = links
    .filter(
      (link) =>
        pathname === link.href ||
        (link.href !== links[0]?.href && pathname.startsWith(`${link.href}/`)),
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <aside className="workspace-nav" aria-label={`${title} navigation`}>
      <div className="min-w-0">
        <p className="section-kicker">{title}</p>
        <p className="mt-1 truncate font-serif text-lg font-semibold text-[var(--color-ink)]">
          {identity}
        </p>
      </div>
      <nav className="workspace-links">
        {links.map((link) => {
          const active = activeHref === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "workspace-link",
                active && "workspace-link-active",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <Link href="/research" className="workspace-public-link">
        Public research <ArrowUpRight aria-hidden="true" size={15} />
      </Link>
      <form action={signOut}>
        <button className="workspace-signout">
          <LogOut aria-hidden="true" size={16} /> Sign out
        </button>
      </form>
    </aside>
  );
}
