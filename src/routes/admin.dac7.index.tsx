import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { adminQueuePriority, sellerStatusLabel, thresholdExplain } from "@/lib/dac7-state";
import { dac7Store, useDac7Store } from "@/lib/dac7-store";

export const Route = createFileRoute("/admin/dac7/")({
  head: () => ({
    meta: [{ title: "DAC7 queue — Camelune Admin" }],
  }),
  component: Page,
});

function Page() {
  const { cases } = useDac7Store();
  const queue = [...cases].sort(
    (a, b) => adminQueuePriority(a.status) - adminQueuePriority(b.status),
  );
  const needsAttention = queue.filter((c) =>
    ["SUBMITTED", "UNDER_REVIEW", "NEEDS_CORRECTION", "PAYMENT_RESTRICTED", "CORRECTION_REQUIRED"].includes(
      c.status,
    ),
  ).length;

  return (
    <AdminLayout
      title="DAC7 queue"
      subtitle="Review seller tax files, request fixes, and approve profiles before Finance reports."
    >
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-sm text-muted-foreground">
            {needsAttention} need attention · {queue.length} total
          </p>
        </div>
        <button
          type="button"
          onClick={() => dac7Store.reset()}
          className="text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-ink"
        >
          Reset demo data
        </button>
      </div>

      <div className="border border-line">
        <div className="hidden md:grid grid-cols-[1.4fr_120px_140px_1fr_120px] px-5 py-3 border-b border-line text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          <div>Seller</div>
          <div>Year</div>
          <div>Status</div>
          <div>Threshold</div>
          <div className="text-right">Action</div>
        </div>
        {queue.map((c) => (
          <div
            key={c.id}
            className="grid grid-cols-1 md:grid-cols-[1.4fr_120px_140px_1fr_120px] gap-2 md:gap-0 px-5 py-4 border-b border-line last:border-b-0 items-center text-sm"
          >
            <div>
              <p className="text-ink">{c.sellerName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{c.sellerEmail}</p>
            </div>
            <div className="text-muted-foreground">{c.reportingYear}</div>
            <div>
              <span className="inline-flex px-2 py-[3px] rounded-full text-[10.5px] bg-muted text-ink">
                {sellerStatusLabel(c.status)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed">
              {thresholdExplain(c.salesCount, c.revenueEur)}
            </div>
            <div className="md:text-right">
              <Link
                to="/admin/dac7/$sellerId"
                params={{ sellerId: c.sellerId }}
                className="text-xs uppercase tracking-[0.16em] text-ink hover:opacity-70"
              >
                Open
              </Link>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
