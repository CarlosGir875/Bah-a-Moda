"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { MAIN_CATEGORIES } from "@/lib/mockData";
import { X, Package, ShieldCheck, Users } from "lucide-react";

export function SidebarLeft() {
  const { isLeftSidebarOpen, setIsLeftSidebarOpen, selectedCategory, setSelectedCategory, setSelectedFilter, user, profile, isAdmin, signOut } = useStore();
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);

  const handleSecretClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 3) {
      setClickCount(0);
      setIsLeftSidebarOpen(false);
      router.push('/admin');
    }
    setTimeout(() => setClickCount(0), 1000);
  };

  const handleNavigation = (path: string, category?: string) => {
    if (category) {
      setSelectedCategory(category);
      setSelectedFilter(""); // Clear top filter if a sidebar category is chosen
    } else {
      // If clicking catalog directly without a category, show all
      setSelectedCategory("");
      setSelectedFilter("Todo");
    }
    setIsLeftSidebarOpen(false);
    router.push(path);
  };

  return (
      <AnimatePresence>
        {isLeftSidebarOpen && (
          <>
            {/* Backdrop con Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50"
              onClick={() => setIsLeftSidebarOpen(false)}
            />

            {/* Sidebar Container */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-[85vw] sm:w-80 bg-white/95 backdrop-blur-xl shadow-[20px_0_60px_-15px_rgba(0,0,0,0.1)] flex flex-col border-r border-white/20"
            >
              <div className="h-full flex flex-col p-8 overflow-y-auto hide-scrollbar space-y-10">
                
                {/* Branding & Close */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col" onClick={handleSecretClick}>
                    <h2 className="text-2xl font-[900] uppercase tracking-[0.25em] text-black leading-none">Bahía</h2>
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mt-2 ml-0.5">Tienda Exclusiva</p>
                  </div>
                  <button
                    onClick={() => setIsLeftSidebarOpen(false)}
                    className="p-3 bg-gray-50 hover:bg-black hover:text-white rounded-2xl transition-all active:scale-90"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Main Discovery */}
                <div className="space-y-3">
                   <button
                    onClick={() => handleNavigation('/catalogo')}
                    className="w-full group relative h-14 bg-black text-white rounded-[1.2rem] overflow-hidden transition-all hover:shadow-xl hover:shadow-indigo-500/20 active:scale-[0.98]"
                  >
                     <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                     <div className="relative flex items-center justify-center gap-3">
                        <Package className="w-4 h-4 text-indigo-400" />
                        <span className="text-[11px] font-black uppercase tracking-[0.15em]">Catálogo Completo</span>
                     </div>
                  </button>
                  <button
                    onClick={() => handleNavigation('/')}
                    className="w-full h-14 bg-white border-2 border-gray-100 text-black rounded-[1.2rem] text-[11px] font-black uppercase tracking-[0.15em] hover:border-black transition-all"
                  >
                    Portada / Inicio
                  </button>
                </div>

                {/* Product Lines Section */}
                <div>
                   <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 px-1 flex items-center gap-2">
                     <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                     Líneas de Producto
                   </h3>
                   <ul className="space-y-2">
                      {MAIN_CATEGORIES.map((cat, idx) => {
                        const isSelected = selectedCategory === cat;
                        return (
                          <motion.li 
                            key={cat}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <button
                              onClick={() => handleNavigation('/catalogo', cat)}
                              className={`w-full group flex items-center justify-between px-5 py-4 rounded-[1.2rem] transition-all border ${
                                isSelected
                                  ? "bg-indigo-50 border-indigo-100 text-indigo-700 shadow-sm"
                                  : "bg-white border-gray-50 text-gray-600 hover:border-gray-200 hover:bg-gray-50/50"
                              }`}
                            >
                              <span className={`text-xs font-bold transition-all ${isSelected ? "translate-x-1" : "group-hover:translate-x-1"}`}>
                                {cat}
                              </span>
                              {isSelected && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]" />}
                            </button>
                          </motion.li>
                        );
                      })}
                   </ul>
                </div>

                {/* SECCIÓN ADMINISTRATIVA (Tablero Táctico) */}
                {isAdmin && (
                  <div className="mt-auto pt-8 border-t border-gray-100 space-y-6">
                    <div className="bg-zinc-50 rounded-[2.5rem] p-6 border border-zinc-100 shadow-inner">
                      <h4 className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.25em] mb-4 text-center">Herramientas de Control</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { path: '/admin', icon: ShieldCheck, label: 'Inventario', color: 'indigo' },
                          { path: '/admin/orders', icon: Package, label: 'Pedidos', color: 'black' },
                          { path: '/admin/users', icon: Users, label: 'Clientes', color: 'gray' }
                        ].map((item) => (
                          <button
                            key={item.path}
                            onClick={() => handleNavigation(item.path)}
                            className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-zinc-100 hover:border-indigo-200 hover:shadow-lg transition-all active:scale-95 group"
                          >
                            <div className={`p-2 rounded-xl bg-${item.color}-50 text-${item.color}-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors`}>
                              <item.icon className="h-4 w-4" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-black">
                              {item.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
  );
}
