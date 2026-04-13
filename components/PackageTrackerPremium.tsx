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

                {/* THE ISOMETRIC TRUCK ANIMATION */}
                <motion.div 
                  className="absolute top-1/2 -translate-y-[60px]"
                  animate={{ 
                    left: `${progressPercent}%`,
                    x: "-50%" 
                  }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                >
                  <div className="relative group">
                    {/* Truck Visual (Isometric SVG) */}
                    <svg width="60" height="60" viewBox="0 0 100 100" className="drop-shadow-2xl translate-z-0 transition-transform active:scale-110">
                       <motion.g 
                         animate={{ y: [0, -4, 0] }} 
                         transition={{ repeat: Infinity, duration: 0.6 }}
                       >
                          {/* Truck Body */}
                          <path d="M20 60 L60 60 L80 40 L40 40 Z" fill="#4f46e5" />
                          <path d="M60 60 L80 40 L80 60 L60 80 Z" fill="#4338ca" />
                          <path d="M20 60 L60 60 L60 80 L20 80 Z" fill="#6366f1" />
                          {/* Cabin */}
                          <path d="M60 40 L80 40 L90 50 L70 50 Z" fill="#818cf8" opacity="0.8" />
                          <rect x="70" y="50" width="20" height="20" fill="#312e81" />
                          {/* Wheels shadow */}
                          <circle cx="35" cy="80" r="6" fill="#1e1b4b" />
                          <circle cx="75" cy="80" r="6" fill="#1e1b4b" />
                       </motion.g>
                    </svg>
                    {/* Smoke Particles */}
                    <motion.div 
                      animate={{ 
                        opacity: [0, 1, 0],
                        x: [-20, -40],
                        y: [0, -10],
                        scale: [0.5, 1.2]
                      }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="absolute left-0 bottom-2 w-3 h-3 bg-slate-300/40 rounded-full blur-sm"
                    />
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
