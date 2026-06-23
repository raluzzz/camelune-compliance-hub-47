import { createFileRoute, Link } from "@tanstack/react-router";
import { ModuleLayout } from "@/components/seller/ModuleLayout";
import { FAQ } from "@/components/seller/FAQ";
import { EditModal } from "@/components/seller/EditModal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { DAC7 } from "@/lib/epr-data";

export const Route = createFileRoute("/seller/compliance/dac7/")({
  head: () => ({
    meta: [
      { title: "DAC7 Reporting — Camelune" },
      {
        name: "description",
        content:
          "DAC7 is an EU platform reporting rule. Camelune may collect and report seller information to tax authorities when reporting conditions are met.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  const salesPct = Math.min(100, Math.round((DAC7.salesCount / DAC7.salesThreshold) * 100));
  const revPct = Math.min(100, Math.round((DAC7.revenue / DAC7.revenueThreshold) * 100));
  const thresholdHit = DAC7.salesCount >= DAC7.salesThreshold || DAC7.revenue >= DAC7.revenueThreshold;
  const approaching =
    !thresholdHit && (salesPct >= 80 || revPct >= 80);

  const statusKind: "not-required" | "approaching" | "reported" = thresholdHit
    ? "reported"
    : approaching
      ? "approaching"
      : "not-required";

  return (
    <ModuleLayout>
      <header className="mb-10">
        <h1 className="text-[2rem] text-ink">DAC7 Reporting</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground max-w-2xl">
          DAC7 is an EU platform reporting rule. Camelune may collect and
          report certain seller information to tax authorities when reporting
          conditions are met.
        </p>
      </header>

      {/* What is DAC7 */}
      <InfoCard title="What is DAC7?">
        <p>
          DAC7 may require digital platforms to collect, verify and report
          information about sellers and the income they earn through the
          platform.
        </p>
        <p className="mt-3">
          DAC7 is not a new tax. It is a reporting obligation for digital
          platforms.
        </p>
      </InfoCard>

      {/* Status card */}
      <section className="border border-line bg-background p-7 mb-8">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Your DAC7 status
        </p>
        <div className="mt-4 flex items-start gap-3">
          {statusKind === "approaching" ? (
            <AlertTriangle className="h-5 w-5 text-amber-700 mt-0.5" strokeWidth={1.5} />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-emerald-700 mt-0.5" strokeWidth={1.5} />
          )}
          <div>
            <p className="text-[18px] text-ink">
              {statusKind === "reported"
                ? "Reported"
                : statusKind === "approaching"
                  ? "Approaching reporting threshold"
                  : "Not required for the current reporting period"}
            </p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-2xl">
              {statusKind === "reported"
                ? "Your data has been submitted to the tax authority."
                : statusKind === "approaching"
                  ? "You are approaching the DAC7 reporting conditions. Camelune will report your information if you reach the threshold."
                  : "No DAC7 report is currently required for this seller account. Camelune will notify you if your activity reaches the reporting conditions."}
            </p>
          </div>
        </div>
        <div className="mt-7 pt-6 border-t border-line grid grid-cols-3 gap-6">
          <Indicator label="Reporting period" value={String(DAC7.reportingPeriod)} />
          <Indicator
            label="Seller information"
            value={DAC7.sellerInformationComplete ? "Complete" : "Incomplete"}
            tone={DAC7.sellerInformationComplete ? "ok" : "warn"}
          />
          <Indicator
            label="Report status"
            value={
              statusKind === "reported"
                ? "Reported"
                : statusKind === "approaching"
                  ? "Not required yet"
                  : "Not required"
            }
          />
        </div>
      </section>

      {/* Progress tracker */}
      <section className="border border-line bg-background p-7 mb-8">
        <p className="text-[15px] text-ink">Your progress toward reporting threshold</p>

        <div className="mt-6 space-y-7">
          <ProgressRow
            label="Sales"
            current={`${DAC7.salesCount} of ${DAC7.salesThreshold} sales`}
            remaining={`${Math.max(0, DAC7.salesThreshold - DAC7.salesCount)} remaining`}
            value={salesPct}
          />
          <ProgressRow
            label="Revenue"
            current={`€${DAC7.revenue.toLocaleString()} of €${DAC7.revenueThreshold.toLocaleString()}`}
            remaining={`€${Math.max(0, DAC7.revenueThreshold - DAC7.revenue).toLocaleString()} remaining`}
            value={revPct}
          />
        </div>

        {thresholdHit && (
          <div className="mt-7 border border-amber-200/80 bg-amber-50/60 p-5 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-700 mt-0.5" strokeWidth={1.5} />
            <p className="text-sm text-amber-900 leading-relaxed">
              You have reached the DAC7 reporting threshold. Camelune will
              include your data in the next report submitted to the tax
              authority.
            </p>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-6 leading-relaxed">
          Thresholds reset on 1 January each year. Both sales count and
          revenue are tracked independently — reaching either one triggers
          reporting.
        </p>
      </section>

      {/* When DAC7 may apply */}
      <InfoCard title="When DAC7 reporting may apply">
        <p>
          Camelune may need to report seller information when a seller meets
          the applicable reporting conditions during a reporting period: at
          least 30 sales or a total transaction value of at least €2,000 in
          the calendar year.
        </p>
      </InfoCard>

      {/* Collapsible — Information used for DAC7 */}
      <Accordion type="multiple" className="mb-3">
        <AccordionItem value="info-used" className="border border-line bg-background">
          <AccordionTrigger className="px-6 py-5 text-[15px] text-ink hover:no-underline">
            Information used for DAC7
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="border border-line bg-cream/40 p-5 mb-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                When DAC7 reporting becomes required, Camelune uses
                information already saved in your seller account. You can
                review and update it below.
              </p>
            </div>
            <ul className="text-sm text-ink space-y-2">
              <li>· Company details</li>
              <li>· Commercial registration number</li>
              <li>· Taxpayer ID</li>
              <li>· VAT ID</li>
              <li>· Payout account</li>
              <li>· Transaction totals calculated by Camelune</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Collapsible — Saved seller information */}
      <Accordion type="multiple" defaultValue={["saved"]} className="mb-10">
        <AccordionItem value="saved" className="border border-line bg-background">
          <AccordionTrigger className="px-6 py-5 text-[15px] text-ink hover:no-underline">
            Saved seller information
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 space-y-5">
            <SavedCard
              title="A. Company information"
              status="Saved"
              rows={[
                ["Company legal name", "Atelier Lune SRL"],
                ["Registered address", "Str. Stelelor 12, Bucharest"],
                ["Country", "Romania"],
                ["Legal representative", "Veronica Fox"],
              ]}
              edit={{
                title: "Edit company information",
                fields: [
                  { key: "name", label: "Company legal name" },
                  { key: "addr", label: "Registered address" },
                  { key: "country", label: "Country" },
                  { key: "rep", label: "Legal representative" },
                ],
                values: {
                  name: "Atelier Lune SRL",
                  addr: "Str. Stelelor 12, Bucharest",
                  country: "Romania",
                  rep: "Veronica Fox",
                },
              }}
            />
            <SavedCard
              title="B. Commercial registration number"
              status="Saved"
              rows={[
                ["Country", "Romania"],
                ["Registration number", "J40/2185/2022"],
              ]}
              edit={{
                title: "Edit commercial registration number",
                fields: [
                  { key: "country", label: "Country" },
                  { key: "reg", label: "Registration number" },
                ],
                values: { country: "Romania", reg: "J40/2185/2022" },
              }}
            />
            <SavedCard
              title="C. Taxpayer ID number"
              status="Saved"
              rows={[
                ["Issuing country", "Romania"],
                ["Taxpayer ID number", "42183901"],
                ["Permanent establishment", "Romania"],
              ]}
              edit={{
                title: "Edit taxpayer ID number",
                fields: [
                  { key: "country", label: "Issuing country" },
                  { key: "tin", label: "Taxpayer ID number" },
                  { key: "pe", label: "Permanent establishment" },
                ],
                values: {
                  country: "Romania",
                  tin: "42183901",
                  pe: "Romania",
                },
              }}
            />
            <SavedCard
              title="D. VAT ID number"
              status="Verified"
              rows={[
                ["Country", "Romania"],
                ["VAT number", "RO 42183901"],
              ]}
              helper="This VAT ID is managed in Tax & VAT and may be used for DAC7 reporting."
              externalAction={{ label: "Open Tax & VAT", to: "/seller/compliance/tax" }}
            />
            <SavedCard
              title="E. Bank account for payouts"
              status="Verified"
              rows={[
                ["Account holder", "Atelier Lune SRL"],
                ["IBAN", "RO •••• •••• •••• 4421"],
                ["Currency", "EUR"],
              ]}
              helper="This payout account is managed in Payout information."
              externalAction={{ label: "Open payout settings", to: "/seller/compliance" }}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Report history */}
      <Accordion type="multiple" defaultValue={["history"]} className="mb-10">
        <AccordionItem value="history" className="border border-line bg-background">
          <AccordionTrigger className="px-6 py-5 text-[15px] text-ink hover:no-underline">
            Report history
          </AccordionTrigger>
          <AccordionContent className="px-0 pb-0">
            <div className="border-t border-line">
              <div className="hidden md:grid grid-cols-[1fr_180px_160px_200px_140px] px-6 py-3 border-b border-line text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                <div>Reporting period</div>
                <div>Status</div>
                <div>Submitted</div>
                <div>Reference</div>
                <div className="text-right">Action</div>
              </div>
              <ReportRow
                period="2026"
                status="Not required yet"
                submitted="—"
                reference="—"
                action="View details"
                to="/seller/compliance/dac7"
              />
              <ReportRow
                period="2025"
                status="Not required"
                submitted="—"
                reference="—"
                action="View details"
                to="/seller/compliance/dac7"
              />
              <ReportRow
                period="2024"
                status="Reported"
                submitted="31 Jan 2025"
                reference="DAC7-2024-00027"
                action="View report"
                to="/seller/compliance/dac7/report/2024"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Helpful links */}
      <section className="border border-line bg-background p-7 mb-12">
        <p className="text-[15px] text-ink mb-4">Helpful links</p>
        <ul className="space-y-3 text-sm">
          <HelpLink label="Learn more about DAC7" />
          <HelpLink label="View how Camelune uses your data" />
          <HelpLink label="Contact support" />
        </ul>
      </section>

      <FAQ items={DAC7_FAQ} />
    </ModuleLayout>
  );
}

/* -------------------- helpers -------------------- */

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-line bg-cream/40 p-7 mb-8">
      <div className="flex items-start gap-4">
        <Info className="h-5 w-5 text-ink-soft mt-0.5 shrink-0" strokeWidth={1.5} />
        <div className="flex-1">
          <p className="text-[15px] text-ink">{title}</p>
          <div className="text-sm text-muted-foreground mt-2 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

function Indicator({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "ok" | "warn";
}) {
  const tc =
    tone === "ok" ? "text-emerald-700" : tone === "warn" ? "text-amber-800" : "text-ink";
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className={`text-[15px] mt-2 ${tc}`}>{value}</p>
    </div>
  );
}

function ProgressRow({
  label,
  current,
  remaining,
  value,
}: {
  label: string;
  current: string;
  remaining: string;
  value: number;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <p className="text-sm text-ink">{label}</p>
        <p className="text-xs text-muted-foreground">{value}%</p>
      </div>
      <p className="text-xs text-muted-foreground mb-2">{current}</p>
      <Progress value={value} className="h-1.5" />
      <p className="text-[11px] text-muted-foreground mt-2">{remaining}</p>
    </div>
  );
}

function SavedCard({
  title,
  rows,
  status,
  helper,
  edit,
  externalAction,
}: {
  title: string;
  rows: [string, string][];
  status: string;
  helper?: string;
  edit?: {
    title: string;
    description?: string;
    fields: { key: string; label: string }[];
    values: Record<string, string>;
  };
  externalAction?: { label: string; to: string };
}) {
  return (
    <div className="border border-line bg-background p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[15px] text-ink">{title}</p>
        <span className="text-[10.5px] uppercase tracking-[0.14em] px-2 py-[3px] rounded-full bg-emerald-50/70 text-emerald-700">
          {status}
        </span>
      </div>
      <dl className="text-sm divide-y divide-line">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[260px_1fr] py-3">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 pt-5 border-t border-line flex items-center justify-between gap-6">
        <p className="text-xs text-muted-foreground leading-relaxed">{helper}</p>
        {edit && (
          <EditModal
            trigger={
              <button className="text-xs uppercase tracking-[0.16em] text-ink hover:opacity-70 whitespace-nowrap">
                Edit
              </button>
            }
            title={edit.title}
            description={edit.description}
            fields={edit.fields}
            values={edit.values}
          />
        )}
        {externalAction && (
          <Link
            to={externalAction.to}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink hover:opacity-70 whitespace-nowrap"
          >
            {externalAction.label}
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Link>
        )}
      </div>
    </div>
  );
}

function ReportRow({
  period,
  status,
  submitted,
  reference,
  action,
  to,
}: {
  period: string;
  status: string;
  submitted: string;
  reference: string;
  action: string;
  to: string;
}) {
  const tone = status === "Reported" ? "text-emerald-700" : "text-muted-foreground";
  const isBadge = status === "Reported";
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_160px_200px_140px] px-6 py-5 border-b border-line last:border-b-0 items-center text-sm">
      <div className="text-ink">{period}</div>
      <div className="mt-1 md:mt-0">
        {isBadge ? (
          <span className="inline-flex px-2 py-[3px] rounded-full bg-emerald-50/70 text-emerald-700 text-[10.5px]">
            {status}
          </span>
        ) : (
          <span className={tone}>{status}</span>
        )}
      </div>
      <div className="mt-1 md:mt-0 text-muted-foreground">{submitted}</div>
      <div className="mt-1 md:mt-0 text-muted-foreground">{reference}</div>
      <Link
        to={to}
        className="mt-2 md:mt-0 inline-flex items-center gap-2 md:justify-end text-xs uppercase tracking-[0.16em] text-ink hover:opacity-70"
      >
        {action}
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
      </Link>
    </div>
  );
}

function HelpLink({ label }: { label: string }) {
  return (
    <li>
      <a href="#" className="inline-flex items-center gap-2 text-ink hover:opacity-70">
        {label}
        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
      </a>
    </li>
  );
}

const DAC7_FAQ = [
  { q: "What is DAC7?", a: "DAC7 is an EU directive that requires digital platforms to report seller identification and income information to tax authorities." },
  { q: "Is DAC7 a new tax?", a: "No. DAC7 is not a new tax. It is a reporting obligation for digital platforms." },
  { q: "Why does Camelune need this information?", a: "Camelune must determine whether reporting is required and file accurate reports if you meet the thresholds." },
  { q: "When will I be reported?", a: "When you reach at least 30 sales or €2,000 in total transaction value during a calendar year. Reaching either threshold triggers reporting." },
  { q: "How is my data protected?", a: "Your data is encrypted at rest and in transit, and only the specific fields required by DAC7 are shared with the relevant tax authority through secure channels." },
];
