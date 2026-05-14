"use client";

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, Zap, Shield, Gauge, ChevronDown, Star, Crown } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import HarleyLoading from "./loading";

// ── Animated Counter ─────────────────────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = to / 90;
    const f = () => { start = Math.min(start + step, to); setCount(Math.round(start)); if (start < to) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  }, [inView, to]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ── Parts Data ───────────────────────────────────────────────────────────────
const HD_PARTS = [
  { category: "Screamin' Eagle", name: "Pro Street Tuner & Stage II Kit", desc: "Unlock maximum performance. High-flow intake, performance cams, and precision ECM tuning for your Milwaukee-Eight.", price: "₹45,999", tag: "PERFORMANCE", hot: true },
  { category: "Seats & Backrests", name: "Sundowner™ Solo Seat", desc: "Maximum long-haul comfort. Deep bucket design and premium stitching, engineered specifically for Softail models.", price: "₹24,499", tag: "COMFORT", hot: false },
  { category: "Audio Equipment", name: "Rockford Fosgate® Audio Kit", desc: "Stage II fairing speakers with 400W amplifier. Crystal clear audio designed exclusively for Harley-Davidson fairings.", price: "₹68,999", tag: "ELECTRONICS", hot: true },
  { category: "Wind Protection", name: "Detachable Wind Splitter", desc: "10-inch dark smoke windshield. Engineered for optimal aerodynamics to reduce buffeting at highway speeds.", price: "₹18,299", tag: "AERO", hot: false },
  { category: "Bags & Luggage", name: "Onyx™ Premium Touring Bag", desc: "UV-resistant, weather-proof textile construction with high-vis interior. Mounts securely to your sissy bar.", price: "₹22,999", tag: "TOURING", hot: true },
  { category: "Grips & Controls", name: "Defiance Hand Grips", desc: "Machine cut, black anodized finish with deep rubber grooves for vibration isolation and superior grip.", price: "₹9,999", tag: "CUSTOM", hot: false },
  { category: "Lighting", name: "Daymaker® LED Headlamp", desc: "Projector-style 7-inch LED. Pierces through darkness with a brilliant white beam pattern. Superior night riding safety.", price: "₹38,499", tag: "SAFETY", hot: true },
  { category: "Foot Controls", name: "Willie G Skull Footpegs", desc: "Iconic Harley attitude. Black finish with menacing chrome skull and surrounding 'Harley-Davidson Motorcycles' script.", price: "₹11,299", tag: "STYLING", hot: false },
  { category: "Paint & Bodywork", name: "Color-Matched Fairing Lowers", desc: "Factory-painted to match your bike perfectly. Controls airflow to the rider's legs for all-weather comfort.", price: "₹42,999", tag: "BODYWORK", hot: false },
];

const STATS = [
  { label: "HD Models Supported", value: 24, suffix: "+" },
  { label: "Genuine OEM Parts", value: 500, suffix: "+" },
  { label: "Years of HD Expertise", value: 12, suffix: "" },
  { label: "Warranty on Parts", value: 2, suffix: " yr" },
];

const MODELS = ["SPORTSTER S", "PAN AMERICA 1250", "ROAD GLIDE", "FAT BOY 114", "STREET BOB", "LOW RIDER S", "IRON 883", "HERITAGE CLASSIC"];

