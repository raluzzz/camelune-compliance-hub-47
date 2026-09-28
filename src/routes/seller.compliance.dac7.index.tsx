import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ModuleLayout } from "@/components/seller/ModuleLayout";
import { Stepper } from "@/components/seller/Stepper";
import { FAQ } from "@/components/seller/FAQ";
import {
  sellerNextAction,
  sellerStatusLabel,
  thresholdExplain,
  DAC7_SALES_THRESHOLD,
  DAC7_REVENUE_THRESHOLD_EUR,
} from "@/lib/dac7-state";
import {
  dac7Store,
  profileMissingFields,
  useCurrentSellerCase,
  type Dac7ProfileFields,
} from "@/lib/dac7-store";
import { AlertTriangle, ArrowRight, CheckCircle2, CircleAlert } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/seller/compliance/dac7/")({
  head: () => ({
    meta: [
      { title: "DAC7 Reporting — Camelune" },
      {
        name: "description",
        content:
          "Confirm your company details so Camelune can meet DAC7 reporting obligations.",
      },
    ],
  }),
  component: Page,
});

const STEPS = [
  { label: "Company" },
  { label: "Tax IDs" },
  { label: "Payouts" },
  { label: "Confirm" },
];

function Page() {
  const c = useCurrentSellerCase();
  const next = sellerNextAction(c.status);
  const editable = ["NOT_STARTED", "IN_PROGRESS", "NEEDS_CORRECTION", "PAYMENT_RESTRICTED"].includes(
    c.status,
  );
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Dac7ProfileFields>(c.profile);
  const [error, setError] = useState<string | null>(null);
  const missing = profileMissingFields(draft);
  const salesPct = Math.min(100, Math.round((c.salesCount / DAC7_SALES_THRESHOLD) * 100));
  const revPct = Math.min(
    100,
    Math.round((c.revenueEur / DAC7_REVENUE_THRESHOLD_EUR) * 100),
  );

  function patch(partial: Partial<Dac7ProfileFields>) {
    setDraft((d) => ({ ...d, ...partial }));
  }

  function saveAndContinue() {
    dac7Store.saveSellerDraft(c.id, draft);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function submit() {
    try {
      setError(null);
      dac7Store.saveSellerDraft(c.id, draft);
      dac7Store.acceptDeclaration(c.id, true);
      dac7Store.submitSeller(c.id);
      setStep(0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not submit");
    }
  }

  return (
    <ModuleLayout>
      <header className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[2rem] text-ink">DAC7 Reporting</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground max-w-2xl">
              Camelune must report certain seller information to tax authorities when
              you exceed {DAC7_SALES_THRESHOLD} sales or €
              {DAC7_REVENUE_THRESHOLD_EUR.toLocaleString()} in a calendar year. This is
              not a new tax on you — it helps us meet our platform obligation.
            </p>
          </div>
          <Link
            to="/admin/dac7"
            className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground hover:text-ink"
          >
            Admin view →
          </Link>
        </div>
      </header>

      <StatusCard
        label={sellerStatusLabel(c.status)}
        title={next.label}
        body={
          c.correctionNote
            ? c.correctionNote
            : next.hint || thresholdExplain(c.salesCount, c.revenueEur)
        }
        tone={
          c.status === "PAYMENT_RESTRICTED" || c.status === "NEEDS_CORRECTION"
            ? "danger"
            : c.status === "SUBMITTED" || c.status === "UNDER_REVIEW"
              ? "ok"
              : c.status === "IN_PROGRESS" || c.status === "NOT_STARTED"
                ? "warn"
                : "ok"
        }
      />

      <section className="border border-line bg-background p-7 mb-10">
        <p className="text-[15px] text-ink mb-6">Your activity this year</p>
        <div className="space-y-6">
          <ProgressBlock
            label="Sales"
            current={`${c.salesCount} of ${DAC7_SALES_THRESHOLD}`}
            value={salesPct}
          />
          <ProgressBlock
            label="Revenue"
            current={`€${c.revenueEur.toLocaleString()} of €${DAC7_REVENUE_THRESHOLD_EUR.toLocaleString()}`}
            value={revPct}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-5">{thresholdExplain(c.salesCount, c.revenueEur)}</p>
      </section>

      {editable ? (
        <section className="mb-12">
          <h2 className="text-lg text-ink mb-2">Complete your information</h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-2xl">
            Four short steps. Most fields are already filled from your account — just
            check and confirm.
          </p>
          <Stepper steps={STEPS} current={step} />

          {error && (
            <p className="mb-6 text-sm text-rose-700 border border-rose-200 bg-rose-50/50 px-4 py-3">
              {error}
            </p>
          )}

          {step === 0 && (
            <FieldGroup>
              <Field label="Company name" value={draft.companyName} onChange={(v) => patch({ companyName: v })} />
              <Field label="Registered address" value={draft.registeredAddress} onChange={(v) => patch({ registeredAddress: v })} />
              <Field label="Country" value={draft.companyCountry} onChange={(v) => patch({ companyCountry: v })} />
              <Field label="Legal representative" value={draft.legalRepresentative} onChange={(v) => patch({ legalRepresentative: v })} />
              <Field label="Commercial registration number" value={draft.registrationNumber} onChange={(v) => patch({ registrationNumber: v })} />
              <FooterNav onBack={null} onNext={saveAndContinue} nextLabel="Continue" />
            </FieldGroup>
          )}

          {step === 1 && (
            <FieldGroup>
              <Field label="Taxpayer ID issuing country" value={draft.taxpayerIssuingCountry} onChange={(v) => patch({ taxpayerIssuingCountry: v })} />
              <Field label="Taxpayer ID number" value={draft.taxpayerId} onChange={(v) => patch({ taxpayerId: v })} />
              <Field label="Permanent establishment" value={draft.permanentEstablishment} onChange={(v) => patch({ permanentEstablishment: v })} />
              <div>
                <Field label="VAT number" value={draft.vatNumber} onChange={(v) => patch({ vatNumber: v })} />
                <Link to="/seller/compliance/tax" className="inline-block mt-2 text-xs text-muted-foreground hover:text-ink underline-offset-4 hover:underline">
                  Manage VAT on Tax & VAT →
                </Link>
              </div>
              <FooterNav onBack={() => setStep(0)} onNext={saveAndContinue} nextLabel="Continue" />
            </FieldGroup>
          )}

          {step === 2 && (
            <FieldGroup>
              <Field label="Account holder" value={draft.bankAccountHolder} onChange={(v) => patch({ bankAccountHolder: v })} />
              <Field label="IBAN" value={draft.bankIban} onChange={(v) => patch({ bankIban: v })} />
              <Field label="Currency" value={draft.bankCurrency} onChange={(v) => patch({ bankCurrency: v })} />
              <FooterNav onBack={() => setStep(1)} onNext={saveAndContinue} nextLabel="Continue" />
            </FieldGroup>
          )}

          {step === 3 && (
            <FieldGroup>
              <div className="border border-line divide-y divide-line text-sm mb-6">
                {[
                  ["Company", draft.companyName],
                  ["Address", `${draft.registeredAddress}, ${draft.companyCountry}`],
                  ["Registration", draft.registrationNumber],
                  ["Taxpayer ID", `${draft.taxpayerIssuingCountry} · ${draft.taxpayerId || "—"}`],
                  ["VAT", draft.vatNumber],
                  ["Bank", `${draft.bankAccountHolder} · ${draft.bankIban}`],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[140px_1fr] gap-3 px-4 py-3">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="text-ink">{v}</span>
                  </div>
                ))}
              </div>
              {missing.length > 0 && (
                <p className="text-sm text-rose-700 mb-4 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" strokeWidth={1.5} />
                  Still missing: {missing.join(", ")}
                </p>
              )}
              <label className="flex items-start gap-3 mb-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={c.declarationAccepted}
                  onChange={(e) => dac7Store.acceptDeclaration(c.id, e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-ink"
                />
                <span className="text-sm text-ink leading-relaxed">
                  I confirm that the information above is correct and may be used by
                  Camelune for DAC7 reporting if required.
                </span>
              </label>
              <FooterNav
                onBack={() => setStep(2)}
                onNext={submit}
                nextLabel="Submit for review"
                nextDisabled={!c.declarationAccepted || missing.length > 0}
              />
            </FieldGroup>
          )}
        </section>
      ) : (
        <section className="mb-12 border border-line p-7">
          <h2 className="text-[15px] text-ink mb-4">Your information on file</h2>
          <div className="divide-y divide-line text-sm">
            {[
              ["Company", c.profile.companyName],
              ["Address", `${c.profile.registeredAddress}, ${c.profile.companyCountry}`],
              ["Taxpayer ID", `${c.profile.taxpayerIssuingCountry} · ${c.profile.taxpayerId}`],
              ["VAT", c.profile.vatNumber],
              ["Bank", `${c.profile.bankAccountHolder} · ${c.profile.bankIban}`],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[140px_1fr] gap-3 py-3">
                <span className="text-muted-foreground">{k}</span>
                <span className="text-ink">{v}</span>
              </div>
            ))}
          </div>
          {(c.status === "REPORTED" || c.f7000Reference) && (
            <Link
              to="/seller/compliance/dac7/report/$year"
              params={{ year: String(c.reportingYear) }}
              className="inline-flex items-center gap-2 mt-6 text-xs uppercase tracking-[0.16em] text-ink hover:opacity-70"
            >
              View report <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Link>
          )}
        </section>
      )}

      <section className="mb-12">
        <h2 className="text-[15px] text-ink mb-4">Activity</h2>
        <ul className="space-y-3">
          {[...c.history]
            .filter((h) => h.actor !== "admin" || !h.note?.toLowerCase().includes("internal"))
            .reverse()
            .slice(0, 8)
            .map((h) => (
              <li key={h.id} className="text-sm border-b border-line pb-3">
                <p className="text-ink">{h.action}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(h.at).toLocaleString()}
                </p>
              </li>
            ))}
        </ul>
      </section>

      <FAQ items={SELLER_FAQ} />
    </ModuleLayout>
  );
}

function StatusCard({
  label,
  title,
  body,
  tone,
}: {
  label: string;
  title: string;
  body: string;
  tone: "ok" | "warn" | "danger";
}) {
  const border =
    tone === "danger"
      ? "border-l-rose-700"
      : tone === "warn"
        ? "border-l-amber-600"
        : "border-l-emerald-700";
  const icon =
    tone === "danger" ? (
      <CircleAlert className="h-5 w-5 text-rose-700 mt-0.5 shrink-0" strokeWidth={1.5} />
    ) : tone === "warn" ? (
      <AlertTriangle className="h-5 w-5 text-amber-700 mt-0.5 shrink-0" strokeWidth={1.5} />
    ) : (
      <CheckCircle2 className="h-5 w-5 text-emerald-700 mt-0.5 shrink-0" strokeWidth={1.5} />
    );
  return (
    <section className={`border border-line ${border} border-l-4 bg-background p-7 mb-8`}>
      <div className="flex items-start gap-4">
        {icon}
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
          <p className="text-[18px] text-ink mt-1">{title}</p>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-2xl">{body}</p>
        </div>
      </div>
    </section>
  );
}

function ProgressBlock({
  label,
  current,
  value,
}: {
  label: string;
  current: string;
  value: number;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-ink">{label}</span>
        <span className="text-muted-foreground">{current}</span>
      </div>
      <Progress value={value} className="h-1.5" />
    </div>
  );
}

function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="space-y-5 max-w-xl">{children}</div>;
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-line bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-ink"
      />
    </div>
  );
}

