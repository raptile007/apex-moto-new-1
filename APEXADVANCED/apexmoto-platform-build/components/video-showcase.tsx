"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Play, X, ExternalLink, Clock, Eye, Flame } from "lucide-react";

const VIDEOS = [
  {
    id: "himalayan",
    youtubeId: "AGX3eZrGNao",
    title: "HIMALAYAN 450",
    subtitle: "Official Launch Film",
    tag: "ROYAL ENFIELD",
    duration: "3:42",
    views: "2.4M",
    accent: "#ff4d00",
    gradient: "from-orange-950 via-stone-900 to-stone-950",
    statLine: "452cc · DOHC · 40 BHP",
    thumbHq: "https://img.youtube.com/vi/AGX3eZrGNao/hqdefault.jpg",
    featured: true,
  },
  {
    id: "ktm",
    youtubeId: "Bx6aR8HBUP4",
    title: "KTM 390 DUKE",
    subtitle: "Beast Unleashed",
    tag: "KTM",
    duration: "2:18",
    views: "1.8M",
    accent: "#f97316",
    gradient: "from-orange-900 via-zinc-900 to-zinc-950",
    statLine: "373cc · LC4C · 43 BHP",
    thumbHq: "https://img.youtube.com/vi/Bx6aR8HBUP4/hqdefault.jpg",
    featured: false,
  },
  {
    id: "harley",
    youtubeId: "p5S9pHhSuuY",
    title: "HARLEY-DAVIDSON",
    subtitle: "American Thunder",
    tag: "HARLEY",
    duration: "1:55",
    views: "3.1M",
    accent: "#eab308",
    gradient: "from-yellow-950 via-stone-900 to-stone-950",
    statLine: "1,868cc · V-Twin · 94 lb-ft",
    thumbHq: "https://img.youtube.com/vi/p5S9pHhSuuY/hqdefault.jpg",
    featured: false,
  },
  {
    id: "superbike",
    youtubeId: "R-4F4z6ePg4",
    title: "SUPERBIKE REEL",
    subtitle: "On the Edge",
    tag: "ACTION",
    duration: "4:10",
    views: "980K",
    accent: "#3b82f6",
    gradient: "from-blue-950 via-slate-900 to-slate-950",
    statLine: "MULTI-BIKE · TRACK DAY",
    thumbHq: "https://img.youtube.com/vi/R-4F4z6ePg4/hqdefault.jpg",
    featured: false,
  },
  {
    id: "himalayan-custom",
    youtubeId: "loEe0XUEnZ8",
    title: "EXPEDITION BUILD",
    subtitle: "Custom Himalayan",
    tag: "CUSTOM BUILD",
    duration: "5:20",
    views: "850K",
    accent: "#ff4d00",
    gradient: "from-orange-950 via-stone-900 to-stone-950",
    statLine: "RALLY SPEC · 452cc · TACTICAL",
    thumbHq: "https://img.youtube.com/vi/loEe0XUEnZ8/hqdefault.jpg",
    featured: false,
  },
];

// Animated noise/static overlay
function StaticOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px",
      }}
    />
  );
}

// Pulsing "LIVE" indicator
function LiveBadge({ accent }: { accent: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <motion.div
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: accent }}
        animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />
      <span className="text-[8px] font-black tracking-[0.3em] uppercase" style={{ color: accent }}>
        HD
      </span>
    </div>
  );
}

