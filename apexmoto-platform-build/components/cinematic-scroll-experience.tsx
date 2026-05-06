"use client"

import { useRef, useEffect, useMemo, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { 
  useTexture, 
  Environment, 
  Float, 
  MeshDistortMaterial,
  Text,
  Sparkles
} from "@react-three/drei"
import * as THREE from "three"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  // Scene sections - each represents a focal point
  sections: [
    { 
      name: "intro", 
      cameraPos: [0, 0, 15] as [number, number, number],
      cameraTarget: [0, 0, 0] as [number, number, number],
      fov: 60 
    },
    { 
      name: "dive", 
      cameraPos: [5, 2, 8] as [number, number, number],
      cameraTarget: [2, 0, -5] as [number, number, number],
      fov: 50 
    },
    { 
      name: "explore", 
      cameraPos: [-3, -1, 5] as [number, number, number],
      cameraTarget: [-2, 0, -10] as [number, number, number],
      fov: 45 
    },
    { 
      name: "finale", 
      cameraPos: [0, 0, 3] as [number, number, number],
      cameraTarget: [0, 0, -20] as [number, number, number],
      fov: 40 
    },
  ],
  // Colors matching ApexMoto theme
  colors: {
    primary: "#ff4d00",
    secondary: "#e60000",
    background: "#050505",
    accent: "#ffffff"
  }
}

// ============================================
// SCROLL PROGRESS STORE
// ============================================
const scrollStore = {
  progress: 0,
  velocity: 0,
  listeners: new Set<(progress: number, velocity: number) => void>(),
  
  setProgress(p: number, v: number) {
    this.progress = p
    this.velocity = v
    this.listeners.forEach(fn => fn(p, v))
  },
  
  subscribe(fn: (progress: number, velocity: number) => void) {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }
}

// ============================================
// PARALLAX IMAGE PLANE
// ============================================
interface ImagePlaneProps {
  position: [number, number, number]
  scale: [number, number, number]
  depthFactor: number
  rotationFactor?: number
  imagePath: string
  opacity?: number
}

function ImagePlane({ 
  position, 
  scale, 
  depthFactor, 
  rotationFactor = 0.1,
  imagePath,
  opacity = 1
}: ImagePlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const texture = useTexture(imagePath)
  const initialPos = useRef(new THREE.Vector3(...position))
  
  useFrame(() => {
    if (!meshRef.current) return
    
    const { progress, velocity } = scrollStore
    
    // Parallax depth movement
    meshRef.current.position.z = initialPos.current.z + progress * depthFactor * 20
    
    // Subtle rotation based on scroll velocity
    meshRef.current.rotation.y = velocity * rotationFactor * 0.5
    meshRef.current.rotation.x = velocity * rotationFactor * 0.2
    
    // Scale pulsing based on progress
    const scaleFactor = 1 + Math.sin(progress * Math.PI) * 0.05
    meshRef.current.scale.setScalar(scaleFactor)
  })
  
  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[scale[0], scale[1], 32, 32]} />
      <meshStandardMaterial 
        map={texture}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// ============================================
// FLOATING GEOMETRIC ACCENT
// ============================================
interface FloatingAccentProps {
  position: [number, number, number]
  color: string
  size?: number
  speed?: number
}

function FloatingAccent({ position, color, size = 1, speed = 1 }: FloatingAccentProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (!meshRef.current) return
    
    const t = state.clock.elapsedTime * speed
    const { progress } = scrollStore
    
    // Organic floating motion
    meshRef.current.position.y = position[1] + Math.sin(t) * 0.5
    meshRef.current.position.x = position[0] + Math.cos(t * 0.7) * 0.3
    
    // Rotate based on scroll
    meshRef.current.rotation.x = t * 0.3 + progress * Math.PI
    meshRef.current.rotation.y = t * 0.2
    
    // Scale based on scroll progress
    const scale = size * (0.8 + progress * 0.4)
    meshRef.current.scale.setScalar(scale)
  })
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[size, 0]} />
        <MeshDistortMaterial
          color={color}
          speed={2}
          distort={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </Float>
  )
}

