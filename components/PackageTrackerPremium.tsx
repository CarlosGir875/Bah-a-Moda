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
    { id: 'pendiente', label: 'Pendiente', progress: 10 },
    { id: 'recibido', label: 'Confirmado', progress: 30 },
    { id: 'preparacion', label: 'Empacando', progress: 55 },
    { id: 'en_transito', label: 'En Ruta', progress: 80 },
    { id: 'listo_entrega', label: 'Entregado', progress: 100 }
  ];

  let currentStepIndex = steps.findIndex(s => s.id === activeOrder?.estado);
  if (currentStepIndex === -1) currentStepIndex = 0;

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

          {/* THE LOGISTICS MAP EXPERIENCE 10.0 */}
          <div className="relative h-85 w-full flex items-center justify-center overflow-hidden bg-slate-50">
             {/* Isometric Grid Background */}
             <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(30deg, #444 12%, transparent 12.5%, transparent 87%, #444 87.5%, #444), linear-gradient(150deg, #444 12%, transparent 12.5%, transparent 87%, #444 87.5%, #444), linear-gradient(60deg, #999 25%, transparent 25.5%, transparent 75%, #999 75%, #999)', backgroundSize: '40px 70px' }} />

             <div className="relative w-full h-full p-4 sm:p-8">
                <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-2xl overflow-visible">
                   {/* THE LOGISTICS PATH (Isometric Line) */}
                   <motion.path 
                     id="deliveryPath"
                     d="M 50 220 L 120 180 L 200 220 L 280 180 L 350 220"
                     fill="none" 
                     stroke="#e2e8f0" 
                     strokeWidth="6" 
                     strokeLinecap="round" 
                     strokeLinejoin="round"
                   />
                   <motion.path 
                     d="M 50 220 L 120 180 L 200 220 L 280 180 L 350 220"
                     fill="none" 
                     stroke="url(#pathGradient)" 
                     strokeWidth="6" 
                     strokeLinecap="round" 
                     strokeLinejoin="round"
                     initial={{ pathLength: 0 }}
                     animate={{ pathLength: progressPercent / 100 }}
                     transition={{ duration: 1.5, ease: "easeInOut" }}
                   />
                   
                   <defs>
                     <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                       <stop offset="0%" stopColor="#fbbf24" />
                       <stop offset="50%" stopColor="#10b981" />
                       <stop offset="100%" stopColor="#4f46e5" />
                     </linearGradient>
                   </defs>

                   {/* MILESTONES (The 5 Hitos) */}
                   {[
                     { id: 'pendiente', x: 50, y: 220, label: 'Espera' },
                     { id: 'recibido', x: 120, y: 180, label: 'Aceptado' },
                     { id: 'preparacion', x: 200, y: 220, label: 'Empacando' },
                     { id: 'en_transito', x: 280, y: 180, label: 'En Ruta' },
                     { id: 'listo_entrega', x: 350, y: 220, label: 'Gala!' }
                   ].map((hito, idx) => {
                     const isReached = idx <= currentStepIndex;
                     const isCurrent = idx === currentStepIndex;
                     return (
                       <g key={hito.id} transform={`translate(${hito.x}, ${hito.y})`}>
                         {/* Pin Shadow */}
                         <circle cy="5" r="10" fill="black" opacity="0.05" />
                         {/* Pin Body */}
                         <motion.g
                           initial={{ y: -20, opacity: 0 }}
                           animate={{ y: 0, opacity: 1 }}
                           transition={{ delay: idx * 0.2 }}
                         >
                           <path d="M-10 -25 A10 10 0 1 1 10 -25 L0 0 Z" fill={isCurrent ? '#4f46e5' : isReached ? '#10b981' : '#cbd5e1'} />
                           <circle cx="0" cy="-25" r="7" fill="white" />
                           <g transform="translate(-5, -30) scale(0.3)" className={isCurrent ? 'text-indigo-600' : isReached ? 'text-emerald-600' : 'text-slate-400'}>
                             {hito.id === 'pendiente' && <Clock />}
                             {hito.id === 'recibido' && <CheckCircle2 />}
                             {hito.id === 'preparacion' && <Package />}
                             {hito.id === 'en_transito' && <Truck />}
                             {hito.id === 'listo_entrega' && <MapPin />}
                           </g>
                         </motion.g>
                         {/* Label */}
                         <text y="15" fontSize="6" fontWeight="900" textAnchor="middle" className="uppercase tracking-widest" fill={isCurrent ? '#1e293b' : '#94a3b8'}>
                           {hito.label}
                         </text>
                       </g>
                     );
                   })}

                   {/* THE REAL GALA TRUCK (Isometric Animation) */}
                   <motion.g 
                     initial={{ opacity: 0 }}
                     animate={{ 
                       opacity: 1,
                       offsetDistance: `${progressPercent}%` 
                     }}
                     style={{ 
                       offsetPath: "path('M 50 220 L 120 180 L 200 220 L 280 180 L 350 220')",
                       offsetRotate: "auto"
                     }}
                     transition={{ duration: 1.5, ease: "easeInOut" }}
                   >
                      <g transform="translate(-15, -25) scale(0.4)">
                         {/* Truck Chassis */}
                         <path d="M0 20 L40 0 L80 20 L40 40 Z" fill="#f59e0b" /> {/* Top Cargo */}
                         <path d="M0 20 L0 50 L40 70 L40 40 Z" fill="#d97706" /> {/* Left Side */}
                         <path d="M40 40 L40 70 L80 50 L80 20 Z" fill="#b45309" /> {/* Right Side */}
                         
                         {/* Cabin */}
                         <path d="M65 12 L95 27 L95 47 L65 32 Z" fill="#1e3a8a" /> {/* Blue Cabin Side */}
                         <path d="M65 12 L80 5 L110 20 L95 27 Z" fill="#1e40af" /> {/* Cabin Top */}
                         
                         {/* GALA Text on truck */}
                         <text x="10" y="45" fontSize="14" fontWeight="900" fill="white" transform="skewY(-20)" opacity="0.9">GALA</text>
                         
                         {/* Wheels */}
                         <circle cx="20" cy="65" r="8" fill="#111" />
                         <circle cx="60" cy="45" r="8" fill="#111" />
                      </g>
                   </motion.g>
                </svg>
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
                         {steps[currentStepIndex]?.label || 'Procesando'}
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