// ── Featured Card ────────────────────────────────────────────────────────────
function FeaturedCard({ video, onClick }: { video: typeof VIDEOS[0]; onClick: () => void }) {
  const [imgOk, setImgOk] = useState(true);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="lg:col-span-2 group relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/[0.08] cursor-pointer"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      whileHover={{ scale: 1.01 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Gradient base — always visible */}
      <div className={`absolute inset-0 bg-gradient-to-br ${video.gradient}`} />

      {/* Thumbnail image (on top of gradient) */}
      {imgOk && (
        <img
          src={video.thumbHq}
          alt={video.title}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-80"
          onError={() => setImgOk(false)}
        />
      )}

      {/* Static noise texture */}
      <StaticOverlay />

      {/* Cinematic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

      {/* Top HUD bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-7 py-5 z-10">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-[8px] font-black tracking-[0.3em] uppercase border"
          style={{ backgroundColor: `${video.accent}20`, borderColor: `${video.accent}40`, color: video.accent }}
        >
          <Flame className="w-2.5 h-2.5" />
          {video.tag}
        </div>
        <div className="flex items-center gap-3">
          <LiveBadge accent={video.accent} />
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
            <Clock className="w-2.5 h-2.5 text-neutral-400" />
            <span className="text-[8px] font-mono text-neutral-300">{video.duration}</span>
          </div>
        </div>
      </div>

      {/* Animated scan-line on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute left-0 w-full h-[2px] z-10 pointer-events-none"
            style={{ background: `linear-gradient(90deg, transparent, ${video.accent}, transparent)` }}
            initial={{ top: "0%", opacity: 0 }}
            animate={{ top: ["0%", "100%"], opacity: [0, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        )}
      </AnimatePresence>

      {/* Center play button */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <motion.div
          animate={{ scale: hovered ? 1.15 : 1 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          {/* Ripple rings */}
          {hovered && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: video.accent }}
                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: video.accent }}
                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              />
            </>
          )}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center border-2 backdrop-blur-md transition-all duration-300"
            style={{
              backgroundColor: hovered ? `${video.accent}CC` : "rgba(0,0,0,0.5)",
              borderColor: hovered ? video.accent : "rgba(255,255,255,0.3)",
              boxShadow: hovered ? `0 0 40px ${video.accent}80` : "none",
            }}
          >
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </div>
        </motion.div>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-7 z-10">
        {/* Stat line */}
        <motion.p
          className="text-[9px] font-mono tracking-[0.3em] mb-2 uppercase"
          style={{ color: video.accent }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          ▶ {video.statLine}
        </motion.p>
        <p className="text-neutral-400 text-[9px] uppercase tracking-[0.3em] mb-1">{video.subtitle}</p>
        <h3 className="text-4xl font-display font-black italic text-white tracking-tighter">{video.title}</h3>

        {/* Progress bar / duration */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: video.accent }}
              initial={{ width: "0%" }}
              animate={{ width: hovered ? "35%" : "0%" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
          <div className="flex items-center gap-1.5 text-neutral-500">
            <Eye className="w-3 h-3" />
            <span className="text-[8px] font-mono">{video.views}</span>
          </div>
        </div>
      </div>

      {/* Corner HUD brackets */}
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-transparent group-hover:border-white/30 transition-all duration-500 rounded-tr-sm z-10" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-transparent group-hover:border-white/30 transition-all duration-500 rounded-bl-sm z-10" />
    </motion.div>
  );
}

