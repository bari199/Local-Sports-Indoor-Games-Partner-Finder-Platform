import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/data/mockdata";

export default function FAQ() {
  const left = faqs.slice(0, 5);
  const right = faqs.slice(5);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <h2 className="mb-5 text-lg font-bold text-slate-900">Frequently Asked Questions</h2>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 gap-x-8 md:grid-cols-2"
      >
        <Accordion type="single" collapsible className="w-full">
          {left.map((f, i) => (
            <AccordionItem key={i} value={`left-${i}`}>
              <AccordionTrigger className="text-left text-sm font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-slate-500">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Accordion type="single" collapsible className="w-full">
          {right.map((f, i) => (
            <AccordionItem key={i} value={`right-${i}`}>
              <AccordionTrigger className="text-left text-sm font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-slate-500">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
}