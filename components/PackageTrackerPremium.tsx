"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Truck, Package, MapPin, CheckCircle2, Clock, Home, Building2, Warehouse, Trees } from "lucide-react";
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
          className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 pb-4 flex items-center justify-between border-b border-gray-50">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Gala Logistics World</span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Estado de Mi Pedido</h2>
            </div>
            <button 
              onClick={() => setIsTrackingOpen(false)}
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-black transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* THE ISOMETRIC EMPIRE 11.0 */}
          <div className="relative h-96 w-full flex items-center justify-center overflow-hidden bg-[#f0f4f8]">
             {/* Dynamic Watermark Background */}
             <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
             
             <div className="relative w-full h-full p-2 sm:p-6">
                <svg viewBox="0 0 500 400" className="w-full h-full drop-shadow-2xl overflow-visible">
                   {/* 🌊 THE RIVER (Puerto de Bahía) */}
                   <motion.path 
                     d="M -50 300 Q 150 250 250 350 T 550 300"
                     fill="none" stroke="#93c5fd" strokeWidth="40" strokeOpacity="0.4"
                     animate={{ strokeDashoffset: [0, -100] }}
                     transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                     strokeDasharray="20 10"
                   />
                   
                   {/* 🛣️ THE CARRETERA (The Path) */}
                   <path 
                     id="mainRoad"
                     d="M 60 300 L 150 200 L 250 280 L 350 180 L 440 260"
                     fill="none" stroke="#334155" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"
                   />
                   {/* Road Markings */}
                   <path 
                     d="M 60 300 L 150 200 L 250 280 L 350 180 L 440 260"
                     fill="none" stroke="white" strokeWidth="1" strokeDasharray="10 15" opacity="0.3"
                   />

                   {/* 🌳 LANDSCAPING (Trees & Scenery) */}
                   {[
                     {x: 80, y: 150}, {x: 200, y: 120}, {x: 400, y: 100}, 
                     {x: 100, y: 350}, {x: 300, y: 330}, {x: 450, y: 350}
                   ].map((t, i) => (
                     <g key={i} transform={`translate(${t.x}, ${t.y})`}>
                        <circle r="8" fill="#15803d" opacity="0.3" />
                        <path d="M 0 -12 L 6 0 L -6 0 Z" fill="#166534" />
                     </g>
                   ))}

                   {/* 🏗️ BUILDINGS (The 5 Milestones) */}
                   {[
                     { id: 'pendiente', x: 60, y: 300, label: 'ESPERA', building: 'sucursal' },
                     { id: 'recibido', x: 150, y: 200, label: 'CONFIRMADO', building: 'sede' },
                     { id: 'preparacion', x: 250, y: 280, label: 'EMPACANDO', building: 'almacen' },
                     { id: 'en_transito', x: 350, y: 180, label: 'EN RUTA', building: 'ruta' },
                     { id: 'listo_entrega', x: 440, y: 260, label: 'ENTREGADO', building: 'casa' }
                   ].map((milestone, idx) => {
                     const isReached = idx <= currentStepIndex;
                     const isCurrent = idx === currentStepIndex;
                     
                     return (
                       <g key={milestone.id} transform={`translate(${milestone.x}, ${milestone.y})`}>
                          {/* Shadow */}
                          <ellipse cx="0" cy="5" rx="20" ry="10" fill="black" opacity="0.05" />
                          
                          {/* Isometric Buildings */}
                          <motion.g
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.15, type: "spring", stiffness: 100 }}
                          >
                             {/* Building Graphics based on type */}
                             {milestone.building === 'sucursal' && (
                               <g transform="translate(-20, -50)">
                                 <rect x="0" y="10" width="40" height="40" fill={isReached ? '#475569' : '#cbd5e1'} rx="2" />
                                 <rect x="5" y="0" width="30" height="15" fill={isReached ? '#1e293b' : '#94a3b8'} rx="1" />
                                 <Clock className="w-5 h-5 text-white absolute" x="10" y="15" />
                               </g>
                             )}
                             {milestone.building === 'sede' && (
                               <g transform="translate(-15, -60)">
                                 <rect x="0" y="0" width="30" height="60" fill={isReached ? '#1e40af' : '#cbd5e1'} rx="2" />
                                 <rect x="5" y="5" width="20" height="50" fill="white" opacity="0.2" />
                                 <Building2 className="w-5 h-5 text-white absolute" x="5" y="10" />
                               </g>
                             )}
                             {milestone.building === 'almacen' && (
                               <g transform="translate(-25, -45)">
                                 <rect x="0" y="10" width="50" height="35" fill={isReached ? '#b45309' : '#cbd5e1'} rx="2" />
                                 <path d="M 0 10 L 25 0 L 50 10 Z" fill={isReached ? '#78350f' : '#94a3b8'} />
                                 <Warehouse className="w-6 h-6 text-white absolute" x="12" y="18" />
                               </g>
                             )}
                             {milestone.building === 'ruta' && (
                               <g transform="translate(-15, -40)">
                                 <circle r="15" fill={isCurrent ? '#4f46e5' : '#cbd5e1'} />
                                 <Truck className="w-5 h-5 text-white absolute" x="-10" y="-10" />
                               </g>
                             )}
                             {milestone.building === 'casa' && (
                               <g transform="translate(-20, -45)">
                                 <path d="M 0 15 L 20 0 L 40 15 L 40 45 L 0 45 Z" fill={isCurrent ? '#059669' : '#cbd5e1'} />
                                 <rect x="15" y="25" width="10" height="20" fill="white" opacity="0.3" />
                                 <Home className="w-6 h-6 text-white absolute" x="7" y="15" />
                               </g>
                             )}

                             {/* Label */}
                             <g transform="translate(0, 15)">
                               <rect x="-35" y="0" width="70" height="14" rx="7" fill={isCurrent ? 'black' : 'white'} className="shadow-sm" />
                               <text fontSize="7" fontWeight="900" textAnchor="middle" y="9" fill={isCurrent ? 'white' : '#94a3b8'} className="uppercase tracking-widest">
                                 {milestone.label}
                               </text>
                             </g>
                          </motion.g>
                       </g>
                     );
                   })}

                   {/* 🚛 THE MASTER TRUCK GALA (18 Wheeler) */}
                   {activeOrder?.estado !== 'pendiente' && (
                     <motion.g 
                       initial={{ opacity: 0 }}
                       animate={{ 
                         opacity: 1,
                         offsetDistance: `${progressPercent}%` 
                       }}
                       style={{ 
                         offsetPath: "path('M 60 300 L 150 200 L 250 280 L 350 180 L 440 260')",
                         offsetRotate: "auto"
                       }}
                       transition={{ duration: 2, ease: "easeInOut" }}
                     >
                        <g transform="translate(-30, -35) scale(0.6)">
                           {/* Long Trailer */}
                           <rect x="0" y="10" width="70" height="35" rx="2" fill="#1e293b" />
                           <rect x="5" y="15" width="60" height="25" fill="#334155" />
                           <text x="10" y="32" fontSize="10" fontWeight="900" fill="white" opacity="0.8" className="italic tracking-tighter">GALA MASTER</text>
                           
                           {/* Cabin (Truck Head) */}
                           <g transform="translate(72, 5)">
                              <rect x="0" y="5" width="25" height="35" rx="3" fill="#1d4ed8" />
                              <rect x="15" y="10" width="10" height="20" fill="#93c5fd" opacity="0.6" /> {/* Windshield */}
                              <rect x="0" y="40" width="25" height="5" fill="#0f172a" /> {/* Bumper */}
                           </g>

                           {/* 18 Wheels (Grouped for detail) */}
                           <g fill="#111">
                              <circle cx="10" cy="48" r="6" />
                              <circle cx="22" cy="48" r="6" />
                              <circle cx="50" cy="48" r="6" />
                              <circle cx="62" cy="48" r="6" />
                              <circle cx="85" cy="45" r="7" />
                           </g>

                           {/* Smoke Effect */}
                           <motion.g opacity="0.3">
                              {[0, 1, 2].map((i) => (
                                <motion.circle 
                                  key={i}
                                  cx="-5" cy="15" r="3" fill="#94a3b8"
                                  animate={{ opacity: [0, 1, 0], x: [-5, -30], y: [15, 0], scale: [1, 3] }}
                                  transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
                                />
                              ))}
                           </motion.g>
                        </g>
                     </motion.g>
                   )}
                </svg>
             </div>
          </div>

          {/* Details Card */}
          <div className="p-8 pt-6 space-y-6 bg-white">
             <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-4">
                   <div className="p-4 bg-white rounded-2xl shadow-sm text-indigo-600">
                      <Truck className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Unidad Gala Asignada</p>
                      <p className="text-sm font-black text-slate-900 uppercase">Master Truck #001 - Bahía Express</p>
                   </div>
                </div>
                <div className="flex flex-col items-center sm:items-end">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Destino</p>
                   <p className="text-xs font-bold text-slate-700 truncate max-w-[200px]">{activeOrder?.ubicacion_entrega || "Puerto San José"}</p>
                </div>
             </div>

             <div className="flex justify-between items-center py-4 border-t border-slate-100">
                <div>
                   <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-1">Total Pedido</p>
                   <p className="text-2xl font-black text-slate-900 tracking-tighter">Q{activeOrder?.total || 0}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1">Estado Real</p>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-lg font-black text-slate-900 uppercase italic">
                         {steps[currentStepIndex]?.label}
                      </p>
                   </div>
                </div>
             </div>

             <button 
                onClick={() => setIsTrackingOpen(false)}
                className="w-full py-5 bg-black text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl hover:shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-3"
             >
                Continuar Navegando <ArrowRight className="w-4 h-4" />
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}
