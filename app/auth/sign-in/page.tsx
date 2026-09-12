import Link from "next/link";
import { LogIn } from "lucide-react";
import { AuthShell } from "@/components/navigation/auth-shell";
import { SignInForm } from "@/features/auth/sign-in-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <AuthShell
      eyebrow="Research community"
      title="Welcome back"
      description="Sign in when you are ready to submit research, participate in projects or review institutional publications."
      icon={<LogIn aria-hidden="true" />}
    >
      {isSupabaseConfigured() ? (
        <SignInForm />
      ) : (
        <p role="status" className="alert alert-info">
          Sign in is being configured. The project team needs to connect
          Supabase before accounts are available.
        </p>
      )}
      <div className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-sm">
        <p>
          New student?{" "}
          <Link href="/auth/sign-up" className="text-link">
            Create an account
          </Link>
        </p>
        <Link href="/research" className="text-link inline-block">
          Browse public research without signing in →
        </Link>
      </div>
    </AuthShell>
  );
}
