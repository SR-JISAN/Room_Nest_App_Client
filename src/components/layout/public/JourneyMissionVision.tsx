"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Compass,
  Eye,
  Heart,
  House,
  Milestone,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const journey = [
  {
    step: "01",
    label: "Our beginning",
    title: "A better way to find home",
    description:
      "We believe finding a place to live should feel simple and welcoming. That belief inspires the Room Nest experience.",
    icon: Sparkles,
  },
  {
    step: "02",
    label: "Our purpose",
    title: "Connecting people and places",
    description:
      "We bring property seekers and property owners together through a more accessible and thoughtful rental experience.",
    icon: Users,
  },
  {
    step: "03",
    label: "Our ambition",
    title: "Making every space matter",
    description:
      "We want to make the journey of finding a home more convenient, transparent, and rewarding for everyone.",
    icon: Milestone,
  },
];

const principles = [
  {
    label: "OUR MISSION",
    title: "Making your search for home simpler.",
    description:
      "Our mission is to simplify property discovery by helping renters and property owners connect through a user-friendly platform.",
    icon: Target,
    points: [
      "Simplify the property search experience",
      "Encourage clear and transparent listings",
      "Make finding a suitable space easier",
    ],
  },
  {
    label: "OUR VISION",
    title: "A trusted place for every new beginning.",
    description:
      "We envision a connected rental experience where people can discover suitable places with greater confidence and ease.",
    icon: Eye,
    points: [
      "Build stronger connections between people",
      "Encourage trust throughout the rental journey",
      "Help everyone feel closer to finding home",
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

export default function JourneyMissionVision() {
  const shouldReduceMotion = useReducedMotion();

  const reveal = shouldReduceMotion
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.15 },
      };

  return (
    <section
      aria-labelledby="journey-heading"
      className="relative isolate overflow-hidden bg-white py-16 text-[#0f1f17] sm:py-20 lg:py-24"
    >
      {/* Soft brand atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-40 top-20 size-80 rounded-full bg-emerald-100/60 blur-[100px]" />
        <div className="absolute -right-40 top-[35%] size-96 rounded-full bg-lime-100/50 blur-[110px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#dce8de] to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Intro */}
        <motion.div
          {...reveal}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: shouldReduceMotion ? 0 : 0.12,
              },
            },
          }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#dce8de] bg-[#f4f8f4] px-4 py-2 text-xs font-semibold text-[#31543b] sm:text-sm">
              <Compass className="size-4" />
              The heart of Room Nest
            </span>
          </motion.div>

          <motion.h2
            id="journey-heading"
            variants={fadeUp}
            className="mt-6 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
          >
            More than a place to stay.
            <span className="mt-1 block text-[#527b40]">
              A place to belong.
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#647067] sm:text-base sm:leading-8"
          >
            Every home represents a new possibility. At Room Nest, we are
            building a more thoughtful way to discover spaces, connect with
            people, and take the next step toward feeling at home.
          </motion.p>
        </motion.div>

        {/* Journey */}
        <div className="mt-14 sm:mt-18 lg:mt-20">
          <div className="mb-8 flex items-center gap-3 sm:mb-10">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-[#dce8de] bg-[#f2f7f1]">
              <Milestone className="size-5 text-[#315b3b]" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#527b40]">
                Our journey
              </p>
              <h3 className="mt-1 text-lg font-bold tracking-tight sm:text-2xl">
                A purpose that moves us forward.
              </h3>
            </div>
          </div>

          <div className="relative">
            {/* Responsive timeline connector */}
            <div
              aria-hidden="true"
              className="absolute bottom-8 left-4.75 top-8 w-px bg-linear-to-b from-[#9ab88c] via-[#cddbcc] to-transparent md:bottom-auto md:left-0 md:right-0 md:top-6 md:h-px md:w-auto"
            />

            <div className="grid gap-5 md:grid-cols-3 md:gap-5 lg:gap-7">
              {journey.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.article
                    key={item.step}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      duration: 0.5,
                      delay: shouldReduceMotion ? 0 : index * 0.12,
                    }}
                    className="relative grid grid-cols-[40px_minmax(0,1fr)] gap-3 md:block"
                  >
                    <div className="relative z-10 flex size-10 items-center justify-center rounded-full border border-[#cfdfca] bg-white text-[#315b3b] shadow-sm md:mb-7">
                      <Icon className="size-4" />
                    </div>

                    <div className="group flex h-full min-w-0 flex-col rounded-2xl border border-[#e5ebe5] bg-[#f8faf8] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#c8dac3] hover:bg-[#f3f8f2] hover:shadow-lg hover:shadow-[#173521]/4 sm:p-6">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-[0.13em] text-[#527b40]">
                          {item.label}
                        </span>
                        <span className="text-sm font-semibold text-[#a2afa3]">
                          {item.step}
                        </span>
                      </div>

                      <h4 className="mt-4 text-lg font-bold leading-snug tracking-tight text-[#14251a] sm:text-xl">
                        {item.title}
                      </h4>

                      <p className="mt-3 flex-1 text-sm leading-7 text-[#647067]">
                        {item.description}
                      </p>

                      <div className="mt-5 flex items-center gap-2 border-t border-[#e5ebe5] pt-4 text-xs font-medium text-[#647067]">
                        <span className="size-1.5 rounded-full bg-[#71965c]" />
                        The Room Nest story
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="mt-16 grid gap-5 sm:mt-20 lg:grid-cols-2 lg:gap-7">
          {principles.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.label}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.55,
                  delay: shouldReduceMotion ? 0 : index * 0.12,
                }}
                className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-[#e1e9df] bg-[#f5f8f4] p-5 transition-all duration-300 hover:border-[#c8dac3] hover:shadow-xl hover:shadow-[#173521]/5 sm:p-7 lg:p-8"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[#dcebd5]/50 blur-3xl transition-colors duration-500 group-hover:bg-[#d1e7c6]/70"
                />

                <div className="relative flex items-center justify-between gap-4">
                  <span className="text-xs font-bold tracking-[0.19em] text-[#527b40]">
                    {item.label}
                  </span>

                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-[#d9e6d4] bg-white text-[#315b3b] shadow-sm transition-transform duration-300 group-hover:scale-105">
                    <Icon className="size-5" />
                  </div>
                </div>

                <h3 className="relative mt-6 max-w-md text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                  {item.title}
                </h3>

                <p className="relative mt-4 text-sm leading-7 text-[#647067] sm:text-base sm:leading-8">
                  {item.description}
                </p>

                <div className="relative mt-7 space-y-4">
                  {item.points.map((point) => (
                    <div
                      key={point}
                      className="flex items-start gap-3 text-sm text-[#34473a]"
                    >
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#e2eddd]">
                        <Check className="size-3 text-[#315b3b]" />
                      </span>
                      <span className="min-w-0 leading-6">{point}</span>
                    </div>
                  ))}
                </div>

                <div className="relative mt-7 h-px bg-linear-to-r from-[#b9cfb0] via-[#dfe8dc] to-transparent" />

                <div className="relative mt-5 flex items-center gap-2 text-sm font-medium text-[#52705a]">
                  {index === 0 ? (
                    <Heart className="size-4 shrink-0" />
                  ) : (
                    <House className="size-4 shrink-0" />
                  )}
                  <span>
                    {index === 0
                      ? "What drives us every day"
                      : "Where we want to go"}
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Closing CTA */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.55 }}
          className="relative mt-10 overflow-hidden rounded-3xl bg-[#0f1f17] p-6 text-white sm:mt-14 sm:p-9 lg:flex lg:items-center lg:justify-between lg:gap-8 lg:p-10"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-emerald-400/12 blur-3xl"
          />

          <div className="relative max-w-2xl">
            <div className="flex items-center gap-2 text-sm font-semibold text-lime-300">
              <ShieldCheck className="size-4" />A better way to find your next
              home
            </div>

            <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Your next chapter starts here.
            </h3>

            <p className="mt-3 max-w-xl text-sm leading-7 text-white/65">
              Discover spaces, explore possibilities, and take your next step
              with Room Nest.
            </p>
          </div>

          <div className="relative mt-6 lg:mt-0 lg:shrink-0">
            <Button
              size="lg"
              className="h-12 w-full rounded-xl bg-lime-300 px-5 font-semibold text-[#14251a] hover:bg-lime-200 sm:w-auto"
            >
              <Link className="flex items-end" href="/properties">
                Explore properties
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
