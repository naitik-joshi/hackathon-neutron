"use client";

import { useActionState } from "react";
import { signUp } from "./actions";
import { Button, Input } from "@/components/ui";

export function SignUpForm() {
  const [state, action, pending] = useActionState(signUp, {});

  if (state.success) {
    return (
      <div role="status" className="alert alert-success">
        <p className="font-semibold">Your student account has been created.</p>
        <p className="mt-1 text-sm">{state.success}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="email">College email</label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-describedby={
            state.fieldErrors?.email ? "signup-email-error" : undefined
          }
          aria-invalid={Boolean(state.fieldErrors?.email)}
        />
        {state.fieldErrors?.email && (
          <p id="signup-email-error" className="field-error">
            {state.fieldErrors.email[0]}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="new-password">Password</label>
        <Input
          id="new-password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          aria-describedby="password-guidance signup-password-error"
          aria-invalid={Boolean(state.fieldErrors?.password)}
        />
        <p id="password-guidance" className="field-help">
          Use at least 8 characters.
        </p>
        {state.fieldErrors?.password && (
          <p id="signup-password-error" className="field-error">
            {state.fieldErrors.password[0]}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="confirm-password">Confirm password</label>
        <Input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          aria-describedby={
            state.fieldErrors?.confirmPassword
              ? "confirm-password-error"
              : undefined
          }
          aria-invalid={Boolean(state.fieldErrors?.confirmPassword)}
        />
        {state.fieldErrors?.confirmPassword && (
          <p id="confirm-password-error" className="field-error">
            {state.fieldErrors.confirmPassword[0]}
          </p>
        )}
      </div>
      {state.error && (
        <p role="alert" className="alert alert-error">
          {state.error}
        </p>
      )}
      <Button className="w-full" disabled={pending}>
        {pending ? "Creating account…" : "Create student account"}
      </Button>
      <p className="text-xs text-slate-500">
        Registration creates a student account only. Researcher and admin access
        is provisioned by the institution.
      </p>
    </form>
  );
}
