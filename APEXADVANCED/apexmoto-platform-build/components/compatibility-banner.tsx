"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, X, Info } from "lucide-react"
import { useState } from "react"

interface CompatibilityBannerProps {
  warnings: string[]
  isCompatible: boolean
}

export function CompatibilityBanner({ warnings, isCompatible }: CompatibilityBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  if (isCompatible || isDismissed || warnings.length === 0) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        className="mb-6 overflow-hidden"
      >
        <div className="relative bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-orange-500/10 border border-amber-500/30 rounded-2xl p-4">
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 blur-xl opacity-50" />
          
          <div className="relative flex items-start gap-4">
            {/* Warning Icon */}
            <div className="flex-shrink-0 w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-sm font-black italic uppercase tracking-wider text-amber-500">
                  Compatibility Notice
                </h4>
                <span className="text-[10px] font-mono text-amber-500/60 bg-amber-500/10 px-2 py-0.5 rounded">
                  {warnings.length} {warnings.length === 1 ? "WARNING" : "WARNINGS"}
                </span>
              </div>
              
              <ul className="space-y-2">
                {warnings.map((warning, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-2 text-sm text-neutral-300"
                  >
                    <Info className="w-4 h-4 text-amber-500/60 flex-shrink-0 mt-0.5" />
                    <span>{warning}</span>
                  </motion.li>
                ))}
              </ul>
              
              <p className="mt-3 text-xs text-neutral-500 italic">
                You can still proceed with your order. This is just a recommendation to ensure optimal performance.
              </p>
            </div>
            
            {/* Dismiss Button */}
            <button
              onClick={() => setIsDismissed(true)}
              className="flex-shrink-0 p-2 hover:bg-white/5 rounded-lg transition-colors group"
              aria-label="Dismiss warning"
            >
              <X className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
