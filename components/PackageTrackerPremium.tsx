"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Truck, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";

export function PackageTrackerPremium() {
  const { isTrackingOpen, setIsTrackingOpen, userOrders } = useStore();
  const [isVisible, setIsVisible] = useState(false);
  
  const activeOrder = userOrders.find(o => o.estado !== 'cancelado' && o.estado !== 'listo_entrega') || userOrders[0];

  useEffect(() => {
    if (isTrackingOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isTrackingOpen]);

  if (!isTrackingOpen && !isVisible) return null;

  // Coordenadas fijas para la carretera recta (y=220)
  const steps = [
    { id: 'pendiente', label: 'ESPERA', progress: 5, x: 80, y: 220, color: '#f59e0b' },
    { id: 'recibido', label: 'CONFIRMADO', progress: 28, x: 240, y: 220, color: '#3b82f6' },
    { id: 'preparacion', label: 'EMPACANDO', progress: 52, x: 400, y: 220, color: '#f97316' },
    { id: 'en_transito', label: 'EN RUTA', progress: 78, x: 560, y: 220, color: '#8b5cf6' },
    { id: 'listo_entrega', label: 'ENTREGADO', progress: 95, x: 720, y: 220, color: '#10b981' }
  ];

  let currentStepIndex = steps.findIndex(s => s.id === activeOrder?.estado);
  if (currentStepIndex === -1) currentStepIndex = 0;

  const progressPercent = steps[currentStepIndex]?.progress || 5;
  const currentEstado = activeOrder?.estado || 'pendiente';

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-500 overflow-hidden ${
        isTrackingOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsTrackingOpen(false)} />

      {/* MODAL IDÉNTICO AL PROFILE MODAL */}
      <div 
        className={`relative w-full max-w-[95%] md:max-w-xl max-h-[92vh] bg-slate-50/80 backdrop-blur-3xl rounded-[3rem] md:rounded-[4rem] shadow-[0_50px_150px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform flex flex-col border border-white/20 ${
          isTrackingOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-20 scale-95 opacity-0"
        }`}
      >
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          
          {/* HEADER OSCURO ESTILO PERFIL */}
          <div className="h-24 md:h-28 bg-slate-900 flex-shrink-0 relative">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <button 
              onClick={() => setIsTrackingOpen(false)}
              className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all border border-white/5 z-40"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ICONO CENTRAL ESTILO AVATAR */}
          <div className="relative -mt-12 md:-mt-14 mb-4 flex justify-center z-10">
            <div className="inline-flex items-center justify-center w-24 h-24 md:w-28 md:h-28 bg-white rounded-full border-[6px] border-slate-50 shadow-2xl overflow-hidden group relative">
               <div className="w-full h-full bg-slate-100 flex items-center justify-center text-indigo-600">
                  <Truck className="w-10 h-10 md:w-12 md:h-12" />
               </div>
            </div>
          </div>

          {/* CUERPO DEL MODAL */}
          <div className="px-5 md:px-12 pb-6 pt-2 text-center">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-zinc-900 mb-8 truncate">Rastreo Logístico</h2>

            {/* 🗺️ MAPA SUPER COLORIDO, CERO FLOTACIÓN, CARRETERA RECTA */}
            <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-200 relative h-[320px] mb-6">
              
              <svg viewBox="0 0 800 320" className="w-full h-full">
                {/* 1. CIELO VIBRANTE */}
                <rect x="0" y="0" width="800" height="220" fill="#bae6fd" />
                <circle cx="720" cy="50" r="30" fill="#facc15" />
                <path d="M 100 60 Q 120 40 140 60 Q 160 50 180 70 L 100 70 Z" fill="white" opacity="0.8" />
                <path d="M 500 80 Q 530 50 560 80 Q 590 60 620 90 L 500 90 Z" fill="white" opacity="0.6" />

                {/* 2. SUELO VERDE VIBRANTE (Comienza exactamente en y=220) */}
                <rect x="0" y="220" width="800" height="100" fill="#22c55e" />
                
                {/* 3. CARRETERA 100% RECTA (Apoyada en y=220) */}
                <rect x="20" y="220" width="760" height="24" fill="#1e293b" rx="4" />
                {/* Línea amarilla central recta */}
                <line x1="30" y1="232" x2="770" y2="232" stroke="#facc15" strokeWidth="2" strokeDasharray="15 15" />

                {/* 4. EDIFICIOS (Base exactamente en y=220 para cero flotación) */}
                {steps.map((point, idx) => {
                  const isCurrent = idx === currentStepIndex;
                  const isReached = idx <= currentStepIndex;
                  const bOpacity = isReached ? 1 : 0.4;
                  
                  return (
                    <g key={point.id} transform={`translate(${point.x}, 220)`} opacity={bOpacity}>
                       
                       {/* 🏢 HUB (Espera) */}
                       {point.id === 'pendiente' && (
                         <g transform="translate(-30, -70)">
                           <rect width="60" height="70" fill="#475569" />
                           <rect x="10" y="10" width="40" height="40" fill="#1e293b" />
                           {/* Antena */}
                           <circle cx="30" cy="-10" r="8" fill="#94a3b8" />
                           <line x1="30" y1="-2" x2="30" y2="0" stroke="#94a3b8" strokeWidth="2" />
                           {/* LETRERO GIGANTE INTEGRADO */}
                           <rect x="-10" y="-30" width="80" height="20" fill={isCurrent ? '#f59e0b' : '#334155'} rx="4" stroke="white" strokeWidth="2" />
                           <text x="30" y="-16" fontSize="11" fontWeight="900" fill="white" textAnchor="middle">ESPERA</text>
                         </g>
                       )}

                       {/* 🏢 HQ (Confirmado) */}
                       {point.id === 'recibido' && (
                         <g transform="translate(-25, -110)">
                           <rect width="50" height="110" fill="#2563eb" />
                           <rect x="5" y="5" width="40" height="100" fill="#60a5fa" opacity="0.5" />
                           {/* LETRERO GIGANTE INTEGRADO */}
                           <rect x="-20" y="-25" width="90" height="20" fill={isCurrent ? '#3b82f6' : '#334155'} rx="4" stroke="white" strokeWidth="2" />
                           <text x="25" y="-11" fontSize="11" fontWeight="900" fill="white" textAnchor="middle">CONFIRMADO</text>
                         </g>
                       )}

                       {/* 🏭 WAREHOUSE (Empacando) */}
                       {point.id === 'preparacion' && (
                         <g transform="translate(-40, -60)">
                           <rect width="80" height="60" fill="#854d0e" />
                           {/* Techos industriales */}
                           <path d="M 0 0 L 20 -15 L 40 0 L 60 -15 L 80 0 Z" fill="#713f12" />
                           {/* Muelles de carga */}
                           <rect x="10" y="20" width="20" height="40" fill="#1c1917" />
                           <rect x="50" y="20" width="20" height="40" fill="#1c1917" />
                           {/* LETRERO GIGANTE INTEGRADO */}
                           <rect x="0" y="-35" width="80" height="20" fill={isCurrent ? '#f97316' : '#334155'} rx="4" stroke="white" strokeWidth="2" />
                           <text x="40" y="-21" fontSize="11" fontWeight="900" fill="white" textAnchor="middle">EMPACANDO</text>
                         </g>
                       )}

                       {/* 🛣️ EN RUTA (Arco logístico) */}
                       {point.id === 'en_transito' && (
                         <g transform="translate(-30, -50)">
                           <rect width="10" height="50" fill="#64748b" />
                           <rect x="50" width="10" height="50" fill="#64748b" />
                           <rect width="60" height="15" fill="#334155" />
                           {/* LETRERO GIGANTE INTEGRADO */}
                           <rect x="-10" y="-20" width="80" height="20" fill={isCurrent ? '#8b5cf6' : '#334155'} rx="4" stroke="white" strokeWidth="2" />
                           <text x="30" y="-6" fontSize="11" fontWeight="900" fill="white" textAnchor="middle">EN RUTA</text>
                         </g>
                       )}

                       {/* 🏡 HOME (Entregado) */}
                       {point.id === 'listo_entrega' && (
                         <g transform="translate(-35, -50)">
                           {/* Casa principal */}
                           <rect x="10" y="15" width="50" height="35" fill="#f8fafc" />
                           {/* Techo a dos aguas ROJO */}
                           <path d="M 0 15 L 35 -15 L 70 15 Z" fill="#ef4444" />
                           {/* Puerta y ventana */}
                           <rect x="30" y="30" width="10" height="20" fill="#451a03" />
                           <rect x="15" y="25" width="10" height="10" fill="#38bdf8" />
                           {/* Chimenea */}
                           <rect x="45" y="-20" width="10" height="25" fill="#b91c1c" />
                           {/* LETRERO GIGANTE INTEGRADO */}
                           <rect x="-15" y="-45" width="100" height="20" fill={isCurrent ? '#10b981' : '#334155'} rx="4" stroke="white" strokeWidth="2" />
                           <text x="35" y="-31" fontSize="11" fontWeight="900" fill="white" textAnchor="middle">ENTREGADO</text>
                         </g>
                       )}
                    </g>
                  );
                })}

                {/* 🚛 CAMIÓN ANIMADO (Avanzando sobre la recta perfecta) */}
                {currentEstado !== 'pendiente' && currentEstado !== 'recibido' && (
                  <motion.g 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, x: steps[currentStepIndex].x }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  >
                     <g transform="translate(-30, 202)">
                        <rect width="60" height="28" fill="#0f172a" rx="4" />
                        <rect x="62" y="5" width="15" height="23" fill="#3b82f6" rx="4" />
                        <text x="10" y="18" fontSize="10" fontWeight="900" fill="white" className="italic">GALA</text>
                        <circle cx="15" cy="28" r="6" fill="#111" stroke="white" strokeWidth="1" />
                        <circle cx="45" cy="28" r="6" fill="#111" stroke="white" strokeWidth="1" />
                        <circle cx="70" cy="28" r="5" fill="#111" stroke="white" strokeWidth="1" />
                     </g>
                  </motion.g>
                )}
              </svg>
            </div>

            {/* TARJETAS DE INFORMACIÓN (Estilo Perfil) */}
            <div className="grid grid-cols-1 gap-3 mb-6">
               <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group overflow-hidden">
                  <div className="flex items-center gap-3">
                     <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                        <Truck className="w-5 h-5" />
                     </div>
                     <div className="text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Unidad de Flota</p>
                        <p className="text-sm font-black text-slate-900 uppercase italic leading-none">Gala Master #1</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Destino</p>
                     <p className="text-xs font-bold text-slate-700 italic max-w-[120px] truncate">{activeOrder?.ubicacion_entrega || "Cargando..."}</p>
                  </div>
               </div>

               <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="text-left flex flex-col">
                     <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-1">Monto de Orden</p>
                     <p className="text-2xl font-black text-slate-900 italic tracking-tighter leading-none">Q{activeOrder?.total || 0}</p>
                  </div>
                  <div className="flex flex-col items-end">
                     <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-1">Estado</p>
                     <span className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {steps[currentStepIndex]?.label}
                     </span>
                  </div>
               </div>
            </div>

          </div>

          {/* FOOTER DEL MODAL */}
          <div className="py-6 bg-slate-100/50 text-center border-t border-slate-200 mt-auto">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Red Logística Activa</p>
          </div>

        </div>
      </div>
    </div>
  );
}
