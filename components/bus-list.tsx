"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BusInfo } from "@/types/bus";
import BusCard from "./buscard";

export function BusList({ buses }: { buses: BusInfo[] }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={buses[0]?.id} // Use first bus ID to trigger animation
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {buses.map((bus) => (
          <motion.div
            key={bus.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BusCard bus={bus} />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
