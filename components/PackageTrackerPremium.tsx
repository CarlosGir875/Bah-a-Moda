"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Truck, Package, MapPin, CheckCircle2, Clock, Home, Building2, Warehouse, ArrowRight, Sun, Cloud, ShieldCheck } from "lucide-react";
import { useStore } from "@/lib/store";

export function PackageTrackerPremium() {
  const { isTrackingOpen, setIsTrackingOpen, userOrders } = useStore();
  
  const activeOrder = userOrders.find(o => o.estado !== 'cancelado' && o.estado !== 'listo_entrega') || userOrders[0];

  if (!isTrackingOpen) return null;

  // Mapa equilibrado (v17.0)
  const steps = [
    { id: 'pendiente', label: 'ESPERA', progress: 5, building: 'hub', x: 100, y: 250 },
    { id: 'recibido', label: 'CONFIRMADO', progress: 28, building: 'hq', x: 280, y: 230 },
    { id: 'preparacion', label: 'EMPACANDO', progress: 52, building: 'warehouse', x: 460, y: 250 },
    { id: 'en_transito', label: 'EN RUTA', progress: 78, building: 'road', x: 640, y: 230 },
    { id: 'listo_entrega', label: 'ENTREGADO', progress: 92, building: 'home', x: 740, y: 240 }
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
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={() => setIsTrackingOpen(false)}
        />
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden border border-slate-100"
        >
          {/* Header Compacto y Elegante */}
          <div className="p-8 pb-4 flex items-center justify-between bg-white relative z-20">
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-1">Gala Fleet Management</span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Seguimiento</h2>
            </div>
            <button 
              onClick={() => setIsTrackingOpen(false)}
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-black transition-all active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 🗺️ EL MUNDO EQUILIBRADO (v17.0) */}
          <div className="relative h-[320px] w-full flex items-center justify-center overflow-hidden bg-[#f1f5f9]">
             {/* Fondo de Montañas (Strictly Background) */}
             <div className="absolute inset-0 pointer-events-none opacity-20">
                <svg viewBox="0 0 800 400" className="w-full h-full">
                   <path d="M 0 250 L 150 150 L 350 250 L 550 180 L 800 250 L 800 400 L 0 400 Z" fill="#475569" />
                   <Sun className="w-12 h-12 text-amber-400 absolute right-10 top-10" />
                </svg>
             </div>

             {/* Suelo Sólido para la Carretera */}
             <div className="absolute bottom-0 w-full h-[150px] bg-slate-200/50" />

             <div className="relative w-full h-full">
                <svg viewBox="0 0 800 400" className="w-full h-full overflow-visible">
                   
                   {/* 🛣️ CARRETERA PLANA (Smooth & Horizontal) */}
                   <path 
                     id="galaFlatRoad"
                     d="M 50 250 Q 150 250, 280 230 T 460 250 T 640 230 T 780 240"
                     fill="none" stroke="#334155" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" 
                   />
                   <path 
                     d="M 50 250 Q 150 250, 280 230 T 460 250 T 640 230 T 780 240"
                     fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="5 10" strokeOpacity="0.5"
                   />

                   {/* 🏢 EDIFICIOS (Sweet Spot Size) */}
                   {steps.map((point, idx) => {
                     const isReached = idx <= currentStepIndex;
                     const isCurrent = idx === currentStepIndex;
                     
                     return (
                       <g key={point.id} transform={`translate(${point.x}, ${point.y})`}>
                          <motion.g
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                             <ellipse cx="0" cy="10" rx="25" ry="8" fill="black" opacity="0.05" />

                             {point.building === 'hub' && (
                               <g transform="translate(-15, -40)">
                                  <rect x="0" y="10" width="30" height="30" fill={isReached ? '#334155' : '#cbd5e1'} rx="2" />
                                  <path d="M0 10 L15 0 L30 10 Z" fill={isReached ? '#1e293b' : '#94a3b8'} />
                                  {isCurrent && (
                                    <motion.rect width="6" height="6" x="12" y="15" fill="white" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} />
                                  )}
                               </g>
                             )}
                             {point.building === 'hq' && (
                               <g transform="translate(-12, -60)">
                                  <rect x="0" y="0" width="24" height="60" fill={isReached ? '#1e3a8a' : '#cbd5e1'} rx="2" />
                                  <rect x="4" y="4" width="16" height="52" fill="#bfdbfe" opacity="0.3" />
                                  {isCurrent && (
                                    <motion.circle r="20" cx="12" cy="30" fill="#60a5fa" initial={{ scale: 0, opacity: 0.5 }} animate={{ scale: 2, opacity: 0 }} transition={{ repeat: Infinity, duration: 2 }} />
                                  )}
                               </g>
                             )}
                             {point.building === 'warehouse' && (
                               <g transform="translate(-20, -35)">
                                  <rect x="0" y="5" width="40" height="30" fill={isReached ? '#92400e' : '#cbd5e1'} rx="2" />
                                  <rect x="8" y="15" width="10" height="20" fill="#1e293b" />
                                  {isCurrent && (
                                    <g>
                                       {[0,1].map((p, i) => (
                                         <motion.rect key={i} width="4" height="4" fill="#fbbf24" initial={{ x: 8, y: 20, opacity: 0 }} animate={{ x: 35, opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.5 }} />
                                       ))}
                                    </g>
                                  )}
                               </g>
                             )}
                             {point.building === 'road' && (
                               <g transform="translate(-10, -25)">
                                  <circle r="12" fill={isReached ? '#4f46e5' : '#cbd5e1'} />
                                  <Truck className="w-4 h-4 text-white absolute -translate-x-2 -translate-y-2" />
                               </g>
                             )}
                             {point.building === 'home' && (
                               <g transform="translate(-15, -40)">
                                  <path d="M 0 15 L 15 0 L 30 15 L 30 40 L 0 40 Z" fill={isCurrent ? '#166534' : '#cbd5e1'} />
                                  <Home className="w-5 h-5 text-white absolute" x="5" y="15" />
                               </g>
                             )}

                             {/* Label Fina */}
                             <g transform="translate(0, 20)">
                                <rect x="-30" y="0" width="60" height="14" rx="7" fill={isCurrent ? 'black' : 'white'} className="shadow-lg" />
                                <text fontSize="6" fontWeight="900" textAnchor="middle" y="9" fill={isCurrent ? 'white' : '#94a3b8'} className="uppercase tracking-[0.2em]">
                                   {point.label}
                                </text>
                             </g>
                          </motion.g>
                       </g>
                     );
                   })}

                   {/* 🚛 EL GALA MASTER v17 (Smooth & Level) */}
                   {currentEstado !== 'pendiente' && currentEstado !== 'recibido' && (
                     <motion.g 
                       initial={{ opacity: 0 }}
                       animate={{ 
                         opacity: 1,
                         offsetDistance: `${progressPercent}%` 
                       }}
                       style={{ 
                         offsetPath: "path('M 50 250 Q 150 250, 280 230 T 460 250 T 640 230 T 780 240')",
                         offsetRotate: "auto 0deg" 
                       }}
                       transition={{ duration: currentEstado === 'en_transito' ? 3 : 0, ease: "easeInOut" }}
                     >
                        <g transform="translate(-25, -25) scale(0.6)">
                           <rect x="0" y="5" width="60" height="30" rx="2" fill="#1e293b" />
                           <rect x="62" y="10" width="20" height="25" fill="#1d4ed8" rx="2" />
                           <text x="5" y="22" fontSize="7" fontWeight="900" fill="white" opacity="0.8" className="italic">GALA</text>
                           
                           {/* Ruedas Finitas */}
                           <g fill="#111">
                              {[8, 18, 42, 52, 72].map((cx, i) => (
                                <motion.circle key={i} cx={cx} cy="38" r="5" animate={currentEstado === 'en_transito' ? { rotate: 360 } : {}} transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }} stroke="white" strokeWidth="1" />
                              ))}
                           </g>
                        </g>
                     </motion.g>
                   )}
                </svg>
             </div>
          </div>

          {/* Tarjeta de Información Compacta (v17.0) */}
          <div className="p-8 pt-4 bg-white relative z-30">
             <div className="flex items-center justify-between p-5 bg-slate-50 rounded-[2rem] border border-slate-100 mb-6 shadow-inner">
                <div className="flex items-center gap-4">
                   <div className="p-4 bg-white rounded-2xl shadow-lg text-indigo-600">
                      <Truck className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Gala Master Truck</p>
                      <p className="text-sm font-black text-slate-900 uppercase italic">Unidad #001</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Destino Final</p>
                   <p className="text-xs font-bold text-slate-700 italic border-b-2 border-indigo-100">{activeOrder?.ubicacion_entrega || "Cargando..."}</p>
                </div>
             </div>

             <div className="flex justify-between items-center mb-8 px-2">
                <div className="flex flex-col">
                   <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-1">Monto Invertido</p>
                   <p className="text-2xl font-black text-slate-900 italic">Q{activeOrder?.total || 0}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                   <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-1">Estado de Entrega</p>
                   <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-lg font-black text-emerald-950 uppercase italic tracking-tighter">
                         {steps[currentStepIndex]?.label}
                      </p>
                   </div>
                </div>
             </div>

             <button 
                onClick={() => setIsTrackingOpen(false)}
                className="group w-full py-5 bg-black text-white rounded-[1.8rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-xl hover:shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-4 relative overflow-hidden"
             >
                Regresar a la Tienda <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
