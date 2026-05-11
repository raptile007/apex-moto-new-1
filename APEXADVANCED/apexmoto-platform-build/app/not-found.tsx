import Link from "next/link"
import { Crown } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-4 overflow-hidden relative">
      {/* CRT scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.04) 3px, rgba(255,255,255,0.04) 4px)",
        }}
      />

      {/* Orange glow centre */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none opacity-10"
        style={{ background: "radial-gradient(ellipse, rgba(255,77,0,0.9) 0%, transparent 70%)" }}
      />

      {/* Corner brackets */}
      {["top-8 left-8 border-t-2 border-l-2", "top-8 right-8 border-t-2 border-r-2",
        "bottom-8 left-8 border-b-2 border-l-2", "bottom-8 right-8 border-b-2 border-r-2"].map((cls, i) => (
        <div key={i} className={`absolute w-10 h-10 border-apex-orange/30 ${cls}`} />
      ))}

      <div className="relative z-10 text-center max-w-2xl">
        {/* Glitch 404 */}
        <div className="relative mb-6 select-none">
          <p
            className="text-[12rem] md:text-[18rem] font-display font-black italic leading-none text-white/[0.04] tracking-tighter pointer-events-none"
          >
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <h1
              className="text-8xl md:text-[10rem] font-display font-black italic tracking-tighter text-white leading-none"
              style={{ textShadow: "3px 0 #ff4d00, -3px 0 rgba(255,77,0,0.3)" }}
            >
              404
            </h1>
          </div>
        </div>

        {/* Label */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-12 bg-apex-orange/50" />
          <span className="text-apex-orange text-[9px] font-black tracking-[0.5em] uppercase font-mono">
            SIGNAL_LOST — PAGE_NOT_FOUND
          </span>
          <div className="h-px w-12 bg-apex-orange/50" />
        </div>

        <p className="text-neutral-500 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          The route you&apos;re looking for has gone off-road.
          Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 bg-apex-orange hover:bg-apex-orange/90 text-white font-display font-black italic uppercase tracking-wider px-10 py-4 transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,77,0,0.4)]"
          >
            Return to Base
          </Link>
          <Link
            href="/#products"
            className="inline-flex items-center gap-3 border border-white/15 hover:border-apex-orange/50 text-white font-display font-bold italic uppercase tracking-wider px-10 py-4 transition-all duration-300"
          >
            Shop Parts
          </Link>
        </div>

        {/* HD Sponsor micro badge */}
        <div className="mt-16 flex items-center justify-center gap-2 opacity-30">
          <Crown className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-[9px] text-yellow-400 font-bold tracking-[0.4em] uppercase">
            ApexMoto × Official H-D Partner
          </span>
          <Crown className="w-3.5 h-3.5 text-yellow-400" />
        </div>
      </div>
    </div>
  );
}
