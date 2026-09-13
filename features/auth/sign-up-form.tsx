"use client";

import { useActionState } from "react";
import { signUp } from "./actions";
import {
  Button,
  FieldError,
  FieldHelp,
  FormMessage,
  Input,
} from "@/components/ui";
import { PasswordField } from "@/components/ui/password-field";

export function SignUpForm({ redirectTo }: { redirectTo?: string }) {
  const [state, action, pending] = useActionState(signUp, {});

  if (state.success) {
    return (
      <FormMessage tone="success" title="Check your email">
        {state.success}
      </FormMessage>
    );
  }

  return (
    <form action={action} className="space-y-5" noValidate>
      {redirectTo && (
        <input type="hidden" name="redirectTo" value={redirectTo} />
      )}
      <fieldset>
        <legend>I want to join as</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <label className="flex cursor-pointer gap-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white p-3">
            <input
              type="radio"
              name="intent"
              value="student"
              defaultChecked
              className="mt-1"
            />
            <span>
              <span className="block font-semibold">Student</span>
              <span className="mt-1 block text-xs text-muted">
                Save interests and participate with student access.
              </span>
            </span>
          </label>
          <label className="flex cursor-pointer gap-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white p-3">
            <input
              type="radio"
              name="intent"
              value="researcher"
              className="mt-1"
            />
            <span>
              <span className="block font-semibold">Researcher</span>
              <span className="mt-1 block text-xs text-muted">
                Start as a student, then request administrator approval.
              </span>
            </span>
          </label>
        </div>
      </fieldset>
      <div>
        <label htmlFor="signup-email">Email</label>
        <Input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          autoFocus
          aria-describedby={
            state.fieldErrors?.email ? "signup-email-error" : undefined
          }
          aria-invalid={Boolean(state.fieldErrors?.email)}
        />
        {state.fieldErrors?.email && (
          <FieldError id="signup-email-error">
            {state.fieldErrors.email[0]}
          </FieldError>
        )}
      </div>
      <div>
        <label htmlFor="new-password">Password</label>
        <PasswordField
          id="new-password"
          name="password"
          autoComplete="new-password"
          minLength={8}
          required
          aria-describedby="password-guidance signup-password-error"
          aria-invalid={Boolean(state.fieldErrors?.password)}
        />
        <FieldHelp id="password-guidance">Use at least 8 characters.</FieldHelp>
        {state.fieldErrors?.password && (
          <FieldError id="signup-password-error">
            {state.fieldErrors.password[0]}
          </FieldError>
        )}
      </div>
      <div>
        <label htmlFor="confirm-password">Confirm password</label>
        <PasswordField
          id="confirm-password"
          name="confirmPassword"
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
          <FieldError id="confirm-password-error">
            {state.fieldErrors.confirmPassword[0]}
          </FieldError>
        )}
      </div>
      {state.error && (
        <FormMessage tone="error" title="Account was not created">
          {state.error}
        </FormMessage>
      )}
      <Button className="w-full" disabled={pending} aria-disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
