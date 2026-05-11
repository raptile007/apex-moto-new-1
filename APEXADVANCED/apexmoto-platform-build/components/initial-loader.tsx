"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const BOOT_LINES = [
  { text: "APEX_CORE v4.7.0 — SYSTEM INITIALIZATION", status: "OK" },
  { text: "LOADING TACTICAL ENGINEERING SUITE", status: "OK" },
  { text: "CALIBRATING PERFORMANCE METRICS", status: "OK" },
  { text: "INJECTING FUEL SYSTEM PROTOCOLS", status: "OK" },
  { text: "MOUNTING DRIVE UNITS", status: "OK" },
  { text: "ENGINE DIAGNOSTICS", status: "GO" },
  { text: "APEX_MOTO — ALL SYSTEMS READY", status: "ARMED" },
];

// Radial arc SVG for the speedometer needle
function NeedleGauge({ progress }: { progress: number }) {
  const r = 90;
  const cx = 110;
  const cy = 110;
  // Arc goes from -210° to 30° (240° sweep, bottom-right to bottom-left)
  const startAngle = -210;
  const sweepAngle = 240;
  const endAngle = startAngle + (sweepAngle * progress) / 100;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcX = (angle: number) => cx + r * Math.cos(toRad(angle));
  const arcY = (angle: number) => cy + r * Math.sin(toRad(angle));

  // Full background arc
  const bgEnd = startAngle + sweepAngle;
  const bgPath = `M ${arcX(startAngle)} ${arcY(startAngle)} A ${r} ${r} 0 1 1 ${arcX(bgEnd)} ${arcY(bgEnd)}`;

  // Filled progress arc
  const largeArc = sweepAngle * progress / 100 > 180 ? 1 : 0;
  const fgPath = progress > 0
    ? `M ${arcX(startAngle)} ${arcY(startAngle)} A ${r} ${r} 0 ${largeArc} 1 ${arcX(endAngle)} ${arcY(endAngle)}`
    : null;

  // Needle tip
  const needleX = cx + (r - 10) * Math.cos(toRad(endAngle));
  const needleY = cy + (r - 10) * Math.sin(toRad(endAngle));

  const isHot = progress > 75;
  const isWarm = progress > 45;
  const progressColor = isHot ? "#ff4d00" : isWarm ? "#ffaa00" : "#ffffff";

  return (
    <svg width="220" height="160" viewBox="0 0 220 160">
      {/* Defs */}
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="gaugeGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={progressColor} stopOpacity="0.2" />
          <stop offset="100%" stopColor={progressColor} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient glow */}
      {progress > 60 && (
        <circle cx={cx} cy={cy} r={r + 20} fill="url(#gaugeGrad)" opacity="0.8" />
      )}

      {/* Track ticks */}
      {Array.from({ length: 25 }).map((_, i) => {
        const angle = startAngle + (sweepAngle / 24) * i;
        const inner = r - 8;
        const outer = r + 4;
        const isMajor = i % 6 === 0;
        return (
          <line
            key={i}
            x1={cx + inner * Math.cos(toRad(angle))}
            y1={cy + inner * Math.sin(toRad(angle))}
            x2={cx + outer * Math.cos(toRad(angle))}
            y2={cy + outer * Math.sin(toRad(angle))}
            stroke={i / 24 <= progress / 100 ? progressColor : "rgba(255,255,255,0.08)"}
            strokeWidth={isMajor ? 2.5 : 1}
          />
        );
      })}

      {/* Background arc */}
      <path
        d={bgPath}
        fill="none"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Progress arc */}
      {fgPath && (
        <path
          d={fgPath}
          fill="none"
          stroke={progressColor}
          strokeWidth="6"
          strokeLinecap="round"
          filter={isHot ? "url(#glow)" : undefined}
        />
      )}

      {/* Needle line */}
      <line
        x1={cx}
        y1={cy}
        x2={needleX}
        y2={needleY}
        stroke={progressColor}
        strokeWidth="2"
        strokeLinecap="round"
        filter={isHot ? "url(#glow)" : undefined}
      />
      {/* Needle pivot */}
      <circle cx={cx} cy={cy} r="5" fill={progressColor} />
      <circle cx={cx} cy={cy} r="2.5" fill="#050505" />
    </svg>
  );
}

