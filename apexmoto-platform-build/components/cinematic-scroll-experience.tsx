"use client"

import { useRef, useEffect, useMemo, useState, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  Float,
  Environment,
  Sparkles,
  Html,
} from "@react-three/drei"
import * as THREE from "three"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// ── UTILS ────────────────────────────────────────────────────
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const ss = (mn: number, mx: number, v: number) => {
  const x = clamp((v - mn) / (mx - mn), 0, 1)
  return x * x * (3 - 2 * x)
}

const LABELS = ['01 — Hero', '02 — Speed', '03 — Precision', '04 — Intelligence', '05 — Apex']

// ── SCENE 1: HERO ─────────────────────────────────────────────
function HeroScene({ visible }: { visible: boolean }) {
  const groupRef = useRef<THREE.Group>(null!)
  const tkRef = useRef<THREE.Mesh>(null!)
  const ringsRef = useRef<THREE.Group>(null!)
  const debrisRef = useRef<THREE.Group>(null!)

  const ringConfigs = [
    { r: 3.8, tube: 0.018, color: 0xff4d00, op: 0.7, rx: Math.PI * 0.5, ry: 0 },
    { r: 4.8, tube: 0.012, color: 0x553322, op: 0.25, rx: Math.PI * 0.35, ry: 0.9 },
    { r: 5.6, tube: 0.01, color: 0x222222, op: 0.2, rx: Math.PI * 0.7, ry: -0.4 },
  ]

  const debrisData = useMemo(() => {
    return Array.from({ length: 12 }).map(() => {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const r2 = 4 + Math.random() * 3
      return {
        size: 0.15 + Math.random() * 0.12,
        pos: [
          Math.sin(phi) * Math.cos(theta) * r2,
          Math.sin(phi) * Math.sin(theta) * r2,
          Math.cos(phi) * r2
        ] as [number, number, number],
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.6
      }
    })
  }, [])

  useFrame((state) => {
    if (!visible) return
    const t = state.clock.elapsedTime

    if (tkRef.current) {
      tkRef.current.rotation.x = t * 0.28
      tkRef.current.rotation.y = t * 0.18
    }

    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.4) * 0.18
    }

    if (ringsRef.current) {
      ringsRef.current.children.forEach((r, i) => {
        r.rotation.z += 0.003 + i * 0.0015
        r.rotation.y += 0.001
      })
    }

    if (debrisRef.current) {
      debrisRef.current.children.forEach((d, i) => {
        const { phase, speed, pos } = debrisData[i]
        d.position.x = pos[0] + Math.sin(t * speed + phase) * 0.3
        d.position.y = pos[1] + Math.cos(t * speed * 0.7 + phase) * 0.25
        d.rotation.x = t * speed
        d.rotation.y = t * speed * 0.8
      })
    }
  })

  return (
    <group ref={groupRef} visible={visible}>
      <mesh ref={tkRef} castShadow>
        <torusKnotGeometry args={[2, 0.55, 256, 32, 3, 5]} />
        <meshStandardMaterial
          color={0x0d0d0d}
          metalness={0.95}
          roughness={0.05}
          emissive={new THREE.Color(0xff4400)}
          emissiveIntensity={0.12}
        />
      </mesh>

      {/* Wireframe shell */}
      <mesh scale={1.015}>
        <torusKnotGeometry args={[2, 0.55, 256, 32, 3, 5]} />
        <meshBasicMaterial color={0xff4d00} wireframe transparent opacity={0.07} />
      </mesh>

      <group ref={ringsRef}>
        {ringConfigs.map((cfg, i) => (
          <mesh key={i} rotation={[cfg.rx, cfg.ry, 0]}>
            <torusGeometry args={[cfg.r, cfg.tube, 8, 128]} />
            <meshBasicMaterial color={cfg.color} transparent opacity={cfg.op} />
          </mesh>
        ))}
      </group>

      <group ref={debrisRef}>
        {debrisData.map((d, i) => (
          <mesh key={i} position={d.pos}>
            <octahedronGeometry args={[d.size, 0]} />
            <meshStandardMaterial
              color={0x111111}
              metalness={0.9}
              roughness={0.1}
              emissive={new THREE.Color(0xff4400)}
              emissiveIntensity={0.4}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}

// ── SCENE 2: SPEED (WARP TUNNEL) ─────────────────────────────
function SpeedScene({ visible }: { visible: boolean }) {
  const tunnelRef = useRef<THREE.Group>(null!)

  const ringData = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => {
      const t = i / 40
      const r = 2.8 + Math.sin(i * 0.5) * 0.6
      const col = new THREE.Color().setHSL(0.05 - t * 0.04, 1.0, 0.45 + t * 0.25)
      return { r, z: -i * 3.2, rotZ: i * 0.18, color: col, opacity: 0.35 + t * 0.45 }
    })
  }, [])

  const streakPoints = useMemo(() => {
    const pts = []
    for (let i = 0; i < 120; i++) {
      const a = Math.random() * Math.PI * 2
      const rad = 0.6 + Math.random() * 1.8
      const z0 = -Math.random() * 120
      const z1 = z0 - 1.5 - Math.random() * 3
      pts.push(new THREE.Vector3(Math.cos(a) * rad, Math.sin(a) * rad, z0))
      pts.push(new THREE.Vector3(Math.cos(a) * rad * 0.9, Math.sin(a) * rad * 0.9, z1))
    }
    return pts
  }, [])

  useFrame(() => {
    if (!visible) return
    if (tunnelRef.current) {
      tunnelRef.current.children.forEach((r, i) => {
        if (i < 40) {
          r.rotation.z += 0.004 + i * 0.0001
          r.rotation.x += 0.0008
        }
      })
    }
  })

  return (
    <group ref={tunnelRef} visible={visible}>
      {ringData.map((d, i) => (
        <mesh key={i} position={[0, 0, d.z]} rotation={[0, 0, d.rotZ]}>
          <torusGeometry args={[d.r, 0.025, 8, 80]} />
          <meshBasicMaterial color={d.color} transparent opacity={d.opacity} />
        </mesh>
      ))}
      <lineSegments>
        <bufferGeometry attach="geometry" onUpdate={self => self.setFromPoints(streakPoints)} />
        <lineBasicMaterial color={0xff6622} transparent opacity={0.4} />
      </lineSegments>
    </group>
  )
}

