import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ModuleLayout } from "@/components/seller/ModuleLayout";
import {
  OBLIGATIONS,
  CATEGORY_LABEL,
  COUNTRY_LABEL,
  obligationDetailLink,
  statusGroup,
  type EprCategory,
  type CountryCode,
  type Obligation,
} from "@/lib/epr-data";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/seller/compliance/epr/all")({
  head: () => ({
    meta: [{ title: "Your EPR Obligations — Camelune" }],
  }),
  component: Page,
});

const CATEGORIES: EprCategory[] = ["packaging", "batteries", "weee"];
const COUNTRIES: CountryCode[] = ["RO", "DE", "FR"];

const COUNTRY_FLAG: Record<CountryCode, string> = {
  RO: "🇷🇴",
  DE: "🇩🇪",
  FR: "🇫🇷",
};

const CATEGORY_TITLE_ACCENT: Record<EprCategory, string> = {
  packaging: "border-l-green-600",
  batteries: "border-l-blue-600",
  weee: "border-l-violet-600",
  textiles: "border-l-gray-400",
};

type View = "type" | "country";
type StatusFilter = "all" | "needs-action" | "approved" | "under-review";

function Page() {
  const [view, setView] = useState<View>("type");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [countryFilter, setCountryFilter] = useState<CountryCode | "all">("all");
  const [typeFilter, setTypeFilter] = useState<EprCategory | "all">("all");

  const filtered = OBLIGATIONS.filter((o) => {
    if (typeFilter !== "all" && o.category !== typeFilter) return false;
    if (countryFilter !== "all" && o.country !== countryFilter) return false;
    if (statusFilter === "all") return true;
    if (statusFilter === "needs-action") return statusGroup(o.status) === "needs-action";
    if (statusFilter === "approved") return statusGroup(o.status) === "approved";
    if (statusFilter === "under-review") return statusGroup(o.status) === "under-review";
    return true;
  });

  return (
    <ModuleLayout backLabel="Back to EPR" backTo="/seller/compliance/epr">
      <Link
        to="/seller/compliance/epr"
        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-ink mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
        Back to EPR
      </Link>

      <header className="mb-8">
        <h1 className="text-[2rem] text-ink">Your EPR Obligations</h1>
      </header>

      <div className="flex flex-wrap gap-4 mb-8 text-sm">
        <FilterSelect
          label="Status"
          value={statusFilter}
          options={[
            ["all", "All statuses"],
            ["needs-action", "Needs action"],
            ["approved", "Approved"],
            ["under-review", "Under review"],
          ]}
          onChange={(v) => setStatusFilter(v as StatusFilter)}
        />
        <FilterSelect
          label="Destination country"
          value={countryFilter}
          options={[
            ["all", "All countries"],
            ...COUNTRIES.map((c) => [c, COUNTRY_LABEL[c]] as [string, string]),
          ]}
          onChange={(v) => setCountryFilter(v as CountryCode | "all")}
        />
        <FilterSelect
          label="Type"
          value={typeFilter}
          options={[
            ["all", "All types"],
            ...CATEGORIES.map((c) => [c, CATEGORY_LABEL[c]] as [string, string]),
          ]}
          onChange={(v) => setTypeFilter(v as EprCategory | "all")}
        />
      </div>

      <div className="border-b border-line mb-8 flex gap-8">
        {(
          [
            ["type", "By type"],
            ["country", "By destination country"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setView(id)}
            className={`pb-3 -mb-px text-[13px] border-b-2 whitespace-nowrap ${
              view === id
                ? "border-ink text-ink"
                : "border-transparent text-muted-foreground hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {view === "type" ? (
        <ByTypeView items={filtered} />
      ) : (
        <ByCountryView items={filtered} />
      )}
    </ModuleLayout>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: [string, string][];
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-[160px] border border-line bg-background px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-ink"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}

function ByTypeView({ items }: { items: Obligation[] }) {
  return (
    <div className="space-y-8">
      {CATEGORIES.map((cat) => {
        const rows = items.filter((o) => o.category === cat);
        if (rows.length === 0) return null;
        return (
          <section key={cat}>
            <h2
              className={`text-lg text-ink mb-4 border-l-[3px] pl-2.5 ${CATEGORY_TITLE_ACCENT[cat]}`}
            >
              {CATEGORY_LABEL[cat]}
            </h2>
            <div className="border border-line divide-y divide-line bg-background">
              {rows.map((o) => (
                <ObligationRow key={o.id} obligation={o} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function ByCountryView({ items }: { items: Obligation[] }) {
  const [open, setOpen] = useState<Record<string, boolean>>(
    Object.fromEntries(COUNTRIES.map((c) => [c, true])),
  );

  return (
    <div className="space-y-4">
      {COUNTRIES.map((country) => {
        const rows = items.filter((o) => o.country === country);
        if (rows.length === 0) return null;
        const isOpen = open[country];
        return (
          <section key={country} className="border border-line bg-background">
            <button
              type="button"
              onClick={() => setOpen({ ...open, [country]: !isOpen })}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/30"
            >
              <span className="text-[15px] text-ink">
                {COUNTRY_FLAG[country]} {COUNTRY_LABEL[country]}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                strokeWidth={1.5}
              />
            </button>
            {isOpen && (
              <div className="border-t border-line divide-y divide-line">
                {rows.map((o) => (
                  <ObligationRow key={o.id} obligation={o} compact />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function ObligationRow({ obligation: o, compact }: { obligation: Obligation; compact?: boolean }) {
  const dest = obligationDetailLink(o);
  const statusLabel = statusGroup(o.status);
  const line2 =
    o.dueLabel ||
    (statusLabel === "neutral" ? o.authority : undefined) ||
    (o.affectedProducts > 0 ? `${o.affectedProducts} listings affected` : undefined);

  const inner = (
  <>
      <div className="min-w-0">
        <p className="text-sm text-ink">
          {compact
            ? `${CATEGORY_LABEL[o.category]} — ${statusLabel === "needs-action" ? "Needs action" : STATUS_DISPLAY[o.status]}`
            : `${COUNTRY_LABEL[o.country]}`}
        </p>
        {line2 && <p className="text-xs text-muted-foreground mt-1">{line2}</p>}
      </div>
      {statusGroup(o.status) === "needs-action" && (
        <span className="inline-flex items-center gap-2 shrink-0 px-4 py-1.5 bg-gray-900 text-white text-[13px] font-medium rounded-md group-hover:bg-gray-800 transition-colors duration-150">
          Fix now <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
        </span>
      )}
    </>
  );

  const className =
    "group flex items-center justify-between gap-6 px-6 py-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer";

  return (
    <Link to={dest.to} params={dest.params} className={className}>
      {inner}
    </Link>
  );
}

const STATUS_DISPLAY: Record<Obligation["status"], string> = {
  missing: "Missing",
  draft: "Draft",
  submitted: "Submitted",
  "under-review": "Under review",
  approved: "Approved",
  rejected: "Rejected",
  "expiring-soon": "Expiring soon",
  "not-required": "Not required",
  "review-required": "Review required",
};
