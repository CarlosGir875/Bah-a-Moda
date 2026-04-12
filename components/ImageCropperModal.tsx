"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X, Check } from "lucide-react";

export interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropComplete: (croppedImageBlob: Blob) => Promise<void>;
}

// Utilidad para convertir base64 en Blob a partir del cropper
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number; }
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      if (file) {
        resolve(file);
      } else {
        reject(new Error("Canvas is empty"));
      }
    }, "image/jpeg", 0.9);
  });
}

export function ImageCropperModal({ isOpen, imageSrc, onClose, onCropComplete }: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = useCallback((location: { x: number; y: number }) => {
    setCrop(location);
  }, []);

  const onZoomChange = useCallback((zoomValue: number) => {
    setZoom(zoomValue);
  }, []);

  const onCropCompleteHandler = useCallback((croppedArea: any, croppedAreaPx: any) => {
    setCroppedAreaPixels(croppedAreaPx);
  }, []);

  const handleApplyCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setIsProcessing(true);
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      await onCropComplete(croppedBlob);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-[150] flex flex-col bg-black overflow-hidden animate-in fade-in duration-300">
      <div className="flex items-center justify-between p-4 bg-black/50 z-10">
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="text-white bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <span className="text-white font-bold tracking-widest uppercase text-xs">
          Ajustar Foto
        </span>
        <button
          onClick={handleApplyCrop}
          disabled={isProcessing}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full font-black text-[10px] tracking-widest uppercase hover:bg-indigo-500 transition-colors disabled:opacity-50"
        >
          {isProcessing ? "Procesando" : "Aplicar"}
          {!isProcessing && <Check className="w-4 h-4" />}
        </button>
      </div>

      <div className="relative flex-1 bg-zinc-900 w-full h-full">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteHandler}
          onZoomChange={onZoomChange}
        />
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-64 max-w-full px-4 z-10">
        <input
          type="range"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e) => {
            setZoom(Number(e.target.value));
          }}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
        />
      </div>
    </div>
  );
}
