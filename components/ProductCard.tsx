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
      className="group relative flex flex-col cursor-pointer bg-[#F3F4F4] rounded-[2rem] overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2"
      onClick={() => onClick(product)}
    >
      {/* Etiqueta flotante (Opcional, si agregas ofertas después) */}
      {/* <div className="absolute top-4 left-4 z-10 bg-black text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Nuevo</div> */}

      {/* Image container */}
      <div className="relative aspect-[4/5] w-full flex items-center justify-center p-6 pb-2">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-darken"
          />
        ) : (
          <span className="text-gray-300 font-black text-[10px] uppercase tracking-[0.2em] text-center px-4 leading-relaxed">
            Bahía Moda<br/>{product.category}
          </span>
        )}
      </div>

      {/* Info Block (Integrado dentro del mismo cuadro gris) */}
      <div className="px-6 pb-6 pt-3 flex flex-col flex-1 z-10">
        <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.25em] mb-2 block">
          {product.category}
        </span>
        
        <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mb-4 pr-2">
          {product.name || "Producto sin Nombre"}
        </h3>
        
        <div className="mt-auto relative flex items-center justify-between h-8">
          {/* Precio */}
          <div className="flex items-baseline gap-1 transition-transform duration-300 group-hover:-translate-x-2">
            <span className="text-xs font-black text-black">Q</span>
            <span className="text-lg font-black text-black tracking-tighter">
              {product.price.toFixed(2)}
            </span>
          </div>

          {/* Hover CTA: Bolita flotante de carrito que aparece */}
          <button className="absolute right-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.3)] transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-gray-800 hover:scale-110 active:scale-95">
            <ShoppingCart className="w-4 h-4 ml-[-1px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
