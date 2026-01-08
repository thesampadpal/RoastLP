"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RoastResponse } from "@/lib/claude";
import DropZone from "@/components/DropZone";
import LoadingState from "@/components/LoadingState";
import SlopScore from "@/components/SlopScore";
import RoastDisplay from "@/components/RoastDisplay";

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>("");
  const [roastResult, setRoastResult] = useState<RoastResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (base64: string, mimeType: string) => {
    if (!base64) {
      // Clear was triggered
      setUploadedImage(null);
      setImageMimeType("");
      setRoastResult(null);
      setError(null);
      return;
    }
    setUploadedImage(`data:${mimeType};base64,${base64}`);
    setImageMimeType(mimeType);
    setRoastResult(null);
    setError(null);
  };

  const handleRoast = async () => {
    if (!uploadedImage || !imageMimeType) return;

    setIsLoading(true);
    setError(null);

    try {
      // Extract base64 from data URL
      const base64 = uploadedImage.split(",")[1];

      const response = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64,
          mimeType: imageMimeType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get roast");
      }

      setRoastResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to roast your page. Even our AI is speechless."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setImageMimeType("");
    setRoastResult(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-lime-400 selection:text-black overflow-x-hidden">
      {/* Background with Grid and Stars */}
      <div className="fixed inset-0 z-0 bg-grid opacity-20 pointer-events-none" />
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-black to-black pointer-events-none" />

      {/* Decorative Grid Lines */}
      <div className="fixed inset-0 z-0 pointer-events-none border-[20px] border-transparent">
        <div className="w-full h-full border border-white/5 rounded-3xl relative">
          <div className="absolute top-10 left-0 w-full h-px bg-white/5" />
          <div className="absolute top-0 left-10 w-px h-full bg-white/5" />
          <div className="absolute top-0 right-10 w-px h-full bg-white/5" />
          <div className="absolute bottom-10 left-0 w-full h-px bg-white/5" />
        </div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto p-8 min-h-screen flex flex-col">
        {/* Navigation Bar - Floating HUD */}
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-6 py-4 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-8">
            <h1 className="text-lg font-bold tracking-wider text-white">ROASTER.AI</h1>
            <div className="hidden md:flex gap-6 text-xs font-mono text-gray-400">
              <span className="hover:text-lime-400 cursor-pointer transition-colors">THE_INCINERATOR</span>
              <span className="hover:text-lime-400 cursor-pointer transition-colors">HALL_OF_SHAME</span>
              <span className="hover:text-lime-400 cursor-pointer transition-colors">EMOTIONAL_DAMAGE</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-xs font-mono text-gray-500">
              [v1.0.0 Beta]
            </div>
            <a
              href="https://github.com/thesampadpal"
              target="_blank"
              rel="noreferrer"
              className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs font-mono hover:bg-white/10 hover:text-red-400 transition-colors"
            >
              WAIVER
            </a>
          </div>
        </nav>

        {/* Main Content Layout */}
        <div className="flex-1 mt-24">
          {!roastResult ? (
            /* Intro / Input Mode */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Title & Context */}
              <div className="lg:col-span-7 flex flex-col justify-between h-full min-h-[500px]">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4 text-xs font-mono text-lime-400/80">
                    <span className="border border-lime-400/20 px-2 py-1">[ SYSTEM_READY ]</span>
                    <span>// WAITING_FOR_INPUT</span>
                  </div>

                  <h1 className="font-serif text-6xl md:text-8xl leading-[0.9] tracking-tighter">
                    OPEN<br />
                    <span className="italic">CRITICISM</span> FOR<br />
                    LANDING PAGES
                  </h1>

                  <p className="max-w-md text-gray-400 font-mono text-sm border-l border-white/20 pl-4 py-2">
                    Evaluate, Roast, and Rank your landing page performance using advanced AI agents.
                    Brutal honesty guarantees better conversions.
                  </p>
                </motion.div>

                {/* Stats Area */}
                <div className="grid grid-cols-2 gap-8 mt-12 lg:mt-0 p-6 border-t border-r border-white/10 relative">
                  <div className="absolute top-0 left-0 w-2 h-2 bg-white/20" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-white/20" />

                  <div>
                    <div className="text-xs font-mono text-gray-500 mb-1">[ Total Roasts ]</div>
                    <div className="text-3xl font-serif">+12.4K</div>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-gray-500 mb-1">[ Avg Slop Score ]</div>
                    <div className="text-3xl font-serif">84%</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interaction Zone */}
              <div className="lg:col-span-5 relative">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/5 border border-white/10 p-1 rounded-xl backdrop-blur-sm"
                >
                  <div className="bg-[#050505] rounded-lg p-6 border border-white/5 space-y-6">
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                      <h3 className="text-sm font-mono text-gray-300">INPUT_MODULE</h3>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500/50" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                        <div className="w-2 h-2 rounded-full bg-green-500/50" />
                      </div>
                    </div>

                    <DropZone
                      onImageUpload={handleImageUpload}
                      uploadedImage={uploadedImage}
                      disabled={isLoading}
                    />

                    <div className="space-y-4">
                      {error && (
                        <div className="p-3 border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-mono">
                          [ERROR]: {error}
                        </div>
                      )}

                      {isLoading ? (
                        <div className="h-12 w-full bg-white/5 border border-white/10 flex items-center justify-center gap-3">
                          <div className="w-4 h-4 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs font-mono text-lime-400 animate-pulse">ANALYZING GEOMETRY...</span>
                        </div>
                      ) : (
                        <button
                          onClick={handleRoast}
                          disabled={!uploadedImage}
                          className={`w-full py-4 text-sm font-bold font-mono tracking-widest uppercase transition-all duration-300 ${uploadedImage
                            ? 'bg-lime-400 hover:bg-lime-500 text-black shadow-[0_0_20px_rgba(204,255,0,0.3)]'
                            : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                            }`}
                        >
                          {uploadedImage ? 'Start_Analysis_Sequence' : 'Awaiting_Input'}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          ) : (
            /* Result Mode - Full Width Focus */
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key="results"
                className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
              >
                <div className="bg-white/5 p-6 border-b border-white/10 flex justify-between items-center sticky top-0 z-10 backdrop-blur-md">
                  <div className="flex items-center gap-4">
                    <h3 className="font-mono text-lime-400 text-lg tracking-wider">[ REPORT_GENERATED ]</h3>
                    <span className="text-xs font-mono text-gray-500 hidden md:block">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                  </div>
                  <button
                    onClick={handleReset}
                    className="group flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition-colors"
                  >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    INITIATE_NEW_SCAN
                  </button>
                </div>

                <div className="p-8 grid lg:grid-cols-12 gap-12">
                  {/* Left Panel: Visuals & Score */}
                  <div className="lg:col-span-4 space-y-8">
                    {/* Score first now */}
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <div className="text-xs font-mono text-gray-500 mb-4 uppercase tracking-widest border-b border-white/10 pb-2">Slop Probability</div>
                      <SlopScore score={roastResult!.slopScore} />
                    </div>

                    {/* Image second */}
                    <div className="rounded-lg border border-white/10 overflow-hidden bg-black relative group">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-end p-4">
                        <p className="text-xs font-mono text-white">TARGET_SUBJECT.png</p>
                      </div>
                      <img src={uploadedImage!} className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {/* Right Panel: The Roast */}
                  <div className="lg:col-span-8">
                    <RoastDisplay
                      copyRoast={roastResult!.copyRoast}
                      designRoast={roastResult!.designRoast}
                      slopSignals={roastResult!.slopSignals}
                      fixFirst={roastResult!.fixFirst}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
