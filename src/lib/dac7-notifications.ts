import {
  DAC7_REMINDER_1_DAYS,
  DAC7_REMINDER_2_DAYS,
  DAC7_RESTRICTION_MIN_DAYS,
  addDays,
  daysBetween,
  hasTransactions,
  isAwaitingSellerInformation,
  needsDiligenceReminders,
  type Dac7CaseStatus,
  type Dac7ReminderStage,
} from "@/lib/dac7-state";

export type Dac7EmailTemplateId =
  | "dac7_initial_request"
  | "dac7_reminder_1"
  | "dac7_reminder_2"
  | "dac7_request_correction"
  | "dac7_submitted"
  | "dac7_verified"
  | "dac7_payout_held"
  | "dac7_account_suspended"
  | "dac7_restriction_lifted"
  | "dac7_annual_reported";

export type Dac7EmailMessage = {
  id: string;
  templateId: Dac7EmailTemplateId;
  caseId: string;
  sellerId: string;
  to: string;
  subject: string;
  body: string;
  channel: "email";
  /** When the message should leave the outbox. */
  scheduledFor: string;
  sentAt?: string;
  status: "scheduled" | "sent" | "failed";
  /** Also create an in-app alert for the seller. */
  inApp: boolean;
  createdAt: string;
};

export type Dac7InAppAlert = {
  id: string;
  audience: "seller" | "admin";
  sellerId?: string;
  caseId?: string;
  severity: "info" | "warn" | "critical";
  title: string;
  body: string;
  href?: string;
  createdAt: string;
  readAt?: string;
  sourceEmailId?: string;
};

export type ComplianceCaseSlice = {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  status: Dac7CaseStatus;
  salesCount: number;
  revenueEur: number;
  reportingYear: number;
  informationRequestedAt?: string;
  reminderStage: Dac7ReminderStage;
  reminder1SentAt?: string;
  reminder2SentAt?: string;
  restrictedAt?: string;
  payoutHeld: boolean;
  accountSuspended: boolean;
};

export type ComplianceClock = () => Date;

export const DAC7_DASHBOARD_URL = "/seller/compliance/dac7";
export const DAC7_ADMIN_CASE_URL = (sellerId: string) => `/admin/dac7/${sellerId}`;

function renderTemplate(
  templateId: Dac7EmailTemplateId,
  vars: {
    sellerName: string;
    year: number;
    dueDate: string;
    daysLeft?: number;
    correctionNote?: string;
    dashboardUrl: string;
  },
): { subject: string; body: string } {
  const link = vars.dashboardUrl;
  switch (templateId) {
    case "dac7_initial_request":
      return {
        subject: `Action required: DAC7 tax information for ${vars.year}`,
        body: `Hello ${vars.sellerName},\n\nCamelune must collect DAC7 tax information because you have marketplace transactions in ${vars.year}.\n\nPlease complete your DAC7 file by ${vars.dueDate}.\n\nThis is a platform legal obligation, not a new tax calculation for you.\n\nComplete your information: ${link}\n\nIf you do not respond, Camelune may hold payouts and suspend your seller account after the legal diligence period (minimum 60 days from this request, after two reminders).\n\n— Camelune Compliance`,
      };
    case "dac7_reminder_1":
      return {
        subject: `Reminder: complete your DAC7 information (${vars.daysLeft ?? ""} days left)`,
        body: `Hello ${vars.sellerName},\n\nThis is your first reminder. Your DAC7 tax information is still incomplete.\n\nDeadline: ${vars.dueDate}.\nContinue here: ${link}\n\n— Camelune Compliance`,
      };
    case "dac7_reminder_2":
      return {
        subject: `Second reminder: DAC7 — account suspension may apply`,
        body: `Hello ${vars.sellerName},\n\nThis is your second reminder regarding DAC7 information for ${vars.year}.\n\nIf your file is not completed, Camelune may hold payouts and suspend your seller account once at least 60 days have passed since the initial request.\n\nComplete now: ${link}\n\n— Camelune Compliance`,
      };
    case "dac7_request_correction":
      return {
        subject: `DAC7: information needs correction`,
        body: `Hello ${vars.sellerName},\n\nWe reviewed your DAC7 file and need corrections:\n\n${vars.correctionNote ?? "Please review the items flagged in your dashboard."}\n\nUpdate and resubmit: ${link}\n\n— Camelune Compliance`,
      };
    case "dac7_submitted":
      return {
        subject: `We received your DAC7 information`,
        body: `Hello ${vars.sellerName},\n\nYour DAC7 file was submitted and is in review. We will email you if anything else is required.\n\n— Camelune Compliance`,
      };
    case "dac7_verified":
      return {
        subject: `DAC7 information verified`,
        body: `Hello ${vars.sellerName},\n\nYour DAC7 information for ${vars.year} has been verified.\n\n— Camelune Compliance`,
      };
    case "dac7_payout_held":
      return {
        subject: `Payouts on hold — DAC7 information required`,
        body: `Hello ${vars.sellerName},\n\nPayouts on your Camelune seller account are on hold until required DAC7 information is provided and verified.\n\nComplete your file: ${link}\n\n— Camelune Compliance`,
      };
    case "dac7_account_suspended":
      return {
        subject: `Seller account suspended — DAC7 non-compliance`,
        body: `Hello ${vars.sellerName},\n\nYour Camelune seller account has been suspended because required DAC7 information was not provided after the initial request and two reminders, and at least 60 days have elapsed.\n\nPayouts remain on hold. Complete your DAC7 file and contact support if you need help restoring access.\n\n${link}\n\n— Camelune Compliance`,
      };
    case "dac7_restriction_lifted":
      return {
        subject: `DAC7 restrictions lifted`,
        body: `Hello ${vars.sellerName},\n\nDAC7-related restrictions on your account have been lifted.\n\n— Camelune Compliance`,
      };
    case "dac7_annual_reported":
      return {
        subject: `DAC7 report filed for ${vars.year}`,
        body: `Hello ${vars.sellerName},\n\nCamelune has included your reportable information in the DAC7 filing for ${vars.year}. You can review the summary in your dashboard.\n\n${link}\n\n— Camelune Compliance`,
      };
  }
}

