import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ModuleLayout } from "@/components/seller/ModuleLayout";
import { Stepper } from "@/components/seller/Stepper";
import { Upload, FileCheck2 } from "lucide-react";

export const Route = createFileRoute("/seller/compliance/epr/packaging-germany/submit")({
  head: () => ({
    meta: [
      { title: "Submit German packaging EPR — Camelune" },
      { name: "description", content: "Step form to submit your German packaging compliance evidence." },
    ],
  }),
  component: Page,
});

const STEPS = [
  { label: "EPR number & document" },
  { label: "Authorized representative (Optional)" },
  { label: "Confirmation" },
];


function Page() {
  const [step, setStep] = useState(0);
  const [eprNumber, setEpr] = useState("DE 234 567 891 23");
  const [doc, setDoc] = useState<string | null>("der-gruene-punkt-2026.pdf");
  const [rep, setRep] = useState({
    name: "Markus Hoffmann",
    company: "Hoffmann EPR Services GmbH",
    email: "m.hoffmann@hoffmann-epr.de",
    address: "Königsallee 21, 40212 Düsseldorf",
  });
  const [confirmed, setConfirmed] = useState(false);
  const navigate = useNavigate();

  return (
    <ModuleLayout>
      <nav className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-6">
        <Link to="/seller/compliance/epr/packaging-germany" className="hover:text-ink">
          Packaging · Germany
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">Submit</span>
      </nav>

      <h1 className="text-3xl text-ink mb-3">Submit packaging compliance — Germany</h1>
      <p className="text-sm text-muted-foreground max-w-2xl mb-10">
        A few short steps. You can save your progress at any moment and return
        later — your draft will be marked as such in the compliance center.
      </p>

      <Stepper steps={STEPS} current={step} />

      <div className="border border-line p-10 bg-background">
        {step === 0 && (
          <>
            <FormRow
              label="LUCID registration number"
              help="Issued by ZSVR. Format: DE + 11 digits."
            >
              <input
                value={eprNumber}
                onChange={(e) => setEpr(e.target.value)}
                className="w-full border border-line bg-background px-4 py-3 text-sm focus:outline-none focus:border-ink"
              />
            </FormRow>
            <FormRow
              label="Dual-system contract"
              help="PDF, max 10MB. Must cover the 2026 reporting year."
            >
              <label className="block border border-dashed border-line p-8 text-center cursor-pointer hover:border-ink/40">
                {doc ? (
                  <div className="flex items-center justify-center gap-3 text-sm text-ink">
                    <FileCheck2 className="h-5 w-5" strokeWidth={1.5} />
                    {doc}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setDoc(null);
                      }}
                      className="text-xs text-muted-foreground underline ml-3"
                    >
                      Replace
                    </button>
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    <Upload className="h-5 w-5 mx-auto mb-2" strokeWidth={1.5} />
                    <p className="text-sm">Drop your contract here, or click to browse</p>
                  </div>
                )}
                <input
                  type="file"
                  hidden
                  onChange={(e) =>
                    setDoc(e.target.files?.[0]?.name ?? "der-gruene-punkt-2026.pdf")
                  }
                />
              </label>
            </FormRow>
          </>
        )}

        {step === 1 && (
          <>
            <div className="pb-5 mb-2 border-b border-line">
              <p className="text-[15px] text-ink">Authorized representative <span className="text-muted-foreground text-sm">(Optional)</span></p>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Only required if your seller account is not established in Germany. You can skip this step and add it later.
              </p>
            </div>
            <FormRow label="Representative full name">
              <Input value={rep.name} onChange={(v) => setRep({ ...rep, name: v })} />
            </FormRow>
            <FormRow label="Company">
              <Input value={rep.company} onChange={(v) => setRep({ ...rep, company: v })} />
            </FormRow>
            <FormRow label="Email">
              <Input value={rep.email} onChange={(v) => setRep({ ...rep, email: v })} />
            </FormRow>
            <FormRow label="Registered address">
              <Input value={rep.address} onChange={(v) => setRep({ ...rep, address: v })} />
            </FormRow>
          </>
        )}

        {step === 2 && (
          <FormRow label="Confirmation">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-1 accent-ink"
              />
              <span className="text-sm text-ink">
                I confirm that the information provided is accurate and that I
                hold the original documents on file. I understand Camelune will
                rely on this declaration to lift the Germany shipping block on
                my affected listings.
              </span>
            </label>
          </FormRow>
        )}
      </div>

      {/* Footer nav */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => (step === 0 ? navigate({ to: "/seller/compliance/epr/packaging-germany" }) : setStep(step - 1))}
          className="text-sm text-muted-foreground hover:text-ink"
        >
          ← {step === 0 ? "Cancel" : "Previous"}
        </button>

        <div className="flex items-center gap-4">
          {step === 1 && (
            <button
              onClick={() => setStep(step + 1)}
              className="text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-ink"
            >
              Skip this step
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-3 bg-ink text-primary-foreground text-xs uppercase tracking-[0.14em] hover:bg-ink/90"
            >
              Next step — {STEPS[step + 1].label}
            </button>
          ) : (
            <button
              disabled={!confirmed}
              onClick={() => navigate({ to: "/seller/compliance/epr/packaging-germany/review" })}
              className="px-6 py-3 bg-ink text-primary-foreground text-xs uppercase tracking-[0.14em] disabled:opacity-40 hover:bg-ink/90"
            >
              Continue to review
            </button>
          )}
        </div>
      </div>

    </ModuleLayout>
  );
}

function FormRow({
  label,
  help,
  children,
}: {
  label: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[220px_1fr] gap-10 py-5 border-b border-line last:border-b-0">
      <div>
        <p className="text-sm text-ink">{label}</p>
        {help && <p className="text-xs text-muted-foreground mt-1">{help}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Input({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-line bg-background px-4 py-3 text-sm focus:outline-none focus:border-ink"
    />
  );
}
