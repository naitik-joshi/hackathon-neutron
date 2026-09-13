import test from "node:test";
import assert from "node:assert/strict";
import {
  publishedOnly,
  rankSearchDocuments,
} from "../features/research/search-ranking.ts";

test("connected search ranks exact titles before contextual matches", () => {
  const results = rankSearchDocuments(
    [
      { item: "project", primary: "Digital Trust", secondary: ["Payments"] },
      {
        item: "paper",
        primary: "Payments study",
        connections: ["Digital Trust"],
      },
    ],
    "digital trust",
  );
  assert.deepEqual(
    results.map(({ item }) => item),
    ["project", "paper"],
  );
});

test("connected search matches every query token across public connections", () => {
  const results = rankSearchDocuments(
    [
      {
        item: "match",
        primary: "Fraud detection",
        connections: ["Nepal finance"],
      },
      {
        item: "partial",
        primary: "Fraud detection",
        connections: ["Global finance"],
      },
    ],
    "fraud Nepal",
  );
  assert.deepEqual(
    results.map(({ item }) => item),
    ["match"],
  );
});

test("connected search bounds results and treats an empty query as no search", () => {
  const documents = Array.from({ length: 12 }, (_, index) => ({
    item: index,
    primary: `Artificial intelligence ${index}`,
  }));
  assert.equal(rankSearchDocuments(documents, "artificial", 5).length, 5);
  assert.deepEqual(rankSearchDocuments(documents, "  "), []);
});

test("public search drops unpublished publication candidates", () => {
  const records = [
    { id: "public", status: "published", title: "Visible phrase" },
    { id: "private", status: "submitted", title: "Unique private phrase" },
  ];
  assert.deepEqual(
    publishedOnly(records).map(({ id }) => id),
    ["public"],
  );
});
