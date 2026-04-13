"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Truck, Package, MapPin, CheckCircle2, Clock } from "lucide-react";
import { useStore } from "@/lib/store";

export function PackageTrackerPremium() {
  const { isTrackingOpen, setIsTrackingOpen, userOrders } = useStore();
  
  // Encontrar el pedido más reciente activo para mostrar el tracking
  const activeOrder = userOrders.find(o => o.estado !== 'cancelado' && o.estado !== 'listo_entrega') || userOrders[0];

  if (!isTrackingOpen) return null;

  const steps = [
    { id: 'pendiente', label: 'Bodega', progress: 10 },
    { id: 'recibido', label: 'Confirmado', progress: 35 },
    { id: 'en_transito', label: 'En Ruta', progress: 70 },
    { id: 'listo_entrega', label: 'Entregado', progress: 100 }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === activeOrder?.estado) || 0;
  const progressPercent = steps[currentStepIndex]?.progress || 10;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={() => setIsTrackingOpen(false)}
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 pb-0 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Live Tracking</span>
              <h2 className="text-xl font-black text-slate-900">Seguimiento de Paquete</h2>
            </div>
            <button 
              onClick={() => setIsTrackingOpen(false)}
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-black transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* THE ISLAND EXPERIENCE */}
          <div className="relative h-80 flex items-center justify-center overflow-hidden">
             {/* Background Atmosphere */}
             <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-white" />
             
             {/* The Road / Path */}
             <div className="relative w-full px-24">
                <div className="h-1.5 w-full bg-slate-100 rounded-full relative overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${progressPercent}%` }}
                     transition={{ duration: 1.5, ease: "easeOut" }}
                     className="absolute h-full bg-gradient-to-r from-emerald-400 to-indigo-600 rounded-full"
                   />
                </div>
                                 {/* SMART STATUS INDICATORS (Top Aligned - Clean UI) */}
                 <div className="absolute top-8 left-12 right-12 flex justify-between z-20">
                    {steps.map((step, idx) => {
                      const isCurrent = idx === currentStepIndex;
                      const isCompleted = idx <= currentStepIndex;
                      return (
                        <div key={idx} className="flex flex-col items-center">
                           <div className={`w-3 h-3 rounded-full border-2 transition-all duration-700 ${
                             isCompleted ? 'bg-emerald-500 border-white shadow-[0_0_15px_#10b981]' : 'bg-slate-200 border-transparent'
                           }`} />
                           <motion.span 
                             animate={{ 
                               opacity: isCurrent ? 1 : 0.4, 
                               scale: isCurrent ? 1.1 : 0.9,
                               y: isCurrent ? 5 : 0 
                             }}
                             className={`mt-2 text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap ${isCurrent ? 'text-emerald-600' : 'text-slate-400'}`}
                           >
                              {step.label}
                           </motion.span>
                        </div>
                      );
                    })}
                 </div>

                 {/* THE UNIFIED STAGE 8.0 (One SVG, One Coordinate System) */}
                 <div className="absolute inset-0 flex items-center justify-center p-4">
                    <svg viewBox="0 0 400 240" className="w-full h-full drop-shadow-2xl overflow-visible">
                       {/* Background Ground */}
                       <rect width="400" height="240" fill="#f8fafc" rx="20" />
                       
                       {/* DISTANT MOUNTAINS */}
                       <g opacity="0.1">
                          <path d="M0 160 L100 60 L200 160 Z" fill="#64748b" />
                          <path d="M150 160 L280 80 L400 160 Z" fill="#94a3b8" />
                       </g>

                       {/* THE ROAD (BLACK) - ABSOLUTE BASELINE */}
                       <rect y="160" width="400" height="50" fill="#1e293b" />
                       <line x1="0" y1="160" x2="400" y2="160" stroke="#0f172a" strokeWidth="2" />
                       
                       {/* High-Speed Yellow Lanes */}
                       <motion.g 
                          animate={{ x: [0, -60] }}
                          transition={{ repeat: Infinity, duration: 0.4, ease: "linear" }}
                       >
                          {[...Array(12)].map((_, i) => (
                             <rect key={i} x={i * 60} y="180" width="30" height="3" rx="1.5" fill="#facc15" />
                          ))}
                       </motion.g>

                       {/* THE FOREST (Rooted on the road surface) */}
                       <g opacity="0.2">
                          {[20, 120, 250, 340].map((x, i) => (
                             <g key={i} transform={`translate(${x}, 90)`}>
                                <path d="M20 0 L40 70 L0 70 Z" fill="#064e3b" />
                                <rect x="18" y="70" width="4" height="10" fill="#451a03" />
                             </g>
                          ))}
                       </g>

                       {/* THE MASTERPIECE TRUCK (Agency Style - Perfectly Positioned) */}
                       <motion.g 
                          animate={{ x: `${progressPercent}%` }}
                          initial={{ x: "0%" }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                       >
                          <g transform="translate(-80, 75)">
                             {/* THE TRUCK BODY (Ref Based) */}
                             {/* Cargo (Grey) */}
                             <rect x="5" y="10" width="100" height="70" rx="8" fill="#e2e8f0" />
                             <path d="M10 25 L105 25 M10 40 L105 40 M10 55 L105 55" stroke="#cbd5e1" strokeWidth="1" />
                             
                             {/* BM LOGO + PIN */}
                             <circle cx="55" cy="45" r="20" fill="white" opacity="0.4" />
                             <path d="M55 33 C49 33 44 38 44 44 C44 54 55 64 55 64 C55 64 66 54 66 44 C66 38 61 33 55 33 Z" fill="#94a3b8" />
                             <text x="55" y="49" className="text-[12px] font-black italic fill-white" textAnchor="middle">BM</text>

                             {/* THE CABIN (BLUE) */}
                             <path d="M105 80 L145 80 C152 80 155 76 155 70 L155 45 C155 35 145 30 130 30 L105 30 Z" fill="#2563eb" />
                             {/* Windshield */}
                             <path d="M110 35 L130 35 Q140 35 142 45 L135 75 L110 75 Z" fill="#93c5fd" opacity="0.6" />
                             
                             {/* DRIVER (Red Cap/Shirt) */}
                             <g transform="translate(120, 50)">
                                <circle r="5" fill="#ef4444" />
                                <rect x="-5" y="5" width="10" height="12" rx="2" fill="#ef4444" />
                             </g>

                             {/* WHEELS (Touching the Road at 160) */}
                             {/* Road starts at y=160. Truck at y=75. Wheels are at y=85 within truck group. Total y = 160. PERFECT. */}
                             <g>
                                {/* Back Wheel */}
                                <circle cx="35" cy="85" r="15" fill="#1e293b" />
                                <circle cx="35" cy="85" r="9" fill="#94a3b8" />
                                <circle cx="35" cy="85" r="3" fill="#0f172a" />
                                {/* Front Wheel */}
                                <circle cx="125" cy="85" r="15" fill="#1e293b" />
                                <circle cx="125" cy="85" r="9" fill="#94a3b8" />
                                <circle cx="125" cy="85" r="3" fill="#0f172a" />
                             </g>

                             {/* CONTACT SHREDS (Speed smoke) */}
                             <motion.g opacity="0.4">
                                {[0, 1, 2].map((i) => (
                                  <motion.circle 
                                    key={i}
                                    cx="-10" cy="80" r="3" fill="#94a3b8"
                                    animate={{ opacity: [0, 1, 0], x: [-10, -40], y: [80, 70] }}
                                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
                                  />
                                ))}
                             </motion.g>
                          </g>
                       </motion.g>
                    </svg>
                 </div>

                    {/* Headlight Glow */}
                    <motion.div 
                       className="absolute right-[-40px] top-[45px] w-20 h-10 bg-yellow-400/20 blur-xl rounded-full"
                       animate={{ opacity: [0.2, 0.4, 0.2] }}
                       transition={{ repeat: Infinity, duration: 1 }}
                    />

                    {/* High-Fidelity Smoke Particles */}
                    <div className="absolute left-0 bottom-4">
                       {[0, 1, 2, 3].map((i) => (
                         <motion.div
                           key={i}
                           initial={{ opacity: 0, scale: 0 }}
                           animate={{ 
                             opacity: [0, 0.8, 0],
                             scale: [0.5, 2, 3],
                             x: [-15, -50],
                             y: [0, -25]
                           }}
                           transition={{ 
                             repeat: Infinity, 
                             duration: 1.2, 
                             delay: i * 0.3 
                           }}
                           className="absolute w-4 h-4 bg-slate-400/40 rounded-full blur-sm"
                         />
                       ))}
                    </div>
                  </div>
                </motion.div>
             </div>
          </div>

          {/* Details Card */}
          <div className="p-8 pt-0 space-y-6">
             <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                <div className="flex flex-col">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Repartidor Estimado</p>
                   <p className="text-sm font-bold text-slate-900">Bahía Logistics S.A.</p>
                </div>
                <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600">
                   <Truck className="w-5 h-5" />
                </div>
             </div>

             <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-center text-slate-300">Resumen de Entrega</h4>
                <div className="flex justify-between items-end">
                   <div className="text-left">
                      <p className="text-[9px] font-black text-indigo-500 uppercase mb-1">Factura</p>
                      <p className="text-lg font-black text-slate-900">Q{activeOrder?.total || 0}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-black text-emerald-500 uppercase mb-1">Estado</p>
                      <p className="text-sm font-black text-slate-900 uppercase italic underline underline-offset-4 decoration-emerald-400">
                         {activeOrder?.estado === 'en_transito' ? 'En Camino' : 'Preparando'}
                      </p>
                   </div>
                </div>
             </div>

             <button 
                onClick={() => setIsTrackingOpen(false)}
                className="w-full py-5 bg-black text-white rounded-[1.8rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-indigo-200 transition-all active:scale-95"
             >
                Cerrar Ventana
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
