import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { sellerStatusLabel, thresholdExplain } from "@/lib/dac7-state";
import { dac7Store, useDac7Store, type Dac7Case } from "@/lib/dac7-store";

export const Route = createFileRoute("/admin/finance/dac7/")({
  head: () => ({
    meta: [{ title: "DAC7 Finance — Camelune Admin" }],
  }),
  component: Page,
});

function Page() {
  const { cases } = useDac7Store();
  const year = 2026;
  const reportable = cases.filter((c) =>
    ["REPORTABLE", "READY_FOR_F7000", "REPORTED", "CORRECTION_REQUIRED"].includes(c.status),
  );
  const excluded = cases.filter((c) => c.status === "EXCLUDED");
  const blockers = cases.filter((c) =>
    ["SUBMITTED", "UNDER_REVIEW", "NEEDS_CORRECTION", "IN_PROGRESS", "PAYMENT_RESTRICTED"].includes(
      c.status,
    ),
  );

  function exportCsv() {
    const rows = [
      ["seller_id", "seller_name", "year", "status", "sales", "revenue_eur", "f7000_ref"],
      ...cases.map((c) => [
        c.sellerId,
        c.sellerName,
        String(c.reportingYear),
        c.status,
        String(c.salesCount),
        String(c.revenueEur),
        c.f7000Reference ?? "",
      ]),
    ];
    const csv = rows.map((r) => r.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dac7-finance-${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AdminLayout
      title="DAC7 Finance"
      subtitle="Close the year, export seller data, and simulate F7000 submission + receipt."
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Stat label="Reportable" value={String(reportable.length)} />
        <Stat label="Excluded" value={String(excluded.length)} />
        <Stat label="Blocking close" value={String(blockers.length)} />
        <Stat label="Year" value={String(year)} />
      </div>

      <div className="flex flex-wrap gap-3 mb-10">
        <button
          type="button"
          onClick={exportCsv}
          className="px-5 h-10 border border-line text-xs uppercase tracking-[0.16em] text-ink hover:bg-muted/40"
        >
          Export CSV
        </button>
      </div>

      {blockers.length > 0 && (
        <section className="border border-amber-200/80 bg-amber-50/40 px-5 py-4 mb-10">
          <p className="text-sm text-ink font-medium">Cannot close cleanly yet</p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {blockers.map((c) => (
              <li key={c.id}>
                {c.sellerName} — {sellerStatusLabel(c.status)}{" "}
                <Link
                  to="/admin/dac7/$sellerId"
                  params={{ sellerId: c.sellerId }}
                  className="underline hover:text-ink"
                >
                  open case
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mb-12">
        <h2 className="text-[15px] text-ink mb-4">Reportable / filing pipeline</h2>
        <div className="border border-line">
          {reportable.length === 0 ? (
            <p className="px-5 py-6 text-sm text-muted-foreground">
              No reportable sellers yet. Approve cases that crossed the threshold first.
            </p>
          ) : (
            reportable.map((c) => <FinanceRow key={c.id} c={c} />)
          )}
        </div>
      </section>

      <section>
        <h2 className="text-[15px] text-ink mb-4">Excluded this year</h2>
        <div className="border border-line">
          {excluded.length === 0 ? (
            <p className="px-5 py-6 text-sm text-muted-foreground">None yet.</p>
          ) : (
            excluded.map((c) => (
              <div key={c.id} className="px-5 py-4 border-b border-line last:border-b-0 text-sm">
                <p className="text-ink">{c.sellerName}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {thresholdExplain(c.salesCount, c.revenueEur)}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </AdminLayout>
  );
}

function FinanceRow({ c }: { c: Dac7Case }) {
  return (
    <div className="px-5 py-5 border-b border-line last:border-b-0">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-ink">{c.sellerName}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {sellerStatusLabel(c.status)} · {thresholdExplain(c.salesCount, c.revenueEur)}
          </p>
          {c.f7000Reference && (
            <p className="text-xs text-muted-foreground mt-2">
              Ref {c.f7000Reference}
              {c.receiptAcceptedAt ? " · Receipt accepted" : ""}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {c.status === "REPORTABLE" && (
            <button
              type="button"
              onClick={() => dac7Store.financeReadyForF7000(c.id)}
              className="px-4 h-9 border border-line text-[11px] uppercase tracking-[0.14em] text-ink hover:bg-muted/40"
            >
              Ready for F7000
            </button>
          )}
          {c.status === "READY_FOR_F7000" && !c.f7000SubmittedAt && (
            <button
              type="button"
              onClick={() => dac7Store.financeSubmitF7000(c.id)}
              className="px-4 h-9 bg-ink text-cream text-[11px] uppercase tracking-[0.14em] hover:bg-ink/90"
            >
              Submit F7000
            </button>
          )}
          {c.status === "READY_FOR_F7000" && c.f7000SubmittedAt && (
            <button
              type="button"
              onClick={() => dac7Store.financeAcceptReceipt(c.id)}
              className="px-4 h-9 bg-ink text-cream text-[11px] uppercase tracking-[0.14em] hover:bg-ink/90"
            >
              Accept receipt
            </button>
          )}
          {c.status === "REPORTED" && (
            <button
              type="button"
              onClick={() => dac7Store.financeOpenCorrection(c.id, "Correction opened")}
              className="px-4 h-9 border border-line text-[11px] uppercase tracking-[0.14em] text-ink hover:bg-muted/40"
            >
              Open correction
            </button>
          )}
          {c.status === "CORRECTION_REQUIRED" && (
            <>
              <button
                type="button"
                onClick={() => dac7Store.financeSubmitF7000(c.id)}
                className="px-4 h-9 border border-line text-[11px] uppercase tracking-[0.14em] text-ink hover:bg-muted/40"
              >
                Resubmit F7000
              </button>
              <button
                type="button"
                onClick={() => dac7Store.financeAcceptReceipt(c.id)}
                className="px-4 h-9 bg-ink text-cream text-[11px] uppercase tracking-[0.14em] hover:bg-ink/90"
              >
                Accept correction
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line px-5 py-4">
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="text-2xl text-ink mt-2">{value}</p>
    </div>
  );
}
