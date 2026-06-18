import { createFileRoute, Link } from "@tanstack/react-router";
import { SellerLayout } from "@/components/seller/SellerLayout";
import { StatusBadge } from "@/components/seller/StatusBadge";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/seller/compliance/epr/packaging-germany/submitted")({
  head: () => ({
    meta: [
      { title: "Submitted — under review — Camelune" },
      { name: "description", content: "Your German packaging EPR submission is under review." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SellerLayout>
      <nav className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-6">
        <Link to="/seller/compliance/epr/packaging-germany" className="hover:text-ink">
          Packaging · Germany
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">Submitted</span>
      </nav>

      <div className="border border-line p-12 text-center max-w-2xl mx-auto">
        <div className="mx-auto h-14 w-14 rounded-full border border-ink flex items-center justify-center">
          <CheckCircle2 className="h-7 w-7 text-ink" strokeWidth={1.25} />
        </div>
        <h1 className="text-2xl text-ink mt-6">Submission received</h1>
        <p className="text-sm text-muted-foreground mt-3">
          Your German packaging EPR file has been queued for review. We will
          notify you by email once the regulator confirms the record — typically
          within 5 to 7 working days.
        </p>

        <div className="mt-8 inline-flex"><StatusBadge status="under-review" /></div>

        <dl className="mt-10 border-t border-line pt-6 text-left grid grid-cols-[180px_1fr] gap-y-3 text-sm">
          <dt className="text-muted-foreground">Reference</dt>
          <dd className="text-ink">CMP-DE-PACK-2026-00417</dd>
          <dt className="text-muted-foreground">Submitted</dt>
          <dd className="text-ink">18 June 2026 · 10:42 CET</dd>
          <dt className="text-muted-foreground">Authority</dt>
          <dd className="text-ink">ZSVR / LUCID</dd>
          <dt className="text-muted-foreground">Provisional clearance</dt>
          <dd className="text-ink">Germany shipping unblocked until 02 July 2026</dd>
        </dl>
      </div>

      <div className="mt-10 flex justify-center gap-4">
        <Link
          to="/seller/compliance/epr"
          className="px-6 py-3 border border-ink text-ink text-xs uppercase tracking-[0.14em] hover:bg-ink hover:text-primary-foreground"
        >
          Back to EPR overview
        </Link>
        <Link
          to="/seller/compliance"
          className="px-6 py-3 bg-ink text-primary-foreground text-xs uppercase tracking-[0.14em] hover:bg-ink/90"
        >
          Compliance center
        </Link>
      </div>
    </SellerLayout>
  );
}
