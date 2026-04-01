"use client";

import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { ProductModal } from "./ProductModal";
import { ProductSkeleton } from "./Skeleton";
import { Product, QUICK_FILTERS } from "@/lib/mockData";
import { useStore } from "@/lib/store";
import { useEffect } from "react";

export function ProductSection() {
  const { products, selectedCategory, setSelectedCategory, selectedFilter, setSelectedFilter, searchQuery, fetchProducts } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      // Only show loading if we don't have products yet
      if (products.length === 0) setLoading(true);
      await fetchProducts();
      if (isMounted) setLoading(false);
    };
    loadData();
    return () => { isMounted = false; };
  }, [fetchProducts, products.length]);

  const filteredProducts = products.filter(p => {
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

      {loading ? (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="break-inside-avoid">
              <ProductSkeleton />
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="break-inside-avoid mb-6">
              <ProductCard 
                product={product} 
                onClick={(p) => setSelectedProduct(p)} 
              />
            </div>
          ))}
        </div>
      ) : !loading && filteredProducts.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center animate-in fade-in duration-700">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">🏜️</span>
          </div>
          <p className="text-gray-900 text-lg font-black uppercase tracking-[0.2em]">Sección Vacía</p>
          <p className="text-gray-400 text-sm mt-3 font-bold">Aún no hay tesoros asignados a este filtro en el Puerto.</p>
        </div>
      ) : null}

      <ProductModal 
        key={selectedProduct?.id || 'none'}
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </section>
  );
}