export function InitialLoader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [rpm, setRpm] = useState(0);
  const [bootLine, setBootLine] = useState(-1);
  const [exiting, setExiting] = useState(false);
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; delay: number }[]>([]);

  // Generate particles on mount
  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 2,
      }))
    );
  }, []);

  // Main progress/RPM animation
  useEffect(() => {
    let frame: number;
    let startTime: number | null = null;
    const duration = 2800;

    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      // Cubic ease-in-out with a slight "rev" plateau
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setRpm(Math.round(eased * 9800));
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setExiting(true), 600);
        setTimeout(() => setVisible(false), 1400);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Stagger boot lines
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setBootLine(i);
      i++;
      if (i >= BOOT_LINES.length) clearInterval(interval);
    }, 380);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  const isHot = progress > 75;
  const isWarm = progress > 45;
  const rpmColor = isHot ? "#ff4d00" : isWarm ? "#ffaa00" : "#ffffff";

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="apex-loader"
          className="fixed inset-0 z-[99999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden select-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* CRT Scanlines */}
          <div
            className="pointer-events-none absolute inset-0 z-[1]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)",
            }}
          />

          {/* Floating ambient particles */}
          {particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-apex-orange/40"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
              animate={{ y: [0, -30, 0], opacity: [0, 0.6, 0] }}
              transition={{ duration: 3 + p.delay, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
            />
          ))}

          {/* Corner HUD brackets */}
          {[
            "top-6 left-6 border-t-2 border-l-2",
            "top-6 right-6 border-t-2 border-r-2",
            "bottom-6 left-6 border-b-2 border-l-2",
            "bottom-6 right-6 border-b-2 border-r-2",
          ].map((cls, i) => (
            <motion.div
              key={i}
              className={`absolute w-8 h-8 border-apex-orange/40 ${cls}`}
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
            />
          ))}

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-xl px-6">

            {/* Wordmark */}
            <motion.div
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-1"
            >
              <div className="flex items-center gap-3 mb-1">
                <motion.div
                  className="h-px bg-apex-orange/60"
                  initial={{ width: 0 }}
                  animate={{ width: 48 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
                <span className="text-[9px] tracking-[0.6em] text-apex-orange font-bold uppercase font-display">
                  ApexMoto
                </span>
                <motion.div
                  className="h-px bg-apex-orange/60"
                  initial={{ width: 0 }}
                  animate={{ width: 48 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
              <h1 className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter uppercase italic leading-none">
                APEX
              </h1>
              <p className="text-[10px] text-neutral-600 font-mono tracking-[0.4em] uppercase mt-1">
                Performance Engineering Suite
              </p>
            </motion.div>

            {/* Gauge + RPM */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-2"
            >
              <NeedleGauge progress={progress} />
              <div className="flex items-end gap-2 -mt-4">
                <motion.span
                  className="text-5xl font-mono font-black tabular-nums leading-none"
                  style={{
                    color: rpmColor,
                    textShadow: isHot ? `0 0 24px ${rpmColor}` : "none",
                    transition: "color 0.12s, text-shadow 0.12s",
                  }}
                >
                  {rpm.toLocaleString()}
                </motion.span>
                <span className="text-neutral-600 text-xs font-mono uppercase tracking-widest mb-1">
                  RPM
                </span>
              </div>
            </motion.div>

            {/* Segmented bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="w-full flex flex-col gap-2"
            >
              <div className="flex gap-[3px] w-full">
                {Array.from({ length: 40 }).map((_, i) => {
                  const threshold = ((i + 1) / 40) * 100;
                  const isActive = progress >= threshold;
                  const hot = threshold > 72;
                  const warm = threshold > 40;
                  return (
                    <div
                      key={i}
                      className="flex-1 h-[6px] rounded-sm transition-all duration-75"
                      style={{
                        backgroundColor: isActive
                          ? hot ? "#ff4d00" : warm ? "#ffaa00" : "#fff"
                          : "rgba(255,255,255,0.07)",
                        boxShadow: isActive && hot
                          ? "0 0 8px rgba(255,77,0,0.7)"
                          : "none",
                      }}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between">
                <span className="text-[9px] font-mono text-neutral-700 uppercase tracking-widest">
                  BOOT SEQUENCE
                </span>
                <span className="text-[9px] font-mono font-bold" style={{ color: rpmColor }}>
                  {progress}%
                </span>
              </div>
            </motion.div>

            {/* Terminal log */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="w-full bg-white/[0.025] border border-white/[0.05] rounded-2xl p-4 font-mono text-[9px] min-h-[90px] flex flex-col gap-[5px] overflow-hidden"
            >
              {BOOT_LINES.slice(0, bootLine + 1).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-apex-orange shrink-0">▶</span>
                  <span className={i === bootLine ? "text-white/70" : "text-neutral-700 line-through"}>
                    {line.text}
                  </span>
                  {i < bootLine && (
                    <span className="ml-auto text-emerald-500 shrink-0">[ {line.status} ]</span>
                  )}
                  {i === bootLine && i === BOOT_LINES.length - 1 && (
                    <span className="ml-auto text-apex-orange shrink-0 animate-pulse">
                      [ {line.status} ]
                    </span>
                  )}
                </motion.div>
              ))}
              {/* Blinking caret */}
              <motion.span
                className="w-[7px] h-[11px] bg-apex-orange inline-block ml-5 mt-[2px]"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.55, repeat: Infinity }}
              />
            </motion.div>
          </div>

          {/* Bottom progress bar */}
          <div
            className="absolute bottom-0 left-0 h-[3px] bg-apex-orange transition-all duration-75"
            style={{
              width: `${progress}%`,
              boxShadow: isHot ? "0 0 12px #ff4d00" : "none",
            }}
          />
        </motion.div>
      )}

      {/* Dramatic multi-panel wipe exit */}
      {exiting && (
        <>
          {/* Centre horizontal slash */}
          <motion.div
            key="exit-top"
            className="fixed top-0 left-0 w-full h-1/2 bg-[#050505] z-[99999]"
            initial={{ y: 0 }}
            animate={{ y: "-100%" }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            key="exit-bottom"
            className="fixed bottom-0 left-0 w-full h-1/2 bg-[#050505] z-[99999]"
            initial={{ y: 0 }}
            animate={{ y: "100%" }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          />
          {/* Orange flash */}
          <motion.div
            key="flash"
            className="fixed inset-0 bg-apex-orange z-[99998]"
            initial={{ opacity: 0.25 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </>
      )}
    </AnimatePresence>
  );
}
