import type {
  Project,
  PublicationStatus,
} from "../../lib/supabase/database.types.ts";
import {
  CHANGES_REQUESTED_STALE_DAYS,
  PROJECT_STALE_DAYS,
  REVIEW_STALE_DAYS,
} from "./constants.ts";

export type AttentionSeverity = "high" | "medium" | "low";
export type AttentionEntityType = "publication" | "project";
export type AttentionType =
  "stale_review" | "changes_requested_inactive" | "stale_ongoing_project";

export type AttentionItem = {
  key: string;
  type: AttentionType;
  severity: AttentionSeverity;
  title: string;
  reason: string;
  entityType: AttentionEntityType;
  entityId: string;
  href: string;
  timestamp: string;
};

export type AttentionPublication = {
  id: string;
  title: string;
  status: PublicationStatus;
  updated_at: string;
};

export type AttentionProject = {
  id: string;
  title: string;
  slug: string;
  status: Project["status"];
  updated_at: string;
};

export type AttentionInput = {
  publications: AttentionPublication[];
  projects: AttentionProject[];
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const severityOrder: Record<AttentionSeverity, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

function daysSince(timestamp: string, now: Date) {
  const time = Date.parse(timestamp);
  if (!Number.isFinite(time)) return null;
  return Math.max(0, (now.getTime() - time) / DAY_IN_MS);
}

export function buildAttentionItems(
  { publications, projects }: AttentionInput,
  now = new Date(),
): AttentionItem[] {
  const items: AttentionItem[] = [];

  for (const publication of publications) {
    const age = daysSince(publication.updated_at, now);
    if (age === null) continue;

    if (
      (publication.status === "submitted" ||
        publication.status === "under_review") &&
      age >= REVIEW_STALE_DAYS
    ) {
      items.push({
        key: `stale_review:${publication.id}`,
        type: "stale_review",
        severity: "high",
        title: publication.title,
        reason: `No update in the configured ${REVIEW_STALE_DAYS}-day review window.`,
        entityType: "publication",
        entityId: publication.id,
        href: `/admin/submissions/${publication.id}`,
        timestamp: publication.updated_at,
      });
    } else if (
      publication.status === "changes_requested" &&
      age >= CHANGES_REQUESTED_STALE_DAYS
    ) {
      items.push({
        key: `changes_requested_inactive:${publication.id}`,
        type: "changes_requested_inactive",
        severity: "medium",
        title: publication.title,
        reason: `No update in the configured ${CHANGES_REQUESTED_STALE_DAYS}-day changes window.`,
        entityType: "publication",
        entityId: publication.id,
        href: `/admin/submissions/${publication.id}`,
        timestamp: publication.updated_at,
      });
    }
  }

  for (const project of projects) {
    const age = daysSince(project.updated_at, now);
    if (
      project.status === "ongoing" &&
      age !== null &&
      age >= PROJECT_STALE_DAYS
    ) {
      items.push({
        key: `stale_ongoing_project:${project.id}`,
        type: "stale_ongoing_project",
        severity: "low",
        title: project.title,
        reason: `No update in the configured ${PROJECT_STALE_DAYS}-day project window.`,
        entityType: "project",
        entityId: project.id,
        href: `/projects/${project.slug}`,
        timestamp: project.updated_at,
      });
    }
  }

  return Array.from(
    new Map(items.map((item) => [item.key, item])).values(),
  ).sort(
    (a, b) =>
      severityOrder[a.severity] - severityOrder[b.severity] ||
      Date.parse(a.timestamp) - Date.parse(b.timestamp) ||
      a.key.localeCompare(b.key),
  );
}
