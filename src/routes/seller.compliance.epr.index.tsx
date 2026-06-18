import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SellerLayout } from "@/components/seller/SellerLayout";
import { StatusBadge } from "@/components/seller/StatusBadge";
import {
  OBLIGATIONS,
  CATEGORY_LABEL,
  COUNTRY_LABEL,
  statusGroup,
  type EprCategory,
  type CountryCode,
} from "@/lib/epr-data";
import { ArrowRight } from "lucide-react";

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

type Tab = "action" | "country" | "type" | "documents" | "all";

const TABS: { id: Tab; label: string }[] = [
  { id: "action", label: "Action required" },
  { id: "country", label: "By country" },
  { id: "type", label: "By requirement type" },
  { id: "documents", label: "Submitted documents" },
  { id: "all", label: "All requirements" },
];

function Page() {
  const [tab, setTab] = useState<Tab>("action");

  return (
    <SellerLayout>
      <div className="max-w-[1040px] mx-auto">
        <Breadcrumb />
        <header className="mb-10">
          <h1 className="text-[2rem] text-ink">EPR Compliance</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground max-w-2xl">
            Producer responsibility for packaging, batteries, electronics and
            textiles on each destination market. A missing requirement only
            blocks sales in the country it concerns.
          </p>
        </header>

        {/* Tabs */}
        <div className="border-b border-line mb-10">
          <div className="flex gap-8">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`pb-3 -mb-px text-[13px] transition-colors border-b-2 ${
                  tab === t.id
                    ? "border-ink text-ink"
                    : "border-transparent text-muted-foreground hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {tab === "action" && <ActionRequired />}
        {tab === "country" && <ByCountry />}
        {tab === "type" && <ByType />}
        {tab === "documents" && <SubmittedDocs />}
        {tab === "all" && <AllMatrix />}
      </div>
    </SellerLayout>
  );
}

function Breadcrumb() {
  return (
    <nav className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6">
      <Link to="/seller/compliance" className="hover:text-ink">Compliance</Link>
      <span className="mx-2">/</span>
      <span className="text-ink">EPR</span>
    </nav>
  );
}

function ActionRequired() {
  const items = OBLIGATIONS.filter((o) => statusGroup(o.status) === "needs-action");
  if (items.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground text-sm">
        Nothing requires your attention right now.
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {items.map((o) => (
        <Link
          key={o.id}
          to="/seller/compliance/epr/packaging-germany"
          className="block border border-line bg-background px-7 py-6 hover:border-ink/40 transition-colors"
        >
          <div className="flex items-start justify-between gap-8">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <p className="text-[15px] text-ink">
                  {CATEGORY_LABEL[o.category]} — {COUNTRY_LABEL[o.country]}
                </p>
                <StatusBadge status={o.status} />
              </div>
              <p className="text-sm text-muted-foreground mt-2">{o.note}</p>
              {o.affectedProducts > 0 && (
                <p className="text-xs text-rose-700 mt-2">
                  {o.affectedProducts} listings cannot be shipped to {COUNTRY_LABEL[o.country]}.
                </p>
              )}
            </div>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink whitespace-nowrap pt-1">
              {o.status === "rejected" ? "Fix" : o.status === "review-required" ? "Review" : "Complete"}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

function ByCountry() {
  return (
    <div className="grid grid-cols-1 gap-5">
      {COUNTRIES.map((code) => {
        const rows = OBLIGATIONS.filter((o) => o.country === code);
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
          <div key={code} className="border border-line bg-background p-7">
            <div className="flex items-start justify-between gap-8">
              <div>
                <h3 className="text-lg text-ink">{COUNTRY_LABEL[code]}</h3>
                <p className={`text-xs mt-1 ${toneClass}`}>Status: {overall}</p>
                {needs.length > 0 ? (
                  <div className="mt-5">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">
                      Needs attention
                    </p>
                    <ul className="text-sm text-ink space-y-1">
                      {needs.map((n) => (
                        <li key={n.id}>· {CATEGORY_LABEL[n.category]} — {n.note}</li>
                      ))}
                    </ul>
                    {affected > 0 && (
                      <p className="text-xs text-muted-foreground mt-3">
                        Affected listings: {affected}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-4">No action required.</p>
                )}
              </div>
              <Link
                to="/seller/compliance/epr/packaging-germany"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink whitespace-nowrap"
              >
                {needs.length > 0
                  ? `Resolve ${COUNTRY_LABEL[code]} requirements`
                  : "View details"}
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ByType() {
  return (
    <div className="space-y-5">
      {CATEGORIES.map((cat) => {
        const rows = OBLIGATIONS.filter((o) => o.category === cat);
        return (
          <div key={cat} className="border border-line bg-background p-7">
            <h3 className="text-lg text-ink mb-5">{CATEGORY_LABEL[cat]}</h3>
            <div className="space-y-3">
              {rows.map((r) => (
                <div key={r.id} className="flex items-center justify-between text-sm">
                  <span className="text-ink">{COUNTRY_LABEL[r.country]}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">
                      {r.affectedProducts > 0 ? `${r.affectedProducts} listings` : "—"}
                    </span>
                    <StatusBadge status={r.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SubmittedDocs() {
  const docs = OBLIGATIONS.filter((o) =>
    ["submitted", "under-review", "approved"].includes(o.status),
  );
  return (
    <div className="border border-line divide-y divide-line bg-background">
      {docs.map((o) => (
        <div key={o.id} className="flex items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm text-ink">
              {CATEGORY_LABEL[o.category]} — {COUNTRY_LABEL[o.country]}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{o.authority}</p>
          </div>
          <div className="flex items-center gap-5">
            <span className="text-xs text-muted-foreground">{o.dueLabel}</span>
            <StatusBadge status={o.status} />
          </div>
        </div>
      ))}
    </div>
  );
}

function AllMatrix() {
  return (
    <div className="border border-line bg-background">
      <div className="grid grid-cols-[200px_repeat(3,1fr)] border-b border-line text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
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
                    ? `${o.affectedProducts} listings`
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
  );
}
