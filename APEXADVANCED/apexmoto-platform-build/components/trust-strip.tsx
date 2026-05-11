"use client";

import { motion } from "framer-motion";
import { Trophy, Truck, Shield, Zap, BadgeCheck } from "lucide-react";

const TRUST_ITEMS = [
  { icon: Trophy, label: "10,000+ Orders", sub: "Fulfilled Globally" },
  { icon: Truck, label: "Free Shipping", sub: "On Orders Above ₹2,499" },
  { icon: BadgeCheck, label: "OEM Genuine Parts", sub: "100% Certified Authentic" },
  { icon: Zap, label: "Same-Day Dispatch", sub: "Before 3 PM IST" },
  { icon: Shield, label: "2-Year Warranty", sub: "On All Components" },
];

export function TrustStrip() {
  return (
    <section className="w-full border-y border-white/[0.06] bg-white/[0.02] py-0">
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop — horizontal row */}
        <div className="hidden md:flex items-stretch divide-x divide-white/[0.06]">
          {TRUST_ITEMS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ backgroundColor: "rgba(255,77,0,0.04)" }}
              className="group flex-1 flex items-center gap-4 px-6 py-6 transition-colors duration-300 cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-apex-orange/10 border border-apex-orange/20 flex items-center justify-center shrink-0 group-hover:bg-apex-orange/20 transition-colors duration-300">
                <item.icon className="w-5 h-5 text-apex-orange" />
              </div>
              <div>
                <p className="text-white text-sm font-bold leading-tight">{item.label}</p>
                <p className="text-neutral-600 text-[10px] uppercase tracking-widest font-medium mt-0.5">{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile — 2-column grid */}
        <div className="md:hidden grid grid-cols-2 divide-x divide-y divide-white/[0.06]">
          {TRUST_ITEMS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center gap-2 px-4 py-6 text-center"
            >
              <div className="w-9 h-9 rounded-xl bg-apex-orange/10 border border-apex-orange/20 flex items-center justify-center">
                <item.icon className="w-4 h-4 text-apex-orange" />
              </div>
              <p className="text-white text-xs font-bold leading-tight">{item.label}</p>
              <p className="text-neutral-600 text-[9px] uppercase tracking-wider">{item.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
