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
  ReceiptText,
  Download,
  Send,
  MessageSquareShare
} from "lucide-react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { generateInvoicePDF } from "@/lib/invoiceGenerator";

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
      addToast("✅ Pedido aprobado. ¡Genera la factura!", "success");
      await fetchAllOrders();
      await fetchOrderRequests();
    } catch (err: any) {
      addToast(`❌ Error: ${err.message || "Fallo en el servidor"}`, "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleSendWhatsAppInvoice = (order: any) => {
    const invoiceId = `BM-${order.id.split('-')[0].toUpperCase()}`;
    const message = `¡Hola ${order.cliente_nombre}! Te saluda Bahía Moda. 👗✨\n\nHemos confirmado tu reserva *${invoiceId}*.\n\n*Resumen:* \n- Total: Q${order.total}\n- Anticipo (50%): Q${order.anticipo}\n- Saldo Pendiente: Q${order.total - order.anticipo}\n\nTe adjuntamos el recibo oficial. ¡Gracias por tu compra! 🌊🕶️`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/502${order.cliente_telefono}?text=${encoded}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white pb-24 selection:bg-indigo-100">
      
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
        <div className="max-w-6xl mx-auto px-6 h-24 flex items-center justify-between">
           <div className="flex items-center gap-4">
             <button onClick={() => router.back()} className="w-12 h-12 hover:bg-gray-50 rounded-full flex items-center justify-center transition-all">
               <ArrowLeft className="w-6 h-6 stroke-[1.5]" />
             </button>
             <div>
               <h1 className="text-2xl font-black tracking-tighter text-gray-900">Gestión de Reservas</h1>
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Puerto de Ingresos</p>
             </div>
           </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-10 space-y-10">
        
        {/* LIST */}
        <div className="space-y-6">
          {orderRequests.length === 0 ? (
            <div className="py-32 text-center bg-zinc-900 rounded-[2rem] border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <Inbox className="w-10 h-10 text-zinc-600 mx-auto mb-6" />
              <h3 className="text-xl font-black uppercase tracking-[0.3em] text-white">Puerto Limpio</h3>
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-zinc-100 border-b-2 border-black text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
                      <th className="p-4 w-12 text-center">STS</th>
                      <th className="p-4">Cliente</th>
                      <th className="p-4">Pedido</th>
                      <th className="p-4 text-right">Inversión</th>
                      <th className="p-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-zinc-100">
                    {orderRequests.map((req) => {
                          const linkedOrder = adminOrders.find(o => o.id === req.id || (o.cliente_id === req.user_id && Math.abs(new Date(o.created_at).getTime() - new Date(req.created_at).getTime()) < 10000));
                          const isApproved = req.estado === 'aprobado';
                          const isExpanded = expandedOrderId === req.id;

                          return (
                            <React.Fragment key={req.id}>
                            <tr 
                              onClick={() => setExpandedOrderId(isExpanded ? null : req.id)}
                              className={`group hover:bg-indigo-50/30 cursor-pointer ${isExpanded ? 'bg-indigo-50/20' : 'bg-white'}`}
                            >
                              <td className="p-4 text-center align-middle">
                                {isApproved ? <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" /> : <div className="w-3 h-3 rounded-full mx-auto bg-amber-400 animate-pulse" />}
                              </td>
                              
                              <td className="p-4 align-middle">
                                <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center text-sm font-black uppercase">{req.cliente_nombre.charAt(0)}</div>
                                   <div className="flex flex-col min-w-0">
                                     <span className="text-sm font-black text-black truncate">{req.cliente_nombre}</span>
                                     <span className="text-[10px] font-bold text-zinc-500 flex items-center gap-1"><Phone className="w-3 h-3" /> {req.cliente_telefono}</span>
                                   </div>
                                </div>
                              </td>

                              <td className="p-4 align-middle">
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-zinc-800">{req.items.length} Productos</span>
                                  <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 mt-1">{isApproved ? 'CONFIRMADO' : 'PENDIENTE'}</span>
                                </div>
                              </td>

                              <td className="p-4 text-right align-middle font-mono font-black">Q{req.total.toFixed(0)}</td>

                              <td className="p-4 text-center align-middle">
                                {!isApproved ? (
                                  <div className="flex items-center justify-center gap-3">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleApprove(req.id); }}
                                      className="w-10 h-10 rounded-xl bg-black text-white hover:bg-emerald-500 transition-all flex items-center justify-center shadow-lg"
                                    >
                                      <CheckCircle2 className="w-5 h-5" />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center gap-2" onClick={e => e.stopPropagation()}>
                                    <button 
                                      onClick={() => {
                                        try {
                                          generateInvoicePDF(req);
                                        } catch (e) {
                                          console.error("PDF error:", e);
                                          addToast("❌ Error al generar PDF", "error");
                                        }
                                      }}
                                      className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all"
                                      title="Descargar PDF"
                                    >
                                      <Download className="w-3 h-3" /> PDF
                                    </button>
                                    <button 
                                      onClick={() => handleSendWhatsAppInvoice(req)}
                                      className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all"
                                      title="Enviar por WhatsApp"
                                    >
                                      <MessageSquareShare className="w-3 h-3" /> WhatsApp
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>

                            {/* DETALLE EXPANDIDO */}
                            <AnimatePresence>
                              {isExpanded && (
                                <tr className="bg-zinc-50/50">
                                  <td colSpan={5} className="p-0 border-none">
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="p-8">
                                      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] border-[3px] border-black p-8 shadow-xl">
                                         <div className="flex justify-between items-start mb-8 pb-8 border-b-2 border-dashed border-zinc-100">
                                            <div>
                                              <h4 className="text-xl font-black uppercase tracking-tighter mb-2">Detalles del Cliente</h4>
                                              <div className="space-y-1">
                                                <p className="text-sm font-bold text-zinc-500 italic flex items-center gap-2"><MapPin className="w-4 h-4 text-rose-500" /> {req.ubicacion}</p>
                                                <p className="text-sm font-bold text-zinc-500 flex items-center gap-2"><Calendar className="w-4 h-4 text-indigo-500" /> {new Date(req.created_at).toLocaleString()}</p>
                                              </div>
                                            </div>
                                            <div className="bg-zinc-900 text-white p-6 rounded-3xl min-w-[200px] text-center border-2 border-black">
                                               <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Total Reserva</p>
                                               <p className="text-4xl font-black font-mono">Q{req.total.toFixed(0)}</p>
                                               <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-[10px] font-black uppercase text-emerald-400">
                                                  <span>Anticipo (50%):</span>
                                                  <span>Q{req.anticipo.toFixed(0)}</span>
                                               </div>
                                            </div>
                                         </div>

                                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                           {req.items.map((item: any, idx: number) => {
                                             const prod = products.find(p => p.id === item.id);
                                             return (
                                               <div key={idx} className="flex items-center gap-4 p-4 bg-zinc-50 rounded-2xl border-2 border-zinc-100">
                                                 <div className="w-16 h-16 bg-white rounded-xl border border-zinc-200 overflow-hidden shrink-0">
                                                   {prod?.images?.[0] ? <img src={prod.images[0]} className="w-full h-full object-cover" /> : <Package className="w-full h-full p-4 text-zinc-300" />}
                                                 </div>
                                                 <div className="min-w-0">
                                                   <h6 className="text-sm font-black truncate">{item.name}</h6>
                                                   <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{item.quantity} Unidad(es) • {item.size || 'Unica'}</p>
                                                   <p className="text-xs font-black text-indigo-600 mt-1">Q{item.price}</p>
                                                 </div>
                                               </div>
                                             );
                                           })}
                                         </div>

                                         <div className="flex justify-between items-center">
                                            <button 
                                              onClick={() => deleteOrder(req.id)}
                                              className="px-6 py-3 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                                            >
                                              <Trash2 className="w-4 h-4" /> Eliminar Registro
                                            </button>
                                            <button onClick={() => setExpandedOrderId(null)} className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all">
                                              <ChevronDown className="w-6 h-6 rotate-180" />
                                            </button>
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