function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export type ScheduleTickResult = {
  emails: Dac7EmailMessage[];
  alerts: Dac7InAppAlert[];
  casePatches: Array<{
    caseId: string;
    informationRequestedAt?: string;
    reminderStage?: Dac7ReminderStage;
    reminder1SentAt?: string;
    reminder2SentAt?: string;
    restrictedAt?: string;
    payoutHeld?: boolean;
    accountSuspended?: boolean;
    status?: Dac7CaseStatus;
    note?: string;
  }>;
};

/**
 * Production diligence scheduler.
 * Runs only for sellers with marketplace transactions who still owe information.
 */
export function runComplianceSchedule(
  cases: ComplianceCaseSlice[],
  existingEmails: Dac7EmailMessage[],
  now: Date,
  origin = "https://app.camelune.com",
): ScheduleTickResult {
  const emails: Dac7EmailMessage[] = [];
  const alerts: Dac7InAppAlert[] = [];
  const casePatches: ScheduleTickResult["casePatches"] = [];

  const already = (caseId: string, templateId: Dac7EmailTemplateId) =>
    existingEmails.some((e) => e.caseId === caseId && e.templateId === templateId && e.status !== "failed") ||
    emails.some((e) => e.caseId === caseId && e.templateId === templateId);

  for (const c of cases) {
    if (!hasTransactions(c.salesCount, c.revenueEur)) continue;
    if (!isAwaitingSellerInformation(c.status)) continue;
    if (c.accountSuspended) continue;

    const dashboardUrl = `${origin}${DAC7_DASHBOARD_URL}`;
    let requestedAt = c.informationRequestedAt ? new Date(c.informationRequestedAt) : undefined;
    const patch: ScheduleTickResult["casePatches"][number] = { caseId: c.id };

    // 1) Initial request when seller has transactions and owes info
    if (needsDiligenceReminders(c.status) && !requestedAt && !already(c.id, "dac7_initial_request")) {
      requestedAt = now;
      const due = addDays(now, DAC7_RESTRICTION_MIN_DAYS);
      const dueDate = due.toISOString().slice(0, 10);
      const content = renderTemplate("dac7_initial_request", {
        sellerName: c.sellerName,
        year: c.reportingYear,
        dueDate,
        dashboardUrl,
      });
      const email = buildEmail({
        templateId: "dac7_initial_request",
        caseId: c.id,
        sellerId: c.sellerId,
        to: c.sellerEmail,
        scheduledFor: now.toISOString(),
        sentAt: now.toISOString(),
        ...content,
      });
      emails.push(email);
      alerts.push(
        sellerAlert(c, "warn", "DAC7 information required", content.subject, email.id),
        adminAlert(
          c,
          "warn",
          "Initial DAC7 request sent",
          `${c.sellerName} has transactions and was asked to complete DAC7.`,
          email.id,
        ),
      );
      patch.informationRequestedAt = now.toISOString();
      patch.reminderStage = "initial_sent";
    }

    if (!requestedAt && !patch.informationRequestedAt) continue;
    const start = new Date(patch.informationRequestedAt ?? c.informationRequestedAt!);
    const elapsed = daysBetween(start, now);
    const dueDate = addDays(start, DAC7_RESTRICTION_MIN_DAYS).toISOString().slice(0, 10);
    const daysLeft = Math.max(0, DAC7_RESTRICTION_MIN_DAYS - elapsed);

    // Mark overdue after reminder 2 window if still incomplete
    if (
      needsDiligenceReminders(c.status) &&
      c.status !== "OVERDUE" &&
      elapsed >= DAC7_REMINDER_2_DAYS
    ) {
      patch.status = "OVERDUE";
      patch.note = "Marked overdue after second reminder window";
    }

    // 2) Reminder 1 at day 14
    if (
      needsDiligenceReminders(c.status) &&
      elapsed >= DAC7_REMINDER_1_DAYS &&
      !c.reminder1SentAt &&
      !already(c.id, "dac7_reminder_1")
    ) {
      const content = renderTemplate("dac7_reminder_1", {
        sellerName: c.sellerName,
        year: c.reportingYear,
        dueDate,
        daysLeft,
        dashboardUrl,
      });
      const email = buildEmail({
        templateId: "dac7_reminder_1",
        caseId: c.id,
        sellerId: c.sellerId,
        to: c.sellerEmail,
        scheduledFor: now.toISOString(),
        sentAt: now.toISOString(),
        ...content,
      });
      emails.push(email);
      alerts.push(
        sellerAlert(c, "warn", "DAC7 reminder", content.subject, email.id),
        adminAlert(c, "warn", "Reminder 1 sent", `${c.sellerName} — day ${elapsed}`, email.id),
      );
      patch.reminder1SentAt = now.toISOString();
      patch.reminderStage = "reminder_1_sent";
    }

    // 3) Reminder 2 at day 30
    if (
      needsDiligenceReminders(c.status) &&
      elapsed >= DAC7_REMINDER_2_DAYS &&
      !c.reminder2SentAt &&
      !already(c.id, "dac7_reminder_2")
    ) {
      const content = renderTemplate("dac7_reminder_2", {
        sellerName: c.sellerName,
        year: c.reportingYear,
        dueDate,
        daysLeft,
        dashboardUrl,
      });
      const email = buildEmail({
        templateId: "dac7_reminder_2",
        caseId: c.id,
        sellerId: c.sellerId,
        to: c.sellerEmail,
        scheduledFor: now.toISOString(),
        sentAt: now.toISOString(),
        ...content,
      });
      emails.push(email);
      alerts.push(
        sellerAlert(c, "critical", "Second DAC7 reminder", content.subject, email.id),
        adminAlert(
          c,
          "critical",
          "Reminder 2 sent — escalation",
          `${c.sellerName} — suspension eligible from day ${DAC7_RESTRICTION_MIN_DAYS}`,
          email.id,
        ),
      );
      patch.reminder2SentAt = now.toISOString();
      patch.reminderStage = "reminder_2_sent";
    }

    // 4) Auto restriction at day ≥ 60 if still awaiting information
    const stillAwaiting =
      isAwaitingSellerInformation(patch.status ?? c.status) &&
      (patch.status ?? c.status) !== "ACCOUNT_RESTRICTED";

    if (
      stillAwaiting &&
      elapsed >= DAC7_RESTRICTION_MIN_DAYS &&
      !c.accountSuspended &&
      !already(c.id, "dac7_account_suspended")
    ) {
      const content = renderTemplate("dac7_account_suspended", {
        sellerName: c.sellerName,
        year: c.reportingYear,
        dueDate,
        dashboardUrl,
      });
      const email = buildEmail({
        templateId: "dac7_account_suspended",
        caseId: c.id,
        sellerId: c.sellerId,
        to: c.sellerEmail,
        scheduledFor: now.toISOString(),
        sentAt: now.toISOString(),
        ...content,
      });
      emails.push(email);
      alerts.push(
        sellerAlert(
          c,
          "critical",
          "Account suspended",
          "Your seller account is suspended for missing DAC7 information. Payouts are on hold.",
          email.id,
        ),
        adminAlert(
          c,
          "critical",
          "Auto account suspension",
          `${c.sellerName} suspended after ${elapsed} days (initial + 2 reminders, ≥ ${DAC7_RESTRICTION_MIN_DAYS} days).`,
          email.id,
        ),
      );
      patch.status = "ACCOUNT_RESTRICTED";
      patch.accountSuspended = true;
      patch.payoutHeld = true;
      patch.restrictedAt = now.toISOString();
      patch.reminderStage = "restriction_applied";
      patch.note = `Automatic suspension after diligence period (${elapsed} days)`;
    }

    if (Object.keys(patch).length > 1) casePatches.push(patch);
  }

  return { emails, alerts, casePatches };
}

