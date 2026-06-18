import { createFileRoute, Link } from "@tanstack/react-router";
import { SellerLayout } from "@/components/seller/SellerLayout";
import {
  OBLIGATIONS,
  CATEGORY_LABEL,
  COUNTRY_LABEL,
  statusGroup,
  type CountryCode,
} from "@/lib/epr-data";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/seller/compliance/epr/by-country")({
  head: () => ({
    meta: [
      { title: "Obligations by country — Camelune" },
      { name: "description", content: "EPR obligations grouped by destination market." },
    ],
  }),
  component: Page,
});

const COUNTRIES: { code: CountryCode; flag: string; sales: string }[] = [
  { code: "RO", flag: "🇷🇴", sales: "Home market · seller ships directly" },
  { code: "DE", flag: "🇩🇪", sales: "Cross-border · Camelune-authenticated shipping" },
  { code: "FR", flag: "🇫🇷", sales: "Cross-border · mixed shipping model" },
];

function Page() {
  return (
    <SellerLayout>
      <div className="max-w-[1040px] mx-auto">
        <nav className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6">
          <Link to="/seller/compliance" className="hover:text-ink">Compliance</Link>
          <span className="mx-2">/</span>
          <Link to="/seller/compliance/epr" className="hover:text-ink">EPR</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">By destination country</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-[2rem] text-ink">Obligations by destination country</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground max-w-2xl">
            A missing obligation only blocks shipments to that country, not your
            entire catalogue.
          </p>
        </header>

        <div className="space-y-5">
          {COUNTRIES.map((country) => {
            const rows = OBLIGATIONS.filter((o) => o.country === country.code);
            const needs = rows.filter((r) => statusGroup(r.status) === "needs-action");
            const affected = needs.reduce((a, r) => a + r.affectedProducts, 0);
            const overall =
              needs.length > 0 ? "Partially blocked" :
              rows.some((r) => statusGroup(r.status) === "expiring-soon") ? "Renewal due" :
              rows.some((r) => statusGroup(r.status) === "under-review") ? "Under review" :
              "Approved";
            const toneClass =
              needs.length > 0 ? "text-rose-700" :
              overall === "Renewal due" ? "text-amber-800" :
              overall === "Under review" ? "text-slate-600" :
              "text-emerald-700";

            return (
              <section key={country.code} className="border border-line bg-background p-7">
                <div className="flex items-start justify-between gap-8">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg text-ink">
                      <span className="mr-2">{country.flag}</span>
                      {COUNTRY_LABEL[country.code]}
                    </h2>
                    <p className={`text-xs mt-1 ${toneClass}`}>Status: {overall}</p>
                    <p className="text-xs text-muted-foreground mt-1">{country.sales}</p>

                    {needs.length > 0 ? (
                      <div className="mt-6">
                        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">
                          Needs attention
                        </p>
                        <ul className="text-sm text-ink space-y-1">
                          {needs.map((n) => (
                            <li key={n.id}>
                              · {CATEGORY_LABEL[n.category]}
                              <span className="text-muted-foreground"> — {n.note}</span>
                            </li>
                          ))}
                        </ul>
                        {affected > 0 && (
                          <p className="text-xs text-muted-foreground mt-3">
                            Affected listings: {affected}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-5">No action required.</p>
                    )}
                  </div>

                  <Link
                    to="/seller/compliance/epr/packaging-germany"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink whitespace-nowrap"
                  >
                    {needs.length > 0
                      ? `Resolve ${COUNTRY_LABEL[country.code]} requirements`
                      : "View details"}
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </Link>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </SellerLayout>
  );
}
