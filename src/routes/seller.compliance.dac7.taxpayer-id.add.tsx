import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ModuleLayout } from "@/components/seller/ModuleLayout";
import { ArrowLeft } from "lucide-react";
import {
  DAC7_TAXPAYER_COUNTRIES,
  formatPermanentEstablishment,
  saveExtraTaxpayerId,
  taxpayerFieldLabel,
  validateTaxpayerId,
} from "@/lib/dac7-data";

export const Route = createFileRoute("/seller/compliance/dac7/taxpayer-id/add")({
  head: () => ({
    meta: [{ title: "Add taxpayer ID — DAC7 — Camelune" }],
  }),
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  const [issuingCountry, setIssuingCountry] = useState<string>(DAC7_TAXPAYER_COUNTRIES[0]);
  const [taxpayerId, setTaxpayerId] = useState("");
  const [permanentEstablishment, setPermanentEstablishment] = useState("No");
  const [error, setError] = useState<string | null>(null);

  const tinLabel = taxpayerFieldLabel(issuingCountry);
  const valid = taxpayerId.trim().length > 0 && validateTaxpayerId(issuingCountry, taxpayerId);

  function handleSave() {
    if (!valid) {
      setError(`Please enter a valid ${tinLabel}.`);
      return;
    }
    saveExtraTaxpayerId({
      issuingCountry,
      taxpayerId: taxpayerId.trim(),
      permanentEstablishment:
        permanentEstablishment === "No"
          ? "No"
          : formatPermanentEstablishment(permanentEstablishment),
    });
    navigate({ to: "/seller/compliance/dac7" });
  }

  return (
    <ModuleLayout backLabel="Back to DAC7" backTo="/seller/compliance/dac7">
      <nav className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-5">
        <Link to="/seller/compliance" className="hover:text-ink">Compliance</Link>
        <span className="mx-2">/</span>
        <Link to="/seller/compliance/dac7" className="hover:text-ink">DAC7</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">Add taxpayer ID</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-[2rem] text-ink">Add taxpayer ID</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground max-w-2xl">
          Add a tax identification number for another EU country where your company
          is registered or has a permanent establishment.
        </p>
      </header>

      <div className="border border-line bg-background p-8 max-w-2xl">
        <div className="space-y-6">
          <Field label="Issuing country">
            <select
              value={issuingCountry}
              onChange={(e) => {
                setIssuingCountry(e.target.value);
                setError(null);
              }}
              className="w-full border border-line bg-background px-4 py-3 text-sm focus:outline-none focus:border-ink"
            >
              {DAC7_TAXPAYER_COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </Field>

          <Field label={tinLabel}>
            <input
              value={taxpayerId}
              onChange={(e) => {
                setTaxpayerId(e.target.value);
                setError(null);
              }}
              className="w-full border border-line bg-background px-4 py-3 text-sm focus:outline-none focus:border-ink"
            />
          </Field>

          <Field label="Permanent establishment">
            <select
              value={permanentEstablishment}
              onChange={(e) => setPermanentEstablishment(e.target.value)}
              className="w-full border border-line bg-background px-4 py-3 text-sm focus:outline-none focus:border-ink"
            >
              <option value="No">No</option>
              {DAC7_TAXPAYER_COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  Yes — {country}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {error && <p className="mt-4 text-sm text-rose-700">{error}</p>}

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-line">
          <Link
            to="/seller/compliance/dac7"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={!valid}
            className="px-6 h-11 bg-ink text-cream text-xs uppercase tracking-[0.16em] hover:bg-ink/90 disabled:opacity-40"
          >
            Save number
          </button>
        </div>
      </div>
    </ModuleLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
