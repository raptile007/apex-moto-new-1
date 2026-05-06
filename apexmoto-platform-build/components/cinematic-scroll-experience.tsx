"use client"

import { useRef, useEffect, useMemo, Suspense, useState, useCallback } from "react"
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber"
import { 
  Environment, 
  Float, 
  MeshDistortMaterial,
  Sparkles,
  Trail,
  MeshReflectorMaterial,
  useGLTF,
  Html,
  shaderMaterial
} from "@react-three/drei"
import * as THREE from "three"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// ============================================
// CUSTOM HOLOGRAPHIC SHADER MATERIAL
// ============================================
const HolographicMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color(0xff4d00),
    scrollProgress: 0,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    uniform float time;
    uniform float scrollProgress;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      
      vec3 pos = position;
      float displacement = sin(pos.x * 10.0 + time) * 0.02 * scrollProgress;
      displacement += sin(pos.y * 10.0 + time * 1.5) * 0.02 * scrollProgress;
      pos += normal * displacement;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    uniform float time;
    uniform vec3 color;
    uniform float scrollProgress;
    
    void main() {
      // Fresnel effect
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      float fresnel = pow(1.0 - dot(viewDirection, vNormal), 3.0);
      
      // Animated scan lines
      float scanLine = sin(vUv.y * 100.0 + time * 5.0) * 0.5 + 0.5;
      scanLine = smoothstep(0.3, 0.7, scanLine);
      
      // Color shifting
      vec3 shiftedColor = color;
      shiftedColor.r += sin(time + vUv.x * 3.14159) * 0.2;
      shiftedColor.g += sin(time * 0.7 + vUv.y * 3.14159) * 0.1;
      
      // Holographic rainbow effect
      float rainbow = sin(vUv.y * 20.0 - time * 2.0) * 0.5 + 0.5;
      vec3 rainbowColor = vec3(
        sin(rainbow * 6.28318 + 0.0) * 0.5 + 0.5,
        sin(rainbow * 6.28318 + 2.094) * 0.5 + 0.5,
        sin(rainbow * 6.28318 + 4.188) * 0.5 + 0.5
      );
      
      vec3 finalColor = mix(shiftedColor, rainbowColor, fresnel * 0.5 * scrollProgress);
      finalColor += fresnel * shiftedColor * 2.0;
      finalColor *= (0.8 + scanLine * 0.2);
      
      float alpha = 0.6 + fresnel * 0.4;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
)