// ── Blueprint HUD Overlay ──────────────────────────────────────────────────
function BlueprintHUD() {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
      {/* Scanning Line */}
      <motion.div 
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute inset-y-0 w-1 bg-gradient-to-b from-transparent via-[#d4af37] to-transparent opacity-50 shadow-[0_0_20px_rgba(212,175,55,0.8)]"
      />

      {/* Blueprint SVG (Stylized Outline) */}
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="scanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <mask id="scanMask">
             <motion.rect 
               animate={{ x: [-1000, 2000] }}
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               width="600" height="1000" fill="white"
             />
          </mask>
        </defs>
        
        {/* Simplified Bike Blueprint Paths */}
        <g stroke="#d4af37" strokeWidth="0.5" fill="none" mask="url(#scanMask)">
          {/* Frame */}
          <path d="M200,450 L350,450 L450,300 L750,300 L850,450" strokeDasharray="5,5" />
          {/* Engine Block */}
          <rect x="400" y="320" width="120" height="100" rx="10" />
          <circle cx="460" cy="370" r="30" strokeDasharray="2,2" />
          {/* Wheels */}
          <circle cx="250" cy="450" r="80" />
          <circle cx="250" cy="450" r="70" strokeDasharray="10,5" />
          <circle cx="750" cy="450" r="80" />
          <circle cx="750" cy="450" r="70" strokeDasharray="10,5" />
          {/* Handlebars */}
          <path d="M400,280 L350,220 L300,230" />
        </g>

        {/* Tactical HUD Data Callouts */}
        <g className="text-[8px] font-mono" fill="#d4af37" opacity="0.6">
           <motion.g animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}>
             <text x="380" y="310">ENGINE_SYNC: OPTIMAL</text>
             <line x1="400" y1="315" x2="430" y2="340" stroke="#d4af37" strokeWidth="0.2" />
           </motion.g>
           <motion.g animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}>
             <text x="700" y="360">REAR_SUSPENSION: CALIBRATED</text>
             <line x1="750" y1="365" x2="750" y2="400" stroke="#d4af37" strokeWidth="0.2" />
           </motion.g>
        </g>
      </svg>

      {/* Pulsing Hotspots */}
      <div className="absolute top-[45%] left-[45%] pointer-events-auto">
         <motion.div 
           animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
           transition={{ duration: 2, repeat: Infinity }}
           className="w-3 h-3 bg-[#d4af37] rounded-full blur-[2px] cursor-help"
         />
      </div>
    </div>
  );
}

// ── Magnetic Wrapper ────────────────────────────────────────────────────────
function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.35, y: y * 0.35 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
}

