"use client";

import { useState } from "react";
import { X, Check, Truck, Globe2, Banknote, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

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

  // ── Urgency / Deadline Logic ──────────────────────────────────────────
  let urgencyBadge: React.ReactNode = null;
  if (product.delivery_date) {
    const deadline = new Date(product.delivery_date);
    const now = new Date();
    // Normalize both to midnight local to get clean day diff
    deadline.setHours(23, 59, 59, 0);
    const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    const months = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
    const formatted = `${deadline.getDate()} de ${months[deadline.getMonth()]}`;

    if (daysLeft > 5) {
      urgencyBadge = (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 border border-indigo-100">
          <span className="text-indigo-400 text-base">🕐</span>
          <span className="text-[11px] font-black uppercase tracking-wider text-indigo-700">
            Colección disponible hasta el <span className="text-indigo-900">{formatted}</span>
          </span>
        </div>
      );
    } else if (daysLeft >= 3) {
      urgencyBadge = (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-50 border border-orange-200">
          <span className="text-base">⚡</span>
          <span className="text-[11px] font-black uppercase tracking-wider text-orange-700">
            Cierra pronto — {formatted}
          </span>
        </div>
      );
    } else if (daysLeft >= 1) {
      urgencyBadge = (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 animate-pulse">
          <span className="text-base">🔴</span>
          <span className="text-[11px] font-black uppercase tracking-wider text-red-700">
            {daysLeft === 1 ? "Último día para pedidos" : `Solo ${daysLeft} días — termina el ${formatted}`}
          </span>
        </div>
      );
    }
    // If daysLeft <= 0, don't show anything (collection closed)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-md">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white w-full max-w-2xl flex flex-col shadow-[0_40px_120px_-20px_rgba(0,0,0,0.6)] overflow-hidden rounded-[2.5rem] relative z-10 max-h-[95vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 p-2.5 bg-white/90 backdrop-blur shadow-xl rounded-full text-black hover:bg-black hover:text-white transition-all duration-300 hover:rotate-90 active:scale-90"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ═══ IMAGE GALLERY ═══ */}
        <div className="relative w-full bg-gray-50 group/modal">

          {/* Badge Premium */}
          <motion.span
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="absolute top-0 left-0 z-20 bg-black text-[#FFD700] text-[8px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-br-2xl shadow-lg border-r border-b border-[#FFD700]/30"
          >
            ✨ Selección Premium
          </motion.span>

          {/* Image Switcher */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImageIndex}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full cursor-zoom-in overflow-hidden"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setMousePos({
                  x: ((e.clientX - rect.left) / rect.width) * 100,
                  y: ((e.clientY - rect.top) / rect.height) * 100,
                });
              }}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
            >
              {currentImage ? (
                <motion.img
                  src={currentImage}
                  alt={product.name}
                  style={{ transformOrigin: `${mousePos.x}% ${mousePos.y}%` }}
                  animate={{ scale: isZoomed ? 2 : 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="w-full h-auto object-contain block mix-blend-multiply"
                />
              ) : (
                <div className="aspect-video flex items-center justify-center">
                  <span className="text-gray-300 font-black text-sm uppercase tracking-widest">Bahía Moda</span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          {product.images && product.images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/90 backdrop-blur rounded-full shadow-xl text-black opacity-0 group-hover/modal:opacity-100 hover:bg-black hover:text-white transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/90 backdrop-blur rounded-full shadow-xl text-black opacity-0 group-hover/modal:opacity-100 hover:bg-black hover:text-white transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Dot Indicators */}
          {product.images && product.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {product.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`rounded-full transition-all duration-300 ${
                    activeImageIndex === idx ? "w-6 h-2 bg-black" : "w-2 h-2 bg-black/30 hover:bg-black/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-2 px-6 pt-4 overflow-x-auto hide-scrollbar">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 bg-white ${
                  activeImageIndex === idx ? "border-black scale-105 shadow-md" : "border-transparent opacity-50 hover:opacity-80"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover mix-blend-multiply" />
              </button>
            ))}
          </div>
        )}

        {/* ═══ PRODUCT INFO ═══ */}
        <div className="px-6 pt-6 pb-8 flex flex-col gap-4">

          {/* Category */}
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] bg-indigo-50 px-3 py-1 rounded-lg w-fit">
            {product.category}
          </span>

          {/* Name & Price */}
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight leading-tight flex-1">
              {product.name || "Producto Bahía Moda"}
            </h2>
            <div className="flex items-baseline gap-1 flex-shrink-0">
              <span className="text-xl font-black text-black">Q</span>
              <span className="text-3xl font-black text-black tracking-tighter">
                {product.price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* ── URGENCY BADGE ── */}
          {urgencyBadge}

          {/* Description */}
          <p className="text-gray-500 text-sm font-medium leading-relaxed">
            {product.description || "Este producto de alta calidad está disponible exclusivamente para nuestros clientes en el Puerto San José. Perfecto para complementar tu estilo con la elegancia de Bahía Moda."}
          </p>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900">Seleccionar Talla</h4>
                {sizeError && (
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest animate-pulse">¡Elige una talla!</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    className={`h-10 min-w-[3rem] px-4 rounded-xl text-xs font-bold transition-all border ${
                      selectedSize === size
                        ? "bg-black text-white border-black shadow-md scale-105"
                        : sizeError
                          ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-900"
                    }`}
                  >
                    {size}
                    {selectedSize === size && <Check className="w-3.5 h-3.5 ml-1 inline" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={handleAdd}
            className="w-full bg-black text-white h-14 rounded-full shadow-xl font-black tracking-widest uppercase text-sm hover:bg-gray-900 active:scale-95 transition-all mt-2"
          >
            Añadir al Carrito
          </button>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center">
                <Banknote className="w-4 h-4 text-black" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-black leading-tight">
                Reserva 50%<br /><span className="text-gray-400 font-bold">Seguridad</span>
              </span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center">
                <Truck className="w-4 h-4 text-black" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-black leading-tight">
                Solo Puerto<br /><span className="text-gray-400 font-bold">Escuintla</span>
              </span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center">
                <Globe2 className="w-4 h-4 text-black" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-black leading-tight">
                Importación<br /><span className="text-gray-400 font-bold">Directa</span>
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
