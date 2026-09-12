export type LoadResult<T> =
  { ok: true; data: T } | { ok: false; message: string };

export async function settleLoad<T>(promise: Promise<T>, message: string) {
  try {
    return { ok: true, data: await promise } as const;
  } catch {
    return { ok: false, message } as const;
  }
}
