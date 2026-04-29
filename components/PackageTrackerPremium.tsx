"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Truck, Package, MapPin, CheckCircle2, Clock, Home, Building2, Warehouse, ArrowRight, Sun, Cloud, ShieldCheck, Zap } from "lucide-react";
import { useStore } from "@/lib/store";

export function PackageTrackerPremium() {
  const { isTrackingOpen, setIsTrackingOpen, userOrders } = useStore();
  
  const activeOrder = userOrders.find(o => o.estado !== 'cancelado' && o.estado !== 'listo_entrega') || userOrders[0];

  if (!isTrackingOpen) return null;

  // Gala Metropolis Coordinates (v19.0)
  const steps = [
    { id: 'pendiente', label: 'ESPERA', progress: 5, building: 'hub', x: 100, y: 300 },
    { id: 'recibido', label: 'CONFIRMADO', progress: 28, building: 'hq', x: 280, y: 280 },
    { id: 'preparacion', label: 'EMPACANDO', progress: 52, building: 'warehouse', x: 480, y: 300 },
    { id: 'en_transito', label: 'EN RUTA', progress: 78, building: 'road', x: 650, y: 280 },
    { id: 'listo_entrega', label: 'ENTREGADO', progress: 95, building: 'home', x: 760, y: 290 }
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
          className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          onClick={() => setIsTrackingOpen(false)}
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          className="relative w-full max-w-3xl bg-white rounded-[3.5rem] shadow-[0_60px_150px_rgba(0,0,0,0.8)] overflow-hidden border border-white/10"
        >
          {/* Header Ultra Premium */}
          <div className="p-10 pb-6 flex items-center justify-between bg-white relative z-40 border-b border-slate-50">
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                 <div className="px-3 py-1 bg-indigo-600 rounded-full">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">Metrópolis Gala v19.0</span>
                 </div>
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Bitácora Logística</h2>
            </div>
            <button onClick={() => setIsTrackingOpen(false)} className="p-4 bg-slate-50 hover:bg-slate-100 rounded-[2rem] text-slate-400 transition-all active:scale-90 shadow-sm">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* 🗺️ GALA METROPOLIS (The Masterpiece) */}
          <div className="relative h-[420px] w-full flex items-center justify-center overflow-hidden bg-[#b2ebf2]">
             {/* 🌲 PAISAJE 3D Y SUELO SÓLIDO */}
             <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 800 400" className="w-full h-full">
                   {/* Grass Plane */}
                   <path d="M 0 250 Q 400 200 800 250 L 800 400 L 0 400 Z" fill="#4caf50" />
                   <path d="M 0 320 Q 400 300 800 320 L 800 400 L 0 400 Z" fill="#388e3c" />
                   {/* Sky Details */}
                   <Sun className="w-20 h-20 text-amber-400 absolute right-12 top-10" />
                   <Cloud className="w-16 h-16 text-white absolute left-20 top-16 opacity-60" />
                   
                   {/* Arbolitos 3D */}
                   {[120, 320, 520, 720].map((x, i) => (
                     <g key={i} transform={`translate(${x}, ${240 + Math.random()*20})`}>
                        <ellipse cx="0" cy="5" rx="10" ry="4" fill="black" opacity="0.1" />
                        <rect x="-2" width="4" height="12" fill="#3e2723" />
                        <circle r="10" cy="-5" fill="#1b5e20" />
                     </g>
                   ))}
                </svg>
             </div>

             <div className="relative w-full h-full">
                <svg viewBox="0 0 800 400" className="w-full h-full overflow-visible drop-shadow-2xl">
                   
                   {/* 🏢 EDIFICIOS ISOMÉTRICOS 3D (Building Order: Back to Front) */}
                   {steps.map((point, idx) => {
                     const isReached = idx <= currentStepIndex;
                     const isCurrent = idx === currentStepIndex;
                     
                     return (
                       <g key={point.id} transform={`translate(${point.x}, ${point.y})`}>
                          <motion.g initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: idx * 0.1 }}>
                             {/* Shadow */}
                             <ellipse cx="10" cy="15" rx="35" ry="12" fill="black" opacity="0.1" />

                             {/* HUB (Espera) */}
                             {point.building === 'hub' && (
                               <g transform="translate(-20, -60)">
                                  {/* Cara Frontal */}
                                  <rect x="0" y="10" width="30" height="40" fill={isReached ? '#263238' : '#cfd8dc'} />
                                  {/* Cara Lateral (3D) */}
                                  <path d="M 30 10 L 40 0 L 40 40 L 30 50 Z" fill={isReached ? '#102027' : '#b0bec5'} />
                                  {/* Techo */}
                                  <path d="M 0 10 L 10 0 L 40 0 L 30 10 Z" fill={isReached ? '#37474f' : '#eceff1'} />
                                  {/* Ventanas */}
                                  <rect x="5" y="15" width="8" height="8" fill={isCurrent ? '#ffeb3b' : '#546e7a'} />
                                  <rect x="17" y="15" width="8" height="8" fill={isCurrent ? '#ffeb3b' : '#546e7a'} />
                               </g>
                             )}

                             {/* HQ (Confirmado) */}
                             {point.building === 'hq' && (
                               <g transform="translate(-15, -100)">
                                  <rect x="0" y="0" width="25" height="100" fill={isReached ? '#0d47a1' : '#cfd8dc'} />
                                  <path d="M 25 0 L 35 -10 L 35 90 L 25 100 Z" fill={isReached ? '#002171' : '#b0bec5'} />
                                  <path d="M 0 0 L 10 -10 L 35 -10 L 25 0 Z" fill={isReached ? '#1565c0' : '#eceff1'} />
                                  {/* Glass Reflection */}
                                  <rect x="3" y="10" width="19" height="80" fill="#bbdefb" opacity="0.4" />
                                  {isCurrent && (
                                    <motion.circle r="30" cx="12" cy="40" fill="#42a5f5" initial={{ scale: 0, opacity: 0.5 }} animate={{ scale: 2, opacity: 0 }} transition={{ repeat: Infinity, duration: 1.5 }} />
                                  )}
                               </g>
                             )}

                             {/* WAREHOUSE (Empacando) */}
                             {point.building === 'warehouse' && (
                               <g transform="translate(-30, -50)">
                                  {/* Parking Lot (The Detail!) */}
                                  <rect x="45" y="20" width="50" height="30" fill="#455a64" rx="2" />
                                  <rect x="50" y="25" width="40" height="2" fill="white" opacity="0.3" />
                                  
                                  {/* Edificio Warehouse */}
                                  <rect x="0" y="0" width="60" height="50" fill={isReached ? '#4e342e' : '#cfd8dc'} />
                                  <path d="M 60 0 L 75 -15 L 75 35 L 60 50 Z" fill={isReached ? '#2d1b10' : '#b0bec5'} />
                                  <path d="M 0 0 L 15 -15 L 75 -15 L 60 0 Z" fill={isReached ? '#5d4037' : '#eceff1'} />
                                  
                                  {/* Loading Dock Door */}
                                  <rect x="10" y="15" width="30" height="35" fill="#212121" />
                                  <rect x="12" y="17" width="26" height="4" fill="#424242" />
                                  <rect x="12" y="23" width="26" height="4" fill="#424242" />

                                  {/* Cinta Transportadora Dinámica */}
                                  {isCurrent && (
                                    <g transform="translate(40, 30)">
                                       <rect width="30" height="6" fill="#37474f" rx="3" />
                                       {[0, 1].map((p, i) => (
                                         <motion.g key={i} initial={{ x: 0, opacity: 0 }} animate={{ x: 30, opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.6 }}>
                                            <Package className="w-4 h-4 text-amber-500" y="-4" />
                                         </motion.g>
                                       ))}
                                    </g>
                                  )}
                               </g>
                             )}

                             {/* ROAD NODE (En Ruta) */}
                             {point.building === 'road' && (
                               <g transform="translate(-15, -30)">
                                  <rect x="0" y="0" width="30" height="15" fill={isReached ? '#283593' : '#cfd8dc'} rx="2" />
                                  <Truck className="w-5 h-5 text-white absolute" x="5" y="-5" />
                               </g>
                             )}

                             {/* HOME (Entregado) */}
                             {point.building === 'home' && (
                               <g transform="translate(-25, -60)">
                                  {/* Casa 3D Detallada */}
                                  <rect x="0" y="20" width="40" height="40" fill={isCurrent ? '#1b5e20' : '#cfd8dc'} />
                                  <path d="M 40 20 L 55 10 L 55 50 L 40 60 Z" fill={isCurrent ? '#144316' : '#b0bec5'} />
                                  <path d="M 0 20 L 20 0 L 40 20 Z" fill="#d32f2f" /> {/* Roof Front */}
                                  <path d="M 20 0 L 35 -10 L 55 10 L 40 20 Z" fill="#b71c1c" /> {/* Roof Side */}
                                  {/* Door and Windows */}
                                  <rect x="15" y="40" width="10" height="20" fill="#3e2723" />
                                  <rect x="5" y="28" width="8" height="8" fill="#e1f5fe" />
                               </g>
                             )}

                             {/* Label Metropolis Style */}
                             <g transform="translate(0, 35)">
                                <rect x="-40" y="0" width="80" height="18" rx="4" fill={isCurrent ? '#000' : '#fff'} className="shadow-2xl" />
                                <text fontSize="7" fontWeight="900" textAnchor="middle" y="12" fill={isCurrent ? '#fff' : '#94a3b8'} className="uppercase tracking-[0.2em]">
                                   {point.label}
                                </text>
                             </g>
                          </motion.g>
                       </g>
                     );
                   })}

                   {/* 🛣️ CARRETERA (Strictly in front of buildings) */}
                   <path 
                     d="M 50 340 Q 200 340, 300 320 T 500 340 T 700 320 T 800 330"
                     fill="none" stroke="#263238" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" 
                   />
                   <path 
                     d="M 50 340 Q 200 340, 300 320 T 500 340 T 700 320 T 800 330"
                     fill="none" stroke="#fbc02d" strokeWidth="1.5" strokeDasharray="8 16" strokeOpacity="0.6"
                   />

                   {/* 🚛 EL GALA MASTER (Lógica de Estacionamiento) */}
                   {currentEstado !== 'pendiente' && currentEstado !== 'recibido' && (
                     <motion.g 
                       initial={{ opacity: 0 }}
                       animate={currentEstado === 'preparacion' ? { 
                         opacity: 1, 
                         x: 520, y: 325, rotate: 0 
                       } : { 
                         opacity: 1,
                         offsetDistance: `${progressPercent}%` 
                       }}
                       style={currentEstado !== 'preparacion' ? { 
                         offsetPath: "path('M 50 340 Q 200 340, 300 320 T 500 340 T 700 320 T 800 330')",
                         offsetRotate: "auto 0deg" 
                       } : {}}
                       transition={{ duration: currentEstado === 'en_transito' ? 4 : 0.5 }}
                     >
                        <g transform="translate(-40, -35) scale(0.7)">
                           {/* Truck Body Detallado */}
                           <rect x="0" y="5" width="80" height="40" rx="2" fill="#263238" />
                           <rect x="5" y="10" width="70" height="30" fill="#37474f" />
                           <text x="15" y="30" fontSize="10" fontWeight="900" fill="white" opacity="0.9" className="italic tracking-tighter">GALA MASTER</text>
                           
                           {/* Cabina */}
                           <g transform="translate(82, 0)">
                              <path d="M 0 10 L 25 10 L 35 28 L 35 45 L 0 45 Z" fill="#1d4ed8" />
                              <rect x="5" y="15" width="18" height="15" fill="#e0f2fe" opacity="0.8" rx="2" />
                           </g>

                           {/* 🎡 RUEDAS 3D */}
                           <g fill="#111">
                              {[12, 25, 55, 68, 95, 108].map((cx, i) => (
                                <motion.g key={i} transform={`translate(${cx}, 50)`}>
                                   <motion.circle r="8" animate={currentEstado === 'en_transito' ? { rotate: 360 } : {}} transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }} stroke="white" strokeWidth="1.5" strokeDasharray="4 4" />
                                   <circle r="3" fill="white" />
                                </motion.g>
                              ))}
                           </g>

                           {/* Smoke FX */}
                           {currentEstado === 'en_transito' && (
                             <motion.g opacity="0.5">
                                {[0, 1].map((i) => (
                                  <motion.circle key={i} cx="-8" cy="20" r="5" fill="#94a3b8" animate={{ opacity: [0, 1, 0], x: [-10, -80], y: [20, -10], scale: [1, 5] }} transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.7 }} />
                                ))}
                             </motion.g>
                           )}
                        </g>
                     </motion.g>
                   )}
                </svg>
             </div>
          </div>

          {/* Info Card Metropolis */}
          <div className="p-10 pt-6 bg-white border-t border-slate-100">
             <div className="grid grid-cols-2 gap-6 p-8 bg-slate-50 rounded-[3rem] border border-slate-100 mb-8 relative overflow-hidden group">
                <div className="flex items-center gap-6">
                   <div className="p-5 bg-white rounded-3xl shadow-xl text-indigo-600 ring-8 ring-slate-100 group-hover:scale-110 transition-transform">
                      <Truck className="w-8 h-8" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gala Fleet</p>
                      <p className="text-lg font-black text-slate-900 uppercase italic leading-none">Master #001</p>
                      <div className="flex items-center gap-2 mt-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                         <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest">En Operación</span>
                      </div>
                   </div>
                </div>
                <div className="flex flex-col items-end justify-center border-l border-slate-200 pl-6">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Destino Gala</p>
                   <p className="text-sm font-black text-slate-700 italic border-b-2 border-emerald-100 max-w-full truncate">{activeOrder?.ubicacion_entrega || "Cargando..."}</p>
                </div>
             </div>

             <div className="flex justify-between items-center mb-8 px-4">
                <div className="flex flex-col">
                   <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em] mb-2">Total de Orden</p>
                   <p className="text-4xl font-black text-slate-900 italic tracking-tighter">Q{activeOrder?.total || 0}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] mb-2">Fase Actual</p>
                   <div className="flex items-center gap-4 bg-emerald-50 px-6 py-3 rounded-full border-2 border-emerald-100 shadow-lg">
                      <Zap className="w-4 h-4 text-emerald-500 animate-bounce" />
                      <p className="text-2xl font-black text-emerald-950 uppercase italic tracking-tighter leading-none">
                         {steps[currentStepIndex]?.label}
                      </p>
                   </div>
                </div>
             </div>

             <button 
                onClick={() => setIsTrackingOpen(false)}
                className="group w-full py-7 bg-zinc-950 text-white rounded-[2.5rem] text-[13px] font-black uppercase tracking-[0.5em] shadow-2xl hover:shadow-indigo-500/30 transition-all active:scale-95 flex items-center justify-center gap-5 relative overflow-hidden"
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
