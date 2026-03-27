"use client";

import { X } from "lucide-react";
import { useStore } from "@/lib/store";
import { CATEGORIES } from "@/lib/mockData";

export function FullscreenMenu() {
  const { isLeftSidebarOpen, setIsLeftSidebarOpen, selectedCategory, setSelectedCategory } = useStore();

  if (!isLeftSidebarOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex animate-in fade-in zoom-in-95 duration-500">
      {/* Background Image / Video */}
      <div className="absolute inset-0 w-full h-full bg-black">
        {/* PARA USAR UN VIDEO COMO FONDO:
            1. Consigue un video en formato MP4 (te recomiendo buscar en Coverr.co o Pexels).
            2. Pega tu archivo de video en la carpeta "public" con el nombre "menu-bg.mp4".
            3. Descomenta las siguientes 3 líneas y borra la etiqueta <img> de abajo.
            
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60">
              <source src="/menu-bg.mp4" type="video/mp4" />
            </video>
        */}
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop" 
          alt="Fashion Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
        />
        {/* Overlay degradado oscuro para que la letra resalte */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90 backdrop-blur-sm" /> 
      </div>

      <div className="relative z-10 w-full h-full flex flex-col p-6 sm:p-12 overflow-y-auto">
        <div className="flex justify-between items-center text-white mb-10">
          <span className="text-xs sm:text-sm tracking-[0.4em] uppercase font-light">
            Colecciones Especiales
          </span>
          <button 
            onClick={() => setIsLeftSidebarOpen(false)}
            className="p-4 hover:rotate-90 transition-transform duration-500 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md"
            aria-label="Cerrar Menú"
          >
            <X className="w-8 h-8" strokeWidth={1} />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center items-start max-w-6xl mx-auto w-full gap-4 sm:gap-6 pb-20">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setIsLeftSidebarOpen(false);
                document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-left group relative block"
            >
              <span className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter transition-all duration-500 ${
                selectedCategory === cat 
                  ? "text-white ml-4 sm:ml-8" 
                  : "text-white/40 hover:text-white hover:ml-4 sm:hover:ml-8"
              }`}>
                {cat}
              </span>
            </button>
          ))}
        </div>
        
        <div className="text-white/50 text-xs sm:text-sm tracking-widest uppercase flex justify-between mt-auto">
          <span>Moda Global en el Puerto</span>
          <span>© 2026</span>
        </div>
      </div>
    </div>
  );
}
