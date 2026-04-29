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
          <div className="p-10 pb-6 flex items-center justify-between bg-gradient-to-b from-slate-50 to-white relative z-20">
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                 <div className="px-3 py-1 bg-emerald-500 rounded-full">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">Live Tracking</span>
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Gala Fleet v13.0</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Mi Pedido en Camino</h2>
            </div>
            <button 
              onClick={() => setIsTrackingOpen(false)}
              className="p-4 bg-white shadow-xl hover:shadow-2xl rounded-3xl text-slate-400 hover:text-black transition-all active:scale-90"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* 🗺️ EL MUNDO GALA HORIZON (Rediseño Total 13.0) */}
          <div className="relative h-[480px] w-full flex items-center justify-center overflow-hidden bg-[#e0f2f1]">
             {/* 🏔️ BACKGROUND SCENERY (Mountains & Clouds) */}
             <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 600 500" className="w-full h-full opacity-20">
                   <path d="M 0 150 L 150 50 L 300 150 L 450 80 L 600 150 L 600 500 L 0 500 Z" fill="#00796b" />
                   <g transform="translate(450, 60)" className="text-amber-400">
                      <Sun className="w-12 h-12" />
                   </g>
                   <g transform="translate(100, 80)" className="text-white opacity-60">
                      <Cloud className="w-16 h-16" />
                   </g>
                </svg>
             </div>

             {/* 🛣️ THE FLOWING ROAD (Smooth Curve Bézier) */}
             <div className="relative w-full h-full">
                <svg viewBox="0 0 600 500" className="w-full h-full overflow-visible drop-shadow-2xl">
                   
                   {/* 🌊 RIVER (Animated Wavy) */}
                   <motion.path 
                     d="M -100 380 Q 50 320 200 420 T 450 360 T 700 420"
                     fill="none" stroke="#4fc3f7" strokeWidth="60" strokeOpacity="0.4" strokeLinecap="round"
                     animate={{ strokeDashoffset: [0, -200] }}
                     transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                     strokeDasharray="20 40"
                   />

                   {/* 🛣️ ASPHALT HIGHWAY (Wider & Curved) */}
                   <path 
                     id="galaHorizonRoad"
                     d="M 60 320 C 120 320, 180 200, 250 200 C 320 200, 380 320, 450 320 C 520 320, 580 250, 600 250"
                     fill="none" stroke="#263238" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" 
                   />
                   <path 
                     d="M 60 320 C 120 320, 180 200, 250 200 C 320 200, 380 320, 450 320 C 520 320, 580 250, 600 250"
                     fill="none" stroke="#ffd600" strokeWidth="1.5" strokeDasharray="10 20" strokeOpacity="0.6"
                   />

                   {/* 🌲 DECORATIONS (Parks & Lights) */}
                   {[
                     {x: 100, y: 150, type: 'tree'}, {x: 350, y: 120, type: 'park'}, 
                     {x: 50, y: 420, type: 'tree'}, {x: 500, y: 400, type: 'light'}
                   ].map((d, i) => (
                     <g key={i} transform={`translate(${d.x}, ${d.y})`}>
                        {d.type === 'tree' && (
                          <g>
                             <circle cy="5" r="10" fill="black" opacity="0.05" />
                             <path d="M 0 -15 L 10 5 L -10 5 Z" fill="#2e7d32" />
                             <path d="M 0 -22 L 7 -5 L -7 -5 Z" fill="#388e3c" />
                          </g>
                        )}
                        {d.type === 'park' && (
                          <g transform="scale(0.8)">
                             <rect x="-30" y="-10" width="60" height="40" rx="15" fill="#a5d6a7" />
                             <circle r="5" fill="#4caf50" x="-10" />
                          </g>
                        )}
                        {d.type === 'light' && (
                           <g>
                              <line y1="0" y2="-30" stroke="#455a64" strokeWidth="2" />
                              <circle cy="-30" r="4" fill="#ffd600" />
                           </g>
                        )}
                     </g>
                   ))}

                   {/* 🏢 THE BUILDINGS (Detailed Isometric) */}
                   {[
                     { id: 'pendiente', x: 60, y: 320, label: 'ESPERA', type: 'hub' },
                     { id: 'recibido', x: 250, y: 200, label: 'CONFIRMADO', type: 'hq' },
                     { id: 'preparacion', x: 450, y: 320, label: 'EMPACANDO', type: 'warehouse' },
                     { id: 'listo_entrega', x: 550, y: 250, label: 'ENTREGADO', type: 'villa' }
                   ].map((point, idx) => {
                     const isReached = idx <= currentStepIndex;
                     const isCurrent = idx === currentStepIndex;
                     
                     return (
                       <g key={point.id} transform={`translate(${point.x}, ${point.y})`}>
                          <motion.g
                            initial={{ y: -100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.1, type: "spring" }}
                          >
                             <ellipse cx="0" cy="10" rx="40" ry="15" fill="black" opacity="0.05" />

                             {point.type === 'hub' && (
                               <g transform="translate(-25, -70)">
                                  <rect x="0" y="20" width="50" height="50" fill={isReached ? '#263238' : '#b0bec5'} rx="4" />
                                  <path d="M0 20 L25 0 L50 20 Z" fill={isReached ? '#004d40' : '#78909c'} />
                                  <Clock className="w-6 h-6 text-white absolute" x="12" y="30" />
                               </g>
                             )}
                             {point.type === 'hq' && (
                               <g transform="translate(-20, -100)">
                                  <rect x="0" y="0" width="40" height="100" fill={isReached ? '#0d47a1' : '#b0bec5'} rx="4" />
                                  <rect x="5" y="5" width="30" height="90" fill="#bbdefb" opacity="0.4" />
                                  <Building2 className="w-6 h-6 text-white absolute" x="7" y="15" />
                               </g>
                             )}
                             {point.type === 'warehouse' && (
                               <g transform="translate(-30, -60)">
                                  <rect x="0" y="10" width="65" height="50" fill={isReached ? '#bf360c' : '#b0bec5'} rx="4" />
                                  <rect x="15" y="25" width="35" height="35" fill="white" opacity="0.2" />
                                  <Warehouse className="w-7 h-7 text-white absolute" x="18" y="25" />
                               </g>
                             )}
                             {point.type === 'villa' && (
                               <g transform="translate(-30, -70)">
                                  <path d="M 0 30 L 32 0 L 65 30 L 65 70 L 0 70 Z" fill={isCurrent ? '#1b5e20' : '#b0bec5'} />
                                  <rect x="25" y="45" width="15" height="25" fill="#fdd835" />
                                  <Home className="w-8 h-8 text-white absolute" x="17" y="25" />
                               </g>
                             )}

                             <g transform="translate(0, 30)">
                                <rect x="-45" y="0" width="90" height="22" rx="11" fill={isCurrent ? '#1e293b' : 'white'} className="shadow-2xl" />
                                <text fontSize="8" fontWeight="900" textAnchor="middle" y="14" fill={isCurrent ? 'white' : '#94a3b8'} className="uppercase tracking-[0.3em]">
                                   {point.label}
                                </text>
                             </g>
                          </motion.g>
                       </g>
                     );
                   })}

                   {/* 🚛 EL GALA MASTER 13.0 (Longer, Realistic & Smooth Rotation) */}
                   {activeOrder?.estado !== 'pendiente' && (
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
                       transition={{ duration: 3, ease: "easeInOut" }}
                     >
                        <g transform="translate(-55, -45) scale(0.85)">
                           {/* Trailer shadows */}
                           <rect x="5" y="55" width="120" height="8" rx="4" fill="black" opacity="0.1" />

                           {/* REMOLQUE (Heavy Duty Trailer) */}
                           <rect x="0" y="10" width="95" height="45" rx="4" fill="#263238" />
                           <rect x="5" y="15" width="85" height="35" fill="#37474f" />
                           {/* Trailer Details */}
                           <g stroke="white" strokeWidth="0.5" strokeOpacity="0.1">
                              {[...Array(12)].map((_, i) => (
                                <line key={i} x1={10 + i*7} y1="18" x2={10 + i*7} y2="42" />
                              ))}
                           </g>
                           <text x="12" y="32" fontSize="10" fontWeight="900" fill="white" opacity="0.9" className="italic tracking-tighter">GALA MASTER</text>
                           <text x="12" y="40" fontSize="5" fontWeight="900" fill="#ffd600" opacity="0.6">BAHÍA MODA LOGISTICS</text>

                           {/* CABINA (Truck Head - More Detailed) */}
                           <g transform="translate(97, 5)">
                              <path d="M 0 10 L 25 10 L 35 25 L 35 45 L 0 45 Z" fill="#1565c0" />
                              <rect x="5" y="15" width="20" height="15" fill="#e3f2fd" opacity="0.7" rx="2" /> {/* Windshield */}
                              <rect x="28" y="35" width="8" height="6" fill="#ffd600" rx="1" /> {/* Front Light */}
                              <rect x="2" y="45" width="30" height="5" fill="#102027" /> {/* Bumper */}
                           </g>

                           {/* 18 WHEELS (Real Axles) */}
                           <g fill="#111">
                              <circle cx="15" cy="55" r="8" />
                              <circle cx="28" cy="55" r="8" />
                              <circle cx="65" cy="55" r="8" />
                              <circle cx="78" cy="55" r="8" />
                              <circle cx="110" cy="55" r="9" />
                              <circle cx="125" cy="55" r="9" />
                           </g>

                           {/* Realistic Smoke Exhaust */}
                           <motion.g opacity="0.5">
                              {[0, 1, 2].map((i) => (
                                <motion.circle 
                                  key={i}
                                  cx="-5" cy="15" r="4" fill="#cfd8dc"
                                  animate={{ opacity: [0, 1, 0], x: [-10, -80], y: [15, -20], scale: [1, 5] }}
                                  transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.4 }}
                                />
                              ))}
                           </motion.g>
                        </g>
                     </motion.g>
                   )}
                </svg>
             </div>
          </div>

          {/* Tarjeta de Información Inferior */}
          <div className="p-10 pt-8 space-y-8 bg-white relative z-20">
             <div className="flex flex-col sm:flex-row gap-8 items-center justify-between p-8 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-inner group">
                <div className="flex items-center gap-6">
                   <div className="p-6 bg-white rounded-3xl shadow-lg text-indigo-600 ring-8 ring-slate-50 group-hover:scale-110 transition-transform">
                      <Truck className="w-8 h-8" />
                   </div>
                   <div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Unidad de Élite</p>
                      <p className="text-md font-black text-slate-900 uppercase italic leading-none">Master Truck #001</p>
                      <p className="text-[9px] font-bold text-indigo-500 mt-2 uppercase tracking-widest">Bahía Logistics Fleet</p>
                   </div>
                </div>
                <div className="flex flex-col items-center sm:items-end">
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Destino Final</p>
                   <p className="text-sm font-black text-slate-700 truncate max-w-[300px] border-b-2 border-emerald-200">{activeOrder?.ubicacion_entrega || "Cargando destino..."}</p>
                </div>
             </div>

             <div className="flex justify-between items-center py-6">
                <div className="flex flex-col">
                   <p className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-2">Total Inversión</p>
                   <p className="text-4xl font-black text-slate-900 tracking-tighter italic">Q{activeOrder?.total || 0}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                   <p className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-2">Fase Logística</p>
                   <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-slate-50">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981]" />
                      <p className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
                         {steps[currentStepIndex]?.label}
                      </p>
                   </div>
                </div>
             </div>

             <button 
                onClick={() => setIsTrackingOpen(false)}
                className="group w-full py-7 bg-zinc-950 text-white rounded-[2.5rem] text-[13px] font-black uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-indigo-500/40 transition-all active:scale-95 flex items-center justify-center gap-5 relative overflow-hidden"
             >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                Regresar a la Tienda <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" />
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
