export const CHECKS_VERSION = "v2";

const TTL_MS = 5 * 60 * 1000;

type Entry<T> = {
  data: T;
  expiresAt: number;
  version: string;
};

const store = new Map<string, Entry<unknown>>();

export function cacheGet<T>(key: string, version = CHECKS_VERSION): T | null {
  const hit = store.get(key);
  if (!hit) return null;
  if (hit.version !== version || hit.expiresAt < Date.now()) {
    store.delete(key);
    return null;
  }
  return hit.data as T;
}

export function cacheSet<T>(key: string, data: T, ttlMs = TTL_MS): void {
  store.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
    version: CHECKS_VERSION,
  });
}

export function cacheClear(): void {
  store.clear();
}

export function cacheStats() {
  return { size: store.size, version: CHECKS_VERSION };
}
