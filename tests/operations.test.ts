import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CHANGES_REQUESTED_STALE_DAYS,
  PROJECT_STALE_DAYS,
  REVIEW_STALE_DAYS,
} from "../features/operations/constants.ts";
import {
  buildAttentionItems,
  type AttentionInput,
} from "../features/operations/rules.ts";

const now = new Date("2026-09-12T12:00:00.000Z");
const ago = (days: number) =>
  new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

function input(overrides: Partial<AttentionInput> = {}): AttentionInput {
  return {
    publications: [],
    projects: [],
    ...overrides,
  };
}

test("review attention begins at the configured stale boundary", () => {
  const publications: AttentionInput["publications"] = [
    {
      id: "before",
      title: "Before threshold",
      status: "submitted",
      updated_at: ago(REVIEW_STALE_DAYS - 0.01),
    },
    {
      id: "boundary",
      title: "At threshold",
      status: "under_review",
      updated_at: ago(REVIEW_STALE_DAYS),
    },
    {
      id: "after",
      title: "After threshold",
      status: "submitted",
      updated_at: ago(REVIEW_STALE_DAYS + 1),
    },
  ];

  const items = buildAttentionItems(input({ publications }), now);
  assert.deepEqual(
    items.map((item) => item.entityId),
    ["after", "boundary"],
  );
  assert.ok(items.every((item) => item.type === "stale_review"));
  assert.ok(items.every((item) => item.severity === "high"));
});

test("wrong publication statuses do not produce attention items", () => {
  const statuses = ["draft", "published", "rejected"] as const;
  const publications: AttentionInput["publications"] = statuses.map(
    (status, index) => ({
      id: `publication-${index}`,
      title: `Publication ${index}`,
      status,
      updated_at: ago(REVIEW_STALE_DAYS + 30),
    }),
  );

  assert.deepEqual(buildAttentionItems(input({ publications }), now), []);
});

test("inactive changes and ongoing projects use normalized deterministic results", () => {
  const result = buildAttentionItems(
    input({
      publications: [
        {
          id: "changes-old",
          title: "Changes requested",
          status: "changes_requested",
          updated_at: ago(CHANGES_REQUESTED_STALE_DAYS + 1),
        },
        {
          id: "changes-fresh",
          title: "Fresh changes request",
          status: "changes_requested",
          updated_at: ago(CHANGES_REQUESTED_STALE_DAYS - 1),
        },
      ],
      projects: [
        {
          id: "project-old",
          title: "Ongoing project",
          slug: "ongoing-project",
          status: "ongoing",
          updated_at: ago(PROJECT_STALE_DAYS + 1),
        },
        {
          id: "project-fresh",
          title: "Fresh ongoing project",
          slug: "fresh-ongoing-project",
          status: "ongoing",
          updated_at: ago(PROJECT_STALE_DAYS - 1),
        },
        {
          id: "project-complete",
          title: "Completed project",
          slug: "completed-project",
          status: "completed",
          updated_at: ago(PROJECT_STALE_DAYS + 30),
        },
      ],
    }),
    now,
  );

  assert.deepEqual(
    result.map(({ type, severity, entityType }) => ({
      type,
      severity,
      entityType,
    })),
    [
      {
        type: "changes_requested_inactive",
        severity: "medium",
        entityType: "publication",
      },
      {
        type: "stale_ongoing_project",
        severity: "low",
        entityType: "project",
      },
    ],
  );
  assert.equal(new Set(result.map((item) => item.key)).size, result.length);
  assert.equal(result[0].href, "/admin/submissions/changes-old");
  assert.equal(result[1].href, "/projects/ongoing-project");
});

test("duplicate source records produce one normalized attention item", () => {
  const publication = {
    id: "duplicate",
    title: "Duplicate source row",
    status: "submitted" as const,
    updated_at: ago(REVIEW_STALE_DAYS + 1),
  };
  const result = buildAttentionItems(
    input({ publications: [publication, publication] }),
    now,
  );

  assert.equal(result.length, 1);
  assert.equal(result[0].key, "stale_review:duplicate");
});
