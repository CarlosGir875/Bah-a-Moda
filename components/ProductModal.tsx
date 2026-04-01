"use client";

import { useState } from "react";
import { X, Check, Truck, ShieldCheck, Banknote, ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/lib/mockData";
import { useStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart } = useStore();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [sizeError, setSizeError] = useState<boolean>(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleClose = () => {
    setSelectedSize("");
    setSizeError(false);
    onClose();
  };

  if (!product) return null;

  const nextImage = () => {
    if (product.images && product.images.length > 0) {
      setActiveImageIndex((prev) => (prev + 1) % product.images!.length);
    }
  };

  const prevImage = () => {
    if (product.images && product.images.length > 0) {
      setActiveImageIndex((prev) => (prev - 1 + product.images!.length) % product.images!.length);
    }
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-md transition-all duration-500">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0"
        onClick={handleClose}
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white w-full max-w-6xl flex flex-col md:flex-row shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden rounded-[2.5rem] relative z-10 max-h-[95vh] md:h-[800px]"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-50 p-3 bg-white/90 backdrop-blur shadow-2xl rounded-full text-black hover:bg-black hover:text-white transition-all duration-500 hover:rotate-90 active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Section (Left) */}
        <div className="md:w-[60%] relative h-[450px] md:h-auto bg-[#fdfdfd] flex flex-col items-center justify-center p-4 md:p-10 group/modal overflow-hidden">
          
          {/* Main Image Container */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
             <AnimatePresence mode="wait">
               <motion.div
                 key={activeImageIndex}
                 initial={{ opacity: 0, x: 20, scale: 0.95 }}
                 animate={{ opacity: 1, x: 0, scale: 1 }}
                 exit={{ opacity: 0, x: -20, scale: 0.95 }}
                 transition={{ duration: 0.4, ease: "easeOut" }}
                 className="w-full h-full flex items-center justify-center overflow-hidden cursor-zoom-in relative"
                 onMouseMove={(e) => {
                   if (!isZoomed) return;
                   const target = e.currentTarget;
                   const rect = target.getBoundingClientRect();
                   const x = ((e.clientX - rect.left) / rect.width) * 100;
                   const y = ((e.clientY - rect.top) / rect.height) * 100;
                   target.style.perspectiveOrigin = `${x}% ${y}%`;
                   // We use the direct child img for transform origin
                   const img = target.querySelector('img');
                   if (img) img.style.transformOrigin = `${x}% ${y}%`;
                 }}
                 onMouseEnter={() => setIsZoomed(true)}
                 onMouseLeave={(e) => {
                   setIsZoomed(false);
                   const target = e.currentTarget;
                   const img = target.querySelector('img');
                   if (img) img.style.transformOrigin = 'center center';
                 }}
               >
                 {currentImage ? (
                   <>
                     <motion.img 
                       src={currentImage} 
                       alt="" 
                       className="absolute inset-0 w-full h-full object-cover blur-[50px] opacity-30 scale-150 saturate-150 brightness-110 select-none pointer-events-none"
                     />
                     <motion.img 
                       src={currentImage} 
                       alt={product.name} 
                       animate={{ scale: isZoomed ? 2.5 : 1 }}
                       transition={{ duration: 0.3, ease: "easeOut" }}
                       className="relative w-full h-full object-contain p-4 md:p-8 rounded-3xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-10"
                     />
                   </>
                 ) : (
                   <div className="flex flex-col items-center gap-4">
                     <span className="text-gray-200 font-black text-6xl opacity-10 select-none">BAHÍA</span>
                     <span className="text-gray-400 font-bold text-xs uppercase tracking-[0.5em]">{product.category}</span>
                   </div>
                 )}
               </motion.div>
             </AnimatePresence>

            {/* Navigation Arrows (Desktop Only) */}
            {product.images && product.images.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/80 backdrop-blur rounded-full shadow-xl text-black opacity-0 group-hover/modal:opacity-100 hover:bg-black hover:text-white transition-all duration-300 -translate-x-4 group-hover/modal:translate-x-0 hidden md:flex"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/80 backdrop-blur rounded-full shadow-xl text-black opacity-0 group-hover/modal:opacity-100 hover:bg-black hover:text-white transition-all duration-300 translate-x-4 group-hover/modal:translate-x-0 hidden md:flex"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Badge Premium */}
            <div className="absolute top-0 left-0">
               <motion.span 
                 initial={{ x: -20, opacity: 0 }}
                 animate={{ x: 0, opacity: 1 }}
                 className="bg-black text-[#FFD700] text-[9px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-br-2xl shadow-lg border-r border-b border-[#FFD700]/30"
               >
                 ✨ Selección Premium
               </motion.span>
            </div>
          </div>

          {/* Thumbnails Row (Enhanced) */}
          {product.images && product.images.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 px-6 py-4 bg-white/20 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] overflow-x-auto max-w-[90%] hide-scrollbar no-select">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-14 h-14 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${
                    activeImageIndex === idx 
                      ? 'border-black ring-4 ring-black/10 scale-105 shadow-xl' 
                      : 'border-transparent opacity-50 grayscale hover:grayscale-0 hover:opacity-100 scale-95 hover:scale-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  {activeImageIndex === idx && (
                    <motion.div 
                      layoutId="activeThumb"
                      className="absolute inset-0 bg-black/5"
                    />
                  )}
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
      </motion.div>
    </div>
  );
}
