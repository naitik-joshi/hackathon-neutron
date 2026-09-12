import Link from "next/link";
import { UserRoundPlus } from "lucide-react";
import { SignUpForm } from "@/features/auth/sign-up-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AuthShell } from "@/components/navigation/auth-shell";

export const metadata = { title: "Create a student account" };

export default function SignUpPage() {
  return (
    <AuthShell
      eyebrow="Join the research community"
      title="Create your student account"
      description="Save a clear path into participation while keeping all published research open to everyone."
      icon={<UserRoundPlus aria-hidden="true" />}
    >
      {isSupabaseConfigured() ? (
        <SignUpForm />
      ) : (
        <p role="status" className="alert alert-info">
          Account creation is being configured. Public research is still
          available.
        </p>
      )}
      <div className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-sm">
        <p>
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-link">
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
