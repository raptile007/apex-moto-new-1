"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Crosshair, Navigation, Activity, Zap, Compass, MapPin, Radio, Globe, Shield } from "lucide-react"

export function TacticalHud() {
  const [telemetry, setTelemetry] = useState({
    speed: 0,
    lean: 0,
    gForce: 1.0,
    tireTemp: 35,
    rpm: 0
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        speed: Math.max(180, Math.min(299, prev.speed + (Math.random() > 0.5 ? 1 : -1))),
        lean: Math.max(-50, Math.min(50, prev.lean + (Math.random() > 0.5 ? 2 : -2))),
        gForce: parseFloat((1.2 + Math.random() * 0.4).toFixed(2)),
        tireTemp: Math.max(70, Math.min(95, prev.tireTemp + (Math.random() > 0.5 ? 0.5 : -0.5))),
        rpm: Math.max(8000, Math.min(13000, prev.rpm + (Math.random() > 0.5 ? 100 : -100)))
      }))
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden select-none hidden lg:block">
       {/* Left HUD: Critical Stats */}
       <div className="absolute left-10 top-1/2 -translate-y-1/2 space-y-12">
          <div className="relative">
             <div className="absolute -left-4 top-0 bottom-0 w-1 bg-apex-orange/30 rounded-full" />
             <div className="space-y-1">
                <span className="text-[8px] font-black text-apex-orange tracking-[0.3em] uppercase">MISSION_TELEMETRY</span>
                <div className="flex items-baseline gap-2">
                   <span className="text-6xl font-display font-black italic text-white tracking-tighter">{telemetry.speed}</span>
                   <span className="text-xs font-black text-neutral-500 uppercase">KM/H</span>
                </div>
             </div>
             <div className="mt-4 w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-apex-orange" 
                  animate={{ width: `${(telemetry.speed / 300) * 100}%` }} 
                />
             </div>
          </div>

          <div className="space-y-6">
             {[
               { label: "LEAN_ANGLE", val: telemetry.lean, unit: "°", icon: Navigation },
               { label: "G_FORCE", val: telemetry.gForce, unit: "G", icon: Zap },
               { label: "TIRE_TEMP", val: telemetry.tireTemp, unit: "°C", icon: Activity },
             ].map((stat) => (
               <div key={stat.label} className="flex items-center gap-4 group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-apex-orange/50">
                     <stat.icon className="w-4 h-4" />
                  </div>
                  <div>
                     <p className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">{stat.label}</p>
                     <p className="text-sm font-display font-black italic text-white">{stat.val}{stat.unit}</p>
                  </div>
               </div>
             ))}
          </div>
       </div>

       {/* Right HUD: Navigation & Satellite */}
       <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col items-end space-y-12">
          <div className="w-64 h-64 relative">
             <svg className="w-full h-full transform -rotate-90">
                <circle cx="128" cy="128" r="100" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <circle cx="128" cy="128" r="80" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <motion.circle 
                  cx="128" cy="128" r="100" 
                  fill="none" stroke="var(--apex-accent, #ff4d00)" 
                  strokeWidth="2" strokeDasharray="10 390" 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }} 
                />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center">
                <Compass className="w-8 h-8 text-white/20 animate-pulse" />
             </div>
             <div className="absolute top-0 right-0 p-4 text-right">
                <span className="text-[8px] font-black text-apex-orange uppercase tracking-[0.2em]">SAT_LINK_ACTIVE</span>
                <p className="text-[10px] font-black text-white italic">BUDDH_INTL_CIRCUIT</p>
             </div>
          </div>

          <div className="space-y-6 text-right">
             <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                <div className="flex items-center gap-3 justify-end mb-2">
                   <span className="text-[8px] font-black text-emerald-500 uppercase">SYSTEM_STABLE</span>
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                </div>
                <p className="text-[10px] font-black text-neutral-400 leading-relaxed uppercase tracking-widest">
                   GPS_LOCK: 14 SATELLITES<br />
                   ENCRYPTION: AES_256<br />
                   LATENCY: 12MS
                </p>
             </div>
          </div>
       </div>

       {/* Bottom HUD: Scanning Lines */}
       <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl">
          <div className="flex items-end justify-between px-8 mb-4">
             <div className="flex gap-1 h-12 items-end">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-apex-orange/20"
                    animate={{ height: [10, Math.random() * 40, 10] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                  />
                ))}
             </div>
             <div className="text-right">
                <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">AUDIO_COMMS</span>
                <p className="text-[10px] font-black text-white italic">CH_04 // FREQ: 442.5 MHz</p>
             </div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
       </div>

       {/* Screen Edge Scanning */}
       <div className="absolute inset-0 border-[20px] border-white/[0.02] pointer-events-none" />
       <motion.div 
         className="absolute inset-x-0 h-px bg-apex-orange/10 z-50"
         animate={{ top: ["0%", "100%", "0%"] }}
         transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
       />
    </div>
  )
}
