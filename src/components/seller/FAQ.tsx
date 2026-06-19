import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export interface FAQItem {
  q: string;
  a: string;
}

export function FAQ({ title = "Frequently asked", items }: { title?: string; items: FAQItem[] }) {
  return (
    <section className="mt-20">
      <h2 className="text-base text-ink mb-5">{title}</h2>
      <Accordion type="single" collapsible className="border-t border-line">
        {items.map((it, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="border-b border-line">
            <AccordionTrigger className="text-sm text-ink hover:no-underline py-5 text-left">
              {it.q}
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[680px]">
                {it.a}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
