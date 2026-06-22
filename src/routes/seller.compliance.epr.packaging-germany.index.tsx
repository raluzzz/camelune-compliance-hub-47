import { createFileRoute, Link } from "@tanstack/react-router";
import { ModuleLayout } from "@/components/seller/ModuleLayout";
import { StatusBadge } from "@/components/seller/StatusBadge";
import { AlertCircle, ArrowRight } from "lucide-react";


export const Route = createFileRoute("/seller/compliance/epr/packaging-germany/")({
  head: () => ({
    meta: [
      { title: "Packaging — Germany — Camelune" },
      { name: "description", content: "Requirement detail for German packaging EPR (ZSVR / LUCID)." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <ModuleLayout>
      <div className="max-w-[900px] mx-auto">
        <nav className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6">
          <Link to="/seller/compliance" className="hover:text-ink">Compliance</Link>
          <span className="mx-2">/</span>
          <Link to="/seller/compliance/epr" className="hover:text-ink">EPR</Link>
          <span className="mx-2">/</span>
          <Link to="/seller/compliance/epr/by-country" className="hover:text-ink">Germany</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">Packaging</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3">
            <h1 className="text-[2rem] text-ink">Packaging — Germany</h1>
            <StatusBadge group="needs-action" />
          </div>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground max-w-2xl">
            To sell packaged goods in Germany, you need a valid LUCID number and
            packaging license proof.
          </p>
        </header>

        {/* Alert card */}
        <div className="border border-rose-200/70 bg-rose-50/40 p-6 mb-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-5 w-5 text-rose-700 mt-0.5 shrink-0" strokeWidth={1.5} />
            <div className="flex-1">
              <p className="text-[15px] text-rose-900">
                Sales to Germany are paused for 31 listings.
              </p>
              <p className="text-sm text-rose-900/80 mt-2 leading-relaxed">
                Complete your German packaging information to restore sales to
                Germany. Sales to Romania and France are not affected.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-14">
          <Link
            to="/seller/compliance/epr"
            className="text-sm text-muted-foreground hover:text-ink inline-flex items-center gap-1"
          >
            More info about German packaging EPR (VerpackG / LUCID) →
          </Link>
        </div>

        {/* What you need */}
        <section className="mb-14">
          <h2 className="text-base text-ink mb-6">What you need</h2>
          <ol className="space-y-1">
            {NEEDS.map((n, i) => (
              <li
                key={n.title}
                className="grid grid-cols-[64px_1fr] gap-6 px-1 py-5 border-b border-line last:border-b-0"
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


        <div className="border-t border-line pt-8 flex justify-between items-center">
          <Link
            to="/seller/compliance/epr"
            className="text-sm text-muted-foreground hover:text-ink"
          >
            ← Back
          </Link>
          <Link
            to="/seller/compliance/epr/packaging-germany/submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-primary-foreground text-xs uppercase tracking-[0.16em] hover:bg-ink/90"
          >
            Complete now <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </ModuleLayout>
  );
}

const NEEDS = [
  {
    title: "LUCID registration number",
    desc: "Obtained from ZSVR after company verification — typically issued within 2 working days.",
  },
  {
    title: "Packaging license proof",
    desc: "An executed agreement with a licensed dual-system provider (e.g. Der Grüne Punkt, Interzero).",
  },
  {
    title: "Authorized representative",
    desc: "If applicable — sellers established outside Germany must appoint a German-resident representative.",
  },
  {
    title: "Estimated annual packaging volumes",
    desc: "Forecast in kilograms per material — paper, glass, plastic, aluminium, composites.",
  },
];

const AFFECTED = [
  { sku: "CRY-2391", name: "Patek Philippe Nautilus 5711 — pre-owned", category: "Watches · Mechanical", shipping: "Direct ship" },
  { sku: "CRY-2402", name: "Royal Oak 15500ST", category: "Watches · Mechanical", shipping: "Authenticated" },
  { sku: "BAG-1180", name: "Hermès Kelly 25 — Étoupe", category: "Bags", shipping: "Authenticated" },
  { sku: "APP-0540", name: "Brioni cashmere overcoat", category: "Apparel", shipping: "Direct ship" },
];

const REGULATOR = [
  { label: "Regulator", value: "ZSVR — Stiftung Zentrale Stelle Verpackungsregister" },
  { label: "Identifier", value: "LUCID registration number" },
  { label: "Scheme", value: "Verpackungsgesetz (VerpackG)" },
  { label: "Reporting cycle", value: "Annual declaration · monthly volumes" },
  { label: "Required document", value: "Dual-system contract (e.g. Der Grüne Punkt, Interzero)" },
  { label: "Authorized representative", value: "Required for sellers outside Germany" },
];
