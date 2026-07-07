type Tone = "neutral" | "ok" | "warn" | "soft";

export interface StatusPill {
  label: string;
  value: string | number;
  tone?: Tone;
}

function valueClass(tone: Tone = "neutral") {
  switch (tone) {
    case "warn":
      return "text-rose-700";
    case "ok":
      return "text-emerald-700";
    case "soft":
      return "text-amber-700";
    default:
      return "text-ink";
  }
}

export function StatusSummaryBar({ pills }: { pills: StatusPill[] }) {
  return (
    <section className="border border-line bg-background mb-8">
      <div
        className="grid divide-x divide-line"
        style={{ gridTemplateColumns: `repeat(${pills.length}, minmax(0, 1fr))` }}
      >
        {pills.map((pill) => (
          <div key={pill.label} className="px-6 py-5">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              {pill.label}
            </p>
            <p className={`text-[28px] font-semibold mt-1.5 ${valueClass(pill.tone)}`}>
              {pill.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
