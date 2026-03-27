"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Start fade out at 1.5s, remove from DOM at 2s
    const timerFade = setTimeout(() => setIsFadingOut(true), 1500);
    const timerRemove = setTimeout(() => setIsVisible(false), 2000);
    return () => {
      clearTimeout(timerFade);
      clearTimeout(timerRemove);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-black transition-opacity duration-500 ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <Loader2 className="h-8 w-8 animate-spin mb-4" strokeWidth={1.5} />
      <h1 className="text-sm font-medium tracking-[0.2em] uppercase">
        Cargando Colección...
      </h1>
    </div>
  );
}
