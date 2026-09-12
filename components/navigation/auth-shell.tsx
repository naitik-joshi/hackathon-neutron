import type { ReactNode } from "react";
import { BookOpen, Network, Users } from "lucide-react";
import { Card } from "@/components/ui";

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
    <section className="auth-grid">
      <div className="auth-story">
        <div className="auth-mark">{icon}</div>
        <p className="eyebrow text-blue-200">{eyebrow}</p>
        <h1 className="mt-4 text-4xl text-white sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-xl text-base text-slate-200 sm:text-lg">
          {description}
        </p>
        <ul className="mt-8 grid gap-4 text-sm text-slate-200">
          <li className="flex items-center gap-3">
            <BookOpen aria-hidden="true" size={19} /> Discover published work
            without signing in
          </li>
          <li className="flex items-center gap-3">
            <Network aria-hidden="true" size={19} /> Follow the connections
            between ideas, people and projects
          </li>
          <li className="flex items-center gap-3">
            <Users aria-hidden="true" size={19} /> Use an account when you are
            ready to participate or manage research
          </li>
        </ul>
      </div>
      <Card className="auth-card">{children}</Card>
    </section>
  );
}
