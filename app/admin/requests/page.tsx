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
  Clock,
  Truck,
  Calendar,
  Trash2,
  ChevronDown,
  MapPin,
  CircleDollarSign,
  ReceiptText
} from "lucide-react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

export default function AdminRequestsPage() {
  const { 
    isAdmin, 
    orderRequests, 
    fetchOrderRequests, 
    approveOrderRequest, 
    rejectOrderRequest,
    markRequestAsSeen,
    authLoading,
    addToast,
    adminOrders,
    updateOrderStatus,
    updateOrderDetails,
    deleteOrder,
    fetchAllOrders,
    products
  } = useStore();
  const router = useRouter();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      fetchOrderRequests();
      fetchAllOrders();
    }
  }, [isAdmin, fetchOrderRequests, fetchAllOrders]);

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
      await fetchAllOrders();
      await fetchOrderRequests();
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
                    {orderRequests.map((req) => {
                          const linkedOrder = adminOrders.find(o => o.id === req.id || (o.cliente_id === req.user_id && Math.abs(new Date(o.created_at).getTime() - new Date(req.created_at).getTime()) < 5000));
                          const isApproved = req.estado === 'aprobado';
                          const itemCount = req.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
                          const topItem = req.items[0]?.name || "Varios";
                          const isExpanded = expandedOrderId === req.id;
                          const isNew = !req.visto && req.estado === 'pendiente';

                          return (
                            <React.Fragment key={req.id}>
                            <tr 
                              onClick={() => setExpandedOrderId(isExpanded ? null : req.id)}
                              className={`group transition-all duration-300 hover:bg-indigo-50/50 cursor-pointer ${isExpanded ? 'bg-indigo-50/30' : 'bg-white'}`}
                            >
                              {/* STATUS DOT */}
                              <td className="p-4 text-center align-middle w-12">
                                {isApproved ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                                ) : (
                                  <div className={`w-3 h-3 rounded-full mx-auto ${isNew ? 'bg-red-500 animate-ping shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-amber-400'}`} />
                                )}
                              </td>
                              
                              {/* CLIENT & CONTACT */}
                              <td className="p-4 align-middle">
                                <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center text-sm font-black uppercase shrink-0 shadow-md transition-transform group-hover:scale-110">
                                     {req.cliente_nombre.charAt(0)}
                                   </div>
                                   <div className="flex flex-col min-w-0">
                                     <span className="text-sm font-black text-black truncate max-w-[150px] sm:max-w-[200px] leading-tight mb-1">{req.cliente_nombre}</span>
                                     <div className="flex items-center gap-2">
                                         <a href={`https://wa.me/502${req.cliente_telefono}`} onClick={(e) => e.stopPropagation()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-indigo-600 transition-colors">
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
                                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 mt-1 flex items-center gap-1">
                                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse mr-1" />
                                      {linkedOrder?.estado === 'en_transito' ? 'EN RUTA' : (linkedOrder?.estado === 'listo_entrega' ? 'ENTREGADO' : 'LOGÍSTICA - CONFIRMADO')}
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
                                      onClick={(e) => { e.stopPropagation(); handleApprove(req.id); }}
                                      disabled={!!processingId}
                                      className="w-10 h-10 rounded-[0.8rem] bg-black text-white hover:bg-emerald-500 hover:scale-110 active:scale-95 transition-all flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_15px_rgba(16,185,129,0.4)] disabled:opacity-50 group/btn"
                                      title="Aprobar Pedido a Logística"
                                    >
                                      {processingId === req.id ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                                    </button>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleReject(req.id); }}
                                      className="w-10 h-10 rounded-[0.8rem] bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white hover:scale-110 active:scale-95 transition-all flex items-center justify-center border border-rose-100 group/btn"
                                      title="Descartar Solicitud"
                                    >
                                      <XSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </button>
                                  </div>
                                ) : linkedOrder ? (
                                   <div className="flex flex-col gap-2 min-w-[140px]" onClick={(e) => e.stopPropagation()}>
                                     <div className="relative group/date">
                                        <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 group-hover/date:text-black transition-colors" />
                                        <input 
                                          type="text"
                                          placeholder="Llega el..."
                                          defaultValue={linkedOrder.fecha_entrega || ''}
                                          onBlur={async (e) => {
                                            if (e.target.value !== linkedOrder.fecha_entrega) {
                                              await updateOrderDetails(linkedOrder.id, { fecha_entrega: e.target.value });
                                              addToast("📅 Fecha actualizada", "success");
                                            }
                                          }}
                                          className="w-full pl-7 pr-2 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-[9px] font-bold focus:outline-none focus:ring-1 focus:ring-black placeholder:text-zinc-300 transition-all"
                                        />
                                     </div>

                                     <div className="flex flex-col gap-2">
                                       <select 
                                         value={linkedOrder.estado}
                                         onChange={(e) => updateOrderStatus(linkedOrder.id, e.target.value)}
                                         className={`w-full px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer outline-none ${
                                           linkedOrder.estado === 'listo_entrega' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                           linkedOrder.estado === 'en_transito' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' :
                                           'bg-amber-50 text-amber-600 border-amber-200'
                                         }`}
                                       >
                                         <option value="recibido">📦 Confirmado</option>
                                         <option value="en_transito">🚚 En Camino</option>
                                         <option value="listo_entrega">✔️ Entregado</option>
                                         <option value="cancelado">❌ Cancelado</option>
                                       </select>
                                     </div>
                                   </div>
                                ) : (
                                   <div className="flex flex-col gap-2 min-w-[140px]">
                                      <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-full text-[9px] font-black uppercase tracking-widest inline-block text-center animate-pulse">🔄 Sincronizando...</span>
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); fetchAllOrders(); fetchOrderRequests(); }}
                                        className="text-[8px] font-black text-zinc-400 uppercase hover:text-black transition-colors"
                                      >
                                        Refrescar Datos
                                      </button>
                                   </div>
                                )}
                              </td>
                            </tr>

                            {/* LUXURY TICKET VIEW */}
                            <AnimatePresence>
                              {isExpanded && (
                                <tr className="bg-white">
                                  <td colSpan={5} className="p-0 border-none relative overflow-hidden">
                                    <motion.div 
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="p-6 sm:p-10 border-t-4 border-black bg-zinc-50"
                                    >
                                      <div className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-2xl border-[3px] border-black p-8 sm:p-12 relative overflow-hidden">
                                        {/* TICKET HEADER */}
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-12 border-b-2 border-dashed border-zinc-200 pb-12">
                                          <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                              <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center text-white shadow-xl">
                                                <ReceiptText className="w-8 h-8" />
                                              </div>
                                              <div>
                                                <h4 className="text-2xl font-black uppercase tracking-tighter">Ticket de Pedido</h4>
                                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Ref: {req.id.split('-')[0]}</p>
                                              </div>
                                            </div>
                                            <div className="flex flex-col gap-2 pt-4">
                                              <div className="flex items-center gap-3 text-zinc-500 font-bold text-sm">
                                                <User className="w-4 h-4" /> {req.cliente_nombre}
                                              </div>
                                              <div className="flex items-center gap-3 text-indigo-600 font-black text-sm">
                                                <Phone className="w-4 h-4" /> {req.cliente_telefono}
                                              </div>
                                              <div className="flex items-center gap-3 text-zinc-500 font-bold text-sm italic">
                                                <MapPin className="w-4 h-4 text-rose-500" /> {req.ubicacion}
                                              </div>
                                            </div>
                                          </div>

                                          <div className="bg-zinc-900 text-white p-8 rounded-[2.5rem] shadow-2xl min-w-[240px] border-2 border-black">
                                            <div className="flex items-center gap-2 mb-4">
                                              <CircleDollarSign className="w-5 h-5 text-emerald-400" />
                                              <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Balance Total</span>
                                            </div>
                                            <p className="text-5xl font-black tracking-tighter font-mono mb-2">Q{req.total.toFixed(0)}</p>
                                            <div className="flex flex-col gap-1 mt-4">
                                              <div className="flex justify-between text-[10px] font-black uppercase text-emerald-400">
                                                <span>Anticipo (50%):</span>
                                                <span>Q{req.anticipo.toFixed(0)}</span>
                                              </div>
                                              <div className="flex justify-between text-[10px] font-black uppercase text-zinc-500">
                                                <span>Pendiente:</span>
                                                <span>Q{(req.total - req.anticipo).toFixed(0)}</span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {/* PRODUCT GRID WITH IMAGES */}
                                        <div className="space-y-6 mb-12">
                                          <h5 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400 mb-6">Contenido del Pedido</h5>
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {req.items.map((item: any, idx: number) => {
                                              // Intentar encontrar la imagen real del producto en el catálogo
                                              const realProduct = products.find(p => p.id === item.id);
                                              const imageUrl = realProduct?.images?.[0] || null;

                                              return (
                                                <div key={idx} className="flex items-center gap-5 p-5 bg-zinc-50 rounded-[2rem] border-2 border-zinc-100 hover:border-black transition-all group/item">
                                                  <div className="w-24 h-24 bg-white rounded-3xl border-2 border-zinc-200 overflow-hidden flex-shrink-0 shadow-sm relative">
                                                    {imageUrl ? (
                                                      <img src={imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform group-hover/item:scale-110" />
                                                    ) : (
                                                      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 text-zinc-300">
                                                        <Package className="w-8 h-8 mb-1" />
                                                        <span className="text-[7px] font-black uppercase tracking-widest italic text-center">Bahía Moda</span>
                                                      </div>
                                                    )}
                                                    <div className="absolute top-1 right-1 bg-black text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                                                       x{item.quantity}
                                                    </div>
                                                  </div>
                                                  <div className="flex-1 min-w-0">
                                                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">{item.supplier || "Colección"}</p>
                                                    <h6 className="text-sm font-black text-zinc-900 leading-tight truncate mb-1">{item.name}</h6>
                                                    <div className="flex items-center gap-3">
                                                       <span className="text-[11px] font-bold text-zinc-500 font-mono">Q{item.price} c/u</span>
                                                       {item.size && <span className="bg-zinc-200 text-zinc-600 text-[9px] font-black px-2 py-0.5 rounded uppercase">{item.size}</span>}
                                                    </div>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>

                                        {/* ADMIN ACTION ZONE */}
                                        <div className="flex flex-col sm:flex-row justify-between items-center gap-8 pt-10 border-t-2 border-zinc-100">
                                           <div className="flex gap-4">
                                              <button 
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  if (window.confirm("⚠️ ¿Eliminar este registro permanentemente?")) {
                                                    deleteOrder(req.id);
                                                    addToast("Registro eliminado", "success");
                                                  }
                                                }}
                                                className="px-8 py-4 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 border-2 border-rose-100 shadow-sm"
                                              >
                                                <Trash2 className="w-4 h-4" /> Eliminar Registro
                                              </button>
                                           </div>
                                           <div className="flex items-center gap-4">
                                              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Cerrar Detalle</p>
                                              <button 
                                                onClick={() => setExpandedOrderId(null)}
                                                className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-inner"
                                              >
                                                <ChevronDown className="w-6 h-6 rotate-180" />
                                              </button>
                                           </div>
                                        </div>
                                      </div>
                                    </motion.div>
                                  </td>
                                </tr>
                              )}
                            </AnimatePresence>
                            </React.Fragment>
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
