"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Dynamic import to avoid SSR issues with Three.js
const CinematicScrollExperience = dynamic(
  () => import("@/components/cinematic-scroll-experience"),
  { 
    ssr: false,
    loading: () => (
      <div className="h-screen w-full bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-apex-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50 font-display tracking-wider text-sm">LOADING EXPERIENCE</p>
        </div>
      </div>
    )
  }
)

export default function ExperiencePage() {
  return (
    <main className="bg-[#050505] min-h-screen overflow-x-hidden">
      {/* Fixed back button */}
      <Link 
        href="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-white/70 hover:text-white hover:bg-white/10 hover:border-apex-orange/50 transition-all duration-300 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-display font-bold tracking-wider">BACK</span>
      </Link>
      
      <CinematicScrollExperience />
    </main>
  )
}
