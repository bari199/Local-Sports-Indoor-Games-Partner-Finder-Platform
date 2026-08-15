import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { venues } from "@/data/mockdata";

export default function BookVenues() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Book Venues</h2>
        <button className="text-sm font-semibold text-blue-600 hover:underline">
          SEE ALL VENUES &rsaquo;
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {venues.map((v, i) => (
          <motion.article
            key={v.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm"
          >
            <div className="relative">
              <img src={v.image} alt={v.name} className="h-36 w-full object-cover" />
              {v.featured && (
                <span className="absolute left-2 top-2 rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                  Featured
                </span>
              )}
              <span className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-white/95 px-1.5 py-0.5 text-xs font-semibold text-slate-700">
                <Star className="h-3 w-3 fill-emerald-500 text-emerald-500" />
                {v.rating} ({v.reviews})
              </span>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-semibold text-slate-900">{v.name}</h3>
              <p className="mt-1 text-xs text-slate-500">{v.tag}</p>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-2">
        <button className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}