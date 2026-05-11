"use client"

import { useEffect, useState } from "react"

export type ThemeVibe = "dawn" | "day" | "sunset" | "night"

export function useDynamicTheme() {
  const [vibe, setVibe] = useState<ThemeVibe>("night")

  useEffect(() => {
    const updateVibe = () => {
      const hour = new Date().getHours()
      let newVibe: ThemeVibe = "night"

      if (hour >= 5 && hour < 9) newVibe = "dawn"
      else if (hour >= 9 && hour < 17) newVibe = "day"
      else if (hour >= 17 && hour < 20) newVibe = "sunset"
      else newVibe = "night"

      setVibe(newVibe)
      
      // Update CSS Variables for global cinematic effect
      const root = document.documentElement
      if (newVibe === "dawn") {
        root.style.setProperty("--apex-glow", "rgba(255, 140, 0, 0.3)")
        root.style.setProperty("--apex-accent", "#ff8c00")
      } else if (newVibe === "day") {
        root.style.setProperty("--apex-glow", "rgba(255, 77, 0, 0.2)")
        root.style.setProperty("--apex-accent", "#ff4d00")
      } else if (newVibe === "sunset") {
        root.style.setProperty("--apex-glow", "rgba(255, 69, 0, 0.4)")
        root.style.setProperty("--apex-accent", "#ff4500")
      } else {
        root.style.setProperty("--apex-glow", "rgba(0, 242, 255, 0.15)")
        root.style.setProperty("--apex-accent", "#00f2ff")
      }
    }

    updateVibe()
    const interval = setInterval(updateVibe, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  return vibe
}
