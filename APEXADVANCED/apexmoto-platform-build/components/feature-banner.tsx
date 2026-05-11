"use client"

import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { useRef } from "react"

// GTA6-style letter-by-letter text reveal
function RevealText({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-10%" })
  return (
    <span ref={ref} className={`inline-block ${className}`} aria-label={text}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 60, rotateX: -90 }}
          animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.025,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  )
}

export function FeatureBanner() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const bgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"])
  const textY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"])
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1.0, 1.1])

  return (
    <section
      ref={ref}
      className="relative min-h-[85vh] flex items-center overflow-hidden bg-black"
    >
      {/* Parallax background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0">
        <motion.div style={{ scale: imgScale }} className="absolute inset-0">
          <Image
            src="/feature-banner.jpg"
            alt="Performance Air Filter"
            fill
            className="object-cover opacity-35"
          />
        </motion.div>
        {/* Cinematic gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/30" />
      </motion.div>

      {/* Left vertical accent line */}
      <motion.div
        className="absolute left-0 top-0 w-[2px] bg-apex-orange"
        initial={{ height: 0 }}
        whileInView={{ height: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Main content */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 w-full"
      >
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[9px] font-bold text-apex-orange tracking-[0.5em] uppercase mb-8 block"
          >
            ─── ENGINE OPTIMIZATION
          </motion.span>

          {/* GTA6-style char-by-char title */}
          <h2 className="text-5xl md:text-7xl font-display font-black italic tracking-tighter text-white uppercase mb-8 leading-none" style={{ perspective: 1000 }}>
            <RevealText text="SUPERIOR" delay={0.1} className="block" />
            <RevealText text="FILTRATION." delay={0.3} className="block text-apex-orange" />
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-neutral-400 text-lg max-w-lg leading-relaxed mb-10"
          >
            We don&apos;t just sell parts; we engineer tactical advantages. Every component in our catalog is rigorously track-tested to ensure maximum yield under extreme conditions. Welcome to the apex of performance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#products"
              className="group relative inline-flex items-center gap-3 bg-white text-black hover:bg-apex-orange hover:text-white font-display font-black italic uppercase tracking-wider px-10 h-14 transition-all duration-300 overflow-hidden hover:shadow-[0_0_40px_rgba(255,77,0,0.4)]"
            >
              <span className="relative z-10 flex items-center gap-3">
                Explore Inventory
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </a>

            <a
              href="/himalayan"
              className="group inline-flex items-center gap-3 border border-white/20 hover:border-apex-orange/70 text-white font-display font-bold italic uppercase tracking-wider px-8 h-14 transition-all duration-300"
            >
              Himalayan Range
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating spec chips — right side */}
      <div className="absolute right-8 md:right-20 top-1/2 -translate-y-1/2 z-10 hidden lg:flex flex-col gap-4">
        {[
          { label: "FILTRATION EFFICIENCY", value: "99.8%" },
          { label: "OEM COMPATIBLE",        value: "100%" },
          { label: "LIFESPAN",              value: "50,000 km" },
        ].map((chip, i) => (
          <motion.div
            key={chip.label}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + i * 0.12 }}
            whileHover={{ x: -6, borderColor: "rgba(255,77,0,0.5)" }}
            className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 transition-all duration-300 cursor-default"
          >
            <p className="text-[8px] text-neutral-600 uppercase tracking-[0.3em] mb-1">{chip.label}</p>
            <p className="text-2xl font-display font-black italic text-white">{chip.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Animated rotating badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute right-20 bottom-16 hidden xl:flex flex-col items-center justify-center w-44 h-44"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-dashed border-apex-orange/40 rounded-full animate-[spin_18s_linear_infinite]" />
          <div className="absolute inset-3 border border-white/10 rounded-full" />
          <div className="text-center z-10">
            <p className="text-[7px] font-black tracking-[0.3em] text-neutral-500 uppercase italic mb-1">CERTIFIED</p>
            <p className="text-lg font-display font-black italic text-white uppercase leading-tight">EXCELLENT<br />QUALITY</p>
            <p className="text-[7px] font-black tracking-[0.3em] text-neutral-500 uppercase italic mt-1">ENGINEERED SPECS</p>
          </div>
        </div>
      </motion.div>

      {/* Ghost text watermark */}
      <div className="absolute -bottom-16 right-0 pointer-events-none select-none opacity-[0.04]">
        <h3 className="text-[22rem] font-display font-black italic text-white leading-none">AIR</h3>
      </div>
    </section>
  )
}
