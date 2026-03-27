"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { useStore } from "@/lib/store";
import { MAIN_CATEGORIES } from "@/lib/mockData";
import { useRouter } from "next/navigation";

export function SidebarLeft() {
  const { isLeftSidebarOpen, setIsLeftSidebarOpen, selectedCategory, setSelectedCategory, setSelectedFilter } = useStore();
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
        className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-[#f1f2f3] shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isLeftSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold uppercase tracking-wider text-black">Navegación</h2>
          <button
            onClick={() => setIsLeftSidebarOpen(false)}
            className="p-2 text-gray-500 hover:text-black hover:bg-white rounded-full transition-colors shadow-sm"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-full pb-20">
          
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
          <ul className="space-y-2">
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
        </div>

        {/* PUERTA SECRETA PARA EL ADMINISTRADOR (Easter Egg) */}
        <div className="absolute bottom-3 left-0 w-full text-center bg-transparent pointer-events-auto">
          <button 
            onClick={handleSecretClick}
            className="text-[9px] text-gray-300 font-bold uppercase tracking-[0.3em] outline-none"
          >
            BM v1.0
          </button>
        </div>
      </div>
    </>
  );
}
