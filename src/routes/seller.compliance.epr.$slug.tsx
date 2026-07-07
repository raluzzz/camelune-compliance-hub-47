import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ModuleLayout } from "@/components/seller/ModuleLayout";
import { StatusBadge } from "@/components/seller/StatusBadge";
import {
  findObligationBySlug,
  DETAIL_SPECS,
  CATEGORY_LABEL,
  COUNTRY_LABEL,
  type Obligation,
  type DetailField,
  type EprStatus,
} from "@/lib/epr-data";
import { validateLucidNumber } from "@/lib/epr-validation";
import { PDF_ACCEPT, pdfFileError } from "@/lib/epr-file-validation";
import {
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Upload,
  FileCheck2,
} from "lucide-react";

export const Route = createFileRoute("/seller/compliance/epr/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `${params.slug} — EPR — Camelune` }],
  }),
  loader: ({ params }): { obligation: Obligation } => {
    const o = findObligationBySlug(params.slug);
    if (!o) throw notFound();
    return { obligation: o };
  },
  notFoundComponent: () => (
    <ModuleLayout>
      <p className="text-sm text-muted-foreground">Requirement not found.</p>
    </ModuleLayout>
  ),
  component: Page,
});

/** Demo on-file values for read-only registrations. */
const ON_FILE_VALUES: Partial<Record<string, Record<string, string>>> = {
  "packaging-RO": { epr: "RO-PACK-284719", doc: "oirep-membership-2024.pdf" },
  "packaging-FR": { epr: "FR234560_01ABCD", doc: "citeo-contract-2025.pdf" },
  "batteries-RO": { epr: "RO-BATT-118293", doc: "anpm-batteries-cert.pdf" },
  "batteries-FR": { epr: "—", doc: "screlec-contract.pdf" },
  "weee-DE": { epr: "Pending assignment" },
  "textiles-FR": { epr: "FR-TLC-99201", doc: "refashion-cert.pdf" },
  "textiles-DE": { epr: "DE-TEX-44102", doc: "zsvr-textiles.pdf" },
};

function needsSubmissionFlow(status: EprStatus): boolean {
  return ["missing", "rejected", "review-required"].includes(status);
}

function showsOnFileView(status: EprStatus): boolean {
  return ["approved", "submitted", "under-review", "expiring-soon"].includes(status);
}

