"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Home,
  Search,
  ShieldCheck,
} from "lucide-react";

export default function NotFound() {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 24,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <main className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl sm:h-80 sm:w-80" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-green-400/10 blur-3xl sm:h-96 sm:w-96" />

        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <motion.section
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: shouldReduceMotion ? 0 : 0.12,
            },
          },
        }}
        className="relative z-10 mx-auto w-full max-w-3xl text-center"
      >
        <motion.div
          variants={fadeUp}
          className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-500/20 bg-emerald-500/10 shadow-lg shadow-emerald-900/5 sm:h-24 sm:w-24"
        >
          <motion.div
            animate={
              shouldReduceMotion
                ? undefined
                : { y: [0, -6, 0], rotate: [0, -3, 0] }
            }
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Home
              className="h-10 w-10 text-emerald-600 dark:text-emerald-400 sm:h-12 sm:w-12"
              strokeWidth={1.5}
            />
          </motion.div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">
            Oops! Lost your way?
          </p>

          <h1 className="text-7xl font-black tracking-tighter text-foreground sm:text-8xl md:text-9xl">
            4
            <span className="relative inline-block text-emerald-600 dark:text-emerald-400">
              0
              <span className="absolute inset-0 -z-10 scale-150 rounded-full bg-emerald-500/10 blur-2xl" />
            </span>
            4
          </h1>
        </motion.div>

        <motion.div variants={fadeUp} className="mx-auto mt-5 max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Looks like this nest is empty!
          </h2>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
            The page you are looking for may have moved, been removed, or never
            existed. Let&apos;s help you find your way back home.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
        >
          <Link
            href="/"
            className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#1a3929] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#245239] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            <Home size={18} />
            Back to Home
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

          <Link
            href="/properties"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/50 hover:bg-emerald-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            <Search size={18} />
            Explore Properties
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mx-auto mt-12 flex max-w-md flex-col items-center justify-center gap-3 border-t border-border/70 pt-6 text-muted-foreground sm:flex-row sm:gap-6"
        >
          <div className="flex items-center gap-2 text-xs font-medium sm:text-sm">
            <ShieldCheck
              size={17}
              className="shrink-0 text-emerald-600 dark:text-emerald-400"
            />
            Your trusted rental platform
          </div>

          <span className="hidden h-1 w-1 rounded-full bg-border sm:block" />

          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 sm:text-sm"
          >
            Find your next nest
            <Compass size={15} />
          </Link>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-7">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <ArrowLeft size={16} />
            Go back to previous page
          </button>
        </motion.div>
      </motion.section>
    </main>
  );
}
