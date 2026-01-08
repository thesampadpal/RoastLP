"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const loadingMessages = [
  "Examining your font choices...",
  "Counting the generic stock photos...",
  "Measuring the cringe...",
  "Detecting AI-generated slop...",
  "Analyzing buzzword density...",
  "Judging your color palette...",
  "Reading between the lines...",
  "Calculating disappointment levels...",
  "Searching for originality...",
  "Preparing maximum savagery...",
];

export default function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 font-mono">
      {/* Scanner animation */}
      <div className="relative w-16 h-16 mb-8 border border-white/20 rounded-full flex items-center justify-center">
        <div className="absolute inset-0 border border-lime-400/30 rounded-full animate-ping" />
        <div className="w-12 h-12 border-t-2 border-lime-400 rounded-full animate-spin" />
      </div>

      {/* Loading bar */}
      <div className="w-64 h-1 bg-white/10 overflow-hidden mb-6 relative">
        <motion.div
          className="h-full bg-lime-400"
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Rotating messages */}
      <div className="h-8 relative">
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="text-lime-400/80 text-xs uppercase tracking-widest text-center"
          >
            {'>'} {loadingMessages[messageIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
