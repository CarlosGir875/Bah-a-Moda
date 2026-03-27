"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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

  // Reset selected size and error state when modal is closed or opened for a new product
  useEffect(() => {
    if (product) {
      setSelectedSize("");
      setSizeError(false);
    }
  }, [product?.id]);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 transition-opacity">
      <div 
        className="fixed inset-0"
        onClick={handleClose}
      />
      <div className="bg-white w-full max-w-4xl flex flex-col md:flex-row shadow-2xl overflow-hidden rounded-xl relative animate-in fade-in zoom-in-95 duration-200 z-10 max-h-[90vh]">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/70 backdrop-blur-sm shadow-sm rounded-full text-black hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="md:w-1/2 relative aspect-square md:aspect-auto md:h-auto min-h-[250px] bg-gray-200 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-300">
          <span className="text-gray-500 font-bold text-sm uppercase tracking-widest px-4 text-center">Espacio para la<br/>Fotografía del Producto</span>
        </div>

        <div className="md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">{product.category}</p>
          <div className="h-6 sm:h-8 w-3/4 bg-gray-100 rounded-md mb-2"></div>
          <div className="h-6 sm:h-8 w-1/2 bg-gray-100 rounded-md mb-6"></div>
          <div className="h-6 sm:h-8 w-1/4 bg-gray-200 rounded-md mb-8"></div>

          <div className="space-y-2 mb-8">
            <div className="h-3 w-full bg-gray-50 rounded-sm"></div>
            <div className="h-3 w-full bg-gray-50 rounded-sm"></div>
            <div className="h-3 w-2/3 bg-gray-50 rounded-sm"></div>
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
          <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center text-center text-gray-500">
               <Banknote className="w-5 h-5 mb-2 text-gray-400" />
               <span className="text-[8px] font-bold uppercase tracking-widest leading-tight">Anticipo 50%<br/>Resto Al Entrega</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center text-gray-500">
               <Truck className="w-5 h-5 mb-2 text-gray-400" />
               <span className="text-[9px] font-bold uppercase tracking-widest leading-tight">Entregas al<br/>Puerto</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center text-gray-500">
               <ShieldCheck className="w-5 h-5 mb-2 text-gray-400" />
               <span className="text-[9px] font-bold uppercase tracking-widest leading-tight">Calidad<br/>Garantizada</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
