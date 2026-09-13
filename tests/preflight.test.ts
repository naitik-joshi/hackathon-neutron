import assert from "node:assert/strict";
import test from "node:test";
import { checkCitationReadiness } from "../features/preflight/citations.ts";
import { toPublishedCandidates } from "../features/preflight/records.ts";
import { findRelatedWork } from "../features/preflight/similarity.ts";
import { normalizeText, tokenize } from "../features/preflight/text.ts";
import {
  extractKeywords,
  suggestResearchAreas,
} from "../features/preflight/topics.ts";
import type {
  PreflightPublicationCandidate,
  PreflightResearchArea,
} from "../features/preflight/types.ts";

const candidates: PreflightPublicationCandidate[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    slug: "accessible-learning",
    title: "Artificial intelligence for accessible learning",
    abstract:
      "Machine learning supports accessible education through adaptive learning tools.",
    year: 2025,
    isDemo: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    slug: "renewable-grid",
    title: "Renewable energy grid planning",
    abstract: "Solar energy forecasting supports resilient electricity grids.",
    year: 2024,
    isDemo: true,
  },
];

const areas: PreflightResearchArea[] = [
  {
    id: "00000000-0000-4000-8000-000000000010",
    name: "Artificial Intelligence",
    slug: "artificial-intelligence",
    description: "Machine learning and intelligent digital systems.",
    isDemo: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000011",
    name: "Renewable Energy",
    slug: "renewable-energy",
    description: "Sustainable generation and energy infrastructure.",
    isDemo: true,
  },
];

test("text normalization is lowercase, Unicode-aware and whitespace stable", () => {
  assert.equal(
    normalizeText("  CAFÉ—कम्प्युटर!!  Systems  "),
    "café कम्प्युटर systems",
  );
  assert.deepEqual(tokenize("The AI, and adaptive-learning study."), [
    "ai",
    "adaptive",
    "learning",
    "study",
  ]);
  assert.deepEqual(tokenize(""), []);
});

test("related work ranks lexical overlap deterministically and excludes itself", () => {
  const result = findRelatedWork(
    "AI for accessible learning",
    "Adaptive machine learning tools support accessible education.",
    candidates,
  );
  assert.equal(result[0]?.id, candidates[0].id);
  assert.ok((result[0]?.overlapPercent ?? 0) > 0);
  assert.ok(result[0]?.sharedTerms.includes("accessible learning"));
  assert.deepEqual(
    findRelatedWork(
      "AI for accessible learning",
      "Adaptive machine learning tools support accessible education.",
      candidates,
      candidates[0].id,
    ),
    [],
  );
});

test("related work handles empty vectors and equal scores without NaN", () => {
  const tied = findRelatedWork("shared topic", "shared topic context", [
    { ...candidates[0], id: "b", title: "Shared topic", abstract: "Context" },
    { ...candidates[0], id: "a", title: "Shared topic", abstract: "Context" },
  ]);
  assert.deepEqual(
    tied.map((item) => item.id),
    ["a", "b"],
  );
  assert.deepEqual(findRelatedWork("the and", "of to in and", candidates), []);
  assert.ok(tied.every((item) => Number.isFinite(item.overlapPercent)));
});

test("publication candidate mapping excludes every unpublished workflow state", () => {
  const base = {
    id: crypto.randomUUID(),
    slug: "record",
    title: "Record",
    abstract: "A sufficiently descriptive abstract for a publication record.",
    year: 2026,
    is_demo: false,
  };
  const rows = [
    { ...base, id: crypto.randomUUID(), status: "draft" as const },
    { ...base, id: crypto.randomUUID(), status: "submitted" as const },
    { ...base, id: crypto.randomUUID(), status: "under_review" as const },
    { ...base, id: crypto.randomUUID(), status: "changes_requested" as const },
    { ...base, id: crypto.randomUUID(), status: "rejected" as const },
    { ...base, id: crypto.randomUUID(), status: "published" as const },
  ];
  assert.deepEqual(
    toPublishedCandidates(rows).map((item) => item.id),
    [rows[5].id],
  );
});

test("topic suggestions reward area-name title matches and omit weak areas", () => {
  const suggestions = suggestResearchAreas(
    "Artificial intelligence for teaching",
    "Machine learning can support adaptive classroom tools.",
    areas,
  );
  assert.equal(suggestions[0]?.slug, "artificial-intelligence");
  assert.equal(
    suggestions.some((item) => item.slug === "renewable-energy"),
    false,
  );
  assert.deepEqual(
    suggestions,
    suggestResearchAreas(
      "Artificial intelligence for teaching",
      "Machine learning can support adaptive classroom tools.",
      areas,
    ),
  );
});

test("keyword extraction is deterministic and omits generic research filler", () => {
  const keywords = extractKeywords(
    "Adaptive machine learning",
    "This study presents research analysis of adaptive learning systems and machine learning.",
  );
  assert.deepEqual(
    keywords,
    extractKeywords(
      "Adaptive machine learning",
      "This study presents research analysis of adaptive learning systems and machine learning.",
    ),
  );
  assert.equal(keywords.includes("study"), false);
  assert.equal(keywords.includes("research"), false);
  assert.equal(
    extractKeywords(
      "DEMO DATA — Adaptive learning",
      "DEMO DATA — Learning tools",
    ).includes("demo"),
    false,
  );
  assert.ok(keywords.includes("adaptive machine"));
});

test("citation readiness handles blank and complete references", () => {
  assert.equal(checkCitationReadiness("\n  \n").status, "no-references");
  const result = checkCitationReadiness(
    "Sharma, A. (2024). Adaptive Learning Systems. Journal of Education. https://example.org/article 10.1234/adaptive.2024",
  );
  assert.equal(result.referenceCount, 1);
  assert.equal(result.withYearCount, 1);
  assert.equal(result.doiCount, 1);
  assert.equal(result.urlCount, 1);
  assert.equal(result.malformedDoiCount, 0);
  assert.equal(result.malformedUrlCount, 0);
  assert.equal(result.status, "looks-complete");
});

test("citation readiness reports duplicates, missing years and incomplete lines", () => {
  const result = checkCitationReadiness(
    "A complete reference title by Author (2024).\n  a COMPLETE reference title by author (2024).  \n10.1234/only-doi\nShort",
  );
  assert.equal(result.referenceCount, 4);
  assert.equal(result.duplicateCount, 1);
  assert.ok(result.warnings.some((warning) => warning.code === "duplicate"));
  assert.ok(result.warnings.some((warning) => warning.code === "missing-year"));
  assert.ok(result.warnings.some((warning) => warning.code === "incomplete"));
});

test("citation readiness flags malformed DOI-like and URL-like values", () => {
  const result = checkCitationReadiness(
    "Author (2024). Example source. 10.bad/value\nAuthor (2023). Another source. https://",
  );
  assert.equal(result.malformedDoiCount, 1);
  assert.equal(result.malformedUrlCount, 1);
  assert.ok(
    result.warnings.some((warning) => warning.code === "malformed-doi"),
  );
  assert.ok(
    result.warnings.some((warning) => warning.code === "malformed-url"),
  );
});
