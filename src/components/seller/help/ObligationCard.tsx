import { Link } from "@tanstack/react-router";

export function ObligationCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      to={href}
      className="flex flex-col border border-line bg-background p-6 hover:bg-muted/30 transition-colors duration-150 h-full"
    >
      <p className="text-[15px] text-ink">{title}</p>
      <p className="text-sm text-muted-foreground leading-relaxed mt-2 flex-1">
        {description}
      </p>
    </Link>
  );
}
