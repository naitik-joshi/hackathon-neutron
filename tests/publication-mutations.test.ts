import { test } from "node:test";
import assert from "node:assert/strict";
import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Database,
  PublicationStatus,
} from "../lib/supabase/database.types.ts";
import { resubmitOwnedPublication } from "../features/publications/mutations.ts";

type TestPublication = {
  id: string;
  submitted_by: string;
  status: PublicationStatus;
  slug: string;
  title: string;
};

function publicationClient(record: TestPublication) {
  return {
    from(table: string) {
      assert.equal(table, "publications");
      return {
        update(changes: Partial<TestPublication>) {
          const equals = new Map<string, unknown>();
          let statuses: readonly string[] = [];
          const query = {
            eq(column: string, value: unknown) {
              equals.set(column, value);
              return query;
            },
            in(column: string, values: readonly string[]) {
              assert.equal(column, "status");
              statuses = values;
              return query;
            },
            select(columns: string) {
              assert.equal(columns, "slug");
              return query;
            },
            async maybeSingle() {
              const matches =
                record.id === equals.get("id") &&
                record.submitted_by === equals.get("submitted_by") &&
                statuses.includes(record.status);

              if (!matches) return { data: null, error: null };
              Object.assign(record, changes);
              return { data: { slug: record.slug }, error: null };
            },
          };
          return query;
        },
      };
    },
  } as unknown as SupabaseClient<Database>;
}

const input = {
  id: "b0000000-0000-4000-8000-000000000001",
  title: "Revised publication",
  abstract: "A revised abstract with enough detail for administrative review.",
  doi: null,
  year: 2026,
};

test("owner can resubmit a draft and the submitted record becomes locked", async () => {
  const record: TestPublication = {
    id: input.id,
    submitted_by: "owner",
    status: "draft",
    slug: "draft-publication",
    title: "Draft publication",
  };
  const client = publicationClient(record);

  const first = await resubmitOwnedPublication(client, "owner", input);
  assert.equal(first.data?.slug, record.slug);
  assert.equal(record.title, input.title);
  assert.equal(record.status, "submitted");

  const second = await resubmitOwnedPublication(client, "owner", {
    ...input,
    title: "Unauthorized second edit",
  });
  assert.equal(second.data, null);
  assert.equal(record.title, input.title);
});

test("owner can resubmit changes requested", async () => {
  const record: TestPublication = {
    id: input.id,
    submitted_by: "owner",
    status: "changes_requested",
    slug: "changes-requested-publication",
    title: "Original publication",
  };

  const result = await resubmitOwnedPublication(
    publicationClient(record),
    "owner",
    input,
  );

  assert.equal(result.data?.slug, record.slug);
  assert.equal(record.status, "submitted");
});

test("wrong owner and non-editable states cannot be changed", async () => {
  for (const attempt of [
    { owner: "other", status: "draft" as const },
    { owner: "owner", status: "submitted" as const },
    { owner: "owner", status: "under_review" as const },
    { owner: "owner", status: "published" as const },
    { owner: "owner", status: "rejected" as const },
  ]) {
    const record: TestPublication = {
      id: input.id,
      submitted_by: "owner",
      status: attempt.status,
      slug: "locked-publication",
      title: "Original publication",
    };

    const result = await resubmitOwnedPublication(
      publicationClient(record),
      attempt.owner,
      input,
    );

    assert.equal(result.data, null);
    assert.equal(record.title, "Original publication");
    assert.equal(record.status, attempt.status);
  }
});
