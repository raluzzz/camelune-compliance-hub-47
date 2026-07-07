import { createFileRoute, Link } from "@tanstack/react-router";
import { SellerLayout } from "@/components/seller/SellerLayout";
import { ArrowRight } from "lucide-react";
import { buildComplianceActionItems } from "@/lib/compliance-actions";
import {
  OBLIGATIONS,
  statusGroup,
} from "@/lib/epr-data";

export const Route = createFileRoute("/seller/compliance/")({
  head: () => ({
    meta: [
      { title: "My Compliance — Camelune" },
      {
        name: "description",
        content:
          "Hub for Tax & VAT, EPR and DAC7 reporting requirements affecting where your products can be sold.",
      },
    ],
  }),
  component: Page,
});

type Tone = "ok" | "warn" | "neutral";

interface DomainLink {
  label: string;
  text: string;
  to: string;
  status: string;
  tone: Tone;
}

function Page() {
  const eprOpen = OBLIGATIONS.filter(
    (o) =>
      statusGroup(o.status) === "needs-action" ||
      statusGroup(o.status) === "expiring-soon",
  ).length;

  const domains: DomainLink[] = [
    {
      label: "Tax & VAT",
      text: "Your tax registration and VAT status for the countries where you sell.",
      to: "/seller/compliance/tax",
      status: "All clear",
      tone: "ok",
    },
    {
      label: "EPR",
      text: "Environmental registration for packaging, batteries and electrical products.",
      to: "/seller/compliance/epr",
      status: eprOpen > 0 ? "Needs action" : "All clear",
      tone: eprOpen > 0 ? "warn" : "ok",
    },
    {
      label: "DAC7",
      text: "EU income reporting rule — applies only if you exceed 30 sales or €2,000/year.",
      to: "/seller/compliance/dac7",
      status: "Not required yet",
      tone: "neutral",
    },
  ];

  const actions = buildComplianceActionItems();

  return (
    <SellerLayout>
      <div className="max-w-[1040px] mx-auto">
        <header className="mb-10">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Seller account
          </p>
          <h1 className="text-[2rem] mt-3 text-ink">My Compliance</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground max-w-3xl">
            This section helps you manage your legal obligations as a seller on
            Camelune. Tax & VAT, EPR and DAC7 are three separate types of
            regulation — each covers different aspects of selling in the EU.
            Complete each section to keep your account active and your listings
            visible.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line">
            {domains.map((d) => (
              <DomainLinkCard key={d.label} {...d} />
            ))}
          </div>
        </header>

        {actions.length > 0 && (
          <section>
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="text-lg text-ink">Action required</h2>
              <span className="text-xs text-muted-foreground">
                {actions.length} {actions.length === 1 ? "item" : "items"}
              </span>
            </div>
            <div className="space-y-3">
              {actions.map((a) => (
                <Link
                  key={a.title}
                  to={a.to}
                  params={a.params}
                  className="block border border-line bg-background px-7 py-6 hover:border-ink/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-8">
                    <div className="min-w-0">
                      <p className="text-[15px] text-ink">{a.title}</p>
                      <p className="text-sm text-muted-foreground mt-1.5">
                        {a.desc}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink whitespace-nowrap pt-1">
                      {a.cta}{" "}
                      <ArrowRight
                        className="h-3.5 w-3.5"
                        strokeWidth={1.5}
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </SellerLayout>
  );
}

function DomainLinkCard({ label, text, to, status, tone }: DomainLink) {
  const badgeClass =
    tone === "warn"
      ? "bg-rose-50/70 text-rose-700"
      : tone === "ok"
        ? "bg-emerald-50/70 text-emerald-700"
        : "bg-muted text-muted-foreground";

  return (
    <Link
      to={to}
      className="group bg-background p-6 hover:bg-muted/30 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink">
            {label}
          </p>
          <p className="text-[13px] leading-relaxed text-muted-foreground mt-2">
            {text}
          </p>
          <span
            className={`inline-flex items-center mt-4 px-2 py-[3px] rounded-full text-[10.5px] tracking-[0.04em] ${badgeClass}`}
          >
            {status}
          </span>
        </div>
        <ArrowRight
          className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5 group-hover:text-ink transition-colors"
          strokeWidth={1.5}
        />
      </div>
    </Link>
  );
}
