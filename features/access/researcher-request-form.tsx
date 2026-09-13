"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";
import { Button, FormMessage, Input, Textarea } from "@/components/ui";
import { requestResearcherAccess } from "./actions";

export function ResearcherRequestForm({
  initialName,
}: {
  initialName?: string;
}) {
  const [state, action, pending] = useActionState(requestResearcherAccess, {});

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="researcher-full-name">Full name</label>
          <Input
            id="researcher-full-name"
            name="full_name"
            defaultValue={initialName}
            required
            minLength={2}
            maxLength={160}
          />
        </div>
        <div>
          <label htmlFor="researcher-email">Contact email</label>
          <Input
            id="researcher-email"
            name="contact_email"
            type="email"
            required
            maxLength={254}
          />
        </div>
        <div>
          <label htmlFor="researcher-position">Position</label>
          <Input
            id="researcher-position"
            name="position"
            required
            minLength={2}
            maxLength={160}
            placeholder="Lecturer, faculty researcher, research assistant…"
          />
        </div>
        <div>
          <label htmlFor="researcher-affiliation">Affiliation</label>
          <Input
            id="researcher-affiliation"
            name="affiliation"
            required
            minLength={2}
            maxLength={240}
            placeholder="Department or institution"
          />
        </div>
      </div>
      <div>
        <label htmlFor="researcher-reason">
          Why do you need researcher access?
        </label>
        <Textarea
          id="researcher-reason"
          name="reason"
          required
          minLength={20}
          maxLength={2000}
          placeholder="Describe your research work and why you need submission access."
        />
      </div>
      {state.error && <FormMessage tone="error">{state.error}</FormMessage>}
      {state.success && (
        <FormMessage tone="success">{state.success}</FormMessage>
      )}
      <Button disabled={pending}>
        <Send aria-hidden="true" size={16} />
        {pending ? "Sending request…" : "Request researcher access"}
      </Button>
    </form>
  );
}
