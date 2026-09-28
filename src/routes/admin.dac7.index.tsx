import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminEmailOutbox } from "@/components/dac7/ComplianceAlerts";
import {
  adminQueuePriority,
  reminderStageLabel,
  sellerStatusLabel,
  thresholdExplain,
} from "@/lib/dac7-state";
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
    [
      "SUBMITTED",
      "UNDER_REVIEW",
      "NEEDS_CORRECTION",
      "PAYMENT_RESTRICTED",
      "ACCOUNT_RESTRICTED",
      "OVERDUE",
      "CORRECTION_REQUIRED",
    ].includes(c.status),
  ).length;

  return (
    <AdminLayout
      title="DAC7 queue"
      subtitle="Review seller tax files, monitor diligence emails, and act before Finance reports."
    >
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-sm text-muted-foreground">
            {needsAttention} need attention · {queue.length} total
          </p>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => dac7Store.processComplianceJobs()}
            className="text-xs uppercase tracking-[0.16em] text-ink hover:opacity-70"
          >
            Run compliance jobs
          </button>
          <button
            type="button"
            onClick={() => dac7Store.reset()}
            className="text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-ink"
          >
            Reset seed data
          </button>
        </div>
      </div>

      <div className="border border-line mb-12">
        <div className="hidden lg:grid grid-cols-[1.3fr_70px_130px_150px_1fr_90px] px-5 py-3 border-b border-line text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          <div>Seller</div>
          <div>Year</div>
          <div>Status</div>
          <div>Reminder stage</div>
          <div>Threshold</div>
          <div className="text-right">Action</div>
        </div>
        {queue.map((c) => (
          <div
            key={c.id}
            className="grid grid-cols-1 lg:grid-cols-[1.3fr_70px_130px_150px_1fr_90px] gap-2 lg:gap-0 px-5 py-4 border-b border-line last:border-b-0 items-center text-sm"
          >
            <div>
              <p className="text-ink">{c.sellerName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{c.sellerEmail}</p>
              {(c.accountSuspended || c.payoutHeld) && (
                <p className="text-[11px] text-rose-700 mt-1">
                  {c.accountSuspended ? "Account suspended" : "Payout held"}
                </p>
              )}
            </div>
            <div className="text-muted-foreground">{c.reportingYear}</div>
            <div>
              <span className="inline-flex px-2 py-[3px] rounded-full text-[10.5px] bg-muted text-ink">
                {sellerStatusLabel(c.status)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">{reminderStageLabel(c.reminderStage)}</div>
            <div className="text-xs text-muted-foreground leading-relaxed">
              {thresholdExplain(c.salesCount, c.revenueEur)}
            </div>
            <div className="lg:text-right">
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

      <section>
        <h2 className="text-[15px] text-ink mb-4">Email outbox</h2>
        <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
          Production diligence emails (initial request, reminder 1 at day 14, reminder 2 at day 30,
          automatic suspension at day ≥ 60 when the seller has transactions and still owes information).
        </p>
        <AdminEmailOutbox />
      </section>
    </AdminLayout>
  );
}
