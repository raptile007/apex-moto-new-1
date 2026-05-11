"use client"

import { motion } from "framer-motion"
import { ExplodedView3D } from "./exploded-view-3d"
import { Shield, Zap, Target, Cpu, Activity, BarChart3, Database, Globe, Layers } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { useSound } from "@/hooks/use-sound"
import { bikes, allProducts, type Product, type Bike } from "@/lib/data"

function LiveWaveform() {
  return (
    <div className="flex items-end gap-0.5 h-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <motion.div
          key={i}
          animate={{ height: [4, 12, 6, 16, 4] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
          className="w-1 bg-apex-orange/40 rounded-full"
        />
      ))}
    </div>
  )
}

function LiveData({ label, unit, baseValue }: { label: string, unit: string, baseValue: number }) {
  const [val, setVal] = useState(baseValue)
  const { play } = useSound()
  
  useEffect(() => {
    const interval = setInterval(() => {
      setVal(baseValue + (Math.random() * 20 - 10))
    }, 200)
    return () => clearInterval(interval)
  }, [baseValue])

  return (
    <motion.div 
      onMouseEnter={() => play('scan')}
      className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl space-y-1 hover:border-apex-orange/30 transition-all group"
    >
      <div className="flex flex-col">
        <span className="text-[7px] font-black text-neutral-600 uppercase tracking-[0.2em] mb-1 group-hover/data:text-neutral-400 transition-colors">{label}</span>
        <span className="text-xs font-mono font-black text-white group-hover/data:text-apex-orange transition-colors">
          {val.toFixed(unit === "mm" ? 4 : 2)}<span className="text-[8px] ml-0.5 opacity-50">{unit}</span>
        </span>
      </div>
      <LiveWaveform />
    </motion.div>
  )
}

export function TechLab() {
  const { play } = useSound()
  const [selectedAsset, setSelectedAsset] = useState<Bike | Product>(bikes[0])
  const [isExploded, setIsExploded] = useState(false)

  const engineeringMetrics = useMemo(() => {
    const isBike = 'model' in selectedAsset
    const stats = selectedAsset.stats || { speed: 50, acceleration: 50, braking: 50, handling: 50 }
    
    return [
      { 
        icon: Shield, 
        label: "Structural Integrity", 
        desc: isBike ? `Reinforced ${selectedAsset.brand} Frame` : `${selectedAsset.brand} Material Spec`, 
        data: { label: "YIELD_POINT", val: 600 + (stats.braking || 0) * 4, unit: "MPa" } 
      },
      { 
        icon: Zap, 
        label: "Kinetic Efficiency", 
        desc: "Optimized Power Delivery", 
        data: { label: "THERMAL_COEFF", val: 85 + (stats.speed || 0) * 0.15, unit: "%" } 
      },
      { 
        icon: Target, 
        label: "Perfect Alignment", 
        desc: "Micron-level Assembly", 
        data: { label: "TOLERANCE_GAP", val: 0.005 - (stats.handling || 0) * 0.00004, unit: "mm" } 
      },
      { 
        icon: Layers, 
        label: "Molecular Coating", 
        desc: "Advanced Surface Treatment", 
        data: { label: "HARDNESS", val: 70 + (stats.acceleration || 0) * 0.25, unit: "HRC" } 
      },
    ]
  }, [selectedAsset])

  return (
    <section id="tech-lab" className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Tactical Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          
          <div className="lg:w-[45%] space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-apex-orange/5 border border-apex-orange/20 text-apex-orange text-[9px] font-black uppercase tracking-[0.3em]"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-apex-orange animate-pulse" />
                  ANALYZING_{selectedAsset.name.toUpperCase().replace(/\s+/g, '_')}
                </motion.div>
                
                {/* Asset Quick Switcher */}
                <div className="flex gap-2">
                  {bikes.slice(0, 3).map((bike) => (
                    <button
                      key={bike.id}
                      onClick={() => {
                        setSelectedAsset(bike)
                        play('beep')
                      }}
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
                        selectedAsset.id === bike.id ? 'bg-apex-orange border-apex-orange text-white' : 'bg-white/5 border-white/10 text-neutral-500 hover:text-white'
                      }`}
                    >
                      <span className="text-[8px] font-black">{bike.brand.substring(0, 2)}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <h2 className="text-5xl lg:text-8xl font-display font-black text-white leading-[0.85] italic uppercase tracking-tighter">
                SURGICAL <br /><span className="text-apex-orange">PRECISION</span>
              </h2>
              
              <p className="text-neutral-500 text-lg font-medium leading-relaxed max-w-lg">
                Deconstructing the DNA of the <span className="text-white font-bold">{selectedAsset.name}</span>. 
                Every micron is verified for peak mission readiness and structural resilience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
              {engineeringMetrics.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-apex-orange shadow-[0_0_20px_rgba(255,77,0,0.05)]">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{item.label}</h4>
                      <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-wider">{item.desc}</p>
                    </div>
                  </div>
                  <div className="pl-14">
                     <LiveData label={item.data.label} baseValue={item.data.val} unit={item.data.unit} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:w-[55%] w-full aspect-[4/3] relative rounded-[4rem] overflow-hidden border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent shadow-2xl">
            <ExplodedView3D />
            
            {/* Tactical Overlays */}
            <div className="absolute inset-0 pointer-events-none">
               <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            <div className="absolute top-12 left-12 z-20 pointer-events-none flex items-center gap-4">
               <div className="w-12 h-12 rounded-full border border-apex-orange/30 flex items-center justify-center relative">
                  <div className="absolute inset-0 border-2 border-apex-orange border-t-transparent rounded-full animate-spin" />
                  <Activity className="w-6 h-6 text-apex-orange" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-white uppercase tracking-[0.3em]">ANALYSIS_MODE_ACTIVE</p>
                  <div className="flex gap-1 mt-1">
                     {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-4 h-1 bg-apex-orange/40 rounded-full" />)}
                  </div>
               </div>
            </div>

            <div className="absolute bottom-12 right-12 z-20 pointer-events-none">
               <div className="bg-black/80 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 min-w-[200px] space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                     <span className="text-[8px] font-black text-apex-orange uppercase tracking-[0.4em]">LIVE_SPEC_FEED</span>
                     <BarChart3 className="w-4 h-4 text-apex-orange" />
                  </div>
                  <div className="space-y-4">
                     <LiveData 
                        label="THERMAL_CORE" 
                        baseValue={180 + (selectedAsset.stats?.speed || 50) * 0.5} 
                        unit="°C" 
                     />
                     <LiveData 
                        label="ANGULAR_VEL" 
                        baseValue={10000 + (selectedAsset.stats?.acceleration || 50) * 40} 
                        unit="RPM" 
                     />
                  </div>
               </div>
            </div>

            <button 
              onClick={() => setIsExploded(!isExploded)}
              className="absolute bottom-12 left-12 z-30 px-6 py-3 bg-white/5 hover:bg-apex-orange border border-white/10 hover:border-apex-orange rounded-xl text-[10px] font-black text-white uppercase tracking-[0.3em] transition-all"
            >
              {isExploded ? "MERGE_ASSEMBLY" : "EXPLODE_ASSEMBLY"}
            </button>

            {/* Corner Markers */}
            <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-white/20 rounded-tl-2xl" />
            <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-white/20 rounded-tr-2xl" />
            <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-white/20 rounded-bl-2xl" />
            <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-white/20 rounded-br-2xl" />
          </div>
          
        </div>
      </div>

      {/* Cinematic Glowing Backgrounds */}
      <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-apex-orange/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
    </section>
  )
}
