"use client";

import { motion } from "framer-motion";

export default function AnimatedVideoFrame({ src }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.3 }}
      className="relative w-full max-w-3xl mx-auto"
    >
      {/* Animated gradient frame */}
      <motion.div
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
        className="relative rounded-3xl p-[2px] bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 bg-[length:200%_200%]"
      >
        {/* Actual video container */}
        <div className="rounded-3xl overflow-hidden bg-black shadow-xl shadow-blue-500/20">
          <video
            src={src}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-auto object-cover"
          />
        </div>
      </motion.div>

      {/* Floating shadow effect */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 0.25, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-black/30 blur-2xl rounded-full"
      />
    </motion.div>
  );
}
