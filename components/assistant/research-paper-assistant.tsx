"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BookOpenText,
  GitCompareArrows,
  LoaderCircle,
  MessageSquareText,
  RefreshCw,
  Send,
  X,
} from "lucide-react";
import { Badge, Button, Input, Select, Textarea } from "@/components/ui";
import { OPEN_RESEARCH_ASSISTANT_EVENT } from "./analyze-publication-button";
import { matchPaperByTitle } from "@/lib/qwen/context";
import {
  assistantAvailabilityLabel,
  getAssistantAvailability,
} from "@/lib/qwen/availability";
import type {
  CompareResponse,
  PapersResponse,
  QwenErrorBody,
  QwenPaper,
  QueryResponse,
  Recommendation,
  RecommendResponse,
} from "@/lib/qwen/types";

type AssistantMessage = {
  id: number;
  role: "user" | "assistant";
  text: string;
  paper?: string;
  section?: string;
  hardNegative?: boolean;
};

class AssistantRequestError extends Error {
  constructor(
    message: string,
    readonly serviceUnavailable: boolean,
  ) {
    super(message);
  }
}

async function readJson<T>(response: Response): Promise<T> {
  const body = (await response.json()) as T | QwenErrorBody;
  if (!response.ok) {
    const error = (body as QwenErrorBody).error;
    throw new AssistantRequestError(
      error?.message || "The research assistant is unavailable.",
      response.status >= 500 ||
        error?.code === "SERVICE_UNAVAILABLE" ||
        error?.code === "MODEL_UNAVAILABLE",
    );
  }
  return body as T;
}

