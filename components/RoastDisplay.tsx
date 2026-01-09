"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface RoastDisplayProps {
  copyRoast: string;
  designRoast: string;
  slopSignals: string[];
  fixFirst: string;
  slopScore?: number;
  shareUrl?: string;
}

export default function RoastDisplay({ copyRoast, designRoast, slopSignals, fixFirst, slopScore, shareUrl }: RoastDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const fullRoastText = `COPY ROAST:\n${copyRoast}\n\nDESIGN PATTERNS:\n${designRoast}\n\nFIX THIS FIRST:\n${fixFirst}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullRoastText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const handleShare = () => {
    const scoreText = slopScore !== undefined ? `Slop Score: ${slopScore}%\n\n` : "";
    const text = `I just got my landing page roasted! 🔥\n\n${scoreText}"${fixFirst}"\n\nGet roasted at:`;
    const url = shareUrl || window.location.origin;
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
      className="w-full space-y-8 font-mono"
    >
      <div className="grid md:grid-cols-2 gap-8">
        {/* Copy Roast */}
        <motion.div variants={item} className="space-y-2">
          <div className="text-xs text-lime-400 bg-lime-400/10 px-2 py-1 inline-block">[ ANALYSIS_COPY ]</div>
          <div className="p-4 border-l border-white/20 text-gray-300 text-sm leading-relaxed">
            {copyRoast}
          </div>
        </motion.div>

        {/* Design Patterns */}
        <motion.div variants={item} className="space-y-2">
          <div className="text-xs text-lime-400 bg-lime-400/10 px-2 py-1 inline-block">[ DESIGN_PATTERNS ]</div>
          <div className="p-4 border-l border-white/20 text-gray-300 text-sm leading-relaxed">
            {designRoast}
          </div>
        </motion.div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Slop Signals */}
      <motion.div variants={item}>
        <h3 className="text-xs text-gray-500 mb-4 uppercase tracking-wider">// DETECTED_PATTERNS</h3>
        <div className="flex flex-wrap gap-2">
          {slopSignals.map((signal, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-white/5 text-gray-300 text-xs border border-white/10"
            >
              {signal}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Fix First */}
      <motion.div variants={item} className="bg-red-500/5 border border-red-500/20 p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50" />
        <h3 className="text-red-500 text-sm font-bold uppercase mb-2 tracking-wider flex items-center gap-2">
          [ CRITICAL_ISSUE ]
        </h3>
        <p className="text-lg text-white/90">{fixFirst}</p>
      </motion.div>

      {/* Action buttons */}
      <motion.div variants={item} className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
        <button
          onClick={handleCopy}
          className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white text-xs tracking-widest uppercase transition-colors"
        >
          {copied ? "COPIED!" : "COPY_REPORT"}
        </button>
        {shareUrl && (
          <button
            onClick={handleCopyLink}
            className="px-6 py-3 bg-lime-400/10 hover:bg-lime-400/20 text-lime-400 text-xs tracking-widest uppercase transition-colors border border-lime-400/30"
          >
            {linkCopied ? "LINK_COPIED!" : "COPY_SHARE_LINK"}
          </button>
        )}
        <button
          onClick={handleShare}
          className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white text-xs tracking-widest uppercase transition-colors"
        >
          SHARE_ON_X
        </button>
      </motion.div>
    </motion.div>
  );
}
