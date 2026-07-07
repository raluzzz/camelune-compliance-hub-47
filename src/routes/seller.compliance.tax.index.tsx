import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { ModuleLayout } from "@/components/seller/ModuleLayout";
import { FAQ } from "@/components/seller/FAQ";
import { TAX_FAQ } from "@/lib/tax-help-data";
import {
  VAT_COUNTRIES,
  formatVatDisplay,
  vatFormatError,
  verifyVatNumber,
  type VatCountry,
  type VatVerificationStatus,
} from "@/lib/vat-validation";
import {
  effectiveFromError,
  formatOssSummary,
  OSS_MEMBER_STATES,
  useOssRegistration,
  type OssRegistration,
  type OssScheme,
} from "@/lib/oss-registration";
import {
  ComplianceDatePicker,
  ComplianceSelect,
  complianceFieldLabelClass,
} from "@/components/seller/ComplianceFormControls";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronDown, CircleAlert, Plus } from "lucide-react";

export const Route = createFileRoute("/seller/compliance/tax/")({
  head: () => ({
    meta: [
      { title: "Tax & VAT — Camelune" },
      {
        name: "description",
        content:
          "VAT registrations, OSS status and tax declarations for your registered business.",
      },
    ],
  }),
  component: Page,
});

interface VatRow {
  country: string;
  number: string;
  status: VatVerificationStatus;
}

const INITIAL_VAT: VatRow[] = [
  { country: "Romania", number: "RO 42183901", status: "Verified" },
  { country: "Germany", number: "DE 312456789", status: "Verified" },
  { country: "France", number: "FR 76 123456789", status: "Verified" },
];

const THRESHOLD_ANSWER =
  "Yes — my total cross-border sales exceed €10,000. I commit to providing valid VAT numbers for each EU country I ship to, or my OSS registration number.";

const NON_EU_ANSWER =
  'No — I do not ship goods worth over €150 "taxed and with duty paid" from a non-EU country to EU buyers.';

const THRESHOLD_OPTIONS = [
  "No — my total cross-border sales do not exceed the threshold in the previous or current calendar year, or I only sell goods under a margin scheme and do not ship from my country of establishment. I commit to providing the VAT number assigned to me by my home country.",
  "Yes — my total cross-border sales exceed €10,000. I commit to providing valid VAT numbers for each EU country I ship to, or my OSS registration number.",
  "No — but I ship some goods from Romania. I commit to providing a valid Romanian VAT number.",
  "I choose to have my sales taxed in the destination country regardless of total sales, and commit to providing valid VAT numbers or OSS registration.",
];

const NON_EU_OPTIONS = [
  'No — I do not ship goods worth over €150 "taxed and with duty paid" from a non-EU country to EU buyers.',
  "Yes — I ship goods worth over €150 from a non-EU country to EU buyers and commit to providing valid VAT numbers for each applicable destination country.",
];

function thresholdSummary(answer: string) {
  if (answer.startsWith("Yes")) return "Yes — above €10,000";
  if (answer.startsWith("No — but")) return "No — ships from Romania";
  if (answer.startsWith("I choose")) return "Opted in to destination taxation";
  return "No — below threshold";
}

function nonEuSummary(answer: string) {
  return answer.startsWith("Yes") ? "Yes — ships from non-EU" : "No";
}

