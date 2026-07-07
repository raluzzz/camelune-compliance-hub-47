"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { formatOssEffectiveDate } from "@/lib/oss-registration";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const complianceFieldLabelClass =
  "block text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2";

export const complianceControlClass =
  "w-full border border-line bg-background text-sm text-ink rounded-none shadow-none focus:outline-none focus:border-ink";

export type ComplianceSelectOption =
  | string
  | {
      value: string;
      label: string;
    };

function normalizeSelectOptions(options: readonly ComplianceSelectOption[]) {
  return options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );
}

export function ComplianceSelect({
  value,
  onValueChange,
  options,
  placeholder,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: readonly ComplianceSelectOption[];
  placeholder?: string;
}) {
  const normalizedOptions = normalizeSelectOptions(options);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn(
          complianceControlClass,
          "h-auto px-3 py-2.5 data-[placeholder]:text-muted-foreground",
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="rounded-none border-line bg-background shadow-none">
        {normalizedOptions.map((option) => (
          <SelectItem key={option.value} value={option.value} className="rounded-none">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function isoToDate(iso: string): Date | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return undefined;
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function dateToIso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function ComplianceDatePicker({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (iso: string) => void;
  error?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const selected = value ? isoToDate(value) : undefined;

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              complianceControlClass,
              "flex items-center justify-between gap-3 px-3 py-2.5 text-left",
              error && "border-rose-400",
            )}
          >
            <span>{value ? formatOssEffectiveDate(value) : "Select date"}</span>
            <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto rounded-none border-line bg-background p-0 shadow-none"
          align="start"
        >
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(date) => {
              if (!date) return;
              onChange(dateToIso(date));
              setOpen(false);
            }}
            defaultMonth={selected}
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-rose-700 mt-2">{error}</p>}
    </div>
  );
}

