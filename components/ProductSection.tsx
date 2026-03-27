"use client";

import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { ProductModal } from "./ProductModal";
import { PRODUCTS, Product, QUICK_FILTERS } from "@/lib/mockData";
import { useStore } from "@/lib/store";

export function ProductSection() {
  const { selectedCategory, setSelectedCategory, selectedFilter, setSelectedFilter, searchQuery } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = PRODUCTS.filter(p => {
    // Search query takes highest priority
    if (searchQuery && searchQuery.trim() !== "") {
      return p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             p.category.toLowerCase().includes(searchQuery.toLowerCase());
    }
    // If a Quick Filter is active (e.g. "🔥 Ofertas Estrella")
    if (selectedFilter && selectedFilter !== "Todo") {
      return p.filterTag === selectedFilter;
    }
    // If a Main Category is active
    if (selectedCategory) {
      return p.category === selectedCategory;
    }
    return true; 
  });

  return (
    <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-8 py-6 w-full">
      {/* Botones Rápidos (Quick Filters) */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 sm:gap-3 mb-6 pb-2">
        {QUICK_FILTERS.map(f => (
          <button 
            key={f} 
            onClick={() => {
              setSelectedFilter(f);
              setSelectedCategory(""); // Resets main category to focus on quick filters
            }}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
              selectedFilter === f 
                ? 'bg-black text-white shadow-md' 
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 pb-4 border-b border-gray-200">
        <h2 className="text-xl sm:text-2xl font-bold tracking-wide uppercase text-black">
          {selectedCategory || selectedFilter || "Todo"}
        </h2>
        <span className="text-xs sm:text-sm text-gray-500 font-medium mt-2 sm:mt-0">
          {filteredProducts.length} Elementos Estructurales
        </span>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onClick={(p) => setSelectedProduct(p)} 
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center">
          <p className="text-gray-500 text-lg font-bold uppercase tracking-widest">Sección Vacía</p>
          <p className="text-gray-400 text-sm mt-2">Aún no hay componentes asignados a este filtro.</p>
        </div>
      )}

      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </section>
  );
}
