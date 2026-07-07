import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export interface FAQItem {
  id?: string;
  q: string;
  a: string;
}

function faqValue(item: FAQItem, index: number) {
  return item.id ?? `faq-${index}`;
}

export function FAQ({ title = "FAQ", items }: { title?: string; items: FAQItem[] }) {
  const [openValue, setOpenValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;

      const matchIndex = items.findIndex((it) => it.id === hash);
      if (matchIndex === -1) return;

      setOpenValue(faqValue(items[matchIndex], matchIndex));
      window.setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [items]);

  return (
    <section className="mt-20" id="faq">
      <h2 className="text-base text-ink mb-5">{title}</h2>
      <Accordion
        type="single"
        collapsible
        className="border-t border-line"
        value={openValue}
        onValueChange={setOpenValue}
      >
        {items.map((it, i) => (
          <AccordionItem
            key={faqValue(it, i)}
            id={it.id}
            value={faqValue(it, i)}
            className="border-b border-line scroll-mt-24"
          >
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
