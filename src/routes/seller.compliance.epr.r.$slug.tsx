import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { findObligationBySlug, obligationDetailLink } from "@/lib/epr-data";

/** Legacy `/epr/r/packaging-de` URLs redirect to canonical detail routes. */
export const Route = createFileRoute("/seller/compliance/epr/r/$slug")({
  beforeLoad: ({ params }) => {
    const o = findObligationBySlug(params.slug);
    if (!o) throw notFound();
    const dest = obligationDetailLink(o);
    throw redirect({ to: dest.to, params: dest.params });
  },
});
