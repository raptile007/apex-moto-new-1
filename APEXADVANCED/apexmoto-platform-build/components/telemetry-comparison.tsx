"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Scale, Zap, Activity, Shield, Crosshair, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { allProducts, type Product } from "@/lib/data"
import { PerformanceRadar } from "./performance-radar"

export function TelemetryComparison() {
  const [selected, setSelected] = useState<Product[]>([])
  const [isSelectorOpen, setIsSelectorOpen] = useState(false)

  const handleSelect = (product: Product) => {
    if (selected.length < 2 && !selected.find(p => p.id === product.id)) {
      setSelected([...selected, product])
    }
    setIsSelectorOpen(false)
  }

  const handleRemove = (id: string) => {
    setSelected(selected.filter(p => p.id !== id))
  }

  return (
    <div className="bg-[#050505] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden">
       {/* Background HUD Graphics */}
       <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/20 rounded-full" />
       </div>

       <div className="relative z-10">
          <div className="flex items-center justify-between mb-12">
             <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-apex-orange/10 border border-apex-orange/20 text-apex-orange text-[10px] font-black uppercase tracking-widest">
                   <Scale className="w-3 h-3" />
                   Engineering Compare
                </div>
                <h2 className="text-3xl font-display font-black text-white italic uppercase tracking-tighter">TELEMETRY_<span className="text-apex-orange">OVERLAY</span></h2>
             </div>

             {selected.length < 2 && (
               <Button 
                onClick={() => setIsSelectorOpen(true)}
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 h-12 rounded-xl gap-2 font-black italic uppercase tracking-tighter text-xs"
               >
                 <Plus className="w-4 h-4" />
                 ADD_COMPONENT
               </Button>
             )}
          </div>

          <div className="grid md:grid-cols-2 gap-12">
             {/* Left Component */}
             <div className="space-y-8">
                {selected[0] ? (
                  <div className="relative p-6 bg-white/5 border border-white/10 rounded-[2rem] group transition-all hover:border-apex-orange/30">
                     <button 
                       onClick={() => handleRemove(selected[0].id)}
                       className="absolute top-4 right-4 p-2 rounded-full bg-white/5 text-neutral-500 hover:text-white transition-colors"
                     >
                        <X className="w-4 h-4" />
                     </button>
                     <div className="flex items-center gap-6 mb-8">
                        <div className="w-20 h-20 bg-neutral-900 rounded-2xl overflow-hidden border border-white/10">
                           <img src={selected[0].image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-apex-orange uppercase tracking-widest">{selected[0].brand}</p>
                           <h3 className="font-display font-black text-xl italic text-white uppercase">{selected[0].name}</h3>
                        </div>
                     </div>
                     <PerformanceRadar stats={selected[0].specs as any} label="SPEC_SIGNATURE" />
                  </div>
                ) : (
                  <div className="aspect-[4/3] border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center text-neutral-700">
                     <Crosshair className="w-12 h-12 mb-4" />
                     <span className="text-[10px] font-black uppercase tracking-widest">AWAITING_INPUT_01</span>
                  </div>
                )}
             </div>

             {/* Right Component */}
             <div className="space-y-8">
                {selected[1] ? (
                  <div className="relative p-6 bg-white/5 border border-white/10 rounded-[2rem] group transition-all hover:border-apex-orange/30">
                     <button 
                       onClick={() => handleRemove(selected[1].id)}
                       className="absolute top-4 right-4 p-2 rounded-full bg-white/5 text-neutral-500 hover:text-white transition-colors"
                     >
                        <X className="w-4 h-4" />
                     </button>
                     <div className="flex items-center gap-6 mb-8">
                        <div className="w-20 h-20 bg-neutral-900 rounded-2xl overflow-hidden border border-white/10">
                           <img src={selected[1].image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-apex-orange uppercase tracking-widest">{selected[1].brand}</p>
                           <h3 className="font-display font-black text-xl italic text-white uppercase">{selected[1].name}</h3>
                        </div>
                     </div>
                     <PerformanceRadar stats={selected[1].specs as any} label="SPEC_SIGNATURE" />
                  </div>
                ) : (
                  <div className="aspect-[4/3] border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center text-neutral-700">
                     <Crosshair className="w-12 h-12 mb-4" />
                     <span className="text-[10px] font-black uppercase tracking-widest">AWAITING_INPUT_02</span>
                  </div>
                )}
             </div>
          </div>

          {selected.length === 2 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 p-8 bg-apex-orange/5 border border-apex-orange/20 rounded-[2rem] flex items-center justify-between"
            >
               <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-apex-orange rounded-2xl flex items-center justify-center text-white">
                     <Activity className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-apex-orange uppercase tracking-widest">ENGINEERING_ANALYSIS</p>
                      <p className="text-white text-sm font-medium leading-relaxed uppercase">
                        {selected[0].name} provides a {Math.round(((selected[0].specs.performance || 0) / (selected[1].specs.performance || 1) - 1) * 100)}% tactical advantage in {selected[0].category === "Tyres" ? "mechanical grip" : "system efficiency"} over the {selected[1].name}.
                      </p>
                  </div>
               </div>
               <Button className="bg-apex-orange hover:bg-apex-orange/90 text-white font-black italic uppercase tracking-tighter px-8 h-12 rounded-xl">
                  GENERATE_FULL_REPORT
               </Button>
            </motion.div>
          )}
       </div>

       {/* Selector Modal */}
       <AnimatePresence>
          {isSelectorOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => setIsSelectorOpen(false)}
                 className="absolute inset-0 bg-black/80 backdrop-blur-md"
               />
               <motion.div 
                 initial={{ scale: 0.9, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 exit={{ scale: 0.9, opacity: 0 }}
                 className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-10 overflow-hidden"
               >
                  <h3 className="font-display font-black text-2xl italic text-white uppercase mb-8">SELECT_UNIT</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-4">
                     {allProducts.map(p => (
                        <button
                          key={p.id}
                          onClick={() => handleSelect(p)}
                          className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all text-left group"
                        >
                           <div className="w-12 h-12 bg-neutral-900 rounded-lg overflow-hidden border border-white/10">
                              <img src={p.image} alt="" className="w-full h-full object-cover" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-white uppercase group-hover:text-apex-orange transition-colors">{p.name}</p>
                              <p className="text-[8px] text-neutral-500 font-black uppercase tracking-widest">{p.brand}</p>
                           </div>
                        </button>
                     ))}
                  </div>
               </motion.div>
            </div>
          )}
       </AnimatePresence>
    </div>
  )
}
