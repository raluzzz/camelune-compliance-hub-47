import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { ModuleLayout } from "@/components/seller/ModuleLayout";
import { FAQ } from "@/components/seller/FAQ";
import { EPR_FAQ } from "@/lib/epr-help-data";
import { EprPartnerNotice } from "@/components/seller/EprPartnerNotice";
import {
  OBLIGATIONS,
  CATEGORY_LABEL,
  COUNTRY_LABEL,
  STATUS_LABEL,
  SELLER,
  obligationDetailLink,
  statusGroup,
  type EprCategory,
  type CountryCode,
  type EprStatus,
  type Obligation,
} from "@/lib/epr-data";
import {
  computeEprCounters,
  obligationsForCounter,
  counterPanelTitle,
  counterPanelAction,
  shouldShowInEprTabs,
  type EprCounterKey,
} from "@/lib/epr-stats";
import { ArrowRight, ChevronDown } from "lucide-react";
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
          "Extended Producer Responsibility for packaging, batteries and electrical products in EU destination countries.",
      },
    ],
  }),
  component: Page,
});

const CATEGORY_TABS: { id: EprCategory; label: string }[] = [
  { id: "packaging", label: "Packaging" },
  { id: "batteries", label: "Batteries" },
  { id: "weee", label: "Electrical appliances" },
];

const COUNTRY_ORDER: CountryCode[] = ["RO", "DE", "FR"];

const REQUIREMENT_TEXT: Record<EprCategory, Record<CountryCode, string>> = {
  packaging: {
    RO: "EPR number (PACK)",
    DE: "EPR number (PACK) + Packaging licensing",
    FR: "EPR number (PACK)",
  },
  batteries: {
    RO: "EPR number (BATT)",
    DE: "EPR number (BATT) + Authorized representative + Self-certification",
    FR: "EPR number (BATT) + Authorized representative + Self-certification",
  },
  weee: {
    RO: "EPR number (EEE)",
    DE: "EPR number (EEE) + Authorized representative",
    FR: "EPR number (EEE) + Authorized representative",
  },
  textiles: {
    RO: "",
    DE: "",
    FR: "",
  },
};

const EU_COUNTRY_CODES = new Set<CountryCode>(["RO", "DE", "FR"]);

const CATEGORY_DESCRIPTION: Record<
  EprCategory,
  { title: string; body: string; helpPath: string } | null
> = {
  packaging: {
    title: "Packaging (PACK)",
    body: "Sellers who ship packaged goods to EU countries are required to register with the national packaging authority in each destination market and report the volumes placed on that market.",
    helpPath: "/help/epr/packaging",
  },
  batteries: {
    title: "Batteries (BATT)",
    body: "Products that contain batteries — including quartz watches, smartwatches and accessories with integrated cells — require registration with the relevant battery authority in each EU country where they are sold.",
    helpPath: "/help/epr/batteries",
  },
  weee: {
    title: "Electrical appliances (EEE)",
    body: "Electrical and electronic equipment sold into EU destination countries must be registered under the WEEE directive in each applicable market, regardless of where the seller is established.",
    helpPath: "/help/epr/weee",
  },
  textiles: null,
};

type CounterKey = EprCounterKey;

function EprHeaderDescription() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-3 max-w-2xl">
      <p className="text-[15px] leading-relaxed text-muted-foreground">
        Extended Producer Responsibility (EPR) requires producers to take
        responsibility for the environmental impact of their products across
        their entire lifecycle — from design to disposal.{" "}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="inline-flex items-center text-muted-foreground hover:text-ink transition-colors"
          aria-expanded={expanded}
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            strokeWidth={1.5}
          />
        </button>
      </p>

      {expanded && (
        <div className="mt-3">
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            On Camelune, sellers who ship products to EU countries are
            considered producers under local law, and may be required to
            register and report for packaging, batteries and electrical
            products in each destination country where their listings are sold.
          </p>
          <a
            href="/help/epr"
            className="inline-block mt-3 text-[13px] text-muted-foreground hover:text-ink underline-offset-4 hover:underline"
          >
            Learn more →
          </a>
        </div>
      )}
    </div>
  );
}