// ============================================
// PARTICLE TUNNEL
// ============================================
function ParticleTunnel() {
  const particlesRef = useRef<THREE.Points>(null!)
  const count = 2000
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const radius = 3 + Math.random() * 8
      
      positions[i * 3] = Math.cos(theta) * radius
      positions[i * 3 + 1] = Math.sin(theta) * radius
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100
      
      // Orange to white gradient
      const mixFactor = Math.random()
      colors[i * 3] = 1
      colors[i * 3 + 1] = 0.3 + mixFactor * 0.7
      colors[i * 3 + 2] = mixFactor
    }
    
    return [positions, colors]
  }, [])
  
  useFrame(() => {
    if (!particlesRef.current) return
    
    const { progress, velocity } = scrollStore
    
    // Move particles towards camera as we scroll
    particlesRef.current.position.z = progress * 50
    particlesRef.current.rotation.z += velocity * 0.01
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}

// ============================================
// LAYERED DEPTH PLANES
// ============================================
function LayeredDepthPlanes() {
  const groupRef = useRef<THREE.Group>(null!)
  
  // Create multiple layers at different depths
  const layers = useMemo(() => [
    { z: -5, scale: 8, opacity: 0.9, parallaxFactor: 0.3 },
    { z: -15, scale: 12, opacity: 0.7, parallaxFactor: 0.5 },
    { z: -30, scale: 18, opacity: 0.5, parallaxFactor: 0.7 },
    { z: -50, scale: 25, opacity: 0.3, parallaxFactor: 0.9 },
  ], [])
  
  useFrame(() => {
    if (!groupRef.current) return
    
    const { progress } = scrollStore
    
    // Move entire group based on scroll
    groupRef.current.children.forEach((child, i) => {
      const layer = layers[i]
      if (layer) {
        child.position.z = layer.z + progress * layer.parallaxFactor * 30
      }
    })
  })
  
  return (
    <group ref={groupRef}>
      {layers.map((layer, i) => (
        <mesh key={i} position={[0, 0, layer.z]}>
          <planeGeometry args={[layer.scale * 1.8, layer.scale, 1, 1]} />
          <meshStandardMaterial
            color={CONFIG.colors.background}
            transparent
            opacity={layer.opacity}
            side={THREE.DoubleSide}
          >
            {/* Gradient effect through vertex colors would go here */}
          </meshStandardMaterial>
        </mesh>
      ))}
    </group>
  )
}

// ============================================
// GLOWING RINGS
// ============================================
function GlowingRings() {
  const ringsRef = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    if (!ringsRef.current) return
    
    const t = state.clock.elapsedTime
    const { progress } = scrollStore
    
    ringsRef.current.children.forEach((ring, i) => {
      ring.rotation.x = t * 0.1 * (i + 1)
      ring.rotation.y = t * 0.15 * (i + 1)
      ring.scale.setScalar(1 + progress * 0.5 + Math.sin(t + i) * 0.1)
    })
    
    ringsRef.current.position.z = -10 + progress * 15
  })
  
  return (
    <group ref={ringsRef}>
      {[2, 3, 4].map((radius, i) => (
        <mesh key={i}>
          <torusGeometry args={[radius, 0.02, 16, 100]} />
          <meshStandardMaterial
            color={CONFIG.colors.primary}
            emissive={CONFIG.colors.primary}
            emissiveIntensity={0.5}
            transparent
            opacity={0.6 - i * 0.15}
          />
        </mesh>
      ))}
    </group>
  )
}

// ============================================
// CINEMATIC CAMERA CONTROLLER
// ============================================
function CinematicCamera() {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(0, 0, 15))
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0))
  const currentPos = useRef(new THREE.Vector3(0, 0, 15))
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0))
  
  useFrame(() => {
    const { progress } = scrollStore
    const sections = CONFIG.sections
    
    // Determine which section we're in based on progress
    const totalSections = sections.length - 1
    const sectionIndex = Math.min(Math.floor(progress * totalSections), totalSections - 1)
    const sectionProgress = (progress * totalSections) - sectionIndex
    
    // Interpolate between current and next section
    const currentSection = sections[sectionIndex]
    const nextSection = sections[Math.min(sectionIndex + 1, sections.length - 1)]
    
    // Smooth easing function
    const eased = 1 - Math.pow(1 - sectionProgress, 3) // Cubic ease-out
    
    // Calculate target position
    targetPos.current.set(
      THREE.MathUtils.lerp(currentSection.cameraPos[0], nextSection.cameraPos[0], eased),
      THREE.MathUtils.lerp(currentSection.cameraPos[1], nextSection.cameraPos[1], eased),
      THREE.MathUtils.lerp(currentSection.cameraPos[2], nextSection.cameraPos[2], eased)
    )
    
    targetLookAt.current.set(
      THREE.MathUtils.lerp(currentSection.cameraTarget[0], nextSection.cameraTarget[0], eased),
      THREE.MathUtils.lerp(currentSection.cameraTarget[1], nextSection.cameraTarget[1], eased),
      THREE.MathUtils.lerp(currentSection.cameraTarget[2], nextSection.cameraTarget[2], eased)
    )
    
    // Smooth camera movement with lerp
    currentPos.current.lerp(targetPos.current, 0.05)
    currentLookAt.current.lerp(targetLookAt.current, 0.05)
    
    camera.position.copy(currentPos.current)
    camera.lookAt(currentLookAt.current)
    
    // Update FOV smoothly
    const targetFov = THREE.MathUtils.lerp(currentSection.fov, nextSection.fov, eased)
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 0.05)
      camera.updateProjectionMatrix()
    }
  })
  
  return null
}

