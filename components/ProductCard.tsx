"use client";


import { Product } from "@/lib/mockData";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <div 
      className="group flex flex-col cursor-pointer"
      onClick={() => onClick(product)}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-200 rounded-lg mb-3 shadow-inner flex flex-col items-center justify-center border border-gray-300">
        <span className="text-gray-500 font-bold text-[10px] uppercase tracking-widest text-center px-4">Espacio para Imagen<br/><br/>{product.category}</span>
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/60 to-transparent">
          <button className="w-full bg-white text-black py-2 rounded-md text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg">
            <ShoppingCart className="w-4 h-4" /> Ver Detalles
          </button>
        </div>
      </div>
      <div className="px-2 flex flex-col flex-1 pb-2">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 mt-1">{product.category}</p>
        <div className="h-3 sm:h-4 w-full bg-gray-100 rounded-sm mb-1.5"></div>
        <div className="h-3 sm:h-4 w-2/3 bg-gray-100 rounded-sm mb-3"></div>
        <div className="h-5 sm:h-6 w-1/3 bg-gray-200 rounded-sm mt-auto"></div>
      </div>
    </div>
  );
}
