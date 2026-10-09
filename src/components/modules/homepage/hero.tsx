"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BedDouble,
  Building2,
  Check,
  Heart,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const floatingTransition = {
  duration: 5,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

export default function HeroBanner() {
  const shouldReduceMotion = useReducedMotion();

  const reveal = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" as const },
    },
  };

  return (
    <section
      className="relative isolate overflow-hidden bg-[#0f1f17] text-white"
      aria-labelledby="hero-heading"
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-[110px]" />
        <div className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-lime-400/10 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.055)_1px,transparent_0)] bg-size-[28px_28px]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[#0f1f17] to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:px-10 lg:pb-24 lg:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8">
          {/* Left content */}
          <motion.div
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
            className="relative z-10 mx-auto w-full max-w-2xl lg:mx-0"
          >
            <motion.div variants={reveal}>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.07] px-3.5 py-2 text-xs font-medium text-emerald-200 sm:text-sm">
                <Sparkles className="size-4 text-lime-300" />
                Find your place. Feel at home.
              </div>
            </motion.div>

            <motion.h1
              id="hero-heading"
              variants={reveal}
              className="mt-7 text-[2.7rem] font-semibold leading-[1.1] tracking-[-0.055em] sm:text-6xl lg:text-[4.35rem]"
            >
              Your next chapter
              <br />
              starts with a{" "}
              <span className="relative inline-block text-lime-300">
                better home.
                <motion.span
                  aria-hidden="true"
                  initial={shouldReduceMotion ? false : { scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="absolute -bottom-1 left-0 h-1 w-full origin-left rounded-full bg-lime-300/70 sm:-bottom-2"
                />
              </span>
            </motion.h1>

            <motion.p
              variants={reveal}
              className="mt-6 max-w-xl text-sm leading-7 text-white/65 sm:text-base sm:leading-8"
            >
              Discover comfortable rooms, trusted properties, and places that
              fit your lifestyle. Your perfect nest is closer than you think.
            </motion.p>

            {/* Primary actions */}
            <motion.div
              variants={reveal}
              className="mt-8 flex flex-col gap-3 min-[420px]:flex-row"
            >
              <Button
                size="lg"
                className="h-12 rounded-xl bg-lime-300 px-6 font-semibold text-[#14251a] hover:bg-lime-200"
              >
                <Link className="flex items-end" href="/properties">
                  <span>Explore properties</span>
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              variants={reveal}
              className="mt-10 flex flex-wrap gap-x-6 gap-y-4 border-t border-white/10 pt-6"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-300/10">
                  <ShieldCheck className="size-5 text-lime-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Trusted listings</p>
                  <p className="mt-0.5 text-xs text-white/50">
                    Confidence in every search
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-300/10">
                  <Heart className="size-5 text-lime-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Made for you</p>
                  <p className="mt-0.5 text-xs text-white/50">
                    Find your ideal space
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right visual */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative mx-auto w-full max-w-135 lg:ml-auto"
          >
            {/* Ambient glow */}
            <div
              aria-hidden="true"
              className="absolute inset-10 rounded-[45%] bg-emerald-400/15 blur-[75px]"
            />

            {/* Main visual panel */}
            <motion.div
              animate={shouldReduceMotion ? undefined : { y: [0, -7, 0] }}
              transition={floatingTransition}
              className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#172c21] p-4 shadow-2xl shadow-black/25 sm:rounded-[32px] sm:p-6"
            >
              {/* Visual header */}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-white/50">YOUR NEXT NEST</p>
                  <h2 className="mt-1 text-lg font-semibold sm:text-xl">
                    Find a place to belong
                  </h2>
                </div>

                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <Building2 className="size-5 text-lime-300" />
                </div>
              </div>

              {/* Abstract architectural illustration */}
              <div className="relative mt-5 flex h-61.25 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-[#284c37] via-[#1b3828] to-[#13271c] sm:h-75">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(135deg,transparent_49.8%,rgba(255,255,255,0.06)_50%,transparent_50.2%)]"
                />

                <motion.div
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : { rotate: [0, 3, 0, -3, 0] }
                  }
                  transition={{ duration: 10, repeat: Infinity }}
                  className="relative flex h-43.75 w-53.75 items-end justify-center rounded-t-[100px] border border-emerald-100/20 bg-linear-to-b from-emerald-200/20 to-emerald-950/30 shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:h-53.75 sm:w-67.5 "
                >
                  <div className="absolute inset-x-7 top-9 bottom-0 rounded-t-[70px] border border-white/15 bg-[#173424]/70" />

                  <div className="absolute left-1/2 top-14 h-20 w-14 -translate-x-1/2 rounded-t-full border border-lime-100/25 bg-linear-to-b from-lime-200/30 to-emerald-950/40 sm:h-28 sm:w-20">
                    <div className="absolute inset-x-0 top-1/2 h-px bg-white/20" />
                    <div className="absolute inset-y-0 left-1/2 w-px bg-white/20" />
                  </div>

                  <div className="absolute bottom-0 left-4 h-12 w-8 rounded-t-full border border-emerald-100/10 bg-emerald-200/10 sm:h-16 sm:w-10" />
                  <div className="absolute bottom-0 right-4 h-12 w-8 rounded-t-full border border-emerald-100/10 bg-emerald-200/10 sm:h-16 sm:w-10" />

                  <div className="relative z-10 h-16 w-12 rounded-t-full border border-white/20 bg-[#0f1f17]/80 sm:h-20 sm:w-14" />
                </motion.div>

                {/* Decorative circles */}
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : { y: [0, -8, 0], rotate: [0, 10, 0] }
                  }
                  transition={{ duration: 6, repeat: Infinity }}
                  className="absolute left-5 top-6 flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md sm:left-8 sm:top-8 sm:size-14"
                >
                  <BedDouble className="size-6 text-lime-200" />
                </motion.div>

                <motion.div
                  animate={shouldReduceMotion ? undefined : { y: [0, 8, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    delay: 0.5,
                  }}
                  className="absolute bottom-6 right-5 flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md sm:bottom-8 sm:right-8 sm:size-14"
                >
                  <Sparkles className="size-5 text-lime-200 sm:size-6" />
                </motion.div>

                <div className="absolute bottom-3 left-3 rounded-lg bg-black/20 px-3 py-1.5 text-[10px] text-white/65 backdrop-blur sm:bottom-4 sm:left-4 sm:text-xs">
                  A space that feels like yours
                </div>
              </div>

              {/* Property preview */}
              <div className="mt-4 rounded-2xl border border-white/10 bg-[#0f1f17]/80 p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-lime-300 sm:text-xs">
                        Your search starts here
                      </span>
                      <BadgeCheck className="size-4 text-lime-300" />
                    </div>
                    <p className="mt-2 text-base font-semibold sm:text-lg">
                      A room that fits your life
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-white/50 sm:text-sm">
                      <MapPin className="size-3.5 shrink-0" />
                      Explore places around you
                    </p>
                  </div>

                  <Link
                    href="/properties"
                    aria-label="Browse available properties"
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-lime-300 text-[#14251a] transition-transform hover:scale-105"
                  >
                    <ArrowUpRight className="size-5" />
                  </Link>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
                  <div>
                    <BedDouble className="size-4 text-lime-300" />
                    <p className="mt-2 text-xs font-medium sm:text-sm">
                      Cozy rooms
                    </p>
                  </div>
                  <div>
                    <Users className="size-4 text-lime-300" />
                    <p className="mt-2 text-xs font-medium sm:text-sm">
                      Shared spaces
                    </p>
                  </div>
                  <div>
                    <Check className="size-4 text-lime-300" />
                    <p className="mt-2 text-xs font-medium sm:text-sm">
                      Verified homes
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating search card */}
            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : { y: [0, -8, 0], rotate: [0, 1, 0] }
              }
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -left-2 top-[27%] hidden max-w-[190px] rounded-2xl border border-white/15 bg-[#20392a]/95 p-3 shadow-xl backdrop-blur-xl sm:block sm:-left-7 sm:p-4"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-lime-300/15">
                  <Search className="size-4 text-lime-300" />
                </div>
                <div>
                  <p className="text-xs font-semibold">Easy discovery</p>
                  <p className="mt-1 text-[10px] text-white/50">
                    Your next home awaits
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Floating trust card */}
            <motion.div
              animate={shouldReduceMotion ? undefined : { y: [0, 7, 0] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -right-1 bottom-[21%] hidden rounded-2xl border border-white/15 bg-[#20392a]/95 p-3 shadow-xl backdrop-blur-xl min-[420px]:block sm:-right-5 sm:p-4"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-full bg-lime-300/15">
                  <ShieldCheck className="size-5 text-lime-300" />
                </div>
                <div>
                  <p className="text-xs font-semibold">Feel at home</p>
                  <p className="mt-1 flex items-center gap-1 text-[10px] text-white/50">
                    <Check className="size-3 text-lime-300" />
                    Search with confidence
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={shouldReduceMotion ? undefined : { y: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="mt-5 flex items-center justify-center gap-2 text-xs text-white/40 sm:text-sm"
            >
              <ArrowDown className="size-4" />
              Find your next nest
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
