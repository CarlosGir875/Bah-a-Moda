"use client";

import { useStore } from "@/lib/store";
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  X,
  Truck,
  Inbox,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function FloatingStatus() {
  const { isAdmin, orderRequests, user, setIsProfileModalOpen, setIsTrackingOpen, markRequestAsSeen } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Admin: Count pending requests
  const pendingCount = orderRequests.filter(r => r.estado === 'pendiente').length;
  
  // User: Latest active request status
  const userRequest = user ? orderRequests.find(r => r.user_id === user.id && r.estado !== 'rechazado') : null;

  // Auto-open on confirmation
  useEffect(() => {
    if (userRequest?.estado === 'aprobado' && !userRequest.visto) {
       setIsOpen(true);
    }
  }, [userRequest?.estado, userRequest?.visto]);

  if (!isAdmin && !userRequest) return null;

  const getStatusColor = () => {
    if (isAdmin) return 'bg-[#6366f1]';
    if (userRequest?.estado === 'aprobado') return 'bg-[#10b981]';
    if (userRequest?.estado === 'pendiente') return 'bg-[#f59e0b]';
    return 'bg-black';
  };

  const getAuraColor = () => {
    if (isAdmin) return 'shadow-[0_0_50px_-12px_rgba(99,102,241,0.5)]';
    if (userRequest?.estado === 'aprobado') return 'shadow-[0_0_50px_-12px_rgba(16,185,129,0.5)]';
    if (userRequest?.estado === 'pendiente') return 'shadow-[0_0_50px_-12px_rgba(245,158,11,0.5)]';
    return 'shadow-2xl';
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4 pointer-events-none">
      
      {/* PREMIUM POPUP BOX (Glassmorphism) */}
      {isOpen && (
        <div className="pointer-events-auto relative group">
          {/* Backdrop Blur Container */}
          <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/40 p-6 w-72 sm:w-85 animate-in slide-in-from-bottom-8 fade-in duration-500 ease-out overflow-hidden">
            
            {/* Glossy top highlight */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

            <div className="flex items-center justify-between mb-5">
               <div className="flex items-center gap-2.5">
                 <div className={`p-2.5 rounded-2xl text-white shadow-lg ${getStatusColor()}`}>
                   {isAdmin ? <Inbox className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                 </div>
                 <div className="flex flex-col">
                   <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 leading-none">Canal Bahía</span>
                   <span className="text-[11px] font-bold text-gray-900 mt-1">Notificaciones</span>
                 </div>
               </div>
               <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 hover:bg-gray-100/50 rounded-full transition-all text-gray-400 hover:text-black"
               >
                 <X className="w-4 h-4" />
               </button>
            </div>

            <div className="space-y-4">
              {isAdmin ? (
                 <div className="space-y-4">
                   <div className="p-4 bg-indigo-50/50 rounded-3xl border border-indigo-100/50">
                     <p className="text-sm font-medium text-gray-800 leading-relaxed text-center">
                       Hay <span className="font-black text-indigo-600 underline underline-offset-4">{pendingCount}</span> reservas esperando tu confirmación.
                     </p>
                   </div>
                   <button 
                     onClick={() => { router.push('/admin/requests'); setIsOpen(false); }}
                     className="w-full bg-black text-white py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-indigo-200 transition-all flex items-center justify-center gap-3 active:scale-95 translate-z-0"
                   >
                     Gestionar Inbox <ArrowRight className="w-3 h-3" />
                   </button>
                 </div>
              ) : userRequest && (
                 <div className="space-y-4">
                   {userRequest.estado === 'pendiente' ? (
                     <div className="bg-gradient-to-br from-amber-50 to-orange-50/30 p-5 rounded-[2rem] border border-amber-100 flex gap-4 items-center">
                       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm animate-bounce duration-[2000ms]">
                         <Clock className="w-6 h-6" />
                       </div>
                       <div>
                         <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest leading-none mb-1">En Revisión</p>
                         <p className="text-[11px] font-medium text-amber-900/70 leading-tight">Bahía Moda está verificando tu solicitud...</p>
                       </div>
                     </div>
                   ) : userRequest.estado === 'aprobado' ? (
                     <div className="space-y-4 animate-in zoom-in-95 duration-500">
                       <div className="bg-gradient-to-br from-green-50 to-emerald-50/30 p-5 rounded-[2rem] border border-green-100 text-center">
                         <div className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center text-green-500 mx-auto mb-3 shadow-md">
                           <CheckCircle2 className="w-8 h-8" />
                         </div>
                         <p className="text-xs font-black text-green-700 uppercase tracking-widest mb-1">¡Pedido Confirmado!</p>
                         <p className="text-[11px] font-medium text-green-900/60 leading-relaxed">
                           Tu reserva es oficial. El envío está siendo preparado.
                         </p>
                       </div>
                       <button 
                         onClick={() => { setIsTrackingOpen(true); setIsOpen(false); }}
                         className="w-full bg-[#10b981] text-white py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-green-200 transition-all flex items-center justify-center gap-3 active:scale-95"
                       >
                         <Truck className="w-4 h-4" /> Seguir Mi Paquete
                       </button>
                     </div>
                   ) : null}
                 </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* THE LUXURY BUBBLE BEYOND */}
      <button 
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && !isAdmin && userRequest?.estado === 'aprobado' && !userRequest.visto) {
            markRequestAsSeen(userRequest.id);
          }
        }}
        className={`pointer-events-auto p-4 sm:p-5 rounded-[2.2rem] transition-all transform hover:-translate-y-1 active:scale-90 group relative border-[6px] border-white ring-1 ring-gray-100 ${getStatusColor()} ${getAuraColor()}`}
      >
        <div className="absolute inset-0 rounded-[1.8rem] bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {isAdmin ? (
          <div className="relative">
            <Inbox className="w-6 h-6 sm:w-8 sm:h-8 text-white transition-transform group-hover:rotate-12" />
            {pendingCount > 0 && (
              <span className="absolute -top-3 -left-3 bg-red-500 text-white text-[10px] font-black min-w-[24px] h-6 px-1.5 rounded-full flex items-center justify-center border-4 border-white shadow-xl animate-bounce">
                {pendingCount}
              </span>
            )}
          </div>
        ) : (
          <div className="relative">
            {userRequest?.estado === 'aprobado' ? (
               <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-in zoom-in-75 duration-300" />
            ) : (
               <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform" />
            )}
            {!isOpen && (userRequest?.estado === 'pendiente' || (userRequest?.estado === 'aprobado' && !userRequest.visto)) && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white animate-pulse shadow-lg">
                !
              </span>
            )}
          </div>
        )}
      </button>

    </div>
  );
}
