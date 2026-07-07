import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ComplianceSelect,
  complianceFieldLabelClass,
} from "@/components/seller/ComplianceFormControls";

export interface EditField {
  key: string;
  label: string;
  type?: "text" | "select";
  options?: string[];
  help?: string;
}

export function EditModal({
  trigger,
  title,
  description,
  fields,
  values,
  onSave,
}: {
  trigger: ReactNode;
  title: string;
  description?: string;
  fields: EditField[];
  values: Record<string, string>;
  onSave?: (next: Record<string, string>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<Record<string, string>>(values);
  const [saved, setSaved] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (v) {
          setState(values);
          setSaved(false);
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="bg-background border border-line max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[18px] font-normal text-ink">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-4 py-3">
          {fields.map((f) => (
            <div key={f.key}>
              <label className={complianceFieldLabelClass}>{f.label}</label>
              {f.type === "select" ? (
                <ComplianceSelect
                  value={state[f.key] ?? ""}
                  onValueChange={(next) => setState({ ...state, [f.key]: next })}
                  options={f.options ?? []}
                />
              ) : (
                <input
                  value={state[f.key] ?? ""}
                  onChange={(e) => setState({ ...state, [f.key]: e.target.value })}
                  className="w-full border border-line bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-ink"
                />
              )}
              {f.help && (
                <p className="text-xs text-muted-foreground mt-1.5">{f.help}</p>
              )}
            </div>
          ))}
        </div>

        {saved && (
          <p className="text-xs text-emerald-700">Saved.</p>
        )}

        <DialogFooter className="gap-2">
          <button
            onClick={() => setOpen(false)}
            className="px-5 h-10 border border-line text-xs uppercase tracking-[0.16em] text-ink hover:bg-muted/40"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave?.(state);
              setSaved(true);
              setTimeout(() => setOpen(false), 600);
            }}
            className="px-5 h-10 bg-ink text-cream text-xs uppercase tracking-[0.16em] hover:bg-ink/90"
          >
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
