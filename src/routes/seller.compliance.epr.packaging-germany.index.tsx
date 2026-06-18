import { createFileRoute, Link } from "@tanstack/react-router";
import { SellerLayout } from "@/components/seller/SellerLayout";
import { StatusBadge } from "@/components/seller/StatusBadge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
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
    <SellerLayout>
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
        <div className="border border-rose-200/70 bg-rose-50/40 p-6 mb-12">
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
          <div className="mt-6 flex justify-end">
            <Link
              to="/seller/compliance/epr/packaging-germany/submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-primary-foreground text-xs uppercase tracking-[0.16em] hover:bg-ink/90"
            >
              Complete now <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Link>
          </div>
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

        {/* Secondary collapsed details */}
        <Accordion type="single" collapsible className="mb-14">
          <AccordionItem value="affected" className="border-b border-line">
            <AccordionTrigger className="text-sm text-ink hover:no-underline">
              <span>
                Affected listings
                <span className="text-muted-foreground ml-2 font-normal">
                  31 listings
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="border border-line divide-y divide-line">
                {AFFECTED.map((row) => (
                  <div
                    key={row.sku}
                    className="grid grid-cols-[100px_1fr_160px_120px] items-center px-5 py-3.5"
                  >
                    <span className="text-xs text-muted-foreground">{row.sku}</span>
                    <span className="text-sm text-ink">{row.name}</span>
                    <span className="text-xs text-muted-foreground">{row.category}</span>
                    <span className="text-xs text-right text-muted-foreground">{row.shipping}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Showing 4 of 31 affected listings.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="legal" className="border-b border-line">
            <AccordionTrigger className="text-sm text-ink hover:no-underline">
              Legal details
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Verpackungsgesetz (VerpackG) requires every seller placing
                packaged goods on the German market to register with ZSVR
                (the LUCID database) and contract a dual-system provider
                before any shipment enters Germany.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="regulator" className="border-b border-line">
            <AccordionTrigger className="text-sm text-ink hover:no-underline">
              Regulator information
            </AccordionTrigger>
            <AccordionContent>
              <dl className="text-sm divide-y divide-line">
                {REGULATOR.map((r) => (
                  <div key={r.label} className="grid grid-cols-[200px_1fr] py-3">
                    <dt className="text-muted-foreground">{r.label}</dt>
                    <dd className="text-ink">{r.value}</dd>
                  </div>
                ))}
              </dl>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

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
    </SellerLayout>
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
