"use client";

import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { ArrowLeft, User, Phone, MapPin, CreditCard, Search, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function AdminUsersPage() {
  const { allUsers, fetchAllUsers, adminOrders, fetchAllOrders } = useStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAllUsers();
    fetchAllOrders();
  }, [fetchAllUsers, fetchAllOrders]);

  const filteredUsers = allUsers.filter(u => 
    u.nombre_completo?.toLowerCase().includes(search.toLowerCase()) ||
    u.celular?.includes(search) ||
    u.dpi?.includes(search)
  );

  const getUserOrderStats = (userId: string) => {
    const userOrders = adminOrders.filter(o => o.cliente_id === userId);
    const completed = userOrders.filter(o => o.estado === 'listo_entrega').length;
    const totalSpent = userOrders.reduce((acc, curr) => acc + (curr.estado === 'listo_entrega' ? Number(curr.total) : 0), 0);
    return { count: userOrders.length, completed, totalSpent };
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
            <h1 className="text-4xl font-black uppercase tracking-tighter text-black">Base de Clientes</h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Gestión de usuarios registrados</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Buscar por nombre, tel o DPI..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-black transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((u) => {
            const stats = getUserOrderStats(u.id);
            return (
              <div key={u.id} className="bg-white rounded-[3rem] border border-gray-100 p-8 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-gray-900 rounded-[1.5rem] flex items-center justify-center text-white overflow-hidden shadow-xl">
                    {u.avatar_url ? (
                      <img src={u.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-black uppercase tracking-tighter">{u.nombre_completo?.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-black leading-none mb-1 line-clamp-1">{u.nombre_completo}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{u.rol === 'admin' ? '💎 Administrador' : '👗 Cliente Premium'}</p>
                  </div>
                </div>

                <div className="space-y-4 flex-1 mb-8">
                   <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <Phone className="w-4 h-4 text-indigo-500 mt-1" />
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">WhatsApp / Celular</p>
                        <p className="text-xs font-black text-black">{u.celular || "No registrado"}</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <MapPin className="w-4 h-4 text-indigo-500 mt-1" />
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Ubicación Preferida</p>
                        <p className="text-xs font-bold text-black line-clamp-2">{u.punto_encuentro || u.direccion || "No especificada"}</p>
                      </div>
                   </div>
                </div>

                <div className="pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                   <div className="text-center">
                     <div className="flex items-center justify-center gap-1 mb-1">
                        <ShoppingBag className="w-3 h-3 text-gray-400" />
                        <span className="text-lg font-black text-black">{stats.count}</span>
                     </div>
                     <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Pedidos</p>
                   </div>
                   <div className="text-center">
                     <p className="text-lg font-black text-indigo-600 mb-1">Q{stats.totalSpent.toFixed(0)}</p>
                     <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Invertido</p>
                   </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-black uppercase tracking-tighter text-gray-400">No se encontraron usuarios</h3>
            <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mt-2 px-6">Intenta con otro nombre, teléfono o DPI</p>
          </div>
        )}
      </div>
    </div>
  );
}
