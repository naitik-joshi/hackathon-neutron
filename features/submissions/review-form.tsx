"use client";
import { useActionState } from "react";
import { reviewPublication } from "./actions";
import { Button } from "@/components/ui";
import type { PublicationStatus } from "@/lib/supabase/database.types";
export function ReviewForm({ id, status }: { id: string; status: PublicationStatus }) {
 const [state, action, pending] = useActionState(reviewPublication, {});
 return <form action={action} className="mt-6 space-y-4"><input type="hidden" name="id" value={id} />{status === "submitted" && <Button name="decision" value="under_review" disabled={pending}>Start review</Button>}{status === "under_review" && <><p>Approve only after checking the title, abstract, attribution and any demo label. Publishing makes this record visible to everyone.</p><div className="flex flex-wrap gap-3"><Button name="decision" value="published" disabled={pending}>Approve and publish</Button><Button name="decision" value="changes_requested" disabled={pending} className="bg-slate-700 hover:bg-slate-800">Request changes</Button><Button name="decision" value="rejected" disabled={pending} className="bg-red-700 hover:bg-red-800">Reject</Button></div></>}{pending && <p role="status">Saving review decision…</p>}{state.error && <p role="alert" className="text-red-700">{state.error}</p>}</form>;
}
