import { MapPin } from "lucide-react";
import { cities } from "@/data/mockdata";

export default function TopCities() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 md:px-8">
      <h2 className="mb-4 text-lg font-bold text-slate-900">Top Sports Complexes in Cities</h2>
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 md:grid-cols-4">
        {cities.map((c) => (
          <button
            key={c}
            className="flex items-center gap-1.5 py-1 text-left text-sm text-slate-600 hover:text-blue-600"
          >
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            {c}
          </button>
        ))}
      </div>
    </section>
  );
}