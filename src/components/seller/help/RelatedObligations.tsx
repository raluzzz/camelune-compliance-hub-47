import { Link } from "@tanstack/react-router";

const CATEGORIES = [
  {
    id: "packaging",
    title: "Packaging (PACK)",
    href: "/help/epr/packaging",
  },
  {
    id: "batteries",
    title: "Batteries (BATT)",
    href: "/help/epr/batteries",
  },
  {
    id: "weee",
    title: "Electrical appliances (EEE)",
    href: "/help/epr/weee",
  },
] as const;

export type EprHelpCategory = (typeof CATEGORIES)[number]["id"];

export function RelatedObligations({ current }: { current: EprHelpCategory }) {
  const related = CATEGORIES.filter((c) => c.id !== current);

  return (
    <section className="mt-20 pt-10 border-t border-line">
      <h2 className="text-base text-ink mb-5">Related obligations</h2>
      <ul className="space-y-3">
        {related.map((item) => (
          <li key={item.id}>
            <Link
              to={item.href}
              className="text-sm text-muted-foreground hover:text-ink underline-offset-4 hover:underline"
            >
              {item.title} →
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
