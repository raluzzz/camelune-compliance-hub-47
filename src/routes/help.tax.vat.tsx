import { createFileRoute, Link } from "@tanstack/react-router";
import { HelpPageLayout } from "@/components/seller/help/HelpPageLayout";
import { NoteBox } from "@/components/seller/help/CountrySection";
import { InfoCalloutBox } from "@/components/seller/help/InfoCalloutBox";
import { FAQ } from "@/components/seller/FAQ";
import { TAX_FAQ } from "@/lib/tax-help-data";

export const Route = createFileRoute("/help/tax/vat")({
  head: () => ({
    meta: [
      { title: "What you need to know about VAT — Camelune" },
      {
        name: "description",
        content:
          "How EU and non-EU VAT rules apply when you sell on Camelune, including distance-selling thresholds, OSS, and IOSS.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <HelpPageLayout
      backTo="/seller/compliance/tax"
      backLabel="Back to Tax & VAT"
      breadcrumbs={[
        { label: "Tax & VAT", href: "/seller/compliance/tax" },
        { label: "VAT on Camelune" },
      ]}
    >
      <header className="mb-10">
        <h1 className="text-[2rem] text-ink leading-tight">
          What you need to know about VAT on Camelune
        </h1>
      </header>

      <NoteBox>
        This page provides general information about VAT obligations when selling on
        Camelune. It does not constitute tax or legal advice. Rules depend on your
        business structure, product type, and destination countries — please consult a
        qualified tax advisor for your specific situation.
      </NoteBox>

      <section className="mt-14 pt-2 border-t border-line">
        <h2 className="text-lg text-ink mb-5">Why this matters for you</h2>
        <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
          <p>
            Camelune is established in Romania, an EU member state. Under EU VAT rules,
            we must collect accurate tax information from dealers — both within and
            outside the EU — so that cross-border sales through the platform can be
            handled correctly.
          </p>
          <p>
            The details you provide on your{" "}
            <Link
              to="/seller/compliance/tax"
              className="text-ink underline underline-offset-2 hover:opacity-80"
            >
              Tax & VAT
            </Link>{" "}
            page determine how VAT is applied to your sales, which VAT numbers we
            display on invoices, and whether your account remains eligible to sell in
            each destination market.
          </p>
          <p>
            Please keep this information up to date. We review it regularly and may ask
            you to confirm your answers if your tax situation changes.
          </p>
        </div>
      </section>

      <section className="mt-14 pt-2 border-t border-line">
        <h2 className="text-lg text-ink mb-5">If your business is in the EU</h2>
        <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
          <p>
            If your company is established in an EU member state, the key threshold
            for cross-border B2C sales of goods is{" "}
            <strong className="font-medium text-ink">€10,000</strong> per calendar year
            (previous or current). This covers your total intra-EU distance sales across{" "}
            <strong className="font-medium text-ink">all sales channels</strong>, not
            only Camelune.
          </p>
        </div>
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mt-6 mb-3">
          Below the €10,000 threshold
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground leading-relaxed">
          <li>
            You generally charge VAT in your country of establishment and provide your
            home-country VAT number to Camelune.
          </li>
          <li>
            If you only sell goods under a margin scheme and do not ship from your
            country of establishment, different rules may apply — declare this
            accurately in your tax situation answers.
          </li>
        </ul>
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mt-6 mb-3">
          Above the €10,000 threshold
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground leading-relaxed">
          <li>
            You must charge VAT in each EU destination country where your buyers are
            located, unless you use an approved simplification.
          </li>
          <li>
            <span className="text-ink">Option A — VAT registration per country:</span>{" "}
            Register for VAT in each member state you ship to and provide each valid
            VAT number on Camelune.
          </li>
          <li>
            <span className="text-ink">Option B — One Stop Shop (OSS):</span> Register
            for the Union OSS scheme in one member state and declare all EU
            cross-border B2C VAT in a single quarterly return. Provide your OSS
            registration details on Camelune.
          </li>
          <li>
            You may also opt in to destination-country taxation regardless of your
            total sales — useful if you expect to exceed the threshold soon.
          </li>
        </ul>
      </section>

      <section className="mt-14 pt-2 border-t border-line">
        <h2 className="text-lg text-ink mb-5">If your business is outside the EU</h2>
        <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
          <p>
            If your company is established outside the European Union and you ship
            goods to EU buyers, additional rules apply. For consignments valued at
            more than{" "}
            <strong className="font-medium text-ink">€150</strong> per shipment where
            goods are taxed and duty-paid at import, you must have valid VAT
            arrangements for each applicable destination country.
          </p>
          <p>
            For lower-value consignments, the{" "}
            <strong className="font-medium text-ink">
              Import One Stop Shop (IOSS)
            </strong>{" "}
            allows you to charge VAT at the point of sale and declare it through a
            single EU registration, simplifying customs clearance for shipments up to
            €150. If you use IOSS, provide your IOSS registration details on Camelune.
          </p>
        </div>
        <ul className="list-disc pl-5 mt-5 space-y-2 text-sm text-muted-foreground leading-relaxed">
          <li>
            Declare honestly whether you ship goods worth over €150 from a non-EU
            country to EU buyers.
          </li>
          <li>
            Provide valid VAT numbers for each EU destination country where you are
            required to register.
          </li>
          <li>
            If you ship from within the EU (for example, from a fulfilment warehouse),
            EU-established seller rules apply instead.
          </li>
        </ul>
      </section>

      <section className="mt-14 pt-2 border-t border-line">
        <h2 className="text-lg text-ink mb-5">Important</h2>
        <div className="border border-amber-200/80 bg-amber-50/40 p-6">
          <p className="text-sm text-ink leading-relaxed">
            Providing incorrect or incomplete tax information can have direct
            consequences for your Camelune account:
          </p>
          <ul className="list-disc pl-5 mt-4 space-y-2 text-sm text-muted-foreground leading-relaxed">
            <li>
              Sales in affected destination countries may be paused until your VAT
              numbers are verified or your declarations are corrected.
            </li>
            <li>
              Invalid VAT numbers are flagged through the EU VIES validation system —
              you will be asked to provide a correct number.
            </li>
            <li>
              Tax authorities in your country or your buyers&apos; countries may
              assess penalties independently if your returns do not match platform
              data.
            </li>
            <li>
              Camelune may restrict your account if you do not respond to requests to
              update your tax situation.
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-14 pt-2 border-t border-line">
        <h2 className="text-lg text-ink mb-5">What you need to complete</h2>
        <p className="text-[15px] leading-relaxed text-muted-foreground mb-5">
          On your Tax & VAT page, make sure the following is accurate and up to date:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground leading-relaxed">
          <li>
            <span className="text-ink">EU turnover threshold declaration</span> —
            whether your cross-border sales exceed €10,000 in the previous or current
            calendar year.
          </li>
          <li>
            <span className="text-ink">Non-EU shipping declaration</span> — whether you
            ship goods worth over €150 from outside the EU to EU buyers.
          </li>
          <li>
            <span className="text-ink">OSS / IOSS registration</span> — your scheme
            type, member state, and effective date if you are registered.
          </li>
          <li>
            <span className="text-ink">VAT numbers</span> — a valid, VIES-verified VAT
            number for each country where you are registered, including your home
            country and any destination countries.
          </li>
        </ul>
      </section>

      <InfoCalloutBox
        title="Update your tax information"
        text="Review your VAT numbers, OSS registration, and tax declarations directly in your Camelune dashboard."
        ctaLabel="Go to Tax & VAT"
        ctaHref="/seller/compliance/tax"
      />

      <FAQ items={TAX_FAQ} />
    </HelpPageLayout>
  );
}
