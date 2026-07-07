import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  effectiveFromError,
  formatOssEffectiveDate,
  formatOssSummary,
  loadOssRegistration,
  saveOssRegistration,
  type OssRegistration,
} from "@/lib/oss-registration";

describe("effectiveFromError", () => {
  it("rejects invalid date strings", () => {
    expect(effectiveFromError("not a date 99/99/9999")).toMatch(/valid date/);
    expect(effectiveFromError("2024-02-30")).toMatch(/valid date/);
  });

  it("accepts valid ISO dates", () => {
    expect(effectiveFromError("2024-01-01")).toBeNull();
    expect(effectiveFromError("2024-01-15")).toBeNull();
    expect(effectiveFromError("2026-07-01")).toBeNull();
  });
});

describe("formatOssEffectiveDate", () => {
  it("formats deterministically without locale drift", () => {
    expect(formatOssEffectiveDate("2024-01-15")).toBe("15 Jan 2024");
    expect(formatOssEffectiveDate("2024-01-01")).toBe("01 Jan 2024");
  });
});

describe("formatOssSummary", () => {
  it("includes scheme, member state, and formatted date", () => {
    const reg: OssRegistration = {
      memberState: "Romania",
      scheme: "Union",
      effectiveFrom: "2024-01-15",
    };
    expect(formatOssSummary(reg)).toContain("Union scheme");
    expect(formatOssSummary(reg)).toContain("Romania");
    expect(formatOssSummary(reg)).toContain("15 Jan 2024");
  });
});

describe("oss registration persistence", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", {
      store: {} as Record<string, string>,
      getItem(key: string) {
        return this.store[key] ?? null;
      },
      setItem(key: string, value: string) {
        this.store[key] = value;
      },
      removeItem(key: string) {
        delete this.store[key];
      },
    });
  });

  it("persists and reloads the saved registration", () => {
    const next: OssRegistration = {
      memberState: "Germany",
      scheme: "Union",
      effectiveFrom: "2024-01-15",
    };
    expect(saveOssRegistration(next)).toBe(true);
    expect(loadOssRegistration()).toEqual(next);
  });

  it("migrates legacy EditModal storage shape", () => {
    localStorage.setItem(
      "tax-oss-registration",
      JSON.stringify({ ms: "Romania", scheme: "Union", from: "15 Jan 2024" }),
    );
    expect(loadOssRegistration().effectiveFrom).toBe("2024-01-15");
  });

  it("does not report success when save fails validation", () => {
    expect(
      saveOssRegistration({
        memberState: "Romania",
        scheme: "Union",
        effectiveFrom: "not-a-date",
      }),
    ).toBe(false);
  });

  it("returns a stable snapshot reference for useSyncExternalStore", () => {
    const first = loadOssRegistration();
    const second = loadOssRegistration();
    expect(first).toBe(second);
  });
});
