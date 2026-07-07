import { useState } from "react";
import { HelpCircle } from "lucide-react";

export function LearnMore({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="contents">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-ink transition-colors"
      >
        <HelpCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
        Learn more
      </button>
      {open && (
        <p className="w-full basis-full mt-4 text-sm text-muted-foreground leading-relaxed max-w-2xl">
          {children}
        </p>
      )}
    </div>
  );
}
