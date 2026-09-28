/** Production DAC7 compliance calendar (ANAF diligence sequence). */

export const DAC7_SALES_THRESHOLD = 30;
export const DAC7_REVENUE_THRESHOLD_EUR = 2000;

/** Days after the initial information request. */
export const DAC7_REMINDER_1_DAYS = 14;
export const DAC7_REMINDER_2_DAYS = 30;
/** Minimum days before automatic account/payout measures (legal floor). */
export const DAC7_RESTRICTION_MIN_DAYS = 60;

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
  | "PAYMENT_RESTRICTED"
  | "ACCOUNT_RESTRICTED"
  | "OVERDUE";

export type Dac7ReminderStage =
  | "none"
  | "initial_sent"
  | "reminder_1_sent"
  | "reminder_2_sent"
  | "restriction_applied";

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
  | "restrict_account"
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
  ACCOUNT_RESTRICTED: "Account suspended",
  OVERDUE: "Overdue",
};

export function sellerStatusLabel(status: Dac7CaseStatus): string {
  return SELLER_LABELS[status];
}

export function hasTransactions(salesCount: number, revenueEur: number): boolean {
  return salesCount > 0 || revenueEur > 0;
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
      reasons.push(
        `€${revenueEur.toLocaleString()} revenue (> €${DAC7_REVENUE_THRESHOLD_EUR.toLocaleString()})`,
      );
    }
    return `Reportable — ${reasons.join(" and ")}.`;
  }
  return `Below threshold — ${salesCount} of ${DAC7_SALES_THRESHOLD} sales and €${revenueEur.toLocaleString()} of €${DAC7_REVENUE_THRESHOLD_EUR.toLocaleString()}.`;
}

/** Seller still owes DAC7 information (eligible for reminders / auto-suspension). */
export function isAwaitingSellerInformation(status: Dac7CaseStatus): boolean {
  return (
    status === "NOT_STARTED" ||
    status === "IN_PROGRESS" ||
    status === "NEEDS_CORRECTION" ||
    status === "OVERDUE" ||
    status === "PAYMENT_RESTRICTED" ||
    status === "ACCOUNT_RESTRICTED"
  );
}

/** Eligible for diligence reminder emails (not yet suspended). */
export function needsDiligenceReminders(status: Dac7CaseStatus): boolean {
  return (
    status === "NOT_STARTED" ||
    status === "IN_PROGRESS" ||
    status === "NEEDS_CORRECTION" ||
    status === "OVERDUE"
  );
}

export function daysBetween(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  return Math.floor(ms / (24 * 60 * 60 * 1000));
}

export function addDays(from: Date, days: number): Date {
  const d = new Date(from.getTime());
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

const TRANSITIONS: Partial<
  Record<
    Dac7CaseStatus,
    Partial<Record<Dac7AdminAction | "seller.save" | "seller.submit" | "seller.resubmit" | "system.overdue" | "system.auto_restrict", Dac7CaseStatus>>
  >
> = {
  NOT_STARTED: {
    "seller.save": "IN_PROGRESS",
    "system.overdue": "OVERDUE",
    "system.auto_restrict": "ACCOUNT_RESTRICTED",
  },
  IN_PROGRESS: {
    "seller.save": "IN_PROGRESS",
    "seller.submit": "SUBMITTED",
    "system.overdue": "OVERDUE",
    "system.auto_restrict": "ACCOUNT_RESTRICTED",
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
    "system.overdue": "OVERDUE",
    "system.auto_restrict": "ACCOUNT_RESTRICTED",
  },
  OVERDUE: {
    "seller.save": "IN_PROGRESS",
    "seller.submit": "SUBMITTED",
    "seller.resubmit": "SUBMITTED",
    "system.auto_restrict": "ACCOUNT_RESTRICTED",
  },
  VERIFIED: {
    mark_excluded: "EXCLUDED",
    mark_reportable: "REPORTABLE",
    restrict_payout: "PAYMENT_RESTRICTED",
    restrict_account: "ACCOUNT_RESTRICTED",
  },
  EXCLUDED: {
    mark_reportable: "REPORTABLE",
  },
  REPORTABLE: {
    ready_for_f7000: "READY_FOR_F7000",
    restrict_payout: "PAYMENT_RESTRICTED",
    restrict_account: "ACCOUNT_RESTRICTED",
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
    restrict_account: "ACCOUNT_RESTRICTED",
    "seller.submit": "SUBMITTED",
    "seller.resubmit": "SUBMITTED",
    "system.auto_restrict": "ACCOUNT_RESTRICTED",
  },
  ACCOUNT_RESTRICTED: {
    remove_restriction: "IN_PROGRESS",
    "seller.submit": "SUBMITTED",
    "seller.resubmit": "SUBMITTED",
  },
};

export type Dac7TransitionAction =
  | Dac7AdminAction
  | "seller.save"
  | "seller.submit"
  | "seller.resubmit"
  | "system.overdue"
  | "system.auto_restrict";

export function canTransition(from: Dac7CaseStatus, action: Dac7TransitionAction): boolean {
  return Boolean(TRANSITIONS[from]?.[action]);
}

export function nextStatus(from: Dac7CaseStatus, action: Dac7TransitionAction): Dac7CaseStatus {
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
        hint: "Required for DAC7. Complete this to keep selling and receiving payouts without interruption.",
      };
    case "IN_PROGRESS":
      return {
        action: "continue",
        label: "Continue",
        hint: "Finish the remaining steps and confirm your details.",
      };
    case "OVERDUE":
      return {
        action: "fix_and_resubmit",
        label: "Complete now — overdue",
        hint: "Your response deadline has passed. Complete DAC7 immediately to avoid account suspension.",
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
        label: "Complete to lift payout hold",
        hint: "Payouts are on hold until your DAC7 information is verified.",
      };
    case "ACCOUNT_RESTRICTED":
      return {
        action: "contact_support",
        label: "Account suspended — complete DAC7",
        hint: "Your seller account is suspended for missing DAC7 information. Complete and submit your file, then contact support if needed.",
      };
    case "SUBMITTED":
    case "UNDER_REVIEW":
      return {
        action: "wait",
        label: "Waiting for review",
        hint: "No action needed. You will receive an email if anything is missing.",
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
        hint: "We will email you if reporting becomes required or something changes.",
      };
    default:
      return { action: "none", label: "You’re up to date", hint: "" };
  }
}

export function adminQueuePriority(status: Dac7CaseStatus): number {
  switch (status) {
    case "ACCOUNT_RESTRICTED":
      return 0;
    case "PAYMENT_RESTRICTED":
      return 1;
    case "OVERDUE":
      return 2;
    case "NEEDS_CORRECTION":
      return 3;
    case "SUBMITTED":
      return 4;
    case "UNDER_REVIEW":
      return 5;
    case "REPORTABLE":
    case "READY_FOR_F7000":
      return 6;
    case "CORRECTION_REQUIRED":
      return 7;
    default:
      return 10;
  }
}

export function reminderStageLabel(stage: Dac7ReminderStage): string {
  switch (stage) {
    case "none":
      return "Not started";
    case "initial_sent":
      return "Initial request sent";
    case "reminder_1_sent":
      return "Reminder 1 sent";
    case "reminder_2_sent":
      return "Reminder 2 sent";
    case "restriction_applied":
      return "Restriction applied";
  }
}
