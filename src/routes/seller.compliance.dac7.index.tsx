import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ModuleLayout } from "@/components/seller/ModuleLayout";
import { FAQ } from "@/components/seller/FAQ";
import { HelpLink } from "@/components/seller/HelpLink";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Info,
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
  getSectionDescriptions,
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
          "DAC7 is an EU platform reporting rule. Camelune may collect and report seller information to tax authorities when reporting conditions are met.",
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
  const descriptions = getSectionDescriptions(DAC7_SELLER.companyCountryCode);
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
          (&quot;DAC7&quot;) requires Camelune to report seller income to tax
          authorities. This applies if you exceed 30 sales or €2,000 in revenue
          per year.
        </p>
      </header>

      <Accordion type="single" collapsible className="mb-8">
        <AccordionItem value="what" className="border border-line bg-cream/40">
          <AccordionTrigger className="px-7 py-5 hover:no-underline">
            <div className="flex items-center gap-4 text-left">
              <Info className="h-5 w-5 text-ink-soft shrink-0" strokeWidth={1.5} />
              <span className="text-[15px] text-ink">What is DAC7?</span>
              <span className="text-xs text-muted-foreground ml-2">Learn more</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-7 pb-6 pl-[60px]">
            <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
              <p>
                DAC7 may require digital platforms to collect, verify and report
                information about sellers and the income they earn through the
                platform.
              </p>
              <p>
                DAC7 is not a new tax. It is a reporting obligation for digital
                platforms.
              </p>
              <div className="pt-2">
                <HelpLink inline label="Learn more" href="/help/dac7" />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <MergedStatusCard
        status={mergedStatus}
        reportingPeriod={DAC7.reportingPeriod}
        statusMetaLabel={statusMetaLabel}
        reportingDeadline={reportingDeadline}
        missingSectionLetters={missingSectionLetters}
        reportedSubmitted={currentPeriodReport?.submitted}
        reportedReference={currentPeriodReport?.reference}
      />

      <h2 className="text-lg text-ink border-b border-line pb-4 mb-8">
        Your reported information
      </h2>

      {/* A. Company information */}
      <section className="mb-10">
        <h3 className="text-[15px] font-medium text-ink mb-1">Company information</h3>
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed max-w-2xl">
          You provided the following information regarding the legal representative
          and address of your company.
        </p>
        <div className="space-y-4 text-sm text-ink">
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-[0.12em] mb-0.5">
              Company legal name
            </p>
            <p>{DAC7_SELLER.companyName}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-[0.12em] mb-0.5">
              Registered address
            </p>
            <p>{DAC7_SELLER.registeredAddress}</p>
            <p>{DAC7_SELLER.companyCountry}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-[0.12em] mb-0.5">
              Legal representative
            </p>
            <p>{DAC7_SELLER.legalRepresentative}</p>
          </div>
        </div>
      </section>

      {/* B. Commercial registration number */}
      <section className="mb-10">
        <h3 className="text-[15px] font-medium text-ink mb-1">Commercial registration number</h3>
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed max-w-2xl">
          {descriptions.registration}
        </p>
        <InfoTable
          header={
            <>
              <span>Country</span>
              <span>Commercial registration number</span>
              <span aria-hidden="true" />
              <span>Status</span>
            </>
          }
          row={
            <>
              <span>{DAC7_SELLER.companyCountry}</span>
              <span>{DAC7_SELLER.registrationNumber}</span>
              <span aria-hidden="true" />
              <StatusPill status={sectionStatus("registration")} />
            </>
          }
        />
      </section>

      {/* C. Taxpayer ID */}
      <section className="mb-10">
        <h3 className="text-[15px] font-medium text-ink mb-1">
          {taxpayerSectionTitle(DAC7_SELLER.taxpayerIssuingCountry)}
        </h3>
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed max-w-2xl">
          {descriptions.taxpayer}
        </p>
        <InfoTable
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
        <Link
          to="/seller/compliance/dac7/taxpayer-id/add"
          className="mt-4 inline-flex items-center gap-2 text-sm text-ink border border-line px-4 py-2 hover:bg-muted/30 transition-colors"
        >
          <span className="text-lg leading-none">+</span> Add number
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

      {/* D. VAT ID number */}
      <section className="mb-10">
        <h3 className="text-[15px] font-medium text-ink mb-1">Your VAT ID number</h3>
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed max-w-2xl">
          You provided the following VAT ID number. If necessary, please make changes on our{" "}
          <Link to="/seller/compliance/tax" className="underline underline-offset-2 hover:opacity-80">
            VAT information
          </Link>{" "}
          page.
        </p>
        <InfoTable
          header={
            <>
              <span>Country</span>
              <span>VAT number</span>
              <span aria-hidden="true" />
              <span>Status</span>
            </>
          }
          row={
            <>
              <span>{DAC7_SELLER.companyCountry}</span>
              <span>{DAC7_SELLER.vatNumber}</span>
              <span aria-hidden="true" />
              <StatusPill status="Validated" />
            </>
          }
        />
      </section>

      {/* E. Bank account for payouts */}
      <section className="mb-10">
        <h3 className="text-[15px] font-medium text-ink mb-1">Bank account for payouts</h3>
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed max-w-2xl">
          Reimbursements and payments from our escrow account are transferred to the
          following bank account:
        </p>
        <div className="text-sm text-ink space-y-1">
          <p>Account holder: {DAC7_SELLER.bankAccountHolder}</p>
          <p>IBAN: {DAC7_SELLER.bankIban}</p>
          <p>Currency: {DAC7_SELLER.bankCurrency}</p>
        </div>
      </section>

      <div className="mb-10 pt-2 border-t border-line">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="dac7-confirm"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
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

      <section className="border border-line bg-background p-7 mb-8">
        <TooltipProvider>
          <div className="flex items-center gap-2">
            <p className="text-[15px] text-ink">Threshold progress</p>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-ink transition-colors"
                  aria-label="How thresholds work"
                >
                  <Info className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-ink text-cream border-0 max-w-[280px] text-xs leading-relaxed font-normal"
              >
                Thresholds reset on 1 January each year. Both sales count and
                revenue are tracked independently — reaching either one triggers
                reporting.
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
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

      <section className="border border-line bg-background p-7 mb-12">
        <p className="text-[15px] text-ink mb-4">Helpful links</p>
        <ul className="space-y-3 text-sm">
          <li><HelpLink label="Learn more about DAC7" href="/help/dac7" /></li>
          <li><HelpLink label="View how Camelune uses your data" href="/help/dac7/data-privacy" /></li>
          <li>
            <a href="/seller/help" className="inline-flex items-center gap-2 text-sm text-ink hover:opacity-70">
              Contact support
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </a>
          </li>
        </ul>
      </section>

      <FAQ items={DAC7_FAQ} />
    </ModuleLayout>
  );
}