// ── Small Card ───────────────────────────────────────────────────────────────
function SmallCard({ video, index, onClick }: { video: typeof VIDEOS[0]; index: number; onClick: () => void }) {
  const [imgOk, setImgOk] = useState(true);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="group relative flex-1 rounded-[1.5rem] overflow-hidden border border-white/[0.08] cursor-pointer min-h-[150px]"
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      whileHover={{ scale: 1.02, x: -4 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Gradient base */}
      <div className={`absolute inset-0 bg-gradient-to-br ${video.gradient}`} />

      {/* Thumbnail */}
      {imgOk && (
        <img
          src={video.thumbHq}
          alt={video.title}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 opacity-50 group-hover:opacity-70"
          onError={() => setImgOk(false)}
        />
      )}

      <StaticOverlay />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/20" />

      {/* Animated left accent bar */}
      <motion.div
        className="absolute left-0 top-0 w-1 rounded-r-full"
        style={{ backgroundColor: video.accent }}
        initial={{ height: "0%" }}
        animate={{ height: hovered ? "100%" : "30%" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      {/* Scan line */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute left-0 right-0 h-px z-10 pointer-events-none"
            style={{ background: `linear-gradient(90deg, ${video.accent}80, transparent)` }}
            initial={{ top: 0, opacity: 0 }}
            animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-5 py-4 gap-4">
        {/* Play button */}
        <motion.div
          animate={{ scale: hovered ? 1.1 : 1 }}
          className="relative shrink-0"
        >
          {hovered && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: video.accent }}
              animate={{ scale: [1, 2], opacity: [0.4, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300"
            style={{
              backgroundColor: hovered ? video.accent : "rgba(0,0,0,0.5)",
              borderColor: hovered ? video.accent : "rgba(255,255,255,0.2)",
              boxShadow: hovered ? `0 0 20px ${video.accent}60` : "none",
            }}
          >
            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
          </div>
        </motion.div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div
            className="inline-flex items-center gap-1.5 text-[7px] font-black tracking-[0.3em] uppercase mb-1"
            style={{ color: video.accent }}
          >
            <LiveBadge accent={video.accent} />
            <span className="ml-0.5">{video.tag}</span>
          </div>
          <p className="text-white font-display font-black italic text-base tracking-tight leading-tight truncate">
            {video.title}
          </p>
          <p className="text-neutral-500 text-[9px] mt-0.5 truncate">{video.subtitle}</p>

          {/* Stat line */}
          <p className="text-[8px] font-mono mt-2 truncate" style={{ color: `${video.accent}99` }}>
            {video.statLine}
          </p>
        </div>

        {/* Right side info */}
        <div className="shrink-0 flex flex-col items-end gap-2">
          <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-full border border-white/10">
            <Clock className="w-2.5 h-2.5 text-neutral-500" />
            <span className="text-[8px] font-mono text-neutral-400">{video.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-2.5 h-2.5 text-neutral-600" />
            <span className="text-[8px] font-mono text-neutral-600">{video.views}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function VideoShowcase() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const activeData = VIDEOS.find((v) => v.id === activeVideo);

  return (
    <section className="relative py-24 bg-[#050505] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(ellipse, rgba(255,77,0,0.9) 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="h-px w-12 bg-white/20" />
              <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-[0.4em]">
                APEX_REELS — LIVE FOOTAGE
              </span>
              {/* Pulsing dot */}
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-apex-orange"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase italic leading-none text-white">
              Feel the <span className="text-apex-orange">Machine.</span>
            </h2>
          </div>
          <p className="text-neutral-600 text-sm max-w-xs leading-relaxed">
            Watch these bikes in their element — then build yours with
            ApexMoto performance parts.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <FeaturedCard video={VIDEOS[0]} onClick={() => setActiveVideo(VIDEOS[0].id)} />
          <div className="flex flex-col gap-4">
            {VIDEOS.slice(1).map((v, i) => (
              <SmallCard key={v.id} video={v} index={i} onClick={() => setActiveVideo(v.id)} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Lightbox ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeVideo && activeData && (
          <motion.div
            className="fixed inset-0 z-[9000] flex items-center justify-center p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
          >
            <div className="absolute inset-0 bg-black/93 backdrop-blur-xl" />

            <motion.div
              className="relative z-10 w-full max-w-5xl"
              initial={{ scale: 0.88, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.88, y: 40, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 px-1">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.4em] mb-1" style={{ color: activeData.accent }}>
                    {activeData.tag} · APEX_REELS
                  </p>
                  <h3 className="text-2xl font-display font-black italic text-white tracking-tighter uppercase">
                    {activeData.title} <span className="text-neutral-500 font-light not-italic text-base">— {activeData.subtitle}</span>
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={`https://www.youtube.com/watch?v=${activeData.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-neutral-600 hover:text-white text-[9px] uppercase tracking-widest font-bold transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    YouTube
                  </a>
                  <button
                    onClick={() => setActiveVideo(null)}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-apex-orange border border-white/10 hover:border-apex-orange flex items-center justify-center transition-all duration-200"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.9)]">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeData.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={activeData.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              <div className="flex items-center justify-between mt-3 px-1">
                <p className="text-neutral-700 text-[9px] font-mono uppercase tracking-widest">
                  APEX_REELS — Performance in Motion
                </p>
                <div className="flex items-center gap-3 text-neutral-700 text-[9px] font-mono">
                  <span>{activeData.duration}</span>
                  <span>·</span>
                  <span>{activeData.views} views</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
