import assert from "node:assert/strict";
import { test } from "node:test";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../lib/supabase/database.types.ts";
import {
  findPublishedPublication,
  findAreaConnections,
} from "../features/research/public-records.ts";
import {
  directorySearchSchema,
  projectSearchSchema,
} from "../features/research/filters.ts";

type Row = Record<string, unknown>;
// In-memory transport deliberately has no RLS: public query guards must stand alone.
function clientFor(tables: Record<string, Row[]>, failingTable = "") {
  return createClient<Database>(
    "https://example.supabase.co",
    "test-publishable-key",
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: async (input) => {
          const url = new URL(String(input));
          const table = url.pathname.split("/").at(-1)!;
          if (table === failingTable)
            return new Response(JSON.stringify({ message: "test failure" }), {
              status: 500,
            });
          let rows = tables[table] || [];
          for (const [key, value] of url.searchParams) {
            if (value.startsWith("eq."))
              rows = rows.filter((row) => String(row[key]) === value.slice(3));
            if (value.startsWith("in.("))
              rows = rows.filter((row) =>
                value.slice(4, -1).split(",").includes(String(row[key])),
              );
          }
          return new Response(JSON.stringify(rows), {
            headers: { "Content-Type": "application/json" },
          });
        },
      },
    },
  );
}

test("public detail excludes every private workflow state even without RLS", async () => {
  for (const status of [
    "draft",
    "submitted",
    "under_review",
    "changes_requested",
    "rejected",
  ]) {
    const client = clientFor({
      publications: [{ id: "private", slug: "paper", status }],
    });
    assert.equal(await findPublishedPublication(client, "paper"), null);
  }
  const client = clientFor({
    publications: [{ id: "public", slug: "paper", status: "published" }],
  });
  assert.equal((await findPublishedPublication(client, "paper"))?.id, "public");
  assert.equal(await findPublishedPublication(client, "missing"), null);
});

test("area connections include actual linked records and only published outputs", async () => {
  const client = clientFor({
    research_areas: [{ id: "area", slug: "demo-area", is_demo: true }],
    researcher_research_areas: [
      { research_area_id: "area", researcher_id: "person" },
    ],
    project_research_areas: [
      { research_area_id: "area", project_id: "project" },
    ],
    researchers: [{ id: "person" }, { id: "unrelated" }],
    projects: [{ id: "project" }],
    publication_projects: [
      { project_id: "project", publication_id: "paper" },
      { project_id: "project", publication_id: "private" },
    ],
    publications: [
      { id: "paper", status: "published" },
      { id: "private", status: "draft" },
    ],
  });
  const result = await findAreaConnections(client, "demo-area");
  assert.deepEqual(
    result?.researchers.map((row) => row.id),
    ["person"],
  );
  assert.deepEqual(
    result?.projects.map((row) => row.id),
    ["project"],
  );
  assert.deepEqual(
    result?.publications.map((row) => row.id),
    ["paper"],
  );
  assert.equal(await findAreaConnections(client, "missing"), null);
});

test("area query failures are not silently shown as empty directories", async () => {
  const client = clientFor(
    { research_areas: [{ id: "area", slug: "demo-area" }] },
    "project_research_areas",
  );
  await assert.rejects(findAreaConnections(client, "demo-area"), /connections/);
});

test("directory filters normalize malformed and excessive public input", () => {
  assert.deepEqual(directorySearchSchema.parse({ q: ["one", "two"] }), {
    q: "",
  });
  assert.equal(
    directorySearchSchema.parse({ q: "x".repeat(101) }).q.length,
    100,
  );
  assert.deepEqual(
    projectSearchSchema.parse({ q: "  demo  ", status: "invalid" }),
    { q: "demo", status: "all" },
  );
  assert.equal(
    projectSearchSchema.parse({ status: "completed" }).status,
    "completed",
  );
});
