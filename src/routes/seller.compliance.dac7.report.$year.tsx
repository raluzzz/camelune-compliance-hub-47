import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ModuleLayout } from "@/components/seller/ModuleLayout";
import {
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Download,
  Clock,
} from "lucide-react";
import { DAC7_SELLER, getDac7ReportRecord, type ReportHistoryStatus } from "@/lib/dac7-data";
import { downloadDac7ReportPdf } from "@/lib/dac7-pdf";
import {
  buildDac7ReportPdfContent,
  hasSubmissionHistory,
  reportBannerCopy,
  type Dac7QuarterRow,
} from "@/lib/dac7-report-display";

export const Route = createFileRoute("/seller/compliance/dac7/report/$year")({
  head: ({ params }) => ({
    meta: [
      { title: `DAC7 report — ${params.year} — Camelune` },
    ],
  }),
  loader: ({ params }) => {
    const report = getDac7ReportRecord(params.year);
    if (!report || report.action !== "View report") throw notFound();
    return { report };
  },
  notFoundComponent: () => (
    <ModuleLayout backLabel="Back to DAC7" backTo="/seller/compliance/dac7">
      <p className="text-sm text-muted-foreground">Report not found.</p>
    </ModuleLayout>
  ),
  component: Page,
});

const QUARTERS: Dac7QuarterRow[] = [
  { q: "Q1", sales: 12, fees: 240, taxes: 480, revenue: 4800 },
  { q: "Q2", sales: 18, fees: 360, taxes: 720, revenue: 7200 },
  { q: "Q3", sales: 21, fees: 420, taxes: 840, revenue: 8400 },
  { q: "Q4", sales: 24, fees: 480, taxes: 960, revenue: 9600 },
];

function statusIcon(status: ReportHistoryStatus) {
  if (status === "Correction pending") {
    return <Clock className="h-5 w-5 text-amber-700 mt-0.5" strokeWidth={1.5} />;
  }
  if (status === "Correction rejected") {
    return <AlertTriangle className="h-5 w-5 text-rose-700 mt-0.5" strokeWidth={1.5} />;
  }
  return <CheckCircle2 className="h-5 w-5 text-emerald-700 mt-0.5" strokeWidth={1.5} />;
}

function Page() {
  const { year } = Route.useParams();
  const { report } = Route.useLoaderData();
  const status: ReportHistoryStatus = report.status;
  const reference = report.reference;
  const submitted = report.submitted;
  const banner = reportBannerCopy(report);
  const showSubmissionHistory = hasSubmissionHistory(report);

  const total: Dac7QuarterRow = QUARTERS.reduce(
    (a, r) => ({
      q: "Total",
      sales: a.sales + r.sales,
      fees: a.fees + r.fees,
      taxes: a.taxes + r.taxes,
      revenue: a.revenue + r.revenue,
    }),
    { q: "Total", sales: 0, fees: 0, taxes: 0, revenue: 0 },
  );

  return (
    <ModuleLayout backLabel="Back to DAC7" backTo="/seller/compliance/dac7">
      <Link
        to="/seller/compliance/dac7"
        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-ink mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
        Back to DAC7
      </Link>

      <header className="mb-10">
        <h1 className="text-[2rem] text-ink">DAC7 report — {year}</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground max-w-2xl">
          Detailed view of the data Camelune reported to the tax authority
          for the {year} reporting period.
        </p>
      </header>

      <section className="border border-line bg-background p-7 mb-10">
        <div className="flex items-start gap-3">
          {statusIcon(status)}
          <div>
            <p className="text-[18px] text-ink">{banner.title}</p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {banner.body}
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-base text-ink mb-5">Sales and revenue</h2>
        <div className="border border-line bg-background">
          <div className="grid grid-cols-5 px-6 py-3 border-b border-line text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            <div>Quarter</div>
            <div className="text-right">Sales count</div>
            <div className="text-right">Fees</div>
            <div className="text-right">Taxes</div>
            <div className="text-right">Revenue</div>
          </div>
          {QUARTERS.map((r) => (
            <div
              key={r.q}
              className="grid grid-cols-5 px-6 py-4 border-b border-line text-sm"
            >
              <div className="text-ink">{r.q}</div>
              <div className="text-right text-ink">{r.sales}</div>
              <div className="text-right text-ink">€{r.fees.toLocaleString()}</div>
              <div className="text-right text-ink">€{r.taxes.toLocaleString()}</div>
              <div className="text-right text-ink">€{r.revenue.toLocaleString()}</div>
            </div>
          ))}
          <div className="grid grid-cols-5 px-6 py-4 text-sm font-medium bg-cream/40">
            <div className="text-ink">Total</div>
            <div className="text-right text-ink">{total.sales}</div>
            <div className="text-right text-ink">€{total.fees.toLocaleString()}</div>
            <div className="text-right text-ink">€{total.taxes.toLocaleString()}</div>
            <div className="text-right text-ink">€{total.revenue.toLocaleString()}</div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-base text-ink mb-5">Company information reported</h2>
        <div className="border border-line bg-background p-6">
          <dl className="text-sm divide-y divide-line">
            <Row k="Company name" v={DAC7_SELLER.companyName} />
            <Row k="Country" v={DAC7_SELLER.companyCountry} />
            <Row k="VAT number" v={DAC7_SELLER.vatNumber} />
            <Row k="Commercial registration" v={DAC7_SELLER.registrationNumber} />
            <Row k="Taxpayer ID" v={DAC7_SELLER.taxpayerId} />
          </dl>
        </div>
      </section>

      {showSubmissionHistory && report.submissionHistory && (
        <section className="mb-10">
          <h2 className="text-base text-ink mb-5">Submission history</h2>
          <div className="border border-line bg-background">
            <div className="hidden md:grid grid-cols-[180px_1fr_1fr] px-6 py-3 border-b border-line text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              <div>Type</div>
              <div>Submitted</div>
              <div>Reference</div>
            </div>
            {report.submissionHistory.map((entry) => (
              <div
                key={`${entry.kind}-${entry.reference}`}
                className="grid grid-cols-1 md:grid-cols-[180px_1fr_1fr] px-6 py-4 border-b border-line last:border-b-0 text-sm"
              >
                <div className="text-ink">{entry.kind}</div>
                <div className="mt-1 md:mt-0 text-muted-foreground">Submitted {entry.date}</div>
                <div className="mt-1 md:mt-0 text-muted-foreground">Reference {entry.reference}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="border-t border-line pt-6">
        <button
          type="button"
          onClick={() =>
            downloadDac7ReportPdf(
              `DAC7-report-${year}.pdf`,
              buildDac7ReportPdfContent({
                year,
                status,
                submitted,
                reference,
                companyName: DAC7_SELLER.companyName,
                country: DAC7_SELLER.companyCountry,
                vatNumber: DAC7_SELLER.vatNumber,
                registrationNumber: DAC7_SELLER.registrationNumber,
                taxpayerId: DAC7_SELLER.taxpayerId,
                quarters: QUARTERS,
                totals: total,
              }),
            )
          }
          className="inline-flex items-center gap-2 px-5 h-11 bg-ink text-cream text-xs uppercase tracking-[0.16em] hover:bg-ink/90"
        >
          <Download className="h-4 w-4" strokeWidth={1.5} />
          Download report (PDF)
        </button>
      </div>
    </ModuleLayout>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[260px_1fr] py-3">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-ink">{v}</dd>
    </div>
  );
}
