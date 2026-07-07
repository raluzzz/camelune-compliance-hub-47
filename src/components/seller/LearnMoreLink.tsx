export function LearnMoreLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs text-muted-foreground hover:text-ink transition-colors"
    >
      Learn more →
    </a>
  );
}