function Page() {
  const data = Route.useLoaderData();
  const o = data.obligation as Obligation;
  const spec = DETAIL_SPECS[`${o.category}-${o.country.toLowerCase()}`];
  const [submitted, setSubmitted] = useState(false);

  if (!spec) {
    return (
      <ModuleLayout backLabel="Back to EPR" backTo="/seller/compliance/epr">
        <p className="text-sm text-muted-foreground">
          No specification available for this combination.
        </p>
      </ModuleLayout>
    );
  }

  const showStepper =
    spec.fields.length > 0 && !submitted && needsSubmissionFlow(o.status);

  const actionAlert = showStepper ? actionAlertMessage(o) : null;

  return (
    <ModuleLayout backLabel="Back to EPR" backTo="/seller/compliance/epr">
      <nav className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-5">
        <Link to="/seller/compliance" className="hover:text-ink">Compliance</Link>
        <span className="mx-2">/</span>
        <Link to="/seller/compliance/epr" className="hover:text-ink">EPR</Link>
        <span className="mx-2">/</span>
        <span>{COUNTRY_LABEL[o.country]}</span>
        <span className="mx-2">/</span>
        <span className="text-ink">{CATEGORY_LABEL[o.category]}</span>
      </nav>

      <header className="mb-8">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-[2rem] text-ink">
            {CATEGORY_LABEL[o.category]} — {COUNTRY_LABEL[o.country]}
          </h1>
          <StatusBadge status={o.status} />
        </div>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground max-w-2xl">
          {spec.subtitle}
          {showStepper && spec.externalLink && (
            <>
              {" "}
              <a
                href={spec.externalLink.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-ink underline-offset-4 hover:underline"
              >
                {spec.externalLink.label}
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </a>
            </>
          )}
        </p>
        {!showStepper && (
          <p className="mt-2 text-sm text-muted-foreground">
            Authority: <span className="text-ink">{spec.authority}</span>
            {spec.externalLink && (
              <>
                {" · "}
                <a
                  href={spec.externalLink.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-ink underline-offset-4 hover:underline"
                >
                  {spec.externalLink.label}
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                </a>
              </>
            )}
          </p>
        )}
      </header>

      {actionAlert && (
        <div className="border border-rose-200/70 bg-rose-50/40 p-6 mb-8 flex items-start gap-4">
          <AlertCircle className="h-5 w-5 text-rose-700 mt-0.5 shrink-0" strokeWidth={1.5} />
          <p className="text-sm text-rose-900/80 leading-relaxed">{actionAlert}</p>
        </div>
      )}

      {o.status === "expiring-soon" && (
        <div className="border border-amber-200/80 bg-amber-50/60 p-6 mb-8 flex items-start gap-4">
          <AlertCircle className="h-5 w-5 text-amber-700 mt-0.5 shrink-0" strokeWidth={1.5} />
          <div className="flex-1">
            <p className="text-[15px] text-amber-900">Renewal due</p>
            <p className="text-sm text-amber-900/80 mt-2 leading-relaxed">
              {o.dueLabel} — please renew before this date to avoid disruption.
            </p>
          </div>
        </div>
      )}

      {o.status === "not-required" && o.note && (
        <div className="border border-line bg-background p-6 mb-8">
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{o.note}</p>
        </div>
      )}

      {showsOnFileView(o.status) && spec.fields.length > 0 && (
        <OnFileSection obligation={o} spec={spec} />
      )}

      {showStepper && <Stepper spec={spec} onDone={() => setSubmitted(true)} />}

      {submitted && (
        <section className="border border-emerald-200/80 bg-emerald-50/30 p-8 text-center my-10">
          <CheckCircle2 className="h-10 w-10 text-emerald-700 mx-auto" strokeWidth={1.2} />
          <p className="text-[17px] text-ink mt-4">Submitted — under review</p>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
            Documents are typically reviewed within 3–5 business days. You will
            receive an email when your submission is approved or if any action
            is required.
          </p>
          <Link
            to="/seller/compliance/epr"
            className="inline-flex items-center gap-2 mt-6 px-5 h-11 border border-line text-xs uppercase tracking-[0.16em] text-ink hover:bg-muted/40"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
            Back to EPR
          </Link>
        </section>
      )}
    </ModuleLayout>
  );
}

function actionAlertMessage(o: Obligation): string | null {
  if (o.status === "rejected" && o.note) return o.note;

  if (o.affectedProducts > 0 && o.note) {
    return `${o.affectedProducts} listing${o.affectedProducts === 1 ? "" : "s"} affected. ${o.note}`;
  }

  if (o.affectedProducts > 0) {
    return `${o.affectedProducts} listing${o.affectedProducts === 1 ? "" : "s"} affected.`;
  }

  if (
    o.note &&
    o.dueLabel &&
    /block|pause|resubmit|action required/i.test(o.dueLabel)
  ) {
    return o.note;
  }

  return null;
}

function buildOnFileState(
  obligationId: string,
  spec: (typeof DETAIL_SPECS)[string],
) {
  const stored = ON_FILE_VALUES[obligationId] ?? {};
  const values: Record<string, string> = {};
  const files: Record<string, string> = {};
  const bools: Record<string, boolean> = {};

  for (const f of spec.fields) {
    const storedValue = stored[f.key];
    if (f.type === "checkbox") {
      bools[f.key] = storedValue === "Confirmed" || (!storedValue && !f.optional);
    } else if (f.type === "file") {
      if (storedValue && storedValue !== "On file") files[f.key] = storedValue;
    } else if (storedValue) {
      values[f.key] = storedValue;
    }
  }

  return { values, files, bools };
}

function displayFieldValue(
  field: DetailField,
  values: Record<string, string>,
  files: Record<string, string>,
  bools: Record<string, boolean>,
): string {
  if (field.type === "checkbox") return bools[field.key] ? "Confirmed" : "Not confirmed";
  if (field.type === "file") return files[field.key] ?? "—";
  return values[field.key] || "—";
}

function OnFileSection({
  obligation,
  spec,
}: {
  obligation: Obligation;
  spec: (typeof DETAIL_SPECS)[string];
}) {
  const initial = buildOnFileState(obligation.id, spec);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [values, setValues] = useState(initial.values);
  const [files, setFiles] = useState(initial.files);
  const [bools, setBools] = useState(initial.bools);
  const [draftValues, setDraftValues] = useState(initial.values);
  const [draftFiles, setDraftFiles] = useState(initial.files);
  const [draftBools, setDraftBools] = useState(initial.bools);

  const editable = ["approved", "expiring-soon", "submitted", "under-review"].includes(
    obligation.status,
  );
  const requiresReview = ["submitted", "under-review", "expiring-soon"].includes(
    obligation.status,
  );

  const requiredOk = spec.fields
    .filter((f) => !f.optional)
    .every((f) => {
      if (f.type === "checkbox") return !!draftBools[f.key];
      if (f.type === "file") return !!draftFiles[f.key];
      return !!(draftValues[f.key] && draftValues[f.key].trim());
    });

  function startEditing() {
    setDraftValues({ ...values });
    setDraftFiles({ ...files });
    setDraftBools({ ...bools });
    setSaved(false);
    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
  }

  function saveChanges() {
    setValues({ ...draftValues });
    setFiles({ ...draftFiles });
    setBools({ ...draftBools });
    setEditing(false);
    setSaved(true);
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between gap-4 mb-5">
        <h2 className="text-base text-ink">Your registration</h2>
        {editable && !editing && (
          <button
            type="button"
            onClick={startEditing}
            className="text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-ink"
          >
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <div className="border border-line p-6 bg-background space-y-6">
          {spec.fields.map((f) => (
            <FieldInput
              key={f.key}
              field={f}
              value={draftValues[f.key] ?? ""}
              file={draftFiles[f.key]}
              checked={!!draftBools[f.key]}
              onValue={(v) => setDraftValues({ ...draftValues, [f.key]: v })}
              onFile={(name) => setDraftFiles({ ...draftFiles, [f.key]: name })}
              onCheck={(b) => setDraftBools({ ...draftBools, [f.key]: b })}
            />
          ))}
          {requiresReview && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              Updated documents are reviewed within 3–5 business days before
              changes take effect.
            </p>
          )}
          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={cancelEditing}
              className="text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveChanges}
              disabled={!requiredOk}
              className="px-5 h-10 bg-ink text-cream text-xs uppercase tracking-[0.16em] hover:bg-ink/90 disabled:opacity-40"
            >
              Save changes
            </button>
          </div>
        </div>
      ) : (
        <dl className="border border-line divide-y divide-line">
          {spec.fields.map((f) => (
            <div key={f.key} className="grid grid-cols-[minmax(0,240px)_1fr] gap-6 px-6 py-4">
              <dt className="text-sm text-muted-foreground">{f.label}</dt>
              <dd className="text-sm text-ink">
                {displayFieldValue(f, values, files, bools)}
              </dd>
            </div>
          ))}
          {obligation.dueLabel && (
            <div className="grid grid-cols-[minmax(0,240px)_1fr] gap-6 px-6 py-4">
              <dt className="text-sm text-muted-foreground">Renewal</dt>
              <dd className="text-sm text-ink">{obligation.dueLabel}</dd>
            </div>
          )}
        </dl>
      )}

      {saved && !editing && (
        <p className="mt-4 text-sm text-emerald-700">
          Changes saved{requiresReview ? " — pending review" : ""}.
        </p>
      )}

      {obligation.note && !editing && (
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-2xl">
          {obligation.note}
        </p>
      )}
    </section>
  );
}

const STEPS = [{ label: "Enter information" }, { label: "Review & submit" }];

function Stepper({
  spec,
  onDone,
}: {
  spec: (typeof DETAIL_SPECS)[string];
  onDone: () => void;
}) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, string>>({});
  const [bools, setBools] = useState<Record<string, boolean>>({});
  const [showOptional, setShowOptional] = useState(false);

  const requiredFields = spec.fields.filter((f) => !f.optional);
  const optionalFields = spec.fields.filter((f) => f.optional);

  const requiredOk = requiredFields.every((f) => {
    if (f.type === "checkbox") return !!bools[f.key];
    if (f.type === "file") return !!files[f.key];
    const value = values[f.key]?.trim() ?? "";
    if (!value) return false;
    return !textFieldError(f, value);
  });

  const hasConfirmField = spec.fields.some((f) => f.key === "confirm" && f.type === "checkbox");

  const fieldsForReview = spec.fields.filter(
    (f) => !f.optional || values[f.key] || files[f.key] || bools[f.key],
  );

  return (
    <section className="mt-2 mb-4">
      <div className="flex items-center gap-4 mb-8">
        {STEPS.map((s, i) => (
          <div key={s.label} className="flex items-center gap-3">
            <span
              className={`h-7 w-7 grid place-items-center text-xs border ${
                i === step
                  ? "border-ink text-ink"
                  : i < step
                    ? "border-ink bg-ink text-cream"
                    : "border-line text-muted-foreground"
              }`}
            >
              {i + 1}
            </span>
            <p
              className={`text-xs uppercase tracking-[0.16em] ${
                i === step ? "text-ink" : "text-muted-foreground"
              }`}
            >
              {s.label}
            </p>
            {i < STEPS.length - 1 && <span className="text-muted-foreground/40">/</span>}
          </div>
        ))}
      </div>

      <div className="border border-line p-8 bg-background">
        {step === 0 && (
          <div className="space-y-6">
            {requiredFields.map((f) => (
              <FieldInput
                key={f.key}
                field={f}
                value={values[f.key] ?? ""}
                file={files[f.key]}
                checked={!!bools[f.key]}
                onValue={(v) => setValues({ ...values, [f.key]: v })}
                onFile={(name) => setFiles({ ...files, [f.key]: name })}
                onCheck={(b) => setBools({ ...bools, [f.key]: b })}
              />
            ))}

            {optionalFields.length > 0 && (
              <div className="border-t border-line pt-6">
                <button
                  type="button"
                  onClick={() => setShowOptional((v) => !v)}
                  className="text-sm text-ink hover:opacity-70"
                >
                  Authorized representative{" "}
                  <span className="text-muted-foreground">(optional)</span>
                  {showOptional ? " — hide" : " — add"}
                </button>
                {showOptional && (
                  <div className="mt-5 space-y-6">
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                      Only required if your company is not established in
                      this country. Mandatory from August 2026 under PPWR for
                      companies not established in the EU.
                    </p>
                    {optionalFields.map((f) => (
                      <FieldInput
                        key={f.key}
                        field={f}
                        value={values[f.key] ?? ""}
                        file={files[f.key]}
                        checked={!!bools[f.key]}
                        onValue={(v) => setValues({ ...values, [f.key]: v })}
                        onFile={(name) => setFiles({ ...files, [f.key]: name })}
                        onCheck={(b) => setBools({ ...bools, [f.key]: b })}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="text-[15px] text-ink mb-5">Your details at a glance</p>
            <dl className="text-sm divide-y divide-line border-t border-b border-line">
              {fieldsForReview.map((f) => {
                const v =
                  f.type === "checkbox"
                    ? bools[f.key]
                      ? "Confirmed"
                      : "Not confirmed"
                    : f.type === "file"
                      ? files[f.key] ?? "—"
                      : values[f.key] || "—";
                return (
                  <div key={f.key} className="grid grid-cols-[280px_1fr] py-3">
                    <dt className="text-muted-foreground">{f.label}</dt>
                    <dd className="text-ink">{v}</dd>
                  </div>
                );
              })}
            </dl>
            {!hasConfirmField && (
              <label className="mt-6 flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!bools["__final"]}
                  onChange={(e) => setBools({ ...bools, __final: e.target.checked })}
                  className="mt-1 accent-ink"
                />
                <span className="text-sm text-ink leading-relaxed">
                  I confirm that the information and documents I have provided
                  are complete and truthful, and I undertake to update them if
                  anything changes.
                </span>
              </label>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-6">
        {step === 0 ? (
          <Link
            to="/seller/compliance/epr"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
            Cancel
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-ink"
          >
            ← Return to entries
          </button>
        )}

        {step < 1 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            disabled={!requiredOk}
            className="inline-flex items-center gap-2 px-6 h-11 bg-ink text-cream text-xs uppercase tracking-[0.16em] hover:bg-ink/90 disabled:opacity-40"
          >
            Continue to overview
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        ) : (
          <button
            type="button"
            onClick={onDone}
            disabled={hasConfirmField ? !bools.confirm : !bools["__final"]}
            className="px-6 h-11 bg-ink text-cream text-xs uppercase tracking-[0.16em] hover:bg-ink/90 disabled:opacity-40"
          >
            Submit
          </button>
        )}
      </div>
    </section>
  );
}

function textFieldError(field: DetailField, value: string): string | null {
  if (field.formatKey === "lucid") {
    return validateLucidNumber(value);
  }
  return null;
}

function FieldInput({
  field,
  value,
  file,
  checked,
  onValue,
  onFile,
  onCheck,
}: {
  field: DetailField;
  value: string;
  file?: string;
  checked: boolean;
  onValue: (v: string) => void;
  onFile: (name: string) => void;
  onCheck: (b: boolean) => void;
}) {
  const [touched, setTouched] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const formatError =
    field.type === "text" && touched && value.trim()
      ? textFieldError(field, value)
      : null;

  if (field.type === "checkbox") {
    return (
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheck(e.target.checked)}
          className="mt-1 accent-ink"
        />
        <span className="text-sm text-ink leading-relaxed">{field.label}</span>
      </label>
    );
  }
  if (field.type === "file") {
    function handleSelectedFile(selected: File | undefined) {
      if (!selected) return;
      const error = pdfFileError(selected);
      if (error) {
        setFileError(error);
        return;
      }
      setFileError(null);
      onFile(selected.name);
    }

    return (
      <div>
        <p className="text-sm text-ink mb-2">
          {field.label}
          {field.optional && (
            <span className="text-muted-foreground text-xs ml-2">(Optional)</span>
          )}
        </p>
        {field.note && <p className="text-xs text-muted-foreground mb-2">{field.note}</p>}
        <label
          className={`block border border-dashed p-6 text-center cursor-pointer hover:border-ink/40 ${
            fileError ? "border-rose-400" : "border-line"
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleSelectedFile(e.dataTransfer.files[0]);
          }}
        >
          {file ? (
            <div className="flex items-center justify-center gap-3 text-sm text-ink">
              <FileCheck2 className="h-5 w-5" strokeWidth={1.5} />
              {file}
            </div>
          ) : (
            <div className="text-muted-foreground">
              <Upload className="h-5 w-5 mx-auto mb-2" strokeWidth={1.5} />
              <p className="text-sm">Click or drop a PDF</p>
            </div>
          )}
          <input
            type="file"
            hidden
            accept={PDF_ACCEPT}
            onChange={(e) => {
              handleSelectedFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
        {fileError && <p className="text-xs text-rose-700 mt-2">{fileError}</p>}
      </div>
    );
  }
  return (
    <div>
      <label className="block text-sm text-ink mb-2">
        {field.label}
        {field.optional && (
          <span className="text-muted-foreground text-xs ml-2">(Optional)</span>
        )}
      </label>
      {field.note && <p className="text-xs text-muted-foreground mb-2">{field.note}</p>}
      <input
        value={value}
        onChange={(e) => onValue(e.target.value)}
        onBlur={() => setTouched(true)}
        className={`w-full border bg-background px-4 py-3 text-sm focus:outline-none ${
          formatError ? "border-rose-400 focus:border-rose-500" : "border-line focus:border-ink"
        }`}
      />
      {formatError && (
        <p className="text-xs text-rose-700 mt-2">{formatError}</p>
      )}
    </div>
  );
}
