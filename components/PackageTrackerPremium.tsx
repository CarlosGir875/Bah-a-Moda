"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Truck, Package, MapPin, CheckCircle2, Clock, Home, Building2, Warehouse, ArrowRight, Sun, Cloud, FileSearch, ShieldCheck, Zap, Waves } from "lucide-react";
import { useStore } from "@/lib/store";

export function PackageTrackerPremium() {
  const { isTrackingOpen, setIsTrackingOpen, userOrders } = useStore();
  
  const activeOrder = userOrders.find(o => o.estado !== 'cancelado' && o.estado !== 'listo_entrega') || userOrders[0];

  if (!isTrackingOpen) return null;

  // Mapa más largo para evitar amontonamiento (Efecto SimCity)
  const steps = [
    { id: 'pendiente', label: 'ESPERA', progress: 5, building: 'hub', x: 80, y: 350 },
    { id: 'recibido', label: 'CONFIRMADO', progress: 28, building: 'hq', x: 300, y: 220 },
    { id: 'preparacion', label: 'EMPACANDO', progress: 52, building: 'warehouse', x: 550, y: 350 },
    { id: 'en_transito', label: 'EN RUTA', progress: 78, building: 'road', x: 800, y: 250 },
    { id: 'listo_entrega', label: 'ENTREGADO', progress: 95, building: 'home', x: 920, y: 320 }
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
          className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
          onClick={() => setIsTrackingOpen(false)}
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 100 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 100 }}
          className="relative w-full max-w-4xl bg-white rounded-[4rem] shadow-[0_60px_200px_rgba(0,0,0,0.8)] overflow-hidden border border-white/5"
        >
          {/* Header Superior Gala */}
          <div className="p-12 pb-8 flex items-center justify-between bg-white relative z-30">
            <div className="flex flex-col">
              <div className="flex items-center gap-4 mb-3">
                 <div className="px-4 py-1.5 bg-black rounded-full shadow-lg">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Gala Universe v16.0</span>
                 </div>
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Logística de Élite</h2>
            </div>
            <button 
              onClick={() => setIsTrackingOpen(false)}
              className="p-5 bg-slate-50 hover:bg-slate-100 rounded-[2rem] text-slate-400 hover:text-black transition-all shadow-xl active:scale-90"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          {/* 🗺️ EL MICRO-UNIVERSO GALA (v16.0) */}
          <div className="relative h-[500px] w-full flex items-center justify-center overflow-hidden bg-[#e0f2f1]">
             {/* 🏔️ AMBIENTE DE FONDO (Deep Perspective) */}
             <div className="absolute inset-0 pointer-events-none opacity-40">
                <svg viewBox="0 0 1000 500" className="w-full h-full">
                   {/* Montañas Lejanas */}
                   <path d="M 0 300 L 200 100 L 400 300 L 600 150 L 800 300 L 1000 200 L 1000 500 L 0 500 Z" fill="#004d40" />
                   <Sun className="w-24 h-24 text-amber-400 absolute right-20 top-10" />
                   {/* Nubes */}
                   <motion.g animate={{ x: [0, 50, 0] }} transition={{ repeat: Infinity, duration: 20 }}>
                      <Cloud className="w-20 h-20 text-white absolute left-40 top-20 opacity-60" />
                   </motion.g>
                </svg>
             </div>

             <div className="relative w-full h-full">
                <svg viewBox="0 0 1000 500" className="w-full h-full overflow-visible drop-shadow-3xl">
                   
                   {/* 🌊 RÍO GALA (Miniature Water) */}
                   <motion.path 
                     d="M -100 450 Q 250 380 500 480 T 1100 450"
                     fill="none" stroke="#81d4fa" strokeWidth="100" strokeOpacity="0.4"
                     animate={{ strokeDashoffset: [0, -300] }}
                     transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                     strokeDasharray="15 30"
                   />

                   {/* 🛣️ CARRETERA PRINCIPAL (Long & Smooth) */}
                   <path 
                     id="galaMainRoute16"
                     d="M 80 350 Q 150 350, 300 220 T 550 350 T 800 250 T 920 320"
                     fill="none" stroke="#1e293b" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" 
                   />
                   <path 
                     d="M 80 350 Q 150 350, 300 220 T 550 350 T 800 250 T 920 320"
                     fill="none" stroke="#facc15" strokeWidth="1" strokeDasharray="6 12" strokeOpacity="0.4"
                   />

                   {/* 🌳 MINI DECORACIONES (Mundo Vivo) */}
                   {[...Array(15)].map((_, i) => (
                     <g key={i} transform={`translate(${Math.random() * 1000}, ${Math.random() * 500})`}>
                        <circle r="2" fill="#2e7d32" opacity="0.3" />
                     </g>
                   ))}

                   {/* 🏢 EDIFICIOS MINIATURA ANIMADOS */}
                   {steps.map((point, idx) => {
                     const isReached = idx <= currentStepIndex;
                     const isCurrent = idx === currentStepIndex;
                     
                     return (
                       <g key={point.id} transform={`translate(${point.x}, ${point.y})`}>
                          <motion.g
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: idx * 0.1, type: "spring" }}
                          >
                             {/* Sombras */}
                             <ellipse cx="0" cy="10" rx="30" ry="10" fill="black" opacity="0.05" />

                             {/* EDIFICIOS MINIATURA */}
                             {point.building === 'hub' && (
                               <g transform="translate(-20, -50) scale(0.8)">
                                  <rect x="0" y="10" width="40" height="40" fill={isReached ? '#004d40' : '#cfd8dc'} rx="2" />
                                  <path d="M0 10 L20 0 L40 10 Z" fill={isReached ? '#002420' : '#90a4ae'} />
                                  {/* Interior Animado: Ventanas Trabajando */}
                                  <g transform="translate(5, 15)">
                                     <motion.rect width="10" height="10" fill="white" animate={isCurrent ? { opacity: [0.1, 0.8, 0.1] } : { opacity: 0.2 }} transition={{ repeat: Infinity, duration: 1 }} />
                                     <motion.rect x="20" width="10" height="10" fill="white" animate={isCurrent ? { opacity: [0.8, 0.1, 0.8] } : { opacity: 0.2 }} transition={{ repeat: Infinity, duration: 1 }} />
                                  </g>
                               </g>
                             )}
                             {point.building === 'hq' && (
                               <g transform="translate(-15, -80) scale(0.8)">
                                  <rect x="0" y="0" width="30" height="80" fill={isReached ? '#1a237e' : '#cfd8dc'} rx="2" />
                                  <rect x="5" y="5" width="20" height="70" fill="#e1f5fe" opacity="0.5" />
                                  {/* Interior Animado: Pulso de Aprobación */}
                                  {isCurrent && (
                                    <motion.circle r="40" cx="15" cy="40" fill="#4fc3f7" initial={{ scale: 0, opacity: 0.5 }} animate={{ scale: 2, opacity: 0 }} transition={{ repeat: Infinity, duration: 1.5 }} />
                                  )}
                                  <ShieldCheck className="w-5 h-5 text-white absolute" x="5" y="15" />
                               </g>
                             )}
                             {point.building === 'warehouse' && (
                               <g transform="translate(-25, -45) scale(0.8)">
                                  <rect x="0" y="10" width="50" height="40" fill={isReached ? '#4e342e' : '#cfd8dc'} rx="2" />
                                  <rect x="10" y="25" width="15" height="25" fill="#1e293b" />
                                  {/* Interior Animado: Carga de Paquetes */}
                                  {isCurrent && (
                                    <g>
                                       {[0,1,2].map((p, i) => (
                                         <motion.rect key={i} width="6" height="6" fill="#fbbf24" initial={{ x: 10, y: 35, opacity: 0 }} animate={{ x: 50, opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.4 }} />
                                       ))}
                                    </g>
                                  )}
                               </g>
                             )}
                             {point.building === 'road' && (
                               <g transform="translate(-12, -35) scale(0.8)">
                                  <circle r="15" fill={isReached ? '#4527a0' : '#cfd8dc'} />
                                  <Truck className="w-5 h-5 text-white absolute" x="-9" y="-9" />
                               </g>
                             )}
                             {point.building === 'home' && (
                               <g transform="translate(-20, -50) scale(0.8)">
                                  <path d="M 0 20 L 25 0 L 50 20 L 50 55 L 0 55 Z" fill={isCurrent ? '#1b5e20' : '#cfd8dc'} />
                                  <rect x="18" y="35" width="14" height="20" fill="#ffeb3b" />
                                  <Home className="w-6 h-6 text-white absolute" x="12" y="18" />
                               </g>
                             )}

                             {/* Etiqueta Miniature */}
                             <g transform="translate(0, 25)">
                                <rect x="-35" y="0" width="70" height="18" rx="9" fill={isCurrent ? '#0f172a' : 'white'} className="shadow-2xl" />
                                <text fontSize="7" fontWeight="900" textAnchor="middle" y="12" fill={isCurrent ? 'white' : '#94a3b8'} className="uppercase tracking-[0.3em]">
                                   {point.label}
                                </text>
                             </g>
                          </motion.g>
                       </g>
                     );
                   })}

                   {/* 🚛 EL GALA MASTER MINI (Pocket Edition) */}
                   {currentEstado !== 'pendiente' && currentEstado !== 'recibido' && (
                     <motion.g 
                       initial={{ opacity: 0 }}
                       animate={{ 
                         opacity: 1,
                         offsetDistance: `${progressPercent}%` 
                       }}
                       style={{ 
                         offsetPath: "path('M 80 350 Q 150 350, 300 220 T 550 350 T 800 250 T 920 320')",
                         offsetRotate: "auto 0deg" 
                       }}
                       transition={{ duration: currentEstado === 'en_transito' ? 4 : 0, ease: "easeInOut" }}
                     >
                        <g transform="translate(-35, -30) scale(0.55)">
                           {/* Camión Largo y Detallado */}
                           <rect x="0" y="5" width="80" height="35" rx="2" fill="#1e293b" />
                           <rect x="5" y="10" width="70" height="25" fill="#334155" />
                           <text x="10" y="27" fontSize="9" fontWeight="900" fill="white" opacity="0.9" className="italic tracking-tighter">GALA MASTER</text>
                           
                           {/* Cabina */}
                           <g transform="translate(82, 0)">
                              <path d="M 0 10 L 20 10 L 30 25 L 30 40 L 0 40 Z" fill="#1d4ed8" />
                              <rect x="5" y="15" width="15" height="12" fill="#e0f2fe" opacity="0.7" rx="1" />
                           </g>

                           {/* 🎡 MINI RUEDAS ANIMADAS */}
                           <g fill="#111">
                              {[12, 22, 55, 65, 95, 105].map((cx, i) => (
                                <motion.g key={i} transform={`translate(${cx}, 45)`}>
                                   <motion.circle r="6" animate={currentEstado === 'en_transito' ? { rotate: 360 } : {}} transition={{ repeat: Infinity, duration: 0.4, ease: "linear" }} stroke="white" strokeWidth="1.5" strokeDasharray="3 3" />
                                   <circle r="2" fill="white" />
                                </motion.g>
                              ))}
                           </g>

                           {/* Smoke (Solo en RUTA) */}
                           {currentEstado === 'en_transito' && (
                             <motion.g opacity="0.6">
                                {[0, 1, 2].map((i) => (
                                  <motion.circle key={i} cx="-5" cy="15" r="4" fill="#94a3b8" animate={{ opacity: [0, 1, 0], x: [-5, -60], y: [15, -20], scale: [1, 4] }} transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.4 }} />
                                ))}
                             </motion.g>
                           )}
                        </g>
                     </motion.g>
                   )}
                </svg>
             </div>
          </div>

          {/* Tarjeta de Información Detallada */}
          <div className="p-12 pt-10 space-y-10 bg-white relative z-30">
             <div className="flex flex-col sm:flex-row gap-10 items-center justify-between p-10 bg-slate-50 rounded-[4rem] border border-slate-100 shadow-inner group">
                <div className="flex items-center gap-8">
                   <div className="p-8 bg-white rounded-[2.5rem] shadow-2xl text-indigo-600 ring-12 ring-slate-50">
                      <Truck className="w-10 h-10" />
                   </div>
                   <div>
                      <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-2">Unidad de Élite Gala</p>
                      <p className="text-xl font-black text-slate-900 uppercase italic leading-none">Master Truck #001</p>
                      <div className="flex items-center gap-3 mt-3">
                         <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                         <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                           {currentEstado === 'preparacion' ? 'Carga de Mercancía en Progreso' : 
                            currentEstado === 'en_transito' ? 'Transporte en Carretera Principal' : 'Supervisión Administrativa'}
                         </p>
                      </div>
                   </div>
                </div>
                <div className="flex flex-col items-center sm:items-end">
                   <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-2">Punto de Entrega Gala</p>
                   <p className="text-lg font-black text-slate-700 truncate max-w-[350px] border-b-4 border-emerald-100 italic">{activeOrder?.ubicacion_entrega || "Cargando..."}</p>
                </div>
             </div>

             <div className="flex justify-between items-center py-8 border-t border-slate-100">
                <div className="flex flex-col">
                   <p className="text-[12px] font-black text-indigo-500 uppercase tracking-[0.5em] mb-3">Inversión del Pedido</p>
                   <p className="text-5xl font-black text-slate-900 tracking-tighter italic">Q{activeOrder?.total || 0}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                   <p className="text-[12px] font-black text-emerald-500 uppercase tracking-[0.5em] mb-3">Fase de Logística</p>
                   <div className="flex items-center gap-5 bg-emerald-50 px-8 py-4 rounded-full border-2 border-emerald-100 shadow-xl">
                      <div className="w-4 h-4 rounded-full bg-emerald-500 animate-ping" />
                      <p className="text-3xl font-black text-emerald-950 uppercase italic tracking-tighter">
                         {steps[currentStepIndex]?.label}
                      </p>
                   </div>
                </div>
             </div>

             <button 
                onClick={() => setIsTrackingOpen(false)}
                className="group w-full py-8 bg-zinc-950 text-white rounded-[3rem] text-[15px] font-black uppercase tracking-[0.5em] shadow-[0_25px_60px_rgba(0,0,0,0.4)] hover:shadow-indigo-500/50 transition-all active:scale-95 flex items-center justify-center gap-6 relative overflow-hidden"
             >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                Regresar a la Boutique <ArrowRight className="w-7 h-7 group-hover:translate-x-4 transition-transform" />
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
