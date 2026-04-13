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
                           
                           {/* SMART TYPOGRAPHY (Bugfix Final) */}
                           <div className="absolute top-12 flex flex-col items-center pointer-events-none">
                              <span className={`text-[11px] font-black uppercase tracking-[0.3em] whitespace-nowrap transition-all duration-700 ${
                                isCurrent ? 'text-emerald-500 scale-110 opacity-100' : 'text-slate-300 scale-90 opacity-0 md:opacity-40'
                              }`}>
                                {step.label}
                              </span>
                              {isCurrent && (
                                <motion.div 
                                  layoutId="activeStepIndicator"
                                  className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 shadow-[0_0_10px_#10b981]"
                                />
                              )}
                           </div>
                        </div>
                     );
                   })}
                </div>
                 {/* DYNAMIC ATMOSPHERE (5.0) */}
                 <div className="absolute top-1/2 left-0 right-0 h-80 flex flex-col items-center justify-center -translate-y-1/2 overflow-hidden pointer-events-none">
                     
                     {/* LUXURY CLOUDS */}
                     <div className="absolute top-4 w-[200%] flex justify-around opacity-20">
                        <motion.div 
                          animate={{ x: [0, -200] }}
                          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                          className="flex gap-64"
                        >
                           {[...Array(6)].map((_, i) => (
                             <div key={i} className="w-48 h-8 bg-indigo-200/40 rounded-full blur-3xl shrink-0" />
                           ))}
                        </motion.div>
                     </div>

                     {/* FAR MOUNTAINS (Slow Parallax) */}
                     <div className="absolute bottom-24 w-[150%] left-[-25%] flex justify-around opacity-25">
                        <motion.div 
                          animate={{ x: [0, -100] }}
                          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                          className="flex gap-40"
                        >
                           {[...Array(6)].map((_, i) => (
                             <svg key={i} width="400" height="200" viewBox="0 0 300 150" fill="none">
                               <path d="M0 150 L150 0 L300 150 Z" fill="#94a3b8" />
                               <path d="M120 150 L220 50 L300 150 Z" fill="#64748b" opacity="0.4" />
                             </svg>
                           ))}
                        </motion.div>
                     </div>

                     {/* NEAR FOREST (Fast Parallax) */}
                     <div className="absolute bottom-14 w-[250%] left-[-75%] flex justify-around opacity-40">
                        <motion.div 
                          animate={{ x: [0, -300] }}
                          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                          className="flex gap-24"
                        >
                           {[...Array(15)].map((_, i) => (
                             <svg key={i} width="50" height="100" viewBox="0 0 40 80" fill="none">
                               <path d="M20 0 L40 60 L0 60 Z" fill="#064e3b" />
                               <rect x="18" y="60" width="4" height="20" fill="#451a03" />
                             </svg>
                           ))}
                        </motion.div>
                     </div>

                     {/* The Ultra Asphalt 5.0 (Speed Blur) */}
                     <div className="w-[120%] h-5 bg-slate-900 rounded-full flex items-center overflow-hidden shadow-2xl border-y-2 border-white/5 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-slate-900 z-10" />
                        <motion.div 
                          animate={{ x: [0, -80] }}
                          transition={{ repeat: Infinity, duration: 0.25, ease: "linear" }}
                          className="flex gap-16 px-8"
                        >
                          {[...Array(20)].map((_, i) => (
                            <div key={i} className="w-12 h-1.5 bg-yellow-400/90 rounded-full shrink-0 shadow-[0_0_15px_#facc15]" />
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

                    {/* Truck Entity (Masterpiece 5.0 - Professional Cinematic) */}
                    <motion.svg 
                      width="140" height="120" viewBox="0 0 100 90" 
                      className="drop-shadow-[0_40px_80px_rgba(0,0,0,0.5)] overflow-visible"
                      animate={{ 
                        y: [0, -10, 0],
                        rotateX: [0, 4, -4, 0], // Advanced 3D Tilt
                        rotateY: [0, 1, -1, 0],
                        scaleY: [1, 0.96, 1.04, 1]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 0.35,
                        ease: "easeInOut"
                      }}
                    >
                       <defs>
                          <linearGradient id="masterBody" x1="0%" y1="0%" x2="100%" y2="100%">
                             <stop offset="0%" stopColor="#4f46e5" />
                             <stop offset="60%" stopColor="#312e81" />
                             <stop offset="100%" stopColor="#1e1b4b" />
                          </linearGradient>
                          <linearGradient id="chromeGloss" x1="0%" y1="0%" x2="0%" y2="100%">
                             <stop offset="0%" stopColor="#f8fafc" />
                             <stop offset="40%" stopColor="#94a3b8" />
                             <stop offset="100%" stopColor="#64748b" />
                          </linearGradient>
                          <linearGradient id="cabinGlass" x1="0%" y1="0%" x2="100%" y2="100%">
                             <stop offset="0%" stopColor="#38bdf8" />
                             <stop offset="50%" stopColor="#0ea5e9" />
                             <stop offset="100%" stopColor="#0369a1" />
                          </linearGradient>
                       </defs>

                       {/* CARGO CONTAINER (3D Perspective) */}
                       <g transform="translate(0, 5)">
                          {/* Main Body */}
                          <rect x="2" y="10" width="70" height="56" rx="16" fill="url(#masterBody)" />
                          <rect x="3" y="11" width="68" height="2" rx="1" fill="white" opacity="0.1" />
                          
                          {/* Side Ribs (Industrial Look) */}
                          <rect x="15" y="10" width="1" height="56" fill="black" opacity="0.15" />
                          <rect x="35" y="10" width="1" height="56" fill="black" opacity="0.15" />
                          <rect x="55" y="10" width="1" height="56" fill="black" opacity="0.15" />

                          {/* BM EMBLEM (Metallic Gold) */}
                          <g transform="translate(37, 38)">
                             <text className="text-[25px] font-black italic fill-white" textAnchor="middle" style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.4))' }}>BM</text>
                             <text y="14" className="text-[5px] font-bold fill-emerald-400" textAnchor="middle" style={{ letterSpacing: '0.4em' }}>BAHÍA ELITE</text>
                          </g>

                          {/* REAR CHROME STRIP */}
                          <rect x="2" y="62" width="70" height="4" rx="2" fill="url(#chromeGloss)" />
                       </g>
                       
                       {/* CABIN 5.0 (High Detail Cinematic) */}
                       <g transform="translate(0, 5)">
                          {/* Cabin Structure */}
                          <path d="M72 66 L100 66 C105 66 108 63 108 58 L108 34 C108 22 92 18 78 18 L72 18 Z" fill="#1e1b4b" />
                          
                          {/* Main Mirror */}
                          <rect x="70" y="30" width="6" height="12" rx="1" fill="url(#chromeGloss)" />
                          
                          {/* Front Grill (Mega Detail) */}
                          <rect x="98" y="42" width="10" height="20" rx="3" fill="url(#chromeGloss)" />
                          <rect x="100" y="45" width="6" height="1" fill="black" opacity="0.2" />
                          <rect x="100" y="48" width="6" height="1" fill="black" opacity="0.2" />
                          <rect x="100" y="51" width="6" height="1" fill="black" opacity="0.2" />
                          
                          {/* Glass Windshield + Realistic Reflection */}
                          <path d="M82 22 L98 22 C101 22 103 24 102 28 L90 62 C89 64 86 65 83 65 L72 65 L72 22 Z" fill="url(#cabinGlass)" opacity="0.7" />
                          <motion.path 
                             d="M84 26 Q92 26 95 35 L88 56 Q85 58 83 52 Z" 
                             fill="white" 
                             animate={{ opacity: [0.1, 0.4, 0.1], x: [-1, 1, -1] }}
                             transition={{ repeat: Infinity, duration: 4 }}
                          />

                          {/* Active Headlight + Volumetric Beam */}
                          <g transform="translate(104, 52)">
                             <circle r="6" fill="#fbbf24" style={{ filter: 'blur(2px)' }} />
                             <circle r="2" fill="white" />
                             <motion.path 
                               d="M0 0 L40 -15 L40 15 Z" 
                               fill="url(#headlightBeam)" 
                               animate={{ opacity: [0.1, 0.2, 0.1] }}
                               transition={{ repeat: Infinity, duration: 2 }}
                             />
                          </g>
                       </g>

                       <defs>
                          <linearGradient id="headlightBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                             <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
                             <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                          </linearGradient>
                       </defs>

                       {/* PRO WHEELS 5.0 (Realistic Motion) */}
                       <g transform="translate(0, 5)">
                          {/* Front */}
                          <motion.g animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.25, ease: "linear" }}>
                             <circle cx="90" cy="74" r="14" fill="#020617" />
                             <circle cx="90" cy="74" r="9" fill="url(#chromeGloss)" />
                             <circle cx="90" cy="74" r="3" fill="#1e1b4b" />
                          </motion.g>
                          {/* Back */}
                          <motion.g animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.25, ease: "linear" }}>
                             <circle cx="28" cy="74" r="14" fill="#020617" />
                             <circle cx="28" cy="74" r="9" fill="url(#chromeGloss)" />
                             <circle cx="28" cy="74" r="3" fill="#1e1b4b" />
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
