import { Link } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { ModuleLayout } from "@/components/seller/ModuleLayout";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function HelpPageLayout({
  backTo,
  backLabel,
  breadcrumbs,
  children,
}: {
  backTo: string;
  backLabel: string;
  breadcrumbs: BreadcrumbItem[];
  children: ReactNode;
}) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ModuleLayout backTo={backTo} backLabel={backLabel}>
      <article className="max-w-[700px] mx-auto">
        <nav
          className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-8"
          aria-label="Breadcrumb"
        >
          {breadcrumbs.map((item, i) => (
            <span key={item.label}>
              {i > 0 && <span className="mx-2">/</span>}
              {item.href ? (
                <Link to={item.href} className="hover:text-ink">
                  {item.label}
                </Link>
              ) : (
                <span className="text-ink">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
        {children}
      </article>
    </ModuleLayout>
  );
}
