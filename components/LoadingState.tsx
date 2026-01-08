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
    <div className="flex flex-col items-center justify-center py-12">
      {/* Flame animation */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [-2, 2, -2],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="text-7xl mb-6"
      >
        🔥
      </motion.div>

      {/* Loading bar */}
      <div className="w-64 h-1 bg-dark-700 rounded-full overflow-hidden mb-6">
        <motion.div
          className="h-full bg-gradient-to-r from-neon-orange to-neon-pink"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Rotating messages */}
      <div className="h-8 relative">
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-gray-400 text-center"
          >
            {loadingMessages[messageIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
