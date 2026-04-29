"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Truck, Package, MapPin, CheckCircle2, Clock, Home, Building2, Warehouse, ArrowRight, Sun, Cloud, ShieldCheck, Zap, Factory, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";

export function PackageTrackerPremium() {
  const { isTrackingOpen, setIsTrackingOpen, userOrders } = useStore();
  
  const activeOrder = userOrders.find(o => o.estado !== 'cancelado' && o.estado !== 'listo_entrega') || userOrders[0];

  if (!isTrackingOpen) return null;

  // Gala Standard Coordinates (v21.0 - Flat Ground)
  const steps = [
    { id: 'pendiente', label: 'ESPERA', progress: 5, building: 'hub', x: 80, y: 250 },
    { id: 'recibido', label: 'CONFIRMADO', progress: 28, building: 'hq', x: 250, y: 230 },
    { id: 'preparacion', label: 'EMPACANDO', progress: 52, building: 'warehouse', x: 450, y: 250 },
    { id: 'en_transito', label: 'EN RUTA', progress: 78, building: 'road', x: 620, y: 230 },
    { id: 'listo_entrega', label: 'ENTREGADO', progress: 95, building: 'home', x: 730, y: 240 }
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
          className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"
          onClick={() => setIsTrackingOpen(false)}
        />
        
        {/* MODAL ESTILO PERFIL (Compacto y Seccionado) */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          className="relative w-full max-w-lg bg-slate-50 rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20"
        >
          {/* Header Estilo Perfil (Azul Oscuro) */}
          <div className="bg-[#0f172a] p-8 pb-10 relative">
             <div className="flex items-center justify-between">
                <div className="flex flex-col">
                   <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Sistema de Flota Gala</span>
                   </div>
                   <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">Rastreo de Pedido</h2>
                </div>
                <button 
                  onClick={() => setIsTrackingOpen(false)}
                  className="p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all shadow-lg active:scale-90"
                >
                  <X className="w-6 h-6" />
                </button>
             </div>
             
             {/* Icono Central Circular (Igual al Avatar de Perfil) */}
             <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full p-1 shadow-2xl z-10">
                <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-indigo-600">
                   <Truck className="w-10 h-10" />
                </div>
             </div>
          </div>

          {/* Cuerpo del Modal Seccionado */}
          <div className="p-6 pt-12 space-y-6">
             
             {/* 🗺️ SECCIÓN MAPA (Tarjeta Blanca Redondeada) */}
             <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 relative h-[300px]">
                <div className="absolute inset-0 bg-gradient-to-b from-sky-100 to-emerald-50 opacity-50" />
                
                <svg viewBox="0 0 800 400" className="w-full h-full overflow-visible relative z-10">
                   {/* SUELO SÓLIDO Y PLANO (No más flotación) */}
                   <rect y="250" width="800" height="150" fill="#f8fafc" />
                   <rect y="250" width="800" height="4" fill="#e2e8f0" />
                   
                   {/* DECORACIÓN AMBIENTAL */}
                   <Sun className="w-12 h-12 text-amber-400 absolute right-10 top-10" />
                   {[100, 300, 500, 700].map((x, i) => (
                     <g key={i} transform={`translate(${x}, 240)`}>
                        <circle r="8" cy="-5" fill="#166534" />
                        <rect x="-1" width="2" height="6" fill="#3e2723" />
                     </g>
                   ))}

                   {/* EDIFICIOS 3D FULL DETALLE (Detrás de la carretera) */}
                   {steps.map((point, idx) => {
                     const isReached = idx <= currentStepIndex;
                     const isCurrent = idx === currentStepIndex;
                     
                     return (
                       <g key={point.id} transform={`translate(${point.x}, ${point.y})`}>
                          <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: idx * 0.1 }}>
                             {/* Sombras de Contacto reales */}
                             <ellipse cx="10" cy="5" rx="30" ry="8" fill="black" opacity="0.05" />

                             {/* HUB (Espera) - Detalle 3D */}
                             {point.building === 'hub' && (
                               <g transform="translate(-15, -45)">
                                  <rect width="30" height="45" fill={isReached ? '#334155' : '#cbd5e1'} />
                                  <path d="M 30 0 L 40 -10 L 40 35 L 30 45 Z" fill={isReached ? '#1e293b' : '#94a3b8'} />
                                  <path d="M 0 0 L 10 -10 L 40 -10 L 30 0 Z" fill={isReached ? '#475569' : '#f1f5f9'} />
                                  {/* Ventanitas */}
                                  <rect x="5" y="10" width="6" height="6" fill={isCurrent ? '#facc15' : '#1e293b'} opacity="0.8" />
                                  <rect x="18" y="10" width="6" height="6" fill={isCurrent ? '#facc15' : '#1e293b'} opacity="0.8" />
                               </g>
                             )}

                             {/* HQ (Confirmado) - Torre de Cristal */}
                             {point.building === 'hq' && (
                               <g transform="translate(-12, -90)">
                                  <rect width="24" height="90" fill={isReached ? '#1e3a8a' : '#cbd5e1'} />
                                  <path d="M 24 0 L 34 -10 L 34 80 L 24 90 Z" fill={isReached ? '#172554' : '#94a3b8'} />
                                  <path d="M 0 0 L 10 -10 L 34 -10 L 24 0 Z" fill={isReached ? '#2563eb' : '#f1f5f9'} />
                                  {/* Detalle GALA en el techo */}
                                  <text x="4" y="-2" fontSize="5" fontWeight="900" fill="white" opacity="0.5">GALA</text>
                               </g>
                             )}

                             {/* WAREHOUSE (Empacando) - Fábrica Real */}
                             {point.building === 'warehouse' && (
                               <g transform="translate(-30, -50)">
                                  <rect width="60" height="50" fill={isReached ? '#7c2d12' : '#cbd5e1'} />
                                  <path d="M 60 0 L 75 -15 L 75 35 L 60 50 Z" fill={isReached ? '#431407' : '#94a3b8'} />
                                  <path d="M 0 0 L 15 -15 L 75 -15 L 60 0 Z" fill={isReached ? '#9a3412' : '#f1f5f9'} />
                                  {/* Muelles y Chimenea */}
                                  <rect x="10" y="20" width="15" height="30" fill="#1e293b" />
                                  <rect x="35" y="20" width="15" height="30" fill="#1e293b" />
                                  <g transform="translate(10, -35)">
                                     <rect width="6" height="30" fill="#451a03" />
                                     {isCurrent && (
                                       <motion.g>
                                          {[0,1].map(i => (
                                            <motion.circle key={i} r="3" fill="#94a3b8" initial={{ y: 0, opacity: 0 }} animate={{ y: -40, x: [0, 10, 0], opacity: [0, 1, 0], scale: [1, 4] }} transition={{ repeat: Infinity, duration: 2, delay: i }} />
                                          ))}
                                       </motion.g>
                                     )}
                                  </g>
                                  {/* Carga de paquetes */}
                                  {isCurrent && (
                                    <g transform="translate(60, 30)">
                                       {[0,1,2].map(i => (
                                         <motion.rect key={i} width="5" height="5" fill="#fbbf24" initial={{ x: -10, opacity: 0 }} animate={{ x: 20, opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.5 }} />
                                       ))}
                                    </g>
                                  )}
                               </g>
                             )}

                             {/* ROAD (Marker) */}
                             {point.building === 'road' && (
                               <g transform="translate(-12, -30)">
                                  <circle r="12" fill={isReached ? '#4338ca' : '#cbd5e1'} />
                                  <MapPin className="w-5 h-5 text-white absolute -translate-x-2.5 -translate-y-2.5" />
                               </g>
                             )}

                             {/* HOME (Entregado) - Mansión Real */}
                             {point.building === 'home' && (
                               <g transform="translate(-25, -60)">
                                  <rect width="50" height="50" fill={isCurrent ? '#166534' : '#cbd5e1'} x="0" y="10" />
                                  <path d="M 50 10 L 65 -5 L 65 35 L 50 50 Z" fill={isCurrent ? '#052e16' : '#94a3b8'} />
                                  <path d="M 0 10 L 25 -15 L 50 10 Z" fill="#b91c1c" />
                                  <path d="M 25 -15 L 40 -30 L 65 -5 L 50 10 Z" fill="#991b1b" />
                                  {/* Puerta y Jardín */}
                                  <rect x="20" y="40" width="10" height="20" fill="#451a03" />
                                  <circle cx="-10" cy="55" r="5" fill="#fb7185" />
                                  <circle cx="60" cy="55" r="5" fill="#fb7185" />
                               </g>
                             )}

                             {/* ETIQUETA COMPACTA */}
                             <g transform="translate(10, 35)">
                                <rect x="-30" y="0" width="60" height="16" rx="8" fill={isCurrent ? '#000' : '#fff'} className="shadow-lg border border-slate-100" />
                                <text fontSize="6" fontWeight="900" textAnchor="middle" y="10" fill={isCurrent ? '#fff' : '#94a3b8'} className="uppercase tracking-[0.2em]">
                                   {point.label}
                                </text>
                             </g>
                          </motion.g>
                       </g>
                     );
                   })}

                   {/* 🛣️ CARRETERA (Abajo de los edificios) */}
                   <path 
                     d="M 50 310 Q 200 310, 300 290 T 450 310 T 620 290 T 780 300"
                     fill="none" stroke="#334155" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" 
                   />
                   <path 
                     d="M 50 310 Q 200 310, 300 290 T 450 310 T 620 290 T 780 300"
                     fill="none" stroke="#facc15" strokeWidth="1" strokeDasharray="6 12" strokeOpacity="0.6"
                   />

                   {/* 🚛 GALA MASTER v21.0 */}
                   {currentEstado !== 'pendiente' && currentEstado !== 'recibido' && (
                     <motion.g 
                       initial={{ opacity: 0 }}
                       animate={{ 
                         opacity: 1,
                         offsetDistance: `${progressPercent}%` 
                       }}
                       style={{ 
                         offsetPath: "path('M 50 310 Q 200 310, 300 290 T 450 310 T 620 290 T 780 300')",
                         offsetRotate: "auto 0deg" 
                       }}
                       transition={{ duration: currentEstado === 'en_transito' ? 3 : 0, ease: "easeInOut" }}
                     >
                        <g transform="translate(-30, -25) scale(0.65)">
                           <rect width="60" height="32" fill="#1e293b" rx="2" />
                           <rect x="62" y="8" width="22" height="24" fill="#2563eb" rx="2" />
                           <text x="5" y="20" fontSize="8" fontWeight="900" fill="white" opacity="0.8" className="italic tracking-tighter">GALA</text>
                           <g fill="#111">
                              {[10, 20, 45, 55, 75].map((cx, i) => (
                                <motion.circle key={i} cx={cx} cy="34" r="5" animate={currentEstado === 'en_transito' ? { rotate: 360 } : {}} transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }} stroke="white" strokeWidth="1" />
                              ))}
                           </g>
                        </g>
                     </motion.g>
                   )}
                </svg>
             </div>

             {/* 📦 SECCIÓN INFO (Tarjeta Blanca Redondeada) */}
             <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex items-center justify-between group">
                <div className="flex items-center gap-5">
                   <div className="p-5 bg-slate-50 rounded-2xl text-indigo-600 group-hover:scale-110 transition-transform">
                      <Truck className="w-8 h-8" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Unidad Gala Master</p>
                      <p className="text-xl font-black text-slate-900 uppercase italic leading-none">Flota #001</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Destino Gala</p>
                   <p className="text-sm font-black text-slate-700 italic border-b-2 border-emerald-100 max-w-[150px] truncate">{activeOrder?.ubicacion_entrega || "En camino..."}</p>
                </div>
             </div>

             {/* 💰 SECCIÓN RESUMEN (Tarjeta Blanca Redondeada) */}
             <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                <div className="flex flex-col">
                   <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em] mb-1">Monto Invertido</p>
                   <p className="text-4xl font-black text-slate-900 italic tracking-tighter leading-none">Q{activeOrder?.total || 0}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] mb-2">Estado Actual</p>
                   <div className="flex items-center gap-3 bg-emerald-50 px-5 py-2.5 rounded-full border border-emerald-100">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <p className="text-2xl font-black text-emerald-950 uppercase italic tracking-tighter leading-none">
                         {steps[currentStepIndex]?.label}
                      </p>
                   </div>
                </div>
             </div>

             {/* Botón Final */}
             <button 
                onClick={() => setIsTrackingOpen(false)}
                className="group w-full py-7 bg-zinc-950 text-white rounded-[2.2rem] text-[13px] font-black uppercase tracking-[0.4em] shadow-2xl hover:shadow-indigo-500/30 transition-all active:scale-95 flex items-center justify-center gap-5 relative overflow-hidden"
             >
                Regresar a la Boutique <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" />
             </button>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
