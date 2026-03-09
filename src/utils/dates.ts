import type { ISODate } from "../models/types";

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function toISODate(d: Date): ISODate {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function todayISO(): ISODate {
  return toISODate(new Date());
}

export function parseISODate(iso: ISODate): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function addDaysISO(iso: ISODate, days: number): ISODate {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

export function isSameISO(a?: ISODate, b?: ISODate) {
  return Boolean(a && b && a === b);
}

export function isYesterday(lastDate: ISODate | undefined, today: ISODate): boolean {
  if (!lastDate) return false;
  return addDaysISO(lastDate, 1) === today;
}

export function isBeforeISO(a: ISODate, b: ISODate): boolean {
  return parseISODate(a).getTime() < parseISODate(b).getTime();
}

export function formatLongDateES(iso: ISODate): string {
  const d = parseISODate(iso);
  return d.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

export function formatShortDateES(iso: ISODate): string {
  const d = parseISODate(iso);
  return d.toLocaleDateString("es-ES", {
    month: "short",
    day: "numeric"
  });
}

// ISO week helpers
export function getISOWeekId(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${pad2(weekNo)}`;
}

export function currentISOWeekId(): string {
  return getISOWeekId(new Date());
}

