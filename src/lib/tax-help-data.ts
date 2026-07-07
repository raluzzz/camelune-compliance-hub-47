import type { FAQItem } from "@/components/seller/FAQ";

export const TAX_FAQ: FAQItem[] = [
  {
    q: "What is the EU distance-selling threshold?",
    a: "If your total intra-EU cross-border sales of goods subject to standard taxation exceed €10,000 in the previous or current calendar year, you must charge VAT in each destination country — or use the One Stop Shop (OSS) to declare VAT in a single member state. This threshold applies across all your sales channels, not only Camelune.",
  },
  {
    q: "What is OSS and do I need it?",
    a: "The One Stop Shop (OSS) is an EU system that lets you declare VAT on cross-border B2C sales in one quarterly return through a single member state. It is optional, but it is usually simpler than registering for VAT separately in every EU country you ship to. If you are below the €10,000 threshold and only sell from your home country, you may not need OSS.",
  },
  {
    q: "Why does Camelune need my VAT number?",
    a: "Camelune uses your VAT information to operate your account compliantly across destination markets, including determining how invoices are issued and whether you are eligible to sell in each country. We validate VAT numbers against the EU VIES system.",
  },
  {
    q: "What is the margin scheme?",
    a: "For second-hand goods, sellers may use a margin scheme where VAT is only applied to the difference between purchase and sale price, rather than the full selling price. This is relevant for many Camelune sellers. If you sell under the margin scheme, declare this accurately in your tax situation answers.",
  },
  {
    q: "What happens if my VAT information is wrong or missing?",
    a: "Camelune may flag your account, ask you to correct your VAT numbers or declarations, and pause sales in affected destination countries until the issue is resolved. Invalid VAT numbers are checked against the EU VIES system. Keeping your tax situation up to date helps avoid interruptions to your listings.",
  },
];
