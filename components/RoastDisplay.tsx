"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface RoastDisplayProps {
  copyRoast: string;
  designRoast: string;
  slopSignals: string[];
  fixFirst: string;
}

export default function RoastDisplay({ copyRoast, designRoast, slopSignals, fixFirst }: RoastDisplayProps) {
  const [copied, setCopied] = useState(false);

  const fullRoastText = `COPY ROAST:\n${copyRoast}\n\nDESIGN ROAST:\n${designRoast}\n\nFIX THIS FIRST:\n${fixFirst}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullRoastText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const text = `I just got my landing page roasted! 🔥\n\nSlop Signal: ${slopSignals[0]}\n"${fixFirst}"\n\nGet roasted at:`;
    const url = window.location.href;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      <div className="grid md:grid-cols-2 gap-6">
        {/* Copy Roast */}
        <motion.div variants={item} className="bg-dark-800 rounded-lg p-6 border border-gray-800 relative group hover:border-neon-blue/50 transition-colors">
          <div className="absolute top-0 left-0 w-1 h-full bg-neon-blue rounded-l-lg opacity-50"></div>
          <h3 className="text-xl font-bold text-neon-blue mb-3 flex items-center gap-2">
            <span>✍️</span> Copy Roast
          </h3>
          <p className="text-gray-300 leading-relaxed">{copyRoast}</p>
        </motion.div>

        {/* Design Roast */}
        <motion.div variants={item} className="bg-dark-800 rounded-lg p-6 border border-gray-800 relative group hover:border-neon-purple/50 transition-colors">
          <div className="absolute top-0 left-0 w-1 h-full bg-neon-purple rounded-l-lg opacity-50"></div>
          <h3 className="text-xl font-bold text-neon-purple mb-3 flex items-center gap-2">
            <span>🎨</span> Design Roast
          </h3>
          <p className="text-gray-300 leading-relaxed">{designRoast}</p>
        </motion.div>
      </div>

      {/* Slop Signals */}
      <motion.div variants={item} className="bg-dark-800 rounded-lg p-6 border border-gray-800">
        <h3 className="text-lg font-bold text-neon-orange mb-4 flex items-center gap-2">
          <span>🤖</span> AI Slop Signals Detected
        </h3>
        <div className="flex flex-wrap gap-2">
          {slopSignals.map((signal, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-dark-700 text-gray-300 rounded-full text-sm border border-gray-700"
            >
              {signal}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Fix First */}
      <motion.div variants={item} className="bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-lg p-6 border border-red-900/50">
        <h3 className="text-xl font-bold text-red-400 mb-2 flex items-center gap-2">
          <span>🚨</span> Fix This First
        </h3>
        <p className="text-lg text-white font-medium">{fixFirst}</p>
      </motion.div>

      {/* Action buttons */}
      <motion.div variants={item} className="flex justify-center gap-4 pt-4">
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-dark-700 hover:bg-dark-800 border border-gray-700 hover:border-gray-600 rounded-none text-sm transition-all"
        >
          {copied ? "Copied!" : "Copy Results"}
        </button>
        <button
          onClick={handleShare}
          className="px-4 py-2 bg-dark-700 hover:bg-dark-800 border border-gray-700 hover:border-gray-600 rounded-none text-sm transition-all flex items-center gap-2"
        >
          <span>Share on</span>
          <span className="font-bold">𝕏</span>
        </button>
      </motion.div>
    </motion.div>
  );
}
