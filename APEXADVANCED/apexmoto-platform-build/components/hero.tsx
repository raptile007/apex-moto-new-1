"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Zap, Shield, Trophy, Package2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRef, useState, useEffect } from "react"

// Animated counter hook
function useCounter(to: number, inView: boolean, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = to / (duration / 16);
    const frame = () => {
      start = Math.min(start + step, to);
      setCount(Math.round(start));
      if (start < to) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [inView, to, duration]);
  return count;
}

const STATS = [
  { icon: Zap,     value: 0.1,  suffix: "s",   label: "Response Time",  decimals: 1 },
  { icon: Shield,  value: 5,    suffix: "yr",  label: "Warranty",       decimals: 0 },
  { icon: Trophy,  value: 100,  suffix: "+",   label: "Race Podiums",   decimals: 0 },
  { icon: Package2,value: 10000,suffix: "+",   label: "Orders Shipped", decimals: 0 },
];

const TICKER_ITEMS = [
  "KTM RC 390", "HIMALAYAN 450", "HONDA CB300R", "BAJAJ DOMINAR 400",
  "TRIUMPH STREET TRIPLE", "YAMAHA MT-09", "DUCATI SCRAMBLER", "BMW G310R",
];

export function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [statsInView, setStatsInView] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  useEffect(() => {
    setIsMounted(true)
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsInView(true) },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const c0 = useCounter(0, statsInView, 1200);   // response — shown differently
  const c1 = useCounter(STATS[1].value, statsInView, 1400);
  const c2 = useCounter(STATS[2].value, statsInView, 1600);
  const c3 = useCounter(STATS[3].value, statsInView, 2000);
  const counters = [c0, c1, c2, c3];

  return (
    <section ref={containerRef} className="relative min-h-[95vh] flex items-center overflow-hidden bg-background">
      {/* Background */}
      {isMounted && (
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.jpg"
            alt="Premium Motorcycle Parts"
            fill
            className="object-cover opacity-50 scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </motion.div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 w-full">
        <div className="max-w-3xl space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-apex-orange/10 border border-apex-orange/25 text-apex-orange text-[10px] font-black uppercase tracking-[0.2em] mb-6 hover:bg-apex-orange/20 transition-colors cursor-default"
            >
              <Trophy className="w-3 h-3" />
              India's Premium Motorcycle Parts Platform
            </motion.div>

            <h1 className="text-6xl lg:text-[7rem] font-display font-bold leading-[0.85] tracking-tighter text-foreground uppercase italic">
              Level Up
              <br />
              <motion.span
                className="text-apex-orange"
                style={{ filter: "drop-shadow(0 0 40px rgba(255,77,0,0.35))" }}
                animate={{ filter: ["drop-shadow(0 0 20px rgba(255,77,0,0.2))", "drop-shadow(0 0 50px rgba(255,77,0,0.5))", "drop-shadow(0 0 20px rgba(255,77,0,0.2))"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                Performance
              </motion.span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-400 max-w-xl font-medium leading-relaxed"
          >
            We engineer tactical advantages for the modern rider. Explore our curated selection of high-performance parts, built for extreme conditions and relentless endurance. It&apos;s time to upgrade your arsenal.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            {/* Primary CTA */}
            <Button
              size="lg"
              className="h-14 px-10 bg-apex-orange hover:bg-apex-orange/90 text-white rounded-none font-display font-black italic text-base tracking-tighter group overflow-hidden relative hover:shadow-[0_0_40px_rgba(255,77,0,0.4)] transition-all duration-300"
              asChild
            >
              <a href="#products">
                <span className="relative z-10 flex items-center gap-2">
                  SHOP COLLECTION
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
                {/* Shimmer */}
                <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              </a>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-14 px-10 border-white/15 hover:bg-white/5 hover:border-apex-orange/50 text-foreground rounded-none font-display font-bold italic text-base tracking-tighter transition-all duration-300"
              asChild
            >
              <a href="/himalayan">HIMALAYAN RANGE</a>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-14 px-10 border-white/15 hover:bg-white/5 hover:border-apex-orange/50 text-foreground rounded-none font-display font-bold italic text-base tracking-tighter transition-all duration-300"
              asChild
            >
              <a href="/experience">LAUNCH EXPERIENCE</a>
            </Button>
          </motion.div>

          {/* Animated Stats */}
          <motion.div
            ref={statsRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-white/[0.06]"
          >
            {STATS.map((stat, i) => (
              <div key={stat.label} className="group space-y-1 cursor-default">
                <div className="flex items-center gap-2 text-apex-orange">
                  <stat.icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span className="text-2xl font-display font-black italic">
                    {i === 0 ? "0.1" : counters[i].toLocaleString()}{stat.suffix}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Rotating bike models ticker on right edge */}
      <div className="absolute right-0 top-0 h-full w-12 overflow-hidden pointer-events-none hidden lg:flex items-center">
        <div
          className="flex flex-col gap-8 animate-[ticker_20s_linear_infinite] origin-center"
          style={{ writingMode: "vertical-rl" }}
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="text-[8px] font-bold tracking-[0.4em] text-neutral-800 uppercase whitespace-nowrap">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Orange ambient glow right side */}
      <div className="absolute bottom-0 right-0 w-1/2 h-full pointer-events-none hidden lg:block">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-apex-orange/15 rounded-full blur-[140px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </section>
  )
}
