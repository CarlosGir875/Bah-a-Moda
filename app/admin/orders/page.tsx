"use client";

import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { ArrowLeft, Package, TrendingUp, Wallet, Clock, CheckCircle, XCircle, User, MapPin, Check, Truck, Download } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { generateInvoicePDF } from "@/lib/invoiceGenerator";
import { useRouter } from "next/navigation";

export default function AdminOrdersPage() {
  const { 
    adminOrders, fetchAllOrders, updateOrderStatus, 
    orderRequests, fetchOrderRequests, approveOrderRequest,
    markOrderAsSeen, isAdmin, authLoading 
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
          <div className="flex items-center gap-3 w-[250px] shrink-0">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0 ${isRequest ? 'bg-amber-500' : 'bg-black'}`}>
              {nombre.charAt(0)}
            </div>
            <div className="min-w-0">
              <h3 className="text-[11px] font-black uppercase tracking-tight text-zinc-950 truncate">{nombre}</h3>
              <p className="text-[9px] font-bold text-zinc-400">{telefono || "Sin teléfono"}</p>
            </div>
          </div>

          {/* 2. COL: PEDIDO (RESUMEN) */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-zinc-900 uppercase italic">{itemsCount} Productos</span>
              <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${isRequest ? 'bg-amber-100 text-amber-700' : 'bg-zinc-100 text-zinc-500'}`}>
                {isRequest ? 'Por Aprobar' : estado}
              </span>
            </div>
            <p className="text-[9px] font-medium text-zinc-400 truncate mt-0.5">📍 {ubicacion || "Ubicación no especificada"}</p>
          </div>

          {/* 3. COL: INVERSIÓN / TOTAL */}
          <div className="flex items-center gap-6 w-[180px] shrink-0 justify-end">
            <div className="text-right">
              <p className="text-[8px] font-black text-zinc-400 uppercase">Total</p>
              <p className="text-[11px] font-black text-zinc-950">Q{total}</p>
            </div>
            {!isRequest && (
              <div className="text-right">
                <p className="text-[8px] font-black text-zinc-400 uppercase">Costo</p>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-black text-indigo-400">Q</span>
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
                    className="w-14 bg-transparent border-b border-indigo-100 text-[11px] font-black text-indigo-600 outline-none text-right"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 4. COL: ACCIONES */}
          <div className="flex items-center gap-2 w-[240px] shrink-0 justify-end">
            {isRequest ? (
              <button 
                onClick={() => approveOrderRequest(id)}
                className="h-8 px-4 bg-zinc-950 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-sm"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Aprobar
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
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-2">Dominio Logístico Total</p>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-zinc-900 text-white p-4 rounded-2xl border border-black shadow-lg">
                <p className="text-[8px] font-black uppercase text-zinc-500 mb-1">Ventas Reales</p>
                <p className="text-xl font-black">Q{stats.totalRevenue}</p>
              </div>
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

      <div className="max-w-7xl mx-auto px-6 mt-8">
        {activeTab === "bandeja" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Clock className="w-4 h-4" /></div>
                <h2 className="text-lg font-black uppercase tracking-tight">Solicitudes Pendientes</h2>
             </div>
             <div className="space-y-3">
               {orderRequests.filter(r => r.estado === 'pendiente').length === 0 ? (
                 <div className="py-20 text-center bg-white rounded-3xl border border-zinc-100 border-dashed">
                   <Package className="w-8 h-8 text-zinc-200 mx-auto mb-4" />
                   <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Bandeja Vacía por ahora</p>
                 </div>
               ) : (
                 orderRequests.filter(r => r.estado === 'pendiente').map(req => renderOrderRow(req, 'request'))
               )}
             </div>
          </div>
        )}

        {activeTab === "logistica" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-zinc-900 text-white rounded-lg"><Truck className="w-4 h-4" /></div>
                <h2 className="text-lg font-black uppercase tracking-tight">En Preparación & Ruta</h2>
             </div>
             <div className="space-y-3">
               {adminOrders.filter(o => !['listo_entrega', 'cancelado'].includes(o.estado)).length === 0 ? (
                 <div className="py-20 text-center bg-white rounded-3xl border border-zinc-100 border-dashed">
                   <CheckCircle className="w-8 h-8 text-zinc-200 mx-auto mb-4" />
                   <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Toda la logística al día</p>
                 </div>
               ) : (
                 adminOrders.filter(o => !['listo_entrega', 'cancelado'].includes(o.estado)).map(order => renderOrderRow(order, 'order'))
               )}
             </div>
          </div>
        )}

        {activeTab === "historial" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-zinc-100 text-zinc-400 rounded-lg"><Package className="w-4 h-4" /></div>
                <h2 className="text-lg font-black uppercase tracking-tight">Archivo de Pedidos</h2>
             </div>
             <div className="space-y-3">
               {adminOrders.filter(o => ['listo_entrega', 'cancelado'].includes(o.estado)).map(order => renderOrderRow(order, 'order'))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendiente': 
        return (
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-widest border border-slate-200 shadow-sm">
            <User className="w-3.5 h-3.5" /> Pendiente
          </span>
        );
      case 'recibido': 
        return (
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-widest border border-amber-200 shadow-sm">
            <CheckCircle className="w-3.5 h-3.5" /> Confirmado
          </span>
        );
      case 'preparacion': 
        return (
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-900 text-[10px] font-black uppercase tracking-widest border border-orange-200 shadow-sm">
            <Clock className="w-3.5 h-3.5" /> Empaquetando
          </span>
        );
      case 'en_transito': 
        return (
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 text-violet-900 text-[10px] font-black uppercase tracking-widest border border-violet-200 shadow-sm animate-pulse">
            <Truck className="w-3.5 h-3.5" /> En Tránsito
          </span>
        );
      case 'listo_entrega': 
        return (
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase tracking-widest border border-emerald-200 shadow-sm italic">
            <div className="flex items-center relative gap-0.5">
              <Truck className="w-3.5 h-3.5" />
              <Check className="w-2.5 h-2.5 absolute -right-1 -top-1 font-black stroke-[4] fill-white" />
            </div> Entregado
          </span>
        );
      case 'cancelado': 
        return (
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100 text-rose-900 text-[10px] font-black uppercase tracking-widest border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> Cancelado
          </span>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-32">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div>
            <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black mb-6 transition-all bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
              <ArrowLeft className="w-3.5 h-3.5" /> Volver al Tablero
            </Link>
            <h1 className="text-5xl font-black uppercase tracking-tighter text-black mb-2">Gestión de Pedidos</h1>
            <p className="text-sm font-bold text-zinc-400 uppercase tracking-[0.2em]">Logística Activa & Historial</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {["todos", "pendiente", "recibido", "preparacion", "en_transito", "listo_entrega", "cancelado"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all border relative ${
                  filter === f ? "bg-black text-white border-black shadow-2xl scale-105" : "bg-white text-zinc-400 border-zinc-100 hover:border-zinc-300"
                }`}
              >
                {f}
                {f === 'pendiente' && adminOrders.filter(o => o.estado === 'pendiente' && !o.visto).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-ping" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-16">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {[
            { 
              label: "Ventas (Caja Real)", 
              val: `Q${stats.totalRevenue.toFixed(0)}`, 
              icon: TrendingUp, 
              color: "text-emerald-600", 
              bg: "bg-emerald-50",
              action: () => setFilter('listo_entrega'),
              desc: "Dinero ya cobrado y entregado"
            },
            { 
              label: "Dinero en Ruta", 
              val: `Q${adminOrders.filter(o => o.estado === 'en_transito').reduce((acc, curr) => acc + Number(curr.total), 0).toFixed(0)}`, 
              icon: Truck, 
              color: "text-indigo-600", 
              bg: "bg-indigo-50",
              action: () => setFilter('en_transito'),
              desc: "Pedidos enviados por cobrar"
            },
            { 
              label: "Ganancia Neta", 
              val: `Q${stats.totalProfit.toFixed(0)}`, 
              icon: Package, 
              color: "text-blue-600", 
              bg: "bg-blue-50",
              action: () => setFilter('todos'),
              desc: "Beneficio libre de inversión"
            },
            { 
              label: "Por Aprobar", 
              val: stats.pendingOrders, 
              icon: Clock, 
              color: "text-amber-600", 
              bg: "bg-amber-50",
              action: () => router.push('/admin/requests'),
              desc: "Nuevas solicitudes esperando"
            }
          ].map((s, i) => (
            <button 
              key={i} 
              onClick={s.action}
              className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all text-left group w-full"
            >
               <div className={`${s.bg} ${s.color} w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform`}>
                  <s.icon className="w-8 h-8" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">{s.label}</p>
               <p className="text-4xl font-black text-black tracking-tighter italic mb-2">{s.val}</p>
               <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">{s.desc}</p>
            </button>
          ))}
        </div>

        {/* SECCIÓN 1: PEDIDOS PENDIENTES DE CONFIRMACIÓN (PRIORIDAD ALTA) */}
        {pendingConfirmation.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-8">
               <div className="bg-red-500 w-3 h-3 rounded-full animate-ping" />
               <h2 className="text-2xl font-black uppercase tracking-tighter text-red-600">Por Confirmar (Prioridad Alta)</h2>
               <div className="h-px flex-1 bg-red-100" />
            </div>
            {renderOrderList(pendingConfirmation, "", false)}
          </div>
        )}

        {/* SECCIÓN 2: LOGÍSTICA EN CURSO */}
        {renderOrderList(inProgressOrders, "Logística en Curso (En Preparación / Ruta)")}

        {/* Sección de Historial de Entregas */}
        {renderOrderList(finishedOrders, "Historial de Entregas & Pedidos Finalizados", false)}

        {/* Monthly Breakdown Section (Solo al final) */}
        <div className="bg-white rounded-[4rem] p-12 border border-slate-100 mb-12 shadow-sm">
           <h3 className="text-lg font-black uppercase tracking-[0.3em] text-zinc-300 mb-10 border-b border-slate-50 pb-6 text-center">Cierre Financiero Mensual</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from(new Set(adminOrders.map(o => new Date(o.created_at).toLocaleString('es-GT', { month: 'long', year: 'numeric' })))).map(month => {
                const monthOrders = adminOrders.filter(o => new Date(o.created_at).toLocaleString('es-GT', { month: 'long', year: 'numeric' }) === month);
                const monthRevenue = monthOrders.reduce((acc, curr) => acc + (curr.estado === 'listo_entrega' ? Number(curr.total) : 0), 0);
                const monthProfit = monthOrders.reduce((acc, curr) => acc + (curr.estado === 'listo_entrega' ? Number(curr.ganancia) : 0), 0);
                
                return (
                  <div key={month} className="flex items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] hover:bg-slate-900 group transition-all duration-500">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black group-hover:text-white transition-colors">{month}</p>
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">{monthOrders.length} Reservas</p>
                    </div>
                    <div className="flex gap-10 text-right">
                       <div>
                         <p className="text-[9px] font-black text-zinc-400 uppercase mb-1">Ventas</p>
                         <p className="text-lg font-black text-black group-hover:text-white transition-colors">Q{monthRevenue.toFixed(0)}</p>
                       </div>
                       <div>
                         <p className="text-[9px] font-black text-indigo-400 uppercase mb-1">Ganancia</p>
                         <p className="text-lg font-black text-indigo-600 group-hover:text-white transition-colors">Q{monthProfit.toFixed(0)}</p>
                       </div>
                    </div>
                  </div>
                );
              })}
           </div>
        </div>
      </div>
    </div>
  );
}
