"use client"

import { motion } from "framer-motion"
import { Gauge, Zap } from "lucide-react"

export default function HarleyLoading() {
  return (
    <div className="fixed inset-0 z-[100] bg-[#080500] flex flex-col items-center justify-center overflow-hidden">
      {/* Background ambient glow */}
      <div 
        className="absolute w-[800px] h-[800px] rounded-full opacity-10 blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle, #d4af37 0%, transparent 70%)" }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* V-Twin Engine Animation Concept */}
        <div className="flex gap-8 mb-12 relative">
          {/* Left Piston */}
          <motion.div 
            animate={{ 
              y: [0, -40, 0],
              scaleY: [1, 0.8, 1]
            }}
            transition={{ 
              duration: 0.6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-16 h-24 bg-gradient-to-b from-[#d4af37] to-[#8a6d00] rounded-lg relative border border-white/10 shadow-[0_0_30px_rgba(212,175,55,0.2)]"
          >
            <div className="absolute top-2 left-2 right-2 h-1 bg-white/20 rounded-full" />
            <div className="absolute top-4 left-2 right-2 h-1 bg-white/20 rounded-full" />
          </motion.div>

          {/* Right Piston (Offset) */}
          <motion.div 
            animate={{ 
              y: [-40, 0, -40],
              scaleY: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 0.6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-16 h-24 bg-gradient-to-b from-[#d4af37] to-[#8a6d00] rounded-lg relative border border-white/10 shadow-[0_0_30px_rgba(212,175,55,0.2)]"
          >
            <div className="absolute top-2 left-2 right-2 h-1 bg-white/20 rounded-full" />
            <div className="absolute top-4 left-2 right-2 h-1 bg-white/20 rounded-full" />
          </motion.div>

          {/* Connectors / Engine Block V-Shape */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-20 border-b-4 border-l-4 border-r-4 border-[#d4af37]/30 rounded-b-[3rem]" />
        </div>

        {/* Tachometer / Progress bar */}
        <div className="w-64 space-y-4">
          <div className="flex justify-between items-end mb-1">
             <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-[#d4af37]" />
                <span className="text-[10px] font-black tracking-[0.3em] text-white uppercase italic">Revving_Engines</span>
             </div>
             <motion.span 
               animate={{ opacity: [1, 0.4, 1] }}
               transition={{ duration: 1, repeat: Infinity }}
               className="text-[10px] font-mono text-[#d4af37]"
             >
                STAGE_II_READY
             </motion.span>
          </div>
          
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ 
                duration: 2.5, 
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror"
              }}
              className="h-full bg-gradient-to-r from-[#d4af37] via-[#f5d87e] to-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.6)] rounded-full"
            />
          </div>

          <div className="flex justify-center mt-8">
             <div className="flex items-center gap-4">
                <div className="h-px w-8 bg-[#d4af37]/20" />
                <p className="text-[9px] font-black tracking-[0.5em] text-neutral-600 uppercase">American Thunder Loading</p>
                <div className="h-px w-8 bg-[#d4af37]/20" />
             </div>
          </div>
        </div>

        {/* Tactical HUD corners */}
        <div className="absolute -top-40 -left-40 w-80 h-80 border-t border-l border-[#d4af37]/10 rounded-tl-[5rem]" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 border-b border-r border-[#d4af37]/10 rounded-br-[5rem]" />
      </div>

      {/* Roar simulation text */}
      <motion.div 
        animate={{ 
          opacity: [0, 1, 0],
          scale: [0.9, 1.1, 0.9]
        }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 text-[12rem] font-display font-black italic text-white/[0.02] select-none pointer-events-none"
      >
        V-TWIN
      </motion.div>
    </div>
  )
}
