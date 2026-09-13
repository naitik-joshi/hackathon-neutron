import Link from "next/link";
import { UserRoundPlus } from "lucide-react";
import { SignUpForm } from "@/features/auth/sign-up-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AuthShell } from "@/components/navigation/auth-shell";
import { RoleAccessInfo } from "@/features/auth/role-access-info";
import { authHref, safeRedirectTo } from "@/lib/auth/redirects";
import { FormMessage } from "@/components/ui";

export const metadata = { title: "Create an account" };

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const redirectTo = safeRedirectTo((await searchParams).redirectTo);
  return (
    <AuthShell
      eyebrow="Join the research community"
      title="Create your account"
      description="Choose how you plan to participate. Every account starts safely as a student; researcher access requires administrator approval. Published research remains open to everyone."
      icon={<UserRoundPlus aria-hidden="true" />}
    >
      <p className="section-kicker">Account registration</p>
      <h2 className="type-h2 mt-2">Create an account</h2>
      <p className="mt-2 text-sm text-muted">
        Registration safely starts as a student account. Researcher access is
        available through an administrator-reviewed request after sign-in.
      </p>
      <div className="mt-6">
        <RoleAccessInfo signup />
      </div>
      <div className="mt-6">
        {isSupabaseConfigured() ? (
          <SignUpForm redirectTo={redirectTo} />
        ) : (
          <FormMessage tone="info">
            Account creation is being configured. Public research is still
            available.
          </FormMessage>
        )}
      </div>
      <div className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-sm">
        <p>
          Already have an account?{" "}
          <Link
            href={
              redirectTo
                ? authHref("/auth/sign-in", redirectTo)
                : "/auth/sign-in"
            }
            className="text-link"
          >
            Sign in
          </Link>
        </p>
        <Link href="/research" className="text-link inline-block">
          Browse public research without an account →
        </Link>
      </div>
    </AuthShell>
  );
}
