import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ModuleLayout } from "@/components/seller/ModuleLayout";
import { FAQ } from "@/components/seller/FAQ";
import { EditModal } from "@/components/seller/EditModal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info, CheckCircle2, Plus } from "lucide-react";

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

interface VatRow {
  country: string;
  number: string;
  status: "Verified" | "Pending" | "Invalid";
}

const INITIAL_VAT: VatRow[] = [
  { country: "Romania", number: "RO 42183901", status: "Verified" },
  { country: "Germany", number: "DE 312456789", status: "Verified" },
  { country: "France", number: "FR 76 123456789", status: "Verified" },
];

function Page() {
  const [vatRows, setVatRows] = useState<VatRow[]>(INITIAL_VAT);

  return (
    <ModuleLayout>
      <header className="mb-10">
        <h1 className="text-[2rem] text-ink">Tax & VAT</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground max-w-2xl">
          Manage your VAT information and tax status for the countries where
          your products can be sold.
        </p>
      </header>

      {/* Educational */}
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

      {/* Status */}
      <section className="border border-line bg-background p-7 mb-10">
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

      <Accordion type="multiple" defaultValue={["vat"]} className="space-y-4 mb-10">
        {/* VAT ID numbers */}
        <AccordionItem value="vat" className="border border-line bg-background">
          <AccordionTrigger className="px-6 py-5 hover:no-underline">
            <div className="flex items-center gap-3">
              <span className="text-[15px] text-ink">VAT ID number</span>
              <Badge tone="ok">Verified</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="border border-line">
              <div className="grid grid-cols-[1fr_1.4fr_140px_120px] px-5 py-3 border-b border-line text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                <div>Country</div>
                <div>VAT number</div>
                <div>Status</div>
                <div className="text-right">Action</div>
              </div>
              {vatRows.map((r, i) => (
                <div
                  key={r.country}
                  className="grid grid-cols-[1fr_1.4fr_140px_120px] px-5 py-4 border-b border-line last:border-b-0 text-sm items-center"
                >
                  <div className="text-ink">{r.country}</div>
                  <div className="text-ink">{r.number}</div>
                  <div>
                    <Badge tone={r.status === "Verified" ? "ok" : r.status === "Pending" ? "warn" : "bad"}>
                      {r.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <EditModal
                      trigger={
                        <button className="text-xs uppercase tracking-[0.16em] text-ink hover:opacity-70">
                          Edit
                        </button>
                      }
                      title={`Edit VAT number — ${r.country}`}
                      fields={[
                        { key: "country", label: "Country" },
                        { key: "number", label: "VAT number", help: "Validated against EU VIES." },
                      ]}
                      values={{ country: r.country, number: r.number }}
                      onSave={(v) => {
                        const next = [...vatRows];
                        next[i] = { ...r, country: v.country, number: v.number };
                        setVatRows(next);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <AddVatModal
              onAdd={(country, number) =>
                setVatRows([...vatRows, { country, number, status: "Pending" }])
              }
            />
          </AccordionContent>
        </AccordionItem>

        {/* OSS */}
        <AccordionItem value="oss" className="border border-line bg-background">
          <AccordionTrigger className="px-6 py-5 hover:no-underline">
            <div className="flex items-center gap-3">
              <span className="text-[15px] text-ink">OSS registration</span>
              <Badge tone="ok">Active</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 space-y-5">
            <div className="border border-line bg-cream/40 p-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                The One Stop Shop (OSS) scheme lets you declare and pay VAT
                for all EU cross-border sales in a single member state,
                instead of registering separately in each country.
              </p>
            </div>
            <SavedCard
              rows={[
                ["Member state", "Romania"],
                ["OSS scheme", "Union scheme"],
                ["Effective from", "01 Jan 2024"],
              ]}
              edit={{
                title: "Edit OSS registration",
                fields: [
                  { key: "ms", label: "Member state" },
                  {
                    key: "scheme",
                    label: "OSS scheme",
                    type: "select",
                    options: ["Union", "Non-Union", "IOSS"],
                  },
                  { key: "from", label: "Effective from" },
                ],
                values: {
                  ms: "Romania",
                  scheme: "Union",
                  from: "01 Jan 2024",
                },
              }}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Threshold declaration */}
        <AccordionItem value="threshold" className="border border-line bg-background">
          <AccordionTrigger className="px-6 py-5 hover:no-underline">
            <div className="flex items-center gap-3">
              <span className="text-[15px] text-ink">Destination threshold declaration</span>
              <Badge tone="ok">Declared</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 space-y-5">
            <div className="border border-line bg-cream/40 p-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                If your total intra-EU cross-border sales exceed €10,000 in a
                calendar year, you must charge VAT in the destination
                country. This applies across all sales channels, not just
                Camelune.
              </p>
            </div>
            <SavedCard
              rows={[
                ["EU distance-selling threshold status", "Above €10,000 — OSS declared"],
                ["Declared on", "12 Mar 2026"],
              ]}
              edit={{
                title: "Update destination threshold declaration",
                fields: [
                  {
                    key: "status",
                    label: "Threshold status",
                    type: "select",
                    options: [
                      "Below €10,000 — single member state",
                      "Above €10,000 — OSS declared",
                      "Above €10,000 — individual country VAT",
                    ],
                  },
                  { key: "date", label: "Declared on" },
                ],
                values: {
                  status: "Above €10,000 — OSS declared",
                  date: "12 Mar 2026",
                },
              }}
            />
          </AccordionContent>
        </AccordionItem>

        {/* VAT Q&A */}
        <AccordionItem value="qa" className="border border-line bg-background">
          <AccordionTrigger className="px-6 py-5 hover:no-underline">
            <div className="flex items-center gap-3">
              <span className="text-[15px] text-ink">VAT questions & answers</span>
              <Badge tone="ok">Complete</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 space-y-6">
            <QuestionCard
              question="Have you exceeded the EU turnover threshold of €10,000?"
              answer="Yes — my total cross-border sales exceed €10,000. I commit to providing valid VAT numbers for each EU country I ship to, or my OSS registration number."
              options={[
                "No — my total cross-border sales do not exceed the threshold, or I only sell goods under a margin scheme and do not ship from Germany.",
                "Yes — my total cross-border sales exceed €10,000. I commit to providing valid VAT numbers for each EU country I ship to, or my OSS registration number.",
                "No — but I ship some goods from Germany. I commit to providing a valid German VAT number.",
                "I choose to have my sales taxed in the destination country regardless of total sales, and commit to providing valid VAT numbers or OSS registration.",
              ]}
            />
            <QuestionCard
              question="Do you ship goods from a non-EU country to Germany?"
              answer='No — I do not ship goods worth over €150 "taxed and with duty paid" from a non-EU country to Germany.'
              options={[
                'No — I do not ship goods worth over €150 "taxed and with duty paid" from a non-EU country to Germany.',
                "Yes — I ship goods worth over €150 from a non-EU country to Germany and commit to providing a valid German VAT number.",
              ]}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <FAQ items={TAX_FAQ} />
    </ModuleLayout>
  );
}

/* -------------------- helpers -------------------- */

function Badge({
  tone,
  children,
}: {
  tone: "ok" | "warn" | "bad" | "neutral";
  children: React.ReactNode;
}) {
  const tc =
    tone === "ok"
      ? "bg-emerald-50/70 text-emerald-700"
      : tone === "warn"
        ? "bg-amber-50/80 text-amber-800"
        : tone === "bad"
          ? "bg-rose-50/70 text-rose-700"
          : "bg-muted text-muted-foreground";
  return (
    <span className={`inline-flex items-center px-2 py-[3px] rounded-full text-[10.5px] tracking-[0.04em] ${tc}`}>
      {children}
    </span>
  );
}

function SavedCard({
  rows,
  edit,
}: {
  rows: [string, string][];
  edit?: {
    title: string;
    fields: { key: string; label: string; type?: "text" | "select"; options?: string[] }[];
    values: Record<string, string>;
  };
}) {
  return (
    <div className="border border-line">
      <dl className="text-sm divide-y divide-line">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[260px_1fr] px-5 py-3">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      {edit && (
        <div className="border-t border-line px-5 py-3 flex justify-end">
          <EditModal
            trigger={
              <button className="text-xs uppercase tracking-[0.16em] text-ink hover:opacity-70">
                Edit
              </button>
            }
            title={edit.title}
            fields={edit.fields}
            values={edit.values}
          />
        </div>
      )}
    </div>
  );
}

function AddVatModal({ onAdd }: { onAdd: (country: string, number: string) => void }) {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("Italy");
  const [num, setNum] = useState("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink hover:opacity-70">
          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
          Add VAT number
        </button>
      </DialogTrigger>
      <DialogContent className="bg-background border border-line max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[18px] font-normal text-ink">
            Add VAT number
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-3">
          <div>
            <label className="block text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">
              Country
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full border border-line bg-background px-3 py-2.5 text-sm"
            >
              {["Italy", "Spain", "Netherlands", "Belgium", "Austria", "Poland"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">
              VAT number
            </label>
            <input
              value={num}
              onChange={(e) => setNum(e.target.value)}
              className="w-full border border-line bg-background px-3 py-2.5 text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              Format will be validated against EU VIES on save.
            </p>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <button
            onClick={() => setOpen(false)}
            className="px-5 h-10 border border-line text-xs uppercase tracking-[0.16em] text-ink hover:bg-muted/40"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (num.trim()) onAdd(country, num);
              setOpen(false);
              setNum("");
            }}
            className="px-5 h-10 bg-ink text-cream text-xs uppercase tracking-[0.16em] hover:bg-ink/90"
          >
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function QuestionCard({
  question,
  answer,
  options,
}: {
  question: string;
  answer: string;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(answer);
  const [current, setCurrent] = useState(answer);

  return (
    <div className="border border-line p-5">
      <p className="text-[15px] text-ink mb-3">{question}</p>
      <div className="border border-ink/40 bg-cream/40 p-4 mb-4">
        <p className="text-sm text-ink leading-relaxed">{current}</p>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="text-xs uppercase tracking-[0.16em] text-ink hover:opacity-70">
            Change answer
          </button>
        </DialogTrigger>
        <DialogContent className="bg-background border border-line max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-[16px] font-normal text-ink leading-relaxed">
              {question}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-3">
            {options.map((opt) => (
              <label
                key={opt}
                className="flex items-start gap-3 border border-line p-4 cursor-pointer hover:bg-muted/30"
              >
                <input
                  type="radio"
                  checked={selected === opt}
                  onChange={() => setSelected(opt)}
                  className="mt-0.5 accent-ink"
                />
                <span className="text-sm text-ink leading-relaxed">{opt}</span>
              </label>
            ))}
          </div>
          <DialogFooter className="gap-2">
            <button
              onClick={() => setOpen(false)}
              className="px-5 h-10 border border-line text-xs uppercase tracking-[0.16em] text-ink hover:bg-muted/40"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setCurrent(selected);
                setOpen(false);
              }}
              className="px-5 h-10 bg-ink text-cream text-xs uppercase tracking-[0.16em] hover:bg-ink/90"
            >
              Save answer
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const TAX_FAQ = [
  { q: "What is the EU distance-selling threshold?", a: "If your total intra-EU cross-border sales of goods exceed €10,000 in a calendar year, you must charge VAT in the destination country." },
  { q: "What is OSS and do I need it?", a: "The One Stop Shop (OSS) is an EU system that lets you declare all EU cross-border VAT in a single member state. It is optional but usually simpler than registering in each destination country." },
  { q: "Why does Camelune need my VAT number?", a: "Camelune uses your VAT information to operate your account compliantly across destination markets, including determining how invoices are issued." },
  { q: "What is the margin scheme?", a: "For second-hand goods, sellers may use a margin scheme where VAT is only applied to the difference between purchase and sale price. This is important for many Camelune sellers." },
  { q: "What happens if my VAT number is not valid?", a: "We will flag the VAT number, notify you by email and ask you to provide a correct number. Sales in that country may be paused while the issue is resolved." },
];
