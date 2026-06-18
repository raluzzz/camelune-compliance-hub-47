import { createFileRoute, Link } from "@tanstack/react-router";
import { SellerLayout } from "@/components/seller/SellerLayout";
import { OBLIGATIONS, SELLER, COUNTRY_LABEL, CATEGORY_LABEL, statusGroup } from "@/lib/epr-data";
import { ShieldCheck, FileBadge, Gem, ArrowRight } from "lucide-react";

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
  const needsAction = OBLIGATIONS.filter((o) => statusGroup(o.status) === "needs-action");
  const expiring = OBLIGATIONS.filter((o) => statusGroup(o.status) === "expiring-soon");
  const eprStatus =
    needsAction.length > 0 ? "Needs action" : expiring.length > 0 ? "Expiring soon" : "All clear";

  return (
    <SellerLayout>
      <div className="max-w-[1040px] mx-auto">
        <header className="mb-14">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Seller account · {SELLER.company}
          </p>
          <h1 className="text-[2rem] mt-3 text-ink">Compliance Center</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground max-w-xl">
            Everything you need to keep selling across your destination markets.
            We will tell you when something needs your attention.
          </p>
        </header>

        {/* Three primary domain cards */}
        <section className="grid grid-cols-3 gap-6 mb-16">
          <DomainCard
            icon={ShieldCheck}
            title="EPR Compliance"
            status={eprStatus}
            tone={needsAction.length > 0 ? "warn" : expiring.length > 0 ? "soft" : "ok"}
            sentence="Producer responsibility for the packaging, batteries, electronics and textiles you place on each market."
            ctaLabel="Open EPR Compliance"
            to="/seller/compliance/epr"
          />
          <DomainCard
            icon={FileBadge}
            title="Tax & VAT"
            status="All clear"
            tone="ok"
            sentence="Your VAT registrations for Romania, Germany and France are active and up to date."
            ctaLabel="View tax details"
          />
          <DomainCard
            icon={Gem}
            title="Product Authenticity"
            status="Verified"
            tone="ok"
            sentence="All listed items have passed Camelune's authentication process."
            ctaLabel="View certificates"
          />
        </section>

        {/* Action required — primary focus */}
        {needsAction.length > 0 && (
          <section className="mb-12">
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="text-lg text-ink">Action required</h2>
              <span className="text-xs text-muted-foreground">
                {needsAction.length} item{needsAction.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="space-y-3">
              {needsAction.slice(0, 3).map((o) => (
                <Link
                  key={o.id}
                  to="/seller/compliance/epr/packaging-germany"
                  className="block border border-line bg-background px-7 py-6 hover:border-ink/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-8">
                    <div className="min-w-0">
                      <p className="text-[15px] text-ink">
                        {CATEGORY_LABEL[o.category]} — {COUNTRY_LABEL[o.country]}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1.5">
                        {o.affectedProducts > 0
                          ? `${o.affectedProducts} listings cannot be shipped to ${COUNTRY_LABEL[o.country]}.`
                          : o.note}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink whitespace-nowrap pt-1">
                      Complete <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Upcoming renewals — visually secondary */}
        {expiring.length > 0 && (
          <section>
            <h2 className="text-sm uppercase tracking-[0.16em] text-muted-foreground mb-4">
              Upcoming renewals
            </h2>
            <ul className="text-sm">
              {expiring.map((o) => (
                <li
                  key={o.id}
                  className="flex items-center justify-between py-3 border-b border-line last:border-0"
                >
                  <span className="text-ink">
                    {CATEGORY_LABEL[o.category]} — {COUNTRY_LABEL[o.country]}
                  </span>
                  <span className="text-xs text-muted-foreground">{o.dueLabel}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </SellerLayout>
  );
}

function DomainCard({
  icon: Icon,
  title,
  status,
  tone,
  sentence,
  ctaLabel,
  to,
}: {
  icon: typeof ShieldCheck;
  title: string;
  status: string;
  tone: "ok" | "warn" | "soft";
  sentence: string;
  ctaLabel: string;
  to?: string;
}) {
  const toneClass =
    tone === "warn"
      ? "text-rose-700"
      : tone === "soft"
        ? "text-amber-800"
        : "text-emerald-700";

  const inner = (
    <div className="border border-line bg-background p-7 h-full flex flex-col">
      <Icon className="h-5 w-5 text-ink-soft" strokeWidth={1.5} />
      <p className="mt-6 text-[15px] text-ink">{title}</p>
      <p className={`mt-1 text-xs ${toneClass}`}>{status}</p>
      <p className="mt-5 text-[13px] leading-relaxed text-muted-foreground flex-1">
        {sentence}
      </p>
      <p className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink">
        {ctaLabel} <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
      </p>
    </div>
  );
  return to ? (
    <Link to={to} className="block hover:border-ink/40 transition-colors">
      {inner}
    </Link>
  ) : (
    inner
  );
}
