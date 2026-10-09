"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  Heart,
  House,
  KeyRound,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "cn";

const stats = [
  { value: "01", label: "A place to call home" },
  { value: "02", label: "People you can trust" },
  { value: "03", label: "A simpler way to find rooms" },
  { value: "04", label: "A community that cares" },
];

const features = [
  {
    number: "01",
    icon: House,
    title: "Find your place",
    description:
      "Explore rooms, apartments, and shared living spaces that fit your lifestyle and everyday needs.",
    color: "bg-emerald-100 text-emerald-800",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Feel more confident",
    description:
      "Discover a more transparent rental experience with property information and verification features.",
    color: "bg-amber-100 text-amber-800",
  },
  {
    number: "03",
    icon: Users,
    title: "Find your people",
    description:
      "Make shared living easier by discovering spaces that bring compatible people together.",
    color: "bg-sky-100 text-sky-800",
  },
];

const values = [
  {
    icon: Heart,
    title: "People first",
    description:
      "Every great living experience starts with understanding the people who call a place home.",
  },
  {
    icon: BadgeCheck,
    title: "Built on trust",
    description:
      "We believe clear information and transparency should be part of every rental journey.",
  },
  {
    icon: Sparkles,
    title: "Always improving",
    description:
      "We keep looking for better ways to make finding and managing a place feel effortless.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0 },
};

const AboutPage = () => {
  const shouldReduceMotion = useReducedMotion();

  const reveal = shouldReduceMotion
    ? {
        hidden: { opacity: 1 },
        visible: { opacity: 1 },
      }
    : fadeUp;

  return (
    <main className="overflow-hidden bg-background text-foreground">
      {/* HERO SECTION */}
      <section className="relative isolate overflow-hidden bg-[#0f1f17] text-white">
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={
              shouldReduceMotion
                ? undefined
                : { x: [0, 25, 0], y: [0, -20, 0], scale: [1, 1.08, 1] }
            }
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -right-32 -top-32 size-105 rounded-full bg-emerald-500/15 blur-[100px] sm:size-150"
          />

          <motion.div
            animate={
              shouldReduceMotion ? undefined : { y: [0, 30, 0], x: [0, -15, 0] }
            }
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -bottom-40 -left-32 size-100 rounded-full bg-lime-400/10 blur-[100px]"
          />

          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        <div className="mx-auto grid min-h-155 max-w-350 items-center gap-14 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-28">
          {/* Hero text */}
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
            className="relative z-10 max-w-2xl"
          >
            <motion.div
              variants={reveal}
              transition={{ duration: 0.7 }}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-emerald-200 backdrop-blur"
            >
              <Sparkles className="size-4" />
              More than just a place to stay
            </motion.div>

            <motion.h1
              variants={reveal}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl font-semibold leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl"
            >
              Every great story starts with a{" "}
              <span className="relative inline-block text-emerald-400">
                place.
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.9,
                    ease: "easeOut",
                  }}
                  className="absolute -bottom-1 left-0 h-1 w-full origin-left rounded-full bg-lime-400 sm:-bottom-2 sm:h-1.5"
                />
              </span>
            </motion.h1>

            <motion.p
              variants={reveal}
              transition={{ duration: 0.7 }}
              className="mt-7 max-w-xl text-base leading-8 text-white/65 sm:text-lg"
            >
              We are building a simpler way to find a room, connect with people,
              and discover a place that feels like home. Welcome to Room Nest.
            </motion.p>

            <motion.div
              variants={reveal}
              transition={{ duration: 0.7 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/properties"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-emerald-400 px-6 py-3 font-semibold text-[#0f1f17] transition-colors hover:bg-emerald-300"
              >
                Explore properties
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#our-story"
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/85 transition-colors hover:bg-white/10"
              >
                Discover our story
                <ArrowDown className="size-4" />
              </a>
            </motion.div>

            <motion.div
              variants={reveal}
              transition={{ duration: 0.7 }}
              className="mt-12 flex items-center gap-3 text-sm text-white/50"
            >
              <span className="flex -space-x-2">
                <span className="flex size-9 items-center justify-center rounded-full border-2 border-[#0f1f17] bg-emerald-200 text-emerald-950">
                  <House className="size-4" />
                </span>
                <span className="flex size-9 items-center justify-center rounded-full border-2 border-[#0f1f17] bg-amber-200 text-amber-950">
                  <Heart className="size-4" />
                </span>
                <span className="flex size-9 items-center justify-center rounded-full border-2 border-[#0f1f17] bg-sky-200 text-sky-950">
                  <Users className="size-4" />
                </span>
              </span>
              Designed around real-life needs
            </motion.div>
          </motion.div>

          {/* Animated visual */}
          <div className="relative mx-auto flex min-h-90 w-full max-w-lg items-center justify-center sm:min-h-115">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-105"
            >
              {/* Main visual */}
              <div className="relative aspect-[4/4.2] overflow-hidden rounded-[2rem] border border-white/10 bg-linear-to-br from-[#294b36] via-[#1b3928] to-[#102319] p-5 shadow-2xl shadow-black/30 sm:rounded-[2.5rem] sm:p-7">
                <div className="absolute -right-16 -top-16 size-64 rounded-full border border-emerald-200/10" />
                <div className="absolute -right-8 -top-8 size-48 rounded-full border border-emerald-200/10" />

                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-100/70">
                      Your next chapter
                    </span>
                    <Sparkles className="size-5 text-lime-300" />
                  </div>

                  {/* Architectural illustration built with CSS */}

                  <div className="relative mx-auto flex w-full min-w-0 flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                    <motion.div
                      animate={
                        shouldReduceMotion
                          ? undefined
                          : { y: [0, -8, 0], rotate: [0, 0.5, 0] }
                      }
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="relative isolate flex aspect-square w-full max-w-[320px] items-center justify-center sm:max-w-95 lg:max-w-105 xl:max-w-115"
                    >
                      {/* Background glow */}
                      <div className="absolute inset-[8%] rounded-full bg-emerald-300/10 blur-2xl" />

                      {/* Illustration canvas */}
                      <div className="absolute inset-[8%]">
                        {/* Roof */}
                        <div className="absolute left-1/2 top-[12%] z-20 size-[42%] -translate-x-1/2 rotate-45 rounded-tl-2xl border-l-[6px] border-t-[6px] border-emerald-200 bg-[#294b36] sm:border-l-8 sm:border-t-8 lg:border-l-10 lg:border-t-10" />

                        {/* House body */}
                        <div className="absolute bottom-[10%] left-1/2 z-10 aspect-[1.12/1] w-[82%] -translate-x-1/2 rounded-t-md border border-emerald-100/20 bg-linear-to-br from-[#e5e8ce] to-[#b7c9a5] shadow-2xl">
                          {/* Left window */}
                          <div className="absolute left-[10%] top-[16%] h-[42%] w-[22%] overflow-hidden rounded-t-full border-2 border-[#6a8e68] bg-sky-200/80 sm:border-[3px] lg:border-4">
                            <div className="absolute left-1/2 top-0 h-full w-[6%] -translate-x-1/2 bg-[#6a8e68]" />
                            <div className="absolute left-0 top-1/2 h-[6%] w-full -translate-y-1/2 bg-[#6a8e68]" />
                          </div>

                          {/* Right window */}
                          <div className="absolute right-[10%] top-[16%] h-[42%] w-[22%] overflow-hidden rounded-t-full border-2 border-[#6a8e68] bg-sky-200/80 sm:border-[3px] lg:border-4">
                            <div className="absolute left-1/2 top-0 h-full w-[6%] -translate-x-1/2 bg-[#6a8e68]" />
                            <div className="absolute left-0 top-1/2 h-[6%] w-full -translate-y-1/2 bg-[#6a8e68]" />
                          </div>

                          {/* Door */}
                          <div className="absolute bottom-0 left-1/2 h-[48%] w-[25%] -translate-x-1/2 rounded-t-lg border-x-2 border-t-2 border-[#6a8e68] bg-[#8aa27d] sm:border-x-[3px] sm:border-t-[3px] lg:border-x-4 lg:border-t-4">
                            <div className="absolute right-[12%] top-1/2 size-1 -translate-y-1/2 rounded-full bg-[#e5e8ce] sm:size-1.5" />
                          </div>
                        </div>

                        {/* Plant */}
                        <div className="absolute bottom-[7%] left-[1%] z-20 scale-75 sm:scale-90 lg:scale-100">
                          <div className="relative mx-auto h-12 w-1 rounded-full bg-emerald-300">
                            <span className="absolute -left-4 top-1 h-5 w-5 -rotate-45 rounded-tl-full bg-emerald-400" />
                            <span className="absolute left-0 top-0 h-5 w-5 rotate-45 rounded-tr-full bg-lime-300" />
                          </div>
                          <div className="h-7 w-10 rounded-b-lg bg-amber-700" />
                        </div>

                        {/* Floating sparkle */}
                        <motion.div
                          animate={
                            shouldReduceMotion
                              ? undefined
                              : { rotate: 360, scale: [1, 1.15, 1] }
                          }
                          transition={{
                            rotate: {
                              duration: 20,
                              repeat: Infinity,
                              ease: "linear",
                            },
                            scale: {
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                            },
                          }}
                          className="absolute right-[1%] top-[16%] z-30 flex size-10 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-lime-300 backdrop-blur sm:size-12 lg:size-14"
                        >
                          <Sparkles className="size-5 sm:size-6 lg:size-7" />
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Floating location card */}
              <motion.div
                animate={shouldReduceMotion ? undefined : { y: [0, -9, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -left-3 top-1/4 flex items-center gap-3 rounded-2xl border border-border/50 bg-background p-3 text-foreground shadow-xl sm:-left-10 sm:p-4"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                  <MapPin className="size-5" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Your next stop
                  </p>
                  <p className="text-sm font-bold">A place to belong</p>
                </div>
              </motion.div>

              {/* Floating trust card */}
              <motion.div
                animate={shouldReduceMotion ? undefined : { y: [0, 8, 0] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -right-2 bottom-24 flex items-center gap-3 rounded-2xl border border-border/50 bg-background p-3 text-foreground shadow-xl sm:-right-8 sm:p-4"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-lime-100 text-lime-800">
                  <ShieldCheck className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-bold">Trust matters</p>
                  <p className="text-xs text-muted-foreground">
                    Better-informed choices
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-transparent via-emerald-300/40 to-transparent" />
      </section>

      {/* OUR STORY */}
      <section
        id="our-story"
        className="scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.13 },
              },
            }}
          >
            <motion.p
              variants={reveal}
              transition={{ duration: 0.6 }}
              className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-400"
            >
              Our story
            </motion.p>

            <motion.h2
              variants={reveal}
              transition={{ duration: 0.7 }}
              className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl"
            >
              Finding a home should feel exciting, not exhausting.
            </motion.h2>

            <motion.p
              variants={reveal}
              transition={{ duration: 0.7 }}
              className="mt-6 text-base leading-8 text-muted-foreground"
            >
              Looking for a room can mean endless searching, unclear
              information, and difficult decisions. Room Nest is designed to
              make that journey easier by bringing property discovery and shared
              living together in one place.
            </motion.p>

            <motion.p
              variants={reveal}
              transition={{ duration: 0.7 }}
              className="mt-4 text-base leading-8 text-muted-foreground"
            >
              Because a home is more than four walls. It is where routines
              begin, friendships grow, and new chapters take shape.
            </motion.p>

            <motion.div
              variants={reveal}
              transition={{ duration: 0.7 }}
              className="mt-8"
            >
              <Link
                href="/properties"
                className="group inline-flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-400"
              >
                Start exploring
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Story cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7 }}
              whileHover={shouldReduceMotion ? undefined : { y: -6 }}
              className="flex min-h-64 flex-col justify-between rounded-3xl bg-[#e7f0e6] p-7 text-[#173c28] dark:bg-[#1a3929] dark:text-emerald-50 sm:mt-12"
            >
              <House className="size-9" />
              <div>
                <p className="text-3xl font-semibold">A place</p>
                <p className="mt-3 leading-7 opacity-75">
                  Spaces that fit your everyday life and your next big move.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              whileHover={shouldReduceMotion ? undefined : { y: -6 }}
              className="flex min-h-64 flex-col justify-between rounded-3xl bg-[#f6efdf] p-7 text-[#574323] dark:bg-[#30291d] dark:text-amber-100"
            >
              <Heart className="size-9" />
              <div>
                <p className="text-3xl font-semibold">A feeling</p>
                <p className="mt-3 leading-7 opacity-75">
                  The comfort of knowing you are moving toward the right place.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* OUR PRINCIPLES */}
      <section className="bg-muted/40 px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={reveal}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-400">
              What drives us
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
              Built around what matters.
            </h2>

            <p className="mt-5 leading-7 text-muted-foreground">
              We believe finding a place to live should start with clarity,
              care, and confidence.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.article
                  key={feature.number}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.65,
                    delay: shouldReduceMotion ? 0 : index * 0.13,
                  }}
                  whileHover={shouldReduceMotion ? undefined : { y: -8 }}
                  className="group rounded-3xl border border-border/70 bg-card p-7 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-emerald-950/5 sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "flex size-14 items-center justify-center rounded-2xl",
                        feature.color,
                      )}
                    >
                      <Icon className="size-7" />
                    </span>

                    <span className="text-sm font-semibold text-muted-foreground/60">
                      {feature.number}
                    </span>
                  </div>

                  <h3 className="mt-8 text-xl font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 leading-7 text-muted-foreground">
                    {feature.description}
                  </p>

                  <div className="mt-7 h-1 w-10 rounded-full bg-emerald-600 transition-all duration-300 group-hover:w-20" />
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* OUR VALUES */}
      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={reveal}
              transition={{ duration: 0.7 }}
            >
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-400">
                Our values
              </p>

              <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Good homes begin with good intentions.
              </h2>

              <p className="mt-6 leading-8 text-muted-foreground">
                The little things matter. From how information is presented to
                how people discover their options, our goal is to make every
                step feel more human.
              </p>
            </motion.div>

            <div className="space-y-4">
              {values.map((value, index) => {
                const Icon = value.icon;

                return (
                  <motion.div
                    key={value.title}
                    initial={shouldReduceMotion ? false : { opacity: 0, x: 25 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.6,
                      delay: shouldReduceMotion ? 0 : index * 0.12,
                    }}
                    className="flex gap-5 rounded-2xl border border-border/70 p-5 transition-colors hover:bg-muted/50 sm:p-6"
                  >
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400">
                      <Icon className="size-6" />
                    </div>

                    <div>
                      <h3 className="font-semibold">{value.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground sm:text-base">
                        {value.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#0f1f17] px-6 py-16 text-center text-white sm:rounded-[2.5rem] sm:px-12 sm:py-20"
        >
          <div className="pointer-events-none absolute -right-20 -top-32 size-80 rounded-full bg-emerald-500/20 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-40 -left-20 size-80 rounded-full bg-lime-400/10 blur-[90px]" />

          <motion.div
            animate={shouldReduceMotion ? undefined : { rotate: [0, 8, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative mx-auto flex size-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-emerald-300"
          >
            <KeyRound className="size-8" />
          </motion.div>

          <h2 className="relative mx-auto mt-7 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Your next chapter could start right here.
          </h2>

          <p className="relative mx-auto mt-5 max-w-xl leading-7 text-white/60 sm:text-lg">
            Explore your options, discover new spaces, and take the next step
            toward a place you can call home.
          </p>

          <div className="relative mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/properties"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-emerald-400 px-7 py-3 font-semibold text-[#0f1f17] transition-colors hover:bg-emerald-300"
            >
              Find your space
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/register"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-7 py-3 font-semibold transition-colors hover:bg-white/10"
            >
              Join Room Nest
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default AboutPage;
