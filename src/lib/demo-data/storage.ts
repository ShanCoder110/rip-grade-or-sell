const PREFIX = "rgs_demo_v1";

export function demoStorageKey(demoId: string, collection: string): string {
  return `${PREFIX}:${demoId}:${collection}`;
}

export function readDemoCollection<T>(demoId: string, collection: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(demoStorageKey(demoId, collection));
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeDemoCollection<T>(demoId: string, collection: string, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(demoStorageKey(demoId, collection), JSON.stringify(value));
}
