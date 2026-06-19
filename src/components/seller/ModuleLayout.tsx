import { Link } from "@tanstack/react-router";
import { Bell, MessageSquareWarning, Search, ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

const NAV = ["Shop", "Vendors", "About", "Promotions", "Discover"];

/**
 * Focused workspace layout for a single compliance module.
 * Keeps the Camelune header but hides the seller sidebar so the
 * seller can concentrate on one obligation area at a time.
 */
export function ModuleLayout({
  children,
  backLabel = "Back to My Compliance",
  backTo = "/seller/compliance",
}: {
  children: ReactNode;
  backLabel?: string;
  backTo?: string;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-cream border-b border-line">
        <div className="grid grid-cols-3 items-center px-8 pt-5 pb-2">
          <div className="flex items-center gap-2 text-ink-soft">
            <Search className="h-4 w-4" strokeWidth={1.5} />
            <input
              placeholder="Search"
              className="bg-transparent text-sm outline-none border-b border-ink/40 pb-0.5 w-40 placeholder:text-ink/60"
            />
          </div>
          <h1 className="text-center tracking-[0.32em] text-[1.05rem] font-medium text-ink">
            CAMELUNE
          </h1>
          <div className="flex items-center justify-end gap-5 text-sm text-ink">
            <Bell className="h-4 w-4" strokeWidth={1.5} />
            <span className="inline-flex items-center gap-2 text-ink-soft">
              <MessageSquareWarning className="h-4 w-4" strokeWidth={1.5} />
              Report issue
            </span>
            <span>Veronica</span>
            <span className="border border-ink px-3 py-1 text-xs uppercase tracking-[0.18em]">
              Seller
            </span>
          </div>
        </div>
        <nav className="flex justify-center gap-12 pb-4">
          {NAV.map((n) => (
            <span key={n} className="nav-label text-ink/80">
              {n}
            </span>
          ))}
        </nav>
      </header>

      {/* Breadcrumb back bar */}
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

      <main className="max-w-[900px] mx-auto px-8 py-14">{children}</main>
    </div>
  );
}