function FooterNav({
  onBack,
  onNext,
  nextLabel,
  nextDisabled,
}: {
  onBack: (() => void) | null;
  onNext: () => void;
  nextLabel: string;
  nextDisabled?: boolean;
}) {
  return (
    <div className="flex gap-2 pt-4">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="px-5 h-10 border border-line text-xs uppercase tracking-[0.16em] text-ink hover:bg-muted/40"
        >
          Back
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="px-5 h-10 bg-ink text-cream text-xs uppercase tracking-[0.16em] hover:bg-ink/90 disabled:opacity-40"
      >
        {nextLabel}
      </button>
    </div>
  );
}

const SELLER_FAQ = [
  {
    q: "What is DAC7?",
    a: "DAC7 is an EU rule that requires platforms like Camelune to collect and report certain seller identification and income data to tax authorities when reporting thresholds are met.",
  },
  {
    q: "Do I pay a new tax because of DAC7?",
    a: "No. DAC7 does not create a new tax. Your income remains taxed under your existing national rules. Camelune shares data so authorities can check returns.",
  },
  {
    q: "When does Camelune report my company?",
    a: `For goods sellers, reporting is generally required if you reach ${DAC7_SALES_THRESHOLD} sales or more than €${DAC7_REVENUE_THRESHOLD_EUR.toLocaleString()} in a calendar year. The filing deadline is 31 January of the following year.`,
  },
];
