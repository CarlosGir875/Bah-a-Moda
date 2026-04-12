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
  Calendar,
  MessageSquare,
  ArrowLeft,
  Truck
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminRequestsPage() {
  const { 
    isAdmin, 
    orderRequests, 
    fetchOrderRequests, 
    approveOrderRequest, 
    rejectOrderRequest,
    authLoading 
  } = useStore();
  const router = useRouter();
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      fetchOrderRequests();
    }
  }, [isAdmin, fetchOrderRequests]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-black" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
        <h1 className="text-xl font-black uppercase text-red-500">Acceso Denegado</h1>
        <button onClick={() => router.push('/')} className="mt-4 text-xs font-bold uppercase underline">Volver</button>
      </div>
    );
  }

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await approveOrderRequest(id);
      alert("¡Pedido confirmado con éxito! Ya aparece en el historial y el rastreo está activo para el cliente.");
    } catch (error) {
      alert("Error al confirmar: " + (error as any).message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (window.confirm("¿Seguro que quieres rechazar esta solicitud?")) {
      await rejectOrderRequest(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
             <div className="bg-indigo-600 p-2 rounded-xl">
               <Inbox className="w-5 h-5 text-white" />
             </div>
             <h1 className="text-lg font-black uppercase tracking-tight">Bandeja de Solicitudes</h1>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8 space-y-6">
        {/* STATS LITE */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex items-center justify-between">
           <div>
             <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Solicitudes Pendientes</p>
             <p className="text-3xl font-black">{orderRequests.filter(r => r.estado === 'pendiente').length}</p>
           </div>
           <div className="text-right">
             <p className="text-[10px] font-black uppercase text-green-500 tracking-widest leading-none mb-1">Confirmación Manual OK</p>
             <p className="text-xs font-medium text-gray-500">Haz clic en confirmar para generar el ID</p>
           </div>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {orderRequests.length === 0 ? (
            <div className="py-20 text-center text-gray-400 space-y-4">
              <MessageSquare className="w-12 h-12 mx-auto opacity-20" />
              <p className="font-bold uppercase tracking-widest text-xs">No hay solicitudes nuevas</p>
            </div>
          ) : (
            orderRequests.map((req) => (
              <div 
                key={req.id} 
                className={`bg-white rounded-[2rem] border overflow-hidden transition-all ${
                  req.estado === 'aprobado' ? 'opacity-50 grayscale border-gray-100' : 'border-gray-200 shadow-xl'
                }`}
              >
                {/* REQ HEADER */}
                <div className="p-6 border-b border-gray-50 flex flex-wrap gap-4 items-center justify-between bg-zinc-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg leading-none">{req.cliente_nombre}</h3>
                      <p className="text-xs font-bold text-indigo-600 mt-1 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {req.cliente_telefono}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-[9px] font-black uppercase text-gray-400 tracking-tighter">Enviada</p>
                      <p className="text-xs font-bold">{new Date(req.created_at).toLocaleDateString()} {new Date(req.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                    {req.estado === 'aprobado' && (
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase">
                        Confirmado ✅
                      </div>
                    )}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  <div className="space-y-3">
                    {req.items.map((item: any, idx: number) => {
                      const idFood = item.supplier === '🥘 Venta de Comida';
                      return (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-sm py-3 border-b border-gray-50 last:border-0 gap-1">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-lg text-[10px] font-bold">x{item.quantity}</span>
                            <div className="flex flex-col">
                              {item.supplier && (
                                <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded w-max mb-1 ${
                                  idFood ? 'bg-orange-100 text-orange-700' : 'bg-indigo-100 text-indigo-700'
                                }`}>
                                  {idFood ? '🍳 Comida' : `📖 Revista: ${item.supplier}`}
                                </span>
                              )}
                              <span className="font-bold text-gray-900">{item.name} {item.size ? `(${item.size})` : ''}</span>
                            </div>
                          </div>
                          <span className="font-black text-right">Q{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 pt-6 border-t border-dashed border-gray-200 grid grid-cols-2 gap-4">
                    <div className="bg-zinc-50 p-4 rounded-2xl">
                      <p className="text-[9px] font-black uppercase text-gray-400 mb-1">Anticipo Req.</p>
                      <p className="text-xl font-black text-indigo-600">Q{req.anticipo.toFixed(2)}</p>
                    </div>
                    <div className="bg-zinc-50 p-4 rounded-2xl">
                      <p className="text-[9px] font-black uppercase text-gray-400 mb-1">Total Pedido</p>
                      <p className="text-xl font-black text-black">Q{req.total.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-orange-50/50 border border-orange-100 rounded-2xl">
                    <p className="text-[9px] font-black uppercase text-orange-600 mb-1">Lugar de Entrega</p>
                    <p className="text-xs font-bold text-gray-700 leading-relaxed shadow-sm">
                      {req.tipo_entrega === 'domicilio' ? '🏠 Domicilio' : '📍 Punto de Encuentro'} <br/>
                      {req.ubicacion}
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}
                {req.estado === 'pendiente' && (
                  <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => window.open(`https://wa.me/502${req.cliente_telefono}`, '_blank')}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-200"
                    >
                      <Phone className="w-4 h-4" /> Llamar Cliente
                    </button>
                    <button 
                      onClick={() => handleApprove(req.id)}
                      disabled={!!processingId}
                      className="flex-[1.5] bg-black hover:bg-zinc-900 disabled:opacity-50 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl"
                    >
                      {processingId === req.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      Confirmar y Registrar Pedido
                    </button>
                    <button 
                       onClick={() => handleReject(req.id)}
                       className="p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-colors"
                    >
                      <XSquare className="w-6 h-6" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
