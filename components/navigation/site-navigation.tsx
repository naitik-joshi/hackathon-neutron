"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { signOut } from "@/features/auth/actions";
import type { Role } from "@/lib/supabase/database.types";
import { buttonVariants } from "@/components/ui";
import { cn } from "@/lib/utilities/cn";

const links = [
  ["/research", "Research"],
  ["/researchers", "Researchers"],
  ["/projects", "Projects"],
  ["/publications", "Publications"],
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function accountDestination(role?: Role) {
  if (role === "admin") return ["/admin", "Admin workspace"] as const;
  if (role === "researcher")
    return ["/researcher", "Researcher workspace"] as const;
  return ["/account", "Student account"] as const;
}

export function SiteNavigation({
  role,
  displayName,
}: {
  role?: Role;
  displayName?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const [accountHref, accountLabel] = accountDestination(role);

  useEffect(() => {
    if (!open) return;
    firstLinkRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const publicLinks = links.map(([href, label], index) => (
    <Link
      key={href}
      href={href}
      ref={index === 0 ? firstLinkRef : undefined}
      aria-current={isActive(pathname, href) ? "page" : undefined}
      onClick={() => setOpen(false)}
      className={cn("nav-link", isActive(pathname, href) && "nav-link-active")}
    >
      {label}
    </Link>
  ));

  return (
    <>
      <nav
        aria-label="Primary navigation"
        className="hidden items-center gap-5 lg:flex"
      >
        {publicLinks}
      </nav>
      <div className="hidden items-center gap-2 lg:flex">
        {role ? (
          <>
            <Link
              href={accountHref}
              className={buttonVariants({ variant: "secondary" })}
              title={displayName ? `Signed in as ${displayName}` : undefined}
            >
              {accountLabel}
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className={buttonVariants({ variant: "ghost" })}
                aria-label="Sign out"
              >
                <LogOut size={17} aria-hidden="true" />
                <span className="sr-only xl:not-sr-only">Sign out</span>
              </button>
            </form>
          </>
        ) : (
          <>
            <Link
              href="/auth/sign-in"
              className={buttonVariants({ variant: "ghost" })}
            >
              Sign in
            </Link>
            <Link href="/auth/sign-up" className={buttonVariants()}>
              Create student account
            </Link>
          </>
        )}
      </div>
      <button
        ref={triggerRef}
        type="button"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-white text-[var(--color-ink)] lg:hidden"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      {open && (
        <div
          id="mobile-navigation"
          className="absolute inset-x-0 top-full z-50 border-y border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-raised)] lg:hidden"
        >
          <nav
            aria-label="Mobile navigation"
            className="mx-auto grid max-w-7xl gap-1"
          >
            {publicLinks}
            <div className="my-2 border-t border-[var(--color-border)]" />
            {role ? (
              <>
                <Link
                  href={accountHref}
                  onClick={() => setOpen(false)}
                  className={buttonVariants({
                    variant: "secondary",
                    className: "justify-start",
                  })}
                >
                  {accountLabel}
                </Link>
                <form action={signOut}>
                  <button
                    type="submit"
                    className={buttonVariants({
                      variant: "ghost",
                      className: "w-full justify-start",
                    })}
                  >
                    <LogOut size={17} aria-hidden="true" /> Sign out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/auth/sign-in"
                  onClick={() => setOpen(false)}
                  className={buttonVariants({
                    variant: "secondary",
                    className: "justify-start",
                  })}
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/sign-up"
                  onClick={() => setOpen(false)}
                  className={buttonVariants({ className: "justify-start" })}
                >
                  Create student account
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