// ── SCENE 3: PRECISION (CRYSTAL) ──────────────────────────────
function PrecisionScene({ visible }: { visible: boolean }) {
  const icoRef = useRef<THREE.Mesh>(null!)
  const tetRef = useRef<THREE.Mesh>(null!)
  const satsRef = useRef<THREE.Group>(null!)

  const satsData = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => {
      const a = (i / 8) * Math.PI * 2
      return { a }
    })
  }, [])

  useFrame((state) => {
    if (!visible) return
    const t = state.clock.elapsedTime

    if (icoRef.current) {
      icoRef.current.rotation.y = t * 0.18
      icoRef.current.rotation.x = t * 0.09
    }
    if (tetRef.current) {
      tetRef.current.rotation.y = -t * 0.5
      tetRef.current.rotation.x = t * 0.3
    }
    if (satsRef.current) {
      satsRef.current.rotation.y = t * 0.35
      satsRef.current.rotation.x = Math.sin(t * 0.2) * 0.3
    }
  })

  return (
    <group visible={visible}>
      <mesh ref={icoRef} castShadow>
        <icosahedronGeometry args={[2.8, 2]} />
        <meshStandardMaterial
          color={0x060606}
          metalness={1.0}
          roughness={0.02}
          emissive={new THREE.Color(0xff3300)}
          emissiveIntensity={0.18}
          transparent
          opacity={0.92}
        />
      </mesh>
      <mesh scale={1.018}>
        <icosahedronGeometry args={[2.8, 2]} />
        <meshBasicMaterial color={0xff4d00} wireframe transparent opacity={0.22} />
      </mesh>
      <mesh ref={tetRef}>
        <tetrahedronGeometry args={[1.4, 0]} />
        <meshStandardMaterial
          color={0x000000}
          metalness={1}
          roughness={0}
          emissive={new THREE.Color(0xff4400)}
          emissiveIntensity={1.5}
        />
      </mesh>
      <group ref={satsRef}>
        {satsData.map((d, i) => (
          <mesh key={i} position={[Math.cos(d.a) * 5, Math.sin(d.a * 0.3) * 0.8, Math.sin(d.a) * 5]}>
            <octahedronGeometry args={[0.22, 0]} />
            <meshStandardMaterial
              color={0xff4d00}
              metalness={0.7}
              roughness={0.2}
              emissive={new THREE.Color(0xff4d00)}
              emissiveIntensity={0.8}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}

// ── SCENE 4: INTELLIGENCE (PARTICLE SPHERE) ──────────────────
function IntelligenceScene({ visible, progress }: { visible: boolean, progress: number }) {
  const pointsRef = useRef<THREE.Points>(null!)
  const N = 4000

  const [scatter, sphere, colors, initialPos] = useMemo(() => {
    const sc = new Float32Array(N * 3)
    const sp = new Float32Array(N * 3)
    const col = new Float32Array(N * 3)
    const init = new Float32Array(N * 3)
    const PHI = (1 + Math.sqrt(5)) / 2

    for (let i = 0; i < N; i++) {
      // Scatter
      sc[i * 3] = (Math.random() - 0.5) * 28
      sc[i * 3 + 1] = (Math.random() - 0.5) * 28
      sc[i * 3 + 2] = (Math.random() - 0.5) * 28

      // Sphere
      const y = 1 - 2 * i / (N - 1)
      const r = Math.sqrt(1 - y * y)
      const th = 2 * Math.PI * i / PHI
      const R = 3.2
      sp[i * 3] = Math.cos(th) * r * R
      sp[i * 3 + 1] = y * R
      sp[i * 3 + 2] = Math.sin(th) * r * R

      // Color
      const t2 = Math.random()
      col[i * 3] = 1
      col[i * 3 + 1] = t2 * 0.38
      col[i * 3 + 2] = t2 * 0.12

      // Initial position (copy from scatter)
      init[i * 3] = sc[i * 3]
      init[i * 3 + 1] = sc[i * 3 + 1]
      init[i * 3 + 2] = sc[i * 3 + 2]
    }
    return [sc, sp, col, init]
  }, [])

  useFrame((state) => {
    if (!visible) return
    const t = state.clock.elapsedTime
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.08

      const cvg = ss(0.58, 0.74, progress)
      const pos = pointsRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < N; i++) {
        pos[i * 3] = lerp(scatter[i * 3], sphere[i * 3], cvg)
        pos[i * 3 + 1] = lerp(scatter[i * 3 + 1], sphere[i * 3 + 1], cvg)
        pos[i * 3 + 2] = lerp(scatter[i * 3 + 2], sphere[i * 3 + 2], cvg)
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group visible={visible}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={N} array={initialPos} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={N} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.045} vertexColors transparent opacity={0.9} sizeAttenuation />
      </points>
    </group>
  )
}

// ── SCENE 5: APEX (FINAL CORE) ───────────────────────────────
function ApexScene({ visible, progress }: { visible: boolean, progress: number }) {
  const coreRef = useRef<THREE.Mesh>(null!)
  const ringsRef = useRef<THREE.Group>(null!)

  const ringData = [
    { r: 6.5, tube: 0.06, color: 0xff4d00, op: 0.7, rx: 0, ry: 0 },
    { r: 5.8, tube: 0.03, color: 0xff7722, op: 0.4, rx: Math.PI * 0.3, ry: 0.2 },
    { r: 7.2, tube: 0.02, color: 0xff3300, op: 0.25, rx: -Math.PI * 0.2, ry: 0.4 },
    { r: 8.0, tube: 0.015, color: 0x882200, op: 0.15, rx: Math.PI * 0.5, ry: -0.3 },
  ]

  useFrame((state) => {
    if (!visible) return
    const t = state.clock.elapsedTime

    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.28
      const rv = ss(0.78, 0.92, progress)
      const mat = coreRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 1 + rv * 3
    }

    if (ringsRef.current) {
      ringsRef.current.children.forEach((r, i) => {
        r.rotation.z += 0.06 + i * 0.002
        r.rotation.x += 0.003 + i * 0.001
        if (i === 0) {
          const rv = ss(0.78, 0.92, progress)
          const mat = (r as THREE.Mesh).material as THREE.MeshBasicMaterial
          mat.opacity = rv * 0.7
        }
      })
    }
  })

  return (
    <group ref={ringsRef} visible={visible}>
      {ringData.map((cfg, i) => (
        <mesh key={i} rotation={[cfg.rx, cfg.ry, 0]}>
          <torusGeometry args={[cfg.r, cfg.tube, 8, 200]} />
          <meshBasicMaterial color={cfg.color} transparent opacity={cfg.op} />
        </mesh>
      ))}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshStandardMaterial
          color={0x000000}
          metalness={1}
          roughness={0}
          emissive={new THREE.Color(0xff4400)}
          emissiveIntensity={2.5}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Halo rings */}
      {[0, 1, 2, 3].map(i => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.2, i * 0.4, 0]}>
          <torusGeometry args={[2 + i * 0.4, 0.01, 6, 80]} />
          <meshBasicMaterial color={0xff4d00} transparent opacity={0.5 - i * 0.1} />
        </mesh>
      ))}
    </group>
  )
}

