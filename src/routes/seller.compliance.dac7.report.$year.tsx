import { createFileRoute, Link } from "@tanstack/react-router";
import { ModuleLayout } from "@/components/seller/ModuleLayout";
import { CheckCircle2, ArrowLeft, Download } from "lucide-react";

export const Route = createFileRoute("/seller/compliance/dac7/report/$year")({
  head: ({ params }) => ({
    meta: [
      { title: `DAC7 report — ${params.year} — Camelune` },
    ],
  }),
  component: Page,
});

const QUARTERS: { q: string; sales: number; fees: number; taxes: number; revenue: number }[] = [
  { q: "Q1", sales: 12, fees: 240, taxes: 480, revenue: 4800 },
  { q: "Q2", sales: 18, fees: 360, taxes: 720, revenue: 7200 },
  { q: "Q3", sales: 21, fees: 420, taxes: 840, revenue: 8400 },
  { q: "Q4", sales: 24, fees: 480, taxes: 960, revenue: 9600 },
];

function Page() {
  const { year } = Route.useParams();
  const total = QUARTERS.reduce(
    (a, r) => ({
      sales: a.sales + r.sales,
      fees: a.fees + r.fees,
      taxes: a.taxes + r.taxes,
      revenue: a.revenue + r.revenue,
    }),
    { sales: 0, fees: 0, taxes: 0, revenue: 0 },
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

      {/* Status card */}
      <section className="border border-line bg-background p-7 mb-10">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-700 mt-0.5" strokeWidth={1.5} />
          <div>
            <p className="text-[18px] text-ink">Reported</p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Submitted on 31 Jan 2025 · Reference DAC7-{year}-00027
            </p>
          </div>
        </div>
      </section>

      {/* Sales & revenue table */}
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

      {/* Seller information reported */}
      <section className="mb-10">
        <h2 className="text-base text-ink mb-5">Seller information reported</h2>
        <div className="border border-line bg-background p-6">
          <dl className="text-sm divide-y divide-line">
            <Row k="Company name" v="Atelier Lune SRL" />
            <Row k="Country" v="Romania" />
            <Row k="VAT number" v="RO 42183901" />
            <Row k="Commercial registration" v="J40/2185/2022" />
            <Row k="Taxpayer ID" v="42183901" />
          </dl>
        </div>
      </section>

      <div className="border-t border-line pt-6">
        <button className="inline-flex items-center gap-2 px-5 h-11 bg-ink text-cream text-xs uppercase tracking-[0.16em] hover:bg-ink/90">
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