/* -------------------- helpers -------------------- */

const INFO_TABLE_GRID =
  "grid grid-cols-[minmax(150px,22%)_minmax(180px,28%)_minmax(200px,28%)_minmax(100px,120px)] gap-x-6 items-center";

function InfoTable({
  header,
  row,
  rows,
}: {
  header: React.ReactNode;
  row?: React.ReactNode;
  rows?: { key: string; cells: React.ReactNode }[];
}) {
  const bodyRows = rows ?? (row ? [{ key: "single", cells: row }] : []);

  return (
    <div className="border border-line">
      <div
        className={`${INFO_TABLE_GRID} px-5 py-3 border-b border-line text-[11px] uppercase tracking-[0.14em] text-muted-foreground`}
      >
        {header}
      </div>
      {bodyRows.map((entry, index) => (
        <div
          key={entry.key}
          className={`${INFO_TABLE_GRID} px-5 py-4 text-sm text-ink ${
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
  { q: "Is DAC7 a new tax?", a: "No. DAC7 is not a new tax. It is a reporting obligation for digital platforms." },
  { q: "Why does Camelune need this information?", a: "Camelune must determine whether reporting is required and file accurate reports if you meet the thresholds." },
  { q: "When will I be reported?", a: "When you reach at least 30 sales or €2,000 in total transaction value during a calendar year. Reaching either threshold triggers reporting." },
  { q: "How is my data protected?", a: "Your data is encrypted at rest and in transit, and only the specific fields required by DAC7 are shared with the relevant tax authority through secure channels." },
];
