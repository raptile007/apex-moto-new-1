"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollTop}
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.12, boxShadow: "0 0 30px rgba(255,77,0,0.5)" }}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-8 right-8 z-[5000] w-12 h-12 rounded-full bg-apex-orange flex items-center justify-center shadow-[0_0_20px_rgba(255,77,0,0.3)] border border-apex-orange/50"
        >
          {/* Ripple ring */}
          <motion.div
            className="absolute inset-0 rounded-full bg-apex-orange"
            animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          />
          <ChevronUp className="w-5 h-5 text-white relative z-10" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
