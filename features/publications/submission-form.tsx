"use client";

import { useActionState } from "react";
import { submitPublication } from "./actions";
import { Button, Input, Textarea } from "@/components/ui";

export function SubmissionForm() {
  const [state, action, pending] = useActionState(submitPublication, {});

  return (
    <form action={action} className="space-y-6" aria-label="New publication">
      <div>
        <label htmlFor="title">Title *</label>
        <Input name="title" id="title" required minLength={3} maxLength={240} />
      </div>
      <div>
        <label htmlFor="abstract">Abstract *</label>
        <Textarea
          name="abstract"
          id="abstract"
          required
          minLength={20}
          maxLength={12000}
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="doi">DOI (optional)</label>
          <Input
            name="doi"
            id="doi"
            maxLength={200}
            placeholder="10.1234/example"
            aria-describedby="doi-help"
          />
          <p id="doi-help" className="mt-2 text-sm text-slate-600">
            Enter the identifier without https://doi.org/.
          </p>
        </div>
        <div>
          <label htmlFor="year">Year (optional)</label>
          <Input name="year" id="year" type="number" min={1900} max={2100} />
        </div>
      </div>
      <label className="flex items-start gap-3">
        <input name="is_demo" type="checkbox" className="mt-1" />
        <span>This is fictional demonstration content. Display DEMO DATA.</span>
      </label>
      <p className="text-sm leading-6 text-slate-600">
        Submitting sends this publication for administrative review. It becomes
        public only after an administrator publishes it.
      </p>
      {state.error && (
        <p
          role="alert"
          className="rounded border border-red-200 bg-red-50 p-3 text-red-800"
        >
          {state.error}
        </p>
      )}
      <Button disabled={pending} aria-disabled={pending}>
        {pending ? "Submitting…" : "Submit for review"}
      </Button>
    </form>
  );
}
