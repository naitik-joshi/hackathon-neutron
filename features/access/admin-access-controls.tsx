"use client";

import { useActionState } from "react";
import { Button, FormMessage, Select, Textarea } from "@/components/ui";
import type { Role } from "@/lib/supabase/database.types";
import { reviewResearcherAccess, setProfileRole } from "./actions";

export function ResearcherRequestReview({ id }: { id: string }) {
  const [state, action, pending] = useActionState(reviewResearcherAccess, {});
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="id" value={id} />
      <div>
        <label htmlFor={`access-note-${id}`}>Review note (optional)</label>
        <Textarea
          id={`access-note-${id}`}
          name="note"
          className="min-h-24"
          maxLength={2000}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button name="decision" value="approved" disabled={pending}>
          Approve researcher
        </Button>
        <Button
          name="decision"
          value="rejected"
          variant="danger"
          disabled={pending}
        >
          Reject
        </Button>
      </div>
      {state.error && <FormMessage tone="error">{state.error}</FormMessage>}
      {state.success && (
        <FormMessage tone="success">{state.success}</FormMessage>
      )}
    </form>
  );
}

export function ProfileRoleControl({
  userId,
  role,
  disabled,
}: {
  userId: string;
  role: Role;
  disabled?: boolean;
}) {
  const [state, action, pending] = useActionState(setProfileRole, {});
  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="user_id" value={userId} />
      <div className="flex flex-wrap gap-2">
        <label htmlFor={`role-${userId}`} className="sr-only">
          Account role
        </label>
        <Select
          id={`role-${userId}`}
          name="role"
          defaultValue={role}
          disabled={disabled || pending}
          className="w-auto min-w-36"
        >
          <option value="student">Student</option>
          <option value="researcher">Researcher</option>
          <option value="admin">Admin</option>
        </Select>
        <Button variant="secondary" disabled={disabled || pending}>
          {pending ? "Saving…" : "Update role"}
        </Button>
      </div>
      {state.error && <FormMessage tone="error">{state.error}</FormMessage>}
      {state.success && (
        <FormMessage tone="success">{state.success}</FormMessage>
      )}
    </form>
  );
}
