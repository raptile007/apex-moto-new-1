"use client"

import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts"
import { motion } from "framer-motion"
import { type PerformanceStats } from "@/lib/data"

interface PerformanceRadarProps {
  stats: PerformanceStats
  label?: string
}

export function PerformanceRadar({ stats, label = "SYSTEM_STATS" }: PerformanceRadarProps) {
  const data = [
    { subject: "SPEED", A: stats.speed, B: 95, fullMark: 100 },
    { subject: "ACCEL", A: stats.acceleration, B: 90, fullMark: 100 },
    { subject: "BRAKE", A: stats.braking, B: 85, fullMark: 100 },
    { subject: "HANDL", A: stats.handling, B: 88, fullMark: 100 },
    { subject: "TORQUE", A: Math.min(100, (stats.speed * 0.4 + stats.acceleration * 0.6)), B: 92, fullMark: 100 },
    { subject: "WEIGHT", A: Math.min(100, (100 - stats.handling * 0.3)), B: 80, fullMark: 100 },
    { subject: "THERMAL", A: Math.min(100, (stats.speed * 0.8)), B: 95, fullMark: 100 },
  ]

  return (
    <div className="w-full h-[300px] relative">
      <div className="absolute top-0 left-0 text-[8px] font-black tracking-[0.3em] text-apex-orange uppercase italic bg-apex-orange/10 px-2 py-0.5 rounded border border-apex-orange/20 z-10">
        {label}
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
          <PolarGrid stroke="#ffffff10" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: "#ffffff40", fontSize: 7, fontWeight: 900, letterSpacing: "0.1em" }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Peak Capacity"
            dataKey="B"
            stroke="#ffffff20"
            fill="#ffffff10"
            fillOpacity={0.1}
            isAnimationActive={false}
          />
          <Radar
            name="Current Build"
            dataKey="A"
            stroke="#ff4d00"
            fill="#ff4d00"
            fillOpacity={0.3}
            isAnimationActive={false}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Background Hexagon Decoration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
         <div className="w-48 h-48 border border-white rotate-45" />
         <div className="w-32 h-32 border border-white absolute rotate-12" />
      </div>
    </div>
  )
}
