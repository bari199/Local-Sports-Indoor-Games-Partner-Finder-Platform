import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const photos = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80",
  "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?w=400&q=80",
  "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&q=80",
  "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80",
  "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?w=400&q=80",
];

export default function AboutTeam() {
  return (
    <section className="mx-4 my-8 rounded-2xl bg-slate-50 px-6 py-10 md:mx-8 md:px-10">
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-slate-900">About the Team</h2>
          <p className="mt-3 max-w-md text-sm text-slate-500">
            Playo's mission is to build a vibrant sports community that makes playing, booking,
            and connecting simpler than ever.
          </p>
          <div className="mt-5 flex gap-3">
            <Button className="rounded-full bg-blue-600 px-5 hover:bg-blue-700">Read Our Story</Button>
            <Button variant="outline" className="rounded-full px-5">
              We Are Hiring!
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          {photos.map((src, i) => (
            <img
              key={i}
              src={src}
              alt="Team"
              className={`rounded-xl object-cover ${i === 0 ? "col-span-2 h-32" : "h-24"}`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}