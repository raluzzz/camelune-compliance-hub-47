import { createFileRoute, Link } from "@tanstack/react-router";
import { SellerLayout } from "@/components/seller/SellerLayout";
import { ArrowRight, ShieldCheck, FileBadge, ClipboardList } from "lucide-react";

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
}

const DOMAINS: Domain[] = [
  {
    icon: FileBadge,
    title: "Tax & VAT",
    status: "All clear",
    tone: "ok",
    text: "Manage your VAT information and tax status for the countries where your products can be sold.",
    ctaLabel: "Open Tax & VAT",
    to: "/seller/compliance/tax",
  },
  {
    icon: ShieldCheck,
    title: "EPR Compliance",
    status: "Needs action",
    tone: "warn",
    text: "Complete packaging, batteries, electronics and textile requirements by destination country.",
    ctaLabel: "Open EPR Compliance",
    to: "/seller/compliance/epr",
  },
  {
    icon: ClipboardList,
    title: "DAC7 Reporting",
    status: "Not required yet",
    tone: "neutral",
    text: "Provide seller reporting information required under EU platform tax reporting rules when applicable.",
    ctaLabel: "Open DAC7",
    to: "/seller/compliance/dac7",
  },
];

interface ActionItem {
  title: string;
  desc: string;
  cta: "Complete" | "Review" | "Fix";
  to: string;
}

const ACTIONS: ActionItem[] = [
  {
    title: "Packaging — Germany",
    desc: "31 listings cannot be shipped to Germany.",
    cta: "Complete",
    to: "/seller/compliance/epr/packaging-germany",
  },
  {
    title: "Batteries — Germany",
    desc: "9 listings cannot be shipped to Germany.",
    cta: "Review",
    to: "/seller/compliance/epr",
  },
  {
    title: "WEEE — France",
    desc: "The submitted document was rejected.",
    cta: "Fix",
    to: "/seller/compliance/epr",
  },
];

function Page() {
  return (
    <SellerLayout>
      <div className="max-w-[1040px] mx-auto">
        <header className="mb-14">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Seller account
          </p>
          <h1 className="text-[2rem] mt-3 text-ink">My Compliance</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground max-w-2xl">
            Manage the tax, environmental and platform reporting requirements
            that affect where your products can be sold on Camelune.
          </p>
        </header>

        <section className="grid grid-cols-3 gap-6 mb-16">
          {DOMAINS.map((d) => (
            <DomainCard key={d.title} {...d} />
          ))}
        </section>

        <section>
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="text-lg text-ink">Action required</h2>
            <span className="text-xs text-muted-foreground">
              {ACTIONS.length} items
            </span>
          </div>
          <div className="space-y-3">
            {ACTIONS.map((a) => (
              <Link
                key={a.title}
                to={a.to}
                className="block border border-line bg-background px-7 py-6 hover:border-ink/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-8">
                  <div className="min-w-0">
                    <p className="text-[15px] text-ink">{a.title}</p>
                    <p className="text-sm text-muted-foreground mt-1.5">{a.desc}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink whitespace-nowrap pt-1">
                    {a.cta} <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </SellerLayout>
  );
}

function DomainCard({ icon: Icon, title, status, tone, text, ctaLabel, to }: Domain) {
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
        <p className={`mt-1 text-xs ${toneClass}`}>{status}</p>
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