// ── AMBIENT BACKGROUND ────────────────────────────────────────
function AmbientBackground() {
  const pointsRef = useRef<THREE.Points>(null!)
  const N = 2000
  const pos = useMemo(() => {
    const p = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      p[i * 3] = (Math.random() - 0.5) * 100
      p[i * 3 + 1] = (Math.random() - 0.5) * 100
      p[i * 3 + 2] = (Math.random() - 0.5) * 100
    }
    return p
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.008
      pointsRef.current.rotation.x = t * 0.004
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={N} array={pos} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.018} color={0xffffff} transparent opacity={0.22} sizeAttenuation />
    </points>
  )
}

// ── LIGHTING ──────────────────────────────────────────────────
function Lighting() {
  const pk1Ref = useRef<THREE.PointLight>(null!)
  const pk2Ref = useRef<THREE.PointLight>(null!)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (pk1Ref.current) {
      pk1Ref.current.position.set(Math.sin(t * 0.6) * 6, Math.cos(t * 0.4) * 4, 6)
      pk1Ref.current.intensity = 5 + Math.sin(t * 1.2) * 1.5
    }
    if (pk2Ref.current) {
      pk2Ref.current.position.set(Math.cos(t * 0.5) * -6, Math.sin(t * 0.35) * -3, 4)
    }
  })

  return (
    <>
      <ambientLight intensity={2} color={0x0a0a0a} />
      <directionalLight position={[6, 10, 8]} intensity={3} color={0xff5500} castShadow shadow-mapSize={[2048, 2048]} />
      <directionalLight position={[-8, -4, 4]} intensity={1} color={0x1133ff} />
      <directionalLight position={[0, 0, -10]} intensity={0.8} color={0xffeedd} />
      <pointLight ref={pk1Ref} color={0xff4400} distance={25} />
      <pointLight ref={pk2Ref} color={0x2244ff} distance={18} intensity={3} />
      <spotLight position={[0, 12, 6]} intensity={8} distance={40} angle={Math.PI / 7} penumbra={0.4} color={0xff6622} castShadow />
    </>
  )
}

