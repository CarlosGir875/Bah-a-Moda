"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Truck, ArrowRight, Zap } from "lucide-react";
import { useStore } from "@/lib/store";

export function PackageTrackerPremium() {
  const { isTrackingOpen, setIsTrackingOpen, userOrders } = useStore();
  
  const activeOrder = userOrders.find(o => o.estado !== 'cancelado' && o.estado !== 'listo_entrega') || userOrders[0];

  if (!isTrackingOpen) return null;

  // Coordenadas para una CARRETERA 100% RECTA (y=320)
  const steps = [
    { id: 'pendiente', label: 'ESPERA', progress: 5, building: 'hub', x: 80, y: 320 },
    { id: 'recibido', label: 'CONFIRMADO', progress: 28, building: 'hq', x: 240, y: 320 },
    { id: 'preparacion', label: 'EMPACANDO', progress: 52, building: 'warehouse', x: 400, y: 320 },
    { id: 'en_transito', label: 'EN RUTA', progress: 78, building: 'road', x: 580, y: 320 },
    { id: 'listo_entrega', label: 'ENTREGADO', progress: 95, building: 'home', x: 720, y: 320 }
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
          className="absolute inset-0 bg-slate-900/95 backdrop-blur-md"
          onClick={() => setIsTrackingOpen(false)}
        />
        
        {/* Modal Estilo Perfil */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-xl bg-slate-100 rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* Header Oscuro (Igual al Perfil) */}
          <div className="bg-[#0f172a] p-8 pb-12 relative">
             <div className="flex items-center justify-between">
                <div className="flex flex-col">
                   <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Red Logística Gala</span>
                   </div>
                   <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">Rastreo Activo</h2>
                </div>
                <button 
                  onClick={() => setIsTrackingOpen(false)}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all active:scale-90"
                >
                  <X className="w-6 h-6" />
                </button>
             </div>
             
             {/* Icono Flotante */}
             <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full p-1 shadow-2xl z-20">
                <div className="w-full h-full bg-slate-50 rounded-full flex items-center justify-center text-indigo-600 border border-slate-100">
                   <Truck className="w-10 h-10" />
                </div>
             </div>
          </div>

          <div className="p-6 pt-12 space-y-6">
             
             {/* 🗺️ MAPA 100% RECTO Y DETALLADO */}
             <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-200 relative h-[320px]">
                {/* Cielo vibrante */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#81d4fa] to-[#e1f5fe]" />
                
                <svg viewBox="0 0 800 400" className="w-full h-full overflow-visible relative z-10">
                   {/* Sol radiante */}
                   <circle cx="750" cy="50" r="25" fill="#fbc02d" opacity="0.8" />
                   <circle cx="750" cy="50" r="35" fill="#fbc02d" opacity="0.3" />

                   {/* SUELO VERDE VIBRANTE (Cero grises) */}
                   <rect x="0" y="320" width="800" height="80" fill="#4caf50" />
                   {/* Detalles del césped */}
                   <path d="M 0 320 Q 100 330 200 320 T 400 320 T 600 320 T 800 320" fill="none" stroke="#388e3c" strokeWidth="4" />

                   {/* CARRETERA 100% RECTA (Asfalto negro) */}
                   <rect x="40" y="320" width="720" height="20" fill="#212121" rx="4" />
                   {/* Línea amarilla punteada recta */}
                   <line x1="50" y1="330" x2="750" y2="330" stroke="#fbc02d" strokeWidth="2" strokeDasharray="10 10" />

                   {/* 🏢 EDIFICIOS (Apoyados exactamente en y=320) */}
                   {steps.map((point, idx) => {
                     const isCurrent = idx === currentStepIndex;
                     const isReached = idx <= currentStepIndex;
                     
                     return (
                       <g key={point.id} transform={`translate(${point.x}, ${point.y})`}>
                          <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: idx * 0.1 }}>
                             
                             {/* 1. HUB (Espera) */}
                             {point.building === 'hub' && (
                               <g transform="translate(-30, -90)">
                                  {/* Base sólida para no flotar */}
                                  <rect x="-5" y="85" width="70" height="5" fill="#455a64" />
                                  <rect width="60" height="85" fill="#37474f" />
                                  <rect x="5" y="5" width="50" height="75" fill="#263238" />
                                  {/* Servidores brillando */}
                                  <rect x="10" y="20" width="40" height="10" fill="#00e676" opacity={isCurrent ? 0.8 : 0.2} />
                                  <rect x="10" y="40" width="40" height="10" fill="#00e676" opacity={isCurrent ? 0.8 : 0.2} />
                                  {/* Antena en el techo */}
                                  <motion.circle cx="30" cy="-10" r="8" fill="#90a4ae" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} />
                                  
                                  {/* LETRERO EN EL EDIFICIO */}
                                  <g transform="translate(0, -35)">
                                    <rect width="60" height="20" fill={isCurrent ? '#000' : '#455a64'} rx="4" stroke={isCurrent ? '#00e676' : 'none'} strokeWidth="2"/>
                                    <text x="30" y="14" fontSize="10" fontWeight="900" fill="white" textAnchor="middle">ESPERA</text>
                                  </g>
                               </g>
                             )}

                             {/* 2. HQ (Confirmado) */}
                             {point.building === 'hq' && (
                               <g transform="translate(-25, -140)">
                                  {/* Base */}
                                  <rect x="-5" y="135" width="60" height="5" fill="#455a64" />
                                  {/* Torre de Cristal */}
                                  <rect width="50" height="135" fill="#0d47a1" />
                                  <rect x="5" y="5" width="40" height="125" fill="#1e88e5" opacity="0.6" />
                                  {/* Ventanas iluminadas si es current */}
                                  <rect x="10" y="20" width="30" height="90" fill="#bbdefb" opacity={isCurrent ? 0.8 : 0.3} />
                                  {/* Logo en techo */}
                                  <text x="25" y="15" fontSize="12" fontWeight="900" fill="white" textAnchor="middle">GALA</text>

                                  {/* LETRERO EN EL EDIFICIO */}
                                  <g transform="translate(-15, -30)">
                                    <rect width="80" height="20" fill={isCurrent ? '#000' : '#455a64'} rx="4" stroke={isCurrent ? '#2196f3' : 'none'} strokeWidth="2"/>
                                    <text x="40" y="14" fontSize="10" fontWeight="900" fill="white" textAnchor="middle">CONFIRMADO</text>
                                  </g>
                               </g>
                             )}

                             {/* 3. WAREHOUSE (Empacando) */}
                             {point.building === 'warehouse' && (
                               <g transform="translate(-45, -80)">
                                  {/* Base y zona de carga */}
                                  <rect x="-10" y="75" width="110" height="5" fill="#455a64" />
                                  {/* Edificio de fábrica */}
                                  <rect width="90" height="75" fill="#5d4037" />
                                  {/* Techos de sierra */}
                                  <path d="M 0 0 L 15 -15 L 30 0 L 45 -15 L 60 0 L 75 -15 L 90 0 Z" fill="#3e2723" />
                                  {/* Puertas de carga (Garage) */}
                                  <rect x="10" y="30" width="25" height="45" fill="#212121" />
                                  <rect x="55" y="30" width="25" height="45" fill="#212121" />
                                  {/* Cinta Transportadora y cajas */}
                                  {isCurrent && (
                                    <g transform="translate(10, 50)">
                                       <rect width="80" height="6" fill="#111" />
                                       {[0, 1, 2].map(i => (
                                          <motion.rect key={i} y="-10" width="10" height="10" fill="#fbc02d" initial={{ x: 0 }} animate={{ x: 60 }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.6 }} />
                                       ))}
                                    </g>
                                  )}
                                  
                                  {/* LETRERO EN EL EDIFICIO */}
                                  <g transform="translate(5, -40)">
                                    <rect width="80" height="20" fill={isCurrent ? '#000' : '#455a64'} rx="4" stroke={isCurrent ? '#ff9800' : 'none'} strokeWidth="2"/>
                                    <text x="40" y="14" fontSize="10" fontWeight="900" fill="white" textAnchor="middle">EMPACANDO</text>
                                  </g>
                               </g>
                             )}

                             {/* 4. EN RUTA (Arco de Peaje / Carretera) */}
                             {point.building === 'road' && (
                               <g transform="translate(-30, -60)">
                                  {/* Un arco sobre la carretera */}
                                  <rect x="0" y="0" width="10" height="60" fill="#455a64" />
                                  <rect x="50" y="0" width="10" height="60" fill="#455a64" />
                                  <rect x="0" y="0" width="60" height="15" fill="#263238" />
                                  {/* Luces verdes */}
                                  <circle cx="15" cy="7.5" r="3" fill="#00e676" opacity={isCurrent ? 1 : 0.3} />
                                  <circle cx="45" cy="7.5" r="3" fill="#00e676" opacity={isCurrent ? 1 : 0.3} />

                                  {/* LETRERO EN EL ARCO */}
                                  <g transform="translate(-5, -25)">
                                    <rect width="70" height="20" fill={isCurrent ? '#000' : '#455a64'} rx="4" stroke={isCurrent ? '#673ab7' : 'none'} strokeWidth="2"/>
                                    <text x="35" y="14" fontSize="10" fontWeight="900" fill="white" textAnchor="middle">EN RUTA</text>
                                  </g>
                               </g>
                             )}

                             {/* 5. HOME (Entregado - LA CASA BIEN HECHA) */}
                             {point.building === 'home' && (
                               <g transform="translate(-40, -80)">
                                  {/* Base y jardín */}
                                  <rect x="-10" y="75" width="100" height="5" fill="#455a64" />
                                  <rect x="-10" y="70" width="100" height="5" fill="#81c784" /> {/* Pasto propio */}
                                  
                                  {/* Estructura principal */}
                                  <rect x="10" y="30" width="60" height="45" fill="#eceff1" />
                                  {/* Techo a dos aguas (Pitched Roof) */}
                                  <path d="M 0 30 L 40 -10 L 80 30 Z" fill="#d32f2f" />
                                  {/* Chimenea con humo */}
                                  <rect x="55" y="-15" width="10" height="30" fill="#b71c1c" />
                                  {isCurrent && (
                                     <motion.circle cx="60" cy="-25" r="8" fill="white" opacity="0.6" animate={{ y: -20, scale: 2, opacity: 0 }} transition={{ repeat: Infinity, duration: 2 }} />
                                  )}
                                  {/* Puerta */}
                                  <rect x="30" y="45" width="20" height="30" fill="#5d4037" />
                                  {/* Ventanas */}
                                  <rect x="15" y="40" width="10" height="15" fill="#bbdefb" />
                                  <rect x="55" y="40" width="10" height="15" fill="#bbdefb" />

                                  {/* LETRERO EN EL TECHO */}
                                  <g transform="translate(0, -45)">
                                    <rect width="80" height="20" fill={isCurrent ? '#000' : '#455a64'} rx="4" stroke={isCurrent ? '#e91e63' : 'none'} strokeWidth="2"/>
                                    <text x="40" y="14" fontSize="10" fontWeight="900" fill="white" textAnchor="middle">ENTREGADO</text>
                                  </g>
                               </g>
                             )}
                          </motion.g>
                       </g>
                     );
                   })}

                   {/* 🚛 EL GALA MASTER TRUCK (Sobre la carretera plana) */}
                   {currentEstado !== 'pendiente' && currentEstado !== 'recibido' && (
                     <motion.g 
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1, x: steps[currentStepIndex].x }}
                       transition={{ duration: 1.5, ease: "easeInOut" }}
                     >
                        <g transform="translate(-40, 280)"> {/* Exactamente sobre la carretera */}
                           <rect width="70" height="35" fill="#111" rx="4" />
                           <rect x="72" y="10" width="20" height="25" fill="#2563eb" rx="4" />
                           <text x="10" y="22" fontSize="10" fontWeight="900" fill="white" className="italic">GALA</text>
                           {/* Ruedas */}
                           {[15, 30, 55, 80].map((cx, i) => (
                             <circle key={i} cx={cx} cy="35" r="6" fill="#424242" stroke="black" strokeWidth="2" />
                           ))}
                        </g>
                     </motion.g>
                   )}
                </svg>
             </div>

             {/* TARJETAS DE INFORMACIÓN (Idénticas al modal de perfil) */}
             <div className="bg-white rounded-[2rem] p-5 px-6 shadow-sm border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="p-4 bg-slate-50 rounded-2xl text-indigo-600">
                      <Truck className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Unidad Gala</p>
                      <p className="text-sm font-black text-slate-900 uppercase italic">Flota #001</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Destino</p>
                   <p className="text-xs font-bold text-slate-700 italic max-w-[140px] truncate">{activeOrder?.ubicacion_entrega || "En camino..."}</p>
                </div>
             </div>

             <div className="bg-white rounded-[2rem] p-5 px-6 shadow-sm border border-slate-200 flex items-center justify-between">
                <div className="flex flex-col">
                   <p className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-1">Inversión</p>
                   <p className="text-2xl font-black text-slate-900 italic tracking-tighter">Q{activeOrder?.total || 0}</p>
                </div>
                <div className="text-right">
                   <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-2">Estado Activo</p>
                   <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-lg font-black text-emerald-950 uppercase italic tracking-tighter">
                         {steps[currentStepIndex]?.label}
                      </p>
                   </div>
                </div>
             </div>

             <button 
                onClick={() => setIsTrackingOpen(false)}
                className="w-full py-5 bg-black text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-xl active:scale-95 flex items-center justify-center gap-3 transition-all"
             >
                Cerrar Ventana <ArrowRight className="w-4 h-4" />
             </button>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
