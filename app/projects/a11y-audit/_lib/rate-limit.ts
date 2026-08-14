type Bucket = {
  tokens: number;
  refilledAt: number;
};

const buckets = new Map<string, Bucket>();

// Under Playwright every request arrives without x-forwarded-for/x-real-ip, so
// all parallel workers share the single "anonymous" bucket. Raise the ceiling
// for that case so the limiter never fires mid-suite; production keeps 10.
const UNDER_TEST = process.env.PLAYWRIGHT === "1" || process.env.NODE_ENV === "test";

const CAPACITY = UNDER_TEST ? 10_000 : 10;
const REFILL_PER_SECOND = CAPACITY / 60;

export type RateLimitResult =
  | { ok: true; remaining: number }
  | { ok: false; retryAfterSeconds: number };

export function consume(key: string, cost = 1): RateLimitResult {
  const now = Date.now();
  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { tokens: CAPACITY, refilledAt: now };
    buckets.set(key, bucket);
  } else {
    const elapsedSeconds = (now - bucket.refilledAt) / 1000;
    bucket.tokens = Math.min(CAPACITY, bucket.tokens + elapsedSeconds * REFILL_PER_SECOND);
    bucket.refilledAt = now;
  }
  if (bucket.tokens < cost) {
    const deficit = cost - bucket.tokens;
    return {
      ok: false,
      retryAfterSeconds: Math.ceil(deficit / REFILL_PER_SECOND),
    };
  }
  bucket.tokens -= cost;
  return { ok: true, remaining: Math.floor(bucket.tokens) };
}

export function rateLimitClear() {
  buckets.clear();
}
