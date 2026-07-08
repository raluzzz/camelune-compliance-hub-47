import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ModuleLayout } from "@/components/seller/ModuleLayout";
import { FAQ } from "@/components/seller/FAQ";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  CircleAlert,
} from "lucide-react";
import { DAC7 } from "@/lib/epr-data";
import {
  DAC7_REPORT_HISTORY,
  DAC7_SECTIONS,
  DAC7_SELLER,
  DAC7_SUPPORT_URL,
  dac7InformationComplete,
  dac7MissingSectionLetters,
  getDefaultTaxpayerRow,
  loadExtraTaxpayerIds,
  taxpayerFieldLabel,
  taxpayerSectionTitle,
  validateTaxpayerId,
  type Dac7SectionStatus,
  type Dac7TaxpayerIdRow,
  type ReportHistoryStatus,
} from "@/lib/dac7-data";

export const Route = createFileRoute("/seller/compliance/dac7/")({
  head: () => ({
    meta: [
      { title: "DAC7 Reporting — Camelune" },
      {
        name: "description",
        content:
          "DAC7 platform reporting for legal entities — income reported to tax authorities when thresholds are met.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  const informationComplete = dac7InformationComplete(DAC7_SECTIONS);
  const [confirmed, setConfirmed] = useState(informationComplete);
  const [taxpayerRows, setTaxpayerRows] = useState<Dac7TaxpayerIdRow[]>([getDefaultTaxpayerRow()]);

  useEffect(() => {
    setTaxpayerRows([getDefaultTaxpayerRow(), ...loadExtraTaxpayerIds()]);
  }, []);

  const salesPct = Math.min(100, Math.round((DAC7.salesCount / DAC7.salesThreshold) * 100));
  const revPct = Math.min(100, Math.round((DAC7.revenue / DAC7.revenueThreshold) * 100));
  const thresholdHit = DAC7.salesCount >= DAC7.salesThreshold || DAC7.revenue >= DAC7.revenueThreshold;

  const taxpayerIdInvalid = !validateTaxpayerId(
    DAC7_SELLER.taxpayerIssuingCountry,
    DAC7_SELLER.taxpayerId,
  );
  const missingSectionLetters = dac7MissingSectionLetters(DAC7_SECTIONS);

  const currentPeriodReport = DAC7_REPORT_HISTORY.find(
    (r) => r.period === String(DAC7.reportingPeriod),
  );
  const isReported =
    currentPeriodReport?.status === "Reported" ||
    currentPeriodReport?.status === "Corrected";
  const isReportingRequired = thresholdHit && !isReported;

  const mergedStatus: "complete-not-required" | "missing-not-required" | "required" | "reported" =
    isReported
      ? "reported"
      : isReportingRequired
        ? "required"
        : informationComplete
          ? "complete-not-required"
          : "missing-not-required";

  const sectionStatus = (id: string) =>
    DAC7_SECTIONS.find((s) => s.id === id)?.status ?? "Saved";

  const statusMetaLabel =
    mergedStatus === "reported"
      ? "Reported"
      : mergedStatus === "required"
        ? "Required"
        : "Not required";

  const reportingDeadline = `January 31, ${DAC7.reportingPeriod + 1}`;
  const tinLabel = taxpayerFieldLabel(DAC7_SELLER.taxpayerIssuingCountry);

  return (
    <ModuleLayout>
      <header className="mb-10">
        <h1 className="text-[2rem] text-ink">DAC7 Reporting</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground max-w-2xl">
          <a
            href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32021L0514"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:opacity-80"
          >
            EU Directive 2021/514
          </a>{" "}
          (&quot;DAC7&quot;) requires Camelune to report your company&apos;s platform
          income to tax authorities when you exceed 30 sales or €2,000 in revenue
          per calendar year.
        </p>
      </header>

      <MergedStatusCard
        status={mergedStatus}
        reportingPeriod={DAC7.reportingPeriod}
        statusMetaLabel={statusMetaLabel}
        reportingDeadline={reportingDeadline}
        missingSectionLetters={missingSectionLetters}
        reportedSubmitted={currentPeriodReport?.submitted}
        reportedReference={currentPeriodReport?.reference}
      />

      <ReportedInformationPanel
        confirmed={confirmed}
        onConfirmedChange={setConfirmed}
        tinLabel={tinLabel}
        taxpayerRows={taxpayerRows}
        taxpayerIdInvalid={taxpayerIdInvalid}
        sectionStatus={sectionStatus}
      />

      <section className="border border-line bg-background p-7 mb-8">
        <p className="text-[15px] text-ink">Threshold progress</p>
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
      </section>

      <Accordion type="multiple" className="mb-10">
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
              {DAC7_REPORT_HISTORY.map((report) => (
                <ReportRow
                  key={report.period}
                  period={report.period}
                  status={report.status}
                  submitted={report.submitted}
                  reference={report.reference}
                  action={report.action}
                  correctionSubmitted={report.correctionSubmitted}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <FAQ items={DAC7_FAQ} />
    </ModuleLayout>
  );
}

/* -------------------- reported information -------------------- */

const TABLE_GRID_4 =
  "grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)_140px] items-center";

function ReportedInformationPanel({
  confirmed,
  onConfirmedChange,
  tinLabel,
  taxpayerRows,
  taxpayerIdInvalid,
  sectionStatus,
}: {
  confirmed: boolean;
  onConfirmedChange: (value: boolean) => void;
  tinLabel: string;
  taxpayerRows: Dac7TaxpayerIdRow[];
  taxpayerIdInvalid: boolean;
  sectionStatus: (id: string) => Dac7SectionStatus;
}) {
  return (
    <div className="mb-12">
      <h2 className="text-lg text-ink mb-8">Your reported information</h2>

      <div className="divide-y divide-line text-sm">
        <ReportedGroup title="Company">
          <p className="text-ink">{DAC7_SELLER.companyName}</p>
          <p className="text-muted-foreground mt-1">
            {DAC7_SELLER.registeredAddress}, {DAC7_SELLER.companyCountry}
          </p>
          <p className="mt-2 text-ink">
            <span className="text-muted-foreground">Legal representative · </span>
            {DAC7_SELLER.legalRepresentative}
          </p>
        </ReportedGroup>

        <ReportedGroup title="Commercial registration">
          <p className="text-ink flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{DAC7_SELLER.companyCountry}</span>
            <span className="text-muted-foreground">·</span>
            <span>{DAC7_SELLER.registrationNumber}</span>
            <span className="text-muted-foreground">·</span>
            <StatusPill status={sectionStatus("registration")} />
          </p>
        </ReportedGroup>

        <ReportedGroup title="VAT number">
          <p className="text-ink flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{DAC7_SELLER.companyCountry}</span>
            <span className="text-muted-foreground">·</span>
            <span>{DAC7_SELLER.vatNumber}</span>
            <span className="text-muted-foreground">·</span>
            <StatusPill status="Validated" />
          </p>
          <Link
            to="/seller/compliance/tax"
            className="inline-block mt-2 text-xs text-muted-foreground hover:text-ink underline-offset-4 hover:underline"
          >
            Edit on VAT information page
          </Link>
        </ReportedGroup>

        <ReportedGroup title="Bank account for payouts">
          <p className="text-ink">
            {DAC7_SELLER.bankAccountHolder}
            <span className="text-muted-foreground"> · </span>
            {DAC7_SELLER.bankIban}
            <span className="text-muted-foreground"> · </span>
            {DAC7_SELLER.bankCurrency}
          </p>
        </ReportedGroup>
      </div>

      <section className="mt-10">
        <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground mb-4">
          {taxpayerSectionTitle()}
        </p>
        <div className="border border-line">
          <InfoTable
            gridClass={TABLE_GRID_4}
            header={
              <>
                <span>Issuing country</span>
                <span>{tinLabel}</span>
                <span>Permanent establishment</span>
                <span>Status</span>
              </>
            }
            rows={taxpayerRows.map((row) => ({
              key: `${row.issuingCountry}-${row.taxpayerId}`,
              cells: (
                <>
                  <span>{row.issuingCountry}</span>
                  <span>{row.taxpayerId}</span>
                  <span>{row.permanentEstablishment}</span>
                  <StatusPill
                    status={
                      validateTaxpayerId(row.issuingCountry, row.taxpayerId)
                        ? sectionStatus("taxpayer")
                        : "Error"
                    }
                  />
                </>
              ),
            }))}
          />
        </div>
        <Link
          to="/seller/compliance/dac7/taxpayer-id/add"
          className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink hover:opacity-70"
        >
          <span className="text-base leading-none">+</span> Add number
        </Link>
        {taxpayerIdInvalid && (
          <p className="mt-4 text-sm text-rose-700 flex items-start gap-2 leading-relaxed">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" strokeWidth={1.5} />
            <span>
              One or more of the numbers you provided has an unknown format. Please
              correct the format or{" "}
              <a
                href={DAC7_SUPPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:opacity-80"
              >
                email us at support
              </a>
              .
            </span>
          </p>
        )}
      </section>

      <div className="pt-8 mt-10 border-t border-line">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="dac7-confirm"
            checked={confirmed}
            onChange={(e) => onConfirmedChange(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-ink cursor-pointer"
          />
          <label htmlFor="dac7-confirm" className="text-sm text-ink leading-relaxed cursor-pointer">
            I hereby confirm that the information I have provided is correct.
          </label>
        </div>
        {confirmed ? (
          <p className="mt-3 text-sm text-emerald-700">
            Confirmation recorded. Camelune will use this information for DAC7
            reporting if you meet the threshold.
          </p>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Please confirm your details are accurate so Camelune can include them
            in any required DAC7 report.
          </p>
        )}
      </div>
    </div>
  );
}

function ReportedGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-5 first:pt-0 last:pb-0">
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground mb-2.5">
        {title}
      </p>
      {children}
    </div>
  );
}

/* -------------------- helpers -------------------- */

function InfoTable({
  header,
  row,
  rows,
  gridClass,
}: {
  header: React.ReactNode;
  row?: React.ReactNode;
  rows?: { key: string; cells: React.ReactNode }[];
  gridClass: string;
}) {
  const bodyRows = rows ?? (row ? [{ key: "single", cells: row }] : []);

  return (
    <div>
      <div
        className={`${gridClass} gap-x-6 px-5 py-3 border-b border-line text-[11px] uppercase tracking-[0.14em] text-muted-foreground`}
      >
        {header}
      </div>
      {bodyRows.map((entry, index) => (
        <div
          key={entry.key}
          className={`${gridClass} gap-x-6 px-5 py-4 text-sm text-ink ${
            index < bodyRows.length - 1 ? "border-b border-line" : ""
          }`}
        >
          {entry.cells}
        </div>
      ))}
    </div>
  );
}

function MergedStatusCard({
  status,
  reportingPeriod,
  statusMetaLabel,
  reportingDeadline,
  missingSectionLetters,
  reportedSubmitted,
  reportedReference,
}: {
  status: "complete-not-required" | "missing-not-required" | "required" | "reported";
  reportingPeriod: number;
  statusMetaLabel: string;
  reportingDeadline: string;
  missingSectionLetters: string;
  reportedSubmitted?: string;
  reportedReference?: string;
}) {
  const borderAccent =
    status === "required"
      ? "border-l-rose-700"
      : status === "missing-not-required"
        ? "border-l-amber-600"
        : "border-l-emerald-700";

  const icon =
    status === "required" ? (
      <CircleAlert className="h-5 w-5 text-rose-700 mt-0.5 shrink-0" strokeWidth={1.5} />
    ) : status === "missing-not-required" ? (
      <AlertTriangle className="h-5 w-5 text-amber-700 mt-0.5 shrink-0" strokeWidth={1.5} />
    ) : (
      <CheckCircle2 className="h-5 w-5 text-emerald-700 mt-0.5 shrink-0" strokeWidth={1.5} />
    );

  const title =
    status === "reported"
      ? `Reported for ${reportingPeriod}`
      : status === "required"
        ? `Report required for ${reportingPeriod}`
        : status === "missing-not-required"
          ? "Not required yet — action needed"
          : `Not required for ${reportingPeriod}`;

  const body =
    status === "reported"
      ? `Your data was submitted on ${reportedSubmitted ?? "—"}. Reference: ${reportedReference ?? "—"}.`
      : status === "required"
        ? `You have exceeded the reporting threshold. Please review and confirm your information before ${reportingDeadline}.`
        : status === "missing-not-required"
          ? `Your DAC7 reporting threshold has not been reached, but some required information is missing. Please complete sections ${missingSectionLetters} before the ${reportingDeadline} deadline.`
          : "Your DAC7 information is complete and no report is due. Camelune will notify you if your activity reaches the reporting threshold.";

  return (
    <section
      className={`border border-line ${borderAccent} border-l-4 bg-background p-7 mb-8`}
    >
      <div className="flex items-start gap-4">
        {icon}
        <div className="flex-1 min-w-0">
          <p className="text-[18px] text-ink">{title}</p>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-2xl">
            {body}
          </p>
          <div className="mt-6 pt-5 border-t border-line flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink">
            <span>
              <span className="text-muted-foreground">Reporting period:</span>{" "}
              {reportingPeriod}
            </span>
            <span className="text-muted-foreground hidden sm:inline">|</span>
            <span>
              <span className="text-muted-foreground">Status:</span> {statusMetaLabel}
            </span>
            <span className="text-muted-foreground hidden sm:inline">|</span>
            <span>
              <span className="text-muted-foreground">Deadline:</span> {reportingDeadline}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatusPill({ status }: { status: Dac7SectionStatus | string }) {
  const tone =
    status === "Missing"
      ? "bg-amber-50/80 text-amber-800"
      : status === "Error"
        ? "bg-rose-50/70 text-rose-700"
        : "bg-emerald-50/70 text-emerald-700";
  return (
    <span className={`text-[10.5px] uppercase tracking-[0.14em] px-2 py-[3px] rounded-full ${tone}`}>
      {status}
    </span>
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

function ReportRow({
  period,
  status,
  submitted,
  reference,
  action,
  correctionSubmitted,
}: {
  period: string;
  status: ReportHistoryStatus;
  submitted: string;
  reference: string;
  action: string;
  correctionSubmitted?: string;
}) {
  const reportLink =
    action === "View report"
      ? { to: "/seller/compliance/dac7/report/$year" as const, params: { year: period } }
      : { to: "/seller/compliance/dac7/period/$year" as const, params: { year: period } };

  const badgeTone =
    status === "Reported" || status === "Corrected"
      ? "bg-emerald-50/70 text-emerald-700"
      : status === "Correction pending"
        ? "bg-amber-50/80 text-amber-800"
        : status === "Correction rejected"
          ? "bg-rose-50/70 text-rose-700"
          : null;

  const showCorrectionLine =
    (status === "Corrected" || status === "Correction pending") && correctionSubmitted;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_160px_200px_140px] px-6 py-5 border-b border-line last:border-b-0 items-center text-sm">
      <div className="text-ink">{period}</div>
      <div className="mt-1 md:mt-0">
        {badgeTone ? (
          <div>
            <span className={`inline-flex px-2 py-[3px] rounded-full text-[10.5px] ${badgeTone}`}>
              {status}
            </span>
            {showCorrectionLine && (
              <p className="text-[11px] text-muted-foreground mt-1.5">
                Correction submitted {correctionSubmitted}
              </p>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground">{status}</span>
        )}
      </div>
      <div className="mt-1 md:mt-0 text-muted-foreground">{submitted}</div>
      <div className="mt-1 md:mt-0 text-muted-foreground">{reference}</div>
      <Link
        to={reportLink.to}
        params={reportLink.params}
        className="mt-2 md:mt-0 inline-flex items-center gap-2 md:justify-end text-xs uppercase tracking-[0.16em] text-ink hover:opacity-70"
      >
        {action}
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
      </Link>
    </div>
  );
}

const DAC7_FAQ = [
  {
    q: "What is DAC7?",
    a: "DAC7 is EU Council Directive 2021/514. It requires digital platforms like Camelune to collect identification and income data from sellers and report it annually to tax authorities. The rules apply to platforms that facilitate the sale of goods, personal services, property rentals, or transport rentals. The obligation sits with the platform operator — not with you filing a separate DAC7 return. The aim is greater tax transparency: member states automatically exchange this information so each country can assess income tax and VAT under its existing national rules.",
  },
  {
    q: "Is DAC7 a new tax?",
    a: "No. DAC7 does not create a new tax and does not change how your company's income is taxed. Your sales remain subject to the income tax and VAT rules that already apply in your country of establishment. What changes is that Camelune must share certain company information with tax authorities when reporting conditions are met. Receiving a DAC7 report does not automatically mean you owe additional tax — authorities use the data to check whether your company's tax returns are complete and accurate. You remain responsible for declaring income and paying any tax due under your national rules, including revenue earned outside Camelune.",
  },
  {
    q: "Why does Camelune need this information?",
    a: "As a reporting platform operator, Camelune is legally required to collect, verify, and submit company data under DAC7. The sections on this page — company details, commercial registration number, taxpayer ID, VAT number, and bank account for payouts — correspond to the fields tax authorities expect in an annual report for legal entities. We use this information to confirm your company's identity, determine whether you meet the reporting threshold, and file an accurate report by 31 January for the previous calendar year if required. Providing correct details now helps avoid delays or corrections later. If information is missing or incorrect, we may need to contact you before we can complete our reporting obligations.",
  },
  {
    q: "When will I be reported?",
    a: "For legal entities selling goods on Camelune, reporting is triggered when you reach either 30 completed sales or €2,000 in total transaction value during a single calendar year — reaching one of these thresholds is enough. If you stay below both limits for the full year, Camelune generally does not need to report your company's activity for that period. When a report is due, Camelune submits it to the competent EU tax authority by 31 January of the following year (for example, 2025 activity is reported by 31 January 2026). You can track your progress toward the threshold on this page. Before or after submission, you should review the reported figures and contact us if anything looks wrong.",
  },
  {
    q: "How is my data protected?",
    a: "Camelune collects only the information required by DAC7 and handles it in line with applicable data-protection rules, including the GDPR. Your company's details are stored securely and shared with tax authorities only for the purpose of DAC7 reporting — not for marketing or unrelated uses. Under the directive, the receiving authority may exchange your data with other EU member states where your business is established or carries out relevant activity. You are informed that this reporting takes place; that is part of the legal framework platforms must follow. If you have questions about how a specific tax authority uses or stores reported data, you can contact that authority directly in your country of establishment.",
  },
];
