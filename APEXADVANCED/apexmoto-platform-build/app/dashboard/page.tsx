"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Activity, 
  Zap, 
  Box, 
  History, 
  ChevronRight, 
  Trash2,
  Bike as BikeIcon,
  Heart,
  ArrowLeft,
  LayoutDashboard,
  Navigation,
  Wrench,
  Gauge,
  Trophy
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { bikes } from "@/lib/data"
import { useSound } from "@/hooks/use-sound"
import Image from "next/image"

export default function DashboardPage() {
  const { play } = useSound()
  const { orders, garage, removeFromGarage } = useStore()
  const [activeView, setActiveView] = useState("garage")

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* HUD Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
             <Link href="/">
                <motion.div 
                  whileHover={{ scale: 1.05, x: -2 }}
                  className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
                >
                   <ArrowLeft className="w-4 h-4" />
                   <span className="text-[10px] font-black tracking-widest uppercase">BACK_TO_HQ</span>
                </motion.div>
             </Link>
             <div className="h-8 w-px bg-white/10" />
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-apex-orange rounded-lg flex items-center justify-center">
                   <LayoutDashboard className="w-4 h-4 text-white" />
                </div>
                <h1 className="font-display font-black text-lg italic uppercase tracking-tighter">RESIDENT_<span className="text-apex-orange">DASHBOARD</span></h1>
             </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end mr-4">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">GUEST_OPERATOR</span>
                <span className="text-[8px] text-apex-orange font-black uppercase tracking-widest">RANK: APEX_PILOT</span>
             </div>
             <Button variant="ghost" size="icon" className="relative text-neutral-400 hover:text-white">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-apex-orange rounded-full animate-pulse" />
             </Button>
             <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white">
                <Settings className="w-5 h-5" />
             </Button>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
           {/* Sidebar Navigation */}
           <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-2 lg:space-y-2">
              {[
                { id: "garage", label: "Virtual Garage", icon: Box },
                { id: "orders", label: "Mission History", icon: History },
                { id: "stats", label: "Telemetry Hub", icon: Gauge },
                { id: "awards", label: "Achievements", icon: Trophy },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveView(item.id); play('beep'); }}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${
                    activeView === item.id 
                      ? "bg-apex-orange border-apex-orange text-white shadow-[0_0_20px_rgba(255,77,0,0.2)]" 
                      : "bg-white/5 border-white/5 text-neutral-400 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-4">
                     <item.icon className="w-4 h-4" />
                     <span className="text-[10px] font-black tracking-widest uppercase">{item.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${activeView === item.id ? "rotate-90" : ""}`} />
                </button>
              ))}
           </div>

           {/* Main Content Area */}
           <div className="lg:col-span-3 space-y-8">
              <AnimatePresence mode="wait">
                  {activeView === "garage" && (
                    <motion.div
                      key="garage"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-8"
                    >
                       {garage.length === 0 ? (
                         <div className="p-20 text-center bg-white/5 border border-dashed border-white/10 rounded-[3rem]">
                            <Box className="w-12 h-12 text-neutral-800 mx-auto mb-6" />
                            <h3 className="font-display font-black text-xl italic uppercase text-neutral-500">Virtual Garage Empty</h3>
                            <p className="text-xs text-neutral-600 mt-2 uppercase tracking-widest">Go to the Builder to save your first custom machine.</p>
                            <Link href="/#builder">
                               <Button className="mt-8 bg-white text-black font-bold h-12 px-8 rounded-xl uppercase text-xs">Open Builder</Button>
                            </Link>
                         </div>
                       ) : (
                         <div className="grid md:grid-cols-2 gap-6">
                            {garage.map((build, i) => (
                              <Card key={build.id} className="bg-white/5 border-white/10 overflow-hidden relative group">
                                 <div className="absolute top-0 right-0 p-4 z-10 flex gap-2">
                                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px] font-black tracking-widest uppercase">STABLE</Badge>
                                    <button 
                                      onClick={() => removeFromGarage(build.id)}
                                      className="p-1.5 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                                    >
                                       <Trash2 className="w-3 h-3" />
                                    </button>
                                 </div>
                                 <CardContent className="p-0">
                                    <div className="relative h-56 bg-neutral-900">
                                       <Image 
                                          src={build.bike.image} 
                                          alt={build.name} 
                                          fill
                                          className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                                       />
                                       <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                                    </div>
                                    <div className="p-8">
                                       <div className="flex justify-between items-start mb-2">
                                          <h3 className="font-display font-bold text-2xl tracking-tight text-white">{build.name}</h3>
                                          <span className="text-[10px] font-bold text-neutral-500">{new Date(build.createdAt).toLocaleDateString()}</span>
                                       </div>
                                       <p className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase mb-6">{build.bike.brand} // {build.bike.model} // Engineering Build V.1</p>
                                       
                                       <div className="space-y-4 mb-6">
                                          <div className="flex items-center gap-2">
                                             <div className="h-px flex-1 bg-white/5" />
                                             <span className="text-[8px] font-bold text-neutral-600 uppercase tracking-[0.2em]">Component Matrix</span>
                                             <div className="h-px flex-1 bg-white/5" />
                                          </div>
                                          <div className="grid grid-cols-3 gap-2">
                                             {Object.keys(build.parts).slice(0, 6).map(cat => (
                                                <div key={cat} className="p-2 bg-white/[0.02] border border-white/5 rounded-lg">
                                                   <p className="text-[7px] font-bold text-neutral-500 uppercase tracking-tighter mb-1">{cat}</p>
                                                   <p className="text-[9px] font-bold text-white truncate">{build.parts[cat].name}</p>
                                                </div>
                                             ))}
                                          </div>
                                       </div>

                                       <div className="grid grid-cols-2 gap-4">
                                          <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                                             <p className="text-[8px] font-bold text-neutral-600 uppercase tracking-widest mb-2">Health Index</p>
                                             <div className="flex items-center gap-2">
                                                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                                   <div className="h-full bg-emerald-500 w-[98%]" />
                                                </div>
                                                <span className="text-[10px] font-bold text-white">98%</span>
                                             </div>
                                          </div>
                                          <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                                             <p className="text-[8px] font-bold text-neutral-600 uppercase tracking-widest mb-2">Build Value</p>
                                             <span className="text-[11px] font-bold text-white">₹{build.bike.basePrice.toLocaleString('en-IN')}</span>
                                          </div>
                                       </div>
   
                                       <div className="mt-8 flex gap-3">
                                          <Button className="flex-1 bg-white hover:bg-neutral-200 text-black font-bold uppercase tracking-widest text-xs h-12 rounded-xl">
                                             VIEW SPECS
                                          </Button>
                                          <Button variant="outline" className="flex-1 border-white/10 text-white font-bold uppercase tracking-widest text-xs h-12 rounded-xl">
                                             EDIT BUILD
                                          </Button>
                                       </div>
                                    </div>
                                 </CardContent>
                              </Card>
                            ))}
                         </div>
                       )}
                    </motion.div>
                  )}

                 {activeView === "orders" && (
                   <motion.div
                     key="orders"
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -20 }}
                     className="space-y-6"
                   >
                      {orders.length === 0 ? (
                        <div className="p-20 text-center bg-white/5 border border-dashed border-white/10 rounded-[3rem]">
                           <History className="w-12 h-12 text-neutral-800 mx-auto mb-6" />
                           <h3 className="font-display font-black text-xl italic uppercase text-neutral-500">No Mission Records Found</h3>
                        </div>
                      ) : (
                        orders.map((order) => (
                          <div key={order.id} className="p-6 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-between group hover:border-apex-orange/30 transition-all">
                             <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                   <Zap className="w-5 h-5 text-apex-orange" />
                                </div>
                                <div>
                                   <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{order.orderNumber}</p>
                                   <h4 className="font-display font-black text-lg italic text-white uppercase">{order.items.length} Systems Deployed</h4>
                                </div>
                             </div>
                             <div className="text-right flex items-center gap-8">
                                <div>
                                   <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">VALUATION</p>
                                   <p className="text-sm font-black italic text-white">${order.total.toFixed(2)}</p>
                                </div>
                                <Badge className="bg-apex-orange text-white font-black italic text-[10px] tracking-widest uppercase px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(255,77,0,0.2)]">
                                   {order.status}
                                </Badge>
                             </div>
                          </div>
                        ))
                      )}
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>
        </div>

        {/* Global Tactical Summary */}
        <div className="grid md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/5">
           {[
             { label: "ENGINE_HOURS", val: "142.5", unit: "HRS", icon: Activity },
             { label: "TOTAL_FLIGHT_KM", val: "8,432", unit: "KM", icon: Navigation },
             { label: "SHIELD_STRENGTH", val: "98", unit: "%", icon: Shield },
           ].map((stat) => (
             <div key={stat.label} className="p-6 bg-white/[0.03] rounded-[2rem] border border-white/5 flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-apex-orange">
                   <stat.icon className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">{stat.label}</p>
                   <p className="text-2xl font-display font-black italic text-white uppercase tracking-tighter">
                      {stat.val} <span className="text-xs text-apex-orange ml-1">{stat.unit}</span>
                   </p>
                </div>
             </div>
           ))}
        </div>
      </main>
    </div>
  )
}
