"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Zap, Target, Timer, Map, Wind, Activity, TrendingUp, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"

const TRACKS = [
  { id: "buddh", name: "BUDDH_INTL_CIRCUIT", length: "5.12KM", turns: 16, difficulty: "EXPERT", color: "#ff4d00" },
  { id: "silverstone", name: "SILVERSTONE_UK", length: "5.89KM", turns: 18, difficulty: "PRO", color: "#00f2ff" },
  { id: "suzuka", name: "SUZUKA_JAPAN", length: "5.80KM", turns: 18, difficulty: "ELITE", color: "#ff0055" },
]

export function AiStrategist() {
  const { selectedParts } = useStore()
  const [selectedTrack, setSelectedTrack] = useState(TRACKS[0])
  const [mode, setMode] = useState<"QUALIFYING" | "RACE">("QUALIFYING")

  const analysis = useMemo(() => {
    // Calculate performance based on selected parts
    const performanceScore = Object.values(selectedParts).reduce((acc, part) => acc + (part?.specs?.performance || 0), 0)
    const baseTime = 120 // 2 minutes
    const lapTime = (baseTime - (performanceScore / 50)).toFixed(3)
    const tyreWear = (mode === "RACE" ? 45 : 12) + (performanceScore > 200 ? 5 : 0)
    
    return {
      lapTime,
      topSpeed: 280 + (performanceScore / 10),
      tyreWear,
      fuelEfficiency: 85 - (performanceScore / 20),
      consistency: performanceScore > 150 ? "98.4%" : "92.1%"
    }
  }, [selectedParts, mode])

  return (
    <div className="w-full bg-[#050505] border border-white/5 rounded-[4rem] overflow-hidden relative group">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,77,0,0.05)_0%,transparent_50%)]" />
       
       <div className="grid lg:grid-cols-2 gap-0 relative z-10">
          {/* Left Side: Configuration */}
          <div className="p-12 border-r border-white/5 space-y-12">
             <div className="space-y-4">
                <div className="flex items-center gap-4">
                   <div className="w-2 h-2 rounded-full bg-apex-orange animate-pulse" />
                   <span className="text-[10px] font-black text-apex-orange uppercase tracking-[0.5em]">STRATEGIC_SIMULATOR_V4.1</span>
                </div>
                <h3 className="text-5xl font-display font-black text-white italic uppercase tracking-tighter leading-tight">
                   AI_STRATEGIST
                </h3>
             </div>

             <div className="space-y-8">
                <div className="space-y-4">
                   <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block">TARGET_CIRCUIT</span>
                   <div className="grid grid-cols-1 gap-2">
                      {TRACKS.map(track => (
                        <button
                          key={track.id}
                          onClick={() => setSelectedTrack(track)}
                          className={`flex items-center justify-between p-6 rounded-3xl border transition-all ${
                            selectedTrack.id === track.id
                              ? "bg-apex-orange border-apex-orange text-white"
                              : "bg-white/5 border-white/5 text-neutral-400 hover:bg-white/10"
                          }`}
                        >
                           <div className="flex items-center gap-4">
                              <Map className="w-5 h-5" />
                              <div className="text-left">
                                 <p className="text-xs font-black uppercase tracking-wider">{track.name}</p>
                                 <p className={`text-[10px] font-black uppercase opacity-60 ${selectedTrack.id === track.id ? "text-white" : "text-neutral-500"}`}>{track.length} // {track.turns} TURNS</p>
                              </div>
                           </div>
                           <div className={`px-3 py-1 rounded-full text-[8px] font-black ${selectedTrack.id === track.id ? "bg-white/20" : "bg-white/5"}`}>
                              {track.difficulty}
                           </div>
                        </button>
                      ))}
                   </div>
                </div>

                <div className="flex gap-4">
                   {["QUALIFYING", "RACE"].map((m) => (
                     <button
                       key={m}
                       onClick={() => setMode(m as any)}
                       className={`flex-1 h-14 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                         mode === m 
                           ? "bg-white text-black border-white" 
                           : "bg-white/5 border-white/5 text-neutral-500"
                       }`}
                     >
                       {m}_MODE
                     </button>
                   ))}
                </div>
             </div>
          </div>

          {/* Right Side: Results */}
          <div className="bg-white/[0.01] p-12 space-y-12">
             <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-neutral-500">
                      <Timer className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">EST_LAP_TIME</span>
                   </div>
                   <p className="text-5xl font-display font-black text-white italic tracking-tighter">
                      {analysis.lapTime.split('.')[0]}<span className="text-apex-orange text-3xl">.{analysis.lapTime.split('.')[1]}</span>
                   </p>
                </div>
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-neutral-500">
                      <Zap className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">PROJECTED_TOP_SPEED</span>
                   </div>
                   <p className="text-5xl font-display font-black text-white italic tracking-tighter">
                      {Math.round(analysis.topSpeed)}<span className="text-neutral-500 text-xl uppercase ml-2 italic font-black">KM/H</span>
                   </p>
                </div>
             </div>

             <div className="p-8 bg-white/5 border border-white/5 rounded-[2rem] space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                   <Activity className="w-6 h-6 text-apex-orange/20" />
                </div>
                
                <div className="space-y-6">
                   <div className="space-y-4">
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">TYRE_DEGRADATION_EST</span>
                         <span className="text-[10px] font-black text-red-500 italic">-{analysis.tyreWear}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                         <motion.div 
                           className="h-full bg-red-500"
                           initial={{ width: 0 }}
                           animate={{ width: `${analysis.tyreWear}%` }}
                         />
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">AERODYNAMIC_CONSISTENCY</span>
                         <span className="text-[10px] font-black text-emerald-500 italic">{analysis.consistency}</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                         <motion.div 
                           className="h-full bg-emerald-500"
                           initial={{ width: 0 }}
                           animate={{ width: analysis.consistency }}
                         />
                      </div>
                   </div>
                </div>
             </div>

             <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 bg-apex-orange/5 border border-apex-orange/20 rounded-3xl">
                   <AlertTriangle className="w-5 h-5 text-apex-orange shrink-0" />
                   <div>
                      <p className="text-[10px] font-black text-apex-orange uppercase tracking-widest mb-1">STRATEGY_BRIEF</p>
                      <p className="text-xs text-neutral-300 leading-relaxed uppercase">
                         Current build optimized for {selectedTrack.name}. {mode === "RACE" ? "Recommend conservative throttle map in Sector 2 to manage heat." : "Sector 1 split suggests potential for 0.4s improvement with lighter rims."}
                      </p>
                   </div>
                </div>
                
                <Button className="w-full h-16 bg-white hover:bg-neutral-200 text-black font-black italic uppercase tracking-tighter text-lg rounded-2xl gap-3">
                   <TrendingUp className="w-5 h-5" />
                   GENERATE_FULL_SIMULATION
                </Button>
             </div>
          </div>
       </div>
    </div>
  )
}
