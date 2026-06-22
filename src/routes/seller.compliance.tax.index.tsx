import { createFileRoute } from "@tanstack/react-router";
import { ModuleLayout } from "@/components/seller/ModuleLayout";
import { FAQ } from "@/components/seller/FAQ";
import { Info, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/seller/compliance/tax/")({
  head: () => ({
    meta: [
      { title: "Tax & VAT — Camelune" },
      {
        name: "description",
        content:
          "Manage your VAT information and tax status for the countries where your products can be sold.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <ModuleLayout>
      <header className="mb-10">
        <h1 className="text-[2rem] text-ink">Tax & VAT</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground max-w-2xl">
          Manage your VAT information and tax status for the countries where
          your products can be sold.
        </p>
      </header>

      {/* Educational card */}
      <section className="border border-line bg-cream/40 p-7 mb-8">
        <div className="flex items-start gap-4">
          <Info className="h-5 w-5 text-ink-soft mt-0.5 shrink-0" strokeWidth={1.5} />
          <div className="flex-1">
            <p className="text-[15px] text-ink">Why we ask for Tax & VAT information</p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Camelune uses your tax and VAT information to understand how
              your seller account can operate across destination countries
              and whether additional VAT details are required.
            </p>
          </div>
        </div>
      </section>

      {/* Status card */}
      <section className="border border-line bg-background p-7 mb-12">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Your Tax & VAT status
        </p>
        <div className="mt-4 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-700" strokeWidth={1.5} />
          <p className="text-[17px] text-ink">All clear</p>
        </div>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          Your VAT registrations are active and we have no outstanding
          requests for your account.
        </p>
      </section>


      {/* Saved information */}
      <section className="mb-14 space-y-5">
        <h2 className="text-base text-ink">Saved information</h2>

        <SavedCard
          title="VAT ID number"
          rows={[
            ["Country", "Romania"],
            ["VAT number", "RO 42183901"],
            ["Status", "Verified"],
          ]}
        />
        <SavedCard
          title="OSS registration"
          rows={[
            ["Member state", "Romania"],
            ["OSS scheme", "Union scheme"],
            ["Effective from", "01 Jan 2024"],
          ]}
        />
        <SavedCard
          title="Destination threshold declaration"
          rows={[
            ["EU distance-selling threshold", "Below €10,000 — single member state"],
            ["Declared on", "12 Mar 2026"],
          ]}
        />
        <SavedCard
          title="Submitted VAT numbers"
          rows={[
            ["Romania — RO 42183901", "Verified"],
            ["Germany — DE 312456789", "Verified"],
            ["France — FR 76 123456789", "Verified"],
          ]}
        />
      </section>

      <FAQ items={TAX_FAQ} />
    </ModuleLayout>
  );
}

function SavedCard({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="border border-line bg-background p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[15px] text-ink">{title}</p>
        <button className="text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-ink">
          Edit
        </button>
      </div>
      <dl className="text-sm divide-y divide-line">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[220px_1fr] py-3">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

const TAX_FAQ = [
  {
    q: "Why does Camelune ask for VAT information?",
    a: "Camelune may need VAT information to support correct seller setup, destination-country rules and marketplace compliance.",
  },
  {
    q: "What is a VAT ID?",
    a: "A VAT ID is a tax identification number used by businesses registered for value-added tax.",
  },
  {
    q: "What is OSS?",
    a: "OSS, or One Stop Shop, is an EU system that can allow sellers to report certain cross-border VAT obligations through one member state.",
  },
  {
    q: "What is the EU destination threshold?",
    a: "Some sellers may need to consider EU distance-selling thresholds when selling goods cross-border in the EU.",
  },
  {
    q: "How is VAT different from DAC7?",
    a: "VAT relates to tax treatment and tax registration. DAC7 is a platform reporting obligation about seller information and income.",
  },
  {
    q: "Can I update my VAT information later?",
    a: "Yes. Sellers should keep VAT information up to date when their tax situation changes.",
  },
];
