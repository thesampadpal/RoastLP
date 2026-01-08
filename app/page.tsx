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
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="text-glow">Roast</span>{" "}
            <span className="text-white">My Landing Page</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Get your landing page brutally roasted by AI
          </p>
        </motion.div>

        {/* Main content */}
        {!roastResult ? (
          <>
            {/* Upload section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <DropZone
                onImageUpload={handleImageUpload}
                uploadedImage={uploadedImage}
                disabled={isLoading}
              />
            </motion.div>

            {/* Loading state */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8"
              >
                <LoadingState />
              </motion.div>
            )}

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 text-center"
              >
                <p className="text-red-400 bg-red-900/20 px-4 py-3 rounded-lg inline-block">
                  {error}
                </p>
              </motion.div>
            )}

            {/* Roast button */}
            {uploadedImage && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 text-center"
              >
                <button
                  onClick={handleRoast}
                  className="btn-neon text-lg"
                >
                  Get Roasted 🔥
                </button>
              </motion.div>
            )}
          </>
        ) : (
          /* Results section */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Score and image row */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Thumbnail */}
              <div className="order-2 md:order-1">
                <div className="bg-dark-800 rounded-lg p-4 border border-gray-800">
                  <img
                    src={uploadedImage!}
                    alt="Roasted landing page"
                    className="w-full h-48 object-contain rounded"
                  />
                </div>
              </div>

              {/* Score */}
              <div className="order-1 md:order-2 flex justify-center">
                <SlopScore score={roastResult.slopScore} />
              </div>
            </div>

            {/* Roast text */}
            <RoastDisplay
              copyRoast={roastResult.copyRoast}
              designRoast={roastResult.designRoast}
              slopSignals={roastResult.slopSignals}
              fixFirst={roastResult.fixFirst}
            />

            {/* Reset button */}
            <div className="text-center pt-4">
              <button
                onClick={handleReset}
                className="btn-neon"
              >
                Roast Another
              </button>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center text-gray-600 text-sm"
        >
          <p>Powered by Claude AI. No landing pages were permanently harmed.</p>
        </motion.footer>
      </div>
    </main>
  );
}
