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
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <div className="relative w-40 h-40">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="45"
            stroke="#1a1a1a"
            strokeWidth="10"
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx="80"
            cy="80"
            r="45"
            stroke={color}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              filter: `drop-shadow(0 0 10px ${color})`,
            }}
          />
        </svg>
        {/* Score number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-4xl font-bold"
            style={{ color, textShadow: `0 0 20px ${color}` }}
          >
            {displayScore}
          </span>
        </div>
      </div>

      {/* Label */}
      <p className="text-sm text-gray-400 mt-2 uppercase tracking-wider">
        AI Slop Score
      </p>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-lg font-semibold mt-1"
        style={{ color }}
      >
        {label}
      </motion.p>
    </motion.div>
  );
}
