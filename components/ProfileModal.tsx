"use client";

import { X, LogOut, User, ShieldCheck, Mail, ArrowRight, ArrowLeft, Check, Phone, MapPin, Map, Package } from "lucide-react";
import { useStore } from "@/lib/store";
import { useEffect, useState, useRef } from "react";

export function ProfileModal() {
  const { isProfileModalOpen, setIsProfileModalOpen, user, profile, isAdmin, signOut, updateProfile, uploadAvatar, userOrders, fetchUserOrders } = useStore();
  const [isVisible, setIsVisible] = useState(false);
  const [view, setView] = useState<"overview" | "orders">("overview");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isProfileModalOpen && user) {
      fetchUserOrders();
    }
  }, [isProfileModalOpen, user, fetchUserOrders]);
  
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const displayName = profile?.nombre_completo || user?.user_metadata?.full_name || user?.email?.split('@')[0];
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(displayName || "");
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newCelular, setNewCelular] = useState(profile?.celular || "");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState(profile?.direccion || "");
  const [isEditingMeetingPoint, setIsEditingMeetingPoint] = useState(false);
  const [newMeetingPoint, setNewMeetingPoint] = useState(profile?.punto_encuentro || "");

  useEffect(() => {
    if (isProfileModalOpen) {
      setIsVisible(true);
      setView("overview");
      setNewName(displayName || "");
      setNewCelular(profile?.celular || "");
      setNewAddress(profile?.direccion || "");
      setNewMeetingPoint(profile?.punto_encuentro || "");
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isProfileModalOpen, displayName, profile]);

  if (!isProfileModalOpen && !isVisible) return null;

  const handleSaveName = async () => {
    try {
      await updateProfile({ nombre_completo: newName });
      setIsEditingName(false);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recibido': return 'bg-amber-100/50 text-amber-900 border-amber-200';
      case 'preparacion': return 'bg-blue-100/50 text-blue-900 border-blue-200';
      case 'en_transito': return 'bg-indigo-100/50 text-indigo-900 border-indigo-200';
      case 'listo_entrega': return 'bg-emerald-100/50 text-emerald-900 border-emerald-200';
      case 'cancelado': return 'bg-rose-100/50 text-rose-900 border-rose-200';
      default: return 'bg-zinc-100/50 text-zinc-900 border-zinc-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'recibido': return 'Recibido';
      case 'preparacion': return 'En Preparación';
      case 'en_transito': return 'En Tránsito';
      case 'listo_entrega': return 'Listo / Entregado';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const renderTracker = (status: string) => {
    if (status === 'cancelado') return (
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 text-center mt-6 mb-8">
        <p className="text-xs font-black uppercase tracking-widest text-rose-600">Este pedido ha sido cancelado.</p>
      </div>
    );
    
    const steps = ['recibido', 'preparacion', 'en_transito', 'listo_entrega'];
    const labels = ['Recibida', 'Preparación', 'En Tránsito', 'Lista / Entregada'];
    const currentIndex = steps.indexOf(status);
    
    return (
      <div className="flex items-center justify-between mt-6 mb-16 relative px-4 md:px-8">
         <div className="absolute left-4 right-4 md:left-8 md:right-8 top-1/2 -translate-y-1/2 h-1 bg-zinc-100 rounded-full" />
         <div 
           className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 h-1 bg-green-500 rounded-full transition-all duration-1000 ease-out"
           style={{ width: `calc(${(currentIndex / (steps.length - 1)) * 100}% - 2rem)` }}
         />
         {steps.map((step, idx) => {
           const isCompleted = idx <= currentIndex;
           const isCurrent = idx === currentIndex;
           return (
             <div key={step} className="relative z-10 flex flex-col items-center group">
               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs text-white shadow-sm transition-all duration-500 ring-4 ring-white ${isCompleted ? 'bg-green-500 font-bold scale-110' : 'bg-zinc-200 font-medium'}`}>
                 {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
               </div>
               <span className={`absolute top-12 w-24 text-center text-[9px] uppercase tracking-widest font-black transition-colors ${isCurrent ? 'text-green-600' : isCompleted ? 'text-zinc-500' : 'text-zinc-300'}`}>
                 {labels[idx]}
               </span>
             </div>
           );
         })}
      </div>
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      await uploadAvatar(file);
    } catch (err: unknown) {
      alert("Error al subir imagen: " + (err instanceof Error ? err.message : "Error desconocido"));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-500 overflow-hidden ${
        isProfileModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsProfileModalOpen(false)} />

      <div 
        className={`relative w-full max-w-[95%] md:max-w-5xl max-h-[92vh] bg-[#fdfdfd] rounded-[3rem] md:rounded-[4rem] shadow-[0_50px_150px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform flex flex-col ${
          isProfileModalOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-20 scale-95 opacity-0"
        }`}
      >
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

        <div className="h-44 md:h-48 bg-gray-950 flex-shrink-0 relative">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <button 
            onClick={() => setIsProfileModalOpen(false)}
            className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all border border-white/5 z-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute left-1/2 -ml-20 md:-ml-24 top-[100px] md:top-[112px] z-50">
          <div className="inline-flex items-center justify-center w-40 h-40 md:w-48 md:h-48 bg-[#fdfdfd] rounded-full border-[10px] border-[#fdfdfd] shadow-2xl overflow-hidden group relative">
            <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-black">
              {isUploading && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              ) : (
                <div className="w-full h-full bg-zinc-200 flex items-center justify-center">
                  <span className="text-6xl font-black text-zinc-900 uppercase tracking-tighter">{displayName?.charAt(0)}</span>
                </div>
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 cursor-pointer"
            >
              <span className="text-xs font-black uppercase tracking-widest text-white">Editar Foto</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="px-6 md:px-20 pb-16 pt-24 md:pt-32 text-center">
            
            {view === "overview" ? (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-5xl mx-auto">
                <div className="mb-12">
                   {isEditingName ? (
                     <div className="flex gap-2 justify-center max-w-md mx-auto">
                        <input value={newName} onChange={e => setNewName(e.target.value)} className="flex-1 text-2xl font-black bg-zinc-50 p-4 rounded-3xl border-2 border-black outline-none" placeholder="Tu Nombre" />
                        <button onClick={handleSaveName} className="p-4 bg-black text-white rounded-3xl active:scale-95 transition-all"><Check className="w-6 h-6" /></button>
                        <button onClick={() => setIsEditingName(false)} className="p-4 bg-zinc-100 text-zinc-400 rounded-3xl active:scale-95 transition-all"><X className="w-6 h-6" /></button>
                     </div>
                   ) : (
                     <div className="flex flex-col items-center">
                       <div className="flex items-center gap-4 mb-2">
                         <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-zinc-900">{displayName}</h2>
                         <button onClick={() => setIsEditingName(true)} className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-300 hover:text-zinc-900 transition-all active:scale-90" title="Editar Nombre"><User className="w-5 h-5" /></button>
                       </div>
                       <div className="flex items-center gap-3 text-zinc-600 text-[11px] font-black uppercase tracking-[0.3em] bg-zinc-100 px-6 py-2 rounded-full border border-zinc-200">
                         <Mail className="w-4 h-4 opacity-50" /> {user?.email}
                       </div>
                     </div>
                   )}
                </div>

                {isAdmin && (
                  <div className="flex justify-center mb-16">
                    <span className="flex items-center gap-4 px-10 py-4 bg-zinc-900 text-white rounded-full text-[12px] font-black uppercase tracking-[0.4em] shadow-2xl border-t border-white/10 group cursor-pointer hover:bg-emerald-600 transition-colors" onClick={() => window.location.href='/admin'}>
                      <ShieldCheck className="w-5 h-5 text-emerald-400 group-hover:text-white" /> ADMINISTRADOR JEFE
                    </span>
                  </div>
                  {[
                    { label: "WhatsApp Contacto", icon: Phone, value: profile?.celular, edit: () => setIsEditingPhone(true), cancel: () => setIsEditingPhone(false), isEditing: isEditingPhone, val: newCelular, setVal: setNewCelular, save: async () => { await updateProfile({ celular: newCelular }); setIsEditingPhone(false); } },
                    { label: "Dirección de Entrega", icon: MapPin, value: profile?.direccion, edit: () => setIsEditingAddress(true), cancel: () => setIsEditingAddress(false), isEditing: isEditingAddress, val: newAddress, setVal: setNewAddress, save: async () => { await updateProfile({ direccion: newAddress }); setIsEditingAddress(false); } },
                    { label: "Punto de Referencia", icon: Map, value: profile?.punto_encuentro, edit: () => setIsEditingMeetingPoint(true), cancel: () => setIsEditingMeetingPoint(false), isEditing: isEditingMeetingPoint, val: newMeetingPoint, setVal: setNewMeetingPoint, save: async () => { await updateProfile({ punto_encuentro: newMeetingPoint }); setIsEditingMeetingPoint(false); } }
                  ].map((item, i) => (
                    <div key={i} className="bg-white p-8 rounded-[3rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden">
                      <div className="flex items-center gap-3 mb-6 text-zinc-900">
                         <item.icon className="w-5 h-5 opacity-40 text-indigo-600" />
                         <span className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">{item.label}</span>
                      </div>
                      {item.isEditing ? (
                        <div className="flex gap-2">
                          <input value={item.val} onChange={e => item.setVal(e.target.value)} className="w-full text-sm font-bold bg-zinc-50 p-3 rounded-2xl border-2 border-zinc-900 outline-none" />
                          <button onClick={item.save} className="p-3 bg-zinc-900 text-white rounded-2xl active:scale-90"><Check className="w-5 h-5" /></button>
                          <button onClick={item.cancel} className="p-3 bg-zinc-100 text-zinc-400 rounded-2xl active:scale-90"><X className="w-5 h-5" /></button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <p className="text-base font-black text-zinc-900">{item.value || "Pendiente"}</p>
                          <button onClick={item.edit} className="text-[10px] font-black text-white bg-zinc-900 px-4 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-105">EDITAR</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-zinc-100/30 p-10 rounded-[4rem] border border-zinc-100 text-left mb-12">
                   <div className="flex items-center justify-between mb-10 border-b border-zinc-200 pb-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-2xl shadow-sm text-zinc-900">
                          <Package className="w-6 h-6" />
                        </div>
                        <h4 className="text-xl font-black uppercase tracking-tighter text-zinc-900">Historial de Pedidos</h4>
                      </div>
                      <button onClick={() => setView("orders")} className="text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors border-b-2 border-transparent hover:border-zinc-900 pb-1">Ver Historial Completo</button>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {userOrders.length > 0 ? userOrders.slice(0, 4).map(o => (
                        <div key={o.id} className="bg-white p-6 rounded-[2.5rem] flex items-center justify-between shadow-sm border border-zinc-50 hover:shadow-lg transition-all cursor-pointer group">
                           <div className="flex items-center gap-4">
                             <div className={`p-4 rounded-2xl border ${getStatusColor(o.estado)}`}>
                                <Package className="w-5 h-5" />
                             </div>
                             <div>
                               <p className="text-sm font-black text-zinc-900">Q{o.total}</p>
                               <p className="text-[10px] font-bold text-zinc-400 uppercase mt-0.5">{new Date(o.created_at).toLocaleDateString('es-GT', { day: 'numeric', month: 'long' })}</p>
                             </div>
                           </div>
                           <div className="flex flex-col items-end gap-2">
                             <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${getStatusColor(o.estado)}`}>{getStatusLabel(o.estado)}</span>
                             <ArrowRight className="w-4 h-4 text-zinc-200 group-hover:text-zinc-900 transition-all" />
                           </div>
                        </div>
                      )) : (
                        <div className="col-span-full py-16 text-center">
                           <p className="text-sm font-black uppercase tracking-[0.4em] text-zinc-300 italic">No se han registrado pedidos aún</p>
                        </div>
                      )}
                   </div>
                </div>

                <button onClick={() => { signOut(); setIsProfileModalOpen(false); }} className="w-full py-8 rounded-[2.5rem] text-[13px] font-black uppercase tracking-[0.4em] text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-all border border-zinc-100 hover:border-rose-100 flex items-center justify-center gap-4 group">
                   <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" /> CERRAR SESIÓN SEGURA
                </button>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-8 duration-700 text-left max-w-4xl mx-auto">
                <button onClick={() => setView("overview")} className="inline-flex items-center gap-3 text-[12px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 mb-12 transition-colors"><ArrowLeft className="w-6 h-6" /> Volver</button>
                <div className="flex items-center justify-between mb-12 border-b-2 border-zinc-100 pb-8">
                  <h3 className="text-4xl font-black uppercase tracking-tighter text-zinc-900">Historial Completo</h3>
                  <div className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">
                     <Package className="w-4 h-4 text-emerald-400" /> {userOrders.length} Pedidos
                  </div>
                </div>
                
                <div className="space-y-6 pb-20">
                   {userOrders.map(o => (
                     <div key={o.id} className="bg-white p-10 rounded-[4rem] border border-zinc-200 shadow-sm hover:shadow-xl transition-all group">
                        <div className="flex justify-between items-center mb-8">
                           <div>
                             <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">ID PEDIDO: {o.id.slice(0, 12).toUpperCase()}</p>
                             <p className="text-xl font-black text-zinc-900">{new Date(o.created_at).toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                           </div>
                           <span className={`text-[12px] font-black uppercase px-6 py-2 rounded-full border shadow-sm ${getStatusColor(o.estado)}`}>{getStatusLabel(o.estado)}</span>
                        </div>
                        
                        {renderTracker(o.estado)}
                        <div className="space-y-4 mb-8 bg-zinc-50/50 p-8 rounded-3xl border border-zinc-100">
                           {o.items.map((item: any, i: number) => (
                             <div key={i} className="flex justify-between text-sm font-bold text-zinc-700">
                               <span className="flex items-center gap-3"><div className="w-2 h-2 bg-indigo-600 rounded-full" /> {item.quantity}x {item.name}</span>
                               <span className="text-zinc-900 font-black">Q{item.price * item.quantity}</span>
                             </div>
                           ))}
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-zinc-100">
                           <div className="flex flex-col gap-1">
                              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Estado de Pago</p>
                              <p className="text-2xl font-black text-indigo-600">Q{o.total} Total</p>
                           </div>
                           <div className="flex gap-4">
                              <div className="text-right">
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Anticipo / Reserva</p>
                                <p className="text-lg font-black text-emerald-600">Q{o.anticipo}</p>
                              </div>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="py-8 bg-zinc-50 text-center border-t border-zinc-200 flex-shrink-0 relative">
          <p className="text-[12px] font-black text-zinc-400 uppercase tracking-[0.6em]">Bahía Moda Exclusive v1.6</p>
          <div className="absolute right-12 top-1/2 -translate-y-1/2">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.7)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
