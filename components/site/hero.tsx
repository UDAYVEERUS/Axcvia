"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const headline = "Master Programming. Build Real Projects. Start Your Career.";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/60 via-background to-background pb-20 pt-36 sm:pt-44">
      {/* Animated gradient blobs */}
      <motion.div
        aria-hidden
        className="absolute -left-32 -top-32 size-96 rounded-full bg-teal/15 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -right-24 top-24 size-80 rounded-full bg-gold/15 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-fit rounded-full border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm"
        >
          🎓 Mentor-led training · Small batches of 15 · New batches every month
        </motion.p>

        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-navy sm:text-6xl">
          {headline.split(" ").map((word, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.06 }}
            >
              {word}&nbsp;
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
        >
          Instructor-led classroom and online training in Java, MERN Stack, React,
          C++, Python, AI & Machine Learning, Testing, and Cloud — hands-on
          projects, expert mentors, and career support from day one.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button asChild size="lg" className="bg-teal px-7 text-white hover:bg-teal/90">
            <Link href="/courses">
              Explore Courses <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="px-7">
            <Link href="/contact">
              <PlayCircle className="size-4 text-teal" aria-hidden /> Book a Free Demo Class
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
