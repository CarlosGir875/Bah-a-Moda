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
      {/* ── CONTENEDOR DE IMAGEN (El "Lienzo" Gris) ── */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F3F4F4] rounded-xl sm:rounded-[1.5rem] flex items-center justify-center transition-all duration-500 ease-out shadow-[0_0_0_transparent] group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)] group-hover:-translate-y-1">
        
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-contain p-2 mix-blend-darken transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <span className="text-gray-300 font-black text-[10px] uppercase tracking-[0.2em] text-center px-4 leading-relaxed">
            Bahía Moda<br/>{product.category}
          </span>
        )}

        {/* Hover CTA: Botón minimalista de carrito dentro de la imagen (Siempre visible en móvil, fade-in en PC) */}
        <button 
          className="absolute right-2 bottom-2 sm:right-3 sm:bottom-3 w-8 h-8 sm:w-10 sm:h-10 bg-black/90 backdrop-blur-md text-white rounded-full flex items-center justify-center opacity-100 lg:opacity-0 transform translate-y-0 lg:translate-y-3 transition-all duration-400 ease-out group-hover:opacity-100 group-hover:translate-y-0 hover:bg-black hover:scale-105 active:scale-95 shadow-md lg:shadow-lg"
          onClick={(e) => {
            e.stopPropagation(); // Evita que se abra el modal si solo quiere añadir a la bolsa
            onClick(product); // Por ahora abre el modal, pero luego puedes conectarlo al carrito rápido
          }}
        >
          <ShoppingCart className="w-4 h-4 ml-[-1px]" strokeWidth={2.5} />
        </button>
      </div>

      {/* ── CONTENEDOR DE TEXTO (Alineación Editorial) ── */}
      <div className="pt-2 sm:pt-4 px-0.5 sm:px-1 flex flex-col">
        {/* Categoría / Marca */}
        <span className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-0.5 sm:mb-1">
          {product.category}
        </span>
        
        {/* Título Principal */}
        <h3 className="text-[12px] sm:text-[14px] font-bold text-gray-900 leading-tight line-clamp-2 mb-1.5 sm:mb-2 pr-1 sm:pr-4">
          {product.name || "Producto sin Nombre"}
        </h3>
        
        {/* Separación de Precio */}
        <div className="flex items-baseline gap-[1px] sm:gap-[2px]">
          <span className="text-[10px] sm:text-[11px] font-bold text-gray-900">Q</span>
          <span className="text-sm sm:text-lg font-black text-black tracking-tight">
            {product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