// ── CAMERA CONTROLLER ─────────────────────────────────────────
function CameraController({ progress }: { progress: number }) {
  const { camera } = useThree()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const bx = Math.sin(t * 0.25) * 0.06
    const by = Math.cos(t * 0.18) * 0.04

    if (progress < 0.2) {
      const pt = progress / 0.2
      camera.position.x = Math.sin(pt * Math.PI * 0.5) * 1.2 + bx
      camera.position.y = Math.cos(pt * 0.6) * 0.5 + by
      camera.position.z = lerp(13, 7, ss(0, 0.2, progress))
      camera.lookAt(0, 0, 0)
    } else if (progress < 0.42) {
      const pt = (progress - 0.2) / 0.22
      camera.position.x = Math.sin(pt * Math.PI) * 0.6 + bx
      camera.position.y = Math.sin(pt * Math.PI * 0.65) * 0.4 + by
      camera.position.z = lerp(6, -88, ss(0.18, 0.42, progress))
      camera.lookAt(camera.position.x * 0.05, camera.position.y * 0.05, camera.position.z - 12)
    } else if (progress < 0.62) {
      const pt = (progress - 0.42) / 0.2
      const angle = -Math.PI * 0.15 + pt * Math.PI * 0.9
      camera.position.x = Math.sin(angle) * 8 + bx
      camera.position.y = Math.sin(pt * Math.PI) * 2.5 - 0.5 + by
      camera.position.z = Math.cos(angle) * 8
      camera.lookAt(0, 0, 0)
    } else if (progress < 0.8) {
      const pt = (progress - 0.62) / 0.18
      camera.position.x = lerp(0, 1.5, pt) + bx
      camera.position.y = lerp(-0.5, 0.8, pt) + by
      camera.position.z = lerp(9, 12, ss(0.62, 0.8, progress))
      camera.lookAt(0, 0, 0)
    } else {
      const pt = (progress - 0.8) / 0.2
      camera.position.x = Math.sin(pt * Math.PI * 0.5) * 2.5 + bx
      camera.position.y = lerp(0.8, 4, pt) + by
      camera.position.z = lerp(12, 20, ss(0.8, 1.0, progress))
      camera.lookAt(0, 0, 0)
    }
    camera.updateProjectionMatrix()
  })

  return null
}

