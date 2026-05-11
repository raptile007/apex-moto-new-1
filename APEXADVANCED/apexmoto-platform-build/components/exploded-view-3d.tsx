"use client"

import { useRef, useState, useMemo, useEffect, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  Float,
  Environment,
  Html,
  ContactShadows,
  PerspectiveCamera,
  OrbitControls,
} from "@react-three/drei"
import * as THREE from "three"
import { gsap } from "gsap"
import { motion } from "framer-motion"

// ── SUB-COMPONENT: ENGINE PART ────────────────────────────────
function EnginePart({ 
  position, 
  color, 
  label, 
  explode, 
  type 
}: { 
  position: [number, number, number], 
  color: string, 
  label: string, 
  explode: boolean,
  type: 'block' | 'disk' | 'tube' | 'gear'
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  const initialPos = useMemo(() => new THREE.Vector3(...position), [position])
  const targetPos = useMemo(() => {
    const dir = new THREE.Vector3(...position).normalize()
    return new THREE.Vector3(...position).add(dir.multiplyScalar(3.5))
  }, [position])

  useEffect(() => {
    gsap.to(meshRef.current.position, {
      x: explode ? targetPos.x : initialPos.x,
      y: explode ? targetPos.y : initialPos.y,
      z: explode ? targetPos.z : initialPos.z,
      duration: 1.5,
      ease: "expo.out"
    })
  }, [explode, initialPos, targetPos])

  const geometry = useMemo(() => {
    switch(type) {
      case 'disk': return <cylinderGeometry args={[1, 1, 0.2, 32]} />
      case 'tube': return <torusGeometry args={[0.5, 0.1, 16, 32]} />
      case 'gear': return <cylinderGeometry args={[0.8, 0.8, 0.4, 8]} />
      default: return <boxGeometry args={[1.2, 0.8, 1.2]} />
    }
  }, [type])

  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        {geometry}
        <meshStandardMaterial 
          color={hovered ? "#ff4d00" : color} 
          metalness={1} 
          roughness={0.15} 
          envMapIntensity={2}
          emissive={hovered ? "#ff4d00" : "#111"}
          emissiveIntensity={hovered ? 2 : 0.2}
        />
        
        {hovered && (
          <Html distanceFactor={10} position={[0, 1, 0]}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black/90 backdrop-blur-xl px-4 py-2 rounded-xl border border-apex-orange/30 pointer-events-none shadow-[0_0_30px_rgba(255,77,0,0.2)]"
            >
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-apex-orange animate-pulse" />
                 <p className="text-[9px] font-black text-white uppercase tracking-[0.2em]">{label}</p>
              </div>
              <div className="mt-1 flex gap-0.5">
                 {[1, 2, 3].map(i => <div key={i} className="w-full h-[1px] bg-white/20" />)}
              </div>
            </motion.div>
          </Html>
        )}
      </mesh>
    </group>
  )
}

// ── MAIN EXPLODED VIEW ────────────────────────────────────────
export function ExplodedView3D() {
  const [explode, setExplode] = useState(false)

  const parts = [
    { pos: [0, 1.5, 0] as [number, number, number], color: "#444", label: "CYLINDER_HEAD", type: 'block' as const },
    { pos: [0, 0, 0] as [number, number, number], color: "#222", label: "MAIN_BLOCK", type: 'block' as const },
    { pos: [1.8, 0, 0] as [number, number, number], color: "#333", label: "CLUTCH_PLATE", type: 'disk' as const },
    { pos: [-1.8, 0, 0] as [number, number, number], color: "#333", label: "MAGNETO_ASSEMBLY", type: 'gear' as const },
    { pos: [0, -1.5, 0] as [number, number, number], color: "#111", label: "OIL_SUMP", type: 'disk' as const },
    { pos: [0, 0, 1.8] as [number, number, number], color: "#ff4d00", label: "VALVE_TIMING_CORE", type: 'tube' as const },
  ]

  return (
    <div className="w-full h-full relative">
      <Canvas shadows camera={{ position: [6, 4, 6], fov: 40 }}>
        <color attach="background" args={["#050505"]} />
        <PerspectiveCamera makeDefault position={[8, 5, 8]} />
        
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={5} castShadow color="#ffffff" />
        <pointLight position={[-10, -5, -10]} color="#ff4d00" intensity={2} />
        <pointLight position={[0, 10, 0]} color="#ffffff" intensity={1} />
        
        <Suspense fallback={null}>
          <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
            <group>
              {parts.map((p, i) => (
                <EnginePart key={i} position={p.pos} color={p.color} label={p.label} explode={explode} type={p.type} />
              ))}
            </group>
          </Float>
          <ContactShadows position={[0, -3, 0]} opacity={0.6} scale={15} blur={2.5} far={5} />
          <Environment preset="studio" />
        </Suspense>

        <OrbitControls 
          enableZoom={false} 
          autoRotate={!explode} 
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>

      <div className="absolute top-10 right-10 flex flex-col items-end gap-2 pointer-events-none">
         <span className="text-[7px] font-black text-neutral-500 uppercase tracking-[0.5em]">CAMERA_FEED: L_01</span>
         <div className="w-24 h-[1px] bg-white/10" />
      </div>

      <button
        onClick={() => setExplode(!explode)}
        className="absolute bottom-10 left-10 px-8 py-3 bg-white/5 hover:bg-apex-orange border border-white/10 hover:border-apex-orange text-white text-[9px] font-black uppercase tracking-[0.4em] rounded-xl transition-all shadow-2xl group overflow-hidden"
      >
        <span className="relative z-10">{explode ? "COLLAPSE_ASSEMBLY" : "EXPLODE_ASSEMBLY"}</span>
        <motion.div 
          className="absolute inset-0 bg-white/10"
          initial={{ x: "-100%" }}
          whileHover={{ x: "0%" }}
          transition={{ duration: 0.3 }}
        />
      </button>

      {/* Crosshair decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none opacity-20">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-white" />
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-white" />
         <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-white" />
         <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-white" />
      </div>
    </div>
  )
}
