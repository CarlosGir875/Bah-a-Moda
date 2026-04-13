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
             <div className="relative w-full px-12">
                <div className="h-1.5 w-full bg-slate-100 rounded-full relative overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${progressPercent}%` }}
                     transition={{ duration: 1.5, ease: "easeOut" }}
                     className="absolute h-full bg-gradient-to-r from-emerald-400 to-indigo-600 rounded-full"
                   />
                </div>
                
                {/* Steps Nodes */}
                <div className="absolute top-1/2 -translate-y-1/2 left-12 right-12 flex justify-between h-0">
                   {steps.map((step, idx) => (
                     <div key={idx} className="relative flex flex-col items-center">
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1 * idx }}
                          className={`w-6 h-6 rounded-full border-4 ${idx <= currentStepIndex ? 'bg-indigo-600 border-white shadow-lg' : 'bg-white border-slate-100'} z-10`}
                        />
                        <span className={`absolute top-8 text-[8px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${idx <= currentStepIndex ? 'text-indigo-600' : 'text-slate-300'}`}>
                          {step.label}
                        </span>
                     </div>
                   ))}
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

                    {/* Truck Entity (Semi-Isometric Design) */}
                    <motion.svg 
                      width="100" height="90" viewBox="0 0 100 90" 
                      className="drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] overflow-visible"
                      animate={{ 
                        y: [0, -5, 0],
                        rotate: [0, -1.5, 1.5, 0]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 0.45,
                        ease: "linear"
                      }}
                    >
                       <defs>
                          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                             <stop offset="0%" stopColor="#6366f1" />
                             <stop offset="100%" stopColor="#4338ca" />
                          </linearGradient>
                          <linearGradient id="cabinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                             <stop offset="0%" stopColor="#4338ca" />
                             <stop offset="100%" stopColor="#312e81" />
                          </linearGradient>
                       </defs>

                       {/* Truck Body (Cargo Container) */}
                       <g>
                          <rect x="2" y="10" width="70" height="50" rx="14" fill="url(#bodyGradient)" />
                          {/* Shading/Highlights */}
                          <rect x="2" y="10" width="70" height="2" rx="1" fill="white" opacity="0.2" />
                          <rect x="2" y="58" width="70" height="2" rx="1" fill="black" opacity="0.1" />
                          
                          {/* BM BRANDING LOGO */}
                          <text 
                             x="37" y="42" 
                             className="text-[18px] font-black italic fill-white selection:bg-transparent"
                             textAnchor="middle"
                             style={{ letterSpacing: '0.1em', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                          >
                             BM
                          </text>
                          <text 
                             x="37" y="52" 
                             className="text-[6px] font-black uppercase fill-white/60"
                             textAnchor="middle"
                             style={{ letterSpacing: '0.3em' }}
                          >
                             Elite Delivery
                          </text>
                       </g>
                       
                       {/* Cabin (Isometric Front) */}
                       <g>
                          <path d="M72 60 L98 60 C100 60 102 58 102 55 L102 38 C102 28 92 22 78 22 L72 22 Z" fill="url(#cabinGradient)" />
                          {/* Window */}
                          <path d="M80 26 L95 26 C98 26 100 28 98 32 L88 54 C87 56 85 57 82 57 L72 57 L72 26 Z" fill="#93c5fd" opacity="0.8" />
                          {/* Window Shine */}
                          <rect x="80" y="30" width="4" height="20" fill="white" opacity="0.4" transform="rotate(15 82 40)" />
                          
                          {/* Active Headlight Beam */}
                          <motion.circle 
                            cx="100" cy="52" r="5" 
                            fill="#fde047"
                            animate={{ opacity: [0.8, 1, 0.8], scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                          />
                       </g>

                       {/* Ultra-Detailed Spinning Wheels */}
                       <g>
                          {/* Front */}
                          <motion.g animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.4, ease: "linear" }}>
                             <circle cx="88" cy="68" r="11" fill="#111827" />
                             <circle cx="88" cy="68" r="7" fill="#334155" />
                             <rect x="87" y="57" width="2" height="22" fill="#64748b" />
                             <rect x="77" y="67" width="22" height="2" fill="#64748b" />
                          </motion.g>
                          {/* Back */}
                          <motion.g animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.4, ease: "linear" }}>
                             <circle cx="28" cy="68" r="11" fill="#111827" />
                             <circle cx="28" cy="68" r="7" fill="#334155" />
                             <rect x="27" y="57" width="2" height="22" fill="#64748b" />
                             <rect x="17" y="67" width="22" height="2" fill="#64748b" />
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
