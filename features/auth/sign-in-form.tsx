"use client";

import { useActionState } from "react";
import { signIn } from "./actions";
import { Button, FieldError, FormMessage, Input } from "@/components/ui";
import { PasswordField } from "@/components/ui/password-field";

export function SignInForm({ redirectTo }: { redirectTo?: string }) {
  const [state, action, pending] = useActionState(signIn, {});
  return (
    <form action={action} className="space-y-5" noValidate>
      {redirectTo && (
        <input type="hidden" name="redirectTo" value={redirectTo} />
      )}
      <div>
        <label htmlFor="email">Email</label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          autoFocus
          aria-describedby={
            state.fieldErrors?.email ? "email-error" : undefined
          }
          aria-invalid={Boolean(state.fieldErrors?.email)}
        />
        {state.fieldErrors?.email && (
          <FieldError id="email-error">{state.fieldErrors.email[0]}</FieldError>
        )}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <PasswordField
          id="password"
          name="password"
          autoComplete="current-password"
          required
          aria-describedby={
            state.fieldErrors?.password ? "password-error" : undefined
          }
          aria-invalid={Boolean(state.fieldErrors?.password)}
        />
        {state.fieldErrors?.password && (
          <FieldError id="password-error">
            {state.fieldErrors.password[0]}
          </FieldError>
        )}
      </div>
      {state.error && (
        <FormMessage tone="error" title="Sign in failed">
          {state.error}
        </FormMessage>
      )}
      <Button className="w-full" disabled={pending} aria-disabled={pending}>
        {pending ? "Signing in…" : "Sign in securely"}
      </Button>
    </form>
  );
}