function Page() {
  const [categoryTab, setCategoryTab] = useState<EprCategory>("packaging");
  const [counterPanel, setCounterPanel] = useState<CounterKey | null>(null);

  const counters = computeEprCounters();
  const { identified, "needs-action": needsAction, rejected, submitted } = counters;

  const isNonEuSeller = !EU_COUNTRY_CODES.has(SELLER.baseCountry);

  return (
    <ModuleLayout>
      <header className="mb-10">
        <h1 className="text-[2rem] text-ink">EPR Compliance</h1>
        <EprHeaderDescription />
      </header>

      <EprPartnerNotice />

      {isNonEuSeller && (
        <section className="border border-line bg-background p-6 mb-8">
          <p className="text-[15px] text-ink">You are registered outside the EU</p>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-2xl">
            Sellers registered outside the EU may be required to appoint an
            authorised representative in certain EU countries (e.g. Germany
            under VerpackG, France for packaging from August 2026). The
            relevant detail pages will indicate when this is mandatory.
          </p>
        </section>
      )}

      <ObligationsCounterCard
        identified={identified}
        needsAction={needsAction}
        rejected={rejected}
        submitted={submitted}
        onOpen={setCounterPanel}
      />

      <div className="border-b border-line mb-0">
        <div className="flex gap-8 overflow-x-auto">
          {CATEGORY_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setCategoryTab(t.id)}
              className={`pb-3 -mb-px text-[13px] transition-colors border-b-2 whitespace-nowrap ${
                categoryTab === t.id
                  ? "border-ink text-ink"
                  : "border-transparent text-muted-foreground hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <CategoryTabContent category={categoryTab} />

      <FAQ items={EPR_FAQ} />

      <CounterPanel
        panel={counterPanel}
        onClose={() => setCounterPanel(null)}
      />
    </ModuleLayout>
  );
}

function ObligationsCounterCard({
  identified,
  needsAction,
  rejected,
  submitted,
  onOpen,
}: {
  identified: number;
  needsAction: number;
  rejected: number;
  submitted: number;
  onOpen: (key: CounterKey) => void;
}) {
  const cols: { key: CounterKey; label: string; value: number }[] = [
    { key: "identified", label: "Identified", value: identified },
    { key: "needs-action", label: "Needs action", value: needsAction },
    { key: "rejected", label: "Rejected", value: rejected },
    { key: "submitted", label: "Submitted", value: submitted },
  ];

  return (
    <section className="border border-line bg-background mb-10">
      <div className="grid grid-cols-4 divide-x divide-line">
        {cols.map((col) => (
          <button
            key={col.key}
            type="button"
            onClick={() => onOpen(col.key)}
            className="px-6 py-7 text-left hover:bg-muted/40 transition-colors duration-150"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                {col.label}
              </span>
              <span className="text-[28px] font-light text-ink leading-none mt-2">
                {col.value}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function CategoryTabContent({ category }: { category: EprCategory }) {
  const rows = OBLIGATIONS.filter(
    (o) => o.category === category && shouldShowInEprTabs(o),
  ).sort(
    (a, b) => COUNTRY_ORDER.indexOf(a.country) - COUNTRY_ORDER.indexOf(b.country),
  );

  return (
    <div className="mb-12 mt-8">
      {(() => {
        const desc = CATEGORY_DESCRIPTION[category];
        if (!desc) return null;
        return (
          <div className="mb-6">
            <p className="text-[15px] text-ink mb-2">{desc.title}</p>
            <p className="text-[13px] leading-relaxed text-muted-foreground max-w-2xl">
              {desc.body}
            </p>
            <a
              href={desc.helpPath}
              className="inline-block mt-3 text-[13px] text-muted-foreground hover:text-ink underline-offset-4 hover:underline"
            >
              Learn more →
            </a>
          </div>
        );
      })()}
      <div className="border border-line bg-background divide-y divide-line">
        {rows.length === 0 ? (
          <p className="px-6 py-8 text-sm text-muted-foreground">
            No obligations in your current listings.
          </p>
        ) : (
          rows.map((o) => (
            <CountryObligationRow key={o.id} obligation={o} category={category} />
          ))
        )}
      </div>
    </div>
  );
}

function CountryObligationRow({
  obligation: o,
  category,
}: {
  obligation: Obligation;
  category: EprCategory;
}) {
  const group = statusGroup(o.status);
  const dest = obligationDetailLink(o);
  const requirement = REQUIREMENT_TEXT[category][o.country];

  const subText =
    group === "neutral"
      ? `${o.authority} — not required for this category in ${COUNTRY_LABEL[o.country]} at this time.`
      : o.dueLabel;

  const rowInner = (
    <>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-ink">{COUNTRY_LABEL[o.country]}</p>
        <p className="text-xs text-muted-foreground mt-1">{requirement}</p>
        {subText && (
          <p className="text-xs text-muted-foreground mt-1">{subText}</p>
        )}
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <EprStatusLabel status={o.status} />
        {group === "expiring-soon" && (
          <span className="text-xs uppercase tracking-[0.16em] text-ink inline-flex items-center gap-1">
            Renew <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
          </span>
        )}
      </div>
    </>
  );

  const rowClassName =
    "flex items-center justify-between gap-6 px-6 py-4 hover:bg-muted/40 transition-colors duration-150 cursor-pointer";

  return (
    <Link
      to={dest.to}
      params={dest.params}
      className={rowClassName}
    >
      {rowInner}
    </Link>
  );
}

function CounterPanel({
  panel,
  onClose,
}: {
  panel: CounterKey | null;
  onClose: () => void;
}) {
  const items = panel ? obligationsForCounter(panel) : [];

  return (
    <Sheet open={!!panel} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-[480px] bg-background border-l border-line p-0 overflow-y-auto">
        {panel && (
          <div className="px-8 py-10">
            <SheetHeader className="text-left mb-8">
              <SheetTitle className="text-[22px] font-normal text-ink">
                {counterPanelTitle(panel)}
              </SheetTitle>
            </SheetHeader>
            <div className="space-y-4">
              {items.map((o) => {
                const action = counterPanelAction(o.status);
                return (
                  <div key={o.id} className="border border-line p-5">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <p className="text-sm text-ink">
                        {CATEGORY_LABEL[o.category]} — {COUNTRY_LABEL[o.country]}
                      </p>
                      <EprStatusLabel status={o.status} />
                    </div>
                    {o.note && (
                      <p className="text-xs text-muted-foreground leading-relaxed">{o.note}</p>
                    )}
                    <ObligationDetailLink
                      obligation={o}
                      onClick={onClose}
                      className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink hover:opacity-70"
                    >
                      {action}
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </ObligationDetailLink>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function ObligationDetailLink({
  obligation: o,
  children,
  className,
  onClick,
}: {
  obligation: Obligation;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const dest = obligationDetailLink(o);
  return (
    <Link to={dest.to} params={dest.params} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

function statusTextColor(status: EprStatus): string {
  if (["missing", "rejected", "review-required"].includes(status)) return "text-rose-700";
  if (status === "approved") return "text-emerald-700";
  if (["under-review", "submitted", "draft"].includes(status)) return "text-slate-500";
  if (status === "expiring-soon") return "text-amber-700";
  return "text-muted-foreground";
}

function EprStatusLabel({ status }: { status: EprStatus }) {
  const color = statusTextColor(status);
  return (
    <span className={`text-[11px] uppercase tracking-[0.12em] font-medium ${color}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
