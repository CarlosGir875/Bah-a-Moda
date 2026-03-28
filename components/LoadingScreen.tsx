"use client";

import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const { isInitialLoading } = useStore();
  const [shouldRender, setShouldRender] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (!isInitialLoading) {
      setFade(true);
      const timer = setTimeout(() => setShouldRender(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isInitialLoading]);

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#fdfdfd] transition-all duration-700 ease-in-out ${
        fade ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Visual background layers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.02)_0%,_transparent_70%)] opacity-40" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />

      {/* Logo Container */}
      <div className="relative group perspective-1000 flex items-center justify-center">
        <div className="absolute -inset-40 bg-gray-100/30 rounded-full blur-[120px] animate-pulse" />
        <div className="relative animate-float transition-transform duration-1000 flex items-center justify-center">
           <img 
             src="https://res.cloudinary.com/dthdq9vol/image/upload/v1774653054/Gemini_Generated_Image_9kn8v19kn8v19kn8_1_pe0177.png" 
             alt="Bahía Moda Logo" 
             className="w-full max-w-[90vw] md:max-w-[1200px] h-auto object-contain animate-shimmer mix-blend-multiply"
             style={{ 
               maskImage: 'radial-gradient(circle, black 40%, transparent 80%)',
               WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 80%)'
             }}
           />
        </div>
      </div>

      {/* Loader */}
      <div className="mt-12 flex flex-col items-center gap-6">
        {/* Minimal Progress Bar */}
        <div className="w-48 md:w-64 h-[3px] bg-gray-100 rounded-full overflow-hidden relative">
           <div className="h-full bg-black w-1/3 animate-loading-bar" />
        </div>
      </div>

      {/* Aesthetic Footer */}
      <div className="absolute bottom-12 left-0 right-0 text-center">
         <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400">
           Estableciendo el Estándar • Izabal, GT
         </p>
      </div>

      <style jsx>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(50%); }
          100% { transform: translateX(200%); }
        }
        .animate-loading-bar {
          animation: loading-bar 2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { filter: brightness(1) drop-shadow(0 0 0 rgba(99,102,241,0)); }
          50% { filter: brightness(1.1) drop-shadow(0 0 20px rgba(99,102,241,0.3)); }
          100% { filter: brightness(1) drop-shadow(0 0 0 rgba(99,102,241,0)); }
        }
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
