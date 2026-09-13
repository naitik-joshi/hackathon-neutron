export type SearchDocument<T> = {
  item: T;
  primary: string;
  secondary?: string[];
  connections?: string[];
};

function normalize(value: string) {
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

export function rankSearchDocuments<T>(
  documents: SearchDocument<T>[],
  rawQuery: string,
  limit = 8,
) {
  const query = normalize(rawQuery.slice(0, 100));
  const tokens = [...new Set(query.split(/\s+/).filter(Boolean))];
  if (!tokens.length) return [];

  return documents
    .map((document) => {
      const primary = normalize(document.primary);
      const secondary = normalize((document.secondary ?? []).join(" "));
      const connections = normalize((document.connections ?? []).join(" "));
      const searchable = `${primary} ${secondary} ${connections}`;
      if (!tokens.every((token) => searchable.includes(token))) return null;

      let score =
        primary === query
          ? 100
          : primary.startsWith(query)
            ? 70
            : primary.includes(query)
              ? 50
              : 0;
      if (secondary.includes(query)) score += 20;
      if (connections.includes(query)) score += 10;
      for (const token of tokens) {
        if (primary.includes(token)) score += 8;
        if (secondary.includes(token)) score += 3;
        if (connections.includes(token)) score += 2;
      }
      return { ...document, score };
    })
    .filter((result): result is SearchDocument<T> & { score: number } =>
      Boolean(result),
    )
    .sort(
      (a, b) => b.score - a.score || a.primary.localeCompare(b.primary, "en"),
    )
    .slice(0, Math.max(0, Math.min(limit, 50)));
}

export function publishedOnly<T extends { status: string }>(items: T[]) {
  return items.filter((item) => item.status === "published");
}
