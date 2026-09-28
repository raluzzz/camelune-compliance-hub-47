import { useSyncExternalStore } from "react";
import {
  canTransition,
  isExcludedByThreshold,
  isThresholdReached,
  nextStatus,
  type Dac7AdminAction,
  type Dac7CaseStatus,
} from "@/lib/dac7-state";
import { DAC7_SELLER } from "@/lib/dac7-data";

const STORAGE_KEY = "camelune-dac7-store-v1";

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
};

export type Dac7StoreState = {
  cases: Dac7Case[];
  /** The logged-in seller case id used by the seller UI. */
  currentSellerCaseId: string;
};

function nowIso() {
  return new Date().toISOString();
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

function seedCases(): Dac7Case[] {
  const year = 2026;
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
      history: [
        event("system", "Created DAC7 file for reporting year", {
          toStatus: "NOT_STARTED",
        }),
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
      declarationAcceptedAt: "2026-03-01T10:00:00.000Z",
      dueDate: `${year}-12-31`,
      assignee: undefined,
      history: [
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
      declarationAcceptedAt: "2026-02-10T09:00:00.000Z",
      correctionNote: "Taxpayer ID is missing. Please add your French TIN and resubmit.",
      dueDate: "2026-04-15",
      assignee: "Ana Popescu",
      history: [
        event("seller", "Submitted DAC7 information for review", {
          toStatus: "SUBMITTED",
        }),
        event("admin", "Started review", {
          fromStatus: "SUBMITTED",
          toStatus: "UNDER_REVIEW",
        }),
        event("admin", "Requested correction", {
          fromStatus: "UNDER_REVIEW",
          toStatus: "NEEDS_CORRECTION",
          note: "Taxpayer ID is missing.",
        }),
      ],
      updatedAt: nowIso(),
    },
    {
      id: "case-verified",
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
      declarationAcceptedAt: "2026-01-20T12:00:00.000Z",
      dueDate: `${year}-12-31`,
      assignee: "Ana Popescu",
      history: [
        event("admin", "Approved DAC7 profile", { toStatus: "VERIFIED" }),
        event("system", "Marked reportable after threshold check", {
          fromStatus: "VERIFIED",
          toStatus: "REPORTABLE",
        }),
      ],
      updatedAt: nowIso(),
    },
  ];
}

function createInitialState(): Dac7StoreState {
  return {
    cases: seedCases(),
    currentSellerCaseId: "case-atelier",
  };
}

function loadState(): Dac7StoreState {
  if (typeof window === "undefined") return createInitialState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as Dac7StoreState;
    if (!parsed?.cases?.length) return createInitialState();
    return parsed;
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
  emit();
}

function applyTransition(
  caseId: string,
  action: Dac7AdminAction | "seller.save" | "seller.submit" | "seller.resubmit",
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

export const dac7Store = {
  getSnapshot(): Dac7StoreState {
    ensureHydrated();
    return state;
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  reset() {
    state = createInitialState();
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
  saveSellerDraft(caseId: string, profile: Partial<Dac7ProfileFields>) {
    const current = this.getCase(caseId);
    if (!current) return;
    const action = current.status === "NOT_STARTED" ? "seller.save" : "seller.save";
    if (current.status === "NOT_STARTED" || current.status === "IN_PROGRESS") {
      if (canTransition(current.status, action) && current.status === "NOT_STARTED") {
        applyTransition(caseId, "seller.save", "seller", "Saved draft", {
          profile: { ...current.profile, ...profile },
          declarationAccepted: false,
        });
        return;
      }
      updateCase(caseId, (c) => ({
        ...c,
        profile: { ...c.profile, ...profile },
        updatedAt: nowIso(),
        history: [...c.history, event("seller", "Saved draft")],
      }));
      return;
    }
    if (current.status === "NEEDS_CORRECTION" || current.status === "PAYMENT_RESTRICTED") {
      updateCase(caseId, (c) => ({
        ...c,
        profile: { ...c.profile, ...profile },
        updatedAt: nowIso(),
        history: [...c.history, event("seller", "Updated information")],
      }));
    }
  },
  acceptDeclaration(caseId: string, accepted: boolean) {
    updateCase(caseId, (c) => ({
      ...c,
      declarationAccepted: accepted,
      declarationAcceptedAt: accepted ? nowIso() : undefined,
      updatedAt: nowIso(),
    }));
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
      current.status === "NEEDS_CORRECTION" || current.status === "PAYMENT_RESTRICTED"
        ? "seller.resubmit"
        : "seller.submit";
    applyTransition(caseId, action, "seller", "Submitted for review", {
      correctionNote: undefined,
    });
  },
  adminStartReview(caseId: string, assignee = "Ana Popescu") {
    applyTransition(caseId, "start_review", "admin", "Started review", { assignee });
  },
  adminRequestCorrection(caseId: string, note: string) {
    applyTransition(caseId, "request_correction", "admin", "Requested correction", {
      correctionNote: note,
    });
  },
  adminApprove(caseId: string) {
    applyTransition(caseId, "approve", "admin", "Approved profile");
    const c = this.getCase(caseId);
    if (!c) return;
    if (isThresholdReached(c.salesCount, c.revenueEur)) {
      applyTransition(caseId, "mark_reportable", "system", "Marked reportable (threshold reached)");
    } else if (isExcludedByThreshold(c.salesCount, c.revenueEur)) {
      // stay VERIFIED until year close; optional mark_excluded
      applyTransition(caseId, "mark_excluded", "system", "Marked excluded (below threshold)");
    }
  },
  adminRestrictPayout(caseId: string, note: string) {
    applyTransition(caseId, "restrict_payout", "admin", note || "Restricted payouts");
  },
  adminRemoveRestriction(caseId: string) {
    applyTransition(caseId, "remove_restriction", "admin", "Removed payout restriction");
  },
  financeReadyForF7000(caseId: string) {
    applyTransition(caseId, "ready_for_f7000", "finance", "Closed period — ready for F7000");
  },
  financeSubmitF7000(caseId: string) {
    const ref = `F7000-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000 + 10000)}`;
    applyTransition(caseId, "submit_f7000", "finance", "Submitted F7000 (simulated)", {
      f7000Reference: ref,
      f7000SubmittedAt: nowIso(),
    });
  },
  financeAcceptReceipt(caseId: string) {
    applyTransition(caseId, "accept_receipt", "finance", "ANAF receipt accepted (simulated)", {
      receiptAcceptedAt: nowIso(),
    });
  },
  financeOpenCorrection(caseId: string, note: string) {
    applyTransition(caseId, "open_correction", "finance", note || "Opened correction version");
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

export function useDac7Case(caseId: string): Dac7Case | undefined {
  const snap = useDac7Store();
  return snap.cases.find((c) => c.id === caseId);
}

export function useCurrentSellerCase(): Dac7Case {
  const snap = useDac7Store();
  return snap.cases.find((c) => c.id === snap.currentSellerCaseId) ?? snap.cases[0];
}
