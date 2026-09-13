import Link from "next/link";
import { LogIn } from "lucide-react";
import { AuthShell } from "@/components/navigation/auth-shell";
import { SignInForm } from "@/features/auth/sign-in-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { RoleAccessInfo } from "@/features/auth/role-access-info";
import { authHref, safeRedirectTo } from "@/lib/auth/redirects";
import { FormMessage } from "@/components/ui";

export const metadata = { title: "Sign in" };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const redirectTo = safeRedirectTo((await searchParams).redirectTo);
  return (
    <AuthShell
      eyebrow="Secure research access"
      title="One account. The right workspace."
      description="Sign in to participate, submit research or manage the publication workflow. Public discovery remains open without an account."
      icon={<LogIn aria-hidden="true" />}
    >
      <p className="section-kicker">Account access</p>
      <h2 className="type-h2 mt-2">Sign in</h2>
      <p className="mt-2 text-sm text-muted">
        Enter the credentials associated with your Islington research community
        account.
      </p>
      <div className="mt-6">
        <RoleAccessInfo />
      </div>
      <div className="mt-6">
        {isSupabaseConfigured() ? (
          <SignInForm redirectTo={redirectTo} />
        ) : (
          <FormMessage tone="info">
            Sign in is being configured. The project team needs to connect
            Supabase before accounts are available.
          </FormMessage>
        )}
      </div>
      <div className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-sm">
        <p>
          New student?{" "}
          <Link
            href={
              redirectTo
                ? authHref("/auth/sign-up", redirectTo)
                : "/auth/sign-up"
            }
            className="text-link"
          >
            Create a student account
          </Link>
        </p>
        <Link href="/research" className="text-link inline-block">
          Browse public research without signing in →
        </Link>
      </div>
    </AuthShell>
  );
}
