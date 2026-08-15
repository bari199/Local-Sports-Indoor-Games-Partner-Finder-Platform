import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GiftStrip() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="mx-4 my-4 flex flex-col items-center justify-between gap-4 rounded-2xl bg-blue-700 px-6 py-6 text-white md:mx-8 md:flex-row md:px-10"
    >
      <div className="flex items-center gap-3 text-center md:text-left">
        <Gift className="hidden h-8 w-8 shrink-0 md:block" />
        <p className="text-lg font-semibold uppercase tracking-wide">
          Gift a game to your <span className="italic normal-case text-amber-300">loved ones</span>
        </p>
      </div>
      <Button className="rounded-full bg-white px-6 text-blue-700 hover:bg-slate-100">
        Buy Gift Card
      </Button>
    </motion.section>
  );
}