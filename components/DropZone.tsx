"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";

interface DropZoneProps {
  onImageUpload: (base64: string, mimeType: string) => void;
  uploadedImage: string | null;
  disabled?: boolean;
}

export default function DropZone({
  onImageUpload,
  uploadedImage,
  disabled = false,
}: DropZoneProps) {
  const [preview, setPreview] = useState<string | null>(null);


  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        // Resize and compress image on client side
        // This significantly reduces payload size for the API call
        // Dynamically import to avoid SSR issues if any
        const { resizeImage } = await import("@/lib/imageUtils");
        const resizedDataUrl = await resizeImage(file);

        setPreview(resizedDataUrl);

        // Extract base64 and mime type
        const [meta, base64] = resizedDataUrl.split(",");
        const mimeType = meta.split(":")[1].split(";")[0];

        onImageUpload(base64, mimeType);
      } catch (err) {
        console.error("Error processing image:", err);
        // Fallback to original if resize fails
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          setPreview(result);
          const base64 = result.split(",")[1];
          onImageUpload(base64, file.type);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageUpload]
  );


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
    disabled,
  });

  const displayImage = preview || uploadedImage;

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onImageUpload("", "");
  };

  return (
    <div
      {...getRootProps()}
      className={`
        relative w-full max-w-2xl mx-auto aspect-video
        border-2 border-dashed rounded-lg
        transition-all duration-300 cursor-pointer
        ${isDragActive
          ? "border-lime-400 bg-lime-400/5 active-glow"
          : "border-white/20 hover:border-lime-400 hover:bg-white/5"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <input {...getInputProps()} />

      <AnimatePresence mode="wait">
        {displayImage ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 p-4"
          >
            <div className="relative w-full h-full border border-white/10 rounded overflow-hidden bg-black/50">
              <img
                src={displayImage}
                alt="Uploaded landing page"
                className="w-full h-full object-contain"
              />
            </div>
            {!disabled && (
              <button
                onClick={handleClear}
                className="absolute top-6 right-6 bg-black border border-white/20 hover:border-red-500 hover:text-red-500 text-white px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors"
              >
                [REMOVE_FILE]
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 font-mono"
          >
            <div className="text-4xl mb-4 text-lime-400/50">
              {isDragActive ? "[ ! ]" : "[ + ]"}
            </div>
            <p className="text-sm uppercase tracking-widest mb-2 text-white">
              {isDragActive
                ? "INITIALIZING UPLOAD..."
                : "UPLOAD_TARGET_FILE"}
            </p>
            <p className="text-white/40 text-xs">
              CLICK OR DRAG FILE HERE
            </p>
            <p className="text-white/20 text-[10px] mt-4 uppercase">
              SUPPORTED: PNG, JPG, WEBP (MAX 5MB)
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
