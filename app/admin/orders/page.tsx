"use client";

import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { ArrowLeft, Package, TrendingUp, Wallet, Clock, CheckCircle, XCircle, User, MapPin, Check, Truck } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminOrdersPage() {
  const { adminOrders, fetchAllOrders, updateOrderStatus, markOrderAsSeen } = useStore();
  const [filter, setFilter] = useState("todos");

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  // Marcar como visto automáticamente
  useEffect(() => {
    const unseenPendientes = adminOrders.filter(o => o.estado === 'pendiente' && !o.visto);
    if (unseenPendientes.length > 0) {
      const timer = setTimeout(() => {
        unseenPendientes.forEach(o => markOrderAsSeen(o.id));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [adminOrders, markOrderAsSeen]);

  const stats = {
    totalRevenue: adminOrders.reduce((acc, curr) => acc + (curr.estado === 'listo_entrega' ? Number(curr.total) : 0), 0),
    totalInvestment: adminOrders.reduce((acc, curr) => acc + Number(curr.inversion), 0),
    totalProfit: adminOrders.reduce((acc, curr) => acc + (curr.estado === 'listo_entrega' ? Number(curr.ganancia) : 0), 0),
    pendingOrders: adminOrders.filter(o => o.estado === 'recibido').length
  };

  const filteredOrders = filter === "todos" 
    ? adminOrders 
    : adminOrders.filter(o => o.estado === filter);

  // Separar Pedidos Activos de Entregados para la vista general
  const pendingConfirmation = filteredOrders.filter(o => o.estado === 'pendiente');
  const inProgressOrders = filteredOrders.filter(o => o.estado !== 'pendiente' && o.estado !== 'listo_entrega' && o.estado !== 'cancelado');
  const finishedOrders = filteredOrders.filter(o => o.estado === 'listo_entrega' || o.estado === 'cancelado');

  const renderOrderList = (orders: any[], title: string, showEmpty = true) => {
    if (orders.length === 0 && !showEmpty) return null;
    
    return (
      <div className="space-y-6 mb-16">
        <div className="flex items-center gap-4 px-2">
           <h2 className="text-xl font-black uppercase tracking-tighter text-black">{title}</h2>
           <div className="h-px flex-1 bg-zinc-100" />
           <span className="text-[10px] font-black text-zinc-400 bg-white px-3 py-1 rounded-full border border-zinc-50">{orders.length}</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-[3rem] border border-gray-100 p-8 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
              {/* Indicator Pulse for new orders */}
              {order.estado === 'pendiente' && !order.visto && (
                <div className="absolute top-0 right-0 w-32 h-8 bg-red-500 text-white text-[8px] font-black uppercase flex items-center justify-center tracking-widest rounded-bl-3xl shadow-lg z-10 animate-pulse">
                  Nuevo Pedido
                </div>
              )}

              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-black leading-tight mb-2">{order.nombre_cliente}</h3>
                    <div className="flex items-center gap-3">
                      <p className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                        {new Date(order.created_at).toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      {!order.cliente_id && (
                        <span className="text-[8px] font-black bg-zinc-100 text-zinc-500 px-2 py-1 rounded uppercase tracking-widest">Invitado</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(order.estado)}
                  {order.codigo_seguimiento && (
                    <p className="text-[14px] font-black text-black bg-zinc-950 text-white px-4 py-1.5 rounded-xl shadow-lg">#{order.codigo_seguimiento}</p>
                  )}
                </div>
              </div>

              <div className="bg-slate-50/50 rounded-[2.5rem] p-8 mb-10 border border-slate-100">
                 <div className="flex items-start gap-4 mb-8">
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                      <MapPin className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1.5">{order.tipo_entrega === 'domicilio' ? 'Entrega a Domicilio' : '📍 Punto de Encuentro (Seguro)'}</p>
                      <p className="text-sm font-bold text-slate-800 leading-relaxed">{order.ubicacion_entrega}</p>
                    </div>
                 </div>
                 
                 <div className="border-t border-slate-100 pt-8">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Detalle de Compra</p>
                      <span className="text-[9px] font-black bg-black text-white px-2 py-0.5 rounded-full">{order.items.length} Items</span>
                    </div>
                    <div className="space-y-3">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 group-hover:border-indigo-100 transition-colors">
                          <span className="text-sm font-black text-slate-900 italic">
                             <span className="text-indigo-600 text-lg mr-2">x{item.quantity}</span> {item.name} {item.size && <span className="text-[10px] not-italic ml-2 bg-slate-50 px-2 py-1 rounded text-slate-400">Talla: {item.size}</span>}
                          </span>
                          <span className="text-sm font-black text-slate-400">Q{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                 </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-8 mb-10 px-4">
                  <div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Total Pedido</p>
                    <p className="text-2xl font-black text-zinc-950">Q{order.total}</p>
                  </div>
                  <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100/50 flex items-center gap-8">
                    <div>
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 text-center">Inversión Costo</p>
                      <div className="flex items-center gap-1">
                         <span className="text-indigo-300 font-bold text-lg italic">Q</span>
                         <input 
                           type="number" 
                           defaultValue={order.inversion}
                           onBlur={async (e) => {
                             const val = Number(e.target.value);
                             if (val !== order.inversion) {
                               await supabase.from('pedidos').update({ inversion: val }).eq('id', order.id);
                               fetchAllOrders();
                             }
                           }}
                           className="w-24 bg-white border border-indigo-100 rounded-xl px-3 py-2 text-md font-black text-indigo-900 outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-center"
                         />
                      </div>
                    </div>
                    <div className="w-px h-10 bg-indigo-100" />
                    <div className="text-center">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Ganancia Est.</p>
                      <p className="text-2xl font-black text-indigo-600">Q{order.ganancia}</p>
                    </div>
                  </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col md:flex-row gap-3">
                  {order.estado === 'pendiente' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'recibido')}
                      className="flex-1 bg-black text-white py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl hover:bg-zinc-800 flex items-center justify-center gap-3 hover:scale-[1.01]"
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-400" /> Confirmar Pedido (Generar ID)
                    </button>
                  )}
                  {order.estado === 'recibido' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'en_transito')}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3"
                    >
                      <Truck className="w-5 h-5" /> Despachar (En Camino)
                    </button>
                  )}








                  {order.estado === 'en_transito' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'listo_entrega')}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3"
                    >
                      <div className="flex items-center relative">
                        <Truck className="w-5 h-5 mr-1" />
                        <CheckCircle className="w-3 h-3 absolute -right-1 -top-1" />
                      </div> Marcar como Entregado
                    </button>
                  )}
                </div>
                
                {['pendiente', 'recibido'].includes(order.estado) && (
                  <button 
                    onClick={() => updateOrderStatus(order.id, 'cancelado')}
                    className="w-full bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 py-4 rounded-[1.2rem] text-[8px] font-black uppercase tracking-[0.2em] transition-all border border-transparent hover:border-rose-100 flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" /> Cancelar Pedido Permanentemente
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
            { label: "Ventas Totales", val: `Q${stats.totalRevenue.toFixed(0)}`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Inversión Admin", val: `Q${stats.totalInvestment.toFixed(0)}`, icon: Wallet, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Ganancia Real", val: `Q${stats.totalProfit.toFixed(0)}`, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Nuevas Solicitudes", val: stats.pendingOrders, icon: Clock, color: "text-slate-600", bg: "bg-slate-50" }
          ].map((s, i) => (
            <div key={i} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all">
               <div className={`${s.bg} ${s.color} w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-inner`}>
                  <s.icon className="w-8 h-8" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">{s.label}</p>
               <p className="text-4xl font-black text-black tracking-tighter italic">{s.val}</p>
            </div>
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
