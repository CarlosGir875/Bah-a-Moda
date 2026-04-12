"use client";

import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { ArrowLeft, Package, TrendingUp, Wallet, Clock, CheckCircle, XCircle, User, MapPin } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminOrdersPage() {
  const { adminOrders, fetchAllOrders, updateOrderStatus, markOrderAsSeen } = useStore();
  const [activeTab, setActiveTab] = useState<"operaciones" | "pendientes" | "historial">("pendientes");

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
    pendingInbox: adminOrders.filter(o => o.estado === 'pendiente').length,
    activeOperations: adminOrders.filter(o => ['recibido', 'preparacion', 'en_transito'].includes(o.estado)).length
  };

  const inboxOrders = adminOrders.filter(o => o.estado === 'pendiente');
  const activeOrders = adminOrders.filter(o => ['recibido', 'preparacion', 'en_transito'].includes(o.estado));
  const historyOrders = adminOrders.filter(o => ['listo_entrega', 'cancelado'].includes(o.estado));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendiente': return <span className="px-2 py-0.5 rounded-md bg-slate-950 text-white text-[9px] font-black uppercase tracking-widest animate-pulse">New</span>;
      case 'recibido': return <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest">Confirmado</span>;
      case 'preparacion': return <span className="px-2 py-0.5 rounded-md bg-blue-500 text-white text-[9px] font-black uppercase tracking-widest">En Proceso</span>;
      case 'en_transito': return <span className="px-2 py-0.5 rounded-md bg-indigo-500 text-white text-[9px] font-black uppercase tracking-widest">En Camino</span>;
      case 'listo_entrega': return <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest">Entregado</span>;
      case 'cancelado': return <span className="px-2 py-0.5 rounded-md bg-red-500 text-white text-[9px] font-black uppercase tracking-widest">Cancelado</span>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f5] pb-24">
      {/* Header Compacto */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-md bg-white/90">
        <div className="max-w-[1600px] mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-xl transition-all">
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </Link>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tighter text-black flex items-center gap-3">
                Gestión de Pedidos
                {stats.pendingInbox > 0 && (
                  <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-bounce">
                    {stats.pendingInbox}
                  </span>
                )}
              </h1>
            </div>
          </div>

          {/* Stats de Barra Slim */}
          <div className="flex items-center gap-6 bg-gray-50 px-6 py-2 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-center md:text-left">
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Ventas</p>
              <p className="text-sm font-black text-slate-900">Q{stats.totalRevenue.toFixed(0)}</p>
            </div>
            <div className="w-px h-6 bg-gray-200" />
            <div className="text-center md:text-left">
              <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Ganancia</p>
              <p className="text-sm font-black text-indigo-600">Q{stats.totalProfit.toFixed(0)}</p>
            </div>
            <div className="w-px h-6 bg-gray-200" />
            <div className="text-center md:text-left">
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Pedidos Activos</p>
              <p className="text-sm font-black text-black">{stats.activeOperations}</p>
            </div>
          </div>
        </div>

        {/* Tabs de Navegación Compactas */}
        <div className="max-w-[1600px] mx-auto px-4 flex gap-8">
            {[
              { id: "pendientes", label: "Bandeja de Entrada", count: stats.pendingInbox, icon: Clock },
              { id: "operaciones", label: "Operaciones en curso", count: stats.activeOperations, icon: Package },
              { id: "historial", label: "Archivo / Log", count: historyOrders.length, icon: CheckCircle }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 relative ${
                  activeTab === tab.id ? "border-black text-black" : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[8px] ${activeTab === tab.id ? "bg-black text-white" : "bg-gray-100 text-gray-500"}`}>
                    {tab.count}
                  </span>
                )}
                {tab.id === 'pendientes' && adminOrders.filter(o => o.estado === 'pendiente' && !o.visto).length > 0 && (
                   <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                )}
              </button>
            ))}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 mt-8">
        {/* Renderizado de Secciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(activeTab === "pendientes" ? inboxOrders : activeTab === "operaciones" ? activeOrders : historyOrders).map((order) => (
            <div key={order.id} className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border-l-4 border-l-slate-900 overflow-hidden relative group">
              
              {/* Notificación de Nuevo */}
              {order.estado === 'pendiente' && !order.visto && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest shadow-lg z-10">
                  New Order
                </div>
              )}

              <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 group-hover:text-black group-hover:bg-slate-100 transition-all">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 leading-tight">{order.nombre_cliente}</h3>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        {new Date(order.created_at).toLocaleDateString('es-GT', { day: 'numeric', month: 'short' })}
                        {order.codigo_seguimiento && ` • #${order.codigo_seguimiento}`}
                      </p>
                    </div>
                 </div>
                 {getStatusBadge(order.estado)}
              </div>

              {/* Detalle del Pedido */}
              <div className="bg-slate-50 rounded-2xl p-4 flex-1 mb-4 space-y-3">
                 <div className="flex items-start gap-3">
                    <MapPin className="w-3.5 h-3.5 text-slate-300 mt-0.5" />
                    <p className="text-[10px] font-bold text-slate-700 leading-snug line-clamp-2">{order.ubicacion_entrega}</p>
                 </div>
                 
                 <div className="space-y-1.5 border-t border-slate-100 pt-3">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-[10px] font-bold text-slate-600">
                        <span className="line-clamp-1">{item.quantity}x {item.name} {item.size && `(${item.size})`}</span>
                        <span className="text-slate-400 flex-shrink-0">Q{item.price}</span>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Totales e Inversión */}
              <div className="grid grid-cols-3 gap-2 mb-4 bg-white p-2 rounded-xl border border-slate-100">
                 <div className="text-center">
                    <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">Total</p>
                    <p className="text-xs font-black text-black">Q{order.total}</p>
                 </div>
                 <div className="text-center border-x border-slate-100">
                    <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">Inversión</p>
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
                      className="w-full text-center bg-transparent text-xs font-black text-indigo-600 outline-none focus:bg-indigo-50 rounded"
                    />
                 </div>
                 <div className="text-center">
                    <p className="text-[7px] font-black text-indigo-400 uppercase mb-0.5">Ganancia</p>
                    <p className="text-xs font-black text-indigo-600">Q{order.ganancia}</p>
                 </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-1 gap-2">
                  {order.estado === 'pendiente' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'recibido')}
                      className="w-full bg-slate-950 text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 hover:bg-black shadow-lg shadow-black/10"
                    >
                      <CheckCircle className="w-4 h-4" /> Confirmar Pedido
                    </button>
                  )}
                  {order.estado === 'recibido' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'preparacion')}
                      className="w-full bg-blue-600 text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                    >
                      <Package className="w-4 h-4" /> Empezar Preparación
                    </button>
                  )}
                  {order.estado === 'preparacion' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'en_transito')}
                      className="w-full bg-indigo-600 text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"
                    >
                      <Truck className="w-4 h-4" /> Despachar / En Camino
                    </button>
                  )}
                  {order.estado === 'en_transito' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'listo_entrega')}
                      className="w-full bg-emerald-600 text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
                    >
                      <CheckCircle className="w-4 h-4" /> Entregado con éxito
                    </button>
                  )}
                </div>
                
                {['pendiente', 'recibido', 'preparacion'].includes(order.estado) && (
                  <button 
                    onClick={() => updateOrderStatus(order.id, 'cancelado')}
                    className="w-full bg-gray-50 text-gray-400 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-500 border border-transparent hover:border-red-100"
                  >
                    <XCircle className="w-3 h-3" /> Cancelar Pedido
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {(activeTab === "pendientes" ? inboxOrders : activeTab === "operaciones" ? activeOrders : historyOrders).length === 0 && (
             <div className="col-span-full py-32 flex flex-col items-center justify-center text-slate-300">
                <Package className="w-16 h-16 opacity-20 mb-4" />
                <p className="text-xs font-black uppercase tracking-[0.3em] italic">No hay pedidos en esta sección</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Icono extra faltante
function Truck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-5h-4l-2-3h-3.5" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}
