import { useSyncExternalStore } from "react";

export type OssScheme = "Union" | "Non-Union" | "IOSS";

export interface OssRegistration {
  memberState: string;
  scheme: OssScheme;
  /** ISO date string YYYY-MM-DD */
  effectiveFrom: string;
}

const STORAGE_KEY = "tax-oss-registration";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export const DEFAULT_OSS_REGISTRATION: OssRegistration = {
  memberState: "Romania",
  scheme: "Union",
  effectiveFrom: "2024-01-01",
};

export const OSS_MEMBER_STATES = [
  "Romania",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Netherlands",
  "Belgium",
  "Austria",
  "Poland",
] as const;

const OSS_SCHEMES: OssScheme[] = ["Union", "Non-Union", "IOSS"];

let listeners = new Set<() => void>();
let cachedSnapshot: OssRegistration = DEFAULT_OSS_REGISTRATION;
let cachedStorageRaw: string | null = null;

function emitChange() {
  listeners.forEach((listener) => listener());
}

function snapshotFromRaw(raw: string | null): OssRegistration {
  if (!raw) return DEFAULT_OSS_REGISTRATION;
  return parseStoredRegistration(raw) ?? DEFAULT_OSS_REGISTRATION;
}

function isSameRegistration(a: OssRegistration, b: OssRegistration): boolean {
  return (
    a.memberState === b.memberState &&
    a.scheme === b.scheme &&
    a.effectiveFrom === b.effectiveFrom
  );
}

function syncCachedSnapshot(next: OssRegistration, raw: string | null) {
  if (isSameRegistration(next, cachedSnapshot)) return;
  cachedSnapshot = next;
  cachedStorageRaw = raw;
}

function readOssRegistrationSnapshot(): OssRegistration {
  if (typeof localStorage === "undefined") return DEFAULT_OSS_REGISTRATION;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedStorageRaw) return cachedSnapshot;

    const next = snapshotFromRaw(raw);
    syncCachedSnapshot(next, raw);
    return cachedSnapshot;
  } catch {
    return DEFAULT_OSS_REGISTRATION;
  }
}

export function subscribeOssRegistration(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function parseDisplayDate(value: string): string | null {
  const match = value.trim().match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/);
  if (!match) return null;
  const day = Number(match[1]);
  const monthLabel = match[2];
  const year = Number(match[3]);
  const month = MONTH_LABELS.findIndex(
    (label) => label.toLowerCase() === monthLabel.toLowerCase(),
  );
  if (month < 0) return null;
  const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return effectiveFromError(iso) ? null : iso;
}

function normalizeScheme(value: string): OssScheme | null {
  return OSS_SCHEMES.includes(value as OssScheme) ? (value as OssScheme) : null;
}

function parseStoredRegistration(raw: string): OssRegistration | null {
  try {
    const parsed = JSON.parse(raw) as Record<string, string>;
    if (!parsed || typeof parsed !== "object") return null;

    if (parsed.memberState && parsed.scheme && parsed.effectiveFrom) {
      const scheme = normalizeScheme(parsed.scheme);
      if (!scheme || effectiveFromError(parsed.effectiveFrom)) return null;
      return {
        memberState: parsed.memberState,
        scheme,
        effectiveFrom: parsed.effectiveFrom,
      };
    }

    // Legacy shape from the old EditModal (`ms`, `from`).
    if (parsed.ms && parsed.scheme && parsed.from) {
      const scheme = normalizeScheme(parsed.scheme);
      const iso =
        /^\d{4}-\d{2}-\d{2}$/.test(parsed.from)
          ? parsed.from
          : parseDisplayDate(parsed.from);
      if (!scheme || !iso || effectiveFromError(iso)) return null;
      return {
        memberState: parsed.ms,
        scheme,
        effectiveFrom: iso,
      };
    }

    return null;
  } catch {
    return null;
  }
}

export function loadOssRegistration(): OssRegistration {
  return readOssRegistrationSnapshot();
}

export function getOssRegistrationServerSnapshot(): OssRegistration {
  return DEFAULT_OSS_REGISTRATION;
}

export function saveOssRegistration(registration: OssRegistration): boolean {
  if (typeof localStorage === "undefined") return false;
  if (effectiveFromError(registration.effectiveFrom)) return false;
  if (!normalizeScheme(registration.scheme)) return false;
  if (!registration.memberState.trim()) return false;

  try {
    const payload = JSON.stringify(registration);
    localStorage.setItem(STORAGE_KEY, payload);
    syncCachedSnapshot(registration, payload);
    emitChange();
    return true;
  } catch {
    return false;
  }
}

export function useOssRegistration(): [
  OssRegistration,
  (next: OssRegistration) => boolean,
] {
  const registration = useSyncExternalStore(
    subscribeOssRegistration,
    readOssRegistrationSnapshot,
    getOssRegistrationServerSnapshot,
  );

  const persist = (next: OssRegistration) => saveOssRegistration(next);

  return [registration, persist];
}

export function effectiveFromError(isoDate: string): string | null {
  if (!isoDate.trim()) return "Select an effective date.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return "Enter a valid date.";
  const [year, month, day] = isoDate.split("-").map(Number);
  if (month < 1 || month > 12 || day < 1 || day > 31) return "Enter a valid date.";
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day > daysInMonth) return "Enter a valid date.";
  return null;
}

export function formatOssEffectiveDate(isoDate: string): string {
  if (effectiveFromError(isoDate)) return isoDate;
  const [year, month, day] = isoDate.split("-");
  const monthLabel = MONTH_LABELS[Number(month) - 1];
  return `${day.padStart(2, "0")} ${monthLabel} ${year}`;
}

export function formatOssSummary(registration: OssRegistration): string {
  return `Active · ${registration.scheme} scheme · ${registration.memberState} · since ${formatOssEffectiveDate(registration.effectiveFrom)}`;
}
