"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Truck, Package, MapPin, CheckCircle2, Clock, Home, Building2, Warehouse, ArrowRight, Sun, Cloud, FileSearch, ShieldCheck } from "lucide-react";
import { useStore } from "@/lib/store";

export function PackageTrackerPremium() {
  const { isTrackingOpen, setIsTrackingOpen, userOrders } = useStore();
  
  const activeOrder = userOrders.find(o => o.estado !== 'cancelado' && o.estado !== 'listo_entrega') || userOrders[0];

  if (!isTrackingOpen) return null;

  const steps = [
    { id: 'pendiente', label: 'ESPERA', progress: 5, building: 'hub' },
    { id: 'recibido', label: 'CONFIRMADO', progress: 28, building: 'hq' },
    { id: 'preparacion', label: 'EMPACANDO', progress: 52, building: 'warehouse' },
    { id: 'en_transito', label: 'EN RUTA', progress: 78, building: 'road' },
    { id: 'listo_entrega', label: 'ENTREGADO', progress: 100, building: 'home' }
  ];

  let currentStepIndex = steps.findIndex(s => s.id === activeOrder?.estado);
  if (currentStepIndex === -1) currentStepIndex = 0;

  const progressPercent = steps[currentStepIndex]?.progress || 5;
  const currentEstado = activeOrder?.estado || 'pendiente';

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
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">Gala Logistics Live</span>
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Storytelling v15.0</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Bitácora de Pedido</h2>
            </div>
            <button 
              onClick={() => setIsTrackingOpen(false)}
              className="p-4 bg-slate-50 hover:bg-slate-100 rounded-3xl text-slate-400 hover:text-black transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* 🗺️ EL MUNDO GALA STORYTELLING (v15.0) */}
          <div className="relative h-[480px] w-full flex items-center justify-center overflow-hidden bg-[#e0f7fa]">
             {/* BACKGROUND SCENERY */}
             <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 600 500" className="w-full h-full opacity-30">
                   <path d="M 0 250 Q 150 150 300 250 T 600 250 L 600 500 L 0 500 Z" fill="#4db6ac" />
                   <g transform="translate(520, 60)" className="text-amber-400">
                      <Sun className="w-16 h-16" />
                   </g>
                </svg>
             </div>

             <div className="relative w-full h-full">
                <svg viewBox="0 0 600 500" className="w-full h-full overflow-visible drop-shadow-2xl">
                   
                   {/* 🌊 RIVER */}
                   <motion.path 
                     d="M -100 420 Q 150 350 300 450 T 700 420"
                     fill="none" stroke="#4fc3f7" strokeWidth="80" strokeOpacity="0.4"
                     animate={{ strokeDashoffset: [0, -200] }}
                     transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                     strokeDasharray="20 40"
                   />

                   {/* 🛣️ THE ROAD */}
                   <path 
                     id="galaStoryPath"
                     d="M 60 320 C 120 320, 180 200, 250 200 C 320 200, 380 320, 450 320 C 520 320, 580 250, 600 250"
                     fill="none" stroke="#263238" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" 
                   />
                   <path 
                     d="M 60 320 C 120 320, 180 200, 250 200 C 320 200, 380 320, 450 320 C 520 320, 580 250, 600 250"
                     fill="none" stroke="#ffd600" strokeWidth="1.5" strokeDasharray="10 20" strokeOpacity="0.5"
                   />

                   {/* 🏢 BUILDINGS AND PHASE VISUALS */}
                   {steps.map((point, idx) => {
                     const isReached = idx <= currentStepIndex;
                     const isCurrent = idx === currentStepIndex;
                     
                     return (
                       <g key={point.id} transform={`translate(${point.x}, ${point.y})`}>
                          <motion.g
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                          >
                             <ellipse cx="0" cy="15" rx="40" ry="15" fill="black" opacity="0.05" />

                             {point.building === 'hub' && (
                               <g transform="translate(-30, -80)">
                                  <rect x="0" y="20" width="60" height="60" fill={isReached ? '#004d40' : '#b0bec5'} rx="4" />
                                  <path d="M0 20 L30 0 L60 20 Z" fill={isReached ? '#002420' : '#78909c'} />
                                  {isCurrent && (
                                    <motion.g animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} transform="translate(30, 50)">
                                      <Clock className="w-8 h-8 text-white absolute -translate-x-4 -translate-y-4" />
                                    </motion.g>
                                  )}
                               </g>
                             )}
                             {point.building === 'hq' && (
                               <g transform="translate(-25, -120)">
                                  <rect x="0" y="0" width="50" height="120" fill={isReached ? '#1a237e' : '#b0bec5'} rx="4" />
                                  <rect x="5" y="5" width="40" height="110" fill="#bbdefb" opacity="0.4" />
                                  {isCurrent && (
                                    <motion.g initial={{ scale: 0 }} animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} transform="translate(25, 30)">
                                       <ShieldCheck className="w-10 h-10 text-emerald-400 absolute -translate-x-5 -translate-y-5" />
                                    </motion.g>
                                  )}
                               </g>
                             )}
                             {point.building === 'warehouse' && (
                               <g transform="translate(-40, -70)">
                                  <rect x="0" y="10" width="80" height="60" fill={isReached ? '#5d4037' : '#b0bec5'} rx="4" />
                                  <rect x="10" y="30" width="20" height="40" fill="#1e293b" /> {/* Muelle */}
                                  {isCurrent && (
                                    <motion.g>
                                       {/* Animated Packages Loading into the truck later */}
                                       {[0, 1, 2].map((p, i) => (
                                         <motion.g
                                           key={i}
                                           initial={{ x: 10, y: 40, opacity: 0 }}
                                           animate={{ x: 50, y: 40, opacity: [0, 1, 0] }}
                                           transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.5 }}
                                         >
                                            <Package className="w-4 h-4 text-amber-500" />
                                         </motion.g>
                                       ))}
                                    </motion.g>
                                  )}
                               </g>
                             )}
                             {point.building === 'road' && (
                               <g transform="translate(-20, -50)">
                                  <circle r="25" fill={isReached ? '#311b92' : '#b0bec5'} />
                                  <Truck className="w-8 h-8 text-white absolute -translate-x-4 -translate-y-4" />
                               </g>
                             )}
                             {point.building === 'home' && (
                               <g transform="translate(-35, -80)">
                                  <path d="M 0 35 L 40 0 L 80 35 L 80 80 L 0 80 Z" fill={isCurrent ? '#1b5e20' : '#b0bec5'} />
                                  <Home className="w-10 h-10 text-white absolute" x="22" y="30" />
                               </g>
                             )}

                             {/* Label */}
                             <g transform="translate(0, 45)">
                                <rect x="-50" y="0" width="100" height="26" rx="13" fill={isCurrent ? '#0f172a' : 'white'} className="shadow-2xl" />
                                <text fontSize="10" fontWeight="900" textAnchor="middle" y="17" fill={isCurrent ? 'white' : '#94a3b8'} className="uppercase tracking-[0.3em]">
                                   {point.label}
                                </text>
                             </g>
                          </motion.g>
                       </g>
                     );
                   })}

                   {/* 🚛 EL GALA MASTER (Lógica Narrativa) */}
                   {currentEstado !== 'pendiente' && currentEstado !== 'recibido' && (
                     <motion.g 
                       initial={{ opacity: 0 }}
                       animate={{ 
                         opacity: 1,
                         offsetDistance: `${progressPercent}%` 
                       }}
                       style={{ 
                         offsetPath: "path('M 60 320 C 120 320, 180 200, 250 200 C 320 200, 380 320, 450 320 C 520 320, 580 250, 600 250')",
                         offsetRotate: "auto 0deg" 
                       }}
                       transition={{ duration: currentEstado === 'en_transito' ? 3 : 0, ease: "easeInOut" }}
                     >
                        <g transform="translate(-60, -45) scale(0.9)">
                           {/* Truck Body */}
                           <rect x="0" y="10" width="105" height="48" rx="4" fill="#263238" />
                           <rect x="5" y="15" width="95" height="38" fill="#37474f" />
                           <text x="15" y="35" fontSize="11" fontWeight="900" fill="white" opacity="0.8" className="italic">GALA MASTER</text>
                           
                           {/* Cabina */}
                           <g transform="translate(107, 5)">
                              <path d="M 0 10 L 25 10 L 38 28 L 38 48 L 0 48 Z" fill="#1d4ed8" />
                              <rect x="5" y="15" width="22" height="18" fill="#e0f2fe" opacity="0.7" rx="2" />
                           </g>

                           {/* 🎡 WHEELS (Solo giran en RUTA) */}
                           <g fill="#111">
                              {[18, 32, 75, 89, 120, 135].map((cx, i) => (
                                <motion.g key={i} transform={`translate(${cx}, 58)`}>
                                   <motion.circle 
                                     r="9" 
                                     animate={currentEstado === 'en_transito' ? { rotate: 360 } : {}}
                                     transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
                                     stroke="white" strokeWidth="2" strokeDasharray="4 4"
                                   />
                                   <circle r="4" fill="white" />
                                </motion.g>
                              ))}
                           </g>

                           {/* Smoke (Solo en RUTA) */}
                           {currentEstado === 'en_transito' && (
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
                           )}
                        </g>
                     </motion.g>
                   )}
                </svg>
             </div>
          </div>

          {/* Info Card */}
          <div className="p-10 pt-8 space-y-8 bg-white relative z-20">
             <div className="flex flex-col sm:flex-row gap-8 items-center justify-between p-8 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-inner group">
                <div className="flex items-center gap-6">
                   <div className="p-6 bg-white rounded-3xl shadow-lg text-indigo-600 ring-8 ring-slate-50">
                      <Truck className="w-8 h-8" />
                   </div>
                   <div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Unidad Gala</p>
                      <p className="text-md font-black text-slate-900 uppercase italic leading-none">Master Truck #001</p>
                      <p className="text-[9px] font-bold text-indigo-500 mt-2 uppercase tracking-widest">
                        {currentEstado === 'preparacion' ? 'Fase: Carga de Mercancía' : 
                         currentEstado === 'en_transito' ? 'Fase: Despliegue en Ruta' : 'Fase: Gestión Administrativa'}
                      </p>
                   </div>
                </div>
                <div className="flex flex-col items-center sm:items-end">
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Destino</p>
                   <p className="text-sm font-black text-slate-700 truncate max-w-[300px] border-b-2 border-emerald-200">{activeOrder?.ubicacion_entrega || "Cargando..."}</p>
                </div>
             </div>

             <div className="flex justify-between items-center py-6 border-t border-slate-100">
                <div className="flex flex-col">
                   <p className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-2">Inversión</p>
                   <p className="text-4xl font-black text-slate-900 tracking-tighter italic">Q{activeOrder?.total || 0}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                   <p className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-2">Estado Gala</p>
                   <div className="flex items-center gap-4 bg-emerald-50 px-6 py-3 rounded-full border border-emerald-100">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
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
