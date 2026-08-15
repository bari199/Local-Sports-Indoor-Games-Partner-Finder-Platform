import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GiftBanner() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="relative mx-4 mt-4 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 px-6 py-6 text-white md:mx-8 md:px-10"
    >
      <div className="relative z-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h2 className="text-xl font-semibold leading-snug md:text-2xl">
          The Easiest Way to Nail a Gift for a{" "}
          <span className="text-amber-400">Sports Lover</span>
        </h2>
        <Button className="shrink-0 rounded-full bg-rose-500 px-5 hover:bg-rose-600">
          <Gift className="mr-2 h-4 w-4" />
          Send a Playo Gift Card
        </Button>
      </div>
    </motion.section>
  );
}