"use client";

import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { 
  Inbox, 
  Phone, 
  CheckCircle2, 
  XSquare, 
  Package, 
  User, 
  ArrowLeft,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Clock
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminRequestsPage() {
  const { 
    isAdmin, 
    orderRequests, 
    fetchOrderRequests, 
    approveOrderRequest, 
    rejectOrderRequest,
    markRequestAsSeen,
    authLoading 
  } = useStore();
  const router = useRouter();
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      fetchOrderRequests();
    }
  }, [isAdmin, fetchOrderRequests]);

  // Marcar como visto automáticamente al entrar
  useEffect(() => {
    const unseenPendientes = orderRequests.filter(r => r.estado === 'pendiente' && !r.visto);
    if (unseenPendientes.length > 0) {
      unseenPendientes.forEach(r => markRequestAsSeen(r.id));
    }
  }, [orderRequests, markRequestAsSeen]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-[3px] border-gray-100 border-t-black" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-4">
           <XSquare className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-black uppercase tracking-tighter text-gray-900">Acceso Restringido</h1>
        <button onClick={() => router.push('/')} className="mt-6 px-8 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full">Volver al Inicio</button>
      </div>
    );
  }

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await approveOrderRequest(id);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (window.confirm("¿Seguro que quieres descartar esta solicitud del sistema?")) {
      await rejectOrderRequest(id);
    }
  };

  const pendingRequests = orderRequests.filter(r => r.estado === 'pendiente');

  return (
    <div className="min-h-screen bg-white pb-24 selection:bg-indigo-100">
      
      {/* LUXURY BRUTALIST HEADER */}
      <div className="bg-white border-b-4 border-black sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-24 flex items-center justify-between">
           <div className="flex items-center gap-4 sm:gap-6">
             <button 
               onClick={() => router.back()} 
               className="group w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-colors shadow-[2px_2px_0px_0px_rgba(79,70,229,0.3)] hover:shadow-none translate-y-0 hover:translate-y-0.5 active:scale-95"
             >
               <ArrowLeft className="w-5 h-5" />
             </button>
             <div>
               <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-black leading-none">Reservas</h1>
               <p className="text-[8px] sm:text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mt-1.5">Tráfico de Entradas</p>
             </div>
           </div>
           
           <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-zinc-100 rounded-lg border-2 border-black">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-black uppercase tracking-widest">Sync</span>
           </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-10 space-y-10">
        
        {/* EXECUTIVE STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
           <div className="bg-white p-8 rounded-3xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4 transition-transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white">
                 <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Por Confirmar</p>
                <p className="text-4xl font-black text-black tracking-tighter">{pendingRequests.length}</p>
              </div>
           </div>
           <div className="bg-white p-8 rounded-3xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4 sm:col-span-2 transition-transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white border-2 border-black">
                 <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2">Comando Ejecutivo</p>
                <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                  Verifica las solicitudes de clientes para ingresarlas. El sistema creará los pedidos oficiales y enviará un <strong>Rastreo en Vivo</strong> al portal del cliente.
                </p>
              </div>
           </div>
        </div>

        {/* REQUESTS LIST */}
        <div className="space-y-6">
          {orderRequests.length === 0 ? (
            <div className="py-32 text-center bg-zinc-900 rounded-[2rem] border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center mx-2 sm:mx-0">
              <div className="w-24 h-24 bg-black rounded-3xl flex items-center justify-center mb-8 border border-zinc-800 shadow-inner">
                <Inbox className="w-10 h-10 text-zinc-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-[0.3em] text-white">Bandeja Impecable</h3>
              <p className="text-[10px] sm:text-[11px] font-bold text-zinc-500 uppercase tracking-widest mt-4 leading-loose">
                No hay reservas pendientes<br/>El puerto está tranquilo
              </p>
            </div>
          ) : (
            orderRequests.map((req, index) => (
              <div 
                key={req.id} 
                className={`group bg-white rounded-[3rem] border shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 overflow-hidden ${
                  req.estado === 'aprobado' ? 'opacity-40 grayscale-[0.5] border-gray-50' : 'border-gray-100'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col lg:flex-row">
                  
                  {/* LEFT SIDE: CLIENT PROFILE */}
                  <div className="lg:w-80 p-8 lg:p-10 bg-gray-50/50 border-r border-gray-100 flex flex-col justify-between">
                    <div>
                      <div className="w-16 h-16 bg-black rounded-[1.2rem] flex items-center justify-center text-white mb-6 shadow-xl shadow-black/10 transition-transform group-hover:rotate-3">
                        <User className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-black text-gray-900 leading-none tracking-tight mb-2 truncate">
                        {req.cliente_nombre}
                      </h3>
                      {req.user_id && (
                        <div className="flex items-center gap-1.5 text-green-600 bg-green-50 w-max px-2.5 py-1 rounded-md mb-2 border border-green-100">
                          <CheckCircle2 className="w-3 h-3" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Cliente Verificado</span>
                        </div>
                      )}
                      <div className="flex flex-col gap-3 mt-4">
                         <div className="flex items-center gap-3 text-indigo-600">
                            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                               <Phone className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold tracking-tight">{req.cliente_telefono}</span>
                         </div>
                         <div className="flex items-start gap-3 text-gray-500 pt-3 border-t border-gray-100">
                            <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                            <div className="flex flex-col">
                               <span className="text-[9px] font-black uppercase tracking-widest leading-none mb-1">Solicitado en</span>
                               <span className="text-[11px] font-bold">{new Date(req.created_at).toLocaleDateString('es-GT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                         </div>
                      </div>
                    </div>

                    {req.estado === 'aprobado' && (
                      <div className="mt-8 py-2 px-4 bg-green-500/10 text-green-600 rounded-full text-[10px] font-black uppercase text-center border border-green-500/20">
                        Confirmado ✓
                      </div>
                    )}
                  </div>

                  {/* RIGHT SIDE: ORDER CONTENT */}
                  <div className="flex-1 p-8 lg:p-10 flex flex-col">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Contenido del Pedido</span>
                       <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">{req.tipo_entrega === 'domicilio' ? '🏠 Domicilio' : '📍 Punto de Encuentro'}</span>
                       </div>
                    </div>

                    <div className="space-y-5 flex-1">
                      {req.items.map((item: any, idx: number) => {
                         const isFood = item.supplier === '🥘 Venta de Comida';
                         return (
                          <div key={idx} className="flex items-center justify-between group/item">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xs font-black text-gray-400 border border-gray-100">
                                x{item.quantity}
                              </div>
                              <div className="flex flex-col">
                                {item.supplier && (
                                   <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest w-max mb-1.5 flex items-center gap-1 ${
                                      isFood ? 'bg-orange-500/10 text-orange-600' : 'bg-indigo-500/10 text-indigo-600'
                                   }`}>
                                      {isFood ? '🍳 Menú' : `📖 ${item.supplier}`}
                                   </div>
                                )}
                                <span className="text-sm font-bold text-gray-900 group-hover/item:text-indigo-600 transition-colors uppercase truncate">
                                  {item.name} {item.size ? `· Talla ${item.size}` : ''}
                                </span>
                              </div>
                            </div>
                            <span className="text-sm font-black text-gray-900 tracking-tighter">Q{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                         );
                      })}
                    </div>

                    <div className="mt-8 p-6 bg-gray-50 rounded-[2rem] border border-gray-100/50 flex flex-col sm:flex-row gap-6 items-center">
                       <div className="flex-1 min-w-0">
                          <p className="text-[9px] font-black uppercase text-gray-400 mb-1.5 flex items-center gap-1.5 tracking-widest"><TrendingUp className="w-3 h-3" /> Ubicación Detallada</p>
                          <p className="text-xs font-bold text-gray-700 leading-relaxed italic">{req.ubicacion}</p>
                       </div>
                       <div className="flex flex-col items-end shrink-0">
                          <p className="text-[9px] font-black uppercase text-indigo-500 mb-0.5 tracking-[0.2em]">Total Inversión</p>
                          <p className="text-2xl font-black text-gray-900 tracking-tighter">Q{req.total.toFixed(2)}</p>
                       </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    {req.estado === 'pendiente' && (
                      <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <button 
                          onClick={() => window.open(`https://wa.me/502${req.cliente_telefono}`, '_blank')}
                          className="flex-1 group h-14 bg-white hover:bg-green-500 border-2 border-green-500 text-green-500 hover:text-white rounded-[1.2rem] transition-all flex items-center justify-center gap-3 active:scale-95"
                        >
                          <Phone className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Llamar WhatsApp</span>
                        </button>
                        
                        <button 
                          onClick={() => handleApprove(req.id)}
                          disabled={!!processingId}
                          className="flex-[1.5] h-14 bg-black hover:bg-zinc-800 disabled:opacity-50 text-white rounded-[1.2rem] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                        >
                          {processingId === req.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white" />
                          ) : (
                            <Sparkles className="w-4 h-4 text-indigo-400" />
                          )}
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Confirmar Reserva</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>

                        <button 
                           onClick={() => handleReject(req.id)}
                           className="w-14 h-14 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-[1.2rem] transition-all flex items-center justify-center shrink-0 border border-red-100"
                           title="Descartar Solicitud"
                        >
                          <XSquare className="w-6 h-6" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
