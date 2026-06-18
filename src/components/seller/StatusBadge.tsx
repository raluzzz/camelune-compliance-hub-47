import { STATUS_LABEL, statusToneClass, type EprStatus } from "@/lib/epr-data";

export function StatusBadge({ status }: { status: EprStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] border ${statusToneClass(
        status,
      )}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