// ============================================
// LIGHTING SETUP
// ============================================
function Lighting() {
  const spotLightRef = useRef<THREE.SpotLight>(null!)
  
  useFrame(() => {
    if (!spotLightRef.current) return
    
    const { progress } = scrollStore
    
    // Move spotlight based on scroll
    spotLightRef.current.position.x = Math.sin(progress * Math.PI * 2) * 10
    spotLightRef.current.intensity = 2 + progress * 3
  })
  
  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.2} />
      
      {/* Main directional light with soft shadows */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-bias={-0.0001}
        color={CONFIG.colors.accent}
      />
      
      {/* Dynamic spotlight for dramatic effect */}
      <spotLight
        ref={spotLightRef}
        position={[0, 10, 5]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        color={CONFIG.colors.primary}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      {/* Fill light from below */}
      <pointLight
        position={[0, -5, 0]}
        intensity={0.5}
        color={CONFIG.colors.secondary}
      />
    </>
  )
}

// ============================================
// 3D TEXT ELEMENTS
// ============================================
function TextElements() {
  const groupRef = useRef<THREE.Group>(null!)
  
  useFrame(() => {
    if (!groupRef.current) return
    
    const { progress } = scrollStore
    
    // Fade and move text based on scroll
    groupRef.current.children.forEach((child, i) => {
      const material = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
      if (material && material.opacity !== undefined) {
        // Each text element appears at different scroll positions
        const appearAt = i * 0.25
        const fadeOut = appearAt + 0.3
        
        if (progress < appearAt) {
          material.opacity = 0
        } else if (progress < fadeOut) {
          material.opacity = (progress - appearAt) / (fadeOut - appearAt)
        } else {
          material.opacity = Math.max(0, 1 - (progress - fadeOut) * 3)
        }
      }
    })
  })
  
  return (
    <group ref={groupRef}>
      <Text
        position={[0, 2, -5]}
        fontSize={1.5}
        color={CONFIG.colors.primary}
        anchorX="center"
        anchorY="middle"
        font="/fonts/orbitron.woff"
        letterSpacing={0.1}
      >
        APEX
      </Text>
      <Text
        position={[0, 0, -15]}
        fontSize={2}
        color={CONFIG.colors.accent}
        anchorX="center"
        anchorY="middle"
        font="/fonts/orbitron.woff"
        letterSpacing={0.05}
      >
        PERFORMANCE
      </Text>
      <Text
        position={[0, -1, -25]}
        fontSize={1}
        color={CONFIG.colors.primary}
        anchorX="center"
        anchorY="middle"
        font="/fonts/orbitron.woff"
        letterSpacing={0.2}
      >
        UNLEASHED
      </Text>
    </group>
  )
}

