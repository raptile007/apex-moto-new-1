"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

type CursorState = "default" | "hover" | "click";

export function CustomCursor() {
  const [isMounted, setIsMounted] = useState(false);
  const [cursorState, setCursorState] = useState<CursorState>("default");
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);
  const [isClicking, setIsClicking] = useState(false);


  // Primary cursor position (fast, raw)
  const rawX = useMotionValue(-200);
  const rawY = useMotionValue(-200);

  // Main cursor — snappy but stable
  const cursorXSpring = useSpring(rawX, { damping: 35, stiffness: 400 });
  const cursorYSpring = useSpring(rawY, { damping: 35, stiffness: 400 });

  // Trailing aura — smoother lag
  const auraXSpring = useSpring(rawX, { damping: 30, stiffness: 60 });
  const auraYSpring = useSpring(rawY, { damping: 30, stiffness: 60 });

  useEffect(() => {
    setIsMounted(true);

    const checkCapabilities = () => {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      const hasMouse = window.matchMedia("(pointer: fine)").matches;
      
      if (isDesktop && hasMouse) {
        document.documentElement.style.cursor = "none";
      } else {
        document.documentElement.style.cursor = "auto";
      }
    };

    const moveCursor = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const interactive = target.closest("button, a, [data-cursor], input, textarea, select, [role='button'], .cursor-pointer");

      if (interactive) {
        setCursorState("hover");
        const label = interactive?.getAttribute("data-cursor");
        setCursorLabel(label || null);
      } else {
        setCursorState("default");
        setCursorLabel(null);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("resize", checkCapabilities);

    checkCapabilities();

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", checkCapabilities);
      document.documentElement.style.cursor = "auto";
    };
  }, [rawX, rawY]);

  if (!isMounted) return null;

  const isHovering = cursorState === "hover";

  return (
    <>
      {/* === LAYER 1: Trailing aura blob === */}
      <motion.div
        className="fixed pointer-events-none z-[99998] hidden md:block rounded-full"
        animate={{
          width: isHovering ? 80 : 48,
          height: isHovering ? 80 : 48,
          opacity: isHovering ? 0.15 : 0.08,
          backgroundColor: isHovering ? "#ff4d00" : "#ffffff",
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{
          left: auraXSpring,
          top: auraYSpring,
          translateX: "-50%",
          translateY: "-50%",
          filter: "blur(12px)",
        }}
      />

      {/* === LAYER 2: Outer tactical ring === */}
      <motion.div
        className="fixed border rounded-full pointer-events-none z-[99998] hidden md:block"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovering ? 52 : 32,
          height: isHovering ? 52 : 32,
          borderColor: isHovering ? "rgba(255,77,0,0.8)" : "rgba(255,255,255,0.35)",
          borderWidth: isHovering ? 1.5 : 1,
          scale: isClicking ? 0.85 : 1,
          rotate: isHovering ? 45 : 0,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />

      {/* === LAYER 3: Inner precision dot === */}
      <motion.div
        className="fixed rounded-full bg-white pointer-events-none z-[99998] hidden md:block"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovering ? 6 : 5,
          height: isHovering ? 6 : 5,
          backgroundColor: isHovering ? "#ff4d00" : "#ffffff",
          scale: isClicking ? 0.6 : 1,
          boxShadow: isHovering
            ? "0 0 10px 2px rgba(255,77,0,0.9)"
            : "0 0 6px 1px rgba(255,255,255,0.6)",
        }}
        transition={{ duration: 0.15 }}
      />

      {/* === LAYER 4: Corner ticks === */}
      <AnimatePresence>
        {isHovering && !isClicking && (
          <>
            {[
              { tx: -20, ty: -20 },
              { tx: 12, ty: -20 },
              { tx: -20, ty: 12 },
              { tx: 12, ty: 12 },
            ].map((pos, i) => (
              <motion.div
                key={i}
                className="fixed pointer-events-none z-[99998] hidden md:block"
                style={{
                  left: cursorXSpring,
                  top: cursorYSpring,
                  translateX: `calc(-50% + ${pos.tx}px)`,
                  translateY: `calc(-50% + ${pos.ty}px)`,
                }}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative w-3 h-3">
                  <div className="absolute top-0 left-0 w-[6px] h-px bg-apex-orange" />
                  <div className="absolute top-0 left-0 h-[6px] w-px bg-apex-orange" />
                </div>
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* === LAYER 5: Label tooltip === */}
      <AnimatePresence>
        {cursorLabel && (
          <motion.div
            className="fixed pointer-events-none z-[99998] hidden md:block"
            style={{
              left: cursorXSpring,
              top: cursorYSpring,
              translateX: "-50%",
              translateY: "calc(-50% - 40px)",
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-[9px] font-black tracking-[0.25em] text-apex-orange bg-[#0a0a0a] px-3 py-1 rounded-sm border border-apex-orange/30 whitespace-nowrap uppercase font-display">
              {cursorLabel}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
