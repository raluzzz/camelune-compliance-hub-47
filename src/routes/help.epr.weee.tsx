import { createFileRoute } from "@tanstack/react-router";
import { HelpPageLayout } from "@/components/seller/help/HelpPageLayout";
import { CountrySection } from "@/components/seller/help/CountrySection";
import { InfoCalloutBox } from "@/components/seller/help/InfoCalloutBox";
import { RelatedObligations } from "@/components/seller/help/RelatedObligations";
import { FAQ } from "@/components/seller/FAQ";
import { WEEE_COUNTRIES, WEEE_FAQ } from "@/lib/epr-help-data";

export const Route = createFileRoute("/help/epr/weee")({
  component: Page,
});

function Page() {
  return (
    <HelpPageLayout
      backTo="/help/epr"
      backLabel="Back to EPR Compliance"
      breadcrumbs={[
        { label: "EPR Compliance", href: "/help/epr" },
        { label: "Electrical appliances (EEE)" },
      ]}
    >
      <header className="mb-10">
        <h1 className="text-[2rem] text-ink leading-tight">
          Electrical appliances (EEE)
        </h1>
      </header>

      <div className="space-y-6 text-[15px] leading-relaxed text-muted-foreground">
        <p>
          WEEE (Waste Electrical and Electronic Equipment) obligations apply to sellers
          of electrical and electronic products placed on EU markets. On Camelune, this
          includes electronic watches, smartwatches, watch winders, and related
          electronic accessories.
        </p>
        <p>
          Registration is required in each destination country where you sell electronic
          equipment. Germany and France currently have active WEEE obligations for
          relevant product categories in your catalogue.
        </p>
      </div>

      {WEEE_COUNTRIES.map((country) => (
        <CountrySection key={country.country} data={country} />
      ))}

      <InfoCalloutBox
        title="Submit your WEEE registrations"
        text="Track electrical appliance obligations and submit EPR numbers and authorized representative documents in your Camelune dashboard."
        ctaLabel="Go to EPR Compliance"
        ctaHref="/seller/compliance/epr"
      />

      <FAQ items={WEEE_FAQ} />
      <RelatedObligations current="weee" />
    </HelpPageLayout>
  );
}
