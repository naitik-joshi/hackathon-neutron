import assert from "node:assert/strict";
import test from "node:test";
import {
  buildNeedsYourAction,
  getResearcherDisplayName,
  type ResearcherDashboardPublication,
} from "../features/researcher/dashboard.ts";

const ownerId = "00000000-0000-4000-8000-000000000001";
const otherId = "00000000-0000-4000-8000-000000000002";

function publication(
  overrides: Partial<ResearcherDashboardPublication> = {},
): ResearcherDashboardPublication {
  return {
    id: crypto.randomUUID(),
    title: "A real submission",
    slug: "a-real-submission",
    status: "submitted",
    submitted_by: ownerId,
    created_at: "2026-09-01T00:00:00.000Z",
    updated_at: "2026-09-01T00:00:00.000Z",
    is_demo: false,
    ...overrides,
  };
}

test("Needs Your Action includes only the researcher's changes requested", () => {
  const ownChange = publication({ status: "changes_requested" });
  const result = buildNeedsYourAction(
    [
      ownChange,
      publication({ status: "draft" }),
      publication({ status: "submitted" }),
      publication({ status: "under_review" }),
      publication({ status: "published" }),
      publication({ status: "rejected" }),
      publication({ status: "changes_requested", submitted_by: otherId }),
    ],
    ownerId,
  );

  assert.deepEqual(result, [ownChange]);
});

test("Needs Your Action has an intentional empty result", () => {
  assert.deepEqual(buildNeedsYourAction([], ownerId), []);
  assert.deepEqual(
    buildNeedsYourAction([publication({ status: "published" })], ownerId),
    [],
  );
});

test("researcher identity uses stored text or a neutral fallback", () => {
  assert.equal(getResearcherDisplayName("  Asha Sharma  "), "Asha Sharma");
  assert.equal(getResearcherDisplayName(""), "Researcher");
  assert.equal(getResearcherDisplayName("   "), "Researcher");
});
