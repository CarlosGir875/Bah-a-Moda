"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Truck, Package, MapPin, CheckCircle2, Clock, Home, Building2, Warehouse, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";

export function PackageTrackerPremium() {
  const { isTrackingOpen, setIsTrackingOpen, userOrders } = useStore();
  
  // Encontrar el pedido más reciente activo para mostrar el tracking
  const activeOrder = userOrders.find(o => o.estado !== 'cancelado' && o.estado !== 'listo_entrega') || userOrders[0];

  if (!isTrackingOpen) return null;

  const steps = [
    { id: 'pendiente', label: 'ESPERA', progress: 5 },
    { id: 'recibido', label: 'CONFIRMADO', progress: 25 },
    { id: 'preparacion', label: 'EMPACANDO', progress: 50 },
    { id: 'en_transito', label: 'EN RUTA', progress: 75 },
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
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={() => setIsTrackingOpen(false)}
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20"
        >
          {/* Header Superior Premium */}
          <div className="p-8 pb-4 flex items-center justify-between border-b border-slate-50 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Logística Gala Live</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Seguimiento Real</h2>
            </div>
            <button 
              onClick={() => setIsTrackingOpen(false)}
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-black transition-all active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* EL MUNDO ISOMÉTRICO GALA 12.0 (REDiseño Total) */}
          <div className="relative h-[450px] w-full flex items-center justify-center overflow-hidden bg-[#e2e8f0]">
             {/* Textura de Terreno Isométrica */}
             <div className="absolute inset-0 opacity-10" style={{ 
               backgroundImage: 'linear-gradient(30deg, #1e293b 12%, transparent 12.5%, transparent 87%, #1e293b 87.5%, #1e293b), linear-gradient(150deg, #1e293b 12%, transparent 12.5%, transparent 87%, #1e293b 87.5%, #1e293b)',
               backgroundSize: '80px 140px' 
             }} />
             
             <div className="relative w-full h-full">
                <svg viewBox="0 0 600 500" className="w-full h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-visible">
                   
                   {/* 🌊 RÍO ISOMÉTRICO (The River) */}
                   <path d="M -50 350 Q 100 300 200 400 T 400 350 T 650 450" fill="none" stroke="#60a5fa" strokeWidth="50" strokeOpacity="0.6" strokeLinecap="round" />
                   <path d="M -50 350 Q 100 300 200 400 T 400 350 T 650 450" fill="none" stroke="#93c5fd" strokeWidth="46" strokeOpacity="0.4" strokeLinecap="round" strokeDasharray="10 20" />

                   {/* 🛣️ CARRETERA PRINCIPAL (The Asphalt) */}
                   <path 
                     id="galaRoad"
                     d="M 80 380 L 180 250 L 300 350 L 420 220 L 520 320"
                     fill="none" stroke="#1e293b" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" 
                   />
                   <path 
                     d="M 80 380 L 180 250 L 300 350 L 420 220 L 520 320"
                     fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="8 12" strokeOpacity="0.5"
                   />

                   {/* 🌲 VEGETACIÓN Y DECORACIÓN */}
                   {[
                     {x: 120, y: 180}, {x: 250, y: 150}, {x: 400, y: 120}, 
                     {x: 50, y: 450}, {x: 350, y: 450}, {x: 550, y: 400}
                   ].map((t, i) => (
                     <g key={i} transform={`translate(${t.x}, ${t.y})`}>
                        <ellipse cx="0" cy="5" rx="12" ry="6" fill="black" opacity="0.1" />
                        <path d="M 0 -15 L 8 0 L -8 0 Z" fill="#166534" />
                        <path d="M 0 -22 L 6 -5 L -6 -5 Z" fill="#15803d" />
                     </g>
                   ))}

                   {/* 🏗️ EDIFICIOS ISOMÉTRICOS REALES */}
                   {[
                     { id: 'pendiente', x: 80, y: 380, label: 'ESPERA', type: 'factory' },
                     { id: 'recibido', x: 180, y: 250, label: 'CONFIRMADO', type: 'hq' },
                     { id: 'preparacion', x: 300, y: 350, label: 'EMPACANDO', type: 'warehouse' },
                     { id: 'en_transito', x: 420, y: 220, label: 'EN RUTA', type: 'station' },
                     { id: 'listo_entrega', x: 520, y: 320, label: 'ENTREGADO', type: 'mansion' }
                   ].map((point, idx) => {
                     const isReached = idx <= currentStepIndex;
                     const isCurrent = idx === currentStepIndex;
                     
                     return (
                       <g key={point.id} transform={`translate(${point.x}, ${point.y})`}>
                          <motion.g
                            initial={{ y: -60, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.1, type: "spring", stiffness: 120 }}
                          >
                             {/* Sombras de Edificios */}
                             <ellipse cx="0" cy="5" rx="30" ry="15" fill="black" opacity="0.05" />

                             {/* Lógica de Dibujo Isométrico por Tipo */}
                             {point.type === 'factory' && (
                               <g transform="translate(-25, -60)">
                                  <rect x="0" y="20" width="50" height="40" fill={isReached ? '#475569' : '#cbd5e1'} />
                                  <path d="M0 20 L12 0 L25 20 L37 0 L50 20 Z" fill={isReached ? '#334155' : '#94a3b8'} />
                                  <rect x="15" y="30" width="20" height="15" fill="white" opacity="0.2" />
                               </g>
                             )}
                             {point.type === 'hq' && (
                               <g transform="translate(-20, -90)">
                                  <rect x="0" y="0" width="40" height="90" fill={isReached ? '#1e3a8a' : '#cbd5e1'} />
                                  <rect x="5" y="5" width="30" height="80" fill="#93c5fd" opacity="0.3" />
                                  <rect x="5" y="5" width="30" height="2" fill="white" opacity="0.5" />
                               </g>
                             )}
                             {point.type === 'warehouse' && (
                               <g transform="translate(-30, -50)">
                                  <rect x="0" y="10" width="60" height="40" fill={isReached ? '#b45309' : '#cbd5e1'} />
                                  <path d="M 0 10 L 30 -5 L 60 10 Z" fill={isReached ? '#78350f' : '#94a3b8'} />
                                  <rect x="10" y="25" width="15" height="25" fill="#1e293b" />
                                  <rect x="35" y="25" width="15" height="25" fill="#1e293b" />
                               </g>
                             )}
                             {point.type === 'station' && (
                               <g transform="translate(-20, -40)">
                                  <rect x="-10" y="30" width="60" height="10" fill="#334155" />
                                  <rect x="0" y="0" width="40" height="30" fill={isReached ? '#4f46e5' : '#cbd5e1'} opacity="0.8" />
                                  <rect x="5" y="5" width="30" height="5" fill="white" opacity="0.5" />
                               </g>
                             )}
                             {point.type === 'mansion' && (
                               <g transform="translate(-25, -60)">
                                  <path d="M 0 20 L 25 0 L 50 20 L 50 60 L 0 60 Z" fill={isCurrent ? '#059669' : '#cbd5e1'} />
                                  <rect x="15" y="35" width="20" height="25" fill="#1e293b" />
                                  <rect x="5" y="25" width="10" height="10" fill="white" opacity="0.4" />
                                  <rect x="35" y="25" width="10" height="10" fill="white" opacity="0.4" />
                               </g>
                             )}

                             {/* Etiqueta de Estado */}
                             <g transform="translate(0, 20)">
                                <rect x="-40" y="0" width="80" height="18" rx="9" fill={isCurrent ? '#0f172a' : 'white'} className="shadow-xl" />
                                <text fontSize="8" fontWeight="900" textAnchor="middle" y="12" fill={isCurrent ? 'white' : '#94a3b8'} className="uppercase tracking-[0.2em]">
                                   {point.label}
                                </text>
                             </g>
                          </motion.g>
                       </g>
                     );
                   })}

                   {/* 🚛 EL NUEVO GALA MASTER TRUCK (Realista, Largo y 3D) */}
                   {activeOrder?.estado !== 'pendiente' && (
                     <motion.g 
                       initial={{ opacity: 0 }}
                       animate={{ 
                         opacity: 1,
                         offsetDistance: `${progressPercent}%` 
                       }}
                       style={{ 
                         offsetPath: "path('M 80 380 L 180 250 L 300 350 L 420 220 L 520 320')",
                         offsetRotate: "auto"
                       }}
                       transition={{ duration: 2.5, ease: "easeInOut" }}
                     >
                        <g transform="translate(-45, -40) scale(0.8)">
                           {/* Sombras del Camión */}
                           <rect x="5" y="45" width="110" height="10" rx="5" fill="black" opacity="0.1" />

                           {/* REMOLQUE (The Trailer) - Largo y con texturas */}
                           <rect x="0" y="5" width="85" height="40" rx="3" fill="#1e293b" />
                           <rect x="5" y="10" width="75" height="30" fill="#334155" />
                           <g opacity="0.1">
                              {[...Array(10)].map((_, i) => (
                                <line key={i} x1={10 + i*7} y1="12" x2={10 + i*7} y2="38" stroke="white" strokeWidth="1" />
                              ))}
                           </g>
                           <text x="12" y="28" fontSize="11" fontWeight="900" fill="white" opacity="0.8" className="italic tracking-tighter">GALA MASTER</text>
                           <text x="12" y="36" fontSize="5" fontWeight="900" fill="#fbbf24" opacity="0.6">BAHÍA MODA LOGISTICS</text>

                           {/* CABINA (The Truck Head) - Conectada y 3D */}
                           <g transform="translate(86, 0)">
                              <rect x="0" y="15" width="30" height="30" rx="4" fill="#1d4ed8" />
                              <rect x="18" y="20" width="12" height="15" fill="#93c5fd" opacity="0.6" rx="2" /> {/* Parabrisas */}
                              <rect x="25" y="38" width="8" height="4" fill="#fbbf24" rx="1" /> {/* Luz Frontal */}
                              <rect x="-2" y="25" width="4" height="10" fill="#0f172a" /> {/* Conexión */}
                           </g>

                           {/* RUEDAS (Ejes Reales) */}
                           <g fill="#111">
                              <circle cx="15" cy="45" r="7" />
                              <circle cx="28" cy="45" r="7" />
                              <circle cx="65" cy="45" r="7" />
                              <circle cx="78" cy="45" r="7" />
                              <circle cx="105" cy="45" r="8" />
                           </g>

                           {/* Efecto de Humo Animado */}
                           <motion.g opacity="0.4">
                              {[0, 1, 2].map((i) => (
                                <motion.circle 
                                  key={i}
                                  cx="-5" cy="15" r="4" fill="#94a3b8"
                                  animate={{ opacity: [0, 1, 0], x: [-10, -50], y: [15, -10], scale: [1, 4] }}
                                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.3 }}
                                />
                              ))}
                           </motion.g>
                        </g>
                     </motion.g>
                   )}
                </svg>
             </div>
          </div>

          {/* Tarjeta de Detalles Inferior */}
          <div className="p-8 pt-6 space-y-6 bg-white relative z-20">
             <div className="flex flex-col sm:flex-row gap-6 items-center justify-between p-7 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner">
                <div className="flex items-center gap-5">
                   <div className="p-5 bg-white rounded-2xl shadow-md text-indigo-600 ring-4 ring-slate-50">
                      <Truck className="w-7 h-7" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Unidad Gala Asignada</p>
                      <p className="text-sm font-black text-slate-900 uppercase italic">Master Truck #001 <span className="text-indigo-500">|</span> Bahía Express</p>
                   </div>
                </div>
                <div className="flex flex-col items-center sm:items-end">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ubicación de Entrega</p>
                   <p className="text-xs font-bold text-slate-700 truncate max-w-[250px] underline decoration-indigo-200 underline-offset-4">{activeOrder?.ubicacion_entrega || "Puerto San José"}</p>
                </div>
             </div>

             <div className="flex justify-between items-center py-6 border-t border-slate-100">
                <div className="flex flex-col">
                   <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-1">Total Pedido</p>
                   <p className="text-3xl font-black text-slate-900 tracking-tighter">Q{activeOrder?.total || 0}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                   <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-1">Estado de Entrega</p>
                   <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      <p className="text-xl font-black text-slate-900 uppercase italic leading-none">
                         {steps[currentStepIndex]?.label}
                      </p>
                   </div>
                </div>
             </div>

             <button 
                onClick={() => setIsTrackingOpen(false)}
                className="group w-full py-6 bg-black text-white rounded-[2rem] text-[12px] font-black uppercase tracking-[0.3em] shadow-2xl hover:shadow-indigo-300 transition-all active:scale-95 flex items-center justify-center gap-4 relative overflow-hidden"
             >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                Continuar Navegando <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
