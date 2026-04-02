"use client";
import { Product } from "@/lib/mockData";
import { ShoppingCart } from "lucide-react";
interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}
import { useRef, useState } from "react";

export function ProductCard({ product, onClick }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -12; // Max 12 deg tilt
    const rotateY = ((x - centerX) / centerX) * 12;
    
    setRotate({ x: rotateX, y: rotateY });
  };

  return (
    <div className="perspective-1000">
      <div 
        ref={cardRef}
        className="group relative flex flex-col cursor-pointer bg-[#F3F4F4] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-[0_30px_50px_-15px_rgba(0,0,0,0.15)] will-change-transform"
        onClick={() => onClick(product)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setRotate({ x: 0, y: 0 });
        }}
        onMouseMove={handleMouseMove}
        style={{
          transform: isHovered 
            ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.02, 1.02, 1.02)` 
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered ? 'transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.6s ease',
          transformStyle: "preserve-3d"
        }}
      >
        {/* Etiqueta flotante (Opcional, si agregas ofertas después) */}
        {/* <div className="absolute top-4 left-4 z-10 bg-black text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full" style={{ transform: "translateZ(30px)" }}>Nuevo</div> */}

        {/* Image container */}
        <div className="relative aspect-[4/5] w-full flex items-center justify-center p-6 pb-2 overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-contain mix-blend-darken will-change-transform"
              style={{
                transform: isHovered 
                  ? `translate3d(${rotate.y * -1.5}px, ${rotate.x * 1.5}px, 20px) scale(1.08)`
                  : 'translate3d(0, 0, 0) scale(1)',
                transition: isHovered ? 'transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
            />
          ) : (
            <span className="text-gray-300 font-black text-[10px] uppercase tracking-[0.2em] text-center px-4 leading-relaxed">
              Bahía Moda<br/>{product.category}
            </span>
          )}
        </div>

        {/* Info Block (Integrado dentro del mismo cuadro gris) */}
        <div 
          className="px-6 pb-6 pt-3 flex flex-col flex-1 z-10"
          style={{ transform: "translateZ(30px)" }}
        >
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.25em] mb-2 block">
            {product.category}
          </span>
          
          <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mb-4 pr-2">
            {product.name || "Producto sin Nombre"}
          </h3>
          
          <div className="mt-auto relative flex items-center justify-between h-8">
            {/* Precio */}
            <div className="flex items-baseline gap-1" style={{ transform: "translateZ(40px)" }}>
              <span className="text-xs font-black text-black">Q</span>
              <span className="text-lg font-black text-black tracking-tighter">
                {product.price.toFixed(2)}
              </span>
            </div>

            {/* Hover CTA: Bolita flotante de carrito que aparece */}
            <button 
              className="absolute right-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.3)] opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out hover:bg-gray-800 hover:scale-110 active:scale-95 translate-y-4 group-hover:translate-y-0"
              style={{ transform: "translateZ(50px)" }}
            >
              <ShoppingCart className="w-4 h-4 ml-[-1px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
