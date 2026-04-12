"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, ShoppingBag, Search, User, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export function Navbar() {
  const { 
    setIsLeftSidebarOpen, 
    setIsCartOpen, 
    cart, 
    searchQuery, 
    setSearchQuery, 
    setIsAuthModalOpen,
    setIsProfileModalOpen,
    user,
    profile
  } = useStore();
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
    // Navigate to catalog if not already there
    if (pathname !== "/catalogo") {
      router.push("/catalogo");
    }
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  // Close search on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200 h-auto min-h-[4rem] py-2 flex flex-wrap items-center px-3 sm:px-8 transition-all w-full select-none">
      {/* Menu Izquierdo */}
      {!searchOpen && (
        <div className="flex-none w-20 flex justify-start">
          <button
            onClick={() => setIsLeftSidebarOpen(true)}
            className="p-2 -ml-2 text-black hover:bg-gray-200 rounded-md transition-colors flex items-center gap-2"
            aria-label="Menú de categorías"
          >
            <Menu className="h-6 w-6" strokeWidth={1.5} />
            <span className="hidden sm:inline font-bold text-xs tracking-wider">MENÚ</span>
          </button>
        </div>
      )}

      {/* Buscador expandible */}
      {searchOpen ? (
        <div className="flex-1 flex items-center gap-2 animate-in slide-in-from-top-1 fade-in duration-200 min-w-0 w-full">
          <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar en el catálogo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-0 w-full bg-transparent text-black placeholder-gray-400 text-sm font-medium focus:outline-none overflow-hidden text-ellipsis"
          />
          <button onClick={closeSearch} className="flex-shrink-0 p-1.5 text-gray-400 hover:text-black transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <>
          {/* Titulo Central */}
          <div className="flex-1 min-w-0 flex justify-center items-center overflow-hidden px-2">
            <Link href="/" className="font-black text-lg sm:text-2xl tracking-[0.1em] sm:tracking-[0.2em] uppercase text-black hover:opacity-70 transition-opacity truncate w-full text-center">
              Bahía Moda
            </Link>
          </div>

          {/* Utilidades: Buscar, Cuenta, Bolsa */}
          <div className="flex-none flex justify-end items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-hide py-1">
            <button onClick={openSearch} aria-label="Buscar" className="p-2 text-gray-500 hover:text-black hover:bg-gray-200 rounded-full transition-colors flex-shrink-0">
              <Search className="h-5 w-5" strokeWidth={1.7} />
            </button>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {user ? (
                <button 
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 text-black bg-gray-50 hover:bg-gray-100 rounded-full transition-all hover:scale-[1.02] border border-gray-200 shadow-sm active:scale-95"
                  aria-label="Perfil"
                >
                  <div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center shadow-inner">
                    <User className="h-4 w-4" strokeWidth={2.5} />
                  </div>
                  <span className="hidden sm:inline-block text-[11px] font-black uppercase tracking-widest text-gray-800">
                    {profile?.nombre_completo?.split(' ')[0] || user.email?.split('@')[0] || "Mi Cuenta"}
                  </span>
                </button>
              ) : (
                <button 
                  onClick={() => setIsAuthModalOpen(true)} 
                  aria-label="Mi Cuenta" 
                  className="p-2 text-gray-500 hover:text-black hover:bg-gray-200 rounded-full transition-colors"
                >
                  <User className="h-5 w-5" strokeWidth={1.7} />
                </button>
              )}
            </div>
            <div className="w-px h-5 bg-gray-300 mx-1 hidden sm:block"></div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-black hover:bg-gray-200 rounded-full transition-all hover:scale-105"
              aria-label="Carrito de compras"
            >
              <ShoppingBag className="h-[22px] w-[22px]" strokeWidth={1.8} />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold h-[18px] w-[18px] flex items-center justify-center rounded-full shadow-sm border-[1.5px] border-white">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </>
      )}
    </nav>
  );
}
