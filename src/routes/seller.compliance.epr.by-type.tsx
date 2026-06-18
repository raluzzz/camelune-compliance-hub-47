import { createFileRoute, Link } from "@tanstack/react-router";
import { SellerLayout } from "@/components/seller/SellerLayout";
import { StatusBadge } from "@/components/seller/StatusBadge";
import {
  OBLIGATIONS,
  CATEGORY_LABEL,
  COUNTRY_LABEL,
  type EprCategory,
} from "@/lib/epr-data";

export const Route = createFileRoute("/seller/compliance/epr/by-type")({
  head: () => ({
    meta: [
      { title: "Obligations by type — Camelune" },
      { name: "description", content: "EPR obligations grouped by category: packaging, batteries, WEEE, textiles." },
    ],
  }),
  component: Page,
});

const CATEGORIES: EprCategory[] = ["packaging", "batteries", "weee", "textiles"];

const PRODUCT_TRIGGERS: Record<EprCategory, string> = {
  packaging: "Triggered by every shipped item — mechanical watches, quartz watches, smartwatches, bags, apparel, shoes, jewelry, art.",
  batteries: "Triggered by quartz watches and smartwatches.",
  weee: "Triggered by smartwatches and certain quartz watches with electronic modules.",
  textiles: "Triggered by apparel, shoes, and textile-based bags.",
};

function Page() {
  return (
    <SellerLayout>
      <nav className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-6">
        <Link to="/seller/compliance" className="hover:text-ink">Compliance</Link>
        <span className="mx-2">/</span>
        <Link to="/seller/compliance/epr" className="hover:text-ink">EPR</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">By type</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl text-ink">Obligations by type</h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
          Each category is governed by a different regulator in each country.
          Open a category to see how it applies across the markets you sell to.
        </p>
      </header>

      <div className="space-y-10">
        {CATEGORIES.map((cat) => {
          const rows = OBLIGATIONS.filter((o) => o.category === cat);
          return (
            <section key={cat}>
              <div className="border-b border-line pb-3 mb-0 flex items-baseline justify-between">
                <h2 className="text-lg text-ink">{CATEGORY_LABEL[cat]}</h2>
                <p className="text-xs text-muted-foreground max-w-md text-right">
                  {PRODUCT_TRIGGERS[cat]}
                </p>
              </div>
              <div className="border border-t-0 border-line divide-y divide-line">
                {rows.map((r) => (
                  <Link
                    key={r.id}
                    to="/seller/compliance/epr/packaging-germany"
                    className="grid grid-cols-[180px_1fr_140px_160px] items-center px-5 py-4 hover:bg-muted/40"
                  >
                    <span className="text-sm text-ink">{COUNTRY_LABEL[r.country]}</span>
                    <span className="text-xs text-muted-foreground pr-6">{r.note}</span>
                    <span className="text-xs text-muted-foreground">
                      {r.affectedProducts > 0 ? `${r.affectedProducts} listings` : "—"}
                    </span>
                    <span className="flex justify-end"><StatusBadge status={r.status} /></span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </SellerLayout>
  );
}
