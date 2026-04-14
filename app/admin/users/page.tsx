"use client";

import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { ArrowLeft, User, Phone, MapPin, CreditCard, Search, ShoppingBag, X, ShieldAlert, Truck, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function AdminUsersPage() {
  const { allUsers, fetchAllUsers, adminOrders, fetchAllOrders, addToast } = useStore();
  const [search, setSearch] = useState("");
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [logisticsModalOpen, setLogisticsModalOpen] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ estado: '', fecha_entrega: '' });
  const { updateOrderDetails } = useStore();

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

  const handleForceReset = async () => {
    if (!selectedUser || newPassword.length < 6) {
      addToast("La contraseña debe tener al menos 6 caracteres", "error");
      return;
    }
    setIsResetting(true);
    try {
      const res = await fetch('/api/auth/force-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser.id, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al restablecer contraseña');
      
      addToast(`!Contraseña de ${selectedUser.nombre_completo} actualizada!`, "success");
      setResetModalOpen(false);
      setNewPassword("");
    } catch (e: any) {
      addToast(e.message, "error");
    } finally {
      setIsResetting(false);
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

                <div className="mt-6 pt-6 border-t border-gray-100">
                    <button 
                      onClick={() => { setSelectedUser(u); setLogisticsModalOpen(true); }}
                      className="w-full bg-indigo-50 text-indigo-600 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2 group mb-3 shadow-sm font-black"
                    >
                      <Truck className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" /> GESTIONAR LOGÍSTICA
                    </button>
                    <button 
                      onClick={() => { setSelectedUser(u); setResetModalOpen(true); }}
                      className="w-full bg-red-50 text-red-600 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 group font-black"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> FORZAR ACCESO
                    </button>
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

      {/* Logistics Management Modal */}
      {logisticsModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] p-8 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative animate-in fade-in slide-in-from-bottom-5 duration-300">
             <button onClick={() => setLogisticsModalOpen(false)} className="absolute top-8 right-8 p-3 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-500 transition-all border border-gray-100">
                <X className="w-5 h-5" />
             </button>

             <div className="mb-8 pr-12">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                    <Truck className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter text-black leading-none mb-1">Centro Logístico</h3>
                    <p className="text-xs font-bold text-gray-400">Gestionando a <span className="text-indigo-600">{selectedUser.nombre_completo}</span></p>
                  </div>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {adminOrders.filter(o => o.cliente_id === selectedUser.id).length === 0 ? (
                  <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
                    <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No hay pedidos registrados</p>
                  </div>
                ) : (
                  <div className="space-y-6 pb-6">
                    {adminOrders.filter(o => o.cliente_id === selectedUser.id).map(order => (
                      <div key={order.id} className="bg-white border-2 border-gray-100 rounded-[2.5rem] p-6 hover:border-black transition-all">
                        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                           <div>
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-xs font-black text-black uppercase tracking-widest">Pedido #{order.id.split('-')[0]}</span>
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                  order.estado === 'listo_entrega' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                  order.estado === 'en_transito' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                  'bg-amber-50 text-amber-600 border-amber-100'
                                }`}>
                                  {order.estado}
                                </span>
                              </div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">{new Date(order.created_at).toLocaleDateString()}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-xl font-black text-black">Q{Number(order.total).toFixed(0)}</p>
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{order.items.length} Artículos</p>
                           </div>
                        </div>

                        {editingOrderId === order.id ? (
                           <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 space-y-4 animate-in fade-in zoom-in-95">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                 <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Fecha de Entrega</label>
                                    <div className="relative">
                                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                      <input 
                                        type="text"
                                        placeholder="Ej. Jueves 15 / Pronto"
                                        value={editData.fecha_entrega}
                                        onChange={e => setEditData({...editData, fecha_entrega: e.target.value})}
                                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-black"
                                      />
                                    </div>
                                 </div>
                                 <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Estado de Envío</label>
                                    <select 
                                      value={editData.estado}
                                      onChange={e => setEditData({...editData, estado: e.target.value})}
                                      className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-black appearance-none"
                                    >
                                      <option value="recibido">Confirmado</option>
                                      <option value="en_transito">En Camino</option>
                                      <option value="listo_entrega">Entregado</option>
                                      <option value="cancelado">Cancelado</option>
                                    </select>
                                 </div>
                              </div>
                              <div className="flex gap-3">
                                 <button 
                                   onClick={async () => {
                                      await updateOrderDetails(order.id, { 
                                        estado: editData.estado as any, 
                                        fecha_entrega: editData.fecha_entrega 
                                      });
                                      setEditingOrderId(null);
                                      addToast("Pedido actualizado", "success");
                                   }}
                                   className="flex-1 bg-black text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                                 >
                                   Guardar Cambios
                                 </button>
                                 <button 
                                   onClick={() => setEditingOrderId(null)}
                                   className="px-6 bg-white text-gray-400 border border-gray-200 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50"
                                 >
                                   Cancelar
                                 </button>
                              </div>
                           </div>
                        ) : (
                           <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                             <div className="flex items-center gap-3">
                                <Calendar className="w-4 h-4 text-indigo-500" />
                                <div>
                                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Est. de Entrega</p>
                                   <p className="text-xs font-black text-black">{order.fecha_entrega || "No definida"}</p>
                                </div>
                             </div>
                             <button 
                               onClick={() => {
                                 setEditingOrderId(order.id);
                                 setEditData({ estado: order.estado, fecha_entrega: order.fecha_entrega || '' });
                               }}
                               className="px-4 py-2 bg-white text-black border border-gray-200 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm"
                             >
                               Editar Info
                             </button>
                           </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </div>
        </div>
      )}

      {resetModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[3rem] p-8 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setResetModalOpen(false)} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-500 transition-colors">
               <X className="w-4 h-4" />
            </button>
            <div className="mb-8">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-4 shadow-sm">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter text-black leading-none mb-2">Forzar Acceso</h3>
              <p className="text-xs text-gray-500 font-bold leading-relaxed">Asigna una nueva clave a <span className="text-black">{selectedUser.nombre_completo}</span>.</p>
            </div>
            <div className="space-y-4">
               <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Nueva Contraseña Temporal</label>
                  <input 
                    type="text"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Ej. Bahia456!"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-mono"
                  />
               </div>
               <button 
                 onClick={handleForceReset}
                 disabled={isResetting}
                 className={`w-full bg-red-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_10px_20px_-10px_rgba(220,38,38,0.5)] hover:bg-red-700 hover:scale-[1.02] active:scale-95 transition-all flex justify-center items-center gap-2 mt-2 ${isResetting ? 'opacity-50 cursor-not-allowed' : ''}`}
               >
                 {isResetting ? 'APLICANDO...' : 'RESETEAR CONTRASEÑA'}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
