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
                                 {/* SMART STATUS INDICATORS (Top Aligned - No Overlap) */}
                 <div className="absolute top-12 left-16 right-16 flex justify-between">
                    {steps.map((step, idx) => {
                      const isCurrent = idx === currentStepIndex;
                      const isCompleted = idx <= currentStepIndex;
                      return (
                        <div key={idx} className="flex flex-col items-center">
                           <div className={`w-3 h-3 rounded-full border-2 transition-all duration-700 ${
                             isCompleted ? 'bg-emerald-500 border-white shadow-[0_0_10px_#10b981]' : 'bg-slate-200 border-transparent'
                           }`} />
                           <motion.span 
                             initial={false}
                             animate={{ 
                               opacity: isCurrent ? 1 : 0.3, 
                               scale: isCurrent ? 1.1 : 0.9,
                               y: isCurrent ? 5 : 0 
                             }}
                             className={`mt-2 text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap ${isCurrent ? 'text-emerald-600' : 'text-slate-400'}`}
                           >
                              {step.label}
                           </motion.span>
                        </div>
                      );
                    })}
                 </div>
                
                 {/* AGENCY DIORAMA 7.0 (Baseline Alignment) */}
                 <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden pointer-events-none">
                     
                     {/* FAR MOUNTAINS (Stationary Illustration) */}
                     <div className="absolute bottom-32 w-full flex justify-around opacity-10">
                        <svg width="600" height="200" viewBox="0 0 600 200" fill="none">
                           <path d="M0 200 L150 50 L300 200 Z" fill="#94a3b8" />
                           <path d="M250 200 L400 80 L550 200 Z" fill="#64748b" />
                        </svg>
                     </div>

                     {/* THE HORIZON LINE (Baseline) */}
                     <div className="absolute bottom-32 w-full h-[2px] bg-slate-100/50" />

                     {/* NEAR FOREST (Fixed to Baseline) */}
                     <div className="absolute bottom-32 w-full px-12 flex justify-between opacity-30">
                        {[...Array(4)].map((_, i) => (
                           <svg key={i} width="60" height="100" viewBox="0 0 40 80" fill="none" className="translate-y-4">
                              <path d="M20 0 L40 60 L0 60 Z" fill="#064e3b" />
                              <rect x="18" y="60" width="4" height="20" fill="#451a03" />
                           </svg>
                        ))}
                     </div>

                     {/* THE PROFESSIONAL ROAD (Pixel Perfect) */}
                     <div className="absolute bottom-0 w-full h-32 bg-slate-50 border-t-2 border-slate-100 flex items-center justify-center overflow-hidden">
                        <div className="absolute top-0 w-full h-1 bg-white opacity-50" />
                        <motion.div 
                          animate={{ x: [0, -120] }}
                          transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
                          className="flex gap-20 px-10"
                        >
                          {[...Array(15)].map((_, i) => (
                            <div key={i} className="w-16 h-2 bg-slate-200 rounded-full shrink-0" />
                          ))}
                        </motion.div>
                     </div>
                 </div>

                {/* THE PROFESSIONAL TRUCK (Reference-Based Alignment) */}
                <motion.div 
                  className="absolute bottom-24"
                  animate={{ 
                    left: `${progressPercent}%`,
                    x: "-50%" 
                  }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                >
                  <div className="relative">
                    {/* Shadow Ground-Touch */}
                    <div className="absolute -bottom-1 left-2 w-[90%] h-2 bg-black/5 blur-sm rounded-full" />

                    {/* Truck Agency Illustration 7.0 */}
                    <motion.svg 
                      width="160" height="100" viewBox="0 0 160 100" 
                      className="overflow-visible"
                      animate={{ y: [0, -2, 0] }}
                      transition={{ repeat: Infinity, duration: 0.4 }}
                    >
                       {/* THE CABIN (BLUE) */}
                       <path d="M100 80 L140 80 C146 80 150 76 150 70 L150 45 C150 35 140 30 125 30 L100 30 Z" fill="#2563eb" />
                       
                       {/* Windshield + Driver Placeholder */}
                       <path d="M105 35 L125 35 Q135 35 138 45 L130 75 L105 75 Z" fill="#93c5fd" opacity="0.4" />
                       {/* Driver Silhuette (Ref: Red Cap) */}
                       <circle cx="115" cy="50" r="5" fill="#ef4444" />
                       <rect x="110" y="55" width="10" height="12" rx="2" fill="#ef4444" />
                       
                       {/* THE CARGO (GREY) */}
                       <rect x="10" y="15" width="95" height="65" rx="8" fill="#e2e8f0" />
                       {/* Cargo texture lines */}
                       <path d="M15 25 L100 25 M15 35 L100 35 M15 45 L100 45 M15 55 L100 55 M15 65 L100 65" stroke="#cbd5e1" strokeWidth="1" />
                       
                       {/* LOCATION PIN + BM LOGO (From Ref) */}
                       <g transform="translate(50, 45)">
                          <circle r="18" fill="white" opacity="0.3" />
                          <path d="M0 -12 C-6 -12 -12 -6 -12 0 C-12 12 0 24 0 24 C0 24 12 12 12 0 C12 -6 6 -12 0 -12 Z" fill="#94a3b8" opacity="0.5" />
                          <text y="5" className="text-[12px] font-black italic fill-slate-400" textAnchor="middle">BM</text>
                       </g>

                       {/* WHEELS (Professional) */}
                       <g>
                          {/* Back */}
                          <circle cx="35" cy="82" r="14" fill="#1e293b" />
                          <circle cx="35" cy="82" r="8" fill="#cbd5e1" />
                          <circle cx="35" cy="82" r="3" fill="#1e293b" />
                          {/* Front */}
                          <circle cx="125" cy="82" r="14" fill="#1e293b" />
                          <circle cx="125" cy="82" r="8" fill="#cbd5e1" />
                          <circle cx="125" cy="82" r="3" fill="#1e293b" />
                       </g>
                    </motion.svg>
                  </div>
                </motion.div>

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
