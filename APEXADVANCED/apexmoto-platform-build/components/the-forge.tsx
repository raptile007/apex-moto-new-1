"use client"

import { useState, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment, Float, ContactShadows, MeshDistortMaterial } from "@react-three/drei"
import { motion, AnimatePresence } from "framer-motion"
import { Hammer, Ruler, Weight, Zap, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

function LeverModel({ length, color, texture }: { length: number, color: string, texture: string }) {
  return (
    <group scale={[length, 1, 1]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4, 0.4, 0.2]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.9} 
          roughness={texture === "carbon" ? 0.2 : 0.4} 
        />
      </mesh>
      <mesh position={[-2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.4, 32]} />
        <meshStandardMaterial color="#222" metalness={1} roughness={0.1} />
      </mesh>
    </group>
  )
}

export function TheForge() {
  const [params, setParams] = useState({
    length: 1.0,
    color: "#ff4d00",
    texture: "anodized",
    weight: 120,
    stress: 42,
    drag: 0.12
  })

  const textures = [
    { id: "anodized", label: "AIRCRAFT_ALU", desc: "Grade 7075-T6" },
    { id: "carbon", label: "THERMO_CARBON", desc: "12K Weave" },
    { id: "raw", label: "RAW_TITANIUM", desc: "Grade 5 (Ti6Al4V)" },
  ]

  const colors = ["#ff4d00", "#00f2ff", "#ff0055", "#ffffff", "#222222"]

  const handleCreate = () => {
    toast.success("FORGE_SEQUENCE_COMPLETE", {
      description: "CNC Blueprint exported to production queue.",
      icon: <Hammer className="w-4 h-4 text-apex-orange" />
    })
  }

  return (
    <section id="forge" className="py-32 bg-[#020202] relative overflow-hidden">
       {/* High-Fidelity Tactical Background */}
       <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,77,0,0.1)_0%,transparent_70%)]" />
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
       </div>

       <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col gap-8 mb-16">
             <div className="flex items-center gap-4">
                <div className="h-px w-20 bg-apex-orange/50" />
                <span className="text-[10px] font-black text-apex-orange uppercase tracking-[0.5em]">DEPARTMENT_OF_ENGINEERING</span>
             </div>
             <h2 className="text-6xl lg:text-9xl font-display font-black text-white italic uppercase leading-[0.8] tracking-tighter">
                THE <span className="text-apex-orange">FORGE</span>
             </h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
             {/* Left Column: Technical Readouts */}
             <div className="lg:col-span-3 space-y-4 hidden lg:block">
                {[
                  { label: "STRUCTURAL_STRESS", val: params.stress, unit: "MPa", color: "text-emerald-500" },
                  { label: "AERO_DRAG_COEFF", val: params.drag, unit: "Cd", color: "text-blue-500" },
                  { label: "MATERIAL_DENSITY", val: params.texture === "carbon" ? 1.75 : 2.81, unit: "g/cm³", color: "text-apex-orange" },
                  { label: "THERMAL_TOLERANCE", val: 450, unit: "°C", color: "text-red-500" },
                ].map((stat, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={stat.label} 
                    className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-md"
                  >
                     <p className="text-[8px] font-black text-neutral-600 uppercase tracking-widest mb-2">{stat.label}</p>
                     <div className="flex items-baseline gap-2">
                        <span className={`text-2xl font-display font-black italic ${stat.color}`}>{stat.val}</span>
                        <span className="text-[10px] font-black text-neutral-500">{stat.unit}</span>
                     </div>
                     <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full bg-current ${stat.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: "70%" }}
                        />
                     </div>
                  </motion.div>
                ))}
             </div>

             {/* Center Column: 3D Viewport */}
             <div className="lg:col-span-6 aspect-square bg-white/[0.01] border border-white/5 rounded-[4rem] relative group overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-apex-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                
                {/* Viewport UI Overlays */}
                <div className="absolute top-10 left-10 z-20 flex items-center gap-4">
                   <div className="w-3 h-3 rounded-full bg-apex-orange animate-pulse" />
                   <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">LIVE_ASSEMBLY_FEED</span>
                </div>

                <div className="absolute bottom-10 left-10 right-10 z-20 flex justify-between items-end">
                   <div className="space-y-1">
                      <p className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">PART_IDENTIFIER</p>
                      <p className="text-xs font-black text-white uppercase italic">LEVER_SYSTEM_CNC_V2.4</p>
                   </div>
                   <div className="text-right space-y-1">
                      <p className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">TOTAL_MASS</p>
                      <p className="text-4xl font-display font-black text-apex-orange italic">{params.weight}g</p>
                   </div>
                </div>

                <Canvas shadows>
                   <Suspense fallback={null}>
                      <PerspectiveCamera makeDefault position={[0, 2, 6]} fov={35} />
                      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                      <Environment preset="night" />
                      <ambientLight intensity={0.2} />
                      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
                      
                      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
                         <LeverModel length={params.length} color={params.color} texture={params.texture} />
                      </Float>

                      <ContactShadows position={[0, -1.8, 0]} opacity={0.6} scale={8} blur={3} far={4} />
                   </Suspense>
                </Canvas>
                
                {/* Corner Accents */}
                <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-white/20" />
                <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-white/20" />
                <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-white/20" />
                <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-white/20" />
             </div>

             {/* Right Column: Controls */}
             <div className="lg:col-span-3 space-y-8">
                <div className="p-8 bg-white/[0.03] border border-white/5 rounded-[3rem] backdrop-blur-xl space-y-10">
                   <div className="space-y-6">
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">DIMENSION_MOD</span>
                         <span className="text-[10px] font-black text-apex-orange italic">{params.length.toFixed(2)}x</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.8" 
                        max="1.4" 
                        step="0.05" 
                        value={params.length}
                        onChange={(e) => {
                          const l = parseFloat(e.target.value)
                          setParams({ 
                            ...params, 
                            length: l, 
                            weight: Math.floor(120 * l), 
                            stress: Math.floor(42 / l),
                            drag: parseFloat((0.12 * l).toFixed(2))
                          })
                        }}
                        className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-apex-orange"
                      />
                   </div>

                   <div className="space-y-4">
                      <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block">ALLOY_TEXTURE</span>
                      <div className="space-y-2">
                         {textures.map(t => (
                           <button
                             key={t.id}
                             onClick={() => setParams({ ...params, texture: t.id })}
                             className={`w-full p-4 rounded-2xl border text-left transition-all ${
                               params.texture === t.id 
                                 ? "bg-apex-orange border-apex-orange text-white" 
                                 : "bg-white/5 border-white/5 text-neutral-400 hover:bg-white/10"
                             }`}
                           >
                             <p className="text-[10px] font-black uppercase tracking-widest">{t.label}</p>
                             <p className={`text-[8px] font-black uppercase opacity-60 ${params.texture === t.id ? "text-white" : "text-neutral-500"}`}>{t.desc}</p>
                           </button>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-4">
                      <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block">ANODIZED_FINISH</span>
                      <div className="flex gap-3">
                         {colors.map(c => (
                           <button
                             key={c}
                             onClick={() => setParams({ ...params, color: c })}
                             className={`w-8 h-8 rounded-full border-2 transition-all ${
                               params.color === c ? "border-white scale-110" : "border-transparent"
                             }`}
                             style={{ backgroundColor: c }}
                           />
                         ))}
                      </div>
                   </div>

                   <div className="pt-6 border-t border-white/5">
                      <Button 
                        onClick={handleCreate}
                        className="w-full h-16 bg-apex-orange hover:bg-apex-orange/90 text-white font-black italic uppercase tracking-tighter text-lg rounded-2xl shadow-[0_0_30px_rgba(255,77,0,0.3)] gap-3"
                      >
                        <Zap className="w-5 h-5" />
                        FINALIZE_BLUEPRINT
                      </Button>
                      <p className="text-[8px] text-center text-neutral-600 font-black uppercase tracking-[0.2em] mt-6">
                         CNC_TOLERANCE: +/- 0.005MM
                      </p>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </section>
  )
}
