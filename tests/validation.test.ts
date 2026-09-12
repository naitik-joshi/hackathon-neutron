import { test } from "node:test";
import assert from "node:assert/strict";
import {
  editPublicationSchema,
  publicationSchema,
} from "../lib/validation/publication.ts";
const valid = {
  title: "Research title",
  abstract: "An abstract with enough detail for a useful review.",
  doi: "",
  year: "",
  is_demo: true,
};
test("optional DOI and year become null", () => {
  const data = publicationSchema.parse(valid);
  assert.equal(data.doi, null);
  assert.equal(data.year, null);
});
test("reject malformed DOI, invalid year and short abstract", () => {
  for (const patch of [
    { doi: "javascript:alert(1)" },
    { doi: "https://doi.org/10.1234/test" },
    { year: "abc" },
    { year: "2200" },
    { abstract: "tiny" },
    { title: "  " },
  ])
    assert.equal(
      publicationSchema.safeParse({ ...valid, ...patch }).success,
      false,
    );
});
test("accept DOI and year and trim text", () => {
  const data = publicationSchema.parse({
    ...valid,
    title: "  Research title  ",
    doi: "10.1234/example",
    year: "2026",
  });
  assert.equal(data.title, "Research title");
  assert.equal(data.year, 2026);
});

test("edit validation requires an id and does not accept workflow fields", () => {
  const parsed = editPublicationSchema.parse({
    ...valid,
    id: "b0000000-0000-4000-8000-000000000001",
    status: "published",
  });

  assert.equal(parsed.id, "b0000000-0000-4000-8000-000000000001");
  assert.equal("status" in parsed, false);
  assert.equal("is_demo" in parsed, false);
  assert.equal(
    editPublicationSchema.safeParse({ ...valid, id: "not-an-id" }).success,
    false,
  );
});
