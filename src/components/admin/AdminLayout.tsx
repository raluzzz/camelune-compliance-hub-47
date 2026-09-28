import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

const NAV = [
  { label: "DAC7 queue", to: "/admin/dac7" },
  { label: "Finance reports", to: "/admin/finance/dac7" },
  { label: "Seller view", to: "/seller/compliance/dac7" },
] as const;

export function AdminLayout({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-line">
        <div className="max-w-[1100px] mx-auto px-8 py-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Camelune admin
            </p>
            <h1 className="text-xl text-ink mt-1">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{subtitle}</p>
            )}
          </div>
          <nav className="flex flex-wrap gap-5">
            {NAV.map((item) => {
              const active =
                item.to === "/admin/dac7"
                  ? pathname.startsWith("/admin/dac7") && !pathname.includes("finance")
                  : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`text-xs uppercase tracking-[0.16em] ${
                    active ? "text-ink" : "text-muted-foreground hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="max-w-[1100px] mx-auto px-8 py-10">{children}</main>
    </div>
  );
}
