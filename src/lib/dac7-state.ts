/** DAC7 case statuses — system codes with seller-friendly labels. */

export const DAC7_SALES_THRESHOLD = 30;
export const DAC7_REVENUE_THRESHOLD_EUR = 2000;

export type Dac7CaseStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "NEEDS_CORRECTION"
  | "VERIFIED"
  | "EXCLUDED"
  | "REPORTABLE"
  | "READY_FOR_F7000"
  | "REPORTED"
  | "CORRECTION_REQUIRED"
  | "PAYMENT_RESTRICTED";

export type Dac7SellerAction =
  | "start"
  | "continue"
  | "submit"
  | "fix_and_resubmit"
  | "wait"
  | "view_report"
  | "contact_support"
  | "none";

export type Dac7AdminAction =
  | "assign"
  | "start_review"
  | "request_correction"
  | "approve"
  | "mark_excluded"
  | "mark_reportable"
  | "restrict_payout"
  | "remove_restriction"
  | "ready_for_f7000"
  | "submit_f7000"
  | "accept_receipt"
  | "open_correction";

const SELLER_LABELS: Record<Dac7CaseStatus, string> = {
  NOT_STARTED: "Not started",
  IN_PROGRESS: "In progress",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "In review",
  NEEDS_CORRECTION: "Action required",
  VERIFIED: "Verified",
  EXCLUDED: "Not reportable",
  REPORTABLE: "Reportable",
  READY_FOR_F7000: "Preparing report",
  REPORTED: "Reported",
  CORRECTION_REQUIRED: "Correction needed",
  PAYMENT_RESTRICTED: "Payout on hold",
};

export function sellerStatusLabel(status: Dac7CaseStatus): string {
  return SELLER_LABELS[status];
}

export function isThresholdReached(salesCount: number, revenueEur: number): boolean {
  return salesCount >= DAC7_SALES_THRESHOLD || revenueEur > DAC7_REVENUE_THRESHOLD_EUR;
}

export function isExcludedByThreshold(salesCount: number, revenueEur: number): boolean {
  return salesCount < DAC7_SALES_THRESHOLD && revenueEur <= DAC7_REVENUE_THRESHOLD_EUR;
}

export function thresholdExplain(salesCount: number, revenueEur: number): string {
  if (isThresholdReached(salesCount, revenueEur)) {
    const reasons: string[] = [];
    if (salesCount >= DAC7_SALES_THRESHOLD) {
      reasons.push(`${salesCount} sales (≥ ${DAC7_SALES_THRESHOLD})`);
    }
    if (revenueEur > DAC7_REVENUE_THRESHOLD_EUR) {
      reasons.push(`€${revenueEur.toLocaleString()} revenue (> €${DAC7_REVENUE_THRESHOLD_EUR.toLocaleString()})`);
    }
    return `Reportable — ${reasons.join(" and ")}.`;
  }
  return `Below threshold — ${salesCount} of ${DAC7_SALES_THRESHOLD} sales and €${revenueEur.toLocaleString()} of €${DAC7_REVENUE_THRESHOLD_EUR.toLocaleString()}.`;
}

/** Allowed transitions: from → action → to */
const TRANSITIONS: Partial<
  Record<Dac7CaseStatus, Partial<Record<Dac7AdminAction | "seller.save" | "seller.submit" | "seller.resubmit", Dac7CaseStatus>>>
> = {
  NOT_STARTED: {
    "seller.save": "IN_PROGRESS",
  },
  IN_PROGRESS: {
    "seller.save": "IN_PROGRESS",
    "seller.submit": "SUBMITTED",
  },
  SUBMITTED: {
    start_review: "UNDER_REVIEW",
  },
  UNDER_REVIEW: {
    request_correction: "NEEDS_CORRECTION",
    approve: "VERIFIED",
    mark_excluded: "EXCLUDED",
  },
  NEEDS_CORRECTION: {
    "seller.resubmit": "SUBMITTED",
  },
  VERIFIED: {
    mark_excluded: "EXCLUDED",
    mark_reportable: "REPORTABLE",
    restrict_payout: "PAYMENT_RESTRICTED",
  },
  EXCLUDED: {
    mark_reportable: "REPORTABLE",
  },
  REPORTABLE: {
    ready_for_f7000: "READY_FOR_F7000",
    restrict_payout: "PAYMENT_RESTRICTED",
  },
  READY_FOR_F7000: {
    submit_f7000: "READY_FOR_F7000",
    accept_receipt: "REPORTED",
  },
  REPORTED: {
    open_correction: "CORRECTION_REQUIRED",
  },
  CORRECTION_REQUIRED: {
    submit_f7000: "CORRECTION_REQUIRED",
    accept_receipt: "REPORTED",
  },
  PAYMENT_RESTRICTED: {
    remove_restriction: "VERIFIED",
    "seller.submit": "SUBMITTED",
    "seller.resubmit": "SUBMITTED",
  },
};

export function canTransition(
  from: Dac7CaseStatus,
  action: Dac7AdminAction | "seller.save" | "seller.submit" | "seller.resubmit",
): boolean {
  return Boolean(TRANSITIONS[from]?.[action]);
}

export function nextStatus(
  from: Dac7CaseStatus,
  action: Dac7AdminAction | "seller.save" | "seller.submit" | "seller.resubmit",
): Dac7CaseStatus {
  const to = TRANSITIONS[from]?.[action];
  if (!to) {
    throw new Error(`DAC7_INVALID_STATE_TRANSITION: ${from} + ${action}`);
  }
  return to;
}

export function sellerNextAction(status: Dac7CaseStatus): {
  action: Dac7SellerAction;
  label: string;
  hint: string;
} {
  switch (status) {
    case "NOT_STARTED":
      return {
        action: "start",
        label: "Complete your information",
        hint: "Takes a few minutes. We reuse what you already provided where possible.",
      };
    case "IN_PROGRESS":
      return {
        action: "continue",
        label: "Continue",
        hint: "Finish the remaining steps and confirm your details.",
      };
    case "NEEDS_CORRECTION":
    case "CORRECTION_REQUIRED":
      return {
        action: "fix_and_resubmit",
        label: "Fix and resubmit",
        hint: "Update the items Camelune flagged, then send again.",
      };
    case "PAYMENT_RESTRICTED":
      return {
        action: "fix_and_resubmit",
        label: "Complete to lift hold",
        hint: "Payouts are on hold until your DAC7 information is complete and verified.",
      };
    case "SUBMITTED":
    case "UNDER_REVIEW":
      return {
        action: "wait",
        label: "Waiting for review",
        hint: "No action needed. We’ll email you if anything is missing.",
      };
    case "REPORTED":
      return {
        action: "view_report",
        label: "View report",
        hint: "Your data for this period was included in Camelune’s filing.",
      };
    case "VERIFIED":
    case "EXCLUDED":
    case "REPORTABLE":
    case "READY_FOR_F7000":
      return {
        action: "none",
        label: "You’re up to date",
        hint: "We’ll notify you if reporting becomes required or something changes.",
      };
    default:
      return { action: "none", label: "You’re up to date", hint: "" };
  }
}

export function adminQueuePriority(status: Dac7CaseStatus): number {
  switch (status) {
    case "PAYMENT_RESTRICTED":
      return 0;
    case "NEEDS_CORRECTION":
      return 1;
    case "SUBMITTED":
      return 2;
    case "UNDER_REVIEW":
      return 3;
    case "REPORTABLE":
    case "READY_FOR_F7000":
      return 4;
    case "CORRECTION_REQUIRED":
      return 5;
    default:
      return 10;
  }
}
