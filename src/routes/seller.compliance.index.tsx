import { createFileRoute, Link } from "@tanstack/react-router";
import { SellerLayout } from "@/components/seller/SellerLayout";
import { StatusBadge } from "@/components/seller/StatusBadge";
import { OBLIGATIONS, SELLER, COUNTRY_LABEL } from "@/lib/epr-data";
import { ShieldCheck, FileBadge, Scale, ArrowUpRight, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/seller/compliance/")({
  head: () => ({
    meta: [
      { title: "Seller Compliance Center — Camelune" },
      { name: "description", content: "Overview of all compliance obligations for your seller account." },
    ],
  }),
  component: Page,
});

function Page() {
  const blockers = OBLIGATIONS.filter((o) => o.status === "missing" || o.status === "rejected");
  const attention = OBLIGATIONS.filter((o) =>
    ["review-required", "expiring-soon"].includes(o.status),
  );

  return (
    <SellerLayout>
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Seller account · {SELLER.company}
        </p>
        <h1 className="text-3xl mt-2 text-ink">Compliance Center</h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-xl">
          A single view of every legal, fiscal and environmental obligation
          attached to your listings on Camelune. Compliance is country-specific —
          a missing requirement only blocks sales in the country it concerns.
        </p>
      </header>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-px bg-line border border-line mb-12">
        <SummaryCard
          icon={ShieldCheck}
          label="EPR Compliance"
          value={`${OBLIGATIONS.filter((o) => o.status === "approved").length} / ${OBLIGATIONS.length}`}
          sub="Requirements approved"
          to="/seller/compliance/epr"
        />
        <SummaryCard
          icon={FileBadge}
          label="Tax & VAT"
          value="3 / 3"
          sub="Registrations active"
          tone="muted"
        />
        <SummaryCard
          icon={Scale}
          label="Product authenticity"
          value="All clear"
          sub="Verified by Camelune"
          tone="muted"
        />
      </div>

      {/* Active blockers */}
      {blockers.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-red-700" strokeWidth={1.5} />
            <h2 className="text-base text-ink">Action required</h2>
          </div>
          <div className="border border-line divide-y divide-line">
            {blockers.map((b) => (
              <div key={b.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm text-ink">
                    {b.category[0].toUpperCase() + b.category.slice(1)} — {COUNTRY_LABEL[b.country]}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{b.note}</p>
                </div>
                <div className="flex items-center gap-5">
                  <StatusBadge status={b.status} />
                  <Link
                    to="/seller/compliance/epr/packaging-germany"
                    className="text-xs uppercase tracking-[0.16em] text-ink hover:underline"
                  >
                    Resolve →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Attention */}
      {attention.length > 0 && (
        <section className="mb-12">
          <h2 className="text-base text-ink mb-4">Watch list</h2>
          <div className="border border-line divide-y divide-line">
            {attention.map((b) => (
              <div key={b.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm text-ink">
                    {b.category[0].toUpperCase() + b.category.slice(1)} — {COUNTRY_LABEL[b.country]}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{b.note}</p>
                </div>
                <div className="flex items-center gap-5">
                  <StatusBadge status={b.status} />
                  <span className="text-xs text-muted-foreground">{b.dueLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-base text-ink mb-4">Where to go next</h2>
        <div className="grid grid-cols-2 gap-px bg-line border border-line">
          <NextLink
            to="/seller/compliance/epr"
            title="Open EPR Compliance"
            desc="Producer responsibility for packaging, batteries, electricals and textiles."
          />
          <NextLink
            to="/seller/compliance/epr/by-country"
            title="Browse by destination country"
            desc="See what is required for Romania, Germany and France."
          />
        </div>
      </section>
    </SellerLayout>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  sub,
  to,
  tone,
}: {
  icon: typeof ShieldCheck;
  label: string;
  value: string;
  sub: string;
  to?: string;
  tone?: "muted";
}) {
  const inner = (
    <div className="bg-background p-6 h-full">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" strokeWidth={1.5} />
        <p className="nav-label">{label}</p>
      </div>
      <p className={`mt-6 text-2xl ${tone === "muted" ? "text-ink-soft" : "text-ink"}`}>
        {value}
      </p>
      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
      {to && (
        <p className="mt-6 inline-flex items-center gap-1 text-xs uppercase tracking-[0.16em] text-ink">
          Open <ArrowUpRight className="h-3 w-3" />
        </p>
      )}
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

function NextLink({ to, title, desc }: { to: string; title: string; desc: string }) {
  return (
    <Link to={to} className="bg-background p-6 hover:bg-muted/50 transition-colors">
      <p className="text-sm text-ink">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
      <p className="mt-5 inline-flex items-center gap-1 text-xs uppercase tracking-[0.16em] text-ink">
        Continue <ArrowUpRight className="h-3 w-3" />
      </p>
    </Link>
  );
}
