"use client";

import { motion } from "framer-motion";
import { Package, Calendar, MapPin, CheckCircle2, QrCode, Download } from "lucide-react";
import { generateInvoicePDF } from "@/lib/invoiceGenerator";

interface LuxuryTicketProps {
  order: any;
  onClose: () => void;
}

export function LuxuryTicket({ order, onClose }: LuxuryTicketProps) {
  const pendingBalance = order.total - order.anticipo;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="relative w-full max-w-lg mx-auto"
    >
      {/* Golden Thread Animated Border */}
      <div className="absolute -inset-[2px] rounded-[2rem] overflow-hidden">
        <motion.div 
          animate={{ 
            rotate: [0, 360],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-full h-full bg-[conic-gradient(from_0deg,#d4af37,#f9f295,#d4af37,#b8860b,#d4af37)] opacity-60"
        />
      </div>

      <div className="relative bg-[#faf9f6] rounded-[2rem] p-8 md:p-12 shadow-2xl overflow-hidden border border-[#e5e4e2]">
        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/linen.png')]" />
        
        {/* Wax Seal BM */}
        <motion.div 
          initial={{ scale: 2, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: -5 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
          className="absolute top-10 right-10 z-20"
        >
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 bg-[#8b0000] rounded-full shadow-[inset_0_2px_10px_rgba(0,0,0,0.5),0_5px_15px_rgba(139,0,0,0.4)] border-2 border-[#a52a2a]" />
            <span className="relative z-10 text-white font-serif text-3xl font-black italic tracking-tighter opacity-80 select-none">BM</span>
            {/* Wax drips */}
            <div className="absolute -bottom-1 left-4 w-6 h-4 bg-[#8b0000] rounded-full blur-[1px]" />
            <div className="absolute -top-1 right-2 w-4 h-6 bg-[#8b0000] rounded-full blur-[1px]" />
          </div>
        </motion.div>

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-[10px] font-black uppercase tracking-[0.8em] text-[#b8860b] mb-4">Bahía Moda Exclusive</h2>
          <h1 className="text-4xl font-serif italic font-black text-slate-900 tracking-tighter">Recibo de Gala</h1>
          <div className="w-12 h-[1px] bg-[#d4af37] mx-auto mt-4" />
        </div>

        {/* Personalized Message */}
        <div className="mb-10 text-center relative">
          <p className="text-sm font-medium text-slate-500 italic">"Preparado exclusivamente para ti,"</p>
          <p className="text-2xl font-serif font-black text-slate-900 mt-1">{order.nombre_cliente}</p>
          
          {/* Status Badge in Ticket */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-[#d4af37] rounded-full border border-[#d4af37]/30 shadow-lg">
             <div className={`w-1.5 h-1.5 rounded-full bg-[#d4af37] ${['preparacion', 'en_transito'].includes(order.estado) ? 'animate-pulse' : ''}`} />
             <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                {order.estado === 'pendiente' ? 'Esperando Validación' : 
                 order.estado === 'recibido' ? 'Pedido Aceptado' :
                 order.estado === 'preparacion' ? 'Empaquetando con Cuidado' :
                 order.estado === 'en_transito' ? 'En Ruta Exclusiva' :
                 order.estado === 'listo_entrega' ? 'Entrega Completada' : 'Confirmado'}
             </span>
          </div>
        </div>

        {/* Order Details */}
        <div className="space-y-6 mb-12 py-8 border-y border-[#e5e4e2] border-dashed">
          {order.items.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                <span className="font-bold text-slate-700 uppercase tracking-widest text-[10px]">
                  {item.quantity}x {item.name} {item.size ? `(${item.size})` : ''}
                </span>
              </div>
              <span className="font-serif font-black text-slate-900 text-lg">Q{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        {/* Totals Section */}
        <div className="space-y-4 mb-12">
          <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span>Inversión Total</span>
            <span className="text-2xl text-slate-900 font-serif italic">Q{order.total}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-black text-emerald-600 uppercase tracking-widest">
            <span>Abonado (50% Reserva)</span>
            <span className="text-xl font-serif italic">- Q{order.anticipo}</span>
          </div>
          <div className="pt-4 border-t border-[#e5e4e2] flex justify-between items-center">
            <span className="text-[11px] font-black text-[#8b0000] uppercase tracking-widest animate-pulse">Saldo Pendiente</span>
            <span className="text-3xl font-serif font-black text-slate-900">Q{pendingBalance}</span>
          </div>
        </div>

        {/* Footer Info */}
        <div className="grid grid-cols-2 gap-6 pt-8 border-t border-[#e5e4e2]">
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-[#d4af37]" />
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Fecha</p>
              <p className="text-[10px] font-bold text-slate-900">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-[#d4af37]" />
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Destino</p>
              <p className="text-[10px] font-bold text-slate-900 truncate">{order.ubicacion_entrega || "Boutique"}</p>
            </div>
          </div>
        </div>

        {/* Luxury QR Mockup */}
        <div className="mt-12 flex flex-col items-center">
          <div className="p-4 bg-white border border-[#e5e4e2] rounded-2xl shadow-inner mb-4">
            <QrCode className="w-16 h-16 text-slate-300 opacity-50" />
          </div>
          <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.5em]">BM-AUTH-{order.id.slice(0,8).toUpperCase()}</p>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col gap-3">
          <button 
            onClick={async () => await generateInvoicePDF(order)}
            className="w-full py-5 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-emerald-700 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
          >
            <Download className="w-4 h-4" /> Descargar Recibo PDF
          </button>
          
          <button 
            onClick={onClose}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-zinc-800 transition-all shadow-xl active:scale-95"
          >
            Cerrar Ticket de Gala
          </button>
        </div>
      </div>
    </motion.div>
  );
}
