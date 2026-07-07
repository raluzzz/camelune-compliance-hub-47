import {
  OBLIGATIONS,
  COUNTRY_LABEL,
  obligationDetailLink,
  type EprCategory,
  type EprStatus,
} from "@/lib/epr-data";

const SHORT_CATEGORY: Record<EprCategory, string> = {
  packaging: "Packaging",
  batteries: "Batteries",
  weee: "WEEE",
  textiles: "Textiles",
};

const ACTIONABLE: EprStatus[] = ["missing", "review-required", "rejected"];

export interface ComplianceActionItem {
  title: string;
  desc: string;
  cta: "Complete" | "Review" | "Fix";
  to: "/seller/compliance/epr/$slug";
  params: { slug: string };
}

function actionCta(status: EprStatus): ComplianceActionItem["cta"] {
  if (status === "missing") return "Complete";
  if (status === "review-required") return "Review";
  return "Fix";
}

function actionDescription(o: (typeof OBLIGATIONS)[number]): string {
  if (o.status === "rejected" && o.note) {
    return "The submitted document was rejected.";
  }
  if (o.affectedProducts > 0) {
    return `${o.affectedProducts} listing${o.affectedProducts === 1 ? "" : "s"} cannot be shipped to ${COUNTRY_LABEL[o.country]}.`;
  }
  return o.dueLabel ?? `Action required for ${COUNTRY_LABEL[o.country]}.`;
}

export function buildComplianceActionItems(
  obligations = OBLIGATIONS,
): ComplianceActionItem[] {
  return obligations
    .filter((o) => ACTIONABLE.includes(o.status))
    .sort((a, b) => {
      const order = { missing: 0, "review-required": 1, rejected: 2 };
      return order[a.status as keyof typeof order] - order[b.status as keyof typeof order];
    })
    .map((o) => {
      const link = obligationDetailLink(o);
      return {
        title: `${SHORT_CATEGORY[o.category]} — ${COUNTRY_LABEL[o.country]}`,
        desc: actionDescription(o),
        cta: actionCta(o.status),
        to: link.to,
        params: link.params,
      };
    });
}

/** @deprecated Use title from buildComplianceActionItems — kept for tests. */
export function categoryShortLabel(category: EprCategory): string {
  return SHORT_CATEGORY[category];
}
