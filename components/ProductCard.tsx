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
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 rounded-3xl mb-4 shadow-sm flex flex-col items-center justify-center border border-gray-100 group-hover:shadow-xl transition-all duration-500">
        {/* Real Image Rendering */}
        {product.images && product.images.length > 0 ? (
          <>
            <img 
              src={product.images[0]} 
              alt="" 
              className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-125 saturate-200"
            />
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="absolute inset-0 w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-700 z-0"
            />
          </>
        ) : (
          <span className="text-gray-300 font-black text-[10px] uppercase tracking-[0.2em] text-center px-6 leading-relaxed">
            Bahía Moda<br/>{product.category}
          </span>
        )}
        
        {/* Badge Foto Real */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-white/90 backdrop-blur-sm text-[8px] font-black uppercase tracking-widest text-black px-2 py-1 rounded-full border border-gray-100 shadow-sm flex items-center gap-1">
            <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
            Foto 100% Real
          </span>
        </div>

        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />

        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <button className="w-full bg-white text-black py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-2xl hover:bg-gray-100 active:scale-95 transition-all">
            <ShoppingCart className="w-3.5 h-3.5" /> Ver Detalles
          </button>
        </div>
      </div>
      <div className="px-1 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md">
            {product.category}
          </span>
        </div>
        <h3 className="text-sm font-black text-black uppercase tracking-tight leading-tight line-clamp-2 mb-2">
          {product.name || "Producto sin Nombre"}
        </h3>
        <div className="mt-auto flex items-baseline gap-1">
          <span className="text-[10px] font-bold text-gray-400">Q</span>
          <span className="text-lg font-black text-black tracking-tighter">
            {product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
