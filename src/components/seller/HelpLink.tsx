import { ArrowUpRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Placeholder link to the Camelune Seller Help Center.
 * The Help Center is not yet published. All hrefs are TODO routes — to be
 * activated when the Help Center goes live. Renders as a visually inactive
 * (greyed) link with a tooltip on hover.
 */
export function HelpLink({
  label,
  href, // TODO: activate when Help Center is published
  className = "",
  inline = false,
}: {
  label: string;
  href: string;
  className?: string;
  inline?: boolean;
}) {
  const base = inline
    ? "inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em]"
    : "inline-flex items-center gap-2 text-sm";

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={href}
            aria-disabled="true"
            onClick={(e) => e.preventDefault()}
            className={`${base} text-muted-foreground/70 hover:text-muted-foreground cursor-not-allowed no-underline ${className}`}
          >
            {label}
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </a>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          Coming soon — our Help Center is being prepared.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
