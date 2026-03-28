"use client";

import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { ArrowLeft, Package, TrendingUp, Wallet, Clock, CheckCircle, XCircle, User, MapPin } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminOrdersPage() {
  const { adminOrders, fetchAllOrders, updateOrderStatus } = useStore();
  const [filter, setFilter] = useState("todos");

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  const stats = {
    totalRevenue: adminOrders.reduce((acc, curr) => acc + (curr.estado === 'completado' ? Number(curr.total) : 0), 0),
    totalInvestment: adminOrders.reduce((acc, curr) => acc + Number(curr.inversion), 0),
    totalProfit: adminOrders.reduce((acc, curr) => acc + (curr.estado === 'completado' ? Number(curr.ganancia) : 0), 0),
    pendingOrders: adminOrders.filter(o => o.estado === 'pendiente').length
  };

  const filteredOrders = filter === "todos" 
    ? adminOrders 
    : adminOrders.filter(o => o.estado === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendiente': return <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest border border-amber-200">Pendiente</span>;
      case 'pagado_parcial': return <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest border border-blue-200">Anticipo</span>;
      case 'completado': return <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest border border-green-200">Completado</span>;
      case 'cancelado': return <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-widest border border-red-200">Cancelado</span>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black mb-4 transition-all">
              <ArrowLeft className="w-3.5 h-3.5" /> Volver al Panel
            </Link>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-black">Gestión de Pedidos</h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Control financiero y logístico</p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {["todos", "pendiente", "completado", "cancelado"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                  filter === f ? "bg-black text-white border-black shadow-xl" : "bg-white text-gray-400 border-gray-100 hover:border-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Ventas Totales", val: `Q${stats.totalRevenue.toFixed(2)}`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
            { label: "Inversión Total", val: `Q${stats.totalInvestment.toFixed(2)}`, icon: Wallet, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Ganancia Real", val: `Q${stats.totalProfit.toFixed(2)}`, icon: Package, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Pedidos Pendientes", val: stats.pendingOrders, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" }
          ].map((s, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
               <div className={`${s.bg} ${s.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
                  <s.icon className="w-6 h-6" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{s.label}</p>
               <p className="text-3xl font-black text-black tracking-tighter">{s.val}</p>
            </div>
          ))}
        </div>

        {/* Monthly Breakdown Section */}
        <div className="bg-white rounded-[3rem] p-8 border border-gray-100 mb-12 shadow-sm">
           <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-6 border-b border-gray-50 pb-4">Reporte de Ganancias por Mes</h3>
           <div className="space-y-4">
              {Array.from(new Set(adminOrders.map(o => new Date(o.created_at).toLocaleString('es-GT', { month: 'long', year: 'numeric' })))).map(month => {
                const monthOrders = adminOrders.filter(o => new Date(o.created_at).toLocaleString('es-GT', { month: 'long', year: 'numeric' }) === month);
                const monthRevenue = monthOrders.reduce((acc, curr) => acc + (curr.estado === 'completado' ? Number(curr.total) : 0), 0);
                const monthProfit = monthOrders.reduce((acc, curr) => acc + (curr.estado === 'completado' ? Number(curr.ganancia) : 0), 0);
                
                return (
                  <div key={month} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-black">{month}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">{monthOrders.length} pedidos realizados</p>
                    </div>
                    <div className="flex gap-8 text-right">
                       <div>
                         <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Ventas</p>
                         <p className="text-xs font-black text-black">Q{monthRevenue.toFixed(2)}</p>
                       </div>
                       <div>
                         <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">Ganancia</p>
                         <p className="text-xs font-black text-indigo-600">Q{monthProfit.toFixed(2)}</p>
                       </div>
                    </div>
                  </div>
                );
              })}
           </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          <h2 className="text-xl font-black uppercase tracking-tighter text-black px-2">Lista de Pedidos ({filteredOrders.length})</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-[3rem] border border-gray-100 p-8 shadow-sm hover:shadow-2xl transition-all duration-500 group">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-black border border-gray-100">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-tight text-black leading-none mb-1">{order.nombre_cliente}</h3>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-bold text-gray-400 leading-none">{new Date(order.created_at).toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        {!order.cliente_id && (
                          <span className="text-[8px] font-black bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded uppercase border border-indigo-100">Invitado</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(order.estado)}
                </div>

                <div className="bg-gray-50/50 rounded-[2rem] p-6 mb-8 border border-gray-100">
                   <div className="flex items-start gap-4 mb-4">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">{order.tipo_entrega === 'domicilio' ? 'Entrega a Domicilio' : 'Punto de Encuentro'}</p>
                        <p className="text-xs font-bold text-black">{order.ubicacion_entrega}</p>
                      </div>
                   </div>
                   <div className="border-t border-gray-100 pt-4 mt-4">
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">Productos pidiendo</p>
                      <div className="space-y-2">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-xs font-bold text-black">
                            <span>{item.quantity}x {item.name} {item.size && `(${item.size})`}</span>
                            <span className="text-gray-400 font-black">Q{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-6 mb-8 px-2">
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total</p>
                      <p className="text-xl font-black text-black">Q{order.total}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Inversión</p>
                      <div className="flex items-center gap-2">
                         <span className="text-gray-400 font-bold text-sm">Q</span>
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
                           className="w-20 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 text-sm font-black text-black outline-none focus:border-indigo-300 transition-all"
                         />
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Ganancia</p>
                      <p className="text-xl font-black text-indigo-600">Q{order.ganancia}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {order.estado !== 'completado' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'completado')}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" /> Finalizar Venta
                      </button>
                    )}
                    {order.estado !== 'cancelado' && order.estado !== 'completado' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'cancelado')}
                        className="flex-1 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-gray-100 hover:border-red-100 flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" /> Cancelar
                      </button>
                    )}
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
