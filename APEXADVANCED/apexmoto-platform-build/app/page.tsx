"use client"

import { Header } from "@/components/header"
import { ArrowRight } from "lucide-react"
import { Hero } from "@/components/hero"
import Link from "next/link"
import { BikeBuilder } from "@/components/bike-builder"
import { ProductGrid } from "@/components/product-grid"
import { ProductModal } from "@/components/product-modal"
import { Footer } from "@/components/footer"
import { AboutSection } from "@/components/about-section"
import { FeatureBanner } from "@/components/feature-banner"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import dynamic from "next/dynamic"
import { ExplodedView3D } from "@/components/exploded-view-3d"
import { HarleyPromo } from "@/components/harley-promo"
import { TrustStrip } from "@/components/trust-strip"
import { VideoShowcase } from "@/components/video-showcase"

const CinematicScrollExperience = dynamic(
  () => import("@/components/cinematic-scroll-experience"),
  { 
    ssr: false,
    loading: () => (
      <div className="h-screen w-full bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-apex-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50 font-display tracking-wider text-sm uppercase italic">Preparing Engine</p>
        </div>
      </div>
    )
  }
)

const ShopMap = dynamic(() => import("@/components/shop-map").then(mod => mod.ShopMap), { 
  ssr: false,
  loading: () => <div className="h-[700px] bg-white/5 animate-pulse rounded-[3rem]" />
})

function AdventureSection() {
  const { scrollYProgress } = useScroll();
  const y = useSpring(useTransform(scrollYProgress, [0.6, 0.9], [0, 100]), { stiffness: 100, damping: 30 });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background py-24 group cursor-default">
      <div className="absolute inset-0 z-0 opacity-40 transition-opacity duration-700 group-hover:opacity-60">
        <motion.img 
          style={{ y }}
          src="/him-custom-hero.jpg"
          alt="Royal Enfield Himalayan 450"
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-black/50 to-background" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-8"
        >
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-apex-orange transition-all duration-500 group-hover:w-24" />
            <span className="text-[10px] font-bold text-apex-orange uppercase tracking-[0.4em] font-display">Expedition_Ready</span>
            <div className="h-px w-12 bg-apex-orange transition-all duration-500 group-hover:w-24" />
          </div>
          
          <h2 className="text-5xl lg:text-8xl font-display font-black text-white tracking-tighter leading-none transition-transform duration-700 group-hover:scale-105">
            BUILT FOR ALL ROADS.<br />
            <span className="text-apex-orange italic">BUILT FOR NO ROADS.</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12 w-full">
            {[
              { label: "COORDINATES", value: "31.1048° N, 77.1734° E" },
              { label: "TERRAIN", value: "ALL-ACCESS / HIGH-PASS" },
              { label: "ALTITUDE", value: "5,359M (KHARDUNG LA)" }
            ].map((spec) => (
              <div 
                key={spec.label} 
                className="flex flex-col items-center p-6 rounded-2xl border border-white/5 bg-black/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-apex-orange/30 hover:bg-apex-orange/10 hover:shadow-[0_0_30px_rgba(255,77,0,0.15)] cursor-pointer"
              >
                <span className="text-neutral-500 text-[10px] font-bold tracking-[0.3em] mb-2 uppercase transition-colors duration-300">{spec.label}</span>
                <span className="text-white text-xs font-mono tracking-wider transition-colors duration-300">{spec.value}</span>
              </div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <Link 
              href="/himalayan"
              className="group/btn inline-flex items-center gap-3 border border-apex-orange/50 text-apex-orange hover:bg-apex-orange hover:text-white font-display font-black italic uppercase tracking-wider px-10 py-4 transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,77,0,0.4)]"
            >
              Explore Himalayan Program
              <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <div className="min-h-screen bg-background selection:bg-apex-orange selection:text-white">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-apex-orange z-[100] origin-left"
        style={{ scaleX }}
      />
      
      <Header />
      
      <main>
        <CinematicScrollExperience />
        
        <section className="py-12 bg-white/[0.02] border-y border-white/5 relative overflow-hidden">
           <div className="max-w-7xl mx-auto px-4 overflow-hidden">
              <div className="flex items-center gap-12 animate-marquee whitespace-nowrap w-max">
                 {[...Array(2)].map((_, i) => (
                   <div key={i} className="flex items-center gap-12">
                      {["KTM", "HONDA", "YAMAHA", "BAJAJ", "TRIUMPH", "DUCATI", "APRILIA", "BMW"].map(brand => (
                        <span key={brand} className="text-4xl md:text-6xl font-display font-black text-white/10 italic tracking-tighter uppercase">{brand}</span>
                      ))}
                   </div>
                 ))}
              </div>
           </div>
        </section>

        <FeatureBanner />

        <TrustStrip />

        <BikeBuilder />

        <div className="max-w-7xl mx-auto px-4 py-24">
           <div className="flex flex-col gap-12 mb-16">
              <div className="flex items-center gap-4">
                 <div className="h-px w-12 bg-white/20" />
                 <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em]">ENGINEERING_SPECIFICATIONS_V1</span>
              </div>
              <h2 className="text-5xl lg:text-7xl font-display font-semibold text-white tracking-tight">
                 Technical <span className="text-neutral-500 font-light">Breakdown</span>
              </h2>
           </div>
           <div className="h-[600px] w-full rounded-[4rem] overflow-hidden border border-white/5 relative bg-[#050505]">
              <ExplodedView3D />
           </div>
        </div>

        <AboutSection />
        
        <div id="products">
          <ProductGrid />
        </div>
        
        <AdventureSection />
        
        <VideoShowcase />

        <HarleyPromo />

        <ShopMap />
      </main>
      
      <Footer />
      <ProductModal />
    </div>
  )
}

