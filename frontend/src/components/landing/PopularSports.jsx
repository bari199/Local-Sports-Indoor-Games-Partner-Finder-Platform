import { motion } from "framer-motion";
import { popularSports } from "@/data/mockdata";

export default function PopularSports() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <h2 className="mb-4 text-lg font-bold text-slate-900">Popular Sports</h2>
      <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
        {popularSports.map((s, i) => (
          <motion.button
            key={s.name}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            whileHover={{ scale: 1.03 }}
            className="group relative aspect-square overflow-hidden rounded-xl"
          >
            <img
              src={s.image}
              alt={s.name}
              className="h-full w-full object-cover brightness-75 transition group-hover:brightness-90"
            />
            <span className="absolute bottom-2 left-2 text-sm font-semibold text-white">
              {s.name}
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}