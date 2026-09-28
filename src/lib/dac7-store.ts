import { useSyncExternalStore } from "react";
import {
  canTransition,
  hasTransactions,
  isExcludedByThreshold,
  isThresholdReached,
  nextStatus,
  type Dac7CaseStatus,
  type Dac7ReminderStage,
  type Dac7TransitionAction,
} from "@/lib/dac7-state";
import {
  createOperationalEmail,
  runComplianceSchedule,
  type Dac7EmailMessage,
  type Dac7InAppAlert,
} from "@/lib/dac7-notifications";
import { DAC7_SELLER } from "@/lib/dac7-data";

const STORAGE_KEY = "camelune-dac7-store-v2";

export type Dac7ProfileFields = {
  companyName: string;
  registeredAddress: string;
  companyCountry: string;
  legalRepresentative: string;
  registrationNumber: string;
  taxpayerId: string;
  taxpayerIssuingCountry: string;
  permanentEstablishment: string;
  vatNumber: string;
  bankAccountHolder: string;
  bankIban: string;
  bankCurrency: string;
};

export type Dac7AuditEvent = {
  id: string;
  at: string;
  actor: "seller" | "admin" | "finance" | "system";
  action: string;
  note?: string;
  fromStatus?: Dac7CaseStatus;
  toStatus?: Dac7CaseStatus;
};

export type Dac7Case = {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  reportingYear: number;
  status: Dac7CaseStatus;
  salesCount: number;
  revenueEur: number;
  profile: Dac7ProfileFields;
  declarationAccepted: boolean;
  declarationAcceptedAt?: string;
  correctionNote?: string;
  assignee?: string;
  dueDate?: string;
  f7000Reference?: string;
  f7000SubmittedAt?: string;
  receiptAcceptedAt?: string;
  history: Dac7AuditEvent[];
  updatedAt: string;
  /** Diligence clock start (initial information request). */
  informationRequestedAt?: string;
  reminderStage: Dac7ReminderStage;
  reminder1SentAt?: string;
  reminder2SentAt?: string;
  restrictedAt?: string;
  payoutHeld: boolean;
  accountSuspended: boolean;
};

export type Dac7StoreState = {
  cases: Dac7Case[];
  currentSellerCaseId: string;
  emails: Dac7EmailMessage[];
  alerts: Dac7InAppAlert[];
  /** Injectable clock for tests / deterministic jobs. */
  clockMs: number | null;
};

let clockOverride: Date | null = null;

export function setComplianceClock(date: Date | null) {
  clockOverride = date;
}

function now(): Date {
  return clockOverride ?? new Date();
}

function nowIso() {
  return now().toISOString();
}

function event(
  actor: Dac7AuditEvent["actor"],
  action: string,
  extra?: Partial<Dac7AuditEvent>,
): Dac7AuditEvent {
  return {
    id: `evt-${Math.random().toString(36).slice(2, 10)}`,
    at: nowIso(),
    actor,
    action,
    ...extra,
  };
}

function defaultProfile(): Dac7ProfileFields {
  return {
    companyName: DAC7_SELLER.companyName,
    registeredAddress: DAC7_SELLER.registeredAddress,
    companyCountry: DAC7_SELLER.companyCountry,
    legalRepresentative: DAC7_SELLER.legalRepresentative,
    registrationNumber: DAC7_SELLER.registrationNumber,
    taxpayerId: DAC7_SELLER.taxpayerId,
    taxpayerIssuingCountry: DAC7_SELLER.taxpayerIssuingCountry,
    permanentEstablishment: DAC7_SELLER.permanentEstablishment,
    vatNumber: DAC7_SELLER.vatNumber,
    bankAccountHolder: DAC7_SELLER.bankAccountHolder,
    bankIban: DAC7_SELLER.bankIban,
    bankCurrency: DAC7_SELLER.bankCurrency,
  };
}

function daysAgo(days: number): string {
  const d = now();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString();
}

function seedCases(): Dac7Case[] {
  const year = new Date().getUTCFullYear();
  return [
    {
      id: "case-atelier",
      sellerId: "seller-atelier",
      sellerName: "Atelier Lune SRL",
      sellerEmail: "veronica@atelierlune.ro",
      reportingYear: year,
      status: "IN_PROGRESS",
      salesCount: 17,
      revenueEur: 1240,
      profile: defaultProfile(),
      declarationAccepted: false,
      dueDate: `${year}-12-31`,
      reminderStage: "none",
      payoutHeld: false,
      accountSuspended: false,
      history: [
        event("system", "Created DAC7 file for reporting year", { toStatus: "NOT_STARTED" }),
        event("seller", "Started completing information", {
          fromStatus: "NOT_STARTED",
          toStatus: "IN_PROGRESS",
        }),
      ],
      updatedAt: nowIso(),
    },
    {
      id: "case-chrono",
      sellerId: "seller-chrono",
      sellerName: "Chrono House GmbH",
      sellerEmail: "ops@chronohouse.de",
      reportingYear: year,
      status: "SUBMITTED",
      salesCount: 42,
      revenueEur: 9800,
      profile: {
        companyName: "Chrono House GmbH",
        registeredAddress: "Friedrichstr. 88, Berlin",
        companyCountry: "Germany",
        legalRepresentative: "Hans Meier",
        registrationNumber: "HRB 123456",
        taxpayerId: "DE123456789",
        taxpayerIssuingCountry: "Germany",
        permanentEstablishment: "Yes — Germany",
        vatNumber: "DE 123456789",
        bankAccountHolder: "Chrono House GmbH",
        bankIban: "DE •••• •••• •••• 8899",
        bankCurrency: "EUR",
      },
      declarationAccepted: true,
      declarationAcceptedAt: daysAgo(20),
      informationRequestedAt: daysAgo(40),
      reminderStage: "reminder_1_sent",
      reminder1SentAt: daysAgo(26),
      dueDate: `${year}-12-31`,
      payoutHeld: false,
      accountSuspended: false,
      history: [
        event("system", "Initial DAC7 information request emailed", {
          toStatus: "IN_PROGRESS",
        }),
        event("seller", "Submitted DAC7 information for review", {
          fromStatus: "IN_PROGRESS",
          toStatus: "SUBMITTED",
        }),
      ],
      updatedAt: nowIso(),
    },
    {
      id: "case-paris",
      sellerId: "seller-paris",
      sellerName: "Maison Horloge SAS",
      sellerEmail: "admin@maisonhorloge.fr",
      reportingYear: year,
      status: "NEEDS_CORRECTION",
      salesCount: 55,
      revenueEur: 14200,
      profile: {
        companyName: "Maison Horloge SAS",
        registeredAddress: "12 Rue du Temple, Paris",
        companyCountry: "France",
        legalRepresentative: "Claire Dupont",
        registrationNumber: "RCS Paris 812 345 678",
        taxpayerId: "",
        taxpayerIssuingCountry: "France",
        permanentEstablishment: "Yes — France",
        vatNumber: "FR 12 345678901",
        bankAccountHolder: "Maison Horloge SAS",
        bankIban: "FR •••• •••• •••• 2211",
        bankCurrency: "EUR",
      },
      declarationAccepted: true,
      declarationAcceptedAt: daysAgo(25),
      informationRequestedAt: daysAgo(35),
      reminderStage: "reminder_2_sent",
      reminder1SentAt: daysAgo(21),
      reminder2SentAt: daysAgo(5),
      correctionNote: "Taxpayer ID is missing. Please add your French TIN and resubmit.",
      dueDate: daysAgo(-10).slice(0, 10),
      assignee: "Ana Popescu",
      payoutHeld: false,
      accountSuspended: false,
      history: [
        event("admin", "Requested correction", {
          fromStatus: "UNDER_REVIEW",
          toStatus: "NEEDS_CORRECTION",
          note: "Taxpayer ID is missing.",
        }),
      ],
      updatedAt: nowIso(),
    },
    {
      id: "case-nordic",
      sellerId: "seller-nordic",
      sellerName: "Nordic Time AB",
      sellerEmail: "finance@nordictime.se",
      reportingYear: year,
      status: "REPORTABLE",
      salesCount: 61,
      revenueEur: 22100,
      profile: {
        companyName: "Nordic Time AB",
        registeredAddress: "Kungsgatan 1, Stockholm",
        companyCountry: "Sweden",
        legalRepresentative: "Erik Lind",
        registrationNumber: "556677-8899",
        taxpayerId: "5566778899",
        taxpayerIssuingCountry: "Sweden",
        permanentEstablishment: "Yes — Sweden",
        vatNumber: "SE 556677889901",
        bankAccountHolder: "Nordic Time AB",
        bankIban: "SE •••• •••• •••• 3344",
        bankCurrency: "EUR",
      },
      declarationAccepted: true,
      declarationAcceptedAt: daysAgo(60),
      informationRequestedAt: daysAgo(90),
      reminderStage: "initial_sent",
      dueDate: `${year}-12-31`,
      assignee: "Ana Popescu",
      payoutHeld: false,
      accountSuspended: false,
      history: [
        event("admin", "Approved DAC7 profile", { toStatus: "VERIFIED" }),
        event("system", "Marked reportable after threshold check", {
          fromStatus: "VERIFIED",
          toStatus: "REPORTABLE",
        }),
      ],
      updatedAt: nowIso(),
    },
    {
      /** Non-compliant past day 60 — scheduler will suspend on first tick if not already. */
      id: "case-late",
      sellerId: "seller-late",
      sellerName: "Late Goods SRL",
      sellerEmail: "owner@lategoods.ro",
      reportingYear: year,
      status: "IN_PROGRESS",
      salesCount: 12,
      revenueEur: 890,
      profile: {
        ...defaultProfile(),
        companyName: "Late Goods SRL",
        taxpayerId: "",
      },
      declarationAccepted: false,
      informationRequestedAt: daysAgo(61),
      reminderStage: "reminder_2_sent",
      reminder1SentAt: daysAgo(47),
      reminder2SentAt: daysAgo(31),
      dueDate: daysAgo(1).slice(0, 10),
      payoutHeld: false,
      accountSuspended: false,
      history: [
        event("system", "Initial DAC7 information request emailed"),
        event("system", "Reminder 1 emailed"),
        event("system", "Reminder 2 emailed"),
      ],
      updatedAt: nowIso(),
    },
  ];
}