export default function HarleyPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const heroImages = [
    "/harley-hero-custom.jpg",
    "/harley-hero-center.jpg",
    "/harley-hero-custom-3.jpg"
  ];

  // UI Interactive State
  const [toast, setToast] = useState<{ message: string; type?: "success" | "info" } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

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
    <div className="min-h-screen bg-[#080500] text-white overflow-x-hidden">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[200]"
          >
            <HarleyLoading />
          </motion.div>
        )}
      </AnimatePresence>

      <Header />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0 bg-[#080500] flex">
          {heroImages.map((src, i) => (
            <div key={src} className="flex-1 relative h-full overflow-hidden border-r border-white/[0.03] last:border-0">
              <motion.img
                src={src}
                alt="Harley-Davidson Custom"
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.15 }}
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-[#080500]/70 via-[#080500]/20 to-[#080500]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080500]/90 via-[#080500]/40 to-transparent" />
        </motion.div>

        {/* Blueprint X-Ray Overlay */}
        <BlueprintHUD />

        {/* Scanlines */}
        <div className="absolute inset-0 z-[1] pointer-events-none opacity-20"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 4px)" }} />

        {/* Gold ambient glow */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(212,175,55,0.8) 0%, transparent 70%)" }} />

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {/* Sponsor badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full border mb-8"
              style={{ backgroundColor: "rgba(212,175,55,0.1)", borderColor: "rgba(212,175,55,0.4)" }}
            >
              <Crown className="w-4 h-4" style={{ color: "#d4af37" }} />
              <span className="text-[9px] font-black tracking-[0.5em] uppercase" style={{ color: "#d4af37" }}>
                Official ApexMoto Premium Partner
              </span>
              <Crown className="w-4 h-4" style={{ color: "#d4af37" }} />
            </motion.div>

            <h1 className="text-7xl md:text-[10rem] font-display font-black tracking-tighter uppercase leading-none italic"
              style={{ background: "linear-gradient(135deg, #fff 40%, #d4af37 70%, #fff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              HARLEY
            </h1>
            <p className="text-4xl md:text-6xl font-display font-black tracking-widest uppercase text-white/80 -mt-3">
              DAVIDSON
            </p>
            <p className="text-sm md:text-base font-display font-light text-white/40 tracking-[0.5em] uppercase mt-3">
              Premium Parts & Accessories · ApexMoto Exclusive
            </p>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="mt-8 text-neutral-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              As Harley-Davidson&apos;s official ApexMoto partner, we carry the deepest catalog of HD performance
              parts, accessories, and custom upgrades in India. Factory-fit. Expedition-proven. American soul.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="mt-10 flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Magnetic>
                <a href="#parts"
                  onClick={(e) => handleSmoothScroll(e, "parts")}
                  className="group relative inline-flex items-center gap-3 text-black font-display font-black italic uppercase tracking-wider px-10 py-5 transition-all duration-300 cursor-pointer overflow-hidden rounded-sm"
                  style={{ background: "linear-gradient(135deg, #d4af37, #f5d87e, #d4af37)" }}>
                  {/* Gold Leaf Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl bg-[#d4af37]/50 -z-10" />
                  Shop HD Parts
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Magnetic>

              <Magnetic>
                <a href="#models"
                  onClick={(e) => handleSmoothScroll(e, "models")}
                  className="group relative inline-flex items-center gap-3 border text-white font-display font-bold italic uppercase tracking-wider px-10 py-5 transition-all duration-300 backdrop-blur-sm cursor-pointer rounded-sm"
                  style={{ borderColor: "rgba(212,175,55,0.4)" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.9)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.4)")}>
                  {/* Subtle Gold Glow for secondary */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl bg-[#d4af37] -z-10" />
                  View Models
                </a>
              </Magnetic>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.8, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/30">
          <span className="text-[8px] tracking-[0.4em] uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section className="border-y py-16" style={{ borderColor: "rgba(212,175,55,0.15)", background: "rgba(212,175,55,0.03)" }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center cursor-default group">
              <p className="text-4xl font-display font-black italic mb-1 group-hover:scale-105 transition-transform duration-300"
                style={{ background: "linear-gradient(135deg, #fff, #d4af37)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                <Counter to={s.value} suffix={s.suffix} />
              </p>
              <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-600">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── MODELS TICKER ─────────────────────────────────────────────────── */}
      <section id="models" className="py-10 overflow-hidden border-b" style={{ borderColor: "rgba(212,175,55,0.08)" }}>
        <p className="text-center text-[9px] font-bold uppercase tracking-[0.5em] text-neutral-700 mb-6">Models We Support</p>
        <div className="overflow-hidden">
          <motion.div className="flex gap-16 w-max"
            animate={{ x: ["0%", "-50%"] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}>
            {[...MODELS, ...MODELS].map((m, i) => (
              <span key={i} className="text-3xl md:text-5xl font-display font-black italic tracking-tighter uppercase whitespace-nowrap"
                style={{ color: "rgba(212,175,55,0.12)" }}>
                {m}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PHOTO GALLERY ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#080500]">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mb-14">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-12" style={{ background: "rgba(212,175,55,0.4)" }} />
              <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-neutral-500">HD_GALLERY — VISUAL SHOWCASE</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase italic leading-none">
              <span className="text-white">American</span>{" "}
              <span style={{ background: "linear-gradient(135deg, #d4af37, #f5d87e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Soul.
              </span>
            </h2>
          </motion.div>

          {/* Masonry-style grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { src: "/custom-hd-1.jpeg", alt: "Custom Harley-Davidson", tall: true, label: "CUSTOM V-ROD" },
              { src: "/custom-hd-2.jpeg", alt: "Custom Sportster", tall: false, label: "SPORTSTER 48" },
              { src: "https://images.unsplash.com/photo-1558981359-219d6364c9c8?w=800&q=80", alt: "Harley Davidson riding", tall: false, label: "ROAD GLIDE" },
              { src: "/custom-hd-3.jpeg", alt: "Blacked out Harley", tall: false, label: "DARK CUSTOM" },
              { src: "/custom-hd-4.jpeg", alt: "Custom Bobber", tall: true, label: "BOBBER BUILD" },
              { src: "https://images.unsplash.com/photo-1558980664-ce6960be307d?w=800&q=80", alt: "Harley Sportster sunset", tall: false, label: "SPORTSTER S" },
            ].map((photo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.02, zIndex: 10 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => showToast(`Opening ${photo.label} High-Res View`, "info")}
                className={`group relative overflow-hidden rounded-3xl border cursor-pointer ${photo.tall ? "row-span-2" : ""}`}
                style={{ borderColor: "rgba(212,175,55,0.1)", aspectRatio: photo.tall ? "3/4" : "4/3" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.45)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.1)")}
              >
                {/* Image with parallax scale */}
                <motion.img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.6 }}
                  onError={e => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80";
                  }}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Hover label */}
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-px w-6" style={{ background: "#d4af37" }} />
                    <span className="text-[8px] font-black tracking-[0.4em] uppercase" style={{ color: "#d4af37" }}>
                      HARLEY-DAVIDSON
                    </span>
                  </div>
                  <p className="text-white font-display font-black italic text-xl tracking-tight">{photo.label}</p>
                </div>

                {/* Corner HUD */}
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 opacity-0 group-hover:opacity-60 transition-all duration-300"
                  style={{ borderColor: "#d4af37" }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CINEMATIC VIDEO SECTION ────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden" style={{ background: "linear-gradient(180deg, #080500 0%, #050300 50%, #080500 100%)" }}>
        {/* Diagonal gold lines background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(212,175,55,0.8) 30px, rgba(212,175,55,0.8) 31px)" }} />

        {/* Gold center glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(212,175,55,0.06) 0%, transparent 60%)" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-14">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-16" style={{ background: "rgba(212,175,55,0.4)" }} />
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "#d4af37" }}
                animate={{ opacity: [1, 0.2, 1], scale: [1, 1.5, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
              <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-neutral-500">HD_REEL — LIVE FOOTAGE</span>
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "#d4af37" }}
                animate={{ opacity: [1, 0.2, 1], scale: [1, 1.5, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: 0.7 }}
              />
              <div className="h-px w-16" style={{ background: "rgba(212,175,55,0.4)" }} />
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase italic leading-none mb-4">
              <span className="text-white">Hear the</span>{" "}
              <span style={{ background: "linear-gradient(135deg, #d4af37, #f5d87e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Thunder.
              </span>
            </h2>
            <p className="text-neutral-600 text-sm max-w-md mx-auto">
              Pure Harley-Davidson power — from idle rumble to full throttle. This is what you&apos;re building for.
            </p>
          </motion.div>

          {/* Featured HD Video */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative group mb-12"
          >
            {/* Outer gold glow frame */}
            <div className="absolute -inset-1 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.3), transparent, rgba(212,175,55,0.3))" }} />

            <div className="relative rounded-[2.2rem] overflow-hidden border"
              style={{ borderColor: "rgba(212,175,55,0.2)", boxShadow: "0 0 80px rgba(212,175,55,0.08)" }}>

              {/* Scan-line overlay */}
              <div className="absolute inset-0 z-10 pointer-events-none opacity-20"
                style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.3) 3px, rgba(0,0,0,0.3) 4px)" }} />

              {/* YouTube iframe */}
              <div className="relative w-full aspect-video bg-[#050300]">
                <iframe
                  src="https://www.youtube-nocookie.com/embed/Gf8_PwCGYiY?rel=0&modestbranding=1&color=white&autoplay=1&mute=1"
                  title="Harley-Davidson Official Film"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Floating info tag */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute -left-4 top-8 hidden lg:flex flex-col gap-1 rounded-2xl px-5 py-4"
              style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)", backdropFilter: "blur(12px)" }}
            >
              <p className="text-[7px] font-black tracking-[0.3em] uppercase" style={{ color: "#d4af37" }}>OFFICIAL FILM</p>
              <p className="text-white font-display font-black italic text-sm">HARLEY-DAVIDSON</p>
              <p className="text-[8px] text-neutral-600 font-mono">American Thunder</p>
            </motion.div>

            {/* Right spec chip */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.65 }}
              className="absolute -right-4 bottom-8 hidden lg:flex flex-col gap-1 rounded-2xl px-5 py-4"
              style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)", backdropFilter: "blur(12px)" }}
            >
              <p className="text-[7px] font-black tracking-[0.3em] uppercase" style={{ color: "#d4af37" }}>ENGINE</p>
              <p className="text-white font-display font-black italic text-lg">1,868cc</p>
              <p className="text-[8px] text-neutral-600 font-mono">Milwaukee-Eight® V-Twin</p>
            </motion.div>
          </motion.div>

          {/* Secondary HD Videos */}
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { youtubeId: "PyQFdn5EmYA", title: "HERITAGE CLASSIC", sub: "The American Legend", chip: "CRUISER" },
              { youtubeId: "sQEgklEwhSo", title: "SPORTSTER S", sub: "New Era Revolution", chip: "SPORT" },
            ].map((v, i) => (
              <motion.div
                key={v.youtubeId}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.15 }}
                className="group relative rounded-[1.8rem] overflow-hidden border"
                style={{ borderColor: "rgba(212,175,55,0.12)" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.4)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.12)")}
              >
                {/* Scan lines */}
                <div className="absolute inset-0 z-10 pointer-events-none opacity-10"
                  style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.5) 3px, rgba(0,0,0,0.5) 4px)" }} />

                {/* Header bar */}
                <div className="flex items-center justify-between px-5 py-3 border-b"
                  style={{ borderColor: "rgba(212,175,55,0.1)", background: "rgba(212,175,55,0.04)" }}>
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: "#d4af37" }}
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.5 }}
                    />
                    <span className="text-[8px] font-black tracking-[0.4em] uppercase" style={{ color: "#d4af37" }}>{v.chip}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[7px] font-mono" style={{ color: "rgba(212,175,55,0.4)" }}>
                    HD_REEL_{String(i + 2).padStart(2, "0")}
                  </div>
                </div>

                <div className="w-full aspect-video bg-[#050300]">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}?rel=0&modestbranding=1&autoplay=1&mute=1`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>

                <div className="px-5 py-4" style={{ background: "rgba(212,175,55,0.02)" }}>
                  <p className="text-white font-display font-black italic">{v.title}</p>
                  <p className="text-[9px] text-neutral-600 mt-0.5">{v.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTS CATALOG ─────────────────────────────────────────────────── */}
      <section id="parts" className="py-32">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px w-12" style={{ background: "rgba(212,175,55,0.4)" }} />
                <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-neutral-500">HD_PARTS — PREMIUM CATALOG</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase italic leading-none">
                <span className="text-white">Built for</span><br />
                <span style={{ background: "linear-gradient(135deg, #d4af37, #f5d87e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  the Legend.
                </span>
              </h2>
            </div>
            <div className="flex items-center gap-3 shrink-0 border rounded-full px-6 py-3"
              style={{ borderColor: "rgba(212,175,55,0.25)", backgroundColor: "rgba(212,175,55,0.05)" }}>
              <Star className="w-4 h-4" style={{ color: "#d4af37" }} />
              <span className="text-xs font-bold text-white">Official HD Partner</span>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {HD_PARTS.map((part, i) => (
              <motion.div key={part.name}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -8, scale: 1.015 }}
                className="group relative rounded-3xl p-7 overflow-hidden cursor-pointer transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, rgba(212,175,55,0.04) 0%, rgba(10,8,2,1) 100%)",
                  border: "1px solid rgba(212,175,55,0.1)",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.35)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.1)")}
              >
                {/* Hot badge */}
                {part.hot && (
                  <div className="absolute top-5 right-5 flex items-center gap-1 text-[7px] font-black tracking-[0.3em] uppercase px-2 py-1 rounded-full"
                    style={{ backgroundColor: "rgba(212,175,55,0.15)", color: "#d4af37", border: "1px solid rgba(212,175,55,0.3)" }}>
                    <Star className="w-2 h-2 fill-current" /> HOT
                  </div>
                )}

                {/* Category tag */}
                <div className="inline-flex text-[8px] font-black tracking-[0.3em] uppercase px-3 py-1 rounded-full mb-5"
                  style={{ backgroundColor: "rgba(212,175,55,0.08)", color: "#d4af37", border: "1px solid rgba(212,175,55,0.15)" }}>
                  {part.tag}
                </div>

                <p className="text-[9px] text-neutral-600 uppercase tracking-[0.3em] mb-1">{part.category}</p>
                <h3 className="text-lg font-display font-black italic text-white tracking-tight mb-3 group-hover:text-yellow-400 transition-colors duration-300">
                  {part.name}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed mb-8">{part.desc}</p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-display font-black italic text-white">{part.price}</span>
                  <Magnetic>
                    <motion.button 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        showToast(`${part.name} Added to Cart!`, "success");
                      }}
                      className="group relative inline-flex items-center gap-2 text-black text-[9px] font-black tracking-widest uppercase px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer overflow-hidden"
                      style={{ background: "linear-gradient(135deg, #d4af37, #f5d87e)" }}>
                      {/* Internal Gold Shimmer */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl bg-white/30 -z-10" />
                      Add to Cart <ArrowRight className="w-3 h-3" />
                    </motion.button>
                  </Magnetic>
                </div>

                {/* Corner HUD */}
                <div className="absolute top-4 left-4 w-5 h-5 border-t border-l opacity-0 group-hover:opacity-60 transition-all duration-300"
                  style={{ borderColor: "#d4af37" }} />
                <div className="absolute bottom-4 right-4 w-5 h-5 border-b border-r opacity-0 group-hover:opacity-60 transition-all duration-300"
                  style={{ borderColor: "#d4af37" }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPONSOR CTA ───────────────────────────────────────────────────── */}
      <section className="relative py-32 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0d0a02 0%, #1a1200 50%, #0d0a02 100%)" }}>
        <div className="absolute inset-0 pointer-events-none opacity-5"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(212,175,55,0.5) 20px, rgba(212,175,55,0.5) 21px)" }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 70%)" }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Crown className="w-12 h-12 mx-auto mb-6" style={{ color: "#d4af37" }} />
            <p className="text-[9px] tracking-[0.6em] font-bold uppercase mb-4" style={{ color: "rgba(212,175,55,0.6)" }}>
              ApexMoto × Harley-Davidson — Official Partnership
            </p>
            <h2 className="text-6xl md:text-8xl font-display font-black italic uppercase tracking-tighter leading-none mb-8"
              style={{ background: "linear-gradient(135deg, #fff 30%, #d4af37 60%, #fff 90%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              RIDE LIKE<br />A LEGEND.
            </h2>
            <p className="text-lg max-w-xl mx-auto mb-12 text-neutral-400">
              Every bolt. Every chrome piece. Every upgrade. Sourced direct from Harley-Davidson&apos;s
              official parts network — exclusively through ApexMoto.
            </p>
            <Magnetic>
              <Link href="/#products"
                className="group relative inline-flex items-center gap-4 text-black font-display font-black italic uppercase tracking-wider px-12 py-5 text-lg transition-all duration-300 overflow-hidden"
                style={{ background: "linear-gradient(135deg, #d4af37, #f5d87e, #d4af37)" }}>
                {/* Gold Leaf Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl bg-[#d4af37]/60 -z-10" />
                Shop All HD Parts
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
              </Link>
            </Magnetic>
          </motion.div>
        </div>

        {/* Ghost text */}
        <div className="absolute -bottom-10 right-0 select-none pointer-events-none opacity-[0.04]">
          <p className="text-[14rem] font-display font-black italic leading-none tracking-tighter text-yellow-400">HD</p>
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
            className="fixed bottom-10 left-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl border backdrop-blur-xl"
            style={{ 
              backgroundColor: "rgba(10,8,2,0.85)", 
              borderColor: toast.type === "info" ? "rgba(255,255,255,0.2)" : "rgba(212,175,55,0.5)",
              boxShadow: toast.type === "info" ? "0 20px 40px rgba(0,0,0,0.5)" : "0 0 40px rgba(212,175,55,0.2), 0 20px 40px rgba(0,0,0,0.5)" 
            }}
          >
            {toast.type === "info" ? (
              <Zap className="w-5 h-5 text-white/50" />
            ) : (
              <Crown className="w-5 h-5 text-[#d4af37]" />
            )}
            <span className="text-sm font-bold uppercase tracking-widest text-white mt-0.5">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
