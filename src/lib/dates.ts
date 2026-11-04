export interface TimeParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function parseLocalDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatLongDate(value: string): string {
  return parseLocalDate(value).toLocaleDateString('es', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function toParts(milliseconds: number): TimeParts {
  const totalSeconds = Math.floor(Math.max(0, milliseconds) / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export function elapsedParts(since: Date, now: Date): TimeParts {
  return toParts(now.getTime() - since.getTime());
}

export function remainingParts(target: Date, now: Date): TimeParts {
  return toParts(target.getTime() - now.getTime());
}

export function yearsSince(since: Date, now: Date): number {
  let years = now.getFullYear() - since.getFullYear();
  const anniversaryThisYear = new Date(now.getFullYear(), since.getMonth(), since.getDate());
  if (now < anniversaryThisYear) years -= 1;
  return Math.max(0, years);
}

export function nextAnniversary(since: Date, now: Date): Date {
  const candidate = new Date(now.getFullYear(), since.getMonth(), since.getDate());
  if (candidate.getTime() > now.getTime()) return candidate;
  return new Date(now.getFullYear() + 1, since.getMonth(), since.getDate());
}

export function isAnniversaryToday(since: Date, now: Date): boolean {
  return now.getMonth() === since.getMonth() && now.getDate() === since.getDate();
}
