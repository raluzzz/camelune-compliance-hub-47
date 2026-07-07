import { createFileRoute } from "@tanstack/react-router";
import { HelpPageLayout } from "@/components/seller/help/HelpPageLayout";
import { CountrySection } from "@/components/seller/help/CountrySection";
import { InfoCalloutBox } from "@/components/seller/help/InfoCalloutBox";
import { RelatedObligations } from "@/components/seller/help/RelatedObligations";
import { FAQ } from "@/components/seller/FAQ";
import { BATTERIES_COUNTRIES, BATTERIES_FAQ } from "@/lib/epr-help-data";

export const Route = createFileRoute("/help/epr/batteries")({
  component: Page,
});

function Page() {
  return (
    <HelpPageLayout
      backTo="/help/epr"
      backLabel="Back to EPR Compliance"
      breadcrumbs={[
        { label: "EPR Compliance", href: "/help/epr" },
        { label: "Batteries (BATT)" },
      ]}
    >
      <header className="mb-10">
        <h1 className="text-[2rem] text-ink leading-tight">Batteries (BATT)</h1>
      </header>

      <div className="space-y-6 text-[15px] leading-relaxed text-muted-foreground">
        <p>
          Battery EPR covers products that contain batteries — including batteries
          installed in devices such as quartz watches, smartwatches, and accessories
          with integrated cells. Sellers must register with the relevant battery
          authority in each EU country where these products are sold.
        </p>
        <p>
          Battery obligations are separate from packaging and WEEE registrations.
          Each destination country has its own registration process, and sellers not
          established in Germany or France must typically appoint an authorized
          representative.
        </p>
      </div>

      {BATTERIES_COUNTRIES.map((country) => (
        <CountrySection key={country.country} data={country} />
      ))}

      <InfoCalloutBox
        title="Submit your battery registrations"
        text="Track battery obligations for your active listings and submit EPR numbers, authorized representative details, and self-certifications in your Camelune dashboard."
        ctaLabel="Go to EPR Compliance"
        ctaHref="/seller/compliance/epr"
      />

      <FAQ items={BATTERIES_FAQ} />
      <RelatedObligations current="batteries" />
    </HelpPageLayout>
  );
}
