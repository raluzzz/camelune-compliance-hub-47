import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ModuleLayout } from "@/components/seller/ModuleLayout";
import { Progress } from "@/components/ui/progress";
import { DAC7 } from "@/lib/epr-data";
import {
  DAC7_SECTIONS,
  DAC7_SELLER,
  dac7InformationComplete,
  dac7MissingSectionLetters,
  getDac7ReportRecord,
} from "@/lib/dac7-data";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/seller/compliance/dac7/period/$year")({
  head: ({ params }) => ({
    meta: [{ title: `DAC7 — ${params.year} — Camelune` }],
  }),
  loader: ({ params }) => {
    const report = getDac7ReportRecord(params.year);
    if (!report) throw notFound();
    return { report };
  },
  notFoundComponent: () => (
    <ModuleLayout backLabel="Back to DAC7" backTo="/seller/compliance/dac7">
      <p className="text-sm text-muted-foreground">Reporting period not found.</p>
    </ModuleLayout>
  ),
  component: Page,
});

function Page() {
  const { report } = Route.useLoaderData();
  const isCurrentPeriod = report.period === String(DAC7.reportingPeriod);
  const informationComplete = dac7InformationComplete(DAC7_SECTIONS);
  const missingLetters = dac7MissingSectionLetters(DAC7_SECTIONS);

  const salesPct = Math.min(100, Math.round((DAC7.salesCount / DAC7.salesThreshold) * 100));
  const revPct = Math.min(100, Math.round((DAC7.revenue / DAC7.revenueThreshold) * 100));
  const thresholdHit =
    DAC7.salesCount >= DAC7.salesThreshold || DAC7.revenue >= DAC7.revenueThreshold;

  return (
    <ModuleLayout backLabel="Back to DAC7" backTo="/seller/compliance/dac7">
      <nav className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-5">
        <Link to="/seller/compliance" className="hover:text-ink">Compliance</Link>
        <span className="mx-2">/</span>
        <Link to="/seller/compliance/dac7" className="hover:text-ink">DAC7</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{report.period}</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-[2rem] text-ink">Reporting period {report.period}</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground max-w-2xl">
          Status and threshold progress for this calendar year. Camelune will file
          a report only if you exceed the DAC7 thresholds during this period.
        </p>
      </header>

      <section className="border border-line border-l-4 border-l-emerald-700 bg-background p-7 mb-10">
        <div className="flex items-start gap-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-700 mt-0.5 shrink-0" strokeWidth={1.5} />
          <div>
            <p className="text-[18px] text-ink">{report.status}</p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-2xl">
              {isCurrentPeriod
                ? thresholdHit
                  ? "You have reached the reporting threshold for this period. Camelune will include your data in the next submission."
                  : "Your activity has not yet reached the DAC7 reporting threshold for this period."
                : "This period is closed. No report was required or has not yet been filed."}
            </p>
          </div>
        </div>
      </section>

      {isCurrentPeriod && (
        <section className="border border-line bg-background p-7 mb-10">
          <p className="text-[15px] text-ink mb-6">Threshold progress</p>
          <div className="space-y-7">
            <ThresholdRow
              label="Sales"
              current={`${DAC7.salesCount} of ${DAC7.salesThreshold} sales`}
              value={salesPct}
            />
            <ThresholdRow
              label="Revenue"
              current={`€${DAC7.revenue.toLocaleString()} of €${DAC7.revenueThreshold.toLocaleString()}`}
              value={revPct}
            />
          </div>
        </section>
      )}

      <section className="mb-10">
        <h2 className="text-base text-ink mb-5">Information on file</h2>
        <div className="border border-line bg-background p-6 text-sm space-y-3">
          <Row label="Company" value={DAC7_SELLER.companyName} />
          <Row label="Commercial registration" value={DAC7_SELLER.registrationNumber} />
          <Row label="Taxpayer ID" value={DAC7_SELLER.taxpayerId} />
          <Row label="VAT number" value={DAC7_SELLER.vatNumber} />
          <Row
            label="Completeness"
            value={
              informationComplete
                ? "Complete"
                : `Incomplete — sections ${missingLetters}`
            }
          />
        </div>
      </section>

      <Link
        to="/seller/compliance/dac7"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink hover:opacity-70"
      >
        Review or update information
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
      </Link>
    </ModuleLayout>
  );
}

function ThresholdRow({
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
      <div className="flex items-baseline justify-between mb-2">
        <p className="text-sm text-ink">{label}</p>
        <p className="text-xs text-muted-foreground">{value}%</p>
      </div>
      <p className="text-xs text-muted-foreground mb-2">{current}</p>
      <Progress value={value} className="h-1.5" />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 border-b border-line pb-3 last:border-b-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-ink text-right">{value}</span>
    </div>
  );
}
