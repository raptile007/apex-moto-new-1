"use client"

import { motion, useInView, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { useRef, useEffect, useState } from "react"
import { BadgeCheck, Globe, Package } from "lucide-react"

function useCounter(to: number, inView: boolean, duration = 1800) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = to / (duration / 16)
    const frame = () => {
      start = Math.min(start + step, to)
      setCount(Math.round(start))
      if (start < to) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [inView, to, duration])
  return count
}

// GTA6-style word-by-word reveal
function WordReveal({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-5%" })
  return (
    <span ref={ref} className={className}>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

const BRANDS = ["ROYAL ENFIELD", "KTM", "HONDA", "BAJAJ", "YAMAHA", "TRIUMPH", "DUCATI", "BMW", "APRILIA", "HUSQVARNA"]

const TRUST_BADGES = [
  { icon: BadgeCheck, label: "ISO 9001:2015", sub: "Quality Certified" },
  { icon: Globe,      label: "Global Shipping", sub: "170+ Countries" },
  { icon: Package,    label: "OEM Parts Only", sub: "No Aftermarket Fakes" },
]

export function AboutSection() {
  const sectionRef = useRef(null)
  const statsRef = useRef(null)
  const inView = useInView(statsRef, { once: true, margin: "-10%" })

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] })
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"])

  const c1 = useCounter(24, inView, 1200)
  const c2 = useCounter(100, inView, 1600)
  const c3 = useCounter(10000, inView, 2000)
  const c4 = useCounter(15, inView, 1400)

  return (
    <section ref={sectionRef} className="py-24 bg-[#050505] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-24">

          {/* Text Content */}
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-[9px] font-black italic text-apex-orange tracking-[0.5em] uppercase mb-6 block"
            >
              ─── ABOUT APEXMOTO
            </motion.span>

            <h2 className="text-5xl lg:text-7xl font-display font-black italic tracking-tighter uppercase mb-8 leading-[0.95]" style={{ perspective: 1000 }}>
              <WordReveal text="MAKE YOUR DREAM" className="block text-white" />
              <WordReveal text="COME TRUE &" className="block text-white" />
              <WordReveal text="GROW WITH US." className="block text-apex-orange" />
            </h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="space-y-5 text-neutral-400 font-medium text-base max-w-xl leading-relaxed"
            >
              <p>
                From India to the Globe — available 24/7 to guide riders from individuals
                to large wholesalers in selecting the perfect component for their machine.
              </p>
              <p>
                Our inventory covers the full range of Royal Enfield models — Cast Iron STD 350/500cc,
                UCE, EFI, TWINS, J Platform — and extends across KTM, Honda, Bajaj, and more.
              </p>
            </motion.div>

            {/* Animated counters */}
            <motion.div
              ref={statsRef}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-12 grid grid-cols-2 gap-8"
            >
              {[
                { value: c1, suffix: "/7",   label: "Global Support" },
                { value: c2, suffix: "%",    label: "Genuine Parts" },
                { value: c3, suffix: "+",    label: "Orders Fulfilled" },
                { value: c4, suffix: " yrs", label: "In Business" },
              ].map((s) => (
                <div key={s.label} className="group cursor-default">
                  <p className="text-4xl font-display font-black italic text-white mb-1 group-hover:text-apex-orange transition-colors duration-300">
                    {s.value.toLocaleString()}{s.suffix}
                  </p>
                  <p className="text-[9px] font-bold tracking-[0.3em] text-neutral-600 uppercase">{s.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-10 flex flex-wrap gap-3"
            >
              {TRUST_BADGES.map((b) => (
                <div
                  key={b.label}
                  className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.07] rounded-full px-5 py-2.5 hover:border-apex-orange/40 hover:bg-apex-orange/5 transition-all duration-300 cursor-default group"
                >
                  <b.icon className="w-4 h-4 text-apex-orange" />
                  <div>
                    <p className="text-white text-xs font-bold">{b.label}</p>
                    <p className="text-neutral-600 text-[8px] uppercase tracking-wider">{b.sub}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Image — parallax */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/[0.06]">
              <motion.div style={{ y: imageY }} className="absolute inset-[-10%] w-[120%] h-[120%]">
                <Image
                  src="/about-us.jpg"
                  alt="About ApexMoto"
                  fill
                  className="object-cover"
                />
              </motion.div>
              <div className="absolute inset-0 bg-apex-orange/15 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Overlay text */}
              <div className="absolute bottom-10 left-10 z-10">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-7xl font-display font-black italic text-white leading-none mb-1"
                >
                  100%
                </motion.p>
                <p className="text-xl font-display font-black italic text-apex-orange uppercase tracking-tight">
                  GENUINE COMPONENTS
                </p>
              </div>
            </div>

            {/* Glow orbs */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-apex-orange/10 rounded-full blur-[100px]" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-apex-orange/5 rounded-full blur-[80px]" />
          </motion.div>
        </div>

        {/* ── Brands we carry strip ─────────────────────────────── */}
        <div className="border-t border-white/[0.05] pt-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[9px] font-bold text-neutral-700 uppercase tracking-[0.5em] text-center mb-10"
          >
            Brands We Carry
          </motion.p>
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-16 w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            >
              {[...BRANDS, ...BRANDS].map((brand, i) => (
                <span
                  key={i}
                  className="text-2xl md:text-4xl font-display font-black italic text-white/[0.07] hover:text-apex-orange/40 transition-colors duration-500 uppercase tracking-tighter whitespace-nowrap cursor-default"
                >
                  {brand}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