function createInitialState(): Dac7StoreState {
  return {
    cases: seedCases(),
    currentSellerCaseId: "case-atelier",
    emails: [],
    alerts: [],
    clockMs: null,
  };
}

function loadState(): Dac7StoreState {
  if (typeof window === "undefined") return createInitialState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as Dac7StoreState;
    if (!parsed?.cases?.length) return createInitialState();
    return {
      ...createInitialState(),
      ...parsed,
      emails: parsed.emails ?? [],
      alerts: parsed.alerts ?? [],
    };
  } catch {
    return createInitialState();
  }
}

let state: Dac7StoreState = createInitialState();
let hydrated = false;
const listeners = new Set<() => void>();

function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  state = loadState();
  hydrated = true;
}

function persist() {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

function updateCase(caseId: string, updater: (c: Dac7Case) => Dac7Case) {
  state = {
    ...state,
    cases: state.cases.map((c) => (c.id === caseId ? updater(c) : c)),
  };
}

function pushMailAndAlerts(email: Dac7EmailMessage, sellerA: Dac7InAppAlert, adminA: Dac7InAppAlert) {
  state = {
    ...state,
    emails: [...state.emails, email],
    alerts: [...state.alerts, sellerA, adminA],
  };
}

function applyTransition(
  caseId: string,
  action: Dac7TransitionAction,
  actor: Dac7AuditEvent["actor"],
  note?: string,
  patch?: Partial<Dac7Case>,
) {
  const current = state.cases.find((c) => c.id === caseId);
  if (!current) throw new Error(`Case not found: ${caseId}`);
  if (!canTransition(current.status, action)) {
    throw new Error(`DAC7_INVALID_STATE_TRANSITION: ${current.status} + ${action}`);
  }
  const to = nextStatus(current.status, action);
  updateCase(caseId, (c) => ({
    ...c,
    ...patch,
    status: to,
    updatedAt: nowIso(),
    history: [
      ...c.history,
      event(actor, note ?? action, {
        fromStatus: c.status,
        toStatus: to,
        note,
      }),
    ],
  }));
}

function processJobsInternal() {
  const result = runComplianceSchedule(
    state.cases.map((c) => ({
      id: c.id,
      sellerId: c.sellerId,
      sellerName: c.sellerName,
      sellerEmail: c.sellerEmail,
      status: c.status,
      salesCount: c.salesCount,
      revenueEur: c.revenueEur,
      reportingYear: c.reportingYear,
      informationRequestedAt: c.informationRequestedAt,
      reminderStage: c.reminderStage,
      reminder1SentAt: c.reminder1SentAt,
      reminder2SentAt: c.reminder2SentAt,
      restrictedAt: c.restrictedAt,
      payoutHeld: c.payoutHeld,
      accountSuspended: c.accountSuspended,
    })),
    state.emails,
    now(),
    typeof window !== "undefined" ? window.location.origin : "https://app.camelune.com",
  );

  if (!result.emails.length && !result.casePatches.length) return;

  state = {
    ...state,
    emails: [...state.emails, ...result.emails],
    alerts: [...state.alerts, ...result.alerts],
  };

  for (const patch of result.casePatches) {
    updateCase(patch.caseId, (c) => {
      const next: Dac7Case = {
        ...c,
        informationRequestedAt: patch.informationRequestedAt ?? c.informationRequestedAt,
        reminderStage: patch.reminderStage ?? c.reminderStage,
        reminder1SentAt: patch.reminder1SentAt ?? c.reminder1SentAt,
        reminder2SentAt: patch.reminder2SentAt ?? c.reminder2SentAt,
        restrictedAt: patch.restrictedAt ?? c.restrictedAt,
        payoutHeld: patch.payoutHeld ?? c.payoutHeld,
        accountSuspended: patch.accountSuspended ?? c.accountSuspended,
        updatedAt: nowIso(),
      };
      if (patch.status && patch.status !== c.status) {
        next.status = patch.status;
        next.history = [
          ...c.history,
          event("system", patch.note ?? `Status → ${patch.status}`, {
            fromStatus: c.status,
            toStatus: patch.status,
            note: patch.note,
          }),
        ];
      } else if (patch.note) {
        next.history = [...c.history, event("system", patch.note)];
      }
      return next;
    });
  }
}

export const dac7Store = {
  getSnapshot(): Dac7StoreState {
    ensureHydrated();
    return state;
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  /** Run diligence emails + auto-suspension. Call on app entry and after mutations. */
  processComplianceJobs() {
    ensureHydrated();
    processJobsInternal();
    emit();
  },
  reset() {
    clockOverride = null;
    state = createInitialState();
    processJobsInternal();
    emit();
  },
  getCase(caseId: string) {
    ensureHydrated();
    return state.cases.find((c) => c.id === caseId);
  },
  getCurrentSellerCase() {
    ensureHydrated();
    return state.cases.find((c) => c.id === state.currentSellerCaseId)!;
  },
  markAlertRead(alertId: string) {
    state = {
      ...state,
      alerts: state.alerts.map((a) =>
        a.id === alertId ? { ...a, readAt: a.readAt ?? nowIso() } : a,
      ),
    };
    emit();
  },
  markAllAlertsRead(audience: "seller" | "admin", sellerId?: string) {
    state = {
      ...state,
      alerts: state.alerts.map((a) => {
        if (a.audience !== audience) return a;
        if (audience === "seller" && sellerId && a.sellerId !== sellerId) return a;
        return { ...a, readAt: a.readAt ?? nowIso() };
      }),
    };
    emit();
  },
  saveSellerDraft(caseId: string, profile: Partial<Dac7ProfileFields>) {
    const current = this.getCase(caseId);
    if (!current) return;
    if (current.status === "NOT_STARTED" && canTransition(current.status, "seller.save")) {
      applyTransition(caseId, "seller.save", "seller", "Saved draft", {
        profile: { ...current.profile, ...profile },
        declarationAccepted: false,
      });
      emit();
      return;
    }
    if (
      ["IN_PROGRESS", "NEEDS_CORRECTION", "OVERDUE", "PAYMENT_RESTRICTED", "ACCOUNT_RESTRICTED"].includes(
        current.status,
      )
    ) {
      if (current.status === "OVERDUE" && canTransition("OVERDUE", "seller.save")) {
        applyTransition(caseId, "seller.save", "seller", "Saved draft after overdue", {
          profile: { ...current.profile, ...profile },
        });
      } else {
        updateCase(caseId, (c) => ({
          ...c,
          profile: { ...c.profile, ...profile },
          updatedAt: nowIso(),
          history: [...c.history, event("seller", "Saved draft")],
        }));
      }
      emit();
    }
  },
  acceptDeclaration(caseId: string, accepted: boolean) {
    updateCase(caseId, (c) => ({
      ...c,
      declarationAccepted: accepted,
      declarationAcceptedAt: accepted ? nowIso() : undefined,
      updatedAt: nowIso(),
    }));
    emit();
  },
  submitSeller(caseId: string) {
    const current = this.getCase(caseId);
    if (!current) throw new Error("Case not found");
    if (!current.declarationAccepted) {
      throw new Error("Confirm your information before submitting.");
    }
    if (!profileComplete(current.profile)) {
      throw new Error("Complete all required fields before submitting.");
    }
    const action =
      current.status === "NEEDS_CORRECTION" ||
      current.status === "PAYMENT_RESTRICTED" ||
      current.status === "ACCOUNT_RESTRICTED" ||
      current.status === "OVERDUE"
        ? "seller.resubmit"
        : "seller.submit";
    applyTransition(caseId, action, "seller", "Submitted for review", {
      correctionNote: undefined,
    });
    const c = this.getCase(caseId)!;
    const mail = createOperationalEmail({
      templateId: "dac7_submitted",
      caseId: c.id,
      sellerId: c.sellerId,
      sellerName: c.sellerName,
      sellerEmail: c.sellerEmail,
      year: c.reportingYear,
      now: now(),
      origin: typeof window !== "undefined" ? window.location.origin : undefined,
    });
    pushMailAndAlerts(mail.email, mail.sellerAlert, mail.adminAlert);
    emit();
  },
  adminStartReview(caseId: string, assignee = "Ana Popescu") {
    applyTransition(caseId, "start_review", "admin", "Started review", { assignee });
    emit();
  },
  adminRequestCorrection(caseId: string, note: string) {
    applyTransition(caseId, "request_correction", "admin", "Requested correction", {
      correctionNote: note,
    });
    const c = this.getCase(caseId)!;
    const mail = createOperationalEmail({
      templateId: "dac7_request_correction",
      caseId: c.id,
      sellerId: c.sellerId,
      sellerName: c.sellerName,
      sellerEmail: c.sellerEmail,
      year: c.reportingYear,
      correctionNote: note,
      now: now(),
      origin: typeof window !== "undefined" ? window.location.origin : undefined,
    });
    pushMailAndAlerts(mail.email, mail.sellerAlert, mail.adminAlert);
    emit();
  },
  adminApprove(caseId: string) {
    applyTransition(caseId, "approve", "admin", "Approved profile");
    const c = this.getCase(caseId);
    if (!c) return;
    if (isThresholdReached(c.salesCount, c.revenueEur)) {
      applyTransition(caseId, "mark_reportable", "system", "Marked reportable (threshold reached)");
    } else if (isExcludedByThreshold(c.salesCount, c.revenueEur)) {
      applyTransition(caseId, "mark_excluded", "system", "Marked excluded (below threshold)");
    }
    const after = this.getCase(caseId)!;
    const mail = createOperationalEmail({
      templateId: "dac7_verified",
      caseId: after.id,
      sellerId: after.sellerId,
      sellerName: after.sellerName,
      sellerEmail: after.sellerEmail,
      year: after.reportingYear,
      now: now(),
      origin: typeof window !== "undefined" ? window.location.origin : undefined,
    });
    pushMailAndAlerts(mail.email, mail.sellerAlert, mail.adminAlert);
    emit();
  },
  adminRestrictPayout(caseId: string, note: string) {
    applyTransition(caseId, "restrict_payout", "admin", note || "Restricted payouts", {
      payoutHeld: true,
    });
    const c = this.getCase(caseId)!;
    const mail = createOperationalEmail({
      templateId: "dac7_payout_held",
      caseId: c.id,
      sellerId: c.sellerId,
      sellerName: c.sellerName,
      sellerEmail: c.sellerEmail,
      year: c.reportingYear,
      now: now(),
      origin: typeof window !== "undefined" ? window.location.origin : undefined,
    });
    pushMailAndAlerts(mail.email, mail.sellerAlert, mail.adminAlert);
    emit();
  },
  adminRestrictAccount(caseId: string, note: string) {
    applyTransition(caseId, "restrict_account", "admin", note || "Account suspended", {
      accountSuspended: true,
      payoutHeld: true,
      restrictedAt: nowIso(),
      reminderStage: "restriction_applied",
    });
    const c = this.getCase(caseId)!;
    const mail = createOperationalEmail({
      templateId: "dac7_account_suspended",
      caseId: c.id,
      sellerId: c.sellerId,
      sellerName: c.sellerName,
      sellerEmail: c.sellerEmail,
      year: c.reportingYear,
      now: now(),
      origin: typeof window !== "undefined" ? window.location.origin : undefined,
    });
    pushMailAndAlerts(mail.email, mail.sellerAlert, mail.adminAlert);
    emit();
  },
  adminRemoveRestriction(caseId: string) {
    applyTransition(caseId, "remove_restriction", "admin", "Removed DAC7 restrictions", {
      payoutHeld: false,
      accountSuspended: false,
    });
    const c = this.getCase(caseId)!;
    const mail = createOperationalEmail({
      templateId: "dac7_restriction_lifted",
      caseId: c.id,
      sellerId: c.sellerId,
      sellerName: c.sellerName,
      sellerEmail: c.sellerEmail,
      year: c.reportingYear,
      now: now(),
      origin: typeof window !== "undefined" ? window.location.origin : undefined,
    });
    pushMailAndAlerts(mail.email, mail.sellerAlert, mail.adminAlert);
    emit();
  },
  financeReadyForF7000(caseId: string) {
    applyTransition(caseId, "ready_for_f7000", "finance", "Closed period — ready for F7000");
    emit();
  },
  financeSubmitF7000(caseId: string) {
    const ref = `F7000-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000 + 10000)}`;
    applyTransition(caseId, "submit_f7000", "finance", "Submitted F7000", {
      f7000Reference: ref,
      f7000SubmittedAt: nowIso(),
    });
    emit();
  },
  financeAcceptReceipt(caseId: string) {
    applyTransition(caseId, "accept_receipt", "finance", "ANAF receipt accepted", {
      receiptAcceptedAt: nowIso(),
    });
    const c = this.getCase(caseId)!;
    const mail = createOperationalEmail({
      templateId: "dac7_annual_reported",
      caseId: c.id,
      sellerId: c.sellerId,
      sellerName: c.sellerName,
      sellerEmail: c.sellerEmail,
      year: c.reportingYear,
      now: now(),
      origin: typeof window !== "undefined" ? window.location.origin : undefined,
    });
    pushMailAndAlerts(mail.email, mail.sellerAlert, mail.adminAlert);
    emit();
  },
  financeOpenCorrection(caseId: string, note: string) {
    applyTransition(caseId, "open_correction", "finance", note || "Opened correction version");
    emit();
  },
};

export function profileComplete(profile: Dac7ProfileFields): boolean {
  return Boolean(
    profile.companyName.trim() &&
      profile.registeredAddress.trim() &&
      profile.companyCountry.trim() &&
      profile.legalRepresentative.trim() &&
      profile.registrationNumber.trim() &&
      profile.taxpayerId.trim() &&
      profile.taxpayerIssuingCountry.trim() &&
      profile.vatNumber.trim() &&
      profile.bankAccountHolder.trim() &&
      profile.bankIban.trim(),
  );
}

export function profileMissingFields(profile: Dac7ProfileFields): string[] {
  const checks: [keyof Dac7ProfileFields, string][] = [
    ["companyName", "Company name"],
    ["registeredAddress", "Registered address"],
    ["legalRepresentative", "Legal representative"],
    ["registrationNumber", "Commercial registration"],
    ["taxpayerId", "Taxpayer ID"],
    ["vatNumber", "VAT number"],
    ["bankIban", "Bank account"],
  ];
  return checks.filter(([key]) => !String(profile[key] ?? "").trim()).map(([, label]) => label);
}

export function useDac7Store(): Dac7StoreState {
  return useSyncExternalStore(
    dac7Store.subscribe,
    () => dac7Store.getSnapshot(),
    () => createInitialState(),
  );
}

export function useCurrentSellerCase(): Dac7Case {
  const snap = useDac7Store();
  return snap.cases.find((c) => c.id === snap.currentSellerCaseId) ?? snap.cases[0];
}

export function sellerUnreadAlerts(state: Dac7StoreState, sellerId: string) {
  return state.alerts.filter(
    (a) => a.audience === "seller" && a.sellerId === sellerId && !a.readAt,
  );
}

export function adminUnreadAlerts(state: Dac7StoreState) {
  return state.alerts.filter((a) => a.audience === "admin" && !a.readAt);
}

export function sellerHasActiveTransactions(c: Dac7Case) {
  return hasTransactions(c.salesCount, c.revenueEur);
}
