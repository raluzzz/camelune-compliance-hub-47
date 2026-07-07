import {
  OBLIGATIONS,
  type EprCategory,
  type EprStatus,
  type Obligation,
} from "@/lib/epr-data";

export const EPR_TAB_CATEGORIES: EprCategory[] = ["packaging", "batteries", "weee"];

export type EprCounterKey = "identified" | "needs-action" | "rejected" | "submitted";

export interface EprCounters {
  identified: number;
  "needs-action": number;
  rejected: number;
  submitted: number;
}

export function shouldShowInEprTabs(o: Obligation): boolean {
  return (
    o.affectedProducts > 0 ||
    !["not-required", "missing"].includes(o.status) ||
    o.status === "missing"
  );
}

export function tabObligations(obligations: Obligation[] = OBLIGATIONS): Obligation[] {
  return obligations.filter(
    (o) => EPR_TAB_CATEGORIES.includes(o.category) && shouldShowInEprTabs(o),
  );
}

export function computeEprCounters(obligations: Obligation[] = OBLIGATIONS): EprCounters {
  const listed = tabObligations(obligations);
  return {
    identified: listed.length,
    "needs-action": listed.filter((o) =>
      o.status === "missing" || o.status === "review-required",
    ).length,
    rejected: listed.filter((o) => o.status === "rejected").length,
    submitted: listed.filter((o) =>
      ["submitted", "under-review", "draft"].includes(o.status),
    ).length,
  };
}

export function obligationsForCounter(
  key: EprCounterKey,
  obligations: Obligation[] = OBLIGATIONS,
): Obligation[] {
  const listed = tabObligations(obligations);
  switch (key) {
    case "identified":
      return listed;
    case "needs-action":
      return listed.filter(
        (o) => o.status === "missing" || o.status === "review-required",
      );
    case "rejected":
      return listed.filter((o) => o.status === "rejected");
    case "submitted":
      return listed.filter((o) =>
        ["submitted", "under-review", "draft"].includes(o.status),
      );
  }
}

export function counterPanelTitle(key: EprCounterKey): string {
  const titles: Record<EprCounterKey, string> = {
    identified: "All obligations",
    "needs-action": "Needs action",
    rejected: "Rejected documents",
    submitted: "Submitted documents",
  };
  return titles[key];
}

export function counterPanelAction(status: EprStatus): string {
  if (status === "missing" || status === "review-required") return "Fix now";
  if (status === "rejected") return "Resubmit";
  if (status === "expiring-soon") return "Renew";
  return "View";
}
