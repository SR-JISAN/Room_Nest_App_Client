"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  Home,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Send the error to your monitoring service if configured.
    console.error("Room Nest Global Error:", error);
  }, [error]);

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <html lang="en">
      <body className="m-0 min-h-screen bg-[#f8faf9] font-sans text-[#14251b] antialiased dark:bg-[#0b1510] dark:text-[#f0f7f2]">
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
          {/* Background decoration */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-red-500/[0.07] blur-3xl sm:h-96 sm:w-96" />
            <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl sm:h-96 sm:w-96" />

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
            className="relative z-10 mx-auto w-full max-w-2xl text-center"
          >
            {/* Error icon */}
            <motion.div
              variants={fadeUp}
              className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/8 shadow-lg shadow-red-950/5 sm:h-24 sm:w-24"
            >
              <motion.div
                animate={shouldReduceMotion ? undefined : { y: [0, -4, 0] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <AlertTriangle
                  size={42}
                  strokeWidth={1.5}
                  className="text-red-600 dark:text-red-400 sm:h-12 sm:w-12"
                />
              </motion.div>
            </motion.div>

            {/* Error heading */}
            <motion.div variants={fadeUp}>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-red-600 dark:text-red-400 sm:text-sm">
                Something went wrong
              </p>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
                We&apos;re having
                <span className="mt-2 block text-emerald-700 dark:text-emerald-400">
                  a little trouble.
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.div variants={fadeUp} className="mx-auto mt-5 max-w-lg">
              <p className="text-sm leading-7 text-[#617168] dark:text-[#a7b9ad] sm:text-base">
                Something unexpected happened while loading this page. Your nest
                is still here! Please try again in a moment.
              </p>
            </motion.div>

            {/* Actions */}
            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"
            >
              <button
                type="button"
                onClick={() => reset()}
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#1a3929] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#245239] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                <RefreshCw
                  size={17}
                  className="transition-transform duration-500 group-hover:rotate-180"
                />
                Try Again
              </button>

              <button
                type="button"
                onClick={() => {
                  window.location.href = "/";
                }}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#dce5df] bg-white px-6 py-3 text-sm font-semibold text-[#1a3929] transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/50 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08]"
              >
                <Home size={17} />
                Back to Home
              </button>
            </motion.div>

            {/* Trust message */}
            <motion.div
              variants={fadeUp}
              className="mx-auto mt-12 flex max-w-md items-center justify-center gap-2 border-t border-[#dce5df] pt-6 text-xs text-[#617168] dark:border-white/10 dark:text-[#a7b9ad] sm:text-sm"
            >
              <ShieldCheck
                size={17}
                className="shrink-0 text-emerald-600 dark:text-emerald-400"
              />
              <span>Room Nest — your trusted rental platform</span>
            </motion.div>

            {/* Error reference for support */}
            {error.digest && (
              <motion.p
                variants={fadeUp}
                className="mt-4 text-xs text-[#89978e] dark:text-[#788b7e]"
              >
                Reference ID: {error.digest}
              </motion.p>
            )}
          </motion.section>
        </main>
      </body>
    </html>
  );
}