extend({ HolographicMaterial })

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
// HOLOGRAPHIC FLOATING OBJECT
// ============================================
function HolographicObject({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<any>(null!)
  
  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return
    
    const t = state.clock.elapsedTime
    const { progress } = scrollStore
    
    meshRef.current.rotation.x = t * 0.3
    meshRef.current.rotation.y = t * 0.2
    meshRef.current.position.y = position[1] + Math.sin(t) * 0.3
    
    materialRef.current.time = t
    materialRef.current.scrollProgress = progress
  })
  
  return (
    <mesh ref={meshRef} position={position}>
      <icosahedronGeometry args={[1.5, 1]} />
      {/* @ts-ignore */}
      <holographicMaterial 
        ref={materialRef}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

// ============================================
// ENERGY BEAM / LASER GRID
// ============================================
function EnergyGrid() {
  const gridRef = useRef<THREE.Group>(null!)
  const beamRefs = useRef<THREE.Mesh[]>([])
  
  useFrame((state) => {
    if (!gridRef.current) return
    
    const t = state.clock.elapsedTime
    const { progress } = scrollStore
    
    // Pulse the grid
    gridRef.current.position.z = -30 + progress * 20
    
    beamRefs.current.forEach((beam, i) => {
      if (beam) {
        const material = beam.material as THREE.MeshBasicMaterial
        material.opacity = 0.3 + Math.sin(t * 2 + i * 0.5) * 0.2
        beam.scale.x = 1 + Math.sin(t * 3 + i) * 0.1
      }
    })
  })
  
  const beams = useMemo(() => {
    const items = []
    // Horizontal beams
    for (let i = -5; i <= 5; i++) {
      items.push({ pos: [0, i * 2, 0] as [number, number, number], rot: [0, 0, 0] as [number, number, number], key: `h${i}` })
    }
    // Vertical beams
    for (let i = -5; i <= 5; i++) {
      items.push({ pos: [i * 2, 0, 0] as [number, number, number], rot: [0, 0, Math.PI / 2] as [number, number, number], key: `v${i}` })
    }
    return items
  }, [])
  
  return (
    <group ref={gridRef}>
      {beams.map((beam, i) => (
        <mesh
          key={beam.key}
          ref={(el) => { if (el) beamRefs.current[i] = el }}
          position={beam.pos}
          rotation={beam.rot}
        >
          <planeGeometry args={[30, 0.02]} />
          <meshBasicMaterial
            color={CONFIG.colors.primary}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

// ============================================
// MORPHING DNA HELIX
// ============================================
function DNAHelix() {
  const groupRef = useRef<THREE.Group>(null!)
  const sphereCount = 40
  
  const sphereRefs = useRef<THREE.Mesh[]>([])
  const connectionRefs = useRef<THREE.Mesh[]>([])
  
  useFrame((state) => {
    if (!groupRef.current) return
    
    const t = state.clock.elapsedTime
    const { progress } = scrollStore
    
    groupRef.current.rotation.y = t * 0.2
    groupRef.current.position.z = -20 + progress * 15
    
    sphereRefs.current.forEach((sphere, i) => {
      if (!sphere) return
      
      const angle = (i / sphereCount) * Math.PI * 4 + t
      const y = (i - sphereCount / 2) * 0.5
      const radius = 2 + Math.sin(t + i * 0.2) * 0.3
      const strand = i % 2 === 0 ? 1 : -1
      
      sphere.position.x = Math.cos(angle) * radius * strand
      sphere.position.z = Math.sin(angle) * radius * strand
      sphere.position.y = y
      
      // Color shift based on position
      const material = sphere.material as THREE.MeshStandardMaterial
      const hue = (i / sphereCount + t * 0.1) % 1
      material.emissiveIntensity = 0.5 + Math.sin(t * 2 + i) * 0.3
    })
    
    // Update connections
    connectionRefs.current.forEach((conn, i) => {
      if (!conn || !sphereRefs.current[i * 2] || !sphereRefs.current[i * 2 + 1]) return
      
      const start = sphereRefs.current[i * 2].position
      const end = sphereRefs.current[i * 2 + 1].position
      
      conn.position.copy(start.clone().add(end).multiplyScalar(0.5))
      conn.lookAt(end)
      conn.scale.z = start.distanceTo(end)
    })
  })
  
  return (
    <group ref={groupRef} position={[6, 0, -20]}>
      {/* DNA Spheres */}
      {Array.from({ length: sphereCount }).map((_, i) => (
        <mesh
          key={`sphere-${i}`}
          ref={(el) => { if (el) sphereRefs.current[i] = el }}
        >
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? CONFIG.colors.primary : CONFIG.colors.secondary}
            emissive={i % 2 === 0 ? CONFIG.colors.primary : CONFIG.colors.secondary}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
      
      {/* Connections between strands */}
      {Array.from({ length: Math.floor(sphereCount / 2) }).map((_, i) => (
        <mesh
          key={`conn-${i}`}
          ref={(el) => { if (el) connectionRefs.current[i] = el }}
        >
          <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

// ============================================
// SPEED LINES / WARP EFFECT
// ============================================
function WarpSpeedLines() {
  const linesRef = useRef<THREE.Group>(null!)
  const lineCount = 100
  
  const lines = useMemo(() => {
    return Array.from({ length: lineCount }).map(() => ({
      x: (Math.random() - 0.5) * 30,
      y: (Math.random() - 0.5) * 30,
      z: Math.random() * -50,
      length: 2 + Math.random() * 5,
      speed: 0.5 + Math.random() * 1.5
    }))
  }, [])
  
  useFrame(() => {
    if (!linesRef.current) return
    
    const { progress, velocity } = scrollStore
    
    linesRef.current.children.forEach((line, i) => {
      const data = lines[i]
      const speed = Math.abs(velocity) * data.speed * 2
      
      // Scale based on velocity
      line.scale.z = 1 + speed * 2
      
      // Move lines when scrolling fast
      line.position.z += speed * 0.5
      if (line.position.z > 10) {
        line.position.z = -50
      }
      
      // Opacity based on velocity
      const material = (line as THREE.Mesh).material as THREE.MeshBasicMaterial
      material.opacity = Math.min(0.8, Math.abs(velocity) * 0.5)
    })
  })
  
  return (
    <group ref={linesRef}>
      {lines.map((line, i) => (
        <mesh key={i} position={[line.x, line.y, line.z]}>
          <boxGeometry args={[0.02, 0.02, line.length]} />
          <meshBasicMaterial
            color={CONFIG.colors.primary}
            transparent
            opacity={0}
          />
        </mesh>
      ))}
    </group>
  )
}

// ============================================
// FLOATING DATA PARTICLES WITH TRAILS
// ============================================
function DataParticles() {
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        -5 - Math.random() * 20
      ] as [number, number, number],
      speed: 0.3 + Math.random() * 0.7,
      offset: Math.random() * Math.PI * 2
    }))
  }, [])
  
  return (
    <group>
      {particles.map((p, i) => (
        <DataParticle key={i} {...p} index={i} />
      ))}
    </group>
  )
}

function DataParticle({ position, speed, offset, index }: { 
  position: [number, number, number]
  speed: number
  offset: number
  index: number
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (!meshRef.current) return
    
    const t = state.clock.elapsedTime * speed + offset
    const { progress } = scrollStore
    
    meshRef.current.position.x = position[0] + Math.sin(t) * 2
    meshRef.current.position.y = position[1] + Math.cos(t * 0.7) * 2
    meshRef.current.position.z = position[2] + progress * 15
    
    meshRef.current.rotation.x = t
    meshRef.current.rotation.y = t * 0.5
  })
  
  return (
    <Trail
      width={0.5}
      length={8}
      color={index % 2 === 0 ? CONFIG.colors.primary : CONFIG.colors.secondary}
      attenuation={(t) => t * t}
    >
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.1, 0]} />
        <meshStandardMaterial
          color={index % 2 === 0 ? CONFIG.colors.primary : CONFIG.colors.secondary}
          emissive={index % 2 === 0 ? CONFIG.colors.primary : CONFIG.colors.secondary}
          emissiveIntensity={1}
        />
      </mesh>
    </Trail>
  )
}

// ============================================
// REFLECTIVE GROUND PLANE
// ============================================
function ReflectiveGround() {
  const groundRef = useRef<THREE.Mesh>(null!)
  
  useFrame(() => {
    if (!groundRef.current) return
    
    const { progress } = scrollStore
    groundRef.current.position.z = -10 + progress * 10
  })
  
  return (
    <mesh ref={groundRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, -10]}>
      <planeGeometry args={[50, 100]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={50}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#050505"
        metalness={0.5}
        mirror={0.5}
      />
    </mesh>
  )
}

// ============================================
// INTERACTIVE CURSOR SPHERE
// ============================================
function CursorFollower() {
  const sphereRef = useRef<THREE.Mesh>(null!)
  const targetPos = useRef(new THREE.Vector3(0, 0, 5))
  const { viewport } = useThree()
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      
      targetPos.current.x = x * viewport.width * 0.3
      targetPos.current.y = y * viewport.height * 0.3
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [viewport])
  
  useFrame((state) => {
    if (!sphereRef.current) return
    
    const { progress } = scrollStore
    
    // Smooth follow
    sphereRef.current.position.lerp(targetPos.current, 0.1)
    sphereRef.current.position.z = 5 - progress * 3
    
    // Pulsing scale
    const scale = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.05
    sphereRef.current.scale.setScalar(scale)
  })
  
  return (
    <mesh ref={sphereRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={CONFIG.colors.primary}
        emissive={CONFIG.colors.primary}
        emissiveIntensity={2}
        transparent
        opacity={0.3}
      />
    </mesh>
  )
}

// ============================================
// ANIMATED CIRCUIT LINES
// ============================================
function CircuitLines() {
  const groupRef = useRef<THREE.Group>(null!)
  
  const paths = useMemo(() => {
    const items: { points: THREE.Vector3[], delay: number }[] = []
    
    // Create circuit-like paths
    for (let i = 0; i < 15; i++) {
      const points: THREE.Vector3[] = []
      let x = (Math.random() - 0.5) * 20
      let y = (Math.random() - 0.5) * 15
      const z = -15 - Math.random() * 20
      
      points.push(new THREE.Vector3(x, y, z))
      
      // Create right-angle paths like circuit boards
      for (let j = 0; j < 5; j++) {
        const direction = Math.random() > 0.5
        if (direction) {
          x += (Math.random() - 0.5) * 4
        } else {
          y += (Math.random() - 0.5) * 4
        }
        points.push(new THREE.Vector3(x, y, z))
      }
      
      items.push({ points, delay: Math.random() * 2 })
    }
    
    return items
  }, [])
  
  return (
    <group ref={groupRef}>
      {paths.map((path, i) => (
        <AnimatedCircuitLine key={i} points={path.points} delay={path.delay} index={i} />
      ))}
    </group>
  )
}

function AnimatedCircuitLine({ points, delay, index }: { 
  points: THREE.Vector3[]
  delay: number
  index: number
}) {
  const lineRef = useRef<THREE.Line>(null!)
  const [drawProgress, setDrawProgress] = useState(0)
  
  useFrame((state) => {
    const t = (state.clock.elapsedTime - delay) % 5
    if (t > 0) {
      setDrawProgress(Math.min(1, t / 2))
    }
  })
  
  const geometry = useMemo(() => {
    const totalPoints = Math.floor(points.length * drawProgress)
    const curve = new THREE.CatmullRomCurve3(points.slice(0, Math.max(2, totalPoints)))
    return new THREE.BufferGeometry().setFromPoints(curve.getPoints(50))
  }, [points, drawProgress])
  
  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        color={index % 2 === 0 ? CONFIG.colors.primary : "#ffffff"}
        transparent
        opacity={0.4}
        linewidth={1}
      />
    </line>
  )
}

// ============================================
// FLOATING TEXT LABELS WITH GLITCH
// ============================================
function GlitchText({ text, position, size = 0.5 }: { 
  text: string
  position: [number, number, number]
  size?: number
}) {
  const [glitchedText, setGlitchedText] = useState(text)
  const [isGlitching, setIsGlitching] = useState(false)
  
  useEffect(() => {
    const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
    
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.95) {
        setIsGlitching(true)
        
        let iterations = 0
        const glitchAnimation = setInterval(() => {
          setGlitchedText(
            text.split('').map((char, i) => {
              if (i < iterations) return text[i]
              return glitchChars[Math.floor(Math.random() * glitchChars.length)]
            }).join('')
          )
          
          iterations++
          if (iterations > text.length) {
            clearInterval(glitchAnimation)
            setGlitchedText(text)
            setIsGlitching(false)
          }
        }, 50)
      }
    }, 100)
    
    return () => clearInterval(glitchInterval)
  }, [text])
  
  return (
    <Html
      position={position}
      center
      style={{
        color: isGlitching ? CONFIG.colors.primary : '#ffffff',
        fontFamily: 'monospace',
        fontSize: `${size * 30}px`,
        fontWeight: 'bold',
        textShadow: isGlitching ? `0 0 10px ${CONFIG.colors.primary}` : 'none',
        whiteSpace: 'nowrap',
        pointerEvents: 'none'
      }}
    >
      {glitchedText}
    </Html>
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
      
      {/* Interactive cursor follower */}
      <CursorFollower />
      
      {/* Warp speed lines that appear when scrolling fast */}
      <WarpSpeedLines />
      
      {/* Particle system for depth */}
      <ParticleTunnel />
      
      {/* Data particles with trails */}
      <DataParticles />
      
      {/* Layered background planes */}
      <LayeredDepthPlanes />
      
      {/* Glowing decorative rings */}
      <GlowingRings />
      
      {/* Holographic floating object */}
      <HolographicObject position={[-5, 0, -8]} />
      
      {/* DNA Helix animation */}
      <DNAHelix />
      
      {/* Energy grid in background */}
      <EnergyGrid />
      
      {/* Circuit board lines */}
      <CircuitLines />
      
      {/* Reflective ground plane */}
      <ReflectiveGround />
      
      {/* Floating geometric accents */}
      <FloatingAccent position={[-4, 1, -3]} color={CONFIG.colors.primary} size={0.5} speed={0.8} />
      <FloatingAccent position={[5, -1, -8]} color={CONFIG.colors.secondary} size={0.7} speed={1.2} />
      <FloatingAccent position={[-3, 2, -12]} color={CONFIG.colors.primary} size={0.4} speed={0.6} />
      <FloatingAccent position={[4, 0, -18]} color={CONFIG.colors.accent} size={0.6} speed={1} />
      
      {/* Glitch text labels */}
      <GlitchText text="PERFORMANCE" position={[-6, 3, -10]} size={0.4} />
      <GlitchText text="PRECISION" position={[6, -2, -15]} size={0.4} />
      <GlitchText text="POWER" position={[-4, -3, -20]} size={0.4} />
      
      {/* Sparkle particles */}
      <Sparkles
        count={200}
        scale={30}
        size={3}
        speed={0.5}
        color={CONFIG.colors.primary}
      />
      
      {/* Environment for reflections */}
      <Environment preset="night" />
      
      {/* Fog for depth */}
      <fog attach="fog" args={[CONFIG.colors.background, 5, 60]} />
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
  const [scrollProgress, setScrollProgress] = useState(0)
  
  useEffect(() => {
    const unsubscribe = scrollStore.subscribe((progress) => {
      setScrollProgress(progress)
    })
    return unsubscribe
  }, [])
  
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Progress indicator */}
      <div className="fixed top-6 right-6 z-50 flex flex-col items-end gap-2">
        <div className="text-xs font-mono text-apex-orange">
          {Math.round(scrollProgress * 100)}%
        </div>
        <div className="w-1 h-32 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="w-full bg-gradient-to-b from-apex-orange to-red-600 rounded-full transition-all duration-100"
            style={{ height: `${scrollProgress * 100}%` }}
          />
        </div>
      </div>
      
      {/* Scroll velocity indicator */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-xl border border-white/10 rounded-full">
          <div className="w-2 h-2 rounded-full bg-apex-orange animate-pulse" />
          <span className="text-xs font-mono text-white/50">SCROLL TO EXPLORE</span>
        </div>
      </div>
      
      {/* Section 1: Hero */}
      <div className="h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <div className="overflow-hidden">
            <h1 
              className="text-6xl md:text-8xl font-display font-black italic text-white mb-4 tracking-tighter"
              style={{
                transform: `translateY(${scrollProgress * 100}px)`,
                opacity: 1 - scrollProgress * 3
              }}
            >
              APEX<span className="text-apex-orange">MOTO</span>
            </h1>
          </div>
          <p 
            className="text-xl text-neutral-400 max-w-md mx-auto"
            style={{ opacity: 1 - scrollProgress * 4 }}
          >
            Scroll to explore the future of performance
          </p>
          <div className="mt-8 animate-bounce" style={{ opacity: 1 - scrollProgress * 5 }}>
            <svg className="w-6 h-6 mx-auto text-apex-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Section 2: Innovation */}
      <div className="h-screen flex items-center">
        <div 
          className="ml-[10%] max-w-lg"
          style={{
            opacity: scrollProgress > 0.15 && scrollProgress < 0.45 ? 1 : 0,
            transform: `translateX(${scrollProgress > 0.15 && scrollProgress < 0.45 ? 0 : -50}px)`,
            transition: 'all 0.5s ease-out'
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-[1px] bg-apex-orange" />
            <span className="text-apex-orange font-display text-sm tracking-[0.3em] uppercase">Innovation</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mt-2 mb-4 text-balance">
            Engineered for <span className="italic text-apex-orange">Champions</span>
          </h2>
          <p className="text-neutral-400 leading-relaxed">
            Every component is precision-crafted using aerospace-grade materials and cutting-edge manufacturing techniques.
          </p>
          <div className="mt-6 flex gap-4">
            <div className="px-4 py-2 border border-white/20 rounded">
              <div className="text-2xl font-bold text-white">99.9%</div>
              <div className="text-xs text-neutral-500">Precision</div>
            </div>
            <div className="px-4 py-2 border border-white/20 rounded">
              <div className="text-2xl font-bold text-white">+40%</div>
              <div className="text-xs text-neutral-500">Performance</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Section 3: Technology */}
      <div className="h-screen flex items-center justify-end">
        <div 
          className="mr-[10%] max-w-lg text-right"
          style={{
            opacity: scrollProgress > 0.4 && scrollProgress < 0.7 ? 1 : 0,
            transform: `translateX(${scrollProgress > 0.4 && scrollProgress < 0.7 ? 0 : 50}px)`,
            transition: 'all 0.5s ease-out'
          }}
        >
          <div className="flex items-center gap-3 mb-4 justify-end">
            <span className="text-apex-orange font-display text-sm tracking-[0.3em] uppercase">Technology</span>
            <div className="w-12 h-[1px] bg-apex-orange" />
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mt-2 mb-4 text-balance">
            Beyond <span className="italic text-apex-orange">Limits</span>
          </h2>
          <p className="text-neutral-400 leading-relaxed">
            Advanced materials and computational design push the boundaries of what&apos;s possible on two wheels.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-2">
            {['AI', 'CFD', 'FEA'].map((tech) => (
              <div key={tech} className="px-3 py-2 bg-white/5 border border-white/10 rounded text-center">
                <div className="text-sm font-mono text-apex-orange">{tech}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Section 4: Call to Action */}
      <div className="h-screen flex items-center justify-center">
        <div 
          className="text-center pointer-events-auto"
          style={{
            opacity: scrollProgress > 0.7 ? 1 : 0,
            transform: `scale(${scrollProgress > 0.7 ? 1 : 0.9})`,
            transition: 'all 0.5s ease-out'
          }}
        >
          <h2 className="text-5xl md:text-7xl font-display font-black italic text-white mb-6 text-balance">
            Ready to <span className="text-apex-orange">Dominate</span>?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-12 py-4 bg-apex-orange text-white font-display font-bold text-lg uppercase tracking-wider hover:bg-apex-orange/90 transition-all duration-300 group">
              Explore Collection
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </button>
            <button className="px-12 py-4 border border-white/30 text-white font-display font-bold text-lg uppercase tracking-wider hover:bg-white/10 hover:border-white/50 transition-all duration-300">
              Learn More
            </button>
          </div>
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
      <div ref={scrollContainerRef} className="h-[500vh]">
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
