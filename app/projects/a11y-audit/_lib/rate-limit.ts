type Bucket = {
  tokens: number;
  refilledAt: number;
};

const buckets = new Map<string, Bucket>();

const CAPACITY = 10;
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
