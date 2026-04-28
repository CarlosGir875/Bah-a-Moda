"use client";

import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, MapPin, Truck, Download } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { generateInvoicePDF } from "@/lib/invoiceGenerator";
import { useRouter } from "next/navigation";

export default function AdminOrdersPage() {
  const { 
    adminOrders, fetchAllOrders, updateOrderStatus, 
    orderRequests, fetchOrderRequests, approveOrderRequest,
    isAdmin, authLoading 
  } = useStore();
  
  const [activeTab, setActiveTab] = useState("bandeja"); // bandeja, logistica, historial
  const router = useRouter();

  useEffect(() => {
    fetchAllOrders();
    fetchOrderRequests();
  }, [fetchAllOrders, fetchOrderRequests]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-spin rounded-full h-8 w-8 border-[3px] border-gray-100 border-t-black" /></div>;
  if (!isAdmin) return <div className="min-h-screen flex items-center justify-center">Acceso Denegado</div>;

  const stats = {
    totalRevenue: adminOrders.reduce((acc, curr) => acc + (curr.estado === 'listo_entrega' ? Number(curr.total) : 0), 0),
    pendingRequests: orderRequests.filter(r => r.estado === 'pendiente').length,
    activeLogistics: adminOrders.filter(o => !['listo_entrega', 'cancelado'].includes(o.estado)).length
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'recibido': return <span className="text-[8px] font-black px-2 py-0.5 rounded bg-amber-100 text-amber-700 uppercase">Confirmado</span>;
      case 'preparacion': return <span className="text-[8px] font-black px-2 py-0.5 rounded bg-orange-100 text-orange-700 uppercase">Empacando</span>;
      case 'en_transito': return <span className="text-[8px] font-black px-2 py-0.5 rounded bg-violet-100 text-violet-700 uppercase animate-pulse">En Ruta</span>;
      case 'listo_entrega': return <span className="text-[8px] font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 uppercase">Entregado</span>;
      case 'cancelado': return <span className="text-[8px] font-black px-2 py-0.5 rounded bg-rose-100 text-rose-700 uppercase">Cancelado</span>;
      default: return <span className="text-[8px] font-black px-2 py-0.5 rounded bg-zinc-100 text-zinc-500 uppercase">{status}</span>;
    }
  };

  const renderOrderRow = (order: any, type: 'request' | 'order') => {
    const isRequest = type === 'request';
    const id = order.id;
    const nombre = isRequest ? order.cliente_nombre : order.nombre_cliente;
    const telefono = isRequest ? order.cliente_telefono : (order as any).cliente_telefono || "";
    const total = order.total;
    const itemsCount = order.items?.length || 0;
    const ubicacion = isRequest ? order.ubicacion : order.ubicacion_entrega;
    const estado = order.estado;

    const openWhatsApp = () => {
      if (!telefono) return;
      const cleanPhone = telefono.replace(/\D/g, '');
      window.open(`https://wa.me/502${cleanPhone}`, '_blank');
    };

    return (
      <div key={id} className="bg-white border-b border-zinc-100 hover:bg-zinc-50/50 transition-all group">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          
          {/* 1. COL: CLIENTE */}
          <div className="flex items-center gap-3 w-[220px] shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0 ${isRequest ? 'bg-amber-500' : 'bg-black'}`}>
              {nombre.charAt(0)}
            </div>
            <div className="min-w-0">
              <h3 className="text-[10px] font-black uppercase tracking-tight text-zinc-950 truncate">{nombre}</h3>
              <p className="text-[8px] font-bold text-zinc-400">{telefono || "Sin teléfono"}</p>
            </div>
          </div>

          {/* 2. COL: PEDIDO */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-zinc-900 uppercase italic">{itemsCount} Items</span>
              {getStatusBadge(isRequest ? 'pendiente' : estado)}
            </div>
            <p className="text-[8px] font-medium text-zinc-400 truncate mt-0.5">📍 {ubicacion || "Ubicación no especificada"}</p>
          </div>

          {/* 3. COL: DINERO */}
          <div className="flex items-center gap-6 w-[160px] shrink-0 justify-end">
            <div className="text-right">
              <p className="text-[8px] font-black text-zinc-400 uppercase">Total</p>
              <p className="text-[10px] font-black text-zinc-950">Q{total}</p>
            </div>
            {!isRequest && (
              <div className="text-right">
                <p className="text-[8px] font-black text-zinc-400 uppercase">Costo</p>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-black text-indigo-400">Q</span>
                  <input 
                    type="number" 
                    defaultValue={order.inversion}
                    onBlur={async (e) => {
                      const val = Number(e.target.value);
                      if (val !== order.inversion) {
                        await supabase.from('pedidos').update({ inversion: val }).eq('id', id);
                        fetchAllOrders();
                      }
                    }}
                    className="w-12 bg-transparent border-b border-indigo-100 text-[10px] font-black text-indigo-600 outline-none text-right"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 4. COL: ACCIONES */}
          <div className="flex items-center gap-2 w-[280px] shrink-0 justify-end">
            {isRequest ? (
              <button 
                onClick={() => approveOrderRequest(id)}
                className="h-8 px-4 bg-zinc-950 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-2"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Aprobar Gala
              </button>
            ) : (
              <select 
                value={estado}
                onChange={(e) => updateOrderStatus(id, e.target.value)}
                className="h-8 px-2 bg-zinc-100 border border-zinc-200 rounded-lg text-[9px] font-black uppercase outline-none cursor-pointer hover:border-zinc-400 transition-all"
              >
                <option value="recibido">Confirmado</option>
                <option value="preparacion">Empacando</option>
                <option value="en_transito">En Ruta</option>
                <option value="listo_entrega">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            )}

            <button 
              onClick={() => {
                const invoiceData = {
                  id: order.id, cliente_nombre: nombre,
                  cliente_telefono: telefono || "N/A",
                  ubicacion_entrega: ubicacion,
                  items: order.items, total: total,
                  anticipo: order.anticipo || (total * 0.5)
                };
                generateInvoicePDF(invoiceData);
              }}
              className="h-8 px-3 bg-zinc-900 text-white rounded-lg text-[9px] font-black uppercase flex items-center gap-2 hover:bg-zinc-700 transition-all shadow-sm"
            >
              <Download className="w-3 h-3" /> PDF
            </button>

            <button 
              onClick={openWhatsApp}
              className="h-8 px-3 bg-emerald-500 text-white rounded-lg text-[9px] font-black uppercase flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-sm"
            >
              <XCircle className="w-3 h-3 rotate-45" /> WhatsApp
            </button>
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-32">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <Link href="/admin" className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-black mb-4 transition-all">
                <ArrowLeft className="w-3.5 h-3.5" /> Volver al Tablero
              </Link>
              <h1 className="text-4xl font-black uppercase tracking-tighter text-black leading-none">Centro de Operaciones Gala</h1>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-2">Gestión Consolidada</p>
            </div>
            
            <div className="bg-zinc-900 text-white p-4 rounded-2xl border border-black shadow-lg">
              <p className="text-[8px] font-black uppercase text-zinc-500 mb-1">Caja Real (Entregas)</p>
              <p className="text-xl font-black">Q{stats.totalRevenue}</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mt-10 p-1 bg-zinc-100 rounded-2xl w-fit border border-zinc-200">
            <button 
              onClick={() => setActiveTab("bandeja")}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'bandeja' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
            >
              📥 Bandeja {stats.pendingRequests > 0 && <span className="bg-amber-500 text-white px-1.5 py-0.5 rounded-md text-[8px] animate-pulse">{stats.pendingRequests}</span>}
            </button>
            <button 
              onClick={() => setActiveTab("logistica")}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'logistica' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
            >
              🚚 Logística {stats.activeLogistics > 0 && <span className="bg-zinc-950 text-white px-1.5 py-0.5 rounded-md text-[8px]">{stats.activeLogistics}</span>}
            </button>
            <button 
              onClick={() => setActiveTab("historial")}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'historial' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
            >
              ✅ Historial
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8">
        {activeTab === "bandeja" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="px-6 space-y-px">
               {orderRequests.filter(r => r.estado === 'pendiente').length === 0 ? (
                 <div className="py-20 text-center bg-white rounded-3xl border border-zinc-100 border-dashed mx-6">
                   <Package className="w-8 h-8 text-zinc-200 mx-auto mb-4" />
                   <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Bandeja Vacía</p>
                 </div>
               ) : (
                 orderRequests.filter(r => r.estado === 'pendiente').map(req => renderOrderRow(req, 'request'))
               )}
             </div>
          </div>
        )}

        {activeTab === "logistica" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="space-y-px">
               {adminOrders.filter(o => !['listo_entrega', 'cancelado'].includes(o.estado)).length === 0 ? (
                 <div className="py-20 text-center bg-white rounded-3xl border border-zinc-100 border-dashed mx-6">
                   <CheckCircle className="w-8 h-8 text-zinc-200 mx-auto mb-4" />
                   <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Sin logística activa</p>
                 </div>
               ) : (
                 adminOrders.filter(o => !['listo_entrega', 'cancelado'].includes(o.estado)).map(order => renderOrderRow(order, 'order'))
               )}
             </div>
          </div>
        )}

        {activeTab === "historial" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="space-y-px">
               {adminOrders.filter(o => ['listo_entrega', 'cancelado'].includes(o.estado)).length === 0 ? (
                 <div className="py-20 text-center bg-white rounded-3xl border border-zinc-100 border-dashed mx-6">
                   <Package className="w-8 h-8 text-zinc-200 mx-auto mb-4" />
                   <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Historial Vacío</p>
                 </div>
               ) : (
                 adminOrders.filter(o => ['listo_entrega', 'cancelado'].includes(o.estado)).map(order => renderOrderRow(order, 'order'))
               )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
