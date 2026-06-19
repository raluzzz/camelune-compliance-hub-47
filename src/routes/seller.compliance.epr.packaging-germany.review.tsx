import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ModuleLayout } from "@/components/seller/ModuleLayout";
import { Edit2 } from "lucide-react";

export const Route = createFileRoute("/seller/compliance/epr/packaging-germany/review")({
  head: () => ({
    meta: [
      { title: "Review & submit — Camelune" },
      { name: "description", content: "Review your German packaging EPR submission before sending." },
    ],
  }),
  component: Page,
});

function Page() {
  const navigate = useNavigate();

  return (
    <ModuleLayout>
      <nav className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-6">
        <Link to="/seller/compliance/epr/packaging-germany" className="hover:text-ink">
          Packaging · Germany
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">Review & submit</span>
      </nav>

      <h1 className="text-3xl text-ink mb-3">Review your submission</h1>
      <p className="text-sm text-muted-foreground max-w-2xl mb-10">
        Please verify each section. Once submitted, your packaging EPR file
        moves to under-review and your Germany shipping block is provisionally
        lifted for 14 days while the authorities confirm the record.
      </p>

      <div className="border border-line divide-y divide-line">
        <Block
          title="EPR registration"
          onEdit={() => navigate({ to: "/seller/compliance/epr/packaging-germany/submit" })}
          rows={[
            ["Authority", "ZSVR — Stiftung Zentrale Stelle Verpackungsregister"],
            ["LUCID number", "DE 234 567 891 23"],
            ["Scheme", "Verpackungsgesetz (VerpackG)"],
            ["Reporting year", "2026"],
          ]}
        />
        <Block
          title="Document"
          onEdit={() => navigate({ to: "/seller/compliance/epr/packaging-germany/submit" })}
          rows={[
            ["Dual-system contract", "der-gruene-punkt-2026.pdf · 1.4 MB"],
            ["Uploaded", "18 June 2026"],
          ]}
        />
        <Block
          title="Authorized representative"
          onEdit={() => navigate({ to: "/seller/compliance/epr/packaging-germany/submit" })}
          rows={[
            ["Name", "Markus Hoffmann"],
            ["Company", "Hoffmann EPR Services GmbH"],
            ["Email", "m.hoffmann@hoffmann-epr.de"],
            ["Address", "Königsallee 21, 40212 Düsseldorf, Germany"],
          ]}
        />
        <Block
          title="Affected scope"
          rows={[
            ["Country", "Germany"],
            ["Listings affected", "31"],
            ["Catalogue value", "€1,284,560"],
            ["Shipping model", "Mixed — direct & Camelune-authenticated"],
          ]}
        />
      </div>

      <div className="mt-8 border border-line p-6 bg-cream/50">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" defaultChecked className="mt-1 accent-ink" />
          <span className="text-sm text-ink">
            I declare under my own responsibility that the information and
            documents submitted are true, complete, and currently valid.
          </span>
        </label>
      </div>

      <div className="flex justify-between mt-10">
        <Link
          to="/seller/compliance/epr/packaging-germany/submit"
          className="text-sm text-muted-foreground hover:text-ink"
        >
          ← Back to form
        </Link>
        <Link
          to="/seller/compliance/epr/packaging-germany/submitted"
          className="px-8 py-3 bg-ink text-primary-foreground text-xs uppercase tracking-[0.14em] hover:bg-ink/90"
        >
          Submit for review
        </Link>
      </div>
    </ModuleLayout>
  );
}

function Block({
  title,
  rows,
  onEdit,
}: {
  title: string;
  rows: [string, string][];
  onEdit?: () => void;
}) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm text-ink">{title}</h3>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-ink inline-flex items-center gap-1.5"
          >
            <Edit2 className="h-3 w-3" strokeWidth={1.5} />
            Edit
          </button>
        )}
      </div>
      <dl className="grid grid-cols-[220px_1fr] gap-y-2 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
