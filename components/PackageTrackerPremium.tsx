"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Truck, Package, MapPin, CheckCircle2, Clock, Home, Building2, Warehouse, ArrowRight, Sun, Cloud } from "lucide-react";
import { useStore } from "@/lib/store";

export function PackageTrackerPremium() {
  const { isTrackingOpen, setIsTrackingOpen, userOrders } = useStore();
  
  const activeOrder = userOrders.find(o => o.estado !== 'cancelado' && o.estado !== 'listo_entrega') || userOrders[0];

  if (!isTrackingOpen) return null;

  const steps = [
    { id: 'pendiente', label: 'ESPERA', progress: 5 },
    { id: 'recibido', label: 'CONFIRMADO', progress: 28 },
    { id: 'preparacion', label: 'EMPACANDO', progress: 52 },
    { id: 'en_transito', label: 'EN RUTA', progress: 78 },
    { id: 'listo_entrega', label: 'ENTREGADO', progress: 100 }
  ];

  let currentStepIndex = steps.findIndex(s => s.id === activeOrder?.estado);
  if (currentStepIndex === -1) currentStepIndex = 0;

  const progressPercent = steps[currentStepIndex]?.progress || 5;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          onClick={() => setIsTrackingOpen(false)}
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          className="relative w-full max-w-2xl bg-white rounded-[3.5rem] shadow-[0_50px_150px_rgba(0,0,0,0.7)] overflow-hidden border border-white/10"
        >
          {/* Header Ultra Premium */}
          <div className="p-10 pb-6 flex items-center justify-between bg-white relative z-20">
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                 <div className="px-3 py-1 bg-emerald-500 rounded-full">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">Live Tracking</span>
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Gala Fleet v14.0</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Mi Pedido en Camino</h2>
            </div>
            <button 
              onClick={() => setIsTrackingOpen(false)}
              className="p-4 bg-slate-50 hover:bg-slate-100 rounded-3xl text-slate-400 hover:text-black transition-all active:scale-90"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* 🗺️ EL MUNDO GALA HORIZON (Mejorado v14.0) */}
          <div className="relative h-[480px] w-full flex items-center justify-center overflow-hidden bg-[#f0f9ff]">
             {/* BACKGROUND SCENERY */}
             <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 600 500" className="w-full h-full opacity-20">
                   <path d="M 0 200 Q 150 100 300 200 T 600 200 L 600 500 L 0 500 Z" fill="#2dd4bf" />
                   <g transform="translate(500, 60)" className="text-amber-400">
                      <Sun className="w-14 h-14" />
                   </g>
                   <g transform="translate(100, 80)" className="text-white opacity-80">
                      <Cloud className="w-20 h-20" />
                   </g>
                </svg>
             </div>

             <div className="relative w-full h-full">
                <svg viewBox="0 0 600 500" className="w-full h-full overflow-visible drop-shadow-2xl">
                   
                   {/* 🌊 RIVER (Animated) */}
                   <motion.path 
                     d="M -100 420 Q 150 350 300 450 T 700 420"
                     fill="none" stroke="#7dd3fc" strokeWidth="80" strokeOpacity="0.4" strokeLinecap="round"
                     animate={{ strokeDashoffset: [0, -200] }}
                     transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                     strokeDasharray="20 40"
                   />

                   {/* 🛣️ THE FLOWING HIGHWAY (Suavizada 5 Puntos) */}
                   <path 
                     id="galaMainRoute"
                     d="M 50 320 Q 150 320, 200 250 T 350 300 T 500 250 T 600 300"
                     fill="none" stroke="#334155" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" 
                   />
                   <path 
                     d="M 50 320 Q 150 320, 200 250 T 350 300 T 500 250 T 600 300"
                     fill="none" stroke="#facc15" strokeWidth="1.5" strokeDasharray="10 15" strokeOpacity="0.6"
                   />

                   {/* 🏢 THE 5 MILESTONES (Reinstaurados y Espaciados) */}
                   {[
                     { id: 'pendiente', x: 50, y: 320, label: 'ESPERA', type: 'hub' },
                     { id: 'recibido', x: 200, y: 250, label: 'CONFIRMADO', type: 'hq' },
                     { id: 'preparacion', x: 350, y: 300, label: 'EMPACANDO', type: 'warehouse' },
                     { id: 'en_transito', x: 500, y: 250, label: 'EN RUTA', type: 'road' },
                     { id: 'listo_entrega', x: 580, y: 280, label: 'ENTREGADO', type: 'home' }
                   ].map((point, idx) => {
                     const isReached = idx <= currentStepIndex;
                     const isCurrent = idx === currentStepIndex;
                     
                     return (
                       <g key={point.id} transform={`translate(${point.x}, ${point.y})`}>
                          <motion.g
                            initial={{ y: -80, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.1, type: "spring" }}
                          >
                             <ellipse cx="0" cy="15" rx="35" ry="12" fill="black" opacity="0.05" />

                             {point.type === 'hub' && (
                               <g transform="translate(-25, -75)">
                                  <rect x="0" y="20" width="50" height="55" fill={isReached ? '#1e293b' : '#cbd5e1'} rx="4" />
                                  <path d="M0 20 L25 0 L50 20 Z" fill={isReached ? '#115e59' : '#94a3b8'} />
                                  <Clock className="w-6 h-6 text-white absolute" x="12" y="35" />
                               </g>
                             )}
                             {point.type === 'hq' && (
                               <g transform="translate(-20, -110)">
                                  <rect x="0" y="0" width="40" height="110" fill={isReached ? '#1e3a8a' : '#cbd5e1'} rx="4" />
                                  <rect x="5" y="5" width="30" height="100" fill="#bae6fd" opacity="0.4" />
                                  <Building2 className="w-6 h-6 text-white absolute" x="7" y="20" />
                               </g>
                             )}
                             {point.type === 'warehouse' && (
                               <g transform="translate(-35, -65)">
                                  <rect x="0" y="10" width="70" height="55" fill={isReached ? '#9a3412' : '#cbd5e1'} rx="4" />
                                  <rect x="15" y="25" width="40" height="40" fill="white" opacity="0.2" />
                                  <Warehouse className="w-7 h-7 text-white absolute" x="22" y="28" />
                               </g>
                             )}
                             {point.type === 'road' && (
                               <g transform="translate(-15, -45)">
                                  <circle r="18" fill={isReached ? '#4f46e5' : '#cbd5e1'} />
                                  <Truck className="w-6 h-6 text-white absolute" x="-9" y="-9" />
                               </g>
                             )}
                             {point.type === 'home' && (
                               <g transform="translate(-30, -75)">
                                  <path d="M 0 30 L 35 0 L 70 30 L 70 75 L 0 75 Z" fill={isCurrent ? '#166534' : '#cbd5e1'} />
                                  <rect x="25" y="50" width="20" height="25" fill="#facc15" />
                                  <Home className="w-8 h-8 text-white absolute" x="21" y="30" />
                               </g>
                             )}

                             <g transform="translate(0, 35)">
                                <rect x="-48" y="0" width="96" height="24" rx="12" fill={isCurrent ? '#0f172a' : 'white'} className="shadow-2xl" />
                                <text fontSize="9" fontWeight="900" textAnchor="middle" y="15" fill={isCurrent ? 'white' : '#94a3b8'} className="uppercase tracking-[0.3em]">
                                   {point.label}
                                </text>
                             </g>
                          </motion.g>
                       </g>
                     );
                   })}

                   {/* 🚛 EL GALA MASTER 14.0 (Con Ruedas Animadas!) */}
                   {activeOrder?.estado !== 'pendiente' && (
                     <motion.g 
                       initial={{ opacity: 0 }}
                       animate={{ 
                         opacity: 1,
                         offsetDistance: `${progressPercent}%` 
                       }}
                       style={{ 
                         offsetPath: "path('M 50 320 Q 150 320, 200 250 T 350 300 T 500 250 T 600 300')",
                         offsetRotate: "auto 0deg" 
                       }}
                       transition={{ duration: 3, ease: "easeInOut" }}
                     >
                        <g transform="translate(-60, -45) scale(0.9)">
                           {/* Trailer Body */}
                           <rect x="0" y="10" width="105" height="48" rx="4" fill="#1e293b" />
                           <rect x="5" y="15" width="95" height="38" fill="#334155" />
                           <text x="15" y="35" fontSize="11" fontWeight="900" fill="white" opacity="0.8" className="italic">GALA MASTER</text>
                           <text x="15" y="44" fontSize="5" fontWeight="900" fill="#facc15" opacity="0.6">BAHÍA MODA LOGISTICS</text>

                           {/* Cabina */}
                           <g transform="translate(107, 5)">
                              <path d="M 0 10 L 25 10 L 38 28 L 38 48 L 0 48 Z" fill="#1d4ed8" />
                              <rect x="5" y="15" width="22" height="18" fill="#e0f2fe" opacity="0.7" rx="2" />
                              <rect x="30" y="38" width="8" height="6" fill="#facc15" rx="1" /> {/* Headlight */}
                           </g>

                           {/* 🎡 ANIMATED WHEELS (Giro Físico) */}
                           <g fill="#111">
                              {[18, 32, 75, 89, 120, 135].map((cx, i) => (
                                <motion.g key={i} transform={`translate(${cx}, 58)`}>
                                   <motion.circle 
                                     r="9" 
                                     animate={{ rotate: 360 }}
                                     transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
                                     stroke="white" strokeWidth="2" strokeDasharray="4 4"
                                   />
                                   <circle r="4" fill="white" />
                                </motion.g>
                              ))}
                           </g>

                           {/* Smoke */}
                           <motion.g opacity="0.5">
                              {[0, 1, 2].map((i) => (
                                <motion.circle 
                                  key={i}
                                  cx="-8" cy="15" r="5" fill="#94a3b8"
                                  animate={{ opacity: [0, 1, 0], x: [-10, -100], y: [15, -30], scale: [1, 6] }}
                                  transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.5 }}
                                />
                              ))}
                           </motion.g>
                        </g>
                     </motion.g>
                   )}
                </svg>
             </div>
          </div>

          {/* Tarjeta de Información */}
          <div className="p-10 pt-8 space-y-8 bg-white relative z-20">
             <div className="flex flex-col sm:flex-row gap-8 items-center justify-between p-8 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-inner group">
                <div className="flex items-center gap-6">
                   <div className="p-6 bg-white rounded-3xl shadow-lg text-indigo-600 ring-8 ring-slate-50 group-hover:scale-110 transition-transform">
                      <Truck className="w-8 h-8" />
                   </div>
                   <div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Unidad de Élite</p>
                      <p className="text-md font-black text-slate-900 uppercase italic leading-none">Gala Master Truck #001</p>
                      <p className="text-[9px] font-bold text-indigo-500 mt-2 uppercase tracking-widest">Master Driver Asignado</p>
                   </div>
                </div>
                <div className="flex flex-col items-center sm:items-end">
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Punto de Entrega</p>
                   <p className="text-sm font-black text-slate-700 truncate max-w-[300px] border-b-2 border-indigo-200">{activeOrder?.ubicacion_entrega || "Actualizando..."}</p>
                </div>
             </div>

             <div className="flex justify-between items-center py-6 border-t border-slate-100">
                <div className="flex flex-col">
                   <p className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-2">Inversión Total</p>
                   <p className="text-4xl font-black text-slate-900 tracking-tighter italic">Q{activeOrder?.total || 0}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                   <p className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-2">Estado en Tiempo Real</p>
                   <div className="flex items-center gap-4 bg-emerald-50 px-6 py-3 rounded-full border border-emerald-100">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981]" />
                      <p className="text-2xl font-black text-emerald-900 uppercase italic tracking-tighter">
                         {steps[currentStepIndex]?.label}
                      </p>
                   </div>
                </div>
             </div>

             <button 
                onClick={() => setIsTrackingOpen(false)}
                className="group w-full py-7 bg-zinc-950 text-white rounded-[2.5rem] text-[13px] font-black uppercase tracking-[0.4em] shadow-2xl hover:shadow-indigo-500/40 transition-all active:scale-95 flex items-center justify-center gap-5 relative overflow-hidden"
             >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                Regresar a la Boutique <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" />
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
