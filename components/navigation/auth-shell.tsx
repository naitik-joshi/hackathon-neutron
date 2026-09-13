import type { ReactNode } from "react";
import { BookOpen, Network, Users } from "lucide-react";
import { BrandLogo } from "@/components/shared/ijmr-logo";

export function AuthShell({
  eyebrow,
  title,
  description,
  icon,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-9rem)] w-full max-w-[96rem] bg-[var(--color-surface)] lg:grid-cols-[minmax(0,1.05fr)_minmax(25rem,0.95fr)]">
      <div className="relative overflow-hidden bg-[var(--color-navy)] px-6 py-12 text-[var(--color-text-on-dark)] sm:px-10 lg:flex lg:min-h-[44rem] lg:flex-col lg:justify-center lg:px-16">
        <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--brand-spectrum-red),var(--brand-spectrum-yellow),var(--brand-spectrum-green),var(--brand-spectrum-teal),var(--brand-spectrum-blue))]" />
        <BrandLogo className="brand-lockup-dark mb-10" />
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white">
          {icon}
        </div>
        <p className="mt-6 text-sm font-semibold text-teal-200">{eyebrow}</p>
        <h1 className="type-h1 mt-3 max-w-2xl">{title}</h1>
        <p className="mt-5 max-w-xl text-base text-slate-200 sm:text-lg">
          {description}
        </p>
        <ul className="mt-9 grid max-w-xl gap-4 text-sm text-slate-200 sm:grid-cols-3 lg:grid-cols-1">
          <li className="flex items-start gap-3">
            <BookOpen
              className="mt-0.5 shrink-0 text-teal-200"
              size={18}
              aria-hidden="true"
            />
            Browse published research without signing in
          </li>
          <li className="flex items-start gap-3">
            <Network
              className="mt-0.5 shrink-0 text-teal-200"
              size={18}
              aria-hidden="true"
            />
            Follow links between ideas, people and projects
          </li>
          <li className="flex items-start gap-3">
            <Users
              className="mt-0.5 shrink-0 text-teal-200"
              size={18}
              aria-hidden="true"
            />
            Use an account for participation and research operations
          </li>
        </ul>
      </div>
      <div className="flex items-center px-5 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-md">{children}</div>
      </div>
    </section>
  );
}
