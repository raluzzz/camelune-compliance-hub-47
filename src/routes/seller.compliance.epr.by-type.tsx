import { createFileRoute, Link } from "@tanstack/react-router";
import { SellerLayout } from "@/components/seller/SellerLayout";
import { StatusBadge } from "@/components/seller/StatusBadge";
import {
  OBLIGATIONS,
  CATEGORY_LABEL,
  COUNTRY_LABEL,
  obligationDetailLink,
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
  packaging: "Triggered by every shipped item.",
  batteries: "Triggered by quartz watches and smartwatches.",
  weee: "Triggered by smartwatches and quartz watches with electronic modules.",
  textiles: "Triggered by apparel, shoes, and textile-based bags.",
};

function Page() {
  return (
    <SellerLayout>
      <div className="max-w-[1040px] mx-auto">
        <nav className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6">
          <Link to="/seller/compliance" className="hover:text-ink">Compliance</Link>
          <span className="mx-2">/</span>
          <Link to="/seller/compliance/epr" className="hover:text-ink">EPR</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">By type</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-[2rem] text-ink">Obligations by type</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground max-w-2xl">
            Each category is governed by a different regulator in each country.
          </p>
        </header>

        <div className="space-y-5">
          {CATEGORIES.map((cat) => {
            const rows = OBLIGATIONS.filter((o) => o.category === cat);
            return (
              <section key={cat} className="border border-line bg-background p-7">
                <div className="flex items-baseline justify-between mb-5">
                  <h2 className="text-lg text-ink">{CATEGORY_LABEL[cat]}</h2>
                  <p className="text-xs text-muted-foreground max-w-md text-right">
                    {PRODUCT_TRIGGERS[cat]}
                  </p>
                </div>
                <div className="space-y-3">
                  {rows.map((r) => {
                    const dest = obligationDetailLink(r);
                    return (
                      <Link
                        key={r.id}
                        to={dest.to}
                        params={dest.params}
                        className="flex items-center justify-between py-2.5 border-b border-line last:border-0 hover:text-ink"
                      >
                        <RowContent r={r} />
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </SellerLayout>
  );
}

function RowContent({ r }: { r: (typeof OBLIGATIONS)[number] }) {
  return (
    <>
      <span className="text-sm text-ink">{COUNTRY_LABEL[r.country]}</span>
      <div className="flex items-center gap-4">
        <span className="text-xs text-muted-foreground">
          {r.affectedProducts > 0 ? `${r.affectedProducts} listings` : "—"}
        </span>
        <StatusBadge status={r.status} />
      </div>
    </>
  );
}
