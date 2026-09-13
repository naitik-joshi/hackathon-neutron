"use client";

import Link from "next/link";
import { ArrowUpRight, LogOut, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const activeHref = links
    .filter(
      (link) =>
        pathname === link.href ||
        (link.href !== links[0]?.href && pathname.startsWith(`${link.href}/`)),
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const navigation = (
    <>
      <nav className="workspace-links" aria-label={`${title} destinations`}>
        {links.map((link) => {
          const active = activeHref === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              onClick={() => setOpen(false)}
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
      <div className="workspace-nav-actions">
        <Link
          href="/research"
          className="workspace-public-link"
          onClick={() => setOpen(false)}
        >
          Public research <ArrowUpRight aria-hidden="true" size={15} />
        </Link>
        <form action={signOut}>
          <button className="workspace-signout">
            <LogOut aria-hidden="true" size={16} /> Sign out
          </button>
        </form>
      </div>
    </>
  );

  return (
    <>
      <aside
        className="workspace-nav workspace-nav-desktop"
        aria-label={`${title} navigation`}
      >
        <div className="workspace-identity">
          <p className="workspace-overline">Private workspace</p>
          <p className="workspace-role">{title}</p>
          <p className="workspace-person">{identity}</p>
        </div>
        {navigation}
      </aside>

      <div className="workspace-mobile">
        <div className="workspace-mobile-bar">
          <div className="min-w-0">
            <p className="workspace-overline">{title}</p>
            <p className="workspace-mobile-person">{identity}</p>
          </div>
          <button
            ref={triggerRef}
            type="button"
            className="workspace-menu-trigger"
            aria-expanded={open}
            aria-controls="workspace-mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X aria-hidden="true" size={19} />
            ) : (
              <Menu aria-hidden="true" size={19} />
            )}
            <span>{open ? "Close" : "Menu"}</span>
          </button>
        </div>
        {open && (
          <div id="workspace-mobile-menu" className="workspace-mobile-panel">
            {navigation}
          </div>
        )}
      </div>
    </>
  );
}
