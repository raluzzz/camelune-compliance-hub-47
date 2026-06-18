import { createFileRoute, Link } from "@tanstack/react-router";
import { SellerLayout } from "@/components/seller/SellerLayout";
import { StatusBadge } from "@/components/seller/StatusBadge";
import { AlertTriangle, Building2, FileText, Calendar, Globe } from "lucide-react";

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
      <nav className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-6">
        <Link to="/seller/compliance" className="hover:text-ink">Compliance</Link>
        <span className="mx-2">/</span>
        <Link to="/seller/compliance/epr" className="hover:text-ink">EPR</Link>
        <span className="mx-2">/</span>
        <Link to="/seller/compliance/epr/by-country" className="hover:text-ink">Germany</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">Packaging</span>
      </nav>

      <header className="mb-10 flex items-start justify-between gap-8">
        <div>
          <h1 className="text-3xl text-ink">Packaging — Germany</h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
            Verpackungsgesetz (VerpackG) requires every seller placing packaged
            goods on the German market to register with ZSVR (the LUCID
            database) and contract a dual-system provider before any shipment
            enters Germany.
          </p>
        </div>
        <StatusBadge status="missing" />
      </header>

      {/* Banner */}
      <div className="border border-red-200 bg-red-50/60 p-5 flex gap-4 mb-10">
        <AlertTriangle className="h-5 w-5 text-red-700 mt-0.5" strokeWidth={1.5} />
        <div className="flex-1">
          <p className="text-sm text-red-900">
            Missing German packaging compliance currently blocks 31 of your
            listings from being shipped to Germany.
          </p>
          <p className="text-xs text-red-900/80 mt-1">
            Sales to Romania and France are unaffected. Once your LUCID number
            is approved, the block will lift automatically within 24 hours.
          </p>
        </div>
        <Link
          to="/seller/compliance/epr/packaging-germany/submit"
          className="self-start px-5 py-2.5 bg-ink text-primary-foreground text-xs uppercase tracking-[0.14em] hover:bg-ink/90"
        >
          Start submission
        </Link>
      </div>

      {/* Detail grid */}
      <div className="grid grid-cols-3 gap-px bg-line border border-line mb-10">
        <Fact icon={Building2} label="Regulator" value="ZSVR — Stiftung Zentrale Stelle Verpackungsregister" />
        <Fact icon={FileText} label="Identifier" value="LUCID registration number" />
        <Fact icon={Globe} label="Scheme" value="Verpackungsgesetz (VerpackG)" />
        <Fact icon={Calendar} label="Reporting cycle" value="Annual declaration · monthly volumes" />
        <Fact icon={FileText} label="Required document" value="Dual-system contract (e.g. Der Grüne Punkt, Interzero)" />
        <Fact icon={Building2} label="Authorized representative" value="Required for sellers outside Germany" />
      </div>

      {/* Affected catalogue */}
      <section className="mb-10">
        <h2 className="text-base text-ink mb-4">Affected listings</h2>
        <div className="border border-line divide-y divide-line">
          {AFFECTED.map((row) => (
            <div key={row.sku} className="grid grid-cols-[120px_1fr_160px_120px] items-center px-5 py-4">
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
      </section>

      {/* What we need */}
      <section className="mb-10">
        <h2 className="text-base text-ink mb-4">What you will need</h2>
        <ol className="border border-line divide-y divide-line">
          {NEEDS.map((n, i) => (
            <li key={n.title} className="grid grid-cols-[60px_1fr] gap-6 px-5 py-4">
              <span className="text-2xl text-ink-soft">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="text-sm text-ink">{n.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="border-t border-line pt-8 flex justify-between items-center">
        <Link to="/seller/compliance/epr/by-country" className="text-sm text-muted-foreground hover:text-ink">
          ← Back to country view
        </Link>
        <Link
          to="/seller/compliance/epr/packaging-germany/submit"
          className="px-6 py-3 bg-ink text-primary-foreground text-xs uppercase tracking-[0.14em] hover:bg-ink/90"
        >
          Begin submission
        </Link>
      </div>
    </SellerLayout>
  );
}

function Fact({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: string }) {
  return (
    <div className="bg-background p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" strokeWidth={1.5} />
        <p className="nav-label">{label}</p>
      </div>
      <p className="text-sm text-ink mt-3 leading-snug">{value}</p>
    </div>
  );
}

const AFFECTED = [
  { sku: "CRY-2391", name: "Patek Philippe Nautilus 5711 — pre-owned", category: "Watches · Mechanical", shipping: "Direct ship" },
  { sku: "CRY-2402", name: "Royal Oak 15500ST", category: "Watches · Mechanical", shipping: "Authenticated" },
  { sku: "BAG-1180", name: "Hermès Kelly 25 — Étoupe", category: "Bags", shipping: "Authenticated" },
  { sku: "APP-0540", name: "Brioni cashmere overcoat", category: "Apparel", shipping: "Direct ship" },
];

const NEEDS = [
  {
    title: "Your LUCID registration number",
    desc: "Obtained from ZSVR after company verification — typically issued within 2 working days.",
  },
  {
    title: "Dual-system contract document (PDF)",
    desc: "An executed agreement with a licensed packaging recovery provider for the year in question.",
  },
  {
    title: "Authorized representative declaration",
    desc: "Sellers established outside Germany must appoint a German-resident representative.",
  },
  {
    title: "Estimated annual packaging volumes",
    desc: "Forecast in kilograms per material — paper, glass, plastic, aluminium, composites.",
  },
];
