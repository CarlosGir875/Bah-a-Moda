"use client";

import { motion } from "framer-motion";
import { Package, Clock, Truck, Home, CheckCircle2 } from "lucide-react";

interface OrderTrackerProps {
  status: 'pendiente' | 'recibido' | 'preparacion' | 'en_transito' | 'listo_entrega' | 'cancelado';
  orderId?: string | null;
}

export function OrderTracker({ status, orderId }: OrderTrackerProps) {
  const steps = [
    { id: 'pendiente', label: 'Pendiente', icon: Clock, color: 'text-slate-400' },
    { id: 'recibido', label: 'Confirmado', icon: CheckCircle2, color: 'text-amber-500' },
    { id: 'preparacion', label: 'Preparación', icon: Package, color: 'text-blue-500' },
    { id: 'en_transito', label: 'En Camino', icon: Truck, color: 'text-indigo-500' },
    { id: 'listo_entrega', label: 'Entregado', icon: Home, color: 'text-green-500' }
  ];

  if (status === 'cancelado') {
    return (
      <div className="bg-red-50 border border-red-100 rounded-3xl p-6 text-center">
        <p className="text-red-600 font-black uppercase tracking-widest text-[10px]">El pedido ha sido cancelado</p>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex(s => s.id === status);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="space-y-8 py-6">
      <div className="flex justify-between items-center px-2">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Estado del Pedido</p>
          <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
            {steps[currentStepIndex]?.label || 'Procesando'}
          </h4>
        </div>
        {orderId && (
          <div className="bg-slate-900 text-white px-4 py-2 rounded-2xl shadow-lg">
             <p className="text-[8px] font-black uppercase tracking-widest opacity-50 mb-0.5 text-center">Código</p>
             <p className="text-sm font-black tracking-widest">#{orderId}</p>
          </div>
        )}
      </div>

      <div className="relative pt-8 pb-4">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full" />
        
        {/* Progress Line */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute top-1/2 left-0 h-1 bg-indigo-500 -translate-y-1/2 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
        />

        <div className="relative flex justify-between items-center">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            
            return (
              <div key={step.id} className="flex flex-col items-center gap-3">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.2 : 1,
                    backgroundColor: isCompleted ? '#ffffff' : '#f8fafc',
                    borderColor: isCurrent ? '#6366f1' : isCompleted ? '#e2e8f0' : '#f1f5f9'
                  }}
                  className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center shadow-sm relative z-10`}
                >
                  <step.icon className={`w-5 h-5 ${isCompleted ? step.color : 'text-slate-300'}`} />
                  {isCurrent && (
                    <motion.div 
                      layoutId="outline"
                      className="absolute inset-0 border-2 border-indigo-500 rounded-2xl"
                      initial={false}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}
                </motion.div>
                <span className={`text-[8px] font-black uppercase tracking-widest text-center max-w-[60px] ${isCompleted ? 'text-slate-900' : 'text-slate-300'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
