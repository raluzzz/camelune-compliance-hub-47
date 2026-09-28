import type { ReactNode } from "react";
import { SellerComplianceAlerts } from "@/components/dac7/ComplianceAlerts";

export function SellerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="px-8 py-12">
        <div className="max-w-[1040px] mx-auto">
          <SellerComplianceAlerts />
        </div>
        {children}
      </main>
    </div>
  );
}
