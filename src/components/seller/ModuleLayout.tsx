import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { SellerComplianceAlerts } from "@/components/dac7/ComplianceAlerts";

/**
 * Focused workspace for a single compliance module.
 */
export function ModuleLayout({
  children,
  backLabel = "Back to My Compliance",
  backTo = "/seller/compliance",
  showComplianceAlerts = false,
}: {
  children: ReactNode;
  backLabel?: string;
  backTo?: string;
  showComplianceAlerts?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-line bg-background">
        <div className="max-w-[900px] mx-auto px-8 py-4">
          <Link
            to={backTo}
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-ink transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
            {backLabel}
          </Link>
        </div>
      </div>

      <main className="max-w-[900px] mx-auto px-8 py-14">
        {showComplianceAlerts && <SellerComplianceAlerts />}
        {children}
      </main>
    </div>
  );
}
