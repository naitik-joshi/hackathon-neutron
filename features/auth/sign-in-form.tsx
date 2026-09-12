"use client";
import { useActionState } from "react";
import { signIn } from "./actions";
import { Button, Input } from "@/components/ui";
export function SignInForm() {
  const [state, action, pending] = useActionState(signIn, {});
  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="email">Email</label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-describedby={
            state.fieldErrors?.email ? "email-error" : undefined
          }
          aria-invalid={Boolean(state.fieldErrors?.email)}
        />
        {state.fieldErrors?.email && (
          <p id="email-error" className="field-error">
            {state.fieldErrors.email[0]}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-describedby={
            state.fieldErrors?.password ? "password-error" : undefined
          }
          aria-invalid={Boolean(state.fieldErrors?.password)}
        />
        {state.fieldErrors?.password && (
          <p id="password-error" className="field-error">
            {state.fieldErrors.password[0]}
          </p>
        )}
      </div>
      {state.error && (
        <p role="alert" className="alert alert-error">
          {state.error}
        </p>
      )}
      <Button className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
