import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { AlertTriangle, Bell, CircleAlert, X } from "lucide-react";
import {
  adminUnreadAlerts,
  dac7Store,
  sellerUnreadAlerts,
  useDac7Store,
  useCurrentSellerCase,
} from "@/lib/dac7-store";
import { reminderStageLabel, sellerStatusLabel } from "@/lib/dac7-state";

export function useComplianceJobs() {
  useEffect(() => {
    dac7Store.processComplianceJobs();
    const id = window.setInterval(() => dac7Store.processComplianceJobs(), 60_000);
    return () => window.clearInterval(id);
  }, []);
}

export function SellerComplianceAlerts() {
  useComplianceJobs();
  const state = useDac7Store();
  const c = useCurrentSellerCase();
  const unread = sellerUnreadAlerts(state, c.sellerId).slice(0, 5);

  return (
    <div className="space-y-3 mb-8">
      {c.accountSuspended && (
        <CriticalBanner
          title="Account suspended"
          body="Your seller account is suspended because required DAC7 information was not provided after the legal diligence period (initial request, two reminders, ≥ 60 days). Payouts are on hold. Complete your DAC7 file to restore access."
          href="/seller/compliance/dac7"
        />
      )}
      {!c.accountSuspended && c.payoutHeld && (
        <WarnBanner
          title="Payouts on hold"
          body="Payouts are held until your DAC7 information is complete and verified."
          href="/seller/compliance/dac7"
        />
      )}
      {c.status === "OVERDUE" && !c.accountSuspended && (
        <WarnBanner
          title="DAC7 response overdue"
          body="Your DAC7 deadline has passed. Complete your information now to avoid automatic account suspension."
          href="/seller/compliance/dac7"
        />
      )}
      {unread.length > 0 && (
        <div className="border border-line bg-background px-5 py-4">
          <div className="flex items-center justify-between gap-4 mb-3">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground inline-flex items-center gap-2">
              <Bell className="h-3.5 w-3.5" strokeWidth={1.5} />
              Notifications ({unread.length})
            </p>
            <button
              type="button"
              className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-ink"
              onClick={() => dac7Store.markAllAlertsRead("seller", c.sellerId)}
            >
              Mark all read
            </button>
          </div>
          <ul className="space-y-3">
            {unread.map((a) => (
              <li key={a.id} className="flex items-start justify-between gap-3 text-sm">
                <div>
                  <p className="text-ink">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{a.body}</p>
                  {a.href && (
                    <Link to={a.href} className="inline-block mt-2 text-xs uppercase tracking-[0.14em] text-ink hover:opacity-70">
                      Open
                    </Link>
                  )}
                </div>
                <button
                  type="button"
                  aria-label="Dismiss"
                  onClick={() => dac7Store.markAlertRead(a.id)}
                  className="text-muted-foreground hover:text-ink"
                >
                  <X className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function AdminComplianceAlerts() {
  useComplianceJobs();
  const state = useDac7Store();
  const unread = adminUnreadAlerts(state).slice(0, 8);
  const suspended = state.cases.filter((c) => c.accountSuspended);
  const held = state.cases.filter((c) => c.payoutHeld && !c.accountSuspended);
  const overdue = state.cases.filter((c) => c.status === "OVERDUE");

  return (
    <div className="space-y-3 mb-8">
      {(suspended.length > 0 || held.length > 0 || overdue.length > 0) && (
        <div className="border border-rose-200/80 bg-rose-50/40 px-5 py-4">
          <p className="text-sm text-ink font-medium inline-flex items-center gap-2">
            <CircleAlert className="h-4 w-4 text-rose-700" strokeWidth={1.5} />
            Compliance alerts
          </p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {suspended.map((c) => (
              <li key={c.id}>
                <Link
                  to="/admin/dac7/$sellerId"
                  params={{ sellerId: c.sellerId }}
                  className="underline hover:text-ink"
                >
                  {c.sellerName}
                </Link>{" "}
                — {sellerStatusLabel(c.status)} · {reminderStageLabel(c.reminderStage)}
              </li>
            ))}
            {held.map((c) => (
              <li key={c.id}>
                <Link
                  to="/admin/dac7/$sellerId"
                  params={{ sellerId: c.sellerId }}
                  className="underline hover:text-ink"
                >
                  {c.sellerName}
                </Link>{" "}
                — payout on hold
              </li>
            ))}
            {overdue.map((c) => (
              <li key={c.id}>
                <Link
                  to="/admin/dac7/$sellerId"
                  params={{ sellerId: c.sellerId }}
                  className="underline hover:text-ink"
                >
                  {c.sellerName}
                </Link>{" "}
                — overdue (pre-suspension)
              </li>
            ))}
          </ul>
        </div>
      )}

      {unread.length > 0 && (
        <div className="border border-line bg-background px-5 py-4">
          <div className="flex items-center justify-between gap-4 mb-3">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground inline-flex items-center gap-2">
              <Bell className="h-3.5 w-3.5" strokeWidth={1.5} />
              Notification log ({unread.length} unread)
            </p>
            <button
              type="button"
              className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-ink"
              onClick={() => dac7Store.markAllAlertsRead("admin")}
            >
              Mark all read
            </button>
          </div>
          <ul className="space-y-3">
            {unread.map((a) => (
              <li key={a.id} className="flex items-start justify-between gap-3 text-sm">
                <div>
                  <p className="text-ink">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{a.body}</p>
                  {a.href && (
                    <Link to={a.href} className="inline-block mt-2 text-xs uppercase tracking-[0.14em] text-ink hover:opacity-70">
                      Open case
                    </Link>
                  )}
                </div>
                <button
                  type="button"
                  aria-label="Dismiss"
                  onClick={() => dac7Store.markAlertRead(a.id)}
                  className="text-muted-foreground hover:text-ink"
                >
                  <X className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function AdminEmailOutbox({ limit = 12 }: { limit?: number }) {
  const { emails } = useDac7Store();
  const latest = [...emails].reverse().slice(0, limit);
  if (!latest.length) {
    return (
      <p className="text-sm text-muted-foreground">No DAC7 emails sent yet.</p>
    );
  }
  return (
    <div className="border border-line">
      {latest.map((m) => (
        <div key={m.id} className="px-5 py-4 border-b border-line last:border-b-0 text-sm">
          <p className="text-ink">{m.subject}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {m.status.toUpperCase()} · {m.templateId} · to {m.to} ·{" "}
            {m.sentAt ? new Date(m.sentAt).toLocaleString() : "scheduled"}
          </p>
        </div>
      ))}
    </div>
  );
}

function CriticalBanner({
  title,
  body,
  href,
}: {
  title: string;
  body: string;
  href: string;
}) {
  return (
    <div className="border border-rose-300 bg-rose-50/60 px-5 py-4 flex items-start gap-3">
      <CircleAlert className="h-5 w-5 text-rose-700 mt-0.5 shrink-0" strokeWidth={1.5} />
      <div>
        <p className="text-sm text-ink font-medium">{title}</p>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{body}</p>
        <Link to={href} className="inline-block mt-3 text-xs uppercase tracking-[0.16em] text-rose-800 hover:opacity-80">
          Resolve now
        </Link>
      </div>
    </div>
  );
}

function WarnBanner({
  title,
  body,
  href,
}: {
  title: string;
  body: string;
  href: string;
}) {
  return (
    <div className="border border-amber-200/80 bg-amber-50/50 px-5 py-4 flex items-start gap-3">
      <AlertTriangle className="h-5 w-5 text-amber-700 mt-0.5 shrink-0" strokeWidth={1.5} />
      <div>
        <p className="text-sm text-ink font-medium">{title}</p>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{body}</p>
        <Link to={href} className="inline-block mt-3 text-xs uppercase tracking-[0.16em] text-ink hover:opacity-70">
          Open DAC7
        </Link>
      </div>
    </div>
  );
}
