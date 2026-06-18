import { createFileRoute, Link } from "@tanstack/react-router";
import { SellerLayout } from "@/components/seller/SellerLayout";
import { StatusBadge } from "@/components/seller/StatusBadge";
import {
  OBLIGATIONS,
  CATEGORY_LABEL,
  COUNTRY_LABEL,
  type CountryCode,
} from "@/lib/epr-data";

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
      <nav className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-6">
        <Link to="/seller/compliance" className="hover:text-ink">Compliance</Link>
        <span className="mx-2">/</span>
        <Link to="/seller/compliance/epr" className="hover:text-ink">EPR</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">By destination country</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl text-ink">Obligations by destination country</h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
          You currently sell to three markets. Each country defines its own
          producer-responsibility scheme — a missing obligation only blocks
          shipments to that country, not your entire catalogue.
        </p>
      </header>

      <div className="space-y-12">
        {COUNTRIES.map((country) => {
          const rows = OBLIGATIONS.filter((o) => o.country === country.code);
          return (
            <section key={country.code}>
              <div className="flex items-baseline justify-between border-b border-line pb-3">
                <h2 className="text-lg text-ink">
                  <span className="mr-2">{country.flag}</span>
                  {COUNTRY_LABEL[country.code]}
                </h2>
                <p className="text-xs text-muted-foreground">{country.sales}</p>
              </div>
              <div className="border border-t-0 border-line divide-y divide-line">
                {rows.map((r) => (
                  <Link
                    key={r.id}
                    to="/seller/compliance/epr/packaging-germany"
                    className="grid grid-cols-[220px_1fr_160px_160px] items-center px-5 py-4 hover:bg-muted/40"
                  >
                    <span className="text-sm text-ink">{CATEGORY_LABEL[r.category]}</span>
                    <span className="text-xs text-muted-foreground pr-6">{r.authority}</span>
                    <span className="text-xs text-muted-foreground">{r.dueLabel ?? "—"}</span>
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
