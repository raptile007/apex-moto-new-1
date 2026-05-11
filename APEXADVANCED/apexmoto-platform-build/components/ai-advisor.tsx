"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BrainCircuit, ShieldCheck, Zap, AlertTriangle, ChevronRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { allProducts } from "@/lib/data"
import { useStore } from "@/lib/store"
import { toast } from "sonner"

export function AiAdvisor() {
  const [isScanning, setIsScanning] = useState(false)
  const [recommendation, setRecommendation] = useState<any>(null)
  const { addToCart } = useStore()

  const handleScan = () => {
    setIsScanning(true)
    setRecommendation(null)
    
    setTimeout(() => {
      const suggestions = [
        {
          title: "BRAKE_SYSTEM_UPGRADE",
          part: allProducts.find(p => p.id === "brake-002"),
          reason: "Stock pads detected with high-heat signature. Brembo Sintered recommended for track stability.",
          threatLevel: "CRITICAL"
        },
        {
          title: "DRIVE_TRAIN_MOD",
          part: allProducts.find(p => p.id === "engine-001"),
          reason: "Final drive ratio optimization detected. 520 Conversion kit will improve acceleration by 12%.",
          threatLevel: "OPTIMIZATION"
        }
      ]
      setRecommendation(suggestions[Math.floor(Math.random() * suggestions.length)])
      setIsScanning(false)
    }, 2500)
  }

  return (
    <div className="bg-white/5 border border-white/5 rounded-[3rem] p-8 relative overflow-hidden group">
       <div className="absolute top-0 right-0 p-8">
          <BrainCircuit className="w-8 h-8 text-apex-orange/30 group-hover:text-apex-orange transition-colors" />
       </div>

       <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-apex-orange/10 border border-apex-orange/20 text-apex-orange text-[10px] font-black uppercase tracking-widest mb-6">
             <BrainCircuit className="w-3 h-3" />
             Tactical AI Advisor
          </div>

          <h2 className="text-3xl font-display font-black text-white italic uppercase tracking-tighter mb-4">NEXT_MISSION_<span className="text-apex-orange">INTEL</span></h2>
          <p className="text-neutral-500 text-sm max-w-sm mb-10 font-medium leading-relaxed uppercase">
             Advanced neural network scanning your current build for critical performance vulnerabilities.
          </p>

          {!recommendation && !isScanning && (
            <Button 
              onClick={handleScan}
              className="h-14 px-8 bg-apex-orange hover:bg-apex-orange/90 text-white font-black italic uppercase tracking-tighter rounded-2xl gap-3 shadow-[0_0_30px_rgba(255,77,0,0.3)]"
            >
              <Search className="w-4 h-4" />
              INITIALIZE_SCAN
            </Button>
          )}

          {isScanning && (
            <div className="space-y-6 py-4">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest animate-pulse">ANALYZING_CHASSIS...</span>
                  <span className="text-[10px] font-black text-apex-orange italic">68%</span>
               </div>
               <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-apex-orange"
                    initial={{ width: "0%" }}
                    animate={{ width: "68%" }}
                  />
               </div>
               <div className="grid grid-cols-4 gap-2">
                  {[...Array(12)].map((_, i) => (
                    <motion.div 
                      key={i} 
                      className="h-1 bg-white/10 rounded-full"
                      animate={{ opacity: [0.1, 1, 0.1] }}
                      transition={{ delay: i * 0.1, repeat: Infinity }}
                    />
                  ))}
               </div>
            </div>
          )}

          <AnimatePresence>
             {recommendation && !isScanning && (
               <motion.div
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="space-y-8"
               >
                  <div className={`p-6 rounded-3xl border ${recommendation.threatLevel === "CRITICAL" ? "bg-red-500/5 border-red-500/20" : "bg-apex-orange/5 border-apex-orange/20"}`}>
                     <div className="flex items-center gap-3 mb-4">
                        {recommendation.threatLevel === "CRITICAL" ? <AlertTriangle className="w-5 h-5 text-red-500" /> : <ShieldCheck className="w-5 h-5 text-apex-orange" />}
                        <h4 className="text-xs font-black text-white uppercase tracking-widest">{recommendation.title}</h4>
                     </div>
                     <p className="text-[11px] text-neutral-400 font-medium leading-relaxed uppercase mb-6">
                        {recommendation.reason}
                     </p>
                     
                     <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-neutral-900 rounded-lg overflow-hidden border border-white/10">
                              <img src={recommendation.part?.image} alt="" className="w-full h-full object-cover" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-white uppercase italic">{recommendation.part?.name}</p>
                              <p className="text-[8px] text-neutral-500 font-black uppercase tracking-widest">${recommendation.part?.price}</p>
                           </div>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => {
                            addToCart(recommendation.part);
                            toast.success("ADVISORY_ACCEPTED", { description: "Part added to mission loadout." });
                          }}
                          className="h-8 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-[8px] font-black italic uppercase"
                        >
                          DEPLOY
                        </Button>
                     </div>
                  </div>

                  <Button 
                    variant="ghost" 
                    onClick={handleScan}
                    className="text-[10px] font-black text-neutral-600 hover:text-white uppercase tracking-widest"
                  >
                    RE-SCAN SYSTEM
                  </Button>
               </motion.div>
             )}
          </AnimatePresence>
       </div>
    </div>
  )
}
