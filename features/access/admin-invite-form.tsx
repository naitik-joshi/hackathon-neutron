"use client";

import { useActionState } from "react";
import { Button, FormMessage, Input, Select } from "@/components/ui";
import { inviteAdministrator } from "./actions";

export function AdminInviteForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(inviteAdministrator, {});
  return (
    <form action={action} className="workspace-panel space-y-4 p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="administrator-email">Email</label>
          <Input
            id="administrator-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
          />
        </div>
        <div>
          <label htmlFor="administrator-name">Display name (optional)</label>
          <Input
            id="administrator-name"
            name="display_name"
            autoComplete="name"
            maxLength={160}
          />
        </div>
      </div>
      <div>
        <label htmlFor="administrator-mode">Action</label>
        <Select id="administrator-mode" name="mode" defaultValue="invite">
          <option value="invite">Invite new administrator</option>
          <option value="promote">Promote existing account</option>
        </Select>
      </div>
      <label className="flex min-h-11 items-start gap-3 text-sm">
        <input name="confirmed" type="checkbox" className="mt-1" />
        <span>
          I confirm that an existing account may be changed to administrator.
          This is required only when promoting an existing user.
        </span>
      </label>
      {!configured && (
        <FormMessage tone="warning">
          New administrator invitations require server-only Supabase Admin
          configuration. Existing account roles remain manageable below.
        </FormMessage>
      )}
      {state.error && <FormMessage tone="error">{state.error}</FormMessage>}
      {state.success && (
        <FormMessage tone="success">{state.success}</FormMessage>
      )}
      <Button
        disabled={pending || !configured}
        aria-disabled={pending || !configured}
      >
        {pending ? "Saving…" : "Continue"}
      </Button>
    </form>
  );
}
