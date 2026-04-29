"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Truck, Package, MapPin, CheckCircle2, Clock, Home, Building2, Warehouse, ArrowRight, Sun, Cloud, ShieldCheck, Zap, Trees, Factory, Wind } from "lucide-react";
import { useStore } from "@/lib/store";

export function PackageTrackerPremium() {
  const { isTrackingOpen, setIsTrackingOpen, userOrders } = useStore();
  
  const activeOrder = userOrders.find(o => o.estado !== 'cancelado' && o.estado !== 'listo_entrega') || userOrders[0];

  if (!isTrackingOpen) return null;

  // Gala Industrial Empire Coordinates (v20.0)
  const steps = [
    { id: 'pendiente', label: 'ESPERA', progress: 5, building: 'hub', x: 80, y: 220 },
    { id: 'recibido', label: 'CONFIRMADO', progress: 28, building: 'hq', x: 250, y: 200 },
    { id: 'preparacion', label: 'EMPACANDO', progress: 52, building: 'warehouse', x: 430, y: 220 },
    { id: 'en_transito', label: 'EN RUTA', progress: 78, building: 'road', x: 580, y: 200 },
    { id: 'listo_entrega', label: 'ENTREGADO', progress: 95, building: 'home', x: 700, y: 210 }
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
        
        {/* Modal Compacto (Style Perfil) */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.6)] overflow-hidden border border-slate-100"
        >
          {/* Header Elegante */}
          <div className="p-8 pb-4 flex items-center justify-between bg-white relative z-30">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-1">Gala Logistics Live</span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Rastreo Gala</h2>
            </div>
            <button onClick={() => setIsTrackingOpen(false)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all active:scale-90 shadow-sm">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 🏙️ GALA INDUSTRIAL EMPIRE (v20.0) */}
          <div className="relative h-[340px] w-full flex items-center justify-center overflow-hidden bg-[#e0f7fa]">
             {/* PAISAJE DE FONDO */}
             <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 800 400" className="w-full h-full">
                   <Sun className="w-12 h-12 text-amber-400 absolute right-8 top-6" />
                   <Cloud className="w-10 h-10 text-white absolute left-12 top-10 opacity-40" />
                   {/* Colinas Lejanas */}
                   <path d="M 0 200 Q 200 120 400 200 T 800 200 L 800 400 L 0 400 Z" fill="#81c784" opacity="0.3" />
                </svg>
             </div>

             {/* SUELO SÓLIDO (Cimentación) */}
             <div className="absolute bottom-0 w-full h-[180px] bg-[#66bb6a]" />

             <div className="relative w-full h-full">
                <svg viewBox="0 0 800 400" className="w-full h-full overflow-visible">
                   
                   {/* 🏭 DETALLES INDUSTRIALES Y EDIFICIOS 3D */}
                   {steps.map((point, idx) => {
                     const isReached = idx <= currentStepIndex;
                     const isCurrent = idx === currentStepIndex;
                     
                     return (
                       <g key={point.id} transform={`translate(${point.x}, ${point.y})`}>
                          <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}>
                             {/* Sombras de Contacto */}
                             <ellipse cx="15" cy="15" rx="30" ry="10" fill="black" opacity="0.08" />

                             {/* EDIFICIOS 3D CON DETALLES */}
                             {point.building === 'hub' && (
                               <g transform="translate(-15, -50)">
                                  {/* Hub Edificio */}
                                  <rect width="30" height="40" fill={isReached ? '#263238' : '#cbd5e1'} rx="1" />
                                  <path d="M 30 0 L 40 -10 L 40 30 L 30 40 Z" fill={isReached ? '#102027' : '#94a3b8'} />
                                  <path d="M 0 0 L 10 -10 L 40 -10 L 30 0 Z" fill={isReached ? '#37474f' : '#f1f5f9'} />
                                  {/* Antena Parabólica */}
                                  <motion.g animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} transform="translate(15, -15)">
                                     <circle r="6" fill="#546e7a" />
                                     <rect x="-1" y="-8" width="2" height="8" fill="white" />
                                  </motion.g>
                               </g>
                             )}

                             {point.building === 'hq' && (
                               <g transform="translate(-12, -85)">
                                  <rect width="25" height="85" fill={isReached ? '#0d47a1' : '#cbd5e1'} rx="1" />
                                  <path d="M 25 0 L 35 -10 L 35 75 L 25 85 Z" fill={isReached ? '#002171' : '#94a3b8'} />
                                  <path d="M 0 0 L 10 -10 L 35 -10 L 25 0 Z" fill={isReached ? '#1565c0' : '#f1f5f9'} />
                                  {/* Ventanas con brillo */}
                                  <rect x="4" y="10" width="17" height="70" fill="#e3f2fd" opacity="0.4" />
                                  {/* Logo Mini */}
                                  <text x="5" y="-15" fontSize="6" fontWeight="900" fill={isCurrent ? '#000' : '#94a3b8'} className="italic">GALA</text>
                               </g>
                             )}

                             {point.building === 'warehouse' && (
                               <g transform="translate(-30, -45)">
                                  {/* Estacionamiento */}
                                  <rect x="45" y="15" width="40" height="25" fill="#455a64" rx="2" />
                                  <rect x="50" y="20" width="30" height="1" fill="white" opacity="0.3" />
                                  
                                  {/* Fábrica */}
                                  <rect width="50" height="40" fill={isReached ? '#4e342e' : '#cbd5e1'} />
                                  <path d="M 50 0 L 65 -15 L 65 25 L 50 40 Z" fill={isReached ? '#2d1b10' : '#94a3b8'} />
                                  <path d="M 0 0 L 15 -15 L 65 -15 L 50 0 Z" fill={isReached ? '#5d4037' : '#f1f5f9'} />
                                  
                                  {/* Chimenea con Humo */}
                                  <g transform="translate(10, -30)">
                                     <rect width="8" height="30" fill="#3e2723" />
                                     {isCurrent && (
                                       <motion.g>
                                          {[0,1,2].map(i => (
                                            <motion.circle key={i} r="4" fill="white" opacity="0.6" initial={{ y: 0, x: 4, opacity: 0 }} animate={{ y: -30, x: [4, 10, 4], opacity: [0, 0.8, 0], scale: [1, 3] }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.6 }} />
                                          ))}
                                       </motion.g>
                                     )}
                                  </g>
                                  
                                  {/* Cinta y Paquetes */}
                                  {isCurrent && (
                                    <g transform="translate(35, 25)">
                                       <rect width="25" height="4" fill="#1e293b" rx="2" />
                                       {[0,1].map(i => (
                                         <motion.rect key={i} width="4" height="4" fill="#fbbf24" initial={{ x: 0 }} animate={{ x: 25, opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.5 }} />
                                       ))}
                                    </g>
                                  )}
                               </g>
                             )}

                             {point.building === 'road' && (
                               <g transform="translate(-10, -25)">
                                  <circle r="12" fill={isReached ? '#311b92' : '#cbd5e1'} />
                                  <MapPin className="w-4 h-4 text-white absolute -translate-x-2 -translate-y-2" />
                               </g>
                             )}

                             {point.building === 'home' && (
                               <g transform="translate(-20, -50)">
                                  <path d="M 0 15 L 20 0 L 40 15 L 40 45 L 0 45 Z" fill={isCurrent ? '#1b5e20' : '#cbd5e1'} />
                                  <path d="M 20 0 L 35 -10 L 55 5 L 40 15 Z" fill="#c62828" />
                                  <rect x="15" y="30" width="10" height="15" fill="#3e2723" />
                                  <Home className="w-5 h-5 text-white absolute" x="12" y="10" />
                               </g>
                             )}

                             {/* Etiqueta Premium (Black & White) */}
                             <g transform="translate(15, 25)">
                                <rect x="-35" y="0" width="70" height="18" rx="4" fill={isCurrent ? '#000' : '#fff'} className="shadow-xl" />
                                <text fontSize="7" fontWeight="900" textAnchor="middle" y="12" fill={isCurrent ? '#fff' : '#94a3b8'} className="uppercase tracking-[0.2em]">
                                   {point.label}
                                </text>
                             </g>
                          </motion.g>
                       </g>
                     );
                   })}

                   {/* 🛣️ CARRETERA (Absolute Foreground) */}
                   <path 
                     d="M 50 250 Q 200 250, 300 230 T 430 250 T 580 230 T 750 240"
                     fill="none" stroke="#212121" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" 
                   />
                   <path 
                     d="M 50 250 Q 200 250, 300 230 T 430 250 T 580 230 T 750 240"
                     fill="none" stroke="#fbc02d" strokeWidth="1.5" strokeDasharray="8 16" strokeOpacity="0.5"
                   />

                   {/* 🚛 EL GALA MASTER (Lógica de Estacionamiento) */}
                   {currentEstado !== 'pendiente' && currentEstado !== 'recibido' && (
                     <motion.g 
                       initial={{ opacity: 0 }}
                       animate={currentEstado === 'preparacion' ? { 
                         opacity: 1, 
                         x: 480, y: 235, rotate: 0 
                       } : { 
                         opacity: 1,
                         offsetDistance: `${progressPercent}%` 
                       }}
                       style={currentEstado !== 'preparacion' ? { 
                         offsetPath: "path('M 50 250 Q 200 250, 300 230 T 430 250 T 580 230 T 750 240')",
                         offsetRotate: "auto 0deg" 
                       } : {}}
                       transition={{ duration: currentEstado === 'en_transito' ? 4 : 0.5 }}
                     >
                        <g transform="translate(-30, -25) scale(0.6)">
                           <rect width="60" height="30" fill="#263238" rx="2" />
                           <rect x="62" y="5" width="20" height="25" fill="#1d4ed8" rx="2" />
                           <text x="5" y="20" fontSize="8" fontWeight="900" fill="white" className="italic">GALA</text>
                           <g fill="#111">
                              {[10, 20, 45, 55, 75].map((cx, i) => (
                                <motion.circle key={i} cx={cx} cy="32" r="5" animate={currentEstado === 'en_transito' ? { rotate: 360 } : {}} transition={{ repeat: Infinity, duration: 0.4, ease: "linear" }} stroke="white" strokeWidth="1" />
                              ))}
                           </g>
                        </g>
                     </motion.g>
                   )}
                </svg>
             </div>
          </div>

          {/* Info Card Compacta (Style Perfil) */}
          <div className="p-8 pt-6 space-y-6 bg-white relative z-30">
             <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner group">
                <div className="flex items-center gap-5">
                   <div className="p-5 bg-white rounded-2xl shadow-xl text-indigo-600 ring-8 ring-slate-100 group-hover:scale-110 transition-transform">
                      <Truck className="w-7 h-7" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gala Master Truck</p>
                      <p className="text-lg font-black text-slate-900 uppercase italic leading-none">Unidad #001</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Punto de Entrega</p>
                   <p className="text-xs font-bold text-slate-700 italic border-b-2 border-emerald-100 max-w-[200px] truncate">{activeOrder?.ubicacion_entrega || "Cargando..."}</p>
                </div>
             </div>

             <div className="flex justify-between items-center mb-6 px-2">
                <div className="flex flex-col">
                   <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-1">Total Orden</p>
                   <p className="text-3xl font-black text-slate-900 italic tracking-tighter">Q{activeOrder?.total || 0}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                   <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-1">Fase Actual</p>
                   <div className="flex items-center gap-3 bg-emerald-50 px-5 py-2 rounded-full border border-emerald-100 shadow-md">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-xl font-black text-emerald-950 uppercase italic tracking-tighter leading-none">
                         {steps[currentStepIndex]?.label}
                      </p>
                   </div>
                </div>
             </div>

             <button 
                onClick={() => setIsTrackingOpen(false)}
                className="group w-full py-6 bg-black text-white rounded-[2rem] text-[12px] font-black uppercase tracking-[0.4em] shadow-2xl hover:shadow-indigo-500/30 transition-all active:scale-95 flex items-center justify-center gap-4 relative overflow-hidden"
             >
                Regresar a la Boutique <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
