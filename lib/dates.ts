const TIME_ZONE = process.env.APP_TIMEZONE ?? "Asia/Kolkata";

/** YYYY-MM-DD for the given instant in the app timezone. */
export function dayKey(date: Date = new Date(), timeZone = TIME_ZONE): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

/** The app-timezone calendar day as a UTC-midnight Date, for @db.Date columns. */
export function dayDate(date: Date = new Date()): Date {
  return new Date(`${dayKey(date)}T00:00:00.000Z`);
}

export function addDays(day: Date, days: number): Date {
  return new Date(day.getTime() + days * 86_400_000);
}

export function dbDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Consecutive active days ending today. Yesterday also counts as the end so a
 * streak is not shown as broken before the user has had a chance to study today.
 */
export function computeStreak(activeDayKeys: Iterable<string>, today: Date): number {
  const active = new Set(activeDayKeys);
  let cursor = today;
  if (!active.has(dbDateKey(cursor))) cursor = addDays(cursor, -1);
  let streak = 0;
  while (active.has(dbDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

/** Monday of the week containing the given UTC-midnight day. */
export function weekStart(day: Date): Date {
  const weekday = (day.getUTCDay() + 6) % 7;
  return addDays(day, -weekday);
}

export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  if (s < 60) return `${s}s`;
  const minutes = Math.floor(s / 60);
  if (minutes < 60) return `${minutes}m ${s % 60}s`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(s / 3600);
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: TIME_ZONE,
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: TIME_ZONE,
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}
