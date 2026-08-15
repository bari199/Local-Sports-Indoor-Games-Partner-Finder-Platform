import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { blogs } from "@/data/mockdata";

export default function Blogs() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Blogs to Keep You Fit! &rsaquo;</h2>
        <div className="flex gap-2">
          <button className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {blogs.map((b, i) => (
          <motion.article
            key={b.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
          >
            <img src={b.image} alt={b.title} className="mb-2 h-28 w-full rounded-xl object-cover" />
            <h3 className="text-sm font-semibold leading-snug text-slate-900">{b.title}</h3>
            <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">
              {b.date} | {b.author}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}