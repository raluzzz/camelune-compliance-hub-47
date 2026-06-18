import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  MessageSquareWarning,
  Search,
  FileText,
  Receipt,
  Gem,
  MessageSquare,
  Heart,
  Settings,
  AlertOctagon,
  LogOut,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { SELLER } from "@/lib/epr-data";

const NAV = ["Shop", "Vendors", "About", "Promotions", "Discover"];

const SIDE: { label: string; to: string; icon: LucideIcon }[] = [
  { label: "Orders", to: "/seller/orders", icon: FileText },
  { label: "Invoices", to: "/seller/invoices", icon: Receipt },
  { label: "My Certificates", to: "/seller/certificates", icon: Gem },
  { label: "Messages", to: "/seller/messages", icon: MessageSquare },
  { label: "Favorites", to: "/seller/favorites", icon: Heart },
  { label: "Compliance Center", to: "/seller/compliance", icon: ShieldCheck },
  { label: "Account Settings", to: "/seller/settings", icon: Settings },
  { label: "Report issue", to: "/seller/report", icon: AlertOctagon },
  { label: "Sign Out", to: "/seller/signout", icon: LogOut },
];

export function SellerLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
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

      {/* Body */}
      <div className="max-w-[1400px] mx-auto px-8 py-10 grid grid-cols-[280px_1fr] gap-10">
        <aside>
          <div className="bg-muted/60 border border-line p-6 text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-[radial-gradient(circle_at_30%_30%,#c8b89a,#5b4a35)]" />
            <p className="mt-3 text-xs text-muted-foreground">Welcome back,</p>
            <p className="font-medium text-ink">{SELLER.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{SELLER.email}</p>
          </div>

          <button className="mt-5 w-full border border-ink/80 py-3 text-sm font-medium tracking-wide hover:bg-ink hover:text-primary-foreground transition-colors">
            Become a Seller
          </button>

          <ul className="mt-8 space-y-1">
            {SIDE.map((item) => {
              const active = pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className={`flex items-center gap-3 px-2 py-2.5 text-sm transition-colors ${
                      active
                        ? "text-ink font-medium"
                        : "text-muted-foreground hover:text-ink"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
