import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ModuleLayout } from "@/components/seller/ModuleLayout";
import { StatusBadge } from "@/components/seller/StatusBadge";
import { FAQ } from "@/components/seller/FAQ";
import {
  OBLIGATIONS,
  CATEGORY_LABEL,
  COUNTRY_LABEL,
  statusGroup,
  type EprCategory,
  type CountryCode,
} from "@/lib/epr-data";
import { ArrowRight, Info } from "lucide-react";

export const Route = createFileRoute("/seller/compliance/epr/")({
  head: () => ({
    meta: [
      { title: "EPR Compliance — Camelune" },
      {
        name: "description",
        content:
          "Extended Producer Responsibility for packaging, batteries, electronics and textiles, by destination country.",
      },
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

  const groups = {
    identified: OBLIGATIONS.length,
    needsAction: OBLIGATIONS.filter((o) => statusGroup(o.status) === "needs-action").length,
    underReview: OBLIGATIONS.filter((o) => statusGroup(o.status) === "under-review").length,
    approved: OBLIGATIONS.filter((o) => statusGroup(o.status) === "approved").length,
  };

  return (
    <ModuleLayout>
      <header className="mb-10">
        <h1 className="text-[2rem] text-ink">EPR Compliance</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground max-w-2xl">
          Producer responsibility for packaging, batteries, electronics and
          textiles on each destination market. A missing requirement only
          blocks sales in the country it concerns.
        </p>
      </header>

      {/* Educational card */}
      <section className="border border-line bg-cream/40 p-7 mb-8">
        <div className="flex items-start gap-4">
          <Info className="h-5 w-5 text-ink-soft mt-0.5 shrink-0" strokeWidth={1.5} />
          <div className="flex-1">
            <p className="text-[15px] text-ink">What is EPR?</p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Extended Producer Responsibility means that sellers may need to
              register, report and contribute to recycling systems for
              packaging, batteries, electronics or textiles sold in certain
              countries.
            </p>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              Camelune tracks these requirements by destination country, so a
              missing requirement only affects sales in the country concerned.
            </p>
            <a
              href="#faq"
              className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink"
            >
              Learn more <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </section>

      {/* Status summary card */}
      <section className="border border-line bg-background p-7 mb-12">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Your EPR obligations
        </p>
        <div className="mt-5 grid grid-cols-4 gap-6">
          <Stat n={groups.identified} label="Identified requirements" />
          <Stat n={groups.needsAction} label="Needs action" tone="warn" />
          <Stat n={groups.underReview} label="Under review" tone="soft" />
          <Stat n={groups.approved} label="Approved" tone="ok" />
        </div>
      </section>

      {/* Tabs */}
      <div className="border-b border-line mb-10">
        <div className="flex gap-8 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`pb-3 -mb-px text-[13px] transition-colors border-b-2 whitespace-nowrap ${
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

      <div id="faq">
        <FAQ items={EPR_FAQ} />
      </div>
    </ModuleLayout>
  );
}

function Stat({
  n,
  label,
  tone = "neutral",
}: {
  n: number;
  label: string;
  tone?: "neutral" | "warn" | "soft" | "ok";
}) {
  const toneClass =
    tone === "warn"
      ? "text-rose-700"
      : tone === "ok"
        ? "text-emerald-700"
        : tone === "soft"
          ? "text-slate-600"
          : "text-ink";
  return (
    <div>
      <p className={`text-[28px] font-light ${toneClass}`}>{n}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
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
      {items.map((o) => {
        const reason =
          o.category === "packaging"
            ? "Required before any shipment enters " + COUNTRY_LABEL[o.country] + "."
            : o.note ?? "";
        const cta =
          o.status === "rejected" ? "Fix" : o.status === "review-required" ? "Review" : "Complete";
        return (
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
                <p className="text-sm text-muted-foreground mt-2">{reason}</p>
                {o.affectedProducts > 0 && (
                  <p className="text-xs text-rose-700 mt-2">
                    {o.affectedProducts} listings cannot be shipped to {COUNTRY_LABEL[o.country]}.
                  </p>
                )}
              </div>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink whitespace-nowrap pt-1">
                {cta} <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </span>
            </div>
          </Link>
        );
      })}
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
          needs.length > 0
            ? "Partially blocked"
            : rows.some((r) => statusGroup(r.status) === "expiring-soon")
              ? "Renewal due"
              : rows.some((r) => statusGroup(r.status) === "under-review")
                ? "Under review"
                : "Approved";
        const toneClass =
          needs.length > 0
            ? "text-rose-700"
            : overall === "Renewal due"
              ? "text-amber-800"
              : overall === "Under review"
                ? "text-slate-600"
                : "text-emerald-700";

        return (
          <div key={code} className="border border-line bg-background p-7">
            <div className="flex items-start justify-between gap-8">
              <div className="flex-1">
                <h3 className="text-lg text-ink">{COUNTRY_LABEL[code]}</h3>
                <p className={`text-xs mt-1 ${toneClass}`}>Status: {overall}</p>
                {needs.length > 0 ? (
                  <div className="mt-5">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">
                      Needs attention
                    </p>
                    <ul className="text-sm text-ink space-y-1">
                      {needs.map((n) => (
                        <li key={n.id}>· {CATEGORY_LABEL[n.category]}</li>
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
                  {o.affectedProducts > 0 ? `${o.affectedProducts} listings` : o.authority}
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

const EPR_FAQ = [
  {
    q: "What is EPR?",
    a: "Extended Producer Responsibility is a set of rules that can require sellers to register and contribute to recycling systems for certain products or packaging placed on a market.",
  },
  {
    q: "Why do I need to provide this information?",
    a: "Camelune may need to verify that your seller account is allowed to sell affected products in specific destination countries.",
  },
  {
    q: "Which countries are affected?",
    a: "Requirements depend on the countries where your products are sold or shipped. Camelune shows obligations separately for each destination country.",
  },
  {
    q: "What happens if I do not complete a requirement?",
    a: "Only the affected listings and destination countries are restricted. For example, missing German packaging information blocks eligible sales to Germany, but not necessarily sales to Romania or France.",
  },
  {
    q: "Why are only some listings blocked?",
    a: "EPR obligations depend on product type, destination country and shipping model. For example, a smartwatch may require packaging, battery and WEEE information, while a mechanical watch may only require packaging.",
  },
  {
    q: "Do I need separate registrations for packaging, batteries and WEEE?",
    a: "In many countries, yes. Packaging, batteries and electrical/electronic products can have separate registration or reporting systems.",
  },
  {
    q: "What happens after I submit my documents?",
    a: "Camelune reviews the information and updates the requirement status. If something is missing or unclear, you will be asked to correct it.",
  },
];
