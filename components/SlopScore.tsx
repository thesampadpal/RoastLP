"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SlopScoreProps {
  score: number;
}

function getScoreColor(score: number): string {
  if (score <= 30) return "#22c55e"; // green
  if (score <= 60) return "#ffd600"; // yellow
  return "#ff0080"; // neon pink/red
}

function getScoreLabel(score: number): string {
  if (score <= 20) return "Surprisingly Original";
  if (score <= 40) return "Some Personality";
  if (score <= 60) return "Template Vibes";
  if (score <= 80) return "Heavy AI Slop";
  return "Maximum Slop Detected";
}

export default function SlopScore({ score }: SlopScoreProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  // Animate the score counting up
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  // Calculate the circle progress
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col"
    >
      <div className="flex items-end gap-2 mb-2">
        <span className={`text-5xl font-bold font-mono ${score > 50 ? 'text-red-500' : 'text-lime-400'}`}>
          {displayScore}%
        </span>
        <span className="text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">
          Probability
        </span>
      </div>

      <div className="w-full h-2 bg-white/10 overflow-hidden relative">
        <motion.div
          className={`h-full ${score > 50 ? 'bg-red-500' : 'bg-lime-400'}`}
          initial={{ width: 0 }}
          animate={{ width: `${displayScore}%` }}
          transition={{ duration: 1, ease: "circOut" }}
        />
        {/* Grid lines on bar */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik00IDBMMCA0IiBzdHJva2U9InJnYmEoMCwwLDAsMC4yKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-30" />
      </div>

      <div className="mt-2 flex justify-between items-center text-xs font-mono">
        <span className="text-gray-400 uppercase">{label}</span>
        <span className="text-gray-600">MAX_TOLERANCE: 20%</span>
      </div>
    </motion.div>
  );
}
