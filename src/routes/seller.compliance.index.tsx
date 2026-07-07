import { createFileRoute, Link } from "@tanstack/react-router";
import { SellerLayout } from "@/components/seller/SellerLayout";
import { ArrowRight } from "lucide-react";
import { buildComplianceActionItems } from "@/lib/compliance-actions";

export const Route = createFileRoute("/seller/compliance/")({
  head: () => ({
    meta: [
      { title: "My Compliance — Camelune" },
      {
        name: "description",
        content:
          "Tax, EPR and DAC7 compliance for your registered business on Camelune.",
      },
    ],
  }),
  component: Page,
});

type Tone = "ok" | "warn" | "neutral";

interface Domain {
  title: string;
  status: string;
  tone: Tone;
  to: string;
}

const DOMAINS: Domain[] = [
  {
    title: "Tax & VAT",
    status: "All clear",
    tone: "ok",
    to: "/seller/compliance/tax",
  },
  {
    title: "EPR Compliance",
    status: "Needs action",
    tone: "warn",
    to: "/seller/compliance/epr",
  },
  {
    title: "DAC7 Reporting",
    status: "Not required yet",
    tone: "neutral",
    to: "/seller/compliance/dac7",
  },
];

const ACTIONS = buildComplianceActionItems();

function Page() {
  return (
    <SellerLayout>
      <div className="max-w-[1040px] mx-auto">
        <header className="mb-10">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Seller account
          </p>
          <h1 className="text-[2rem] mt-3 text-ink">My Compliance</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground max-w-2xl">
            Manage the tax, environmental and platform reporting requirements for
            your registered business — across the EU markets where you sell on
            Camelune.
          </p>
        </header>

        <section className="mb-16 border border-line divide-x divide-line grid grid-cols-3">
          {DOMAINS.map((d) => (
            <StatusRow key={d.title} {...d} />
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
                params={a.params}
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

function StatusRow({ title, status, tone, to }: Domain) {
  const badgeClass =
    tone === "warn"
      ? "bg-rose-50/70 text-rose-700"
      : tone === "ok"
        ? "bg-emerald-50/70 text-emerald-700"
        : "bg-muted text-muted-foreground";

  return (
    <Link
      to={to}
      className="flex items-center justify-between gap-4 bg-background px-6 py-5 hover:bg-muted/30 transition-colors"
    >
      <div className="min-w-0">
        <p className="text-[15px] text-ink">{title}</p>
        <span
          className={`inline-flex items-center mt-2 px-2 py-[3px] rounded-full text-[10.5px] tracking-[0.04em] ${badgeClass}`}
        >
          {status}
        </span>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
    </Link>
  );
}
