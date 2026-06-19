import { createFileRoute } from "@tanstack/react-router";
import { ModuleLayout } from "@/components/seller/ModuleLayout";
import { FAQ } from "@/components/seller/FAQ";
import { Info, Clock } from "lucide-react";

export const Route = createFileRoute("/seller/compliance/dac7/")({
  head: () => ({
    meta: [
      { title: "DAC7 Reporting — Camelune" },
      {
        name: "description",
        content:
          "DAC7 is an EU platform reporting rule. Provide seller information when reporting conditions are met.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <ModuleLayout>
      <header className="mb-10">
        <h1 className="text-[2rem] text-ink">DAC7 Reporting</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground max-w-2xl">
          DAC7 is an EU platform reporting rule. Camelune may need to collect
          and report certain seller information to tax authorities when
          reporting conditions are met.
        </p>
      </header>

      {/* Educational card */}
      <section className="border border-line bg-cream/40 p-7 mb-6">
        <div className="flex items-start gap-4">
          <Info className="h-5 w-5 text-ink-soft mt-0.5 shrink-0" strokeWidth={1.5} />
          <div className="flex-1">
            <p className="text-[15px] text-ink">What is DAC7?</p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              DAC7 may require digital platforms to collect, verify and
              report information about sellers and the income they earn
              through the platform.
            </p>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              DAC7 is not a new tax. It is a reporting obligation for
              digital platforms.
            </p>
          </div>
        </div>
      </section>

      {/* Why we ask */}
      <section className="border border-line bg-background p-7 mb-8">
        <p className="text-[15px] text-ink">Why we ask for this information</p>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          Camelune may need company details, taxpayer identification
          numbers, VAT numbers, commercial registration numbers, payout
          account details and transaction information to comply with EU
          platform reporting rules.
        </p>
      </section>

      {/* Status card */}
      <section className="border border-line bg-background p-7 mb-8">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Your DAC7 status
        </p>
        <div className="mt-4 flex items-center gap-3">
          <Clock className="h-5 w-5 text-slate-600" strokeWidth={1.5} />
          <p className="text-[17px] text-ink">Not required yet</p>
        </div>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          No reporting obligation has been triggered for your account in
          the current reporting period.
        </p>
      </section>

      {/* Threshold explanation */}
      <section className="mb-14">
        <h2 className="text-base text-ink mb-3">When DAC7 reporting may apply</h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          Camelune may need to report seller information when a seller
          meets the applicable reporting conditions during a reporting
          period, such as reaching a relevant number of sales or total
          transaction value threshold.
        </p>
      </section>

      {/* Sections */}
      <section className="mb-14 space-y-5">
        <SavedCard
          title="A. Company information"
          rows={[
            ["Company legal name", "Atelier Lune SRL"],
            ["Registered address", "Str. Stelelor 12, Bucharest"],
            ["Country", "Romania"],
            ["Legal representative", "Veronica Fox"],
          ]}
          status="Saved"
        />
        <SavedCard
          title="B. Commercial registration number"
          rows={[
            ["Country", "Romania"],
            ["Commercial registration number", "J40/2185/2022"],
            ["Status", "Saved"],
          ]}
          status="Saved"
        />
        <SavedCard
          title="C. Taxpayer ID number"
          rows={[
            ["Issuing country", "Romania"],
            ["Taxpayer ID number", "42183901"],
            ["Permanent establishment", "Romania"],
            ["Status", "Saved"],
          ]}
          status="Saved"
        />
        <SavedCard
          title="D. VAT ID number"
          rows={[
            ["Country", "Romania"],
            ["VAT number", "RO 42183901"],
            ["Status", "Verified"],
          ]}
          status="Verified"
        />
        <SavedCard
          title="E. Bank account for payouts"
          rows={[
            ["Account holder", "Atelier Lune SRL"],
            ["IBAN", "RO •••• •••• •••• 4421"],
            ["Currency", "EUR"],
            ["Status", "Verified"],
          ]}
          status="Verified"
        />
        <SavedCard
          title="F. Report history"
          rows={[
            ["2025 reporting period", "Not required"],
            ["2024 reporting period", "Not required"],
          ]}
          status="No reports"
        />
      </section>

      <FAQ items={DAC7_FAQ} />
    </ModuleLayout>
  );
}

function SavedCard({
  title,
  rows,
  status,
}: {
  title: string;
  rows: [string, string][];
  status: string;
}) {
  return (
    <div className="border border-line bg-background p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[15px] text-ink">{title}</p>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground">{status}</span>
          <button className="text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-ink">
            Edit
          </button>
        </div>
      </div>
      <dl className="text-sm divide-y divide-line">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[260px_1fr] py-3">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

const DAC7_FAQ = [
  {
    q: "What is DAC7?",
    a: "DAC7 is an EU platform reporting rule that may require digital platforms to report seller identification and income information to tax authorities.",
  },
  {
    q: "Is DAC7 a new tax?",
    a: "No. DAC7 is not a new tax. It is a reporting obligation for platforms.",
  },
  {
    q: "Why does Camelune need this information?",
    a: "Camelune may need this information to determine whether reporting is required and to file accurate reports if applicable.",
  },
  {
    q: "What information can be reported?",
    a: "Depending on the seller and reporting rules, information may include company details, taxpayer IDs, VAT numbers, payout account details and transaction totals.",
  },
  {
    q: "When does Camelune report my information?",
    a: "Reporting may apply after the end of a reporting period if the seller meets the applicable reporting conditions.",
  },
  {
    q: "What happens if information is missing?",
    a: "Camelune may ask the seller to complete or correct missing information. In some cases, account or payout restrictions may apply until required information is provided.",
  },
  {
    q: "Can I correct or update my information?",
    a: "Yes. Sellers should be able to update or correct information before submission or when Camelune requests corrections.",
  },
  {
    q: "Where can I view submitted reports?",
    a: "If a report is submitted, Camelune will show it in the DAC7 Reporting module under Report history.",
  },
  {
    q: "How is this different from VAT?",
    a: "VAT relates to tax registration and treatment of sales. DAC7 relates to platform reporting of seller information and income.",
  },
];
