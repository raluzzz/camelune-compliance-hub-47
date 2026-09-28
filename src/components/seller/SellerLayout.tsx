import type { ReactNode } from "react";

export function SellerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="px-8 py-12">{children}</main>
    </div>
  );
}
