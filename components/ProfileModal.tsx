"use client";

import { X, LogOut, User, ShieldCheck, Mail, ArrowRight, ArrowLeft, Check, Phone, MapPin, Map, Package, Clock, CheckCircle2, Calendar, MessageSquareShare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { useEffect, useState, useRef } from "react";
import { ImageCropperModal } from "./ImageCropperModal";
import { LuxuryTicket } from "./LuxuryTicket";
import { compressImage } from "@/lib/imageUtils";

export function ProfileModal() {
  const { isProfileModalOpen, setIsProfileModalOpen, isTrackingOpen, setIsTrackingOpen, user, profile, isAdmin, signOut, updateProfile, uploadAvatar, userOrders, fetchUserOrders, addToast } = useStore();
  const [isVisible, setIsVisible] = useState(false);
  const [view, setView] = useState<"overview" | "orders">("overview");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
  const [selectedTicketOrder, setSelectedTicketOrder] = useState<any>(null);
  
  const [isUploadingReceipt, setIsUploadingReceipt] = useState<string | null>(null); // orderId
  const receiptInputRef = useRef<HTMLInputElement>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

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
        case 'pendiente': return 'bg-slate-100/50 text-slate-900 border-slate-200';
        case 'recibido': return 'bg-emerald-100/50 text-emerald-900 border-emerald-200';
        case 'preparacion': return 'bg-blue-100/50 text-blue-900 border-blue-200';
      case 'en_transito': return 'bg-indigo-100/50 text-indigo-900 border-indigo-200';
      case 'listo_entrega': return 'bg-emerald-100/50 text-emerald-900 border-emerald-200';
      case 'cancelado': return 'bg-rose-100/50 text-rose-900 border-rose-200';
      default: return 'bg-zinc-100/50 text-zinc-900 border-zinc-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pendiente': return 'En Espera';
      case 'recibido': return 'Aceptado';
      case 'preparacion': return 'Empaquetando';
      case 'en_transito': return 'En Camino';
      case 'listo_entrega': return 'Entregado';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };
  
  const renderMiniMasterTruck = (order: any) => {
    const steps = [
      { id: 'pendiente', label: 'Espera' },
      { id: 'recibido', label: 'Aceptado' },
      { id: 'preparacion', label: 'Empaquetado' },
      { id: 'en_transito', label: 'En Camino' },
      { id: 'listo_entrega', label: 'Entregado' }
    ];
    
    const currentIndex = steps.findIndex(s => s.id === order.estado);
    const progressPercent = Math.max(0, (currentIndex / (steps.length - 1)) * 100);

    return (
      <div className="mt-6 mb-2 px-2">
        <div className="relative h-1 w-full bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
          />
        </div>
        <div className="relative mt-[-10px] h-12 pointer-events-none">
          <motion.div 
            animate={{ left: `${progressPercent}%`, x: "-50%" }}
            transition={{ type: "spring", damping: 15 }}
            className="absolute top-0"
          >
            <motion.svg 
              width="50" height="40" viewBox="0 0 100 90" 
              className="drop-shadow-[0_8px_15px_rgba(0,0,0,0.2)]"
              animate={{ y: [0, -4, 0], scaleY: [1, 0.95, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
            >
              <rect x="2" y="10" width="70" height="52" rx="16" fill="#4f46e5" />
              <text x="37" y="42" className="text-[22px] font-black italic fill-white" textAnchor="middle">BM</text>
              <path d="M72 62 L98 62 C101 62 103 60 103 57 L103 36 C103 26 92 20 78 20 L72 20 Z" fill="#1e1b4b" />
              <circle cx="88" cy="70" r="10" fill="#020617" />
              <circle cx="28" cy="70" r="10" fill="#020617" />
            </motion.svg>
          </motion.div>
        </div>
      </div>
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Preparar para cropper visual
    setImageFileUrl(URL.createObjectURL(file));
    setCropperOpen(true);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setIsUploading(true);
    try {
      const croppedFile = new File([croppedBlob], `avatar-${Date.now()}.jpg`, { type: "image/jpeg" });
      await uploadAvatar(croppedFile);
      addToast("Foto actualizada correctamente", "success");
    } catch (err: unknown) {
      addToast("Error al subir imagen: " + (err instanceof Error ? err.message : "Error desconocido"), "error");
    } finally {
      setIsUploading(false);
      setImageFileUrl(null);
    }
  };

  const { uploadOrderReceipt } = useStore();

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeOrderId) return;

    setIsUploadingReceipt(activeOrderId);
    try {
      // 1. Comprimir para ahorrar espacio en Supabase (Gratis 1GB)
      const compressed = await compressImage(file, 1200, 0.7);
      
      // 2. Subir
      await uploadOrderReceipt(activeOrderId, compressed);
      
      // 3. Encontrar el pedido para el mensaje de WhatsApp
      const order = userOrders.find(o => o.id === activeOrderId);
      
      addToast("✅ Comprobante enviado con éxito", "success");

      // 4. AVISAR POR WHATSAPP AUTOMÁTICAMENTE
      if (order) {
        const shortId = order.id.substring(0, 5).toUpperCase();
        const message = `✅ *COMPROBANTE REGISTRADO - BAHÍA MODA*\n` +
          `------------------------------------------\n` +
          `🆔 *ID Pedido:* #BM-${shortId}\n` +
          `👤 *Cliente:* ${displayName}\n` +
          `💰 *Monto:* Q${order.total}\n` +
          `------------------------------------------\n` +
          `_Hola Bahía Moda, acabo de subir mi comprobante de depósito/transferencia a la plataforma. ¡Por favor confirmad mi pedido!_`;
        
        const encoded = encodeURIComponent(message);
        window.open(`https://wa.me/50242721798?text=${encoded}`, '_blank');
      }
      
    } catch (err: any) {
      addToast("❌ Error al subir: " + err.message, "error");
    } finally {
      setIsUploadingReceipt(null);
      setActiveOrderId(null);
      if (receiptInputRef.current) receiptInputRef.current.value = '';
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-500 overflow-hidden ${
        isProfileModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <ImageCropperModal
        isOpen={cropperOpen}
        imageSrc={imageFileUrl}
        onClose={() => { setCropperOpen(false); setImageFileUrl(null); }}
        onCropComplete={handleCropComplete}
      />
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsProfileModalOpen(false)} />

      <div 
        className={`relative w-full max-w-[95%] md:max-w-xl max-h-[92vh] bg-slate-50/80 backdrop-blur-3xl rounded-[3rem] md:rounded-[4rem] shadow-[0_50px_150px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform flex flex-col border border-white/20 ${
          isProfileModalOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-20 scale-95 opacity-0"
        }`}
      >
        <AnimatePresence>
          {selectedTicketOrder && (
            <div className="absolute inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto pt-20 pb-10 custom-scrollbar">
              <LuxuryTicket 
                order={selectedTicketOrder} 
                onClose={() => setSelectedTicketOrder(null)} 
              />
            </div>
          )}
        </AnimatePresence>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        <input type="file" ref={receiptInputRef} onChange={handleReceiptUpload} className="hidden" accept="image/*" />

        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          {/* Header move inside scroll */}
          <div className="h-24 md:h-28 bg-slate-900 flex-shrink-0 relative">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <button 
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all border border-white/5 z-40"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Avatar move inside scroll */}
          <div className="relative -mt-12 md:-mt-14 mb-4 flex justify-center z-10">
            <div className="inline-flex items-center justify-center w-24 h-24 md:w-28 md:h-28 bg-slate-50 rounded-full border-[6px] border-slate-50 shadow-2xl overflow-hidden group relative">
              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-black">
                {isUploading && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                    <span className="text-5xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter">{displayName?.charAt(0)}</span>
                  </div>
                )}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 cursor-pointer"
              >
                <span className="text-xs font-black uppercase tracking-widest text-white">Editar Foto</span>
              </button>
            </div>
          </div>
          <div className="px-5 md:px-12 pb-6 pt-2 text-center">
            
            {view === "overview" ? (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-5xl mx-auto">
                <div className="mb-8">
                   {isEditingName ? (
                     <div className="flex gap-2 justify-center max-w-sm mx-auto">
                        <input value={newName} onChange={e => setNewName(e.target.value)} className="flex-1 text-xl font-black bg-zinc-50 p-3 rounded-2xl border-2 border-black outline-none" placeholder="Tu Nombre" />
                        <button onClick={handleSaveName} className="p-3 bg-black text-white rounded-2xl active:scale-95 transition-all"><Check className="w-5 h-5" /></button>
                        <button onClick={() => setIsEditingName(false)} className="p-3 bg-zinc-100 text-zinc-400 rounded-2xl active:scale-95 transition-all"><X className="w-5 h-5" /></button>
                     </div>
                   ) : (
                     <div className="flex flex-col items-center">
                       <div className="flex items-center justify-center gap-3 mb-2 w-full">
                         <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-zinc-900 truncate max-w-[80%]">{displayName}</h2>
                         <button onClick={() => setIsEditingName(true)} className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-400 hover:text-zinc-900 transition-all active:scale-90" title="Editar Nombre"><User className="w-4 h-4" /></button>
                       </div>
                       <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest bg-zinc-100 px-4 py-1.5 rounded-full border border-zinc-200 max-w-full truncate">
                         <Mail className="w-3.5 h-3.5 opacity-50 shrink-0" /> <span className="truncate">{user?.email}</span>
                       </div>
                     </div>
                   )}
                </div>

                {isAdmin && (
                  <div className="flex justify-center mb-6">
                    <span className="flex items-center gap-3 px-6 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-lg border-t border-white/10 group cursor-pointer hover:bg-emerald-600 transition-colors" onClick={() => window.location.href='/admin'}>
                      <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:text-white" /> ADMIN V.I.P
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 text-left">
                  {[
                    { label: "WhatsApp", icon: Phone, value: profile?.celular, edit: () => setIsEditingPhone(true), cancel: () => setIsEditingPhone(false), isEditing: isEditingPhone, val: newCelular, setVal: setNewCelular, save: async () => { await updateProfile({ celular: newCelular }); setIsEditingPhone(false); } },
                    { label: "Dirección", icon: MapPin, value: profile?.direccion, edit: () => setIsEditingAddress(true), cancel: () => setIsEditingAddress(false), isEditing: isEditingAddress, val: newAddress, setVal: setNewAddress, save: async () => { await updateProfile({ direccion: newAddress }); setIsEditingAddress(false); } },
                    { label: "Referencia", icon: Map, value: profile?.punto_encuentro, edit: () => setIsEditingMeetingPoint(true), cancel: () => setIsEditingMeetingPoint(false), isEditing: isEditingMeetingPoint, val: newMeetingPoint, setVal: setNewMeetingPoint, save: async () => { await updateProfile({ punto_encuentro: newMeetingPoint }); setIsEditingMeetingPoint(false); } }
                  ].map((item, i) => (
                    <div key={i} className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm transition-all group overflow-hidden">
                      <div className="flex items-center gap-2 mb-2 text-slate-900">
                         <item.icon className="w-3.5 h-3.5 opacity-40 text-indigo-600 shrink-0" />
                         <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{item.label}</span>
                      </div>
                      {item.isEditing ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-1.5">
                            <input value={item.val} onChange={e => item.setVal(e.target.value)} className="w-full text-[10px] font-bold bg-slate-50 p-2 rounded-xl border-2 border-slate-900 outline-none" />
                            <button onClick={item.save} className="p-2 bg-slate-900 text-white rounded-xl active:scale-90"><Check className="w-3.5 h-3.5" /></button>
                            <button onClick={item.cancel} className="p-2 bg-slate-50 text-slate-400 rounded-xl active:scale-90"><X className="w-3.5 h-3.5" /></button>
                          </div>
                          {item.label === "WhatsApp" && (
                            <p className="text-[8px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-1.5 rounded-lg border border-amber-100">
                              ⚠️ Usa WhatsApp para recibir facturas.
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[11px] font-black text-slate-900 truncate">{item.value || "Pendiente"}</p>
                          <button onClick={item.edit} className="text-[8px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full opacity-100 transition-all shrink-0 hover:bg-indigo-600 hover:text-white">EDITAR</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-slate-100/50 p-4 md:p-6 rounded-[2.5rem] border border-slate-200 text-left mb-4">
                   <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-white rounded-xl shadow-sm text-slate-900">
                          <Package className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">Mis Pedidos</h4>
                      </div>
                      <button onClick={() => setView("orders")} className="text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:underline">Historial →</button>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userOrders.length > 0 ? userOrders.slice(0, 4).map(o => (
                        <div key={o.id} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group" onClick={() => { setIsTrackingOpen(true); setIsProfileModalOpen(false); }}>
                           <div className="flex items-center gap-3">
                             <div className={`p-3 rounded-xl border ${getStatusColor(o.estado)}`}>
                                <Package className="w-4 h-4" />
                             </div>
                             <div className="min-w-0">
                               <p className="text-sm font-black text-zinc-900 truncate">Q{o.total}</p>
                               <p className="text-[9px] font-bold text-zinc-400 uppercase mt-0.5 truncate">{new Date(o.created_at).toLocaleDateString('es-GT', { day: 'numeric', month: 'short' })}</p>
                             </div>
                           </div>
                           <div className="flex flex-col items-end gap-1.5 shrink-0 pl-2">
                             <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md border ${getStatusColor(o.estado)}`}>{getStatusLabel(o.estado)}</span>
                             <ArrowRight className="w-3 h-3 text-zinc-300 group-hover:text-zinc-900 transition-all" />
                           </div>
                        </div>
                      )) : (
                        <div className="col-span-full py-8 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                           <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 italic">Sin pedidos aún</p>
                        </div>
                      )}
                   </div>
                </div>

                <button onClick={() => { signOut(); setIsProfileModalOpen(false); }} className="w-full py-4 md:py-5 rounded-[1.5rem] text-[10px] md:text-[11px] font-black uppercase tracking-widest text-white bg-slate-900 hover:bg-rose-600 transition-all shadow-md hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-3 group">
                   <LogOut className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" /> CERRAR SESIÓN LOGUEADA
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
                
                <div className="space-y-10 pb-20 relative">
                   {/* Background watermark */}
                   <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                   
                   {userOrders.map(o => (
                     <div key={o.id} className="relative bg-[#fffdfb]/70 backdrop-blur-md p-10 md:p-12 rounded-2xl border-[3px] border-zinc-900 shadow-[8px_8px_0px_#18181b] overflow-hidden transition-all hover:translate-y-1 hover:shadow-[4px_4px_0px_#18181b] group cursor-pointer" onClick={() => setSelectedTicketOrder(o)}>
                        
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 border-b-2 border-dashed border-zinc-300 pb-8">
                           <div>
                             <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-2">TICKET NO. {o.id.slice(0, 12).toUpperCase()}</p>
                             <p className="text-2xl font-black text-zinc-900 uppercase italic tracking-tighter">{new Date(o.created_at).toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                           </div>
                           <span className={`text-[11px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-xl border-2 ${getStatusColor(o.estado)}`}>{getStatusLabel(o.estado)}</span>
                        </div>
                        
                        {renderMiniMasterTruck(o)}
                        
                        <div className="mt-8 mb-8 border-y-2 border-dashed border-zinc-300 py-8 space-y-4">
                           <div className="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">
                             <span>Artículo</span>
                             <span>Importe</span>
                           </div>
                           {o.items.map((item: any, i: number) => (
                             <div key={i} className="flex justify-between items-center text-sm font-bold text-zinc-800">
                               <span className="flex items-center gap-4 text-xs font-black uppercase tracking-widest"><div className="w-1.5 h-1.5 bg-black" /> {item.quantity}x {item.name}</span>
                               <span className="text-black font-black text-base font-mono">Q{item.price * item.quantity}</span>
                             </div>
                           ))}
                        </div>
                                   <div className="flex flex-col md:flex-row justify-between items-end gap-6 pt-4">
                           <div className="flex flex-col md:flex-row gap-8 w-full md:w-auto">
                              <div className="text-left bg-zinc-100 p-4 rounded-xl border border-zinc-200">
                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Abonado / Reserva</p>
                                <p className="text-xl font-black text-emerald-600 font-mono">Q{o.anticipo}</p>
                              </div>
                              
                              {/* SECCIÓN DE COMPROBANTE */}
                              <div className="flex-1 flex flex-col justify-center gap-2">
                                {(o as any).comprobante_url ? (
                                  <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                      <div>
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Pago en Validación</p>
                                        <p className="text-[8px] font-bold text-emerald-400 uppercase">Comprobante Registrado</p>
                                      </div>
                                    </div>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const shortId = o.id.substring(0, 5).toUpperCase();
                                        const message = `✅ *RECORDATORIO DE COMPROBANTE - BAHÍA MODA*\n` +
                                          `🆔 *ID:* #BM-${shortId}\n` +
                                          `👤 *Cliente:* ${displayName}\n` +
                                          `💰 *Monto:* Q${o.total}\n\n` +
                                          `_Ya subí mi comprobante a la web. ¡Espero vuestra validación!_`;
                                        window.open(`https://wa.me/50242721798?text=${encodeURIComponent(message)}`, '_blank');
                                      }}
                                      className="flex items-center justify-center gap-2 text-[8px] font-black uppercase text-indigo-600 hover:text-indigo-800 transition-colors"
                                    >
                                      <MessageSquareShare className="w-3 h-3" /> Re-avisar por WhatsApp
                                    </button>
                                  </div>
                                ) : o.estado !== 'cancelado' && (
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveOrderId(o.id);
                                      receiptInputRef.current?.click();
                                    }}
                                    disabled={isUploadingReceipt === o.id}
                                    className="flex items-center gap-3 bg-indigo-600 hover:bg-black text-white px-5 py-3 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
                                  >
                                    {isUploadingReceipt === o.id ? (
                                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                      <CheckCircle2 className="w-4 h-4" /> 
                                    )}
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                      {isUploadingReceipt === o.id ? 'Subiendo...' : 'Adjuntar Depósito / Transferencia'}
                                    </span>
                                  </button>
                                )}
                              </div>

                              {o.fecha_entrega && (
                                <div className="text-left bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                                    <Calendar className="w-3 h-3" /> Fecha de Entrega
                                  </p>
                                  <p className="text-[14px] font-black text-indigo-700 uppercase">{o.fecha_entrega}</p>
                                </div>
                              )}
                           </div>
                           <div className="text-right">
                              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-2">Total del Pedido</p>
                              <p className="text-4xl font-black text-black tracking-tighter font-mono">Q{o.total}</p>
                           </div>
                        </div>

                        {/* Barcode representation */}
                        <div className="mt-12 flex justify-center opacity-30 mix-blend-multiply pointer-events-none">
                          <div className="h-12 w-3/4 max-w-sm bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjEwMCI+PHJlY3Qgd2lkdGg9IjIiIGhlaWdodD0iMTAwIiBmaWxsPSIjMDAwIi8+PC9zdmc+')] bg-repeat-x" />
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
