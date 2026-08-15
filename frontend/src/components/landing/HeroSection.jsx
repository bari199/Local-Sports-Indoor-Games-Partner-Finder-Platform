import { motion } from "framer-motion";
import { MapPin, CalendarCheck, Users, GraduationCap, UsersRound } from "lucide-react";

const quickLinks = [
  { label: "Book Venues", icon: CalendarCheck },
  { label: "Join Games", icon: Users },
  { label: "Find Coaches", icon: GraduationCap },
  { label: "Play Together", icon: UsersRound },
];

export default function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
        {/* Left: copy */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700">
            <MapPin className="h-3.5 w-3.5 text-blue-600" />
            Bangalore
          </div>

          <h1 className="text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl">
            BOOK <span className="text-blue-600">SPORTS</span> VENUES.
            <br />
            JOIN GAMES.
            <br />
            FIND TRAINERS NEAR YOU.
          </h1>

          <p className="mt-4 max-w-md text-sm text-slate-500 md:text-base">
            The World's Largest Sports Community to Book Venues, Find Trainers, and Join Games near you.
          </p>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
            {quickLinks.map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                <Icon className="h-4 w-4 text-blue-600" />
                {label}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: image collage */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="relative grid grid-cols-2 gap-3"
        >
          <img
            src="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80"
            alt="Basketball players"
            className="col-span-1 row-span-2 h-full w-full rounded-2xl object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&q=80"
            alt="Badminton court"
            className="h-36 w-full rounded-2xl object-cover md:h-40"
          />
          <img
            src="https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&q=80"
            alt="Football player running"
            className="h-36 w-full rounded-2xl object-cover md:h-40"
          />

          <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 shadow-lg ring-4 ring-white">
            <span className="text-xl font-bold text-white">P</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}