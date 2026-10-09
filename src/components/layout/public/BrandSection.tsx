"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Heart,
  House,
  KeyRound,
  Leaf,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const features = [
  {
    icon: ShieldCheck,
    number: "01",
    title: "Trust comes first",
    description:
      "Explore property listings with a focus on transparency and confidence.",
  },
  {
    icon: Heart,
    number: "02",
    title: "Feel at home",
    description:
      "Find a room or shared space that fits your needs and lifestyle.",
  },
  {
    icon: Users,
    number: "03",
    title: "Made for everyone",
    description:
      "A simpler experience for people searching for homes and property owners.",
  },
];

export default function BrandSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#0f2f1f] py-20 text-white sm:py-24 lg:py-28">
      {/* Background decoration */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 size-80 rounded-full bg-emerald-500/[0.07] blur-[100px]" />
        <div className="absolute -right-40 bottom-0 size-96 rounded-full bg-lime-300/6 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.035)_1px,transparent_0)] bg-size-[30px_30px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Brand introduction */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/[0.07] px-3.5 py-2 text-xs font-medium text-lime-200 sm:text-sm">
              <Sparkles className="size-4" />
              More than just a place to stay
            </div>

            <h2 className="mt-6 max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Every great story begins with a{" "}
              <span className="text-lime-300">place to call home.</span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
              At Room Nest, we believe finding a home should feel exciting, not
              overwhelming. We bring property seekers and property owners
              together through a simpler, more thoughtful experience.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Button className="h-12 rounded-xl bg-lime-300 px-5 font-semibold text-[#14251a] hover:bg-lime-200">
                <Link className="flex items-end" href="/about">
                  Discover our story
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>

              <div className="flex items-center gap-2 text-sm text-white/60">
                <BadgeCheck className="size-5 text-lime-300" />A more thoughtful
                way to find a home
              </div>
            </div>
          </motion.div>

          {/* Brand visual */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="relative mx-auto w-full max-w-lg"
          >
            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#14291d] p-6 sm:p-9">
              <div className="absolute -right-16 -top-16 size-48 rounded-full border border-lime-200/10" />
              <div className="absolute -right-8 -top-8 size-32 rounded-full border border-lime-200/10" />

              <motion.div
                animate={shouldReduceMotion ? undefined : { y: [0, -7, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative flex min-h-64 flex-col items-center justify-center rounded-2xl border border-white/10 bg-linear-to-br from-[#244832] via-[#193625] to-[#102219] px-4 py-10 text-center sm:min-h-72"
              >
                <div className="flex size-20 items-center justify-center rounded-[26px] border border-lime-200/20 bg-lime-300/10 shadow-lg shadow-black/10">
                  <House className="size-10 text-lime-300" strokeWidth={1.5} />
                </div>

                <p className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Room <span className="text-lime-300">Nest</span>
                </p>

                <p className="mt-3 text-sm text-white/55">
                  Find your space. Build your story.
                </p>

                <div className="mt-6 flex items-center gap-2 rounded-full border border-white/10 bg-black/10 px-4 py-2 text-xs text-white/70">
                  <Leaf className="size-4 text-lime-300" />A place for every new
                  beginning
                </div>
              </motion.div>

              {/* Bottom brand principles */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
                  <KeyRound className="size-5 text-lime-300" />
                  <p className="mt-3 text-sm font-semibold">Find your key</p>
                  <p className="mt-1 text-xs leading-5 text-white/45">
                    Discover a space that suits you.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
                  <Heart className="size-5 text-lime-300" />
                  <p className="mt-3 text-sm font-semibold">Feel the comfort</p>
                  <p className="mt-1 text-xs leading-5 text-white/45">
                    Make a place your own.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature cards */}
        <div className="mt-20 border-t border-white/10 pt-12 sm:mt-24 sm:pt-16">
          <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">
                The Room Nest difference
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                Built around what matters.
              </h3>
            </div>

            <p className="max-w-md text-sm leading-6 text-white/50">
              Thoughtful features and a smoother journey, from discovering a
              property to finding your next home.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.article
                  key={feature.number}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.55,
                    delay: shouldReduceMotion ? 0 : index * 0.12,
                  }}
                  whileHover={shouldReduceMotion ? undefined : { y: -5 }}
                  className="group rounded-2xl border border-white/10 bg-white/2.5 p-6 transition-colors duration-300 hover:border-lime-300/25 hover:bg-[#172c20] sm:p-7"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex size-12 items-center justify-center rounded-2xl border border-lime-300/15 bg-lime-300/8 transition-colors group-hover:bg-lime-300/15">
                      <Icon className="size-6 text-lime-300" />
                    </div>

                    <span className="text-sm font-medium text-white/20">
                      {feature.number}
                    </span>
                  </div>

                  <h4 className="mt-6 text-lg font-semibold">
                    {feature.title}
                  </h4>

                  <p className="mt-3 text-sm leading-7 text-white/55">
                    {feature.description}
                  </p>

                  <div className="mt-5 h-px w-10 bg-lime-300/50 transition-all duration-300 group-hover:w-16" />
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
