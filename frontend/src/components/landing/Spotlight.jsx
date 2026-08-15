import { motion } from "framer-motion";
import { Coins, Volume2, Building2, MessageCircle, ArrowRight } from "lucide-react";
import { spotlightCards } from "@/data/mockdata";

const icons = {
  coins: Coins,
  whistle: Volume2,
  stadium: Building2,
  chat: MessageCircle,
};

export default function Spotlight() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="flex overflow-hidden rounded-2xl shadow-sm">
        {/* Vertical label rail */}
        <div className="flex w-10 shrink-0 items-center justify-center bg-amber-400 md:w-12">
          <span className="rotate-180 text-xs font-bold uppercase tracking-widest text-slate-900 [writing-mode:vertical-lr]">
            Spotlight
          </span>
        </div>

        {/* Card grid */}
        <div className="grid flex-1 grid-cols-1 gap-3 bg-slate-50 p-3 sm:grid-cols-2 lg:grid-cols-4">
          {spotlightCards.map((c, i) => {
            const Icon = icons[c.icon];
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
                whileHover={{ y: -4 }}
                className={`group relative flex min-h-[190px] cursor-pointer flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br ${c.accent} p-5 text-white shadow-md transition-shadow hover:shadow-xl`}
              >
                {/* Decorative oversized icon in the corner */}
                <Icon
                  className="pointer-events-none absolute -bottom-4 -right-4 h-24 w-24 text-white/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                  strokeWidth={1.5}
                />

                {/* Small icon badge */}
                <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                  <Icon className="h-4.5 w-4.5 text-white" strokeWidth={2} />
                </div>

                <div className="relative z-10">
                  <p className="text-base font-bold leading-snug">{c.title}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/70">{c.subtitle}</p>

                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-cyan-300 transition-all group-hover:gap-2">
                    {c.cta}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}