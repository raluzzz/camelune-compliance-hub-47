import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  canTransition,
  reminderStageLabel,
  sellerStatusLabel,
  thresholdExplain,
} from "@/lib/dac7-state";
import { dac7Store, profileMissingFields, useDac7Store } from "@/lib/dac7-store";

export const Route = createFileRoute("/admin/dac7/$sellerId")({
  head: ({ params }) => ({
    meta: [{ title: `DAC7 case — ${params.sellerId} — Camelune Admin` }],
  }),
  loader: ({ params }) => {
    const c = dac7Store.getSnapshot().cases.find((x) => x.sellerId === params.sellerId);
    if (!c) throw notFound();
    return { sellerId: params.sellerId };
  },
  notFoundComponent: () => (
    <AdminLayout title="Case not found">
      <Link to="/admin/dac7" className="text-sm text-ink underline">
        Back to queue
      </Link>
    </AdminLayout>
  ),
  component: Page,
});

function Page() {
  const { sellerId } = Route.useLoaderData();
  const { cases } = useDac7Store();
  const c = cases.find((x) => x.sellerId === sellerId)!;
  const [note, setNote] = useState(c.correctionNote ?? "");
  const [error, setError] = useState<string | null>(null);
  const missing = profileMissingFields(c.profile);

  function run(fn: () => void) {
    try {
      setError(null);
      fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    }
  }

  return (
    <AdminLayout
      title={c.sellerName}
      subtitle={`${sellerStatusLabel(c.status)} · ${c.reportingYear} · ${reminderStageLabel(c.reminderStage)}`}
    >
      <Link
        to="/admin/dac7"
        className="inline-block text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-ink mb-8"
      >
        ← Back to queue
      </Link>

      {error && (
        <p className="mb-6 text-sm text-rose-700 border border-rose-200 bg-rose-50/50 px-4 py-3">
          {error}
        </p>
      )}

      <section className="border border-line p-6 mb-8">
        <p className="text-[15px] text-ink mb-2">Threshold & diligence</p>
        <p className="text-sm text-muted-foreground">{thresholdExplain(c.salesCount, c.revenueEur)}</p>
        <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Information requested</dt>
            <dd className="text-ink">
              {c.informationRequestedAt
                ? new Date(c.informationRequestedAt).toLocaleString()
                : "Not yet (no transactions or job pending)"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Reminder stage</dt>
            <dd className="text-ink">{reminderStageLabel(c.reminderStage)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Payout held</dt>
            <dd className="text-ink">{c.payoutHeld ? "Yes" : "No"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Account suspended</dt>
            <dd className="text-ink">{c.accountSuspended ? "Yes" : "No"}</dd>
          </div>
        </dl>
        {c.assignee && (
          <p className="text-sm text-muted-foreground mt-3">
            Assigned to <span className="text-ink">{c.assignee}</span>
          </p>
        )}
        {c.correctionNote && (
          <p className="mt-4 text-sm text-amber-900 bg-amber-50/60 border border-amber-200/80 px-4 py-3">
            Correction request: {c.correctionNote}
          </p>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-[15px] text-ink mb-4">Profile</h2>
        {missing.length > 0 && (
          <p className="text-sm text-rose-700 mb-3">Missing: {missing.join(", ")}</p>
        )}
        <dl className="border border-line divide-y divide-line text-sm">
          {(
            [
              ["Company", c.profile.companyName],
              ["Address", `${c.profile.registeredAddress}, ${c.profile.companyCountry}`],
              ["Legal representative", c.profile.legalRepresentative],
              ["Registration", c.profile.registrationNumber],
              ["Taxpayer ID", `${c.profile.taxpayerIssuingCountry} · ${c.profile.taxpayerId || "—"}`],
              ["Permanent establishment", c.profile.permanentEstablishment],
              ["VAT", c.profile.vatNumber],
              ["Bank", `${c.profile.bankAccountHolder} · ${c.profile.bankIban}`],
              [
                "Declaration",
                c.declarationAccepted ? `Accepted ${c.declarationAcceptedAt ?? ""}` : "Not accepted",
              ],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="grid grid-cols-[180px_1fr] gap-4 px-5 py-3">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mb-10 border border-line p-6">
        <h2 className="text-[15px] text-ink mb-4">Actions</h2>
        <div className="space-y-3 mb-5">
          <label className="block text-xs uppercase tracking-[0.14em] text-muted-foreground">
            Note for seller (corrections / restrictions)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full border border-line bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-ink"
            placeholder="Explain what the seller should fix…"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {canTransition(c.status, "start_review") && (
            <ActionButton onClick={() => run(() => dac7Store.adminStartReview(c.id))}>
              Start review
            </ActionButton>
          )}
          {canTransition(c.status, "request_correction") && (
            <ActionButton
              tone="warn"
              onClick={() =>
                run(() =>
                  dac7Store.adminRequestCorrection(
                    c.id,
                    note.trim() || "Please review and correct the highlighted information.",
                  ),
                )
              }
            >
              Request fix
            </ActionButton>
          )}
          {canTransition(c.status, "approve") && (
            <ActionButton tone="ok" onClick={() => run(() => dac7Store.adminApprove(c.id))}>
              Approve
            </ActionButton>
          )}
          {canTransition(c.status, "restrict_payout") && (
            <ActionButton
              tone="danger"
              onClick={() =>
                run(() =>
                  dac7Store.adminRestrictPayout(
                    c.id,
                    note.trim() || "Payouts held — DAC7 information incomplete after reminders.",
                  ),
                )
              }
            >
              Hold payout
            </ActionButton>
          )}
          {canTransition(c.status, "restrict_account") && (
            <ActionButton
              tone="danger"
              onClick={() =>
                run(() =>
                  dac7Store.adminRestrictAccount(
                    c.id,
                    note.trim() ||
                      "Account suspended — DAC7 information not provided after diligence period.",
                  ),
                )
              }
            >
              Suspend account
            </ActionButton>
          )}
          {canTransition(c.status, "remove_restriction") && (
            <ActionButton onClick={() => run(() => dac7Store.adminRemoveRestriction(c.id))}>
              Lift restrictions
            </ActionButton>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
          Automatic suspension also runs for sellers with transactions after the initial email, two
          reminders (day 14 and 30), and at least 60 days without a complete file.
        </p>
      </section>

      <section>
        <h2 className="text-[15px] text-ink mb-4">Activity</h2>
        <ul className="space-y-3">
          {[...c.history].reverse().map((h) => (
            <li key={h.id} className="text-sm border-b border-line pb-3">
              <p className="text-ink">{h.action}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {h.actor} · {new Date(h.at).toLocaleString()}
                {h.fromStatus && h.toStatus ? ` · ${h.fromStatus} → ${h.toStatus}` : ""}
              </p>
              {h.note && <p className="text-xs text-muted-foreground mt-1">{h.note}</p>}
            </li>
          ))}
        </ul>
      </section>
    </AdminLayout>
  );
}

function ActionButton({
  children,
  onClick,
  tone = "default",
}: {
  children: React.ReactNode;
  onClick: () => void;
  tone?: "default" | "ok" | "warn" | "danger";
}) {
  const cls =
    tone === "ok"
      ? "bg-ink text-cream hover:bg-ink/90"
      : tone === "warn"
        ? "border border-amber-300 text-amber-900 hover:bg-amber-50"
        : tone === "danger"
          ? "border border-rose-300 text-rose-700 hover:bg-rose-50"
          : "border border-line text-ink hover:bg-muted/40";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 h-10 text-xs uppercase tracking-[0.16em] ${cls}`}
    >
      {children}
    </button>
  );
}
