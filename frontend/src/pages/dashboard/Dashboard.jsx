import { motion } from "framer-motion";
import {
  MapPin,
  Trophy,
  Users,
  Gamepad2,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";

const Dashboard = () => {
  
  const { user } = useAuth();
  console.log("DASHBOARD USER:", user);
  console.log("PREFERRED GAMES:", user?.preferredGames);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* Welcome */}

      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="
          overflow-hidden rounded-2xl
          bg-gradient-to-r
          from-[#0078BD]
          to-[#003F88]
          p-6 text-white
          sm:p-8
        "
      >
        <p className="text-sm font-medium text-white/70">
          Welcome back
        </p>

        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
          {user?.name || "Player"} 👋
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">
          Find players around you and connect with people who
          enjoy the same games.
        </p>

        {user?.location && (
          <div className="mt-5 flex items-center gap-2 text-sm text-white/80">
            <MapPin size={16} />
            {user.location}
          </div>
        )}
      </motion.section>

      {/* Quick Stats */}

      <section className="mt-6 grid gap-4 sm:grid-cols-3">

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-slate-200 bg-white p-5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0078BD]/10 text-[#0078BD]">
            <Gamepad2 size={19} />
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Preferred Games
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {user?.preferredGames?.length || 0}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border border-slate-200 bg-white p-5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0078BD]/10 text-[#0078BD]">
            <Trophy size={19} />
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Skill Level
          </p>

          <p className="mt-1 text-xl font-bold text-slate-900">
            {user?.skillLevel || "Beginner"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-slate-200 bg-white p-5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0078BD]/10 text-[#0078BD]">
            <Users size={19} />
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Find Players
          </p>

          <p className="mt-1 text-xl font-bold text-slate-900">
            Nearby
          </p>
        </motion.div>

      </section>

      {/* Preferred Games */}

      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Your preferred games
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Games you've selected for finding partners.
          </p>
        </div>

        {user?.preferredGames?.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {user.preferredGames.map((game, index) => (
              <motion.div
                key={game._id}
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.08,
                }}
                className="
                  overflow-hidden rounded-xl
                  border border-slate-200
                  bg-white
                  shadow-sm
                "
              >
                <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-slate-900">
                    {game.name}
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    {game.type}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <Gamepad2
              size={28}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 text-sm text-slate-500">
              No preferred games selected yet.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;