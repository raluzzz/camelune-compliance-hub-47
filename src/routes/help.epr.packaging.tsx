import { createFileRoute } from "@tanstack/react-router";
import { HelpPageLayout } from "@/components/seller/help/HelpPageLayout";
import { CountrySection, NoteBox } from "@/components/seller/help/CountrySection";
import { InfoCalloutBox } from "@/components/seller/help/InfoCalloutBox";
import { RelatedObligations } from "@/components/seller/help/RelatedObligations";
import { FAQ } from "@/components/seller/FAQ";
import { PACKAGING_COUNTRIES, PACKAGING_FAQ } from "@/lib/epr-help-data";

export const Route = createFileRoute("/help/epr/packaging")({
  component: Page,
});

function Page() {
  return (
    <HelpPageLayout
      backTo="/help/epr"
      backLabel="Back to EPR Compliance"
      breadcrumbs={[
        { label: "EPR Compliance", href: "/help/epr" },
        { label: "Packaging (PACK)" },
      ]}
    >
      <header className="mb-10">
        <h1 className="text-[2rem] text-ink leading-tight">Packaging (PACK)</h1>
      </header>

      <div className="space-y-6 text-[15px] leading-relaxed text-muted-foreground">
        <p>
          Packaging EPR requires sellers who place packaged goods on EU markets to
          register with the national packaging authority, report volumes, and contribute
          to recycling schemes. On Camelune, this obligation applies to all sellers who
          ship packaged products to EU destination countries.
        </p>
        <p>
          Registration is required in each country where you sell — a registration in
          one EU member state does not cover others. Requirements differ depending on
          whether your company is established in the destination country or selling from
          abroad.
        </p>
      </div>

      <section className="mt-14 pt-2 border-t border-line">
        <h2 className="text-lg text-ink mb-5">What types of packaging are covered</h2>
        <p className="text-[15px] leading-relaxed text-muted-foreground mb-5">
          Packaging EPR applies to all materials you use to ship, protect, or present
          products sold on Camelune. Three common categories:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground leading-relaxed">
          <li>
            <span className="text-ink">Shipping packaging</span> — boxes, mailers, padded
            envelopes, filler, and tape used to deliver orders to customers
          </li>
          <li>
            <span className="text-ink">Outer packaging and inserts</span> — presentation
            boxes, sleeves, tissue paper, and protective wrapping around the product
          </li>
          <li>
            <span className="text-ink">Product packaging</span> — blister packs, pouches,
            bottles, or any material that holds or protects the product itself until it
            reaches the end consumer
          </li>
        </ul>
        <NoteBox>
          All three categories count toward your packaging obligations in each destination
          country.
        </NoteBox>
      </section>

      {PACKAGING_COUNTRIES.map((country) => (
        <CountrySection key={country.country} data={country} />
      ))}

      <InfoCalloutBox
        title="Submit your packaging registrations"
        text="Track packaging obligations for Romania, Germany, France, Austria, and Spain and submit your EPR numbers directly in your Camelune dashboard."
        ctaLabel="Go to EPR Compliance"
        ctaHref="/seller/compliance/epr"
      />

      <FAQ items={PACKAGING_FAQ} />
      <RelatedObligations current="packaging" />
    </HelpPageLayout>
  );
}
