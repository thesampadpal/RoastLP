"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { motion } from "framer-motion";
import SlopScore from "@/components/SlopScore";
import RoastDisplay from "@/components/RoastDisplay";
import Link from "next/link";

interface SharedRoast {
  copyRoast: string;
  designRoast: string;
  slopScore: number;
  slopSignals: string[];
  fixFirst: string;
  url?: string;
}

function decodeRoast(data: string): SharedRoast | null {
  try {
    const decoded = atob(decodeURIComponent(data));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export default function SharedRoastPage() {
  const params = useParams();
  const data = params.data as string;

  const roast = useMemo(() => decodeRoast(data), [data]);

  if (!roast) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-mono text-red-400">[ INVALID_LINK ]</h1>
          <p className="text-gray-400 font-mono text-sm">This roast link is broken or expired.</p>
          <Link
            href="/"
            className="inline-block mt-4 px-6 py-3 bg-lime-400 text-black font-mono text-sm uppercase tracking-wider hover:bg-lime-500 transition-colors"
          >
            Roast Your Own Page
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-lime-400 selection:text-black overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 bg-grid opacity-20 pointer-events-none" />
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-black to-black pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto p-8 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-12 pt-8">
          <Link href="/" className="text-lg font-bold tracking-wider text-white hover:text-lime-400 transition-colors">
            ROASTER.AI
          </Link>
          <Link
            href="/"
            className="px-4 py-2 bg-lime-400 text-black font-mono text-xs uppercase tracking-wider hover:bg-lime-500 transition-colors"
          >
            Roast Your Page
          </Link>
        </div>

        {/* Shared Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <span className="inline-block px-3 py-1 bg-lime-400/10 border border-lime-400/30 text-lime-400 text-xs font-mono uppercase tracking-wider">
            Shared Roast
          </span>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
        >
          <div className="p-8 space-y-8">
            {/* Score */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10 max-w-xs">
              <div className="text-xs font-mono text-gray-500 mb-4 uppercase tracking-widest border-b border-white/10 pb-2">
                Slop Probability
              </div>
              <SlopScore score={roast.slopScore} />
            </div>

            {/* Roast Content */}
            <RoastDisplay
              copyRoast={roast.copyRoast}
              designRoast={roast.designRoast}
              slopSignals={roast.slopSignals}
              fixFirst={roast.fixFirst}
            />
          </div>
        </motion.div>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 font-mono text-sm mb-4">Think you can do better?</p>
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-lime-400 text-black font-mono text-sm uppercase tracking-wider hover:bg-lime-500 transition-colors"
          >
            Get Your Page Roasted
          </Link>
        </div>
      </div>
    </main>
  );
}