function Page() {
  const [vatRows, setVatRows] = useState<VatRow[]>(INITIAL_VAT);
  const [thresholdAnswer, setThresholdAnswer] = useState(THRESHOLD_ANSWER);
  const [nonEuAnswer, setNonEuAnswer] = useState(NON_EU_ANSWER);
  const [ossRegistration, persistOssRegistration] = useOssRegistration();

  const allVerified = vatRows.length > 0 && vatRows.every((r) => r.status === "Verified");
  const ossDeclared = !effectiveFromError(ossRegistration.effectiveFrom);
  const questionsAnswered = Boolean(thresholdAnswer && nonEuAnswer);

  const hasVatNumber = vatRows.length > 0;
  const pendingItems = [
    !hasVatNumber || !allVerified ? "Add and verify at least one VAT number" : null,
    !ossDeclared ? "Declare your OSS registration status" : null,
    !questionsAnswered ? "Answer the tax declaration questions" : null,
  ].filter((item): item is string => item !== null);
  const allComplete = pendingItems.length === 0;

  return (
    <ModuleLayout>
      <header className="mb-10">
        <h1 className="text-[2rem] text-ink">Tax & VAT</h1>
        <TaxHeaderDescription />
      </header>

      {!allComplete && <IncompleteAlert items={pendingItems} />}

      <section className="mb-12 border border-line">
        <div className="px-5 py-4 border-b border-line">
          <h2 className="text-[15px] text-ink">Tax situation</h2>
        </div>
        <DeclarationRow
          label="EU turnover threshold (€10,000)"
          summary={thresholdSummary(thresholdAnswer)}
          question="Have you exceeded the EU turnover threshold of €10,000?*"
          answer={thresholdAnswer}
          options={THRESHOLD_OPTIONS}
          onSave={setThresholdAnswer}
        />
        <DeclarationRow
          label="Non-EU shipping to EU buyers"
          summary={nonEuSummary(nonEuAnswer)}
          question="Do you ship goods from a non-EU country to EU buyers?*"
          answer={nonEuAnswer}
          options={NON_EU_OPTIONS}
          onSave={setNonEuAnswer}
        />
        <div className="grid grid-cols-[1fr_auto] gap-4 px-5 py-3.5 items-center">
          <div>
            <p className="text-sm text-muted-foreground">OSS registration</p>
            <p className="text-sm text-ink mt-0.5">
              {ossDeclared
                ? formatOssSummary(ossRegistration)
                : "Not specified"}
            </p>
          </div>
          <OssRegistrationModal
            registration={ossRegistration}
            onSave={persistOssRegistration}
          />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-[15px] text-ink mb-4">VAT numbers</h2>
        <div className="border border-line">
          <div className="grid grid-cols-[1fr_1.4fr_140px_120px] px-5 py-3 border-b border-line text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            <div>Country</div>
            <div>VAT number</div>
            <div>Status</div>
            <div className="text-right">Action</div>
          </div>
          {vatRows.map((r, i) => (
            <div
              key={r.country}
              className="grid grid-cols-[1fr_1.4fr_140px_120px] px-5 py-4 border-b border-line last:border-b-0 text-sm items-center"
            >
              <div className="text-ink">{r.country}</div>
              <div className="text-ink">{r.number}</div>
              <div>
                <Badge
                  tone={
                    r.status === "Verified"
                      ? "ok"
                      : r.status === "Pending verification"
                        ? "warn"
                        : "bad"
                  }
                >
                  {r.status}
                </Badge>
              </div>
              <div className="text-right">
                <VatNumberModal
                  trigger={
                    <button className="text-xs uppercase tracking-[0.16em] text-ink hover:opacity-70">
                      Edit
                    </button>
                  }
                  title={`Edit VAT number — ${r.country}`}
                  initialCountry={r.country}
                  initialNumber={r.number}
                  onSave={(row) => {
                    const next = [...vatRows];
                    next[i] = row;
                    setVatRows(next);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <VatNumberModal
          trigger={
            <button className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink hover:opacity-70">
              <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
              Add VAT number
            </button>
          }
          title="Add VAT number"
          initialCountry="Italy"
          initialNumber=""
          onSave={(row) => setVatRows([...vatRows, row])}
        />
      </section>

      <FAQ items={TAX_FAQ} />
    </ModuleLayout>
  );
}

/* -------------------- helpers -------------------- */

function TaxHeaderDescription() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-3 max-w-2xl">
      <p className="text-[15px] leading-relaxed text-muted-foreground">
        Your company&apos;s VAT registrations and tax status for countries where
        you sell on Camelune.{" "}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="inline-flex items-center text-muted-foreground hover:text-ink transition-colors"
          aria-expanded={expanded}
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            strokeWidth={1.5}
          />
        </button>
      </p>

      {expanded && (
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
          <p>
            Camelune is established in Romania, an EU member state. Under EU
            VAT rules, we must collect certain tax information from registered
            businesses — both within and outside the EU — so that cross-border
            sales through the platform can be handled correctly.
          </p>
          <p>
            If your total intra-EU cross-border sales of goods subject to
            standard taxation exceed{" "}
            <strong className="font-medium text-ink">€10,000</strong> in the
            previous or current calendar year, you must charge VAT in the
            destination country. This applies across{" "}
            <strong className="font-medium text-ink">all sales channels</strong>,
            not only Camelune.
          </p>
          <p>
            Please keep this information up to date. We review it regularly and
            may ask you to confirm your answers if your tax situation changes.
          </p>
          <Link
            to="/help/tax/vat"
            className="inline-block text-xs text-muted-foreground hover:text-ink transition-colors"
          >
            Learn more →
          </Link>
        </div>
      )}
    </div>
  );
}

function IncompleteAlert({ items }: { items: string[] }) {
  return (
    <section className="border border-amber-200/80 bg-amber-50/40 mb-8 px-5 py-4">
      <p className="text-sm text-ink font-medium">Action required</p>
      <ul className="mt-2 space-y-1">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
            <CircleAlert className="h-4 w-4 text-amber-700 mt-0.5 shrink-0" strokeWidth={1.5} />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function DeclarationRow({
  label,
  summary,
  question,
  answer,
  options,
  onSave,
}: {
  label: string;
  summary: string;
  question: string;
  answer: string;
  options: string[];
  onSave: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(answer);

  return (
    <div className="grid grid-cols-[1fr_auto] gap-4 px-5 py-3.5 border-b border-line items-center">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-sm text-ink mt-0.5">{summary}</p>
      </div>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (next) setSelected(answer);
        }}
      >
        <DialogTrigger asChild>
          <button className="text-xs uppercase tracking-[0.16em] text-ink hover:opacity-70">
            Change
          </button>
        </DialogTrigger>
        <DialogContent className="bg-background border border-line max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-[16px] font-normal text-ink leading-relaxed">
              {question}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-3">
            {options.map((opt) => (
              <label
                key={opt}
                className="flex items-start gap-3 border border-line p-4 cursor-pointer hover:bg-muted/30"
              >
                <input
                  type="radio"
                  checked={selected === opt}
                  onChange={() => setSelected(opt)}
                  className="mt-0.5 accent-ink"
                />
                <span className="text-sm text-ink leading-relaxed">{opt}</span>
              </label>
            ))}
          </div>
          <DialogFooter className="gap-2">
            <button
              onClick={() => setOpen(false)}
              className="px-5 h-10 border border-line text-xs uppercase tracking-[0.16em] text-ink hover:bg-muted/40"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSave(selected);
                setOpen(false);
              }}
              className="px-5 h-10 bg-ink text-cream text-xs uppercase tracking-[0.16em] hover:bg-ink/90"
            >
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Badge({
  tone,
  children,
}: {
  tone: "ok" | "warn" | "bad" | "neutral";
  children: ReactNode;
}) {
  const tc =
    tone === "ok"
      ? "bg-emerald-50/70 text-emerald-700"
      : tone === "warn"
        ? "bg-amber-50/80 text-amber-800"
        : tone === "bad"
          ? "bg-rose-50/70 text-rose-700"
          : "bg-muted text-muted-foreground";
  return (
    <span className={`inline-flex items-center px-2 py-[3px] rounded-full text-[10.5px] tracking-[0.04em] ${tc}`}>
      {children}
    </span>
  );
}

function OssRegistrationModal({
  registration,
  onSave,
}: {
  registration: OssRegistration;
  onSave: (next: OssRegistration) => boolean;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<OssRegistration>(registration);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setDraft(registration);
      setDateError(null);
      setSaveError(null);
      setSaved(false);
    }
  }, [open, registration]);

  function handleSave() {
    const error = effectiveFromError(draft.effectiveFrom);
    if (error) {
      setDateError(error);
      return;
    }
    const didSave = onSave(draft);
    if (!didSave) {
      setSaveError("Could not save your OSS registration. Please try again.");
      return;
    }
    setSaveError(null);
    setSaved(true);
    setTimeout(() => setOpen(false), 600);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <button className="text-xs uppercase tracking-[0.16em] text-ink hover:opacity-70">
          Change
        </button>
      </DialogTrigger>
      <DialogContent className="bg-background border border-line max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[18px] font-normal text-ink">
            Edit OSS registration
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-3">
          <div>
            <label className={complianceFieldLabelClass}>Member state</label>
            <ComplianceSelect
              value={draft.memberState}
              onValueChange={(memberState) => setDraft({ ...draft, memberState })}
              options={OSS_MEMBER_STATES}
            />
          </div>
          <div>
            <label className={complianceFieldLabelClass}>OSS scheme</label>
            <ComplianceSelect
              value={draft.scheme}
              onValueChange={(scheme) =>
                setDraft({ ...draft, scheme: scheme as OssScheme })
              }
              options={["Union", "Non-Union", "IOSS"]}
            />
          </div>
          <div>
            <label className={complianceFieldLabelClass}>Effective from</label>
            <ComplianceDatePicker
              value={draft.effectiveFrom}
              onChange={(effectiveFrom) => {
                setDraft({ ...draft, effectiveFrom });
                setDateError(effectiveFromError(effectiveFrom));
                setSaveError(null);
              }}
              error={dateError}
            />
          </div>
        </div>
        {saved && <p className="text-xs text-emerald-700">Saved.</p>}
        {saveError && <p className="text-xs text-rose-700">{saveError}</p>}
        <DialogFooter className="gap-2">
          <button
            onClick={() => setOpen(false)}
            className="px-5 h-10 border border-line text-xs uppercase tracking-[0.16em] text-ink hover:bg-muted/40"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!!dateError || !draft.effectiveFrom}
            className="px-5 h-10 bg-ink text-cream text-xs uppercase tracking-[0.16em] hover:bg-ink/90 disabled:opacity-40"
          >
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function VatNumberModal({
  trigger,
  title,
  initialCountry,
  initialNumber,
  onSave,
}: {
  trigger: ReactNode;
  title: string;
  initialCountry: string;
  initialNumber: string;
  onSave: (row: VatRow) => void;
}) {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState(initialCountry);
  const [number, setNumber] = useState(initialNumber);
  const [touched, setTouched] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const formatError =
    touched && number.trim() ? vatFormatError(country, number) : null;

  function resetForm() {
    setCountry(initialCountry);
    setNumber(initialNumber);
    setTouched(false);
    setSaveError(null);
  }

  function handleSave() {
    const result = verifyVatNumber(country, number);
    if (result.error) {
      setSaveError(result.error);
      setTouched(true);
      return;
    }
    onSave({
      country,
      number: formatVatDisplay(result.normalized, country as VatCountry),
      status: result.status,
    });
    setOpen(false);
    resetForm();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) resetForm();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="bg-background border border-line max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[18px] font-normal text-ink">{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-3">
          <div>
            <label className={complianceFieldLabelClass}>Country</label>
            <ComplianceSelect
              value={country}
              onValueChange={(next) => {
                setCountry(next);
                setTouched(true);
              }}
              options={VAT_COUNTRIES}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">
              VAT number
            </label>
            <input
              value={number}
              onChange={(e) => {
                setNumber(e.target.value);
                setSaveError(null);
              }}
              onBlur={() => setTouched(true)}
              className={`w-full border bg-background px-3 py-2.5 text-sm focus:outline-none ${
                formatError || saveError
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-line focus:border-ink"
              }`}
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              Validated against EU VIES on save. Invalid numbers cannot be verified.
            </p>
            {(formatError || saveError) && (
              <p className="text-xs text-rose-700 mt-2">{formatError ?? saveError}</p>
            )}
          </div>
        </div>
        <DialogFooter className="gap-2">
          <button
            onClick={() => setOpen(false)}
            className="px-5 h-10 border border-line text-xs uppercase tracking-[0.16em] text-ink hover:bg-muted/40"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!number.trim() || !!formatError}
            className="px-5 h-10 bg-ink text-cream text-xs uppercase tracking-[0.16em] hover:bg-ink/90 disabled:opacity-40"
          >
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
