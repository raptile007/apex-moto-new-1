"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";

export function HarleyPromo() {
  const ref = useRef<HTMLDivElement>(null);
  
  // Motion values for tracking mouse
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out the mouse movement
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  // Map mouse position to rotation (tilt)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  // Map mouse position to glare position
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section 
      className="relative w-full bg-[#050505] py-24 px-4 overflow-hidden" 
      style={{ perspective: 1200 }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto flex flex-col">
        <div className="flex flex-col gap-4 mb-12">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-white/20" />
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em]">PROMOTION_SERIES_01</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-black text-white tracking-tighter uppercase">
            American <span className="text-apex-orange italic">Muscle</span>
          </h2>
        </div>

        <motion.div 
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative group h-[500px] md:h-[700px] w-full rounded-[2rem] md:rounded-[4rem] cursor-pointer"
          initial="initial"
          whileHover="hover"
        >
          {/* Inner container for masking the image */}
          <div className="absolute inset-0 rounded-[2rem] md:rounded-[4rem] overflow-hidden">
            {/* Background Image with Scale Animation */}
            <motion.div 
              className="absolute inset-0 z-0"
              variants={{
                initial: { scale: 1 },
                hover: { scale: 1.1 }
              }}
              transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
            >
              <img 
                src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                alt="Harley Davidson Bike"
                className="w-full h-full object-cover filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              />
            </motion.div>

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80 z-10" />

            {/* Dynamic Glare Effect that follows the mouse */}
            <motion.div
              className="absolute z-10 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none mix-blend-overlay"
              style={{
                background: "radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)",
                left: glareX,
                top: glareY,
                transform: "translate(-50%, -50%)",
                width: "200%",
                height: "200%"
              }}
            />
          </div>

          {/* Glowing Border and Shadow on Hover */}
          <motion.div 
            className="absolute inset-0 border-2 border-apex-orange/0 rounded-[2rem] md:rounded-[4rem] z-20 pointer-events-none"
            variants={{
              initial: { borderColor: "rgba(255, 77, 0, 0)", boxShadow: "0px 0px 0px rgba(255,77,0,0)" },
              hover: { borderColor: "rgba(255, 77, 0, 0.4)", boxShadow: "0px 20px 50px -10px rgba(255,77,0,0.2)" }
            }}
            transition={{ duration: 0.4 }}
            style={{ transform: "translateZ(1px)" }}
          />

          {/* Content Overlay - Parallax offset in Z space */}
          <div 
            className="absolute bottom-0 left-0 w-full p-8 md:p-16 z-30 flex flex-col md:flex-row md:items-end justify-between gap-8"
            style={{ transform: "translateZ(60px)" }}
          >
            <div className="flex flex-col gap-4 max-w-xl drop-shadow-2xl">
              <motion.h3 
                className="text-3xl md:text-5xl font-display font-bold text-white leading-tight"
                variants={{
                  initial: { y: 20, opacity: 0.8 },
                  hover: { y: 0, opacity: 1 }
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                UNLEASH THE BEAST.
              </motion.h3>
              
              <motion.p 
                className="text-neutral-400 font-mono text-sm md:text-base leading-relaxed"
                variants={{
                  initial: { y: 20, opacity: 0 },
                  hover: { y: 0, opacity: 1 }
                }}
                transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
              >
                Experience the raw power of the Milwaukee-Eight V-Twin engine. 
                Custom performance parts now available for the 2024 lineup. 
                Dominate the asphalt with ApexMoto engineering.
              </motion.p>
            </div>

            {/* Action Button */}
            <motion.div
              variants={{
                initial: { x: -20, opacity: 0 },
                hover: { x: 0, opacity: 1 }
              }}
              transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            >
              <a href="/harley" className="flex items-center gap-4 bg-white/10 hover:bg-apex-orange backdrop-blur-md px-8 py-4 rounded-full text-white font-display uppercase tracking-widest text-xs transition-colors duration-300">
                Explore HD Catalog
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </div>
          
          {/* Mechanical Specs Overlay - Extreme Parallax offset */}
          <motion.div 
            className="absolute top-8 right-8 z-30 hidden md:flex flex-col gap-4 text-right drop-shadow-2xl"
            variants={{
              initial: { opacity: 0, x: 20 },
              hover: { opacity: 1, x: 0 }
            }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ transform: "translateZ(100px)" }}
          >
            <div className="flex flex-col">
              <span className="text-apex-orange text-[10px] font-bold tracking-[0.3em] uppercase drop-shadow-md">Displacement</span>
              <span className="text-white font-mono text-xl drop-shadow-md">114 CU IN</span>
            </div>
            <div className="flex flex-col">
              <span className="text-apex-orange text-[10px] font-bold tracking-[0.3em] uppercase drop-shadow-md">Torque</span>
              <span className="text-white font-mono text-xl drop-shadow-md">119 FT-LB</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
