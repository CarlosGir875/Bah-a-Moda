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
      {/* Image container — white card, minimalist style to blend with white page */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-white rounded-2xl mb-3 flex items-center justify-center group-hover:-translate-y-1 transition-all duration-400">
        {product.images && product.images.length > 0 ? (
          <>
            {/* Imagen principal — sin padding extra para que el "marco" sea parte de la foto */}
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
            />
          </>
        ) : (
          <span className="text-gray-300 font-black text-[10px] uppercase tracking-[0.2em] text-center px-4 leading-relaxed">
            Bahía Moda<br/>{product.category}
          </span>
        )}

        {/* Hover CTA */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-400 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
          <button className="w-full bg-white text-black py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:bg-gray-100 active:scale-95 transition-all">
            <ShoppingCart className="w-3.5 h-3.5" /> Ver Detalles
          </button>
        </div>
      </div>

      {/* Info below */}
      <div className="px-1 flex flex-col flex-1">
        <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1">
          {product.category}
        </span>
        <h3 className="text-sm font-bold text-gray-800 leading-tight line-clamp-2 mb-2">
          {product.name || "Producto sin Nombre"}
        </h3>
        <div className="mt-auto flex items-baseline gap-1">
          <span className="text-base font-black text-black">Q</span>
          <span className="text-base font-black text-black tracking-tight">
            {product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
