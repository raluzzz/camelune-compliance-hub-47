import { createFileRoute, Link } from "@tanstack/react-router";
import { SellerLayout } from "@/components/seller/SellerLayout";
import { StatusBadge } from "@/components/seller/StatusBadge";
import {
  OBLIGATIONS,
  CATEGORY_LABEL,
  COUNTRY_LABEL,
  type EprCategory,
  type CountryCode,
} from "@/lib/epr-data";

export const Route = createFileRoute("/seller/compliance/epr/")({
  head: () => ({
    meta: [
      { title: "EPR Compliance — Camelune" },
      { name: "description", content: "Extended Producer Responsibility across every market you sell to." },
    ],
  }),
  component: Page,
});

const CATEGORIES: EprCategory[] = ["packaging", "batteries", "weee", "textiles"];
const COUNTRIES: CountryCode[] = ["RO", "DE", "FR"];

function Page() {
  return (
    <SellerLayout>
      <Breadcrumb />
      <header className="mb-10">
        <h1 className="text-3xl text-ink">EPR Compliance</h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
          Extended Producer Responsibility covers the packaging, batteries,
          electrical components and textiles you place on each market. Camelune
          tracks every obligation per destination country so you only address
          what genuinely applies to your listings.
        </p>
      </header>

      {/* Matrix */}
      <div className="border border-line">
        <div className="grid grid-cols-[200px_repeat(3,1fr)] border-b border-line text-xs uppercase tracking-[0.14em] text-muted-foreground bg-muted/40">
          <div className="px-5 py-3">Category</div>
          {COUNTRIES.map((c) => (
            <div key={c} className="px-5 py-3 border-l border-line">
              {COUNTRY_LABEL[c]}
            </div>
          ))}
        </div>

        {CATEGORIES.map((cat) => (
          <div
            key={cat}
            className="grid grid-cols-[200px_repeat(3,1fr)] border-b border-line last:border-b-0"
          >
            <div className="px-5 py-5 text-sm text-ink">{CATEGORY_LABEL[cat]}</div>
            {COUNTRIES.map((country) => {
              const o = OBLIGATIONS.find((x) => x.category === cat && x.country === country);
              if (!o) return <div key={country} className="px-5 py-5 border-l border-line" />;
              return (
                <Link
                  key={country}
                  to="/seller/compliance/epr/packaging-germany"
                  className="px-5 py-5 border-l border-line block hover:bg-muted/40 transition-colors"
                >
                  <StatusBadge status={o.status} />
                  <p className="text-xs text-muted-foreground mt-2">
                    {o.affectedProducts > 0
                      ? `${o.affectedProducts} listings · ${o.authority}`
                      : o.authority}
                  </p>
                  {o.dueLabel && (
                    <p className="text-xs text-ink-soft mt-1">{o.dueLabel}</p>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-px bg-line border border-line">
        <Link to="/seller/compliance/epr/by-type" className="bg-background p-6 hover:bg-muted/40">
          <p className="nav-label text-muted-foreground">Drill down</p>
          <p className="text-sm text-ink mt-3">View obligations by type</p>
          <p className="text-xs text-muted-foreground mt-1">
            Group every market under each EPR category.
          </p>
        </Link>
        <Link to="/seller/compliance/epr/by-country" className="bg-background p-6 hover:bg-muted/40">
          <p className="nav-label text-muted-foreground">Drill down</p>
          <p className="text-sm text-ink mt-3">View obligations by country</p>
          <p className="text-xs text-muted-foreground mt-1">
            See what each destination market requires from you.
          </p>
        </Link>
      </div>
    </SellerLayout>
  );
}

function Breadcrumb() {
  return (
    <nav className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-6">
      <Link to="/seller/compliance" className="hover:text-ink">Compliance</Link>
      <span className="mx-2">/</span>
      <span className="text-ink">EPR</span>
    </nav>
  );
}
