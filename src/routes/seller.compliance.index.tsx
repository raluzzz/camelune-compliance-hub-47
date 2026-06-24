import { createFileRoute, Link } from "@tanstack/react-router";
import { SellerLayout } from "@/components/seller/SellerLayout";
import {
  ArrowRight,
  ShieldCheck,
  FileBadge,
  ClipboardList,
} from "lucide-react";
import {
  OBLIGATIONS,
  statusGroup,
  obligationSlug,
  CATEGORY_LABEL,
  COUNTRY_LABEL,
  type Obligation,
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

interface Domain {
  icon: typeof ShieldCheck;
  title: string;
  status: string;
  tone: Tone;
  text: string;
  ctaLabel: string;
  to: string;
  meta?: string;
}

function Page() {
  const eprNeeds = OBLIGATIONS.filter(
    (o) => statusGroup(o.status) === "needs-action",
  );
  const eprExpiring = OBLIGATIONS.filter(
    (o) => statusGroup(o.status) === "expiring-soon",
  );
  const eprOpen = eprNeeds.length + eprExpiring.length;
  const eprRelevant = OBLIGATIONS.filter((o) => o.status !== "not-required");
  const eprDone = eprRelevant.filter(
    (o) => statusGroup(o.status) === "approved",
  ).length;

  const DOMAINS: Domain[] = [
    {
      icon: FileBadge,
      title: "Tax & VAT",
      status: "All clear",
      tone: "ok",
      text: "Your tax registration and VAT status for the countries where you sell.",
      ctaLabel: "Open Tax & VAT",
      to: "/seller/compliance/tax",
      meta: "0 issues",
    },
    {
      icon: ShieldCheck,
      title: "EPR Compliance",
      status: eprOpen > 0 ? "Needs action" : "All clear",
      tone: eprOpen > 0 ? "warn" : "ok",
      text: "Complete your EPR registrations for the countries where you ship products. Missing information will block your listings in those countries.",
      ctaLabel: "Open EPR Compliance",
      to: "/seller/compliance/epr",
      meta: `${eprDone} of ${eprRelevant.length} obligations complete — ${eprOpen} need action`,
    },
    {
      icon: ClipboardList,
      title: "DAC7 Reporting",
      status: "Not required yet",
      tone: "neutral",
      text: "Becomes required if you exceed 30 sales or €2,000/year. You are not currently affected.",
      ctaLabel: "See your progress",
      to: "/seller/compliance/dac7",
      meta: "0 issues",
    },
  ];

  // Build action items from real EPR data
  const actions: {
    title: string;
    desc: string;
    cta: "Complete" | "Review" | "Fix" | "Renew";
    to: string;
    slug: string;
  }[] = [...eprNeeds, ...eprExpiring].slice(0, 5).map((o) => {
    const isExpiring = statusGroup(o.status) === "expiring-soon";
    const isRejected = o.status === "rejected";
    return {
      title: `${CATEGORY_LABEL[o.category]} — ${COUNTRY_LABEL[o.country]}`,
      desc:
        o.note ??
        (o.affectedProducts > 0
          ? `${o.affectedProducts} listings affected.`
          : ""),
      cta: isExpiring ? "Renew" : isRejected ? "Fix" : "Complete",
      to: "/seller/compliance/epr/r/$slug",
      slug: obligationSlug(o),
    };
  });

  return (
    <SellerLayout>
      <div className="max-w-[1040px] mx-auto">
        <header className="mb-12">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Seller account
          </p>
          <h1 className="text-[2rem] mt-3 text-ink">My Compliance</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground max-w-3xl">
            This section helps you manage your legal obligations as a seller
            on Camelune. Tax & VAT, EPR and DAC7 are three separate types of
            regulation — each covers different aspects of selling in the EU.
            Complete each section to keep your account active and your
            listings visible.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line">
            <Explainer
              label="Tax & VAT"
              text="Your tax registration and VAT status for the countries where you sell."
            />
            <Explainer
              label="EPR"
              text="Environmental registration for packaging, batteries and electrical products."
            />
            <Explainer
              label="DAC7"
              text="EU income reporting rule — applies only if you exceed 30 sales or €2,000/year."
            />
          </div>
        </header>

        {/* Action required — always first */}
        {actions.length > 0 && (
          <section className="mb-14">
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
                  params={{ slug: a.slug }}
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

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DOMAINS.map((d) => (
            <DomainCard key={d.title} {...d} />
          ))}
        </section>
      </div>
    </SellerLayout>
  );
}

function Explainer({ label, text }: { label: string; text: string }) {
  return (
    <div className="bg-background p-6">
      <p className="text-[11px] uppercase tracking-[0.18em] text-ink">
        {label}
      </p>
      <p className="text-[13px] leading-relaxed text-muted-foreground mt-2">
        {text}
      </p>
    </div>
  );
}

function DomainCard({
  icon: Icon,
  title,
  status,
  tone,
  text,
  ctaLabel,
  to,
  meta,
}: Domain) {
  const toneClass =
    tone === "warn"
      ? "text-rose-700"
      : tone === "ok"
        ? "text-emerald-700"
        : "text-muted-foreground";

  return (
    <Link
      to={to}
      className="block border border-line bg-background p-7 h-full hover:border-ink/40 transition-colors"
    >
      <div className="flex flex-col h-full">
        <Icon className="h-5 w-5 text-ink-soft" strokeWidth={1.5} />
        <p className="mt-6 text-[15px] text-ink">{title}</p>
        <div className="mt-1 flex items-center gap-2 flex-wrap">
          <p className={`text-xs ${toneClass}`}>{status}</p>
          {meta && (
            <>
              <span className="text-xs text-muted-foreground/60">·</span>
              <p className="text-xs text-muted-foreground">{meta}</p>
            </>
          )}
        </div>
        <p className="mt-5 text-[13px] leading-relaxed text-muted-foreground flex-1">
          {text}
        </p>
        <p className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink">
          {ctaLabel} <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </p>
      </div>
    </Link>
  );
}
