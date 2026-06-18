import {
  STATUS_GROUP_LABEL,
  statusGroup,
  statusGroupToneClass,
  type EprStatus,
  type StatusGroup,
} from "@/lib/epr-data";

export function StatusBadge({
  status,
  group,
}: {
  status?: EprStatus;
  group?: StatusGroup;
}) {
  const g = group ?? (status ? statusGroup(status) : "neutral");
  return (
    <span
      className={`inline-flex items-center px-2 py-[3px] rounded-full text-[10.5px] tracking-[0.04em] font-medium ${statusGroupToneClass(g)}`}
    >
      {STATUS_GROUP_LABEL[g]}
    </span>
  );
}
