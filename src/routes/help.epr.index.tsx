import { createFileRoute } from "@tanstack/react-router";
import { HelpPageLayout } from "@/components/seller/help/HelpPageLayout";
import { InfoCalloutBox } from "@/components/seller/help/InfoCalloutBox";
import { NoteBox } from "@/components/seller/help/CountrySection";
import { ObligationCard } from "@/components/seller/help/ObligationCard";
import { FAQ } from "@/components/seller/FAQ";
import { EPR_FAQ } from "@/lib/epr-help-data";

export const Route = createFileRoute("/help/epr/")({
  component: Page,
});

function Page() {
  return (
    <HelpPageLayout
      backTo="/seller/compliance/epr"
      backLabel="Back to EPR Compliance"
      breadcrumbs={[{ label: "EPR Compliance" }]}
    >
      <header className="mb-12">
        <h1 className="text-[2rem] text-ink leading-tight">
          Extended Producer Responsibility (EPR)
        </h1>
      </header>

      <div className="space-y-6 text-[15px] leading-relaxed text-muted-foreground">
        <p>
          Extended Producer Responsibility (EPR) is an EU regulatory framework that
          requires sellers to take responsibility for the environmental impact of the
          products and packaging they place on the market — across their entire
          lifecycle, from production through to disposal and recycling.
        </p>
        <p>
          On Camelune, sellers who ship products to EU countries may be subject to EPR
          obligations in each destination market, regardless of where their business is
          established. Three categories of obligations may apply depending on what you
          sell and where you ship.
        </p>
      </div>

      <section className="mt-16">
        <h2 className="text-lg text-ink mb-6">Which obligations may apply to you?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ObligationCard
            title="Packaging (PACK)"
            description="Applies to all sellers who ship packaged goods to EU countries."
            href="/help/epr/packaging"
          />
          <ObligationCard
            title="Batteries (BATT)"
            description="Applies to sellers of quartz watches, smartwatches, and any product containing a battery."
            href="/help/epr/batteries"
          />
          <ObligationCard
            title="Electrical appliances (EEE)"
            description="Applies to sellers of electronic watches, watch winders, and related electronic accessories."
            href="/help/epr/weee"
          />
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-lg text-ink mb-5">Am I affected?</h2>
        <p className="text-[15px] text-muted-foreground leading-relaxed">
          You are considered a producer under EPR legislation if any of the following
          applies:
        </p>
        <ul className="list-disc pl-5 mt-5 space-y-2 text-sm text-muted-foreground leading-relaxed">
          <li>You ship packaged goods to end consumers in an EU country</li>
          <li>
            You sell battery-powered products (quartz watches, smartwatches, winders)
            into an EU market
          </li>
          <li>You sell electrical or electronic equipment into an EU market</li>
          <li>
            You are not established in the destination EU country but sell there
            (distance seller)
          </li>
        </ul>
        <NoteBox>
          EPR obligations are assessed per destination country. Selling into Germany,
          France, and Romania simultaneously means you may have separate registration
          obligations in each of those markets.
        </NoteBox>
      </section>

      <InfoCalloutBox
        title="Manage all your EPR obligations in one place"
        text="Track your compliance status, submit EPR numbers, and manage your obligations for each market directly in your Camelune dashboard."
        ctaLabel="Go to EPR Compliance"
        ctaHref="/seller/compliance/epr"
      />

      <FAQ items={EPR_FAQ} />
    </HelpPageLayout>
  );
}
