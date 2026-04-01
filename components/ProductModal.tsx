"use client";

import { useState } from "react";
import { X, Check, Truck, ShieldCheck, Banknote } from "lucide-react";
import { Product } from "@/lib/mockData";
import { useStore } from "@/lib/store";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart } = useStore();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [sizeError, setSizeError] = useState<boolean>(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // No useEffect needed anymore as 'key' prop in parent handles state reset

  const handleClose = () => {
    setSelectedSize("");
    setSizeError(false);
    onClose();
  };

  if (!product) return null;

  const handleAdd = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2500);
      return;
    }
    addToCart(product, selectedSize || undefined);
    handleClose();
  };

  const currentImage = product.images?.[activeImageIndex] || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-sm transition-opacity">
      <div 
        className="fixed inset-0"
        onClick={handleClose}
      />
      <div className="bg-white w-full max-w-5xl flex flex-col md:flex-row shadow-2xl overflow-hidden rounded-[2.5rem] relative animate-in fade-in zoom-in-95 duration-300 z-10 max-h-[95vh] md:h-[800px]">
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-30 p-2 bg-white/90 backdrop-blur shadow-xl rounded-full text-black hover:bg-black hover:text-white transition-all duration-300"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Section (Left) */}
        <div className="md:w-[55%] relative h-[400px] md:h-auto bg-[#f8f8f8] flex flex-col items-center justify-between p-6">
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Badge Foto Real */}
            <div className="absolute top-2 left-2 z-10">
              <span className="bg-white/95 backdrop-blur-sm text-[9px] font-black uppercase tracking-widest text-black px-3 py-1.5 rounded-full border border-gray-100 shadow-lg flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Detalle Real
              </span>
            </div>

            {currentImage ? (
              <img 
                key={activeImageIndex}
                src={currentImage} 
                alt={product.name} 
                className="w-full h-full object-cover rounded-2xl md:rounded-[2rem] shadow-sm animate-in fade-in duration-500"
              />
            ) : (
              <span className="text-gray-300 font-black text-xs uppercase tracking-[0.4em] px-8 text-center leading-relaxed">
                Bahía Moda<br/>{product.category}
              </span>
            )}
          </div>

          {/* Thumbnails Row */}
          {product.images && product.images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 px-4 py-3 bg-white/30 backdrop-blur-md rounded-2xl border border-white/40 shadow-xl overflow-x-auto max-w-[90%] hide-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImageIndex === idx ? 'border-black ring-2 ring-black/20 scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] bg-indigo-50 px-3 py-1 rounded-lg">
              {product.category}
            </span>
          </div>

          <h2 className="text-3xl font-black text-black uppercase tracking-tight leading-[1.1] mb-4">
            {product.name || "Producto Bahía Moda"}
          </h2>

          <div className="flex items-baseline gap-1 mb-8">
            <span className="text-sm font-bold text-gray-400">Q</span>
            <span className="text-4xl font-black text-black tracking-tighter">
              {product.price.toFixed(2)}
            </span>
          </div>

          <div className="prose prose-sm mb-10">
            <p className="text-gray-500 font-medium leading-relaxed">
              {product.description || "Este producto de alta calidad está disponible exclusivamente para nuestros clientes en el Puerto San José. Perfecto para complementar tu estilo con la elegancia de Bahía Moda."}
            </p>
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900">Seleccionar Talla</h4>
                {sizeError && <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest animate-pulse">¡Elige una talla!</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    className={`h-11 min-w-[3rem] px-4 rounded-xl text-xs font-bold transition-all border ${
                      selectedSize === size
                        ? "bg-black text-white border-black shadow-md scale-105"
                        : sizeError 
                          ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-900"
                    }`}
                  >
                    {size}
                    {selectedSize === size && <Check className="w-4 h-4 ml-1" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto pt-4 border-t border-gray-100">
            <button
              onClick={handleAdd}
              className="w-full bg-black text-white h-14 rounded-full shadow-lg font-bold tracking-wide uppercase hover:bg-gray-800 transition-transform active:scale-95"
            >
              Añadir al Carrito
            </button>
          </div>

          {/* Gatillos Psicológicos de Confianza (Ventas) */}
          <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-3 gap-6">
            <div className="flex flex-col items-center justify-center text-center">
               <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                 <Banknote className="w-5 h-5 text-black" />
               </div>
               <span className="text-[9px] font-black uppercase tracking-widest text-black leading-tight">Reserva 50%<br/><span className="text-gray-400 font-bold">Seguridad</span></span>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
               <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                 <Truck className="w-5 h-5 text-black" />
               </div>
               <span className="text-[9px] font-black uppercase tracking-widest text-black leading-tight">Solo Puerto<br/><span className="text-gray-400 font-bold">Escuintla</span></span>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
               <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                 <ShieldCheck className="w-5 h-5 text-black" />
               </div>
               <span className="text-[9px] font-black uppercase tracking-widest text-black leading-tight">Garantía<br/><span className="text-gray-400 font-bold">Original</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
