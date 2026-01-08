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
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreview(result);
        // Extract base64 data without the data URL prefix
        const base64 = result.split(",")[1];
        onImageUpload(base64, file.type);
      };
      reader.readAsDataURL(file);
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
        ${
          isDragActive
            ? "border-neon-orange border-glow bg-dark-800"
            : "border-gray-600 hover:border-neon-orange hover:border-glow"
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
            className="absolute inset-0 p-2"
          >
            <img
              src={displayImage}
              alt="Uploaded landing page"
              className="w-full h-full object-contain rounded"
            />
            {!disabled && (
              <button
                onClick={handleClear}
                className="absolute top-4 right-4 bg-dark-800 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Change
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6"
          >
            <div className="text-6xl mb-4">
              {isDragActive ? "🔥" : "📸"}
            </div>
            <p className="text-xl font-semibold text-center mb-2">
              {isDragActive
                ? "Drop it like it's hot"
                : "Drag & drop your landing page"}
            </p>
            <p className="text-gray-400 text-center">
              or click to select a file
            </p>
            <p className="text-gray-500 text-sm mt-4">
              PNG, JPG, WebP (max 5MB)
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
