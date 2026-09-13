import { GraduationCap, ShieldCheck } from "lucide-react";

export function RoleAccessInfo({ signup = false }: { signup?: boolean }) {
  return (
    <aside className="rounded-[var(--radius-md)] border border-[var(--color-info-border)] bg-[var(--color-info-soft)] p-4 text-sm text-[var(--color-info)]">
      <div className="flex items-start gap-3">
        {signup ? (
          <GraduationCap
            className="mt-0.5 shrink-0"
            size={19}
            aria-hidden="true"
          />
        ) : (
          <ShieldCheck
            className="mt-0.5 shrink-0"
            size={19}
            aria-hidden="true"
          />
        )}
        <div>
          <p className="font-semibold">
            {signup ? "Student account creation" : "One secure sign-in"}
          </p>
          <p className="mt-1">
            {signup
              ? "Every new account starts as a student. After signing in, researchers can submit an access request for an administrator to approve."
              : "Every member uses one secure sign-in. Approved researchers and administrators are routed to their role workspace by the server."}
          </p>
        </div>
      </div>
    </aside>
  );
}
