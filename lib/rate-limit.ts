// Per-email login throttle. In-memory, so it is per server instance; put a shared
// store behind these three functions if the app is ever run on several instances.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 8;

const failures = new Map<string, { count: number; firstAt: number }>();

export function isRateLimited(key: string, now = Date.now()): boolean {
  const entry = failures.get(key);
  if (!entry) return false;
  if (now - entry.firstAt > WINDOW_MS) {
    failures.delete(key);
    return false;
  }
  return entry.count >= MAX_FAILURES;
}

export function recordFailure(key: string, now = Date.now()): void {
  const entry = failures.get(key);
  if (!entry || now - entry.firstAt > WINDOW_MS) {
    failures.set(key, { count: 1, firstAt: now });
  } else {
    entry.count += 1;
  }
}

export function clearFailures(key: string): void {
  failures.delete(key);
}
