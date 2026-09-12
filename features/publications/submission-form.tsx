"use client";
import { useActionState } from "react";
import { submitPublication } from "./actions";
import { Button, Input, Textarea } from "@/components/ui";
export function SubmissionForm() {
  const [state, action, pending] = useActionState(submitPublication, {});
  return (
    <form action={action} className="max-w-2xl space-y-6">
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
            Enter the identifier, without https://doi.org/.
          </p>
        </div>
        <div>
          <label htmlFor="year">Year (optional)</label>
          <Input name="year" id="year" type="number" min={1900} max={2100} />
        </div>
      </div>
      <label className="flex items-start gap-3">
        <input name="is_demo" type="checkbox" className="mt-1" />
        This is fictional demonstration content. Display DEMO DATA.
      </label>
      <p className="text-sm text-slate-600">
        Submitting sends your publication for administrative review. It will be
        public only after an administrator approves and publishes it.
      </p>
      {state.error && (
        <p role="alert" className="text-red-700">
          {state.error}
        </p>
      )}
      <Button disabled={pending}>
        {pending ? "Submitting…" : "Submit for review"}
      </Button>
    </form>
  );
}
