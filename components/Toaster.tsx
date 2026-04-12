"use client";

import { useStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export function Toaster() {
  const { toasts, removeToast } = useStore();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none w-full max-w-xs sm:max-w-sm">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="pointer-events-auto w-full"
          >
            <div className="bg-white/90 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden flex items-stretch">
              {/* Type Indicator Bar */}
              <div className={`w-2 transition-colors ${
                toast.type === 'success' ? 'bg-emerald-500' : 
                toast.type === 'error' ? 'bg-rose-500' : 'bg-indigo-500'
              }`} />
              
              <div className="flex-1 p-5 flex items-center gap-4">
                <div className={`p-2 rounded-2xl ${
                  toast.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 
                  toast.type === 'error' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'
                }`}>
                  {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
                  {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
                  {toast.type === 'info' && <Info className="w-5 h-5" />}
                </div>
                
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-0.5">
                    {toast.type === 'success' ? 'Éxito' : toast.type === 'error' ? 'Error' : 'Notificación'}
                  </p>
                  <p className="text-sm font-bold text-gray-900 leading-tight">
                    {toast.message}
                  </p>
                </div>

                <button 
                  onClick={() => removeToast(toast.id)}
                  className="p-1 text-gray-300 hover:text-gray-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
