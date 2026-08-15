import { motion } from "framer-motion";
import { Smartphone } from "lucide-react";

export default function AppDownload() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="mx-4 mb-8 flex flex-col items-center justify-between gap-6 rounded-2xl bg-blue-950 px-6 py-8 text-white md:mx-8 md:flex-row md:px-10"
    >
      <div className="text-center md:text-left">
        <h3 className="text-lg font-semibold md:text-xl">
          Get the Playo app for a seamless experience!
        </h3>
        <div className="mt-4 flex justify-center gap-3 md:justify-start">
          <button className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-xs font-medium">
            <Smartphone className="h-4 w-4" /> Get it on Google Play
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-xs font-medium">
            <Smartphone className="h-4 w-4" /> Download on App Store
          </button>
        </div>
      </div>
      <div className="flex h-32 w-24 items-center justify-center rounded-xl bg-white/10">
        <Smartphone className="h-12 w-12 text-white/70" />
      </div>
    </motion.section>
  );
}