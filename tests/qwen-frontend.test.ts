import assert from "node:assert/strict";
import test from "node:test";
import { validateQwenConfig } from "../lib/qwen/config.ts";
import { QwenClientError, safeQwenError } from "../lib/qwen/errors.ts";
import {
  compareRequestSchema,
  queryRequestSchema,
  recommendRequestSchema,
} from "../lib/qwen/schemas.ts";
import {
  clearRateLimitsForTests,
  takeRateLimit,
} from "../lib/qwen/rate-limit.ts";
import { parseJson } from "../lib/qwen/route.ts";
import { matchPaperByTitle } from "../lib/qwen/context.ts";
import {
  assistantAvailabilityLabel,
  getAssistantAvailability,
} from "../lib/qwen/availability.ts";
import { parsePapersResponse } from "../lib/qwen/papers.ts";

test("Qwen configuration is validated and URL is normalized", () => {
  const config = validateQwenConfig(
    " https://grounded.example.test/ ",
    "x".repeat(32),
  );
  assert.equal(config.baseUrl, "https://grounded.example.test");
  assert.throws(
    () => validateQwenConfig("javascript:alert(1)", "x".repeat(32)),
    QwenClientError,
  );
  assert.throws(
    () => validateQwenConfig("https://example.test", "short"),
    QwenClientError,
  );
});

test("Qwen request schemas reject extra, oversized and unsafe requests", () => {
  assert.equal(
    queryRequestSchema.safeParse({
      paper_name: "paper.pdf",
      question: "What is the result?",
    }).success,
    true,
  );
  assert.equal(
    queryRequestSchema.safeParse({
      paper_name: "paper.pdf",
      question: "ok?",
      api_key: "must-not-pass",
    }).success,
    false,
  );
  assert.equal(
    recommendRequestSchema.safeParse({ current_paper: "x".repeat(256) })
      .success,
    false,
  );
  assert.equal(
    compareRequestSchema.safeParse({
      paper_1: "same.pdf",
      paper_2: "same.pdf",
      question: "How do these differ?",
    }).success,
    false,
  );
});

test("Qwen route parser rejects invalid and oversized JSON", async () => {
  await assert.rejects(
    () =>
      parseJson(
        new Request("http://localhost/query", {
          method: "POST",
          body: "not-json",
        }),
        queryRequestSchema,
      ),
    (error: unknown) =>
      error instanceof QwenClientError && error.code === "INVALID_JSON",
  );
  await assert.rejects(
    () =>
      parseJson(
        new Request("http://localhost/query", {
          method: "POST",
          headers: { "content-length": String(33 * 1024) },
          body: "{}",
        }),
        queryRequestSchema,
      ),
    (error: unknown) =>
      error instanceof QwenClientError && error.code === "PAYLOAD_TOO_LARGE",
  );
});

test("Qwen rate limiter enforces a server-side request window", () => {
  clearRateLimitsForTests();
  assert.equal(takeRateLimit("query:test", 2, 1_000, 100).allowed, true);
  assert.equal(takeRateLimit("query:test", 2, 1_000, 101).allowed, true);
  assert.equal(takeRateLimit("query:test", 2, 1_000, 102).allowed, false);
  assert.equal(takeRateLimit("query:test", 2, 1_000, 1_101).allowed, true);
});

test("Qwen errors expose only the safe public contract", () => {
  const safe = safeQwenError(new Error("secret upstream stack and URL"));
  assert.deepEqual(safe, {
    status: "error",
    error: {
      code: "SERVICE_UNAVAILABLE",
      message: "The research assistant is temporarily unavailable.",
      retryable: true,
    },
  });
  assert.equal(JSON.stringify(safe).includes("secret"), false);
});

test("publication context selects only an exact normalized paper title", () => {
  const papers = [
    {
      filename: "paper.pdf",
      title: "Grounded Research: A Study",
      section_count: 1,
      sections: ["Abstract"],
    },
  ];
  assert.equal(
    matchPaperByTitle(papers, "  Grounded Research — A Study  ")?.filename,
    "paper.pdf",
  );
  assert.equal(
    matchPaperByTitle(papers, "DEMO DATA — Grounded Research: A Study")
      ?.filename,
    "paper.pdf",
  );
  assert.equal(matchPaperByTitle(papers, "Grounded Research"), undefined);
});

test("assistant availability never reports ready without a paper index", () => {
  const status = getAssistantAvailability({
    health: "healthy",
    loadingPapers: false,
    paperCount: 0,
    paperIndexFailed: true,
  });
  assert.equal(status, "paper-index-unavailable");
  assert.equal(assistantAvailabilityLabel[status], "Paper index unavailable");
  assert.equal(
    getAssistantAvailability({
      health: "degraded",
      loadingPapers: false,
      paperCount: 8,
      paperIndexFailed: false,
    }),
    "unavailable",
  );
});

test("paper responses are validated before reaching the assistant", () => {
  const valid = parsePapersResponse({
    status: "success",
    count: 1,
    papers: [
      {
        filename: "paper.pdf",
        title: "Grounded paper",
        section_count: 1,
        sections: ["Abstract"],
      },
    ],
  });
  assert.equal(valid.papers[0].filename, "paper.pdf");
  assert.throws(() =>
    parsePapersResponse({ status: "success", count: 2, papers: [] }),
  );
});
