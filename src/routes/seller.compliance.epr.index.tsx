import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ModuleLayout } from "@/components/seller/ModuleLayout";
import { StatusBadge } from "@/components/seller/StatusBadge";
import { FAQ } from "@/components/seller/FAQ";
import { HelpLink } from "@/components/seller/HelpLink";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  OBLIGATIONS,
  CATEGORY_LABEL,
  COUNTRY_LABEL,
  obligationSlug,
  statusGroup,
  type EprCategory,
  type CountryCode,
  type Obligation,
} from "@/lib/epr-data";
import { ArrowRight, Info, ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const Route = createFileRoute("/seller/compliance/epr/")({
  head: () => ({
    meta: [
      { title: "EPR Compliance — Camelune" },
      {
        name: "description",
        content:
          "Extended Producer Responsibility for packaging, batteries, electrical products and textiles in EU destination countries.",
      },
    ],
  }),
  component: Page,
});

const CATEGORIES: EprCategory[] = ["packaging", "batteries", "weee", "textiles"];
const COUNTRIES: CountryCode[] = ["RO", "DE", "FR"];

type Tab = "all" | "action" | "documents";

function Page() {
  const total = OBLIGATIONS.length;
  const needs = OBLIGATIONS.filter((o) => statusGroup(o.status) === "needs-action").length;
  const approved = OBLIGATIONS.filter((o) => statusGroup(o.status) === "approved").length;
  const underReview = OBLIGATIONS.filter((o) => statusGroup(o.status) === "under-review").length;
  const completedPct = Math.round((approved / total) * 100);

  const initialTab: Tab = needs > 0 ? "all" : "all";
  const [tab, setTab] = useState<Tab>(initialTab);

  const TABS: { id: Tab; label: string; count?: number }[] = [
    { id: "all", label: "All obligations" },
    ...(needs > 0 ? [{ id: "action" as Tab, label: "Needs action", count: needs }] : []),
    { id: "documents", label: "Documents" },
  ];

  return (
    <ModuleLayout>
      <header className="mb-10">
        <h1 className="text-[2rem] text-ink">EPR Compliance</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground max-w-2xl">
          Extended Producer Responsibility (EPR) requires sellers to register
          and report for packaging, batteries and electrical products sold in
          EU countries.
        </p>
      </header>

      {/* Educational — collapsed by default (Global Rule) */}
      <Accordion type="single" collapsible className="mb-8">
        <AccordionItem value="what" className="border border-line bg-cream/40">
          <AccordionTrigger className="px-7 py-5 hover:no-underline">
            <div className="flex items-center gap-4 text-left">
              <Info className="h-5 w-5 text-ink-soft shrink-0" strokeWidth={1.5} />
              <span className="text-[15px] text-ink">What is EPR?</span>
              <span className="text-xs text-muted-foreground ml-2">Learn more</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-7 pb-6 pl-[60px]">
            <p className="text-sm text-muted-foreground leading-relaxed">
              EPR obliges producers to ensure their products are designed,
              used and disposed of in an environmentally responsible way.
              Sellers who ship products to EU countries are considered
              producers and must comply.
            </p>
            <div className="pt-3">
              {/* TODO: activate when Help Center is published */}
              <HelpLink inline label="Learn more" href="/help/epr" />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Stats row */}
      <section className="border border-line bg-background p-7 mb-2">
        <div className="grid grid-cols-4 gap-6">
          <Stat n={total} label="Total obligations" />
          <Stat n={needs} label="Needs action" tone={needs > 0 ? "warn" : "neutral"} />
          <Stat n={approved} label="Approved" tone="ok" />
          <Stat n={underReview} label="Under review" tone="soft" />
        </div>
      </section>
      <section className="border border-line border-t-0 bg-background p-7 mb-10">
        <div className="flex items-baseline justify-between mb-2">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            Overall progress
          </p>
          <p className="text-xs text-muted-foreground">
            {approved} of {total} completed — {completedPct}%
          </p>
        </div>
        <Progress value={completedPct} className="h-1.5" />
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
              {typeof t.count === "number" && (
                <span className="ml-2 text-rose-700">({t.count})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {tab === "all" && <AllMatrix />}
      {tab === "action" && <ActionRequired />}
      {tab === "documents" && <SubmittedDocs />}

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
  const tc =
    tone === "warn"
      ? "text-rose-700"
      : tone === "ok"
        ? "text-emerald-700"
        : tone === "soft"
          ? "text-slate-600"
          : "text-ink";
  return (
    <div>
      <p className={`text-[28px] font-light ${tc}`}>{n}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

function AllMatrix() {
  return (
    <div className="border border-line bg-background overflow-x-auto">
      <div className="grid grid-cols-[200px_repeat(3,1fr)] border-b border-line text-[11px] uppercase tracking-[0.14em] text-muted-foreground min-w-[720px]">
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
          className="grid grid-cols-[200px_repeat(3,1fr)] border-b border-line last:border-b-0 min-w-[720px]"
        >
          <div className="px-5 py-5 text-sm text-ink">{CATEGORY_LABEL[cat]}</div>
          {COUNTRIES.map((country) => {
            const o = OBLIGATIONS.find((x) => x.category === cat && x.country === country);
            if (!o) return <div key={country} className="px-5 py-5 border-l border-line" />;
            const interactive =
              statusGroup(o.status) === "needs-action" ||
              statusGroup(o.status) === "expiring-soon";
            const cell = (
              <>
                <StatusBadge status={o.status} />
                <p className="text-xs text-muted-foreground mt-2">
                  {o.affectedProducts > 0 ? `${o.affectedProducts} listings` : o.authority}
                </p>
                {o.dueLabel && (
                  <p className="text-xs text-ink-soft mt-1">{o.dueLabel}</p>
                )}
              </>
            );
            return interactive ? (
              <Link
                key={country}
                to="/seller/compliance/epr/r/$slug"
                params={{ slug: obligationSlug(o) }}
                className="px-5 py-5 border-l border-line block hover:bg-muted/40 transition-colors"
              >
                {cell}
              </Link>
            ) : (
              <Link
                key={country}
                to="/seller/compliance/epr/r/$slug"
                params={{ slug: obligationSlug(o) }}
                className="px-5 py-5 border-l border-line block hover:bg-muted/40 transition-colors"
              >
                {cell}
              </Link>
            );
          })}
        </div>
      ))}
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
      {items.map((o) => (
        <div
          key={o.id}
          className="border border-line bg-background px-7 py-6"
        >
          <div className="flex items-start justify-between gap-8">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <p className="text-[15px] text-ink">
                  {CATEGORY_LABEL[o.category]} — {COUNTRY_LABEL[o.country]}
                </p>
                <StatusBadge status={o.status} />
              </div>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-xl">
                {o.note}
              </p>
              {o.affectedProducts > 0 && (
                <a
                  href="#"
                  className="inline-block text-xs text-rose-700 mt-2 underline-offset-4 hover:underline"
                >
                  {o.affectedProducts} listings affected — view listings
                </a>
              )}
            </div>
            <Link
              to="/seller/compliance/epr/r/$slug"
              params={{ slug: obligationSlug(o) }}
              className="inline-flex items-center gap-2 px-5 h-11 bg-ink text-cream text-xs uppercase tracking-[0.16em] hover:bg-ink/90 whitespace-nowrap"
            >
              Fix now <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

type DocState = "approved" | "under-review" | "rejected" | "expiring-soon" | "expired";

function docState(o: Obligation): DocState | null {
  switch (o.status) {
    case "approved": return "approved";
    case "submitted":
    case "under-review":
    case "draft": return "under-review";
    case "rejected":
    case "review-required": return "rejected";
    case "expiring-soon": return "expiring-soon";
    default: return null;
  }
}

function docFileName(o: Obligation) {
  return `${o.category}-${o.country.toLowerCase()}-2026.pdf`;
}

function SubmittedDocs() {
  const [selected, setSelected] = useState<Obligation | null>(null);
  const docs = OBLIGATIONS.filter((o) => docState(o) !== null);

  return (
    <>
      <div className="border border-line divide-y divide-line bg-background">
        {docs.map((o) => (
          <button
            key={o.id}
            onClick={() => setSelected(o)}
            className="w-full text-left px-6 py-5 flex items-center justify-between gap-6 hover:bg-muted/40 transition-colors group"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ink">
                {CATEGORY_LABEL[o.category]} — {COUNTRY_LABEL[o.country]}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {o.authority} · {docFileName(o)}
              </p>
              {o.dueLabel && (
                <p className="text-xs text-ink-soft mt-1">{o.dueLabel}</p>
              )}
            </div>
            <div className="flex items-center gap-5 shrink-0">
              <StatusBadge status={o.status} />
              <ChevronRight
                className="h-4 w-4 text-muted-foreground group-hover:text-ink transition-colors"
                strokeWidth={1.5}
              />
            </div>
          </button>
        ))}
      </div>

      <Sheet open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-[480px] bg-background border-l border-line p-0 overflow-y-auto">
          {selected && <DocumentPanel obligation={selected} />}
        </SheetContent>
      </Sheet>
    </>
  );
}

function DocumentPanel({ obligation: o }: { obligation: Obligation }) {
  return (
    <div className="px-8 py-10">
      <SheetHeader className="text-left space-y-3 mb-8">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          {COUNTRY_LABEL[o.country]}
        </p>
        <SheetTitle className="text-[22px] font-normal text-ink">
          {CATEGORY_LABEL[o.category]}
        </SheetTitle>
        <div>
          <StatusBadge status={o.status} />
        </div>
      </SheetHeader>

      <dl className="text-sm divide-y divide-line border-t border-b border-line">
        <Row k="Authority" v={o.authority} />
        <Row k="Document" v={docFileName(o)} />
        {o.dueLabel && <Row k="Renews / due" v={o.dueLabel} />}
        {o.affectedProducts > 0 && (
          <Row k="Affected listings" v={`${o.affectedProducts}`} />
        )}
      </dl>

      {o.note && (
        <p className="text-sm text-muted-foreground leading-relaxed mt-6">
          {o.note}
        </p>
      )}

      <div className="mt-8">
        <Link
          to="/seller/compliance/epr/r/$slug"
          params={{ slug: obligationSlug(o) }}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink hover:opacity-70"
        >
          Open requirement details
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] py-3">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-ink">{v}</dd>
    </div>
  );
}

const EPR_FAQ = [
  // "What is EPR?" moved to collapsible card at top (Global Rule: no duplicates)
  { q: "Why do I need to provide this information?", a: "Camelune may need to verify that your seller account is allowed to sell affected products in specific destination countries." },
  { q: "Which countries are affected?", a: "Requirements depend on the countries where your products are sold or shipped. Camelune shows obligations separately for each destination country." },
  { q: "What happens if I do not complete a requirement?", a: "Only the affected listings and destination countries are restricted. Missing German packaging information blocks eligible sales to Germany, but not necessarily sales to Romania or France." },
  { q: "Why are only some listings blocked?", a: "EPR obligations depend on product type, destination country and shipping model. A smartwatch may require packaging, battery and WEEE information, while a mechanical watch may only require packaging." },
  { q: "Do I need separate registrations for packaging, batteries and WEEE?", a: "In most countries, yes. Packaging, batteries and electrical/electronic products usually have separate registration and reporting systems." },
  { q: "What happens after I submit my documents?", a: "Camelune reviews the information and updates the requirement status. If something is missing or unclear, you will be asked to correct it." },
];
