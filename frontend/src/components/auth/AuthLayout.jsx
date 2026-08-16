import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left Visual Section */}
        <div className="relative hidden overflow-hidden bg-[#003F88] lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0094F6] via-[#0078BD] to-[#00103E]" />

          {/* Decorative shapes */}
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#82DAFE]/20 blur-3xl" />

          <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-[#00103E]/40 blur-3xl" />

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 flex w-full flex-col justify-between p-12 text-white"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                <Trophy size={23} />
              </div>

              <div>
                <p className="text-lg font-bold tracking-tight">
                  SportsFinder
                </p>

                <p className="text-xs text-white/70">
                  Local Sports Partner Finder
                </p>
              </div>
            </div>

            <div className="max-w-lg">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#82DAFE]">
                Find. Connect. Play.
              </p>

              <h1 className="text-5xl font-bold leading-tight">
                Find people nearby who are ready to play.
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-white/75">
                Discover players, choose your favorite games, and connect with
                people around your locality for your next game.
              </p>
            </div>

            <p className="text-sm text-white/50">
              Local Sports & Indoor Games Partner Finder Platform
            </p>
          </motion.div>
        </div>

        {/* Right Form Section */}
        <div className="flex items-center justify-center px-5 py-10 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full max-w-md"
          >
            <div className="mb-8 lg:hidden">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#0078BD] text-white">
                <Trophy size={22} />
              </div>

              <h2 className="text-2xl font-bold text-slate-900">
                SportsFinder
              </h2>
            </div>

            <div className="mb-7">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                {title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {subtitle}
              </p>
            </div>

            {children}
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default AuthLayout;