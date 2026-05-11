"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState<"idle" | "out" | "in">("idle");

  useEffect(() => {
    setTransitionStage("out");
    const t1 = setTimeout(() => {
      setDisplayChildren(children);
      setTransitionStage("in");
    }, 280);
    const t2 = setTimeout(() => setTransitionStage("idle"), 600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [pathname]); // eslint-disable-line

  return (
    <div className="relative overflow-hidden">
      {/* Wipe overlay — slides down then reveals */}
      <AnimatePresence>
        {transitionStage === "out" && (
          <motion.div
            key="wipe"
            className="fixed inset-0 z-[9999] pointer-events-none origin-top"
            style={{ background: "#050505" }}
            initial={{ scaleY: 0, transformOrigin: "top" }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0, transformOrigin: "bottom" }}
            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Orange flash line at top */}
      <AnimatePresence>
        {transitionStage !== "idle" && (
          <motion.div
            key="flash-line"
            className="fixed top-0 left-0 w-full h-[3px] z-[99999] pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, #ff4d00, transparent)" }}
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Page content */}
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
      >
        {displayChildren}
      </motion.div>
    </div>
  );
}
