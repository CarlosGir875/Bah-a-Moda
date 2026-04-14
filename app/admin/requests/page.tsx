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
    authLoading,
    addToast
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
      addToast("✅ Pedido procesado exitosamente", "success");
    } catch (err: any) {
      console.error("Error approving order:", err);
      addToast(`❌ Error: ${err.message || "Fallo en el servidor"}`, "error");
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
      
      {/* PREMIUM MINIMALIST HEADER */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
        <div className="max-w-6xl mx-auto px-6 h-24 flex items-center justify-between">
           <div className="flex items-center gap-4 sm:gap-6">
             <button 
               onClick={() => router.back()} 
               className="w-12 h-12 bg-transparent text-gray-400 hover:text-black hover:bg-gray-50 rounded-full flex items-center justify-center transition-all active:scale-95"
             >
               <ArrowLeft className="w-6 h-6 stroke-[1.5]" />
             </button>
             <div>
               <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-gray-900 leading-none">Reservas</h1>
               <div className="flex items-center gap-2 mt-2">
                 <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Tráfico de Entradas</p>
               </div>
             </div>
           </div>
           
           <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-50/80 rounded-full border border-emerald-100">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Online</span>
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
            <div className="bg-white rounded-[2rem] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-zinc-100 border-b-2 border-black text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
                      <th className="p-4 w-12 text-center">STS</th>
                      <th className="p-4">Cliente / Contacto</th>
                      <th className="p-4">Resumen de Pedido</th>
                      <th className="p-4 text-right">Inversión</th>
                      <th className="p-4 text-center">Acciones Masivas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-zinc-100">
                    {orderRequests.map((req, index) => {
                      const isApproved = req.estado === 'aprobado';
                      const itemCount = req.items.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
                      const topItem = req.items[0]?.name || 'Varios';
                      const isNew = req.estado === 'pendiente' && !req.visto;
                      
                      return (
                        <tr 
                          key={req.id} 
                          className={`group transition-all duration-300 hover:bg-indigo-50/50 ${isApproved ? 'opacity-50 grayscale bg-zinc-50/50 hover:bg-zinc-50/50' : 'bg-white'}`}
                        >
                          {/* STATUS DOT */}
                          <td className="p-4 text-center align-middle">
                            {isApproved ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                            ) : (
                              <div className={`w-3 h-3 rounded-full mx-auto ${isNew ? 'bg-red-500 animate-ping shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-amber-400'}`} />
                            )}
                          </td>
                          
                          {/* CLIENT & CONTACT */}
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center text-sm font-black uppercase shrink-0 shadow-md">
                                 {req.cliente_nombre.charAt(0)}
                               </div>
                               <div className="flex flex-col min-w-0">
                                 <span className="text-sm font-black text-black truncate max-w-[150px] sm:max-w-[200px] leading-tight mb-1">{req.cliente_nombre}</span>
                                 <div className="flex items-center gap-2">
                                     <a href={`https://wa.me/502${req.cliente_telefono}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-indigo-600 transition-colors">
                                       <Phone className="w-3 h-3 text-indigo-500" />
                                       <span className="text-[10px] font-bold text-zinc-500">{req.cliente_telefono}</span>
                                     </a>
                                     <span className="text-[8px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 uppercase tracking-widest">{req.tipo_entrega === 'domicilio' ? '🏠 Dom' : '📍 Punto'}</span>
                                 </div>
                               </div>
                            </div>
                          </td>

                          {/* ORDER SUMMARY */}
                          <td className="p-4 align-middle">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-zinc-800 truncate max-w-[180px] sm:max-w-[280px]">
                                <span className="font-black text-black mr-1">{itemCount}x</span>
                                {topItem} {req.items.length > 1 ? '[...]' : ''}
                              </span>
                              {isApproved ? (
                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mt-1 flex items-center gap-1">
                                  <Package className="w-3 h-3" /> ➔ En Logística (Pedidos)
                                </span>
                              ) : (
                                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mt-1 flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {new Date(req.created_at).toLocaleDateString('es-GT', { weekday: 'short', hour: '2-digit', minute:'2-digit' })}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* TOTAL */}
                          <td className="p-4 text-right align-middle">
                            <span className="text-base font-black font-mono text-black">Q{req.total.toFixed(0)}</span>
                          </td>

                          {/* ACTIONS */}
                          <td className="p-4 text-center align-middle">
                            {req.estado === 'pendiente' ? (
                              <div className="flex items-center justify-center gap-3">
                                <button
                                  onClick={() => handleApprove(req.id)}
                                  disabled={!!processingId}
                                  className="w-10 h-10 rounded-[0.8rem] bg-black text-white hover:bg-emerald-500 hover:scale-110 active:scale-95 transition-all flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_15px_rgba(16,185,129,0.4)] disabled:opacity-50 group/btn"
                                  title="Aprobar Pedido a Logística"
                                >
                                  {processingId === req.id ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                                </button>
                                <button
                                  onClick={() => handleReject(req.id)}
                                  className="w-10 h-10 rounded-[0.8rem] bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white hover:scale-110 active:scale-95 transition-all flex items-center justify-center border border-rose-100 group/btn"
                                  title="Descartar Solicitud"
                                >
                                  <XSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </button>
                              </div>
                            ) : (
                               <span className="px-3 py-1 bg-zinc-100 text-zinc-400 border border-zinc-200 rounded-full text-[9px] font-black uppercase tracking-widest inline-block pointer-events-none">Resuelto</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
