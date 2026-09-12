import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui";
import { SignInForm } from "@/features/auth/sign-in-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";
export default function SignInPage() {
  return (
    <>
      <PageHeader
        eyebrow="Research community"
        title="Welcome back"
        description="Sign in to submit research or review institutional publications."
      />
      <Card className="max-w-lg">
        {isSupabaseConfigured() ? (
          <SignInForm />
        ) : (
          <p role="status">
            Sign in is being configured. The project team needs to connect
            Supabase before accounts are available.
          </p>
        )}
        <p className="mt-6 text-sm text-slate-600">
          Accounts are provisioned by the project administrator during the
          hackathon. Research discovery is open to everyone.
        </p>
        <Link href="/research" className="text-link mt-4 inline-block">
          Browse public research →
        </Link>
      </Card>
    </>
  );
}