// ── OVERLAY SECTIONS ──────────────────────────────────────────
function OverlaySections({ progress }: { progress: number }) {
  const si = Math.min(Math.floor(progress * 5), 4)

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Dots */}
      <div id="dots" className="fixed right-9 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-[200] hidden md:flex">
        {[0, 1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`w-[3px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${i === si ? 'bg-apex-orange h-[22px] shadow-[0_0_6px_rgba(255,77,0,0.4)]' : 'bg-white/10 h-[3px]'}`}
          />
        ))}
      </div>

      {/* Scene Label */}
      <div id="scene-label" className="fixed bottom-9 left-12 text-[8px] tracking-[0.5em] text-white/35 uppercase transition-all duration-500">
        {LABELS[si]}
      </div>

      {/* Scene Texts */}
      <div className="relative w-full h-full">
        {/* Scene 1 */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] transition-opacity duration-500 text-center"
          style={{ opacity: progress < 0.15 ? 1 : 0 }}
        >
          <h1 className="font-display text-[clamp(64px,11vw,148px)] leading-[0.92] tracking-[0.12em] bg-gradient-to-br from-white via-white to-apex-orange bg-clip-text text-transparent">
            BEYOND<br />LIMITS
          </h1>
          <p className="text-[9px] tracking-[0.6em] text-white/35 mt-[18px] uppercase">Apex Moto Racing Platform — 2025</p>
          <div className="w-[1px] h-12 bg-gradient-to-b from-apex-orange to-transparent mx-auto mt-4 animate-pulse-slow" />
        </div>

        {/* Scene 2 */}
        <div
          className="absolute top-[18%] left-[7%] max-w-[500px] transition-all duration-500"
          style={{
            opacity: progress > 0.17 && progress < 0.4 ? 1 : 0,
            transform: `translateY(${progress > 0.17 && progress < 0.4 ? 0 : 20}px)`
          }}
        >
          <div className="w-[60px] h-[1px] bg-apex-orange mb-[18px]" />
          <h2 className="font-display text-[clamp(44px,7vw,104px)] leading-[0.9] tracking-[0.1em] text-white uppercase italic">
            ENGINEERED<br />FOR SPEED
          </h2>
          <div className="flex items-baseline gap-2.5 mt-5">
            <span className="font-display text-[clamp(28px,4vw,52px)] text-apex-orange">2.8s</span>
            <span className="text-[9px] tracking-[0.4em] text-white/35 uppercase">0–100 km/h</span>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="font-display text-[clamp(28px,4vw,52px)] text-apex-orange">340</span>
            <span className="text-[9px] tracking-[0.4em] text-white/35 uppercase">km/h top speed</span>
          </div>
        </div>

        {/* Scene 3 */}
        <div
          className="absolute bottom-[20%] right-[7%] max-w-[480px] text-right transition-all duration-500"
          style={{
            opacity: progress > 0.38 && progress < 0.62 ? 1 : 0,
            transform: `translateY(${progress > 0.38 && progress < 0.62 ? 0 : 20}px)`
          }}
        >
          <h2 className="font-display text-[clamp(44px,7vw,104px)] leading-[0.9] tracking-[0.1em] text-white uppercase italic">
            PRECISION<br />CRAFTED
          </h2>
          <p className="text-[9px] tracking-[0.45em] text-white/35 mt-[14px] uppercase">Aerospace-grade titanium components</p>
          <div className="w-[60px] h-[1px] bg-apex-orange ml-auto mt-4" />
        </div>

        {/* Scene 4 */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center transition-all duration-500"
          style={{
            opacity: progress > 0.6 && progress < 0.8 ? 1 : 0,
            transform: `translate(-50%, ${progress > 0.6 && progress < 0.8 ? '-50%' : '-40%'})`
          }}
        >
          <h2 className="font-display text-[clamp(40px,8vw,120px)] leading-[0.9] tracking-[0.15em] text-white uppercase italic">
            POWERED<br />BY<br />INTELLIGENCE
          </h2>
          <p className="text-[9px] tracking-[0.5em] text-apex-orange mt-4 uppercase">Adaptive AI control systems</p>
        </div>

        {/* Scene 5 */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center transition-all duration-500"
          style={{
            opacity: progress > 0.82 ? 1 : 0,
            transform: `translate(-50%, ${progress > 0.82 ? '-50%' : '-40%'})`
          }}
        >
          <h2 className="font-display text-[clamp(60px,13vw,200px)] leading-[0.85] tracking-[0.2em] text-apex-orange shadow-[0_0_80px_rgba(255,77,0,0.5)] uppercase italic">
            APEX<br />MOTO
          </h2>
          <p className="text-[10px] tracking-[0.65em] text-white/35 mt-6 uppercase">Ride beyond the horizon</p>
          <div className="mt-8 pointer-events-auto">
            <a href="#" className="inline-block px-8 py-3.5 border border-apex-orange/15 text-apex-orange text-[9px] tracking-[0.5em] uppercase no-underline transition-all duration-400 hover:bg-apex-orange/15 hover:text-white hover:tracking-[0.6em]">
              Explore Platform →
            </a>
          </div>
        </div>
      </div>

      {/* Vignette + Scan Lines */}
      <div className="fixed inset-0 pointer-events-none z-[50] bg-[radial-gradient(ellipse_at_50%_50%,transparent_35%,rgba(0,0,0,0.75)_100%)]" />
      <div className="fixed inset-0 pointer-events-none z-[55] opacity-[0.025] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.15)_2px,rgba(255,255,255,0.15)_4px)]" />

      {/* Scroll Hint */}
      <div
        className="fixed bottom-9 left-1/2 -translate-x-1/2 text-center transition-opacity duration-600"
        style={{ opacity: progress < 0.05 ? 1 : 0 }}
      >
        <span className="block text-[8px] tracking-[0.55em] text-white/35 uppercase mb-2.5">Scroll</span>
        <div className="w-[1px] h-11 bg-gradient-to-b from-apex-orange to-transparent mx-auto animate-pulse-slow" />
      </div>
    </div>
  )
}

