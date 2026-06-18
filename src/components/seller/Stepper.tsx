import { Check } from "lucide-react";

export interface StepDef {
  label: string;
}

export function Stepper({ steps, current }: { steps: StepDef[]; current: number }) {
  return (
    <ol className="flex items-start gap-2 border-b border-line pb-6 mb-10">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s.label} className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className={`h-9 w-9 shrink-0 rounded-full border flex items-center justify-center text-sm ${
                done
                  ? "bg-ink text-primary-foreground border-ink"
                  : active
                  ? "border-ink text-ink"
                  : "border-line text-muted-foreground"
              }`}
            >
              {done ? <Check className="h-4 w-4" strokeWidth={2} /> : i + 1}
            </div>
            <span
              className={`pt-2 text-sm leading-tight ${
                active || done ? "text-ink" : "text-muted-foreground"
              }`}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div className="flex-1 h-px bg-line mt-[18px] ml-1" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
