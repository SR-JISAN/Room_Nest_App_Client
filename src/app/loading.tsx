"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
          className="relative"
        >
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-2xl bg-[#1a3929]"
          />

          <Image
            src="/logo.png"
            alt="Room Nest"
            width={45}
            height={45}
            priority
          />
        </motion.div>

        {/* Brand */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-6 text-2xl font-bold tracking-tight"
        >
          Room <span className="text-[#1a3929]">Nest</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-2 text-sm text-muted-foreground"
        >
          Find your trusted nest
        </motion.p>

        {/* Loading dots */}
        <div className="mt-6 flex items-center gap-2">
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              animate={{
                y: [0, -6, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: dot * 0.15,
                ease: "easeInOut",
              }}
              className="h-2 w-2 rounded-full bg-[#1a3929]"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
