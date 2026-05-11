"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PerformanceRadar } from "@/components/performance-radar"
import { Button } from "@/components/ui/button"
import { bikes, allProducts, type Loadout, type Bike, type Product } from "@/lib/data"
import { useStore } from "@/lib/store"
import { Heart, Share2, ShoppingCart, User, Clock, ArrowRight, Filter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

export default function GalleryPage() {
  const [loadouts, setLoadouts] = useState<Loadout[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addToCart, setIsCartOpen } = useStore()

  useEffect(() => {
    // In a real app, fetch from API. For now, we'll simulate it with sample data
    // and attempt to fetch from our local backend if it's running
    const fetchLoadouts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/loadouts`)
        if (res.ok) {
          const data = await res.json()
          if (data.length > 0) {
            setLoadouts(data)
          } else {
            // Sample data if empty
            setLoadouts(sampleLoadouts)
          }
        }
      } catch (e) {
        setLoadouts(sampleLoadouts)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLoadouts()
  }, [])

  const handleDeploy = (loadout: Loadout) => {
    const bike = bikes.find(b => b.id === loadout.bikeId)
    if (!bike) return

    // Add bike
    addToCart({
      id: bike.id,
      name: `${bike.name} (BASE_CHASSIS)`,
      brand: bike.brand,
      category: "Engine",
      price: bike.basePrice,
      description: `Base performance configuration for ${bike.name}`,
      image: bike.image,
      stock: 1,
      stockStatus: "In Stock",
      specs: { Model: bike.model, Year: bike.year }
    })

    // Add parts
    loadout.partIds.forEach(id => {
      const part = allProducts.find(p => p.id === id)
      if (part) addToCart(part)
    })

    toast.success("MISSION_LOADOUT DEPLOYED", {
      description: `${loadout.name} configuration added to cart.`
    })
    setIsCartOpen(true)
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-apex-orange/10 border border-apex-orange/20 text-apex-orange text-[10px] font-black uppercase tracking-widest">
                <Filter className="w-3 h-3" />
                Community Intelligence
              </div>
              <h1 className="text-4xl lg:text-7xl font-display font-black text-white italic uppercase leading-none">
                Loadout <br /><span className="text-apex-orange">Gallery</span>
              </h1>
            </div>
            <div className="flex gap-4">
               <Link href="/#builder">
                  <Button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 h-14 px-8 rounded-2xl font-black italic uppercase tracking-tighter">
                    CREATE YOUR OWN
                  </Button>
               </Link>
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse rounded-[3rem]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loadouts.map((loadout, i) => (
                <LoadoutCard key={loadout.id} loadout={loadout} onDeploy={() => handleDeploy(loadout)} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

function LoadoutCard({ loadout, onDeploy, index }: { loadout: Loadout, onDeploy: () => void, index: number }) {
  const bike = bikes.find(b => b.id === loadout.bikeId)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden hover:border-apex-orange/30 transition-all duration-500 hover:shadow-[0_0_50px_rgba(255,77,0,0.1)]"
    >
      <div className="relative aspect-video">
        <Image 
          src={bike?.image || ""} 
          alt={loadout.name} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-60" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        
        <div className="absolute top-6 left-6">
           <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
              <User className="w-3 h-3 text-apex-orange" />
              <span className="text-[9px] font-black text-white uppercase tracking-widest">{loadout.creator}</span>
           </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
           <div>
              <h3 className="text-xl font-display font-black text-white italic uppercase tracking-tight">{loadout.name}</h3>
              <p className="text-[9px] text-neutral-500 font-black uppercase tracking-widest mt-1">{bike?.name}</p>
           </div>
           <div className="text-right">
              <p className="text-[8px] text-neutral-600 font-black uppercase tracking-widest mb-1">TOTAL_VAL</p>
              <p className="text-lg font-display font-black text-apex-orange italic">₹{loadout.totalPrice.toLocaleString('en-IN')}</p>
           </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
           <PerformanceRadar stats={loadout.stats} label="CONFIG_MATRIX" />
        </div>

        <div className="flex items-center justify-between">
           <div className="flex gap-4">
              <button className="flex items-center gap-1.5 text-neutral-500 hover:text-red-500 transition-colors">
                 <Heart className="w-4 h-4" />
                 <span className="text-[10px] font-black">{loadout.likes}</span>
              </button>
              <button className="flex items-center gap-1.5 text-neutral-500 hover:text-apex-orange transition-colors">
                 <Share2 className="w-4 h-4" />
              </button>
           </div>
           <Button 
            onClick={onDeploy}
            className="bg-apex-orange hover:bg-apex-orange/90 text-white font-black italic uppercase tracking-tighter px-6 h-12 rounded-xl shadow-lg shadow-apex-orange/20 gap-2"
           >
             <ShoppingCart className="w-4 h-4" />
             DEPLOY
           </Button>
        </div>
      </div>
    </motion.div>
  )
}

const sampleLoadouts: Loadout[] = [
  {
    id: "ld-001",
    name: "Night Crawler",
    creator: "Apex_Rider_01",
    bikeId: "bike-001",
    partIds: ["brake-002", "engine-001"],
    stats: { speed: 85, acceleration: 92, braking: 88, handling: 95 },
    totalPrice: 425000,
    likes: 124,
    createdAt: "2024-01-20T10:00:00Z"
  },
  {
    id: "ld-002",
    name: "Desert Storm",
    creator: "Nomad_Moto",
    bikeId: "bike-002",
    partIds: ["tyre-001", "susp-002"],
    stats: { speed: 65, acceleration: 68, braking: 75, handling: 82 },
    totalPrice: 342000,
    likes: 89,
    createdAt: "2024-01-21T14:30:00Z"
  },
  {
    id: "ld-003",
    name: "Neon Velocity",
    creator: "Cyber_Punk",
    bikeId: "bike-003",
    partIds: ["exhaust-001", "elec-001"],
    stats: { speed: 94, acceleration: 88, braking: 82, handling: 98 },
    totalPrice: 289000,
    likes: 256,
    createdAt: "2024-01-22T09:15:00Z"
  }
]
