"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, BadgeCheck, Braces, PlayCircle, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const headlineLines = ["Master Programming.", "Build Real Projects.", "Start Your Career."];

const techChips = ["Java", "MERN Stack", "React", "C++", "Python", "AI & ML", "Testing", "Cloud"];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/60 via-background to-background pb-20 pt-28 sm:pt-32">
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

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex w-fit items-center gap-1.5 rounded-full border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm"
          >
            <Sparkles className="size-4 text-gold-deep" aria-hidden />
            Mentor-led training · Small batches of 15
          </motion.p>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-navy sm:text-5xl xl:text-6xl">
            {headlineLines.map((line, lineIndex) => (
              <span key={line} className="block sm:whitespace-nowrap">
                {line.split(" ").map((word, wordIndex) => (
                  <motion.span
                    key={wordIndex}
                    className="inline-block"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 + (lineIndex * 2 + wordIndex) * 0.08 }}
                  >
                    {word}
                    {wordIndex < line.split(" ").length - 1 && <>&nbsp;</>}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            Live online, instructor-led training with hands-on projects, expert
            mentors, and career support from day one — join from anywhere in India.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-6 flex max-w-xl flex-wrap gap-2"
          >
            {techChips.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal"
              >
                {tech}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
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

        {/* Hero creative */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="relative mx-auto w-full max-w-lg lg:max-w-none"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border-4 border-card shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=75"
              alt="Students learning to code together at Axcvia"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-navy/40 via-transparent to-transparent" />
          </div>

          {/* Floating chips */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-4 top-6 flex items-center gap-2.5 rounded-xl border bg-card/95 px-4 py-3 shadow-lg backdrop-blur sm:-left-8"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-teal/10">
              <Braces className="size-4.5 text-teal" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-bold text-navy">Project-First</p>
              <p className="text-xs text-muted-foreground">Real apps, not slides</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-5 left-8 flex items-center gap-2.5 rounded-xl border bg-card/95 px-4 py-3 shadow-lg backdrop-blur"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-gold/15">
              <BadgeCheck className="size-4.5 text-gold-deep" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-bold text-navy">Certified</p>
              <p className="text-xs text-muted-foreground">Capstone-evaluated</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -right-3 bottom-16 flex items-center gap-2.5 rounded-xl border bg-card/95 px-4 py-3 shadow-lg backdrop-blur sm:-right-6"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-teal/10">
              <Users className="size-4.5 text-teal" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-bold text-navy">350+ Students</p>
              <p className="text-xs text-muted-foreground">And growing every batch</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
