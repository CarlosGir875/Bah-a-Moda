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
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-white rounded-3xl mb-3 shadow-sm flex items-center justify-center border border-gray-100 group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-500">
        {/* Real Image Rendering */}
        {product.images && product.images.length > 0 ? (
          <>
            {/* Aura sutil — colores del producto como fondo vivo */}
            <img
              src={product.images[0]}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-[60px] opacity-50 scale-150 saturate-150 select-none pointer-events-none"
            />
            {/* Imagen principal — siempre completa, nunca recortada */}
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="relative w-full h-full object-contain z-10 group-hover:scale-105 transition-transform duration-700 drop-shadow-xl p-2"
            />
          </>
        ) : (
          <span className="text-gray-300 font-black text-[10px] uppercase tracking-[0.2em] text-center px-4 leading-relaxed z-10">
            Bahía Moda<br/>{product.category}
          </span>
        )}
        
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
        <div className="mt-auto flex items-baseline gap-1.5">
          <span className="text-xl font-black text-black">Q</span>
          <span className="text-lg font-black text-black tracking-tighter">
            {product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
