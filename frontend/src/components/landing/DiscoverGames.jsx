import { motion } from "framer-motion";
import { Clock, MapPin, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { games } from "@/data/mockdata";

export default function DiscoverGames() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Discover Games</h2>
        <button className="text-sm font-semibold text-blue-600 hover:underline">
          SEE ALL GAMES &rsaquo;
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {games.map((g, i) => (
          <motion.article
            key={g.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            className="rounded-2xl border border-slate-100 p-4 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
              <span>{g.type}</span>
              {g.slotsLabel && <span className="font-semibold text-slate-500">₹{g.slotsLabel}</span>}
            </div>

            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                {g.sport[0]}
              </div>
              <span className="text-sm font-semibold text-slate-800">{g.status}</span>
            </div>

            <p className="mb-2 text-xs text-slate-500">{g.format}</p>

            <div className="mb-1 flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="h-3.5 w-3.5" />
              {g.time}
            </div>
            <div className="mb-3 flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="h-3.5 w-3.5" />
              {g.location}
            </div>

            <div className="flex items-center justify-between">
              <span
                className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase ${
                  g.booked
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                {g.level}
              </span>
              <MoreHorizontal className="h-4 w-4 text-slate-400" />
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