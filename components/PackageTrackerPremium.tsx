"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Truck, Package, MapPin, CheckCircle2, Clock, Home, Building2, Warehouse, ArrowRight, Sun, Cloud, ShieldCheck, Trees } from "lucide-react";
import { useStore } from "@/lib/store";

export function PackageTrackerPremium() {
  const { isTrackingOpen, setIsTrackingOpen, userOrders } = useStore();
  
  const activeOrder = userOrders.find(o => o.estado !== 'cancelado' && o.estado !== 'listo_entrega') || userOrders[0];

  if (!isTrackingOpen) return null;

  // Mapa Vivo (v18.0)
  const steps = [
    { id: 'pendiente', label: 'ESPERA', progress: 5, building: 'hub', x: 100, y: 280 },
    { id: 'recibido', label: 'CONFIRMADO', progress: 28, building: 'hq', x: 280, y: 260 },
    { id: 'preparacion', label: 'EMPACANDO', progress: 52, building: 'warehouse', x: 460, y: 280 },
    { id: 'en_transito', label: 'EN RUTA', progress: 78, building: 'road', x: 640, y: 260 },
    { id: 'listo_entrega', label: 'ENTREGADO', progress: 92, building: 'home', x: 750, y: 270 }
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
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
          onClick={() => setIsTrackingOpen(false)}
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-[0_50px_120px_rgba(0,0,0,0.6)] overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 pb-4 flex items-center justify-between bg-white relative z-30">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-1">Gala Logistics Live</span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Estado del Pedido</h2>
            </div>
            <button 
              onClick={() => setIsTrackingOpen(false)}
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-black transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 🗺️ EL MUNDO VIVO GALA (v18.0) */}
          <div className="relative h-[380px] w-full flex items-center justify-center overflow-hidden bg-[#e8f5e9]">
             {/* 🌲 PAISAJE DETALLADO */}
             <div className="absolute inset-0 pointer-events-none opacity-60">
                <svg viewBox="0 0 800 400" className="w-full h-full">
                   <path d="M 0 300 Q 200 200 400 300 T 800 300 L 800 400 L 0 400 Z" fill="#c8e6c9" />
                   <Sun className="w-16 h-16 text-amber-400 absolute right-10 top-10" />
                   {/* Árboles decorativos */}
                   {[150, 350, 550, 700].map((x, i) => (
                     <g key={i} transform={`translate(${x}, ${250 + Math.random()*50})`}>
                        <circle r="10" fill="#2e7d32" />
                        <rect x="-2" width="4" height="10" fill="#3e2723" />
                     </g>
                   ))}
                </svg>
             </div>

             <div className="relative w-full h-full">
                <svg viewBox="0 0 800 400" className="w-full h-full overflow-visible">
                   
                   {/* 🛣️ CARRETERA (Enfrente de los edificios para dar perspectiva) */}
                   {/* Pero primero dibujamos los edificios para que queden atrás */}
                   
                   {/* 🏢 EDIFICIOS CON BASES SÓLIDAS */}
                   {steps.map((point, idx) => {
                     const isReached = idx <= currentStepIndex;
                     const isCurrent = idx === currentStepIndex;
                     
                     return (
                       <g key={point.id} transform={`translate(${point.x}, ${point.y})`}>
                          <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}>
                             {/* Base de Concreto */}
                             <rect x="-30" y="5" width="60" height="10" fill="#94a3b8" rx="2" />
                             
                             {point.building === 'hub' && (
                               <g transform="translate(-15, -45)">
                                  <rect x="0" y="10" width="30" height="35" fill={isReached ? '#2e3b4e' : '#cbd5e1'} rx="1" />
                                  <path d="M0 10 L15 0 L30 10 Z" fill={isReached ? '#1e293b' : '#94a3b8'} />
                                  {isCurrent && (
                                    <motion.g animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} transform="translate(15, 25)">
                                      <Clock className="w-4 h-4 text-white absolute -translate-x-2 -translate-y-2" />
                                    </motion.g>
                                  )}
                               </g>
                             )}
                             {point.building === 'hq' && (
                               <g transform="translate(-12, -70)">
                                  <rect x="0" y="0" width="24" height="70" fill={isReached ? '#1a237e' : '#cbd5e1'} rx="1" />
                                  <rect x="4" y="4" width="16" height="62" fill="#e1f5fe" opacity="0.4" />
                                  <ShieldCheck className="w-4 h-4 text-emerald-400 absolute" x="4" y="10" />
                               </g>
                             )}
                             {point.building === 'warehouse' && (
                               <g transform="translate(-25, -40)">
                                  <rect x="0" y="5" width="50" height="35" fill={isReached ? '#78350f' : '#cbd5e1'} rx="1" />
                                  <rect x="10" y="15" width="15" height="25" fill="#1e293b" />
                                  {/* CINTA TRANSPORTADORA ANIMADA (Solo en EMPACANDO) */}
                                  {isCurrent && (
                                    <g transform="translate(25, 20)">
                                       <rect width="25" height="5" fill="#475569" rx="2" />
                                       {[0, 1].map((p, i) => (
                                         <motion.g key={i} initial={{ x: 0, opacity: 0 }} animate={{ x: 25, opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.5 }}>
                                            <Package className="w-3 h-3 text-amber-600" y="-3" />
                                         </motion.g>
                                       ))}
                                    </g>
                                  )}
                               </g>
                             )}
                             {point.building === 'road' && (
                               <g transform="translate(-10, -20)">
                                  <circle r="10" fill={isReached ? '#4338ca' : '#cbd5e1'} />
                                  <Truck className="w-4 h-4 text-white absolute -translate-x-2 -translate-y-2" />
                               </g>
                             )}
                             {point.building === 'home' && (
                               <g transform="translate(-15, -40)">
                                  <path d="M 0 15 L 15 0 L 30 15 L 30 40 L 0 40 Z" fill={isCurrent ? '#166534' : '#cbd5e1'} />
                                  <Home className="w-5 h-5 text-white absolute" x="5" y="15" />
                               </g>
                             )}

                             <g transform="translate(0, 25)">
                                <rect x="-35" y="0" width="70" height="16" rx="8" fill={isCurrent ? '#0f172a' : 'white'} className="shadow-lg" />
                                <text fontSize="7" fontWeight="900" textAnchor="middle" y="10" fill={isCurrent ? 'white' : '#94a3b8'} className="uppercase tracking-[0.2em]">
                                   {point.label}
                                </text>
                             </g>
                          </motion.g>
                       </g>
                     );
                   })}

                   {/* 🛣️ CARRETERA (Enfrente de los edificios) */}
                   <path 
                     d="M 50 300 Q 150 300, 280 280 T 460 300 T 640 280 T 780 290"
                     fill="none" stroke="#334155" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" 
                   />
                   <path 
                     d="M 50 300 Q 150 300, 280 280 T 460 300 T 640 280 T 780 290"
                     fill="none" stroke="#facc15" strokeWidth="1" strokeDasharray="6 12" strokeOpacity="0.5"
                   />

                   {/* 🚛 EL GALA MASTER (Ruedas giran solo en RUTA) */}
                   {currentEstado !== 'pendiente' && currentEstado !== 'recibido' && (
                     <motion.g 
                       initial={{ opacity: 0 }}
                       animate={{ 
                         opacity: 1,
                         offsetDistance: `${progressPercent}%` 
                       }}
                       style={{ 
                         offsetPath: "path('M 50 300 Q 150 300, 280 280 T 460 300 T 640 280 T 780 290')",
                         offsetRotate: "auto 0deg" 
                       }}
                       transition={{ duration: currentEstado === 'en_transito' ? 3 : 0, ease: "easeInOut" }}
                     >
                        <g transform="translate(-25, -25) scale(0.65)">
                           <rect x="0" y="5" width="65" height="35" rx="2" fill="#1e293b" />
                           <rect x="67" y="10" width="22" height="30" fill="#1d4ed8" rx="2" />
                           <text x="8" y="25" fontSize="8" fontWeight="900" fill="white" opacity="0.8" className="italic">GALA</text>
                           
                           {/* Ruedas */}
                           <g fill="#111">
                              {[10, 22, 48, 60, 80].map((cx, i) => (
                                <motion.circle key={i} cx={cx} cy="42" r="6" animate={currentEstado === 'en_transito' ? { rotate: 360 } : {}} transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }} stroke="white" strokeWidth="1.5" />
                              ))}
                           </g>

                           {/* Humo solo en ruta */}
                           {currentEstado === 'en_transito' && (
                             <motion.g opacity="0.4">
                                {[0, 1].map((i) => (
                                  <motion.circle key={i} cx="-5" cy="15" r="4" fill="#94a3b8" animate={{ opacity: [0, 1, 0], x: [-10, -50], scale: [1, 3] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.5 }} />
                                ))}
                             </motion.g>
                           )}
                        </g>
                     </motion.g>
                   )}
                </svg>
             </div>
          </div>

          {/* Detalles Inferiores Compactos */}
          <div className="p-8 pt-6 bg-white border-t border-slate-50">
             <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 mb-6 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-5">
                   <Truck className="w-20 h-20 rotate-12" />
                </div>
                <div className="flex items-center gap-5 relative z-10">
                   <div className="p-4 bg-white rounded-2xl shadow-lg text-emerald-600 ring-4 ring-emerald-50">
                      <Truck className="w-7 h-7" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gala Master Truck</p>
                      <p className="text-md font-black text-slate-900 uppercase italic">Unidad Gala #001</p>
                   </div>
                </div>
                <div className="text-right relative z-10">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Punto de Entrega</p>
                   <p className="text-xs font-bold text-slate-700 italic border-b-2 border-emerald-100">{activeOrder?.ubicacion_entrega || "Actualizando..."}</p>
                </div>
             </div>

             <div className="flex justify-between items-center mb-8 px-2">
                <div className="flex flex-col">
                   <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-1">Inversión Total</p>
                   <p className="text-3xl font-black text-slate-900 italic tracking-tighter">Q{activeOrder?.total || 0}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                   <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-1">Fase Logística</p>
                   <div className="flex items-center gap-3 bg-emerald-50 px-5 py-2.5 rounded-full border border-emerald-100 shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-xl font-black text-emerald-950 uppercase italic tracking-tighter">
                         {steps[currentStepIndex]?.label}
                      </p>
                   </div>
                </div>
             </div>

             <button 
                onClick={() => setIsTrackingOpen(false)}
                className="group w-full py-6 bg-black text-white rounded-[2rem] text-[12px] font-black uppercase tracking-[0.3em] shadow-2xl hover:shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-4 relative overflow-hidden"
             >
                Regresar a la Boutique <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform" />
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