export function ResearchPaperAssistant() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const questionRef = useRef<HTMLInputElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const messageId = useRef(0);
  const lastSubmitAt = useRef(0);
  const pendingTitleRef = useRef<string | null>(null);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"ask" | "compare">("ask");
  const [papers, setPapers] = useState<QwenPaper[]>([]);
  const [selectedName, setSelectedName] = useState("");
  const [contextMatched, setContextMatched] = useState(false);
  const [question, setQuestion] = useState("");
  const [section, setSection] = useState("");
  const [comparePaper, setComparePaper] = useState("");
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null,
  );
  const [loadingPapers, setLoadingPapers] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paperError, setPaperError] = useState<string | null>(null);
  const [health, setHealth] = useState<"checking" | "healthy" | "degraded">(
    "checking",
  );

  const selectedPaper = useMemo(
    () => papers.find((paper) => paper.filename === selectedName),
    [papers, selectedName],
  );
  const availability = getAssistantAvailability({
    health,
    loadingPapers,
    paperCount: papers.length,
    paperIndexFailed: Boolean(paperError),
  });

  const loadAssistant = useCallback(async () => {
    setLoadingPapers(true);
    setError(null);
    setPaperError(null);
    const [papersResult, healthResult] = await Promise.allSettled([
      fetch("/api/research-assistant/papers", { cache: "no-store" }).then(
        (response) => readJson<PapersResponse>(response),
      ),
      fetch("/api/research-assistant/health", { cache: "no-store" }).then(
        (response) => readJson<{ status: "healthy" | "degraded" }>(response),
      ),
    ]);

    if (papersResult.status === "fulfilled") {
      setPapers(papersResult.value.papers);
      if (papersResult.value.papers.length === 0) {
        setPaperError("No indexed papers are available right now.");
      }
      if (pendingTitleRef.current) {
        const match = matchPaperByTitle(
          papersResult.value.papers,
          pendingTitleRef.current,
        );
        setSelectedName(match?.filename || "");
        setContextMatched(Boolean(match));
        pendingTitleRef.current = null;
      }
    } else {
      setPapers([]);
      setPaperError(
        papersResult.reason instanceof Error
          ? papersResult.reason.message
          : "The indexed paper list is unavailable.",
      );
    }
    setHealth(
      healthResult.status === "fulfilled" &&
        healthResult.value.status === "healthy"
        ? "healthy"
        : "degraded",
    );
    setLoadingPapers(false);
  }, []);

  const openAssistant = useCallback(
    (publicationTitle?: string) => {
      setOpen(true);
      setMode("ask");
      setError(null);
      if (publicationTitle) {
        pendingTitleRef.current = publicationTitle;
        if (papers.length > 0) {
          const match = matchPaperByTitle(papers, publicationTitle);
          setSelectedName(match?.filename || "");
          setRecommendation(null);
          setContextMatched(Boolean(match));
          pendingTitleRef.current = null;
        }
      }
      if (!dialogRef.current?.open) dialogRef.current?.showModal();
      if (papers.length === 0 && !loadingPapers) void loadAssistant();
    },
    [loadAssistant, loadingPapers, papers],
  );

  useEffect(() => {
    const listener = (event: Event) => {
      const title = (event as CustomEvent<{ publicationTitle?: string }>).detail
        ?.publicationTitle;
      openAssistant(title);
    };
    window.addEventListener(OPEN_RESEARCH_ASSISTANT_EVENT, listener);
    return () =>
      window.removeEventListener(OPEN_RESEARCH_ASSISTANT_EVENT, listener);
  }, [openAssistant]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => questionRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [open, selectedName]);

  useEffect(() => {
    transcriptRef.current?.scrollTo({
      top: transcriptRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, pending]);

  useEffect(() => {
    if (!selectedName) return;
    const controller = new AbortController();
    fetch("/api/research-assistant/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current_paper: selectedName }),
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => readJson<RecommendResponse>(response))
      .then((data) => setRecommendation(data.recommendation))
      .catch(() => setRecommendation(null));
    return () => controller.abort();
  }, [selectedName]);

  function closeAssistant() {
    dialogRef.current?.close();
    setOpen(false);
  }

  async function submitQuestion(event: FormEvent) {
    event.preventDefault();
    const cleanQuestion = question.trim();
    const now = Date.now();
    if (
      !selectedName ||
      cleanQuestion.length < 3 ||
      pending ||
      now - lastSubmitAt.current < 1_000
    )
      return;
    lastSubmitAt.current = now;
    const userMessage: AssistantMessage = {
      id: ++messageId.current,
      role: "user",
      text: cleanQuestion,
      paper: selectedPaper?.title || selectedName,
    };
    setMessages((current) => [...current, userMessage]);
    setQuestion("");
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/research-assistant/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paper_name: selectedName,
          ...(section ? { section } : {}),
          question: cleanQuestion,
        }),
        cache: "no-store",
      });
      const result = await readJson<QueryResponse>(response);
      setMessages((current) => [
        ...current,
        {
          id: ++messageId.current,
          role: "assistant",
          text: result.answer,
          paper: selectedPaper?.title || result.paper_name,
          section: result.section_matched,
          hardNegative: result.hard_negative,
        },
      ]);
    } catch (caught) {
      if (
        caught instanceof AssistantRequestError &&
        caught.serviceUnavailable
      ) {
        setHealth("degraded");
      }
      setError(
        caught instanceof Error
          ? caught.message
          : "The research assistant is temporarily unavailable.",
      );
      setQuestion(cleanQuestion);
    } finally {
      setPending(false);
    }
  }

  async function submitComparison(event: FormEvent) {
    event.preventDefault();
    const cleanQuestion = question.trim();
    const now = Date.now();
    if (
      !selectedName ||
      !comparePaper ||
      cleanQuestion.length < 3 ||
      pending ||
      now - lastSubmitAt.current < 1_000
    )
      return;
    lastSubmitAt.current = now;
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/research-assistant/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paper_1: selectedName,
          paper_2: comparePaper,
          ...(section ? { section } : {}),
          question: cleanQuestion,
        }),
        cache: "no-store",
      });
      const result = await readJson<CompareResponse>(response);
      const secondTitle = papers.find(
        (paper) => paper.filename === comparePaper,
      )?.title;
      setMessages((current) => [
        ...current,
        { id: ++messageId.current, role: "user", text: cleanQuestion },
        {
          id: ++messageId.current,
          role: "assistant",
          text: result.answer,
          paper: `${selectedPaper?.title || result.paper_1} ↔ ${secondTitle || result.paper_2}`,
          section: result.section,
          hardNegative: result.hard_negative,
        },
      ]);
      setQuestion("");
    } catch (caught) {
      if (
        caught instanceof AssistantRequestError &&
        caught.serviceUnavailable
      ) {
        setHealth("degraded");
      }
      setError(
        caught instanceof Error
          ? caught.message
          : "The research assistant is temporarily unavailable.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => openAssistant()}
        className="fixed bottom-4 right-4 z-50 inline-flex min-h-12 items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-navy)] px-4 py-3 text-sm font-semibold text-white shadow-[var(--shadow-raised)] transition-transform hover:-translate-y-0.5 sm:bottom-6 sm:right-6"
        aria-label="Open Research Paper Assistant"
      >
        <MessageSquareText size={19} aria-hidden="true" />
        <span className="hidden sm:inline">Research assistant</span>
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onCancel={(event) => {
          event.preventDefault();
          closeAssistant();
        }}
        aria-labelledby="research-assistant-title"
        className="fixed bottom-0 left-0 right-0 top-auto m-0 max-h-[92dvh] w-full max-w-none overflow-hidden rounded-t-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-0 text-[var(--color-text)] shadow-[var(--shadow-raised)] backdrop:bg-[rgb(11_28_48_/_0.45)] sm:bottom-6 sm:left-auto sm:right-6 sm:max-h-[min(48rem,calc(100dvh-3rem))] sm:w-[min(30rem,calc(100vw-3rem))] sm:rounded-[var(--radius-lg)]"
      >
        <div className="flex max-h-[inherit] flex-col">
          <header className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-navy)] px-5 py-4 text-white">
            <div>
              <p className="text-xs font-semibold text-[var(--color-text-on-dark-muted)]">
                Grounded research tool
              </p>
              <h2
                id="research-assistant-title"
                className="mt-1 text-xl text-white"
              >
                Research Paper Assistant
              </h2>
            </div>
            <button
              type="button"
              onClick={closeAssistant}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-white hover:bg-white/10"
              aria-label="Close Research Paper Assistant"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </header>

          <div className="border-b border-[var(--color-border)] px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-muted">
                Answers use the selected indexed research paper.
              </p>
              <Badge
                className={
                  availability === "ready"
                    ? "border-[var(--color-success-border)] bg-[var(--color-success-soft)] text-[var(--color-success)]"
                    : "border-[var(--color-warning-border)] bg-[var(--color-warning-soft)] text-[var(--color-warning)]"
                }
              >
                {assistantAvailabilityLabel[availability]}
              </Badge>
            </div>
            <div
              className="mt-3 grid grid-cols-2 gap-2"
              role="group"
              aria-label="Assistant mode"
            >
              <Button
                type="button"
                variant={mode === "ask" ? "primary" : "secondary"}
                onClick={() => setMode("ask")}
              >
                <BookOpenText size={16} aria-hidden="true" /> Ask
              </Button>
              <Button
                type="button"
                variant={mode === "compare" ? "primary" : "secondary"}
                onClick={() => setMode("compare")}
              >
                <GitCompareArrows size={16} aria-hidden="true" /> Compare
              </Button>
            </div>
          </div>

          <div
            ref={transcriptRef}
            className="min-h-40 flex-1 overflow-y-auto px-5 py-4"
          >
            {messages.length === 0 ? (
              <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-4 text-sm text-muted">
                <p className="font-semibold text-[var(--color-ink)]">
                  Start with one focused question.
                </p>
                <p className="mt-1">
                  Each answer is independently grounded to the selected paper
                  and section.
                </p>
              </div>
            ) : (
              <ol className="space-y-4" aria-live="polite">
                {messages.map((message) => (
                  <li
                    key={message.id}
                    className={message.role === "user" ? "ml-8" : "mr-5"}
                  >
                    <div
                      className={
                        message.role === "user"
                          ? "rounded-[var(--radius-md)] bg-[var(--color-navy)] p-3 text-sm text-white"
                          : "rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-3 text-sm"
                      }
                    >
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    </div>
                    {message.role === "assistant" && message.paper && (
                      <p className="mt-1.5 text-xs text-muted">
                        {message.hardNegative
                          ? "No supporting passage found"
                          : "Grounded to"}
                        : {message.paper}
                        {message.section ? ` · ${message.section}` : ""}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            )}
            {pending && (
              <p
                role="status"
                className="mt-4 flex items-center gap-2 text-sm text-muted"
              >
                <LoaderCircle
                  className="animate-spin"
                  size={16}
                  aria-hidden="true"
                />
                Checking the selected paper…
              </p>
            )}
          </div>

          <form
            onSubmit={mode === "ask" ? submitQuestion : submitComparison}
            className="border-t border-[var(--color-border)] bg-[var(--color-canvas)] px-5 py-4"
          >
            <label htmlFor="assistant-paper">Paper</label>
            <Select
              id="assistant-paper"
              value={selectedName}
              onChange={(event) => {
                setSelectedName(event.target.value);
                setSection("");
                setRecommendation(null);
                setContextMatched(false);
              }}
              disabled={loadingPapers || papers.length === 0}
            >
              <option value="">
                {papers.length === 0
                  ? paperError
                    ? "Paper index unavailable"
                    : loadingPapers
                      ? "Loading indexed papers"
                      : "No indexed papers available"
                  : "Choose an indexed paper"}
              </option>
              {papers.map((paper) => (
                <option key={paper.filename} value={paper.filename}>
                  {paper.title}
                </option>
              ))}
            </Select>
            {contextMatched && (
              <p className="mt-1.5 text-xs font-semibold text-[var(--color-success)]">
                Using this publication
              </p>
            )}

            {mode === "compare" && (
              <div className="mt-3">
                <label htmlFor="assistant-compare-paper">Compare with</label>
                <Select
                  id="assistant-compare-paper"
                  value={comparePaper}
                  onChange={(event) => setComparePaper(event.target.value)}
                >
                  <option value="">Choose a second paper</option>
                  {papers
                    .filter((paper) => paper.filename !== selectedName)
                    .map((paper) => (
                      <option key={paper.filename} value={paper.filename}>
                        {paper.title}
                      </option>
                    ))}
                </Select>
              </div>
            )}

            {selectedPaper && (
              <div className="mt-3">
                <label htmlFor="assistant-section">Section</label>
                <Select
                  id="assistant-section"
                  value={section}
                  onChange={(event) => setSection(event.target.value)}
                >
                  <option value="">Choose automatically</option>
                  {selectedPaper.sections.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </Select>
              </div>
            )}

            <div className="mt-3">
              <label htmlFor="assistant-question">
                {mode === "ask" ? "Question" : "Comparison question"}
              </label>
              {mode === "ask" ? (
                <Input
                  ref={questionRef}
                  id="assistant-question"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  minLength={3}
                  maxLength={2000}
                  placeholder="What does this paper report?"
                  disabled={pending || !selectedName}
                />
              ) : (
                <Textarea
                  id="assistant-question"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  minLength={3}
                  maxLength={2000}
                  placeholder="How do the reported findings differ?"
                  className="min-h-24"
                  disabled={pending || !selectedName || !comparePaper}
                />
              )}
            </div>

            {(error || paperError) && (
              <div
                role="alert"
                className="mt-3 flex items-start justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--color-danger-border)] bg-[var(--color-danger-soft)] p-3 text-sm text-[var(--color-danger)]"
              >
                <p>{error || paperError}</p>
                <button
                  type="button"
                  onClick={() => void loadAssistant()}
                  className="inline-flex shrink-0 items-center gap-1 font-semibold"
                >
                  <RefreshCw size={14} aria-hidden="true" /> Retry
                </button>
              </div>
            )}

            {mode === "ask" && recommendation && (
              <div className="mt-3 border-l-2 border-[var(--color-action)] pl-3 text-xs text-muted">
                <p className="font-semibold text-[var(--color-ink)]">
                  Related indexed research
                </p>
                <p className="mt-1">{recommendation.title}</p>
                {recommendation.shared_keywords.length > 0 && (
                  <p className="mt-1">
                    Shared terms: {recommendation.shared_keywords.join(", ")}
                  </p>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="mt-4 w-full"
              disabled={
                pending ||
                availability !== "ready" ||
                !selectedName ||
                question.trim().length < 3 ||
                (mode === "compare" && !comparePaper)
              }
            >
              {pending ? (
                <LoaderCircle
                  className="animate-spin"
                  size={17}
                  aria-hidden="true"
                />
              ) : (
                <Send size={17} aria-hidden="true" />
              )}
              {mode === "ask" ? "Analyze paper" : "Compare papers"}
            </Button>
          </form>
        </div>
      </dialog>
    </>
  );
}
