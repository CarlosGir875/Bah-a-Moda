"use client";
import { useState } from "react";
import { X, ShieldCheck, Package, Users } from "lucide-react";
import { useStore } from "@/lib/store";
import { MAIN_CATEGORIES } from "@/lib/mockData";
import { useRouter } from "next/navigation";

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
    <>
      {isLeftSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 transition-opacity"
          onClick={() => setIsLeftSidebarOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isLeftSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col p-6 overflow-y-auto">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex-1">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-black uppercase tracking-[0.2em] text-black">Bahía Moda</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Tienda Exclusiva</p>
              </div>
            </div>
            <button
              onClick={() => setIsLeftSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 ml-2"
            >
              <X className="h-5 w-5 text-black" />
            </button>
          </div>
          
          <ul className="space-y-2 mb-6 border-b border-gray-200 pb-4">
            <li>
              <button
                onClick={() => handleNavigation('/')}
                className="w-full text-left px-4 py-3 rounded-lg transition-colors text-sm font-bold bg-white text-black border border-gray-200 hover:border-black"
              >
                Inicio (Portada)
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/catalogo')}
                className="w-full text-left px-4 py-3 rounded-lg transition-colors text-sm font-bold bg-black text-white shadow-md hover:bg-gray-800"
              >
                Catálogo Completo
              </button>
            </li>
          </ul>

          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 px-2">Líneas de Producto</h3>
          <ul className="space-y-2 mb-8">
            {MAIN_CATEGORIES.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => handleNavigation('/catalogo', cat)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors text-sm font-medium border ${
                    selectedCategory === cat
                      ? "bg-gray-200 text-black border-gray-300 shadow-sm"
                      : "bg-white text-gray-700 border-gray-100 hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>

          {/* SECCIÓN ADMINISTRATIVA (Solo visible para admin) */}
          {isAdmin && (
            <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-3">
              <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1 px-2">Herramientas de Control</h3>
              
              <button
                onClick={() => handleNavigation('/admin')}
                className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-50/50 text-indigo-700 rounded-2xl border border-indigo-100 transition-all hover:bg-indigo-100 group"
              >
                <div className="p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none">Inventario</p>
                </div>
              </button>

              <button
                onClick={() => handleNavigation('/admin/orders')}
                className="w-full flex items-center gap-3 px-4 py-3 bg-black text-white rounded-2xl border border-black transition-all hover:bg-gray-900 group shadow-lg"
              >
                <div className="p-2 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
                  <Package className="h-4 w-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none">Control de Pedidos</p>
                </div>
              </button>

              <button
                onClick={() => handleNavigation('/admin/users')}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 rounded-2xl border border-gray-100 hover:border-indigo-100 transition-all group"
              >
                <div className="p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                  <Users className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none">Base de Clientes</p>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
