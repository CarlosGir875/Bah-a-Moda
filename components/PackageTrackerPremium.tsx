"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Truck, Package, MapPin, CheckCircle2, Clock } from "lucide-react";
import { useStore } from "@/lib/store";

export function PackageTrackerPremium() {
  const { isTrackingOpen, setIsTrackingOpen, userOrders } = useStore();
  
  // Encontrar el pedido más reciente activo para mostrar el tracking
  const activeOrder = userOrders.find(o => o.estado !== 'cancelado' && o.estado !== 'listo_entrega') || userOrders[0];

  if (!isTrackingOpen) return null;

  const steps = [
    { id: 'recibido', label: 'Confirmado', icon: CheckCircle2, progress: 20 },
    { id: 'preparacion', label: 'En Inventario', icon: Package, progress: 45 },
    { id: 'en_transito', label: 'En Ruta', icon: Truck, progress: 75 },
    { id: 'listo_entrega', label: 'Entregado', icon: MapPin, progress: 100 }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === activeOrder?.estado) || 0;
  const progressPercent = steps[currentStepIndex]?.progress || 10;

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
          className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 pb-0 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Live Tracking</span>
              <h2 className="text-xl font-black text-slate-900">Seguimiento de Paquete</h2>
            </div>
            <button 
              onClick={() => setIsTrackingOpen(false)}
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-black transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* THE ISLAND EXPERIENCE */}
          <div className="relative h-80 flex items-center justify-center overflow-hidden">
             {/* Background Atmosphere */}
             <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-white" />
             
             {/* The Road / Path */}
             <div className="relative w-full px-24">
                <div className="h-1.5 w-full bg-slate-100 rounded-full relative overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${progressPercent}%` }}
                     transition={{ duration: 1.5, ease: "easeOut" }}
                     className="absolute h-full bg-gradient-to-r from-emerald-400 to-indigo-600 rounded-full"
                   />
                </div>
                
                {/* Steps Nodes (Neon Green Lights) */}
                <div className="absolute top-1/2 -translate-y-1/2 left-24 right-24 flex justify-between h-0">
                   {steps.map((step, idx) => {
                     const isCompleted = idx <= currentStepIndex;
                     const isCurrent = idx === currentStepIndex;
                     return (
                        <div key={idx} className="relative flex flex-col items-center">
                           {/* THE NEON LIGHT */}
                           <motion.div 
                             initial={{ scale: 0 }}
                             animate={{ 
                               scale: 1,
                               boxShadow: isCompleted 
                                 ? "0 0 25px rgba(16, 185, 129, 0.8)" 
                                 : "0 0 0px rgba(0,0,0,0)"
                             }}
                             className={`w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all duration-700 ${
                               isCompleted 
                                 ? "bg-emerald-500 border-white" 
                                 : "bg-white border-slate-100"
                             }`}
                           >
                              {isCompleted ? (
                                <CheckCircle2 className="w-5 h-5 text-white" />
                              ) : (
                                <div className="w-2 h-2 bg-slate-200 rounded-full" />
                              )}
                           </motion.div>
                           
                           {/* SMART TYPOGRAPHY (Bugfix) */}
                           <div className="absolute top-12 flex flex-col items-center pointer-events-none">
                              <span className={`text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-500 ${isCompleted ? 'text-emerald-600 scale-105' : 'text-slate-300 scale-100'} ${isCurrent ? 'opacity-100' : 'opacity-40 md:opacity-100'}`}>
                                {step.label}
                              </span>
                              {isCurrent && (
                                <motion.div 
                                  layoutId="activeStepIndicator"
                                  className="w-1 h-1 bg-emerald-500 rounded-full mt-1"
                                />
                              )}
                           </div>
                        </div>
                     );
                   })}
                </div>

                {/* DYNAMIC CINEMATIC ENVIRONMENT (Parallax) */}
                <div className="absolute top-1/2 left-0 right-0 h-64 flex flex-col items-center justify-center -translate-y-1/2 overflow-hidden pointer-events-none">
                    
                    {/* FAR MOUNTAINS (Slow Parallax) */}
                    <div className="absolute bottom-20 w-[150%] left-[-25%] flex justify-around opacity-30">
                       <motion.div 
                         animate={{ x: [0, -100] }}
                         transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                         className="flex gap-40"
                       >
                          {[...Array(6)].map((_, i) => (
                            <svg key={i} width="300" height="150" viewBox="0 0 300 150" fill="none">
                              <path d="M0 150 L150 0 L300 150 Z" fill="#94a3b8" />
                              <path d="M100 150 L200 50 L300 150 Z" fill="#64748b" opacity="0.5" />
                            </svg>
                          ))}
                       </motion.div>
                    </div>

                    {/* NEAR FOREST (Fast Parallax) */}
                    <div className="absolute bottom-12 w-[200%] left-[-50%] flex justify-around opacity-40">
                       <motion.div 
                         animate={{ x: [0, -200] }}
                         transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                         className="flex gap-24"
                       >
                          {[...Array(12)].map((_, i) => (
                            <svg key={i} width="40" height="80" viewBox="0 0 40 80" fill="none">
                              <path d="M20 0 L40 60 L0 60 Z" fill="#064e3b" />
                              <rect x="15" y="60" width="10" height="20" fill="#451a03" />
                            </svg>
                          ))}
                       </motion.div>
                    </div>

                    {/* The Asphalt Strip (Ultra Texture) */}
                    <div className="w-[120%] h-4 bg-slate-900 rounded-full flex items-center overflow-hidden shadow-inner border-y border-white/5">
                       <motion.div 
                         animate={{ x: [0, -60] }}
                         transition={{ repeat: Infinity, duration: 0.3, ease: "linear" }}
                         className="flex gap-12 px-6"
                       >
                         {[...Array(15)].map((_, i) => (
                           <div key={i} className="w-10 h-1.5 bg-yellow-400/80 rounded-full shrink-0 shadow-[0_0_10px_rgba(250,204,21,0.4)]" />
                         ))}
                       </motion.div>
                    </div>
                </div>

                {/* THE ULTRA TRUCK BM ELITE 3D */}
                <motion.div 
                  className="absolute top-1/2 -translate-y-[85px]"
                  animate={{ 
                    left: `${progressPercent}%`,
                    x: "-50%" 
                  }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                >
                  <div className="relative">
                    {/* Dynamic Ground Shadow */}
                    <motion.div 
                      className="absolute -bottom-2 -left-2 w-[110%] h-3 bg-black/10 blur-md rounded-full"
                      animate={{ 
                        scaleX: [1, 1.1, 1],
                        opacity: [0.15, 0.25, 0.15]
                      }}
                      transition={{ repeat: Infinity, duration: 0.4 }}
                    />

                    {/* Truck Entity (Master Realism 4.0) */}
                    <motion.svg 
                      width="120" height="110" viewBox="0 0 100 90" 
                      className="drop-shadow-[0_30px_60px_rgba(0,0,0,0.35)] overflow-visible"
                      animate={{ 
                        y: [0, -8, 0],
                        rotateX: [0, 2, -2, 0], // True 3D feel
                        scaleY: [1, 0.97, 1.03, 1]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 0.4,
                        ease: "easeInOut"
                      }}
                    >
                       <defs>
                          <linearGradient id="masterBody" x1="0%" y1="0%" x2="100%" y2="100%">
                             <stop offset="0%" stopColor="#4f46e5" />
                             <stop offset="70%" stopColor="#312e81" />
                             <stop offset="100%" stopColor="#1e1b4b" />
                          </linearGradient>
                          <linearGradient id="chrome" x1="0%" y1="0%" x2="100%" y2="0%">
                             <stop offset="0%" stopColor="#94a3b8" />
                             <stop offset="50%" stopColor="#f8fafc" />
                             <stop offset="100%" stopColor="#94a3b8" />
                          </linearGradient>
                          <linearGradient id="sunHeighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                             <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                             <stop offset="40%" stopColor="white" stopOpacity="0" />
                          </linearGradient>
                       </defs>

                       {/* TRUCK CONTAINER 4.0 */}
                       <g transform="translate(0, 5)">
                          <rect x="2" y="10" width="70" height="54" rx="16" fill="url(#masterBody)" />
                          
                          {/* Sun Highlight Reflection */}
                          <rect x="2" y="10" width="70" height="20" rx="14" fill="url(#sunHeighlight)" />
                          
                          {/* Side Guardbars */}
                          <rect x="5" y="15" width="64" height="2" rx="1" fill="white" opacity="0.1" />
                          <rect x="2" y="60" width="70" height="4" rx="2" fill="black" opacity="0.4" />

                          {/* BM BRANDING - LUXURY GOLD/WHITE */}
                          <g filter="drop-shadow(0 4px 8px rgba(0,0,0,0.5))">
                             <text x="37" y="44" className="text-[22px] font-black italic fill-white" textAnchor="middle" style={{ letterSpacing: '0.05em' }}>BM</text>
                             <text x="37" y="56" className="text-[4px] font-black uppercase fill-emerald-400" textAnchor="middle" style={{ letterSpacing: '0.5em' }}>PREMIUM DELIVERY</text>
                          </g>

                          {/* REAR PLATE */}
                          <rect x="2" y="55" width="12" height="6" rx="1" fill="#fde047" opacity="0.8" />
                          <text x="8" y="59.5" className="text-[3px] font-bold fill-black" textAnchor="middle">ELITE</text>
                       </g>
                       
                       {/* CABIN 4.0 (Enhanced Geometry and Reflections) */}
                       <g transform="translate(0, 5)">
                          <path d="M72 64 L98 64 C102 64 104 62 104 59 L104 36 C104 26 92 20 78 20 L72 20 Z" fill="#1e1b4b" />
                          
                          {/* Chrome Grill Detail */}
                          <rect x="96" y="44" width="8" height="14" rx="2" fill="url(#chrome)" />
                          <rect x="97" y="46" width="6" height="1" fill="black" opacity="0.1" />
                          <rect x="97" y="49" width="6" height="1" fill="black" opacity="0.1" />
                          
                          {/* Window + Reflections 4.0 */}
                          <path d="M80 24 L96 24 C99 24 101 26 100 29 L88 58 C87 60 85 61 82 61 L72 61 L72 24 Z" fill="#0ea5e9" opacity="0.6" />
                          <motion.path 
                            d="M82 28 Q90 28 94 36 L86 54 Q82 56 80 50 Z" 
                            fill="white" 
                            animate={{ opacity: [0.1, 0.3, 0.1], x: [-2, 2, -2] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                          />
                          
                          {/* Headlight Flare 4.0 */}
                          <motion.circle 
                            cx="102" cy="56" r="6" 
                            fill="#fbbf24"
                            animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.3, 1] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                          />
                          <circle cx="102" cy="56" r="2" fill="white" />
                       </g>

                       {/* PRO WHEELS (Enhanced Spinning) */}
                       <g transform="translate(0, 5)">
                          {/* Front */}
                          <motion.g animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.3, ease: "linear" }}>
                             <circle cx="88" cy="72" r="13" fill="#020617" />
                             <circle cx="88" cy="72" r="9" fill="url(#chrome)" />
                             <circle cx="88" cy="72" r="4" fill="#1e293b" />
                             <rect x="87" y="59" width="2" height="26" fill="#1e293b" opacity="0.3" />
                          </motion.g>
                          {/* Back */}
                          <motion.g animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.3, ease: "linear" }}>
                             <circle cx="28" cy="72" r="13" fill="#020617" />
                             <circle cx="28" cy="72" r="9" fill="url(#chrome)" />
                             <circle cx="28" cy="72" r="4" fill="#1e293b" />
                             <rect x="27" y="59" width="2" height="26" fill="#1e293b" opacity="0.3" />
                          </motion.g>
                       </g>
                    </motion.svg>

                    {/* Headlight Glow */}
                    <motion.div 
                       className="absolute right-[-40px] top-[45px] w-20 h-10 bg-yellow-400/20 blur-xl rounded-full"
                       animate={{ opacity: [0.2, 0.4, 0.2] }}
                       transition={{ repeat: Infinity, duration: 1 }}
                    />

                    {/* High-Fidelity Smoke Particles */}
                    <div className="absolute left-0 bottom-4">
                       {[0, 1, 2, 3].map((i) => (
                         <motion.div
                           key={i}
                           initial={{ opacity: 0, scale: 0 }}
                           animate={{ 
                             opacity: [0, 0.8, 0],
                             scale: [0.5, 2, 3],
                             x: [-15, -50],
                             y: [0, -25]
                           }}
                           transition={{ 
                             repeat: Infinity, 
                             duration: 1.2, 
                             delay: i * 0.3 
                           }}
                           className="absolute w-4 h-4 bg-slate-400/40 rounded-full blur-sm"
                         />
                       ))}
                    </div>
                  </div>
                </motion.div>
             </div>
          </div>

          {/* Details Card */}
          <div className="p-8 pt-0 space-y-6">
             <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                <div className="flex flex-col">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Repartidor Estimado</p>
                   <p className="text-sm font-bold text-slate-900">Bahía Logistics S.A.</p>
                </div>
                <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600">
                   <Truck className="w-5 h-5" />
                </div>
             </div>

             <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-center text-slate-300">Resumen de Entrega</h4>
                <div className="flex justify-between items-end">
                   <div className="text-left">
                      <p className="text-[9px] font-black text-indigo-500 uppercase mb-1">Factura</p>
                      <p className="text-lg font-black text-slate-900">Q{activeOrder?.total || 0}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-black text-emerald-500 uppercase mb-1">Estado</p>
                      <p className="text-sm font-black text-slate-900 uppercase italic underline underline-offset-4 decoration-emerald-400">
                         {activeOrder?.estado === 'en_transito' ? 'En Camino' : 'Preparando'}
                      </p>
                   </div>
                </div>
             </div>

             <button 
                onClick={() => setIsTrackingOpen(false)}
                className="w-full py-5 bg-black text-white rounded-[1.8rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-indigo-200 transition-all active:scale-95"
             >
                Cerrar Ventana
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