function buildEmail(input: {
  templateId: Dac7EmailTemplateId;
  caseId: string;
  sellerId: string;
  to: string;
  subject: string;
  body: string;
  scheduledFor: string;
  sentAt?: string;
}): Dac7EmailMessage {
  return {
    id: newId("mail"),
    templateId: input.templateId,
    caseId: input.caseId,
    sellerId: input.sellerId,
    to: input.to,
    subject: input.subject,
    body: input.body,
    channel: "email",
    scheduledFor: input.scheduledFor,
    sentAt: input.sentAt,
    status: input.sentAt ? "sent" : "scheduled",
    inApp: true,
    createdAt: input.scheduledFor,
  };
}

function sellerAlert(
  c: ComplianceCaseSlice,
  severity: Dac7InAppAlert["severity"],
  title: string,
  body: string,
  sourceEmailId: string,
): Dac7InAppAlert {
  return {
    id: newId("alert"),
    audience: "seller",
    sellerId: c.sellerId,
    caseId: c.id,
    severity,
    title,
    body,
    href: DAC7_DASHBOARD_URL,
    createdAt: new Date().toISOString(),
    sourceEmailId,
  };
}

function adminAlert(
  c: ComplianceCaseSlice,
  severity: Dac7InAppAlert["severity"],
  title: string,
  body: string,
  sourceEmailId: string,
): Dac7InAppAlert {
  return {
    id: newId("alert"),
    audience: "admin",
    sellerId: c.sellerId,
    caseId: c.id,
    severity,
    title,
    body,
    href: DAC7_ADMIN_CASE_URL(c.sellerId),
    createdAt: new Date().toISOString(),
    sourceEmailId,
  };
}