// ── MAIN COMPONENT ────────────────────────────────────────────
export function CinematicScrollExperience() {
  const containerRef = useRef<HTMLDivElement>(null!)
  const spacerRef = useRef<HTMLDivElement>(null!)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (typeof window === "undefined") return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: spacerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        onUpdate: (self) => setProgress(self.progress)
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="relative bg-black cursor-none">
      <div ref={spacerRef} className="h-[600vh] relative z-[1] pointer-events-none" />

      <div 
        className="fixed inset-0 z-0 transition-opacity duration-700"
        style={{ 
          opacity: progress > 0.99 ? 0 : 1,
          pointerEvents: progress > 0.99 ? 'none' : 'auto'
        }}
      >
        <Canvas
          shadows
          gl={{ antialias: true, powerPreference: "high-performance" }}
          camera={{ fov: 58, near: 0.1, far: 800, position: [0, 0, 12] }}
        >
          <color attach="background" args={["#000"]} />
          <fog attach="fog" args={["#000", 0.028]} />

          <Suspense fallback={null}>
            <Lighting />
            <AmbientBackground />

            <HeroScene visible={progress < 0.26} />
            <SpeedScene visible={progress > 0.16 && progress < 0.46} />
            <PrecisionScene visible={progress > 0.38 && progress < 0.66} />
            <IntelligenceScene visible={progress > 0.58 && progress < 0.84} progress={progress} />
            <ApexScene visible={progress > 0.76} progress={progress} />

            <CameraController progress={progress} />

            <Environment preset="night" />
          </Suspense>
        </Canvas>
      </div>

      <div 
        className="fixed inset-0 z-10 pointer-events-none transition-opacity duration-700"
        style={{ 
          opacity: progress > 0.99 ? 0 : 1,
          pointerEvents: progress > 0.99 ? 'none' : 'auto'
        }}
      >
        <OverlaySections progress={progress} />
      </div>
    </div>
  )
}

export default CinematicScrollExperience

