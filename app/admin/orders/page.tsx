"use client";

import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { ArrowLeft, Package, TrendingUp, Wallet, Clock, CheckCircle, XCircle, User, MapPin, Check, Truck, Download } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { generateInvoicePDF } from "@/lib/invoiceGenerator";
import { useRouter } from "next/navigation";

export default function AdminOrdersPage() {
  const { adminOrders, fetchAllOrders, updateOrderStatus, markOrderAsSeen } = useStore();
  const [filter, setFilter] = useState("todos");
  const router = useRouter();

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
      <div className="space-y-4 mb-12">
        <div className="flex items-center gap-3 px-2">
           <h2 className="text-sm font-black uppercase tracking-widest text-zinc-900">{title}</h2>
           <div className="h-[1px] flex-1 bg-zinc-200/50" />
           <span className="text-[10px] font-black text-zinc-400 bg-white px-2 py-0.5 rounded-md border border-zinc-100">{orders.length}</span>
        </div>
        
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-zinc-100 p-4 shadow-sm hover:shadow-md transition-all group">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* 1. INFO CLIENTE (IZQUIERDA) */}
                <div className="flex items-center gap-4 min-w-[200px]">
                  <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0">
                    {order.nombre_cliente.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-black uppercase tracking-tight text-zinc-950 truncate">{order.nombre_cliente}</h3>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase mt-0.5">
                      {new Date(order.created_at).toLocaleDateString('es-GT', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>

                {/* 2. DETALLE PRODUCTOS (CENTRO) */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-1.5">
                    {order.items.slice(0, 3).map((item: any, idx: number) => (
                      <span key={idx} className="text-[8px] font-black bg-zinc-100 px-2 py-1 rounded-lg text-zinc-600 uppercase truncate max-w-[120px]">
                        {item.quantity}x {item.name.split(' ')[0]}
                      </span>
                    ))}
                    {order.items.length > 3 && <span className="text-[8px] font-black text-zinc-300">+{order.items.length - 3}</span>}
                  </div>
                  <p className="text-[9px] font-bold text-zinc-400 mt-1.5 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" /> {order.ubicacion_entrega?.slice(0, 40)}...
                  </p>
                </div>

                {/* 3. FINANZAS (DERECHA) */}
                <div className="flex items-center gap-4 px-4 bg-zinc-50/50 rounded-xl py-2 border border-zinc-100">
                  <div className="text-right">
                    <p className="text-[8px] font-black text-zinc-400 uppercase mb-0.5">Total</p>
                    <p className="text-xs font-black text-zinc-950">Q{order.total}</p>
                  </div>
                  <div className="w-px h-6 bg-zinc-200" />
                  <div>
                    <p className="text-[8px] font-black text-zinc-400 uppercase mb-0.5">Inversión</p>
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
                       className="w-16 bg-white border border-zinc-200 rounded px-1.5 py-0.5 text-[10px] font-black text-indigo-600 outline-none focus:ring-1 focus:ring-indigo-300"
                    />
                  </div>
                </div>

                {/* 4. ACCIONES (FINAL) */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    {order.estado === 'pendiente' && (
                      <button onClick={() => updateOrderStatus(order.id, 'recibido')} className="h-9 px-4 bg-zinc-950 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5" /> Confirmar
                      </button>
                    )}
                    {order.estado === 'recibido' && (
                      <button onClick={() => updateOrderStatus(order.id, 'preparacion')} className="h-9 px-4 bg-amber-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" /> Empacar
                      </button>
                    )}
                    {order.estado === 'preparacion' && (
                      <button onClick={() => updateOrderStatus(order.id, 'en_transito')} className="h-9 px-4 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2">
                        <Truck className="w-3.5 h-3.5" /> En Ruta
                      </button>
                    )}
                    {order.estado === 'en_transito' && (
                      <button onClick={() => updateOrderStatus(order.id, 'listo_entrega')} className="h-9 px-4 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5" /> Entregado
                      </button>
                    )}

                    <button 
                      onClick={() => {
                        const invoiceData = {
                          id: order.id, cliente_nombre: order.nombre_cliente,
                          cliente_telefono: order.cliente_telefono || "N/A",
                          ubicacion_entrega: order.ubicacion_entrega,
                          items: order.items, total: order.total,
                          anticipo: order.anticipo || (order.total * 0.5)
                        };
                        generateInvoicePDF(invoiceData);
                      }}
                      className="w-9 h-9 bg-zinc-100 text-zinc-950 rounded-xl flex items-center justify-center hover:bg-zinc-200 transition-all"
                      title="PDF Gala"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  {getStatusBadge(order.estado)}
                </div>

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
