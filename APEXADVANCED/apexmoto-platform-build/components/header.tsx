"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ShoppingCart, Heart, Menu, X, MapPin, User, Radio, Github, Package, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { CartDrawer } from "./cart-drawer"
import { SatelliteTracking } from "./satellite-tracking"
import { useSound } from "@/hooks/use-sound"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
  const { cartCount, setSearchQuery, searchQuery, setIsCartOpen, wishlist } = useStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isTrackingOpen, setIsTrackingOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const { play } = useSound()

  const navItems = [
    { label: "Experience", href: "/experience" },
    { label: "Shop", href: "#products" },
    { label: "Brakes", href: "#products?category=Brakes" },
    { label: "Engine", href: "#products?category=Engine" },
    { label: "Drive", href: "#products?category=Drive" },
    { label: "Tyres", href: "#products?category=Tyres" },
  ]

  return (
    <>
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3"
              >
                <div className="w-9 h-9 bg-white text-black rounded-lg flex items-center justify-center font-bold text-base">
                  A
                </div>
                <span className="font-display font-bold text-xl tracking-tight text-white uppercase hidden sm:block">Apex<span className="text-neutral-400">Moto</span></span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-10">
              {[
                { label: "Experience", href: "/experience" },
                { label: "Shop", href: "#products" },
                { label: "Builder", href: "#builder" },
                { label: "Himalayan", href: "/himalayan" },
                { label: "Garage", href: "/dashboard" },
                { label: "Gallery", href: "/gallery" },
                { label: "Orders", href: "/orders" },
              ].map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 + 0.2 }}
                  whileHover={{ color: "#ff4d00" }}
                  className="text-xs font-semibold text-neutral-400 relative group transition-colors duration-200"
                  style={{ textShadow: "none" }}
                  onMouseEnter={e => (e.currentTarget.style.textShadow = "0 0 12px rgba(255,77,0,0.5)")}
                  onMouseLeave={e => (e.currentTarget.style.textShadow = "none")}
                >
                  {item.label}
                  {/* Expanding underline from center */}
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-[2px] bg-apex-orange rounded-full w-0 group-hover:w-full transition-all duration-300 shadow-[0_0_8px_rgba(255,77,0,0.8)]" />
                  {/* Tiny dot pip at center */}
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-apex-orange scale-0 group-hover:scale-100 transition-transform duration-200 delay-100" />
                </motion.a>
              ))}

              {/* Harley — Premium Sponsor Nav Item */}
              <motion.a
                href="/harley"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="relative group flex items-center gap-1.5 text-xs font-black uppercase tracking-wider transition-all duration-200"
                style={{ color: "#d4af37", textShadow: "0 0 10px rgba(212,175,55,0.3)" }}
                onMouseEnter={e => (e.currentTarget.style.textShadow = "0 0 20px rgba(212,175,55,0.8)")}
                onMouseLeave={e => (e.currentTarget.style.textShadow = "0 0 10px rgba(212,175,55,0.3)")}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                H-D
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-[2px] rounded-full w-0 group-hover:w-full transition-all duration-300" style={{ background: "#d4af37", boxShadow: "0 0 8px rgba(212,175,55,0.9)" }} />
              </motion.a>
            </nav>

            {/* Search Bar */}
            <motion.div 
              className="hidden md:flex items-center flex-1 max-w-md mx-8"
            >
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <Input
                  type="text"
                  placeholder="Search parts and components..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full pl-12 pr-4 h-11 bg-white/[0.03] border-white/5 rounded-xl focus:bg-white/[0.05] focus:border-white/20 text-white text-xs transition-all placeholder:text-neutral-600"
                />
              </div>
            </motion.div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white hover:bg-white/5" asChild>
                  <Link href="/orders">
                    <Package className="w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>

              <Link href="/dashboard">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="hidden sm:flex">
                  <Button 
                    variant="ghost" 
                    className="text-neutral-400 hover:text-white font-semibold text-xs gap-2 px-4"
                  >
                    <User className="w-4 h-4" />
                    Dashboard
                  </Button>
                </motion.div>
              </Link>

              <div className="h-6 w-px bg-white/10 hidden sm:block" />

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden sm:flex">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`relative ${isListening ? "text-apex-orange" : "text-neutral-400"} hover:text-apex-orange group`}
                  onClick={() => {
                    if (isListening) {
                      setIsListening(false)
                      return
                    }

                    play('scan')
                    setIsListening(true)
                    
                    // Web Speech API Integration
                    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
                    if (!SpeechRecognition) {
                      toast.error("VOICE_LINK_FAILED", { description: "Browser does not support tactical voice comms." })
                      setIsListening(false)
                      return
                    }

                    const recognition = new SpeechRecognition()
                    recognition.lang = 'en-US'
                    recognition.interimResults = false
                    
                    toast.info("APEX_VOICE_ACTIVE", { description: "Listening for tactical commands..." })

                    recognition.onresult = (event: any) => {
                      const command = event.results[0][0].transcript.toLowerCase()
                      toast.success("COMMAND_RECOGNIZED", { description: `Executing: "${command}"` })
                      
                      if (command.includes("dashboard") || command.includes("garage")) window.location.href = "/dashboard"
                      if (command.includes("gallery") || command.includes("builds")) window.location.href = "/gallery"
                      if (command.includes("home") || command.includes("hq")) window.location.href = "/"
                      if (command.includes("admin") || command.includes("panel")) window.location.href = "/admin"
                      if (command.includes("orders") || command.includes("history")) window.location.href = "/orders"
                      
                      setIsListening(false)
                    }

                    recognition.onerror = () => {
                      toast.error("VOICE_SIGNAL_LOST", { description: "Unable to clear interference." })
                      setIsListening(false)
                    }

                    recognition.onend = () => setIsListening(false)
                    recognition.start()
                  }}
                >
                  <div className="relative">
                    <Radio className="w-5 h-5" />
                    {isListening && (
                      <motion.div 
                        className="absolute -inset-2 bg-apex-orange/20 rounded-full"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </div>
                </Button>
              </motion.div>

              <ThemeToggle />

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative text-white hover:bg-white/5 hover:text-apex-orange group"
                  asChild
                >
                  <Link href="/admin">
                    <Shield className="w-5 h-5 transition-transform group-hover:rotate-12" />
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-apex-orange rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_#ff4d00]" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative text-white hover:bg-white/5 hover:text-apex-orange group"
                  onClick={() => {
                    play('beep')
                    toast.info("Tactical Wishlist [ ALPHA_ACCESS_LOCKED ]", {
                      description: "System integration in progress."
                    })
                  }}
                >
                  <Heart className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <AnimatePresence>
                    {wishlist.length > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1"
                      >
                        <Badge className="w-4 h-4 p-0 flex items-center justify-center text-[8px] font-black bg-white text-black border-2 border-[#050505]">
                          {wishlist.length}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden sm:flex">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative text-white hover:bg-white/5 hover:text-apex-orange"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1"
                      >
                        <Badge className="w-5 h-5 p-0 flex items-center justify-center text-[10px] font-black bg-apex-orange text-white border-2 border-[#050505]">
                          {cartCount}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex sm:hidden">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative text-white hover:bg-white/5 hover:text-apex-orange"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-apex-orange rounded-full" />
                  )}
                </Button>
              </motion.div>

              {/* Mobile Menu Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="lg:hidden">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-white"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Full-screen Mobile Drawer ─────────────────────────── */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                className="fixed inset-0 z-[998] bg-black/60 backdrop-blur-sm lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
              />

              {/* Drawer panel */}
              <motion.div
                key="drawer"
                className="fixed top-0 right-0 h-full w-[85vw] max-w-sm z-[999] bg-[#080808] border-l border-white/[0.07] flex flex-col lg:hidden overflow-hidden"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Drawer top bar */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
                  <span className="font-display font-black text-lg italic uppercase tracking-tight text-white">
                    Apex<span className="text-apex-orange">Moto</span>
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Search */}
                <div className="px-6 pt-5">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                    <input
                      type="text"
                      placeholder="Search parts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 h-11 bg-white/[0.04] border border-white/[0.07] rounded-xl text-white text-xs placeholder:text-neutral-700 outline-none focus:border-apex-orange/40 transition-colors"
                    />
                  </div>
                </div>

                {/* Nav items */}
                <nav className="flex-1 px-4 pt-6 space-y-1 overflow-y-auto">
                  {[
                    { label: "Experience", href: "/experience", sub: "Immersive 3D Tour" },
                    { label: "Shop Parts", href: "#products", sub: "All Categories" },
                    { label: "Bike Builder", href: "#builder", sub: "Custom Configurator" },
                    { label: "Himalayan 450", href: "/himalayan", sub: "Royal Enfield Series" },
                    { label: "Garage", href: "/dashboard", sub: "My Dashboard" },
                    { label: "Gallery", href: "/gallery", sub: "Build Showcase" },
                    { label: "Orders", href: "/orders", sub: "Track Delivery" },
                  ].map((item, i) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.1, ease: [0.22, 1, 0.36, 1] }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-3.5 rounded-xl group hover:bg-white/[0.04] transition-colors duration-200"
                    >
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-apex-orange transition-colors">{item.label}</p>
                        <p className="text-[10px] text-neutral-700 mt-0.5">{item.sub}</p>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-white/[0.04] border border-white/[0.07] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5h6M5 2l3 3-3 3" stroke="#ff4d00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </motion.a>
                  ))}

                  {/* H-D Gold link */}
                  <motion.a
                    href="/harley"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3.5 rounded-xl mt-1 group"
                    style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)" }}
                  >
                    <div>
                      <p className="text-sm font-black uppercase tracking-wider" style={{ color: "#d4af37" }}>
                        Harley-Davidson
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: "rgba(212,175,55,0.5)" }}>Official Premium Partner</p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                  </motion.a>
                </nav>

                {/* Bottom actions */}
                <div className="px-6 py-6 border-t border-white/[0.06] space-y-3">
                  <a href="/dashboard"
                    className="flex items-center justify-center gap-2 w-full h-11 bg-apex-orange text-white font-display font-black italic uppercase tracking-wider text-xs hover:bg-apex-orange/90 transition-colors rounded-xl"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Garage
                  </a>
                  <a href="/admin"
                    className="flex items-center justify-center w-full h-11 border border-white/[0.07] text-neutral-500 hover:text-white hover:border-white/20 text-xs font-bold uppercase tracking-widest transition-colors rounded-xl"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </a>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.header>

      <CartDrawer />
      <SatelliteTracking isOpen={isTrackingOpen} onClose={() => setIsTrackingOpen(false)} />
    </>
  )
}
