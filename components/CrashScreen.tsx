"use client";

import { useStore } from "@/lib/store";
import { AlertTriangle, RefreshCw } from "lucide-react";

export function CrashScreen() {
  const { appError, retryInit } = useStore();

  if (!appError) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 text-white backdrop-blur-md transition-opacity duration-300">
      <div className="max-w-md w-full px-6 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-black tracking-tight mb-2 uppercase">
          Fallo de Conexión
        </h1>
        
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          Hemos detectado una inestabilidad en la red al intentar sincronizar tu información con Bahía Moda. 
        </p>

        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 w-full mb-8">
          <p className="text-xs text-red-400 font-mono text-left break-words">
            <span className="font-bold uppercase tracking-widest text-[10px] text-red-500/70 mb-1 block">Log Técnico:</span>
            {appError}
          </p>
        </div>

        <button
          onClick={retryInit}
          className="group relative flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all duration-300 w-full"
        >
          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          Reintentar Conexión
        </button>

        <p className="text-[10px] text-gray-600 mt-8 font-mono tracking-widest uppercase">
          Sistema Anti-Caídas Activo
        </p>
      </div>
    </div>
  );
}
