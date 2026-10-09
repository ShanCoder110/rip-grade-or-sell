export async function sleep(ms: number): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}

export async function fetchWithRetry(
  url: string,
  init: RequestInit & { retries?: number; backoffMs?: number } = {},
): Promise<Response> {
  const { retries = 3, backoffMs = 500, ...rest } = init;
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, rest);
      if (res.status === 429) {
        const retryAfter = Number(res.headers.get("retry-after") ?? "1");
        await sleep(retryAfter * 1000);
        continue;
      }
      return res;
    } catch (e) {
      lastError = e;
      if (attempt < retries) await sleep(backoffMs * 2 ** attempt);
    }
  }
  throw lastError instanceof Error ? lastError : new Error("fetch failed");
}