// ============================================
// MAIN SCENE CONTENT
// ============================================
function SceneContent() {
  return (
    <>
      <CinematicCamera />
      <Lighting />
      
      {/* Particle system for depth */}
      <ParticleTunnel />
      
      {/* Layered background planes */}
      <LayeredDepthPlanes />
      
      {/* Glowing decorative rings */}
      <GlowingRings />
      
      {/* Floating geometric accents */}
      <FloatingAccent position={[-4, 1, -3]} color={CONFIG.colors.primary} size={0.5} speed={0.8} />
      <FloatingAccent position={[5, -1, -8]} color={CONFIG.colors.secondary} size={0.7} speed={1.2} />
      <FloatingAccent position={[-3, 2, -12]} color={CONFIG.colors.primary} size={0.4} speed={0.6} />
      <FloatingAccent position={[4, 0, -18]} color={CONFIG.colors.accent} size={0.6} speed={1} />
      
      {/* Sparkle particles */}
      <Sparkles
        count={100}
        scale={20}
        size={2}
        speed={0.5}
        color={CONFIG.colors.primary}
      />
      
      {/* Environment for reflections */}
      <Environment preset="night" />
      
      {/* Fog for depth */}
      <fog attach="fog" args={[CONFIG.colors.background, 5, 50]} />
    </>
  )
}

// ============================================
// LOADING FALLBACK
// ============================================
function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={CONFIG.colors.primary} wireframe />
    </mesh>
  )
}

// ============================================
// SCROLL SECTIONS (HTML OVERLAYS)
// ============================================
function ScrollSections() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Section 1: Hero */}
      <div className="h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-6xl md:text-8xl font-display font-black italic text-white mb-4 tracking-tighter">
            APEX<span className="text-apex-orange">MOTO</span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-md mx-auto">
            Scroll to explore the future of performance
          </p>
          <div className="mt-8 animate-bounce">
            <svg className="w-6 h-6 mx-auto text-apex-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Section 2: Innovation */}
      <div className="h-screen flex items-center">
        <div className="ml-[10%] max-w-lg">
          <span className="text-apex-orange font-display text-sm tracking-[0.3em] uppercase">Innovation</span>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mt-2 mb-4">
            Engineered for <span className="italic">Champions</span>
          </h2>
          <p className="text-neutral-400 leading-relaxed">
            Every component is precision-crafted using aerospace-grade materials and cutting-edge manufacturing techniques.
          </p>
        </div>
      </div>
      
      {/* Section 3: Technology */}
      <div className="h-screen flex items-center justify-end">
        <div className="mr-[10%] max-w-lg text-right">
          <span className="text-apex-orange font-display text-sm tracking-[0.3em] uppercase">Technology</span>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mt-2 mb-4">
            Beyond <span className="italic">Limits</span>
          </h2>
          <p className="text-neutral-400 leading-relaxed">
            Advanced materials and computational design push the boundaries of what&apos;s possible on two wheels.
          </p>
        </div>
      </div>
      
      {/* Section 4: Call to Action */}
      <div className="h-screen flex items-center justify-center">
        <div className="text-center pointer-events-auto">
          <h2 className="text-5xl md:text-7xl font-display font-black italic text-white mb-6">
            Ready to <span className="text-apex-orange">Dominate</span>?
          </h2>
          <button className="px-12 py-4 bg-apex-orange text-white font-display font-bold text-lg uppercase tracking-wider hover:bg-apex-orange/90 transition-all duration-300 group">
            Explore Collection
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================
export function CinematicScrollExperience() {
  const containerRef = useRef<HTMLDivElement>(null!)
  const scrollContainerRef = useRef<HTMLDivElement>(null!)
  
  useEffect(() => {
    if (typeof window === "undefined") return
    
    // Initialize GSAP ScrollTrigger
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: scrollContainerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5, // Smooth scrubbing
        onUpdate: (self) => {
          // Calculate velocity
          const velocity = self.getVelocity() / 1000
          scrollStore.setProgress(self.progress, velocity)
        }
      })
    }, containerRef)
    
    return () => ctx.revert()
  }, [])
  
  return (
    <div ref={containerRef} className="relative">
      {/* Scroll container - determines total scroll length */}
      <div ref={scrollContainerRef} className="h-[400vh]">
        {/* Fixed 3D Canvas */}
        <div className="fixed inset-0 z-0">
          <Canvas
            shadows
            dpr={[1, 2]}
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: "high-performance",
            }}
            camera={{
              position: [0, 0, 15],
              fov: 60,
              near: 0.1,
              far: 100
            }}
          >
            <color attach="background" args={[CONFIG.colors.background]} />
            <Suspense fallback={<LoadingFallback />}>
              <SceneContent />
            </Suspense>
          </Canvas>
        </div>
        
        {/* HTML Overlay Sections */}
        <ScrollSections />
      </div>
    </div>
  )
}

export default CinematicScrollExperience