/** Queue an immediate operational email (correction, verified, etc.). */
export function createOperationalEmail(input: {
  templateId: Dac7EmailTemplateId;
  caseId: string;
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  year: number;
  correctionNote?: string;
  now?: Date;
  origin?: string;
}): { email: Dac7EmailMessage; sellerAlert: Dac7InAppAlert; adminAlert: Dac7InAppAlert } {
  const now = input.now ?? new Date();
  const dashboardUrl = `${input.origin ?? "https://app.camelune.com"}${DAC7_DASHBOARD_URL}`;
  const content = renderTemplate(input.templateId, {
    sellerName: input.sellerName,
    year: input.year,
    dueDate: addDays(now, 14).toISOString().slice(0, 10),
    correctionNote: input.correctionNote,
    dashboardUrl,
  });
  const email = buildEmail({
    templateId: input.templateId,
    caseId: input.caseId,
    sellerId: input.sellerId,
    to: input.sellerEmail,
    scheduledFor: now.toISOString(),
    sentAt: now.toISOString(),
    ...content,
  });
  const severity: Dac7InAppAlert["severity"] =
    input.templateId === "dac7_account_suspended" || input.templateId === "dac7_payout_held"
      ? "critical"
      : input.templateId === "dac7_request_correction" || input.templateId === "dac7_reminder_2"
        ? "warn"
        : "info";
  return {
    email,
    sellerAlert: {
      id: newId("alert"),
      audience: "seller",
      sellerId: input.sellerId,
      caseId: input.caseId,
      severity,
      title: content.subject,
      body: content.body.slice(0, 240),
      href: DAC7_DASHBOARD_URL,
      createdAt: now.toISOString(),
      sourceEmailId: email.id,
    },
    adminAlert: {
      id: newId("alert"),
      audience: "admin",
      sellerId: input.sellerId,
      caseId: input.caseId,
      severity,
      title: `Email sent: ${input.templateId}`,
      body: `${input.sellerName} <${input.sellerEmail}>`,
      href: DAC7_ADMIN_CASE_URL(input.sellerId),
      createdAt: now.toISOString(),
      sourceEmailId: email.id,
    },
  };
}
