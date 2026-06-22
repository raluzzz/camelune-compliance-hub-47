import { createFileRoute, Link } from "@tanstack/react-router";
import { ModuleLayout } from "@/components/seller/ModuleLayout";
import { FAQ } from "@/components/seller/FAQ";
import { Info, CheckCircle2, ArrowRight, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/seller/compliance/dac7/")({
  head: () => ({
    meta: [
      { title: "DAC7 Reporting — Camelune" },
      {
        name: "description",
        content:
          "DAC7 is an EU platform reporting rule. Camelune collects and reports seller information when reporting conditions are met.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <ModuleLayout>
      {/* Title */}
      <header className="mb-10">
        <h1 className="text-[2rem] text-ink">DAC7 Reporting</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground max-w-2xl">
          DAC7 is an EU platform reporting rule. Camelune may collect and
          report certain seller information to tax authorities when reporting
          conditions are met.
        </p>
      </header>

      {/* What is DAC7 */}
      <section className="border border-line bg-cream/40 p-7 mb-10">
        <div className="flex items-start gap-4">
          <Info className="h-5 w-5 text-ink-soft mt-0.5 shrink-0" strokeWidth={1.5} />
          <div className="flex-1">
            <p className="text-[15px] text-ink">What is DAC7?</p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              DAC7 may require digital platforms to collect, verify and report
              information about sellers and the income they earn through the
              platform.
            </p>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              DAC7 is not a new tax. It is a reporting obligation for digital
              platforms.
            </p>
          </div>
        </div>
      </section>

      {/* Your DAC7 status */}
      <section className="border border-line bg-background p-7 mb-10">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Your DAC7 status
        </p>
        <div className="mt-4 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-700 mt-0.5" strokeWidth={1.5} />
          <div>
            <p className="text-[18px] text-ink">
              Not required for the current reporting period
            </p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-2xl">
              No DAC7 report is currently required for this seller account.
              Camelune will notify you if your activity reaches the reporting
              conditions.
            </p>
          </div>
        </div>
        <div className="mt-7 pt-6 border-t border-line grid grid-cols-3 gap-6">
          <Indicator label="Reporting period" value="2026" />
          <Indicator label="Seller information" value="Complete" tone="ok" />
          <Indicator label="Report status" value="Not required" />
        </div>
      </section>

      {/* Missing information */}
      <section className="border border-line bg-background p-7 mb-10">
        <p className="text-[15px] text-ink">Missing information</p>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          No missing information at this time.
        </p>
      </section>

      {/* When DAC7 may apply */}
      <section className="mb-10">
        <h2 className="text-base text-ink mb-3">When DAC7 reporting may apply</h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          Camelune may need to report seller information when a seller meets
          the applicable reporting conditions during a reporting period, such
          as reaching a relevant number of sales or total transaction value
          threshold.
        </p>
      </section>

      {/* Information used for DAC7 */}
      <section className="border border-line bg-background p-7 mb-10">
        <p className="text-[15px] text-ink">Information used for DAC7</p>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          Camelune may use the following seller information if DAC7 reporting
          becomes required:
        </p>
        <ul className="mt-4 text-sm text-ink space-y-2">
          <li>· Company details</li>
          <li>· Commercial registration number</li>
          <li>· Taxpayer ID</li>
          <li>· VAT ID</li>
          <li>· Payout account</li>
          <li>· Transaction totals calculated by Camelune</li>
        </ul>
      </section>

      {/* Saved seller information */}
      <section className="mb-12">
        <h2 className="text-base text-ink mb-5">Saved seller information</h2>
        <div className="space-y-5">
          <SavedCard
            title="A. Company information"
            status="Saved"
            rows={[
              ["Company legal name", "Atelier Lune SRL"],
              ["Registered address", "Str. Stelelor 12, Bucharest"],
              ["Country", "Romania"],
              ["Legal representative", "Veronica Fox"],
            ]}
            action={{ kind: "edit" }}
          />
          <SavedCard
            title="B. Commercial registration number"
            status="Saved"
            rows={[
              ["Country", "Romania"],
              ["Commercial registration number", "J40/2185/2022"],
            ]}
            action={{ kind: "edit" }}
          />
          <SavedCard
            title="C. Taxpayer ID number"
            status="Saved"
            rows={[
              ["Issuing country", "Romania"],
              ["Taxpayer ID number", "42183901"],
              ["Permanent establishment", "Romania"],
            ]}
            action={{ kind: "edit" }}
          />
          <SavedCard
            title="D. VAT ID number"
            status="Verified"
            rows={[
              ["Country", "Romania"],
              ["VAT number", "RO 42183901"],
            ]}
            helper="This VAT ID is managed in Tax & VAT and may be used for DAC7 reporting."
            action={{
              kind: "link",
              label: "Open Tax & VAT",
              to: "/seller/compliance/tax",
            }}
          />
          <SavedCard
            title="E. Bank account for payouts"
            status="Verified"
            rows={[
              ["Account holder", "Atelier Lune SRL"],
              ["IBAN", "RO •••• •••• •••• 4421"],
              ["Currency", "EUR"],
            ]}
            helper="This payout account is managed in Payout Information."
            action={{
              kind: "link",
              label: "Open payout settings",
              to: "/seller/compliance",
            }}
          />
        </div>
      </section>

      {/* Report history */}
      <section className="mb-12">
        <h2 className="text-base text-ink mb-5">Report history</h2>
        <div className="border border-line bg-background">
          <div className="hidden md:grid grid-cols-[1fr_180px_160px_200px_120px] px-6 py-3 border-b border-line text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            <div>Reporting period</div>
            <div>Status</div>
            <div>Submitted</div>
            <div>Reference</div>
            <div className="text-right">Action</div>
          </div>
          <ReportRow
            period="2026 reporting period"
            status="Not required yet"
            submitted="—"
            reference="—"
            action="View details"
          />
          <ReportRow
            period="2025 reporting period"
            status="Not required"
            submitted="—"
            reference="—"
            action="View details"
          />
          <ReportRow
            period="2024 reporting period"
            status="Reported"
            submitted="31 Jan 2025"
            reference="DAC7-2024-00027"
            action="View report"
          />
        </div>
      </section>

      {/* Helpful links */}
      <section className="border border-line bg-background p-7 mb-12">
        <p className="text-[15px] text-ink mb-4">Helpful links</p>
        <ul className="space-y-3 text-sm">
          <HelpLink label="Learn more about DAC7" />
          <HelpLink label="View how Camelune uses your data" />
          <HelpLink label="Contact support" />
        </ul>
      </section>

      <FAQ title="Frequently asked questions" items={DAC7_FAQ} />
    </ModuleLayout>
  );
}

function Indicator({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "ok";
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className={`text-[15px] mt-2 ${tone === "ok" ? "text-emerald-700" : "text-ink"}`}>
        {value}
      </p>
    </div>
  );
}

type Action =
  | { kind: "edit" }
  | { kind: "link"; label: string; to: string };

function SavedCard({
  title,
  rows,
  status,
  helper,
  action,
}: {
  title: string;
  rows: [string, string][];
  status: string;
  helper?: string;
  action?: Action;
}) {
  return (
    <div className="border border-line bg-background p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[15px] text-ink">{title}</p>
        <span className="text-xs text-muted-foreground">{status}</span>
      </div>
      <dl className="text-sm divide-y divide-line">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[260px_1fr] py-3">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      {(helper || action) && (
        <div className="mt-5 pt-5 border-t border-line flex items-center justify-between gap-6">
          <p className="text-xs text-muted-foreground leading-relaxed">{helper}</p>
          {action?.kind === "edit" && (
            <button className="text-xs uppercase tracking-[0.16em] text-ink hover:opacity-70 whitespace-nowrap">
              Edit
            </button>
          )}
          {action?.kind === "link" && (
            <Link
              to={action.to}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink hover:opacity-70 whitespace-nowrap"
            >
              {action.label}
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function ReportRow({
  period,
  status,
  submitted,
  reference,
  action,
}: {
  period: string;
  status: string;
  submitted: string;
  reference: string;
  action: string;
}) {
  const tone =
    status === "Reported" || status === "Corrected report submitted"
      ? "text-emerald-700"
      : "text-muted-foreground";
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_160px_200px_120px] px-6 py-5 border-b border-line last:border-b-0 items-center text-sm">
      <div className="text-ink">{period}</div>
      <div className={`mt-1 md:mt-0 ${tone}`}>{status}</div>
      <div className="mt-1 md:mt-0 text-muted-foreground">{submitted}</div>
      <div className="mt-1 md:mt-0 text-muted-foreground">{reference}</div>
      <button className="mt-2 md:mt-0 inline-flex items-center gap-2 md:justify-end text-xs uppercase tracking-[0.16em] text-ink hover:opacity-70">
        {action}
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
      </button>
    </div>
  );
}

function HelpLink({ label }: { label: string }) {
  return (
    <li>
      <a
        href="#"
        className="inline-flex items-center gap-2 text-ink hover:opacity-70"
      >
        {label}
        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
      </a>
    </li>
  );
}

const DAC7_FAQ = [
  {
    q: "What is DAC7?",
    a: "DAC7 is an EU platform reporting rule that may require digital platforms to report seller identification and income information to tax authorities.",
  },
  {
    q: "Is DAC7 a new tax?",
    a: "No. DAC7 is not a new tax. It is a reporting obligation for platforms.",
  },
  {
    q: "Why does Camelune need this information?",
    a: "Camelune may need this information to determine whether reporting is required and to file accurate reports if applicable.",
  },
  {
    q: "What information can be reported?",
    a: "Depending on the seller and reporting rules, information may include company details, taxpayer IDs, VAT numbers, payout account details and transaction totals.",
  },
  {
    q: "When does Camelune report my information?",
    a: "Reporting may apply after the end of a reporting period if the seller meets the applicable reporting conditions.",
  },
  {
    q: "What happens if information is missing?",
    a: "Camelune may ask the seller to complete or correct missing information. In some cases, account or payout restrictions may apply until required information is provided.",
  },
  {
    q: "Can I update my information?",
    a: "Yes. Sellers should be able to update or correct information before submission or when Camelune requests corrections.",
  },
  {
    q: "How is DAC7 different from VAT?",
    a: "VAT relates to tax registration and tax treatment of sales. DAC7 relates to platform reporting of seller information and income.",
  },
];
