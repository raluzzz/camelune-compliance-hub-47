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
} from "@/lib/epr-data";
import {
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Upload,
  FileCheck2,
} from "lucide-react";

export const Route = createFileRoute("/seller/compliance/epr/r/$slug")({
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
  errorComponent: ({ error }) => (
    <ModuleLayout>
      <p className="text-sm text-rose-700">{(error as Error).message}</p>
    </ModuleLayout>
  ),
  component: Page,
});

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

  return (
    <ModuleLayout backLabel="Back to EPR" backTo="/seller/compliance/epr">
      <Link
        to="/seller/compliance/epr"
        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-ink mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
        Back to EPR
      </Link>

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
        </p>
      </header>

      {/* Action alert */}
      {(o.status === "missing" || o.status === "rejected" || o.status === "review-required") && o.note && (
        <div className="border border-rose-200/70 bg-rose-50/40 p-6 mb-8 flex items-start gap-4">
          <AlertCircle className="h-5 w-5 text-rose-700 mt-0.5 shrink-0" strokeWidth={1.5} />
          <div>
            <p className="text-[15px] text-rose-900">What you need to do</p>
            <p className="text-sm text-rose-900/80 mt-2 leading-relaxed">{o.note}</p>
          </div>
        </div>
      )}

      {/* Expiring soon */}
      {o.status === "expiring-soon" && (
        <div className="border border-amber-200/80 bg-amber-50/60 p-6 mb-8 flex items-start gap-4">
          <AlertCircle className="h-5 w-5 text-amber-700 mt-0.5" strokeWidth={1.5} />
          <div>
            <p className="text-[15px] text-amber-900">Renewal due</p>
            <p className="text-sm text-amber-900/80 mt-2 leading-relaxed">
              {o.dueLabel} — please renew before this date to avoid disruption.
            </p>
          </div>
        </div>
      )}

      {/* What you need */}
      {spec.whatYouNeed.length > 0 && (
        <section className="mb-10">
          <h2 className="text-base text-ink mb-5">What you need</h2>
          <ol className="border-t border-line">
            {spec.whatYouNeed.map((n, i) => (
              <li
                key={n.title}
                className="grid grid-cols-[64px_1fr] gap-6 px-1 py-5 border-b border-line"
              >
                <span className="text-xl text-ink-soft tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-[15px] text-ink">{n.title}</p>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                    {n.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Submission stepper */}
      {spec.fields.length > 0 && !submitted && (
        <Stepper spec={spec} obligation={o} onDone={() => setSubmitted(true)} />
      )}

      {submitted && (
        <section className="border border-emerald-200/80 bg-emerald-50/30 p-8 text-center my-10">
          <CheckCircle2 className="h-10 w-10 text-emerald-700 mx-auto" strokeWidth={1.2} />
          <p className="text-[17px] text-ink mt-4">Submitted — under review</p>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
            Camelune is reviewing your information. You will be notified by
            email once a decision has been made.
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

      {spec.externalLink && (
        <p className="text-sm text-muted-foreground mt-6">
          <a
            href={spec.externalLink.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-ink hover:opacity-70"
          >
            More info: {spec.externalLink.label}
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </a>
        </p>
      )}
    </ModuleLayout>
  );
}

/* -------------------- Stepper -------------------- */

const STEPS = [
  { label: "Requirements" },
  { label: "Enter information" },
  { label: "Review & submit" },
];

function Stepper({
  spec,
  obligation,
  onDone,
}: {
  spec: (typeof DETAIL_SPECS)[string];
  obligation: Obligation;
  onDone: () => void;
}) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, string>>({});
  const [bools, setBools] = useState<Record<string, boolean>>({});

  const requiredOk = spec.fields
    .filter((f) => !f.optional)
    .every((f) => {
      if (f.type === "checkbox") return !!bools[f.key];
      if (f.type === "file") return !!files[f.key];
      return !!(values[f.key] && values[f.key].trim());
    });

  return (
    <section className="mt-2 mb-12">
      {/* Steps header */}
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
          <div>
            <p className="text-[15px] text-ink mb-3">Automatically determined requirements</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-2xl">
              Based on your seller account in Romania shipping to{" "}
              {COUNTRY_LABEL[obligation.country]}, the following EPR
              registration is required. Authority: <span className="text-ink">{spec.authority}</span>.
            </p>
            {spec.externalLink && (
              <a
                href={spec.externalLink.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-ink hover:opacity-70"
              >
                More info <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </a>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            {spec.fields.map((f) => (
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

        {step === 2 && (
          <div>
            <p className="text-[15px] text-ink mb-5">Your details at a glance</p>
            <dl className="text-sm divide-y divide-line border-t border-b border-line">
              {spec.fields.map((f) => {
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
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-ink disabled:opacity-40"
        >
          ← {step === 0 ? "Cancel" : `Return to step ${step}`}
        </button>

        {step < 2 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={step === 1 && !requiredOk}
            className="inline-flex items-center gap-2 px-6 h-11 bg-ink text-cream text-xs uppercase tracking-[0.16em] hover:bg-ink/90 disabled:opacity-40"
          >
            {step === 0 ? "Continue to entries" : "Continue to overview"}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        ) : (
          <button
            onClick={onDone}
            disabled={!bools["__final"]}
            className="px-6 h-11 bg-ink text-cream text-xs uppercase tracking-[0.16em] hover:bg-ink/90 disabled:opacity-40"
          >
            Submit
          </button>
        )}
      </div>
    </section>
  );
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
    return (
      <div>
        <p className="text-sm text-ink mb-2">
          {field.label}
          {field.optional && (
            <span className="text-muted-foreground text-xs ml-2">(Optional)</span>
          )}
        </p>
        {field.note && <p className="text-xs text-muted-foreground mb-2">{field.note}</p>}
        <label className="block border border-dashed border-line p-6 text-center cursor-pointer hover:border-ink/40">
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
            onChange={(e) => onFile(e.target.files?.[0]?.name ?? "document.pdf")}
          />
        </label>
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
        className="w-full border border-line bg-background px-4 py-3 text-sm focus:outline-none focus:border-ink"
      />
    </div>
  );
}
