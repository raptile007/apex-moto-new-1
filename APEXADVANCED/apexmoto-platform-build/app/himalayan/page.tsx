"use client";

import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ArrowRight, MapPin, Mountain, Gauge, Wind, Zap, Shield, ChevronDown, Navigation, Thermometer } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { VideoShowcase } from "@/components/video-showcase";
import { useStore } from "@/lib/store";
import { useSound } from "@/hooks/use-sound";
import { type Product } from "@/lib/data";

// ─── Animated Counter ───────────────────────────────────────────────────────
function Counter({ to, suffix = "", duration = 2 }: { to: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = to / (duration * 60);
    const frame = () => {
      start = Math.min(start + step, to);
      setCount(Math.round(start));
      if (start < to) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [inView, to, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Specs Data ──────────────────────────────────────────────────────────────
const SPECS = [
  { label: "Displacement", value: "452 cc", icon: Gauge },
  { label: "Max Power", value: "40 bhp", icon: Zap },
  { label: "Max Torque", value: "40 Nm", icon: Wind },
  { label: "Fuel Tank", value: "17 L", icon: Shield },
  { label: "Ground Clearance", value: "230 mm", icon: Mountain },
  { label: "Seat Height", value: "825 mm", icon: MapPin },
  { label: "Kerb Weight", value: "196 kg", icon: Gauge },
  { label: "Top Speed", value: "~155 km/h", icon: Zap },
];

const PARTS = [
  {
    category: "Protection",
    name: "Engine Guard Bash Plate",
    desc: "Heavy-duty aluminium underbelly protection for high-pass trail riding.",
    price: "₹4,299",
    tag: "OEM FIT",
    color: "from-stone-900 to-stone-800",
  },
  {
    category: "Suspension",
    name: "Adjustable Linkage Kit",
    desc: "Fine-tune rear suspension sag for touring loads and off-road terrain.",
    price: "₹7,499",
    tag: "PERFORMANCE",
    color: "from-orange-950 to-stone-900",
  },
  {
    category: "Brakes",
    name: "Sintered Brake Pad Set",
    desc: "High-friction sintered compound pads for superior bite in wet/muddy conditions.",
    price: "₹1,899",
    tag: "BESTSELLER",
    color: "from-red-950 to-stone-900",
  },
  {
    category: "Tyres",
    name: "Dual Sport Tyre Pair",
    desc: "70/30 on/off road tread pattern. Fits 21\" front, 17\" rear stock rims.",
    price: "₹12,999",
    tag: "ADVENTURE",
    color: "from-green-950 to-stone-900",
  },
  {
    category: "Electronics",
    name: "USB-C Dual Charging Port",
    desc: "Weatherproof, handlebar-mounted 36W fast-charge port kit.",
    price: "₹999",
    tag: "PLUG & PLAY",
    color: "from-blue-950 to-stone-900",
  },
  {
    category: "Luggage",
    name: "Pannier Frame Rails",
    desc: "Bolt-on steel frame compatible with standard 35L side panniers.",
    price: "₹8,999",
    tag: "TOURING",
    color: "from-amber-950 to-stone-900",
  },
  {
    category: "Ergonomics",
    name: "Rally Seat Setup",
    desc: "Taller, flatter one-piece seat designed for active off-road riding and weight transfer.",
    price: "₹5,499",
    tag: "PRO BUILD",
    color: "from-stone-800 to-stone-950",
  },
  {
    category: "Visibility",
    name: "Aux LED Fog Light Kit",
    desc: "4000-lumen auxiliary pods with integrated wiring harness and switch.",
    price: "₹14,500",
    tag: "ESSENTIAL",
    color: "from-yellow-950 to-stone-900",
  },
  {
    category: "Protection",
    name: "Heavy-Duty Handguards",
    desc: "Aluminium backbone handguards to protect levers from brush and drops.",
    price: "₹3,999",
    tag: "ARMOR",
    color: "from-zinc-800 to-black",
  },
  {
    category: "Performance",
    name: "Titanium Slip-On Exhaust",
    desc: "Saves 3.2kg of weight and unlocks a deeper, throatier exhaust note.",
    price: "₹24,999",
    tag: "RACE SPEC",
    color: "from-neutral-800 to-stone-900",
  },
  {
    category: "Protection",
    name: "Aluminium Radiator Guard",
    desc: "Hex-pattern guard to prevent stone damage to the liquid cooling system.",
    price: "₹2,199",
    tag: "OEM FIT",
    color: "from-slate-900 to-black",
  },
  {
    category: "Intake",
    name: "High-Flow Air Filter",
    desc: "Washable, reusable off-road filter that increases airflow by 18%.",
    price: "₹1,499",
    tag: "UPGRADE",
    color: "from-red-900 to-black",
  },
];

const EXPEDITION_STATS = [
  { label: "Khardung La", value: "5,359", unit: "m", sub: "ALTITUDE PROVEN" },
  { label: "Manali–Leh", value: "479", unit: "km", sub: "HIGHWAY TESTED" },
  { label: "Pass Temperature", value: "-15", unit: "°C", sub: "COLD START READY" },
];

export default function HimalayanPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Global State
  const { addToCart } = useStore();
  const { play } = useSound();

  // UI Interactive State
  const [toast, setToast] = useState<{ message: string; type?: "success" | "info" } | null>(null);
  
  // New Component States
  const [dashMode, setDashMode] = useState<"nav" | "perf">("perf");
  const [rideMode, setRideMode] = useState<"performance" | "eco">("performance");
  const [activeRoute, setActiveRoute] = useState<number | null>(null);

  const showToast = (message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    showToast(`Navigating to ${targetId.toUpperCase()}`, "info");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <Header />

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax BG */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <img
            src="/him-custom-hero.jpg"
            alt="Adventure motorcycle in the mountains"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-transparent to-[#050505]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-transparent" />
        </motion.div>

        {/* Scanlines */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none opacity-30"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)" }}
        />

        {/* Hero Content */}
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-16 bg-apex-orange/70" />
              <span className="text-[9px] tracking-[0.6em] text-apex-orange font-bold uppercase font-display">
                ApexMoto × Royal Enfield
              </span>
              <div className="h-px w-16 bg-apex-orange/70" />
            </div>

            <h1 className="text-7xl md:text-[11rem] font-display font-black text-white tracking-tighter uppercase leading-none italic">
              HIMALAYAN
            </h1>
            <p className="text-2xl md:text-4xl font-display font-light text-white/60 tracking-widest uppercase mt-2">
              450 · EXPEDITION SERIES
            </p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-neutral-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed font-medium"
            >
              Purpose-built for the world&apos;s most brutal terrain. Every ApexMoto upgrade is
              tested at altitude, proven on pass.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href="#parts"
                onClick={(e) => handleSmoothScroll(e, "parts")}
                className="group inline-flex items-center gap-3 bg-apex-orange hover:bg-apex-orange/90 text-white font-display font-black italic uppercase tracking-wider px-10 py-4 transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,77,0,0.4)] cursor-pointer"
              >
                Shop Himalayan Parts
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#specs"
                onClick={(e) => handleSmoothScroll(e, "specs")}
                className="inline-flex items-center gap-3 border border-white/20 hover:border-apex-orange/60 text-white font-display font-bold italic uppercase tracking-wider px-10 py-4 transition-all duration-300 backdrop-blur-sm cursor-pointer"
              >
                View Full Specs
              </a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Expedition overlay — bottom right corner stats */}
        <div className="absolute bottom-10 right-6 md:right-16 z-10 hidden md:flex flex-col gap-4">
          {EXPEDITION_STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.15 }}
              className="text-right"
            >
              <p className="text-[9px] text-apex-orange tracking-[0.3em] uppercase font-bold">{s.label}</p>
              <p className="text-2xl font-mono font-black text-white">
                {s.value}<span className="text-apex-orange text-base">{s.unit}</span>
              </p>
              <p className="text-[8px] text-neutral-600 tracking-widest uppercase">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/30"
        >
          <span className="text-[8px] tracking-[0.4em] uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* ── STORY ───────────────────────────────────────────────────────────── */}
      <section className="py-32 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[9px] tracking-[0.5em] text-apex-orange font-bold uppercase block mb-4">
              THE MACHINE
            </span>
            <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase italic leading-none mb-8">
              BORN FROM<br />
              <span className="text-apex-orange">THE PASS.</span>
            </h2>
            <div className="space-y-5 text-neutral-400 text-base leading-relaxed max-w-lg transition-colors duration-500">
              <p>
                The Himalayan 450 isn&apos;t engineered for showrooms — it&apos;s engineered for Khardung La,
                Umling La, and every nameless mountain track in between. At its heart lies the revolutionary 
                <span className={`font-bold transition-colors duration-500 ${rideMode === "performance" ? "text-apex-orange" : "text-blue-400"}`}> Sherpa 452cc liquid-cooled engine</span>, delivering 
                {rideMode === "performance" ? " 40bhp of relentless" : " 30bhp of mapped, efficient"}, ride-by-wire controlled torque.
              </p>
              <p>
                At ApexMoto, we stock the tactical upgrades that keep your Sherpa performing at altitude —
                from reinforced engine bash plates that survive boulders, to sintered pads that grip in silt.
                Every component is expedition-proven and telemetry-tested for the wild.
              </p>
            </div>

            {/* Ride Mode Toggle */}
            <div className="flex items-center gap-4 mt-8 p-2 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md inline-flex">
              <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-500 ml-4">Ride_by_Wire Map</span>
              <div 
                className="w-40 h-12 bg-black rounded-full relative cursor-pointer border border-white/10 p-1 flex items-center shadow-inner"
                onClick={() => {
                  const newMode = rideMode === "performance" ? "eco" : "performance";
                  setRideMode(newMode);
                  showToast(`${newMode.toUpperCase()} Map Engaged`, "info");
                }}
              >
                <motion.div 
                  className={`absolute w-[72px] h-10 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] ${rideMode === "performance" ? "bg-apex-orange" : "bg-blue-500"}`}
                  animate={{ x: rideMode === "performance" ? 0 : 78 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
                <span className="relative z-10 w-1/2 text-center text-[9px] font-black uppercase tracking-widest text-white mix-blend-difference pointer-events-none">PERF</span>
                <span className="relative z-10 w-1/2 text-center text-[9px] font-black uppercase tracking-widest text-white mix-blend-difference pointer-events-none">ECO</span>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8 border-t border-white/5 pt-10">
              {[
                { value: 452, suffix: "cc", label: "Engine Displacement" },
                { value: 40, suffix: " bhp", label: "Peak Power" },
                { value: 230, suffix: "mm", label: "Ground Clearance" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-3xl font-display font-black italic text-white">
                    <Counter to={s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-[9px] text-neutral-600 uppercase tracking-widest mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Image mosaic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative grid grid-cols-2 gap-4"
          >
            <div className="col-span-2 aspect-video overflow-hidden rounded-[2rem] border border-white/5 cursor-pointer" onClick={() => showToast("Opening High-Res Off-Road View", "info")}>
              <img
                src="/him-custom-1.jpg"
                alt="Adventure bike crossing water"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="aspect-square overflow-hidden rounded-[1.5rem] border border-white/5 cursor-pointer" onClick={() => showToast("Opening High-Res Engine View", "info")}>
              <img
                src="/him-custom-2.jpg"
                alt="Sherpa 450 engine detail"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0"
              />
            </div>
            <div className="aspect-square overflow-hidden rounded-[1.5rem] border border-white/5 cursor-pointer" onClick={() => showToast("Opening High-Res Touring View", "info")}>
              <img
                src="/him-custom-3.jpg"
                alt="Motorcycle on trail"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-apex-orange rounded-full flex flex-col items-center justify-center shadow-[0_0_40px_rgba(255,77,0,0.4)]">
              <p className="text-white font-display font-black text-xl italic leading-none">OEM</p>
              <p className="text-white/80 text-[7px] tracking-widest uppercase font-bold">Certified</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CINEMATIC REEL ────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/5 shadow-[0_0_80px_rgba(255,77,0,0.1)] group"
            onClick={() => showToast("Playing Himalayan Cinematic", "info")}
          >
            <iframe
              src="https://www.youtube-nocookie.com/embed/AGX3eZrGNao?rel=0&modestbranding=1&autoplay=1&mute=1&loop=1&playlist=AGX3eZrGNao&controls=0"
              title="Himalayan Cinematic"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="absolute inset-0 w-full h-full pointer-events-none scale-105"
            />
            {/* Overlay to catch clicks and style the video */}
            <div className="absolute inset-0 z-10 cursor-pointer bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-colors duration-500 group-hover:from-black/90" />
            
            <div className="absolute bottom-8 left-8 z-20 transition-transform duration-500 group-hover:translate-y-[-8px]">
              <div className="inline-flex items-center gap-2 bg-apex-orange/10 border border-apex-orange/30 text-apex-orange px-3 py-1.5 rounded-full mb-3 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 bg-apex-orange rounded-full animate-pulse" />
                <span className="text-[8px] font-black tracking-widest uppercase">LIVE EXPEDITION FOOTAGE</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-display font-black italic text-white tracking-tighter drop-shadow-2xl">
                THE SHERPA IN ACTION.
              </h3>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SPECS GRID ──────────────────────────────────────────────────────── */}
      <section id="specs" className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-3 mb-16"
          >
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-white/20" />
              <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-[0.4em]">
                TECHNICAL_DATA — HIM450_SPEC_V1
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase italic text-white">
              Full <span className="text-neutral-500 font-light not-italic">Specifications</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SPECS.map((spec, i) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ borderColor: "rgba(255,77,0,0.4)", y: -4 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => showToast(`Spec Analyzed: ${spec.label} is ${spec.value}`, "info")}
                className="group relative bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,77,0,0.1)]"
              >
                <spec.icon className="w-5 h-5 text-apex-orange mb-4 transition-transform group-hover:scale-110" />
                <p className="text-[9px] text-neutral-600 uppercase tracking-[0.3em] mb-2">{spec.label}</p>
                <p className="text-2xl font-display font-black text-white italic">{spec.value}</p>
                {/* Corner bracket */}
                <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-apex-orange/0 group-hover:border-apex-orange/60 transition-all duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRIPPER DASH SIMULATOR ────────────────────────────────────────── */}
      <section className="py-32 bg-[#050505] relative overflow-hidden border-y border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[120px] rounded-full pointer-events-none transition-colors duration-1000" style={{ backgroundColor: dashMode === "perf" ? "rgba(255,77,0,0.15)" : "rgba(59,130,246,0.15)" }} />
        
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 space-y-6">
             <div className="flex items-center gap-4">
                <div className={`h-px w-12 transition-colors duration-500 ${dashMode === "perf" ? "bg-apex-orange" : "bg-blue-500"}`} />
                <span className={`text-[9px] font-bold uppercase tracking-[0.4em] transition-colors duration-500 ${dashMode === "perf" ? "text-apex-orange" : "text-blue-500"}`}>Tripper_OS 2.0</span>
             </div>
             <h2 className="text-5xl lg:text-7xl font-display font-black tracking-tighter uppercase italic text-white">
               Command <br/><span className="text-neutral-500 font-light not-italic">Center.</span>
             </h2>
             <p className="text-neutral-400 text-base leading-relaxed max-w-md">
               The world&apos;s first fully circular TFT motorcycle display. Featuring native Google Maps integration, media controls, and high-fidelity telemetry.
             </p>
             <div className="flex gap-4 pt-4">
               <button 
                 onClick={() => { setDashMode("perf"); showToast("Tripper Dash: Performance View", "info"); }}
                 className={`px-6 py-3 rounded-full text-[9px] font-black tracking-widest uppercase transition-all duration-300 border ${dashMode === "perf" ? "bg-apex-orange border-apex-orange text-white" : "bg-white/5 border-white/10 text-neutral-400 hover:border-white/30"}`}
               >
                 Telemetry
               </button>
               <button 
                 onClick={() => { setDashMode("nav"); showToast("Tripper Dash: Navigation View", "info"); }}
                 className={`px-6 py-3 rounded-full text-[9px] font-black tracking-widest uppercase transition-all duration-300 border ${dashMode === "nav" ? "bg-blue-500 border-blue-500 text-white" : "bg-white/5 border-white/10 text-neutral-400 hover:border-white/30"}`}
               >
                 Navigation
               </button>
             </div>
          </div>

          <div className="flex-1 flex justify-center">
             <div className="relative w-[320px] h-[320px] md:w-[420px] md:h-[420px] rounded-full border-[16px] border-neutral-900 bg-black shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden flex items-center justify-center p-8">
               {/* Bezel glare */}
               <div className="absolute inset-0 rounded-full border border-white/10 z-20 pointer-events-none" />
               <div className="absolute -top-10 -left-10 w-[200px] h-[200px] bg-white/5 blur-2xl rounded-full z-20 pointer-events-none" />
               
               <AnimatePresence mode="wait">
                 {dashMode === "perf" ? (
                   <motion.div 
                     key="perf"
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     transition={{ duration: 0.3 }}
                     className="w-full h-full flex flex-col items-center justify-center relative"
                   >
                     <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                       <circle cx="50" cy="50" r="45" fill="none" stroke="#111" strokeWidth="6" strokeDasharray="283" strokeDashoffset="0" />
                       <circle cx="50" cy="50" r="45" fill="none" stroke="#ff4d00" strokeWidth="6" strokeDasharray="283" strokeDashoffset="120" strokeLinecap="round" />
                     </svg>
                     <p className="text-[9px] text-neutral-500 tracking-[0.4em] uppercase mb-1">GEAR</p>
                     <p className="text-5xl font-display font-black text-apex-orange italic leading-none mb-2">4</p>
                     <p className="text-8xl font-display font-black text-white italic leading-none tracking-tighter ml-2">84</p>
                     <p className="text-[10px] text-neutral-400 tracking-widest mt-1 uppercase">km/h</p>
                     
                     <div className="absolute bottom-10 flex gap-6 text-[10px] font-mono text-neutral-500">
                       <div className="flex items-center gap-1"><Thermometer className="w-3 h-3 text-red-500"/> 92°</div>
                       <div className="flex items-center gap-1"><Gauge className="w-3 h-3 text-apex-orange"/> 6.5k</div>
                     </div>
                   </motion.div>
                 ) : (
                   <motion.div 
                     key="nav"
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     transition={{ duration: 0.3 }}
                     className="w-full h-full flex flex-col items-center justify-between relative bg-[#0a1128] rounded-full p-8"
                   >
                     <div className="absolute inset-0 z-0 pointer-events-none opacity-30" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
                     
                     <div className="relative z-10 w-full flex justify-between items-center bg-black/60 p-2.5 rounded-full border border-white/10 backdrop-blur-md">
                       <Navigation className="w-4 h-4 text-blue-400 ml-2" />
                       <span className="text-[9px] font-bold text-white tracking-widest uppercase">Khardung La</span>
                       <span className="text-[10px] text-neutral-400 mr-2 font-mono">14km</span>
                     </div>
                     
                     <div className="relative z-10 flex flex-col items-center mb-4">
                       <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                         <ArrowRight className="w-20 h-20 text-blue-500 -rotate-45" />
                       </motion.div>
                       <p className="text-4xl font-display font-black text-white italic mt-4">1.2<span className="text-xl text-neutral-400">km</span></p>
                     </div>
                     
                     <div className="relative z-10 text-[10px] font-mono text-blue-400 bg-blue-500/10 px-5 py-2 rounded-full border border-blue-500/30">
                       ETA 14:30
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
          </div>
        </div>
      </section>

      {/* ── VIDEO SECTION ────────────────────────────────────────────────────── */}
      <VideoShowcase />

      {/* ── EXPEDITION ROUTES ──────────────────────────────────────────────── */}
      <section className="py-32 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-16">
            <h2 className="text-5xl lg:text-7xl font-display font-black tracking-tighter uppercase italic text-white mb-4">
              Proven <span className="text-neutral-500 font-light not-italic">Grounds.</span>
            </h2>
            <p className="text-neutral-400 max-w-xl text-base leading-relaxed">
              Every ApexMoto component is tortured and tested on the world&apos;s most unforgiving routes before it ever hits our store. Hover to explore the terrains that forge our gear.
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row h-[600px] gap-4">
            {[
              { id: 1, name: "Khardung La Pass", alt: "5,359m", dist: "39km", diff: "Extreme", img: "/proven-ground-1.jpg" },
              { id: 2, name: "Spiti Valley", alt: "4,270m", dist: "150km", diff: "Hard", img: "/proven-ground-2.jpg" },
              { id: 3, name: "Zanskar Trail", alt: "4,000m", dist: "300km", diff: "Extreme", img: "/proven-ground-3.jpg" }
            ].map((route) => (
              <motion.div
                key={route.id}
                onHoverStart={() => setActiveRoute(route.id)}
                onHoverEnd={() => setActiveRoute(null)}
                animate={{ flex: activeRoute === route.id ? 3 : 1 }}
                onClick={() => showToast(`Expedition Selected: ${route.name}`, "success")}
                className="relative rounded-[2.5rem] overflow-hidden cursor-pointer group transition-all duration-700 ease-[0.22,1,0.36,1] border border-white/5 flex-1 min-h-[150px]"
              >
                <img src={route.img} alt={route.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 flex flex-col justify-end h-full">
                  <div className="flex items-center gap-3 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
                    <span className="bg-apex-orange text-white text-[8px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full">{route.diff}</span>
                    <span className="text-white text-[10px] font-mono bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                      <MapPin className="inline w-3 h-3 mr-1.5 text-neutral-400"/>{route.dist}
                    </span>
                  </div>
                  
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-3xl md:text-5xl font-display font-black italic text-white whitespace-nowrap drop-shadow-2xl">{route.name}</h3>
                      <p className="text-apex-orange font-mono text-sm mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        Peak Altitude: {route.alt}
                      </p>
                    </div>
                    
                    <motion.div 
                      className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100"
                      initial={false}
                      animate={{ scale: activeRoute === route.id ? 1 : 0.8 }}
                    >
                      <ArrowRight className="w-5 h-5 text-white" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTS CATALOG ───────────────────────────────────────────────────── */}
      <section id="parts" className="py-32">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
          >
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px w-12 bg-white/20" />
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-[0.4em]">
                  APEXMOTO × HIMALAYAN_PARTS
                </span>
              </div>
              <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase italic text-white">
                Gear Up.<br />
                <span className="text-apex-orange">Go Higher.</span>
              </h2>
            </div>
            <Link
              href="#products"
              className="group inline-flex items-center gap-3 border border-white/20 hover:border-apex-orange text-white hover:text-apex-orange font-display font-bold italic uppercase tracking-wider px-8 py-4 transition-all duration-300 text-sm shrink-0"
            >
              View All Parts
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PARTS.map((part, i) => (
              <motion.div
                key={part.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`group relative bg-gradient-to-br ${part.color} border border-white/[0.07] rounded-3xl p-8 overflow-hidden cursor-pointer transition-all duration-300 hover:border-apex-orange/30 hover:shadow-[0_0_50px_rgba(255,77,0,0.12)]`}
              >
                {/* Tag */}
                <div className="inline-flex items-center gap-2 bg-apex-orange/10 border border-apex-orange/20 text-apex-orange text-[8px] font-black tracking-[0.3em] uppercase px-3 py-1 rounded-full mb-6">
                  {part.tag}
                </div>
                {/* Category */}
                <p className="text-[9px] text-neutral-600 uppercase tracking-[0.3em] mb-2">{part.category}</p>
                <h3 className="text-xl font-display font-black italic text-white tracking-tight mb-3 group-hover:text-apex-orange transition-colors duration-300">
                  {part.name}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed mb-8">{part.desc}</p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-display font-black italic text-white">{part.price}</span>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const numericPrice = parseFloat(part.price.replace(/[^0-9.]/g, ''));
                      const productToAdd = {
                        id: `him-part-${i}`,
                        name: part.name,
                        brand: "Royal Enfield",
                        category: part.category,
                        price: numericPrice,
                        description: part.desc,
                        image: "/him-custom-2.jpg",
                        stock: 10,
                        stockStatus: "In Stock"
                      } as Product;
                      addToCart(productToAdd);
                      play('success');
                      showToast(`${part.name} Added to Cart!`, "success");
                    }}
                    className="inline-flex items-center gap-2 bg-white/5 hover:bg-apex-orange border border-white/10 hover:border-apex-orange text-white text-[9px] font-black tracking-widest uppercase px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer"
                  >
                    Add to Cart
                    <ArrowRight className="w-3 h-3" />
                  </motion.div>
                </div>

                {/* Corner HUD ticks */}
                <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-apex-orange/0 group-hover:border-apex-orange/50 transition-all duration-300 rounded-tr-sm" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-apex-orange/0 group-hover:border-apex-orange/50 transition-all duration-300 rounded-bl-sm" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ───────────────────────────────────────────────────────── */}
      <section className="relative py-32 overflow-hidden bg-apex-orange">
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(0,0,0,0.4) 20px, rgba(0,0,0,0.4) 21px)" }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[9px] tracking-[0.6em] text-white/60 font-bold uppercase mb-4">
              ApexMoto Himalayan Program
            </p>
            <h2 className="text-6xl md:text-8xl font-display font-black italic uppercase text-white tracking-tighter leading-none mb-8">
              BUILD YOUR<br />HIMALAYAN.
            </h2>
            <p className="text-white/70 text-lg max-w-xl mx-auto mb-12">
              Every part. Every upgrade. Every expedition accessory — all in one place.
              OEM-fit guaranteed or your money back.
            </p>
            <a
              href="#parts"
              onClick={(e) => handleSmoothScroll(e, "parts")}
              className="group inline-flex items-center gap-4 bg-[#050505] hover:bg-black text-white font-display font-black italic uppercase tracking-wider px-12 py-5 transition-all duration-300 text-lg hover:shadow-[0_0_60px_rgba(0,0,0,0.5)] cursor-pointer"
            >
              Shop All Parts
              <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
            </a>
          </motion.div>
        </div>
        {/* Ghost text */}
        <div className="absolute -bottom-8 right-0 select-none pointer-events-none opacity-10">
          <p className="text-[14rem] font-display font-black italic text-white leading-none tracking-tighter">HIM</p>
        </div>
      </section>

      <Footer />

      {/* ── INTERACTIVE TOAST SYSTEM ────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%", scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: 50, x: "-50%", scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-10 left-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl"
            style={{ 
              backgroundColor: "rgba(5,5,5,0.85)", 
              borderColor: toast.type === "info" ? "rgba(255,255,255,0.2)" : "rgba(255,77,0,0.5)"
            }}
          >
            {toast.type === "info" ? (
              <Zap className="w-5 h-5 text-white/50" />
            ) : (
              <Mountain className="w-5 h-5 text-apex-orange" />
            )}
            <span className="text-sm font-bold uppercase tracking-widest text-white mt-0.5">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
