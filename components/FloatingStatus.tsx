"use client";

import { useStore } from "@/lib/store";
import { 
  Bell, 
  Settings, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  X,
  Truck,
  Inbox
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function FloatingStatus() {
  const { isAdmin, orderRequests, user, setIsProfileOpen, markRequestAsSeen } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();

  // Admin: Count pending requests
  const pendingCount = orderRequests.filter(r => r.estado === 'pendiente').length;
  
  // User: Latest request status
  const userRequest = user ? orderRequests.find(r => r.user_id === user.id) : null;

  // Realtime notification logic for user
  useEffect(() => {
    if (userRequest?.estado === 'aprobado' && !userRequest.visto) {
       setShowConfirmation(true);
       setIsOpen(true);
    }
  }, [userRequest?.estado, userRequest?.visto]);

  // If no user/admin and no urgent status, don't show
  if (!isAdmin && !userRequest) return null;

  const getStatusColor = () => {
    if (isAdmin) return 'bg-indigo-600';
    if (userRequest?.estado === 'aprobado') return 'bg-green-500';
    if (userRequest?.estado === 'pendiente') return 'bg-amber-500';
    return 'bg-black';
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3 pointer-events-none">
      
      {/* POPUP BOX */}
      {isOpen && (
        <div className="pointer-events-auto bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 w-72 sm:w-80 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2">
               <div className={`p-2 rounded-xl text-white ${getStatusColor()}`}>
                 {isAdmin ? <Inbox className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Notificaciones</span>
             </div>
             <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
               <X className="w-4 h-4 text-gray-400" />
             </button>
          </div>

          <div className="space-y-4">
            {isAdmin ? (
               <div className="space-y-3">
                 <p className="text-sm font-bold text-gray-900 leading-tight">
                   Tienes <span className="text-indigo-600">{pendingCount}</span> solicitudes de reserva pendientes por confirmar.
                 </p>
                 <button 
                   onClick={() => { router.push('/admin/requests'); setIsOpen(false); }}
                   className="w-full bg-black text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-zinc-900 transition-all flex items-center justify-center gap-2"
                 >
                   Ver Bandeja de Entrada
                 </button>
               </div>
            ) : userRequest && (
               <div className="space-y-3">
                 {userRequest.estado === 'pendiente' ? (
                   <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex gap-4">
                     <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shrink-0 animate-pulse">
                       <Clock className="w-5 h-5" />
                     </div>
                     <div>
                       <p className="text-xs font-black text-amber-700 uppercase tracking-tight">En Revisión...</p>
                       <p className="text-[10px] font-medium text-amber-600 mt-1 leading-relaxed">Bahía Moda está revisando tu solicitud. Te avisaremos pronto.</p>
                     </div>
                   </div>
                 ) : userRequest.estado === 'aprobado' ? (
                   <div className="bg-green-50 p-4 rounded-2xl border border-green-100 space-y-4">
                     <div className="flex gap-4">
                       <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-green-200">
                         <CheckCircle2 className="w-5 h-5" />
                       </div>
                       <div>
                         <p className="text-xs font-black text-green-700 uppercase tracking-tight">¡Pedido Confirmado!</p>
                         <p className="text-[10px] font-medium text-green-600 mt-1 leading-relaxed">
                           Bahía Moda ha confirmado tu reserva. ¡Todo listo para el envío!
                         </p>
                       </div>
                     </div>
                     <button 
                       onClick={() => { setIsProfileOpen(true); setIsOpen(false); }}
                       className="w-full bg-green-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                     >
                       <Truck className="w-4 h-4" /> Ver mi Rastreo
                     </button>
                   </div>
                 ) : null}
               </div>
            )}
          </div>
        </div>
      )}

      {/* FLOATING BUBBLE */}
      <button 
        onClick={() => {
          setIsOpen(!isOpen);
          // Marca como visto si es un cliente con confirmación pendiente
          if (!isOpen && !isAdmin && userRequest?.estado === 'aprobado' && !userRequest.visto) {
            markRequestAsSeen(userRequest.id);
          }
        }}
        className={`pointer-events-auto p-4 sm:p-5 rounded-[2rem] shadow-2xl transition-all active:scale-95 group relative border-4 border-white ${getStatusColor()}`}
      >
        {isAdmin ? (
          <>
            <Bell className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            {pendingCount > 0 && (
              <div className="absolute -top-1 -left-1 bg-red-500 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white animate-bounce shadow-lg">
                {pendingCount}
              </div>
            )}
          </>
        ) : (
          <>
            {userRequest?.estado === 'aprobado' ? (
               <Truck className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            ) : (
               <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            )}
            {!isOpen && (userRequest?.estado === 'pendiente' || (userRequest?.estado === 'aprobado' && !userRequest.visto)) && (
              <div className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                !
              </div>
            )}
          </>
        )}
      </button>

    </div>
  );
}
