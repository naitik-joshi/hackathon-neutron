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
              ? "Researcher and administrator accounts are provisioned by the institution and cannot be created here."
              : "Students use their account. Researchers, staff and administrators use institution-provisioned credentials. The server opens the correct workspace after authentication."}
          </p>
        </div>
      </div>
    </aside>
  );
}
