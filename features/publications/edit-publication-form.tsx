"use client";

import { useActionState } from "react";
import { resubmitPublication } from "./actions";
import { Button, Input, Textarea } from "@/components/ui";
import type { Publication } from "@/lib/supabase/database.types";

export function EditPublicationForm({
  publication,
}: {
  publication: Publication;
}) {
  const [state, action, pending] = useActionState(resubmitPublication, {});

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="id" value={publication.id} />
      <div>
        <label htmlFor="edit-title">Title *</label>
        <Input
          id="edit-title"
          name="title"
          defaultValue={publication.title}
          required
          minLength={3}
          maxLength={240}
        />
      </div>
      <div>
        <label htmlFor="edit-abstract">Abstract *</label>
        <Textarea
          id="edit-abstract"
          name="abstract"
          defaultValue={publication.abstract}
          required
          minLength={20}
          maxLength={12000}
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="edit-doi">DOI (optional)</label>
          <Input
            id="edit-doi"
            name="doi"
            defaultValue={publication.doi ?? ""}
            maxLength={200}
            placeholder="10.1234/example"
          />
        </div>
        <div>
          <label htmlFor="edit-year">Year (optional)</label>
          <Input
            id="edit-year"
            name="year"
            type="number"
            min={1900}
            max={2100}
            defaultValue={publication.year ?? ""}
          />
        </div>
      </div>
      <p className="text-sm text-slate-600">
        Resubmitting sends this version back to the review queue and locks
        editing while administrators review it.
      </p>
      {state.error && (
        <p role="alert" className="alert alert-error">
          {state.error}
        </p>
      )}
      <Button disabled={pending}>
        {pending ? "Resubmitting…" : "Save and resubmit"}
      </Button>
    </form>
  );
}
