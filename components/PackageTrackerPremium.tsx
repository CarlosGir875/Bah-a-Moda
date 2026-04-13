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
                                ? "0 0 20px rgba(16, 185, 129, 0.6)" 
                                : "0 0 0px rgba(0,0,0,0)"
                            }}
                            className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
                              isCompleted 
                                ? "bg-emerald-500 border-white" 
                                : "bg-white border-slate-100"
                            }`}
                          >
                             {isCompleted ? (
                               <CheckCircle2 className="w-4 h-4 text-white" />
                             ) : (
                               <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                             )}
                          </motion.div>
                          <span className={`absolute top-10 text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-colors ${isCompleted ? 'text-emerald-600' : 'text-slate-300'}`}>
                            {step.label}
                          </span>
                       </div>
                     );
                   })}
                </div>

                {/* DYNAMIC ROAD ENVIRONMENT */}
                <div className="absolute top-1/2 left-0 right-0 h-40 flex flex-col items-center justify-center -translate-y-1/2">
                    {/* The Asphalt Strip */}
                    <div className="w-[120%] h-3 bg-slate-800/10 rounded-full flex items-center overflow-hidden">
                       <motion.div 
                         animate={{ x: [0, -40] }}
                         transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
                         className="flex gap-8 px-4"
                       >
                         {[...Array(10)].map((_, i) => (
                           <div key={i} className="w-8 h-1 bg-white/40 rounded-full shrink-0" />
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

                    {/* Truck Entity (BM Master 3.0) */}
                    <motion.svg 
                      width="110" height="100" viewBox="0 0 100 90" 
                      className="drop-shadow-[0_25px_50px_rgba(0,0,0,0.25)] overflow-visible"
                      animate={{ 
                        y: [0, -6, 0],
                        rotate: [0, -1, 1, 0],
                        scaleY: [1, 0.98, 1.02, 1] // Squash & Stretch
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 0.5,
                        ease: "easeInOut"
                      }}
                    >
                       <defs>
                          <linearGradient id="masterBody" x1="0%" y1="0%" x2="100%" y2="100%">
                             <stop offset="0%" stopColor="#4f46e5" />
                             <stop offset="100%" stopColor="#312e81" />
                          </linearGradient>
                          <linearGradient id="chrome" x1="0%" y1="0%" x2="100%" y2="0%">
                             <stop offset="0%" stopColor="#94a3b8" />
                             <stop offset="50%" stopColor="#f8fafc" />
                             <stop offset="100%" stopColor="#94a3b8" />
                          </linearGradient>
                       </defs>

                       {/* Truck Container */}
                       <g transform="translate(0, 5)">
                          <rect x="2" y="10" width="70" height="52" rx="16" fill="url(#masterBody)" />
                          
                          {/* Metallic Detail */}
                          <rect x="5" y="15" width="64" height="2" rx="1" fill="white" opacity="0.15" />
                          <rect x="2" y="60" width="70" height="3" rx="1" fill="black" opacity="0.2" />

                          {/* BM BRANDING - GOLD STYLE */}
                          <text 
                             x="37" y="42" 
                             className="text-[20px] font-black italic fill-white"
                             textAnchor="middle"
                             style={{ letterSpacing: '0.05em', filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.4))' }}
                          >
                             BM
                          </text>
                          <text 
                             x="37" y="54" 
                             className="text-[5px] font-black uppercase fill-white/50"
                             textAnchor="middle"
                             style={{ letterSpacing: '0.4em' }}
                          >
                             Elite Experience
                          </text>
                       </g>
                       
                       {/* Cabin (High Detail) */}
                       <g transform="translate(0, 5)">
                          <path d="M72 62 L98 62 C101 62 103 60 103 57 L103 36 C103 26 92 20 78 20 L72 20 Z" fill="#1e1b4b" />
                          {/* Chrome Grill */}
                          <rect x="94" y="45" width="9" height="12" rx="2" fill="url(#chrome)" />
                          {/* Window with cloud reflections */}
                          <path d="M80 24 L95 24 C97 24 99 26 98 29 L88 56 C87 58 85 59 82 59 L72 59 L72 24 Z" fill="#0ea5e9" opacity="0.7" />
                          <path d="M82 28 Q88 28 92 34 L85 52 Q82 54 80 50 Z" fill="white" opacity="0.2" />
                          
                          {/* Headlight & Flare */}
                          <motion.circle 
                            cx="101" cy="54" r="5" 
                            fill="#fbbf24"
                            animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                          />
                       </g>

                       {/* Pro Wheels */}
                       <g transform="translate(0, 5)">
                          {/* Front */}
                          <motion.g animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.35, ease: "linear" }}>
                             <circle cx="88" cy="70" r="12" fill="#020617" />
                             <circle cx="88" cy="70" r="8" fill="url(#chrome)" />
                             <rect x="87" y="58" width="2" height="24" fill="#1e293b" />
                          </motion.g>
                          {/* Back */}
                          <motion.g animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.35, ease: "linear" }}>
                             <circle cx="28" cy="70" r="12" fill="#020617" />
                             <circle cx="28" cy="70" r="8" fill="url(#chrome)" />
                             <rect x="27" y="58" width="2" height="24" fill="#1e293b" />
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
