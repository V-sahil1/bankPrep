"use client";

import { motion, MotionConfig } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18, ease: "easeOut" }}>
        {children}
      </motion.div>
    </MotionConfig>
  );
}
