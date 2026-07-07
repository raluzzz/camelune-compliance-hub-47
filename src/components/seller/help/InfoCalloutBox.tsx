import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function InfoCalloutBox({
  title,
  text,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <aside className="border border-line bg-muted/30 p-8 mt-16">
      <p className="text-[15px] font-medium text-ink">{title}</p>
      <p className="text-sm text-muted-foreground leading-relaxed mt-3">{text}</p>
      <Button variant="outline" className="mt-6" asChild>
        <Link to={ctaHref}>{ctaLabel}</Link>
      </Button>
      <p className="text-xs italic text-muted-foreground leading-relaxed mt-6">
        Please note: Camelune does not provide legal advice. This information is for
        general guidance only. Please consult a qualified compliance provider for your
        specific situation.
      </p>
    </aside>
  );
}
