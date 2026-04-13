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

  let currentStepIndex = steps.findIndex(s => s.id === activeOrder?.estado);
  if (currentStepIndex === -1 && activeOrder?.estado === 'preparacion') currentStepIndex = 1; // Preparación also shows as Confirmado
  if (currentStepIndex === -1) currentStepIndex = 0;

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
                                 {/* SMART STATUS INDICATORS (Control Center Logic - Only Active is Green) */}
                 <div className="absolute top-8 left-12 right-12 flex justify-between z-20">
                    {steps.map((step, idx) => {
                      const isCurrent = idx === currentStepIndex;
                      // En esta versión 9.0, solo el paso actual tiene la luz verde brillante
                      return (
                        <div key={idx} className="flex flex-col items-center">
                           <div className={`w-3 h-3 rounded-full border-2 transition-all duration-700 ${
                             isCurrent 
                               ? 'bg-emerald-500 border-white shadow-[0_0_15px_#10b981] scale-125' 
                               : 'bg-slate-300 border-transparent opacity-40'
                           }`} />
                           <motion.span 
                             animate={{ 
                               opacity: isCurrent ? 1 : 0.3, 
                               scale: isCurrent ? 1.2 : 0.9,
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

                       {/* THE PIXEL PERFECT TRUCK 9.0 (Agency Illustration) */}
                       <motion.g 
                          animate={{ x: (progressPercent * 2.5) }} /* Max width 250 in 400 viewBox */
                          initial={{ x: 0 }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                       >
                          <g transform="translate(-40, 75)">
                             {/* THE CARGO CONTAINER (Grey with Texture) */}
                             <rect x="5" y="10" width="105" height="70" rx="4" fill="#E8E8E8" />
                             {/* Vertical Texture Lines from Ref */}
                             <g opacity="0.1">
                                {[...Array(20)].map((_, i) => (
                                   <line key={i} x1={10 + i*5} y1="15" x2={10 + i*5} y2="75" stroke="black" strokeWidth="0.5" />
                                ))}
                             </g>
                             
                             {/* BIG LOCATION PIN (Grounded inside container) */}
                             <g opacity="0.3" transform="translate(57, 45) scale(0.8)">
                                <path d="M0 -30 C-15 -30 -30 -15 -30 0 C-30 25 0 50 0 50 C0 50 30 25 30 0 C30 -15 15 -30 0 -30 Z" fill="#9CA3AF" />
                                <circle r="10" fill="white" />
                             </g>
                             
                             {/* REAR LIGHTS (Red/Yellow from Image) */}
                             <rect x="5" y="15" width="4" height="15" fill="#EF4444" rx="1" />
                             <rect x="5" y="32" width="4" height="10" fill="#FBBF24" rx="1" />
                             
                             {/* THE CABIN (BLUE - PROFESSIONAL CURVES) */}
                             <path d="M110 80 L160 80 L160 70 L160 30 C160 30 115 30 110 30 Z" fill="#1D60B6" />
                             
                             {/* Windshield */}
                             <path d="M115 35 L145 35 L145 55 L115 55 Z" fill="#93C5FD" opacity="0.5" />
                             
                             {/* THE DRIVER (Red Cap & Shirt - Exact Ref) */}
                             <g transform="translate(132, 48)">
                                {/* Arm on wheel */}
                                <path d="M-5 10 Q5 10 12 5" stroke="#FDE047" strokeWidth="3" fill="none" />
                                {/* Head & Cap */}
                                <circle r="6" fill="#FDE047" />
                                <path d="M-6 -4 Q0 -10 8 -4 L8 2 L-6 2 Z" fill="#EF4444" /> {/* Red Cap */}
                                <rect x="5" y="-3" width="6" height="3" fill="#EF4444" rx="1" /> {/* Cap Visor */}
                                {/* Body */}
                                <rect x="-6" y="5" width="12" height="15" rx="3" fill="#EF4444" />
                             </g>
                             
                             {/* FRONT HEADLIGHT (White) */}
                             <rect x="155" y="55" width="5" height="12" fill="white" rx="1" />

                             {/* THE BLACK BUMPER */}
                             <rect x="3" y="75" width="158" height="6" fill="#1A1A1A" rx="2" />

                             {/* WHEELS (Touching the Road exactly at 160) */}
                             <g>
                                {/* Back Wheel */}
                                <circle cx="35" cy="85" r="18" fill="#1A1A1A" />
                                <circle cx="35" cy="85" r="10" fill="#D1D5DB" />
                                <circle cx="35" cy="85" r="4" fill="#1A1A1A" />
                                {/* Front Wheel */}
                                <circle cx="125" cy="85" r="18" fill="#1A1A1A" />
                                <circle cx="125" cy="85" r="10" fill="#D1D5DB" />
                                <circle cx="125" cy="85" r="4" fill="#1A1A1A" />
                             </g>

                             {/* ANIMATED SMOKE (Exhaust) */}
                             <motion.g opacity="0.3">
                                {[0, 1, 2].map((i) => (
                                  <motion.circle 
                                    key={i}
                                    cx="-5" cy="78" r="4" fill="#94a3b8"
                                    animate={{ 
                                      opacity: [0, 1, 0], 
                                      x: [-5, -60], 
                                      y: [78, 60],
                                      scale: [1, 2.5] 
                                    }}
                                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.3 }}
                                  />
                                ))}
                             </motion.g>
                          </g>
                       </motion.g>
                    </svg>
                 </div>
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
