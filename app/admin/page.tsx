"use client";

import { useStore } from "@/lib/store";
import { CATEGORY_MAPPING, Product } from "@/lib/mockData";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Plus, Package, CheckSquare, Square, Trash2, ImagePlus, Calendar, Eye, Search, Pencil, ArrowUpRight, Inbox, Bell, BellOff, ShieldCheck, Key, ShieldAlert, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { EditProductModal } from "@/components/admin/EditProductModal";
import { registerPush, subscribeUser } from "@/lib/push";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const { user, isAdmin, authLoading, addProduct, uploadProductImages, products, deleteProduct, orderRequests, addToast, finanzas, fetchFinanzas, addFinanza, fetchProducts } = useStore();
  const router = useRouter();

  // Notification State
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    // Register SW on load
    registerPush();
    fetchResetRequests();
    if (isAdmin) {
      fetchFinanzas();
      fetchProducts();
    }
  }, [isAdmin, fetchFinanzas, fetchProducts]);

  const fetchResetRequests = async () => {
    setLoadingResets(true);
    try {
      const { data, error } = await supabase
        .from('peticiones_reset')
        .select('*')
        .eq('estado', 'pendiente')
        .order('created_at', { ascending: false });
      
      if (!error) setResetRequests(data || []);
    } catch (err) {
      console.error("Error fetching resets:", err);
    } finally {
      setLoadingResets(false);
    }
  };

  const handleApproveReset = async (requestId: string) => {
    try {
      const res = await fetch('/api/auth/approve-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      addToast("✅ Solicitud aprobada con éxito", "success");
      fetchResetRequests(); // Refresh list
    } catch (err: any) {
      addToast(err.message || "Error al aprobar", "error");
    }
  };

  const handleSubscribe = async () => {
    setSubscribing(true);
    try {
      const sub = await subscribeUser();
      if (sub) {
        setIsSubscribed(true);
        addToast("¡Notificaciones activadas!", "success");
      }
    } catch (error) {
      addToast("Error al activar notificaciones. Asegúrate de estar en HTTPS.", "error");
    } finally {
      setSubscribing(false);
    }
  };

  const handleTestNotification = async () => {
    setTesting(true);
    try {
      const res = await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: "¡Prueba de Bahía Moda! 🔔",
          body: "Si recibiste esto, tus notificaciones están configuradas correctamente.",
          url: "/admin/requests"
        })
      });
      if (res.ok) addToast("Prueba enviada. Deberías recibirla pronto.", "success");
    } catch (error) {
      addToast("Error al probar la notificación.", "error");
    } finally {
      setTesting(false);
    }
  };

  // Lógica inteligente para el Badge de solicitudes
  const pendingCount = orderRequests.filter(r => r.estado === 'pendiente').length;
  
  const [loading, setLoading] = useState(false);
  const [hasSizes, setHasSizes] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    subCategory: "",
    filterTag: "Ninguno (Predeterminado)",
    supplier: "",
    delivery_date: "",
    description: "",
    sizes: "",
    cost: "",
    stock: ""
  });

  // NEW INVENTORY STATE
  const [activeTab, setActiveTab] = useState<'upload' | 'inventory' | 'resets'>('upload');
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [resetRequests, setResetRequests] = useState<any[]>([]);
  const [loadingResets, setLoadingResets] = useState(false);

  // ERP State
  const [expenseForm, setExpenseForm] = useState({ monto: "", concepto: "" });
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  // 1. loading state while Supabase checks the session
  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-black" />
      </div>
    );
  }

  // 2. Security check: If no user or not admin, show access denied
  if (!user || !isAdmin) {
    return (
      <div className="min-h-[calc(100vh-64px)] w-full flex flex-col items-center justify-center bg-white p-8">
        <div className="max-w-md w-full text-center space-y-6">
           <div className="bg-red-50 text-red-500 p-6 rounded-3xl border border-red-100 shadow-sm">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h2 className="text-xl font-black uppercase tracking-tight">Acceso Denegado</h2>
              <p className="text-sm font-medium mt-2">Esta sección es exclusiva para administradores de Bahía Moda. Por favor, inicia sesión con una cuenta autorizada.</p>
           </div>
           <button 
             onClick={() => router.push('/')}
             className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
           >
             Regresar al Inicio
           </button>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
      
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      addToast("Por favor completa los campos obligatorios", "error");
      return;
    }

    if (selectedFiles.length === 0) {
      addToast("Por favor sube al menos una fotografía", "error");
      return;
    }

    setLoading(true);
    try {
      // 1. Upload images to Cloud
      const imageUrls = await uploadProductImages(selectedFiles);

      // 2. Save product to DB
      await addProduct({
        name: formData.name,
        price: parseFloat(formData.price),
        cost: formData.cost ? parseFloat(formData.cost) : 0,
        stock: formData.stock === "-1" ? -1 : (formData.stock ? parseInt(formData.stock) : 1),
        images: imageUrls,
        category: formData.category,
        subCategory: formData.subCategory,
        filterTag: formData.filterTag === "Ninguno (Predeterminado)" ? undefined : formData.filterTag,
        supplier: formData.supplier,
        delivery_date: formData.delivery_date,
        description: formData.description,
        sizes: hasSizes ? formData.sizes.split(",").map(s => s.trim()) : undefined
      });
      addToast("¡Producto publicado con éxito!", "success");
      setFormData({
        name: "",
        price: "",
        cost: "",
        stock: "",
        category: "",
        subCategory: "",
        filterTag: "Ninguno (Predeterminado)",
        supplier: "",
        delivery_date: "",
        description: "",
        sizes: ""
      });
      setHasSizes(false);
      setSelectedFiles([]);
      setPreviews([]);
    } catch (error: Error | any) {
      addToast("Error al publicar: " + (error.message || "Error desconocido"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-white p-3 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-5 sm:p-10 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black flex items-center gap-3">
              <Package className="w-5 h-5 sm:w-6 h-6"/> Admin Panel
            </h1>
            <p className="text-[10px] sm:text-sm text-gray-500 mt-1 sm:mt-2 font-medium">Gestor de Contenidos Sincronizado</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
             <button 
               onClick={handleSubscribe}
               disabled={subscribing || isSubscribed}
               className={`p-3 rounded-2xl transition-all flex items-center gap-2 ${
                 isSubscribed 
                   ? 'bg-green-50 text-green-600 cursor-default' 
                   : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
               }`}
               title={isSubscribed ? "Notificaciones Activas" : "Activar Notificaciones Push"}
             >
                {subscribing ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-amber-500 border-t-white" />
                ) : isSubscribed ? (
                  <Bell className="w-5 h-5 fill-current" />
                ) : (
                  <BellOff className="w-5 h-5" />
                )}
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">
                  {isSubscribed ? 'Alertas OK' : 'Alertas Off'}
                </span>
             </button>

             {isSubscribed && (
               <button 
                 onClick={handleTestNotification}
                 disabled={testing}
                 className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 transition-colors flex items-center gap-2"
                 title="Mandar Notificación de Prueba"
               >
                 {testing ? (
                   <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-white" />
                 ) : (
                   <Sparkles className="w-4 h-4" />
                 )}
                 <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Probar</span>
               </button>
             )}

             <button 
               onClick={() => router.push('/admin/search')}
               className="p-3 bg-zinc-100 text-black rounded-2xl hover:bg-black hover:text-white transition-all flex items-center gap-2 group"
               title="Buscador Maestro de Recibos"
             >
                <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Buscador</span>
             </button>

             <button 
               onClick={() => router.push('/admin/requests')}
               className="relative p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 transition-colors group flex items-center gap-2"
               title="Ver Solicitudes Pendientes"
             >
                <Inbox className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Solicitudes</span>
                {/* NOTIFICATION BADGE INTELIGENTE */}
                {pendingCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                     !
                  </div>
                )}
             </button>
             <div className="flex bg-gray-200/50 p-1 rounded-xl w-full">
              <button
                 onClick={() => setActiveTab('upload')}
                 className={`flex-1 py-2.5 rounded-lg text-[9px] sm:text-xs font-black uppercase tracking-[0.1em] transition-all flex items-center justify-center gap-1 ${activeTab === 'upload' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
              >
                 <Plus className="w-3 h-3 sm:hidden" /> <span className="hidden sm:inline">Subir Producto</span><span className="sm:hidden">Subir</span>
              </button>
              <button
                  onClick={() => setActiveTab('inventory')}
                  className={`flex-1 py-2.5 rounded-lg text-[9px] sm:text-xs font-black uppercase tracking-[0.1em] transition-all flex items-center justify-center gap-1 ${activeTab === 'inventory' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
               >
                  <Package className="w-3 h-3 sm:hidden" /> <span className="hidden sm:inline">Inventario y Finanzas</span><span className="sm:hidden">ERP</span>
               </button>
              <button
                 onClick={() => setActiveTab('resets')}
                 className={`flex-1 py-2.5 rounded-lg text-[9px] sm:text-xs font-black uppercase tracking-[0.1em] transition-all flex items-center justify-center gap-1 relative ${activeTab === 'resets' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-black'}`}
              >
                 <ShieldCheck className="w-3 h-3 sm:hidden" /> <span className="hidden sm:inline">Seguridad (Reset)</span><span className="sm:hidden">Reset</span>
                 {resetRequests.length > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />}
              </button>
            </div>
        </div>
      </div>
        
        {activeTab === 'upload' && (
        <form className="p-6 sm:p-10 space-y-8" onSubmit={handlePublish}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Galería de Fotos (Múltiple)</label>
                
                {previews.length === 0 ? (
                  <label htmlFor="product-upload-init" className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-3xl w-full aspect-[4/5] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-all group relative overflow-hidden">
                    <input id="product-upload-init" type="file" multiple accept="image/jpeg, image/png, image/webp, image/*" onChange={handleFileChange} className="hidden" />
                    <div className="p-4 bg-white rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                      <ImagePlus className="w-8 h-8 text-indigo-500" />
                    </div>
                    <span className="text-sm font-black text-gray-900 uppercase tracking-tight">Cargar Imágenes</span>
                    <span className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">JPG, PNG, WEBP (Min. 1)</span>
                  </label>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {previews.map((preview, idx) => (
                        <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm group">
                          <img src={preview} alt="" className="w-full h-full object-cover" />
                          {idx === 0 && (
                            <div className="absolute top-2 left-2 bg-black text-[#FFD700] text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md shadow-lg z-10 border border-[#FFD700]/30 backdrop-blur-sm">
                              Principal
                            </div>
                          )}
                          <button 
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      <label htmlFor="product-upload-add" className="relative aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <input id="product-upload-add" type="file" multiple accept="image/jpeg, image/png, image/webp, image/*" onChange={handleFileChange} className="hidden" />
                        <Plus className="w-6 h-6 text-gray-400" />
                        <span className="text-[9px] font-black text-gray-400 uppercase mt-1">Añadir más</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* VISTA PREVIA INTELIGENTE (SIMULADOR) */}
                <div className="pt-6 border-t border-gray-100">
                  <label className="block text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5" /> Simulador de Catálogo
                  </label>
                  
                  <div className="max-w-[280px] mx-auto scale-90 sm:scale-100 origin-top">
                    {/* Mock product for simulator */}
                    <ProductCard 
                      product={{
                        id: 'preview',
                        name: formData.name || 'Nombre del Producto',
                        price: parseFloat(formData.price) || 0,
                        category: formData.category || 'Categoría',
                        subCategory: formData.subCategory || '',
                        images: previews.length > 0 ? previews : [],
                        supplier: formData.supplier || '',
                        description: formData.description || ''
                      }}
                      onClick={() => {}}
                    />
                    <p className="text-[10px] text-gray-400 text-center mt-4 font-bold italic">
                      Asi es como tus clientes lo verán en la tienda.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">Nombre Público</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ej. Zapatos Formales de Cuero..." 
                    className="w-full border border-gray-300 bg-white px-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black transition-shadow shadow-sm" 
                  />
               </div>
               <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">Precio de Venta (Público)</label>
                   <div className="relative">
                     <span className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold flex items-center justify-center text-xs">Q</span>
                     <input 
                       type="number" 
                       value={formData.price}
                       onChange={(e) => setFormData({...formData, price: e.target.value})}
                       placeholder="0.00" 
                       className="w-full border border-gray-300 bg-white pl-10 pr-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black transition-shadow shadow-sm" 
                     />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-[10px] font-black text-red-500 uppercase tracking-widest mb-2 flex items-center gap-1">Inversión (Costo)</label>
                      <div className="relative">
                        <span className="w-3 h-3 absolute left-4 top-1/2 -translate-y-1/2 text-red-300 font-bold flex items-center justify-center text-[10px]">Q</span>
                        <input 
                          type="number" 
                          value={formData.cost}
                          onChange={(e) => setFormData({...formData, cost: e.target.value})}
                          placeholder="0.00"
                          className="w-full border border-red-100 bg-red-50/30 pl-10 pr-4 py-3 rounded-xl text-sm font-bold text-red-900 focus:outline-none focus:ring-2 focus:ring-red-200 transition-shadow shadow-sm" 
                        />
                      </div>
                   </div>
                   <div>
                      <label className="block text-[10px] font-black text-green-600 uppercase tracking-widest mb-2 flex items-center gap-1">Stock Inicial</label>
                      <input 
                        type="number" 
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        placeholder="1" 
                        className="w-full border border-green-100 bg-green-50/30 px-4 py-3 rounded-xl text-sm font-bold text-green-900 focus:outline-none focus:ring-2 focus:ring-green-200 transition-shadow shadow-sm" 
                      />
                   </div>
                </div>
               <div>
                  <label className="block text-xs font-black text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-1">Marca / Colección</label>
                  <select 
                    value={formData.supplier}
                    onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                    className="w-full border-2 border-indigo-200 bg-indigo-50/50 px-4 py-3.5 rounded-xl text-sm font-black focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 shadow-sm cursor-pointer text-indigo-900 appearance-none"
                  >
                    <option value="">Seleccionar Colección...</option>
                    <option value="Scentia">Scentia</option>
                    <option value="L&apos;Bel / &Eacute;sika / Cyzone">L&apos;Bel / &Eacute;sika / Cyzone</option>
                    <option value="Arabela">Arabela</option>
                    <option value="Avon">Avon</option>
                    <option value="Cklass">Cklass</option>
                    <option value="🥘 Venta de Comida">🥘 Venta de Comida</option>
                    <option value="Boutique Independiente">Boutique Independiente</option>
                  </select>
               </div>
               <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Fecha de Cierre de Colección
                    </label>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 7);
                          setFormData({...formData, delivery_date: d.toISOString().split('T')[0]});
                        }}
                        className="text-[9px] font-black uppercase px-2 py-1 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors"
                      >
                        +7 días
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 15);
                          setFormData({...formData, delivery_date: d.toISOString().split('T')[0]});
                        }}
                        className="text-[9px] font-black uppercase px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
                      >
                        +15 días
                      </button>
                    </div>
                  </div>
                  <input 
                    type="date" 
                    value={formData.delivery_date}
                    onChange={(e) => setFormData({...formData, delivery_date: e.target.value})}
                    className="w-full border-2 border-indigo-200 bg-white px-4 py-3.5 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-shadow shadow-sm text-indigo-900" 
                  />
                  <p className="text-[10px] text-gray-400 mt-1.5 font-medium">⚡ Esta fecha controla la presión de urgencia en la tienda.
                  </p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div>
               <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">1. Categoría Principal</label>
               <select 
                 value={formData.category}
                 onChange={(e) => setFormData({...formData, category: e.target.value, subCategory: ""})}
                 className="w-full border border-gray-300 bg-white px-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black appearance-none shadow-sm cursor-pointer"
               >
                 <option value="">Seleccionar...</option>
                 {Object.keys(CATEGORY_MAPPING).map(cat => (
                   <option key={cat} value={cat}>{cat}</option>
                 ))}
               </select>
             </div>
             <div>
               <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">2. Sub-Categoría (Línea Específica)</label>
               <select 
                 value={formData.subCategory}
                 onChange={(e) => {
                   const newSub = e.target.value;
                   let parentCat = formData.category;
                   if (newSub) {
                     for (const [cat, subs] of Object.entries(CATEGORY_MAPPING)) {
                       if (subs.includes(newSub)) {
                         parentCat = cat;
                         break;
                       }
                     }
                   }
                   setFormData({...formData, subCategory: newSub, category: parentCat});
                 }}
                 className="w-full border border-gray-300 bg-white px-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black appearance-none shadow-sm cursor-pointer"
               >
                 <option value="">Seleccionar Sub-Categoría...</option>
                 {formData.category ? (
                    CATEGORY_MAPPING[formData.category]?.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))
                 ) : (
                    Object.entries(CATEGORY_MAPPING).map(([cat, subs]) => (
                      <optgroup key={cat} label={`-- ${cat} --`}>
                        {subs.map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </optgroup>
                    ))
                 )}
               </select>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div>
               <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Etiqueta Rápida (Botones Superiores)</label>
               <select 
                 value={formData.filterTag}
                 onChange={(e) => setFormData({...formData, filterTag: e.target.value})}
                 className="w-full border border-gray-300 bg-white px-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black appearance-none shadow-sm cursor-pointer"
               >
                 <option value="Ninguno (Predeterminado)">Ninguno (Predeterminado)</option>
                 <option value="🔥 Ofertas Estrella">🔥 Ofertas Estrella</option>
                 <option value="✨ Nuevos Ingresos">✨ Nuevos Ingresos</option>
                 <option value="🎁 Combos Especiales">🎁 Combos Especiales</option>
                 <option value="💎 Alta Gama (Premium)">💎 Alta Gama (Premium)</option>
               </select>
             </div>
             <div>
               <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Descripción Detallada</label>
               <textarea 
                 rows={2} 
                 value={formData.description}
                 onChange={(e) => setFormData({...formData, description: e.target.value})}
                 placeholder="Ingresa los mililitros, colores o características especiales del producto..." 
                 className="w-full border border-gray-300 bg-white px-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black transition-shadow shadow-sm resize-none" 
               />
             </div>
          </div>

          {/* SIZING MODULE (SMART TOGGLE) */}
          <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl relative overflow-hidden transition-all duration-300">
             <div className="absolute left-0 top-0 w-1 h-full bg-indigo-500 opacity-80" />
             <button 
                type="button"
                className="flex items-center gap-3 cursor-pointer w-max outline-none group" 
                onClick={() => setHasSizes(!hasSizes)}
             >
                <div className={`transition-transform duration-200 ${hasSizes ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {hasSizes ? (
                    <CheckSquare className="w-6 h-6 text-indigo-600" />
                  ) : (
                    <Square className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <span className={`font-bold text-sm tracking-wide transition-colors ${hasSizes ? 'text-black' : 'text-gray-500 group-hover:text-gray-900'}`}>
                  Este artículo requiere Tallas o Variantes de medida
                </span>
             </button>
             
             {hasSizes ? (
                <div className="mt-5 animate-in slide-in-from-top-2 fade-in duration-300">
                  <label className="block text-[10px] font-black text-indigo-700 uppercase tracking-widest mb-2">Ingresa las tallas disponibles (Separadas por coma)</label>
                  <input 
                    type="text" 
                    autoFocus
                    value={formData.sizes}
                    onChange={(e) => setFormData({...formData, sizes: e.target.value})}
                    placeholder="Ej. S, M, L, XL   o   38, 39, 40, 41" 
                    className="w-full border-2 border-indigo-200 bg-white px-4 py-3 rounded-xl text-sm font-bold text-black focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm" 
                  />
                  <p className="text-xs text-gray-500 mt-2 font-medium">Estas opciones crearán botones inteligentes y obligatorios para el cliente en el catálogo.</p>
                </div>
                ) : (
                  <p className="text-[11px] text-gray-400 font-medium mt-3">
                    Activa esta casilla únicamente para zapatos, ropa interior, ropa de bebé, camisas o anillos.
                  </p>
                )}
          </div>

          <div className="pt-8 border-t border-gray-200 flex justify-end">
            <button 
              type="submit"
              disabled={loading}
              className={`w-full sm:w-auto bg-black text-white font-black tracking-widest uppercase text-sm px-12 py-4 rounded-xl shadow-[0_5px_15px_-3px_rgba(0,0,0,0.3)] hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:bg-gray-900 transition-all duration-300 flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white" />
              ) : (
                <Plus className="w-5 h-5"/>
              )}
              {loading ? "Publicando..." : "Publicar y Sincronizar"}
            </button>
          </div>
        </form>
        )}

        {/* ── MI INVENTARIO Y FINANZAS TAB ── */}
        {activeTab === 'inventory' && (
          <div className="p-6 sm:p-10 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            
            {/* DASHBOARD FINANCIERO ERP */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Ingresos Brutos (Caja Real) */}
                <button 
                  onClick={() => router.push('/admin/orders')}
                  className="bg-white border-2 border-green-100 p-6 rounded-[2rem] shadow-sm relative overflow-hidden group text-left transition-all hover:shadow-xl hover:-translate-y-1"
                >
                   <div className="absolute right-0 top-0 p-3 bg-green-50 text-green-500 rounded-bl-2xl group-hover:scale-110 transition-transform">
                     <ArrowUpRight className="w-5 h-5" />
                   </div>
                   <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Caja Real (Cobrado)</p>
                   <h3 className="text-2xl font-black text-black">
                      Q {finanzas.filter(f => f.tipo === 'ingreso').reduce((s, f) => s + f.monto, 0).toLocaleString()}
                   </h3>
                   <div className="mt-4 flex items-center gap-2">
                      <div className="w-full h-1 bg-green-100 rounded-full overflow-hidden">
                         <div className="h-full bg-green-500 w-[70%]" />
                      </div>
                   </div>
                </button>

                {/* 2. Inversión en Bodega (Activos) */}
                <div className="bg-white border-2 border-indigo-100 p-6 rounded-[2rem] shadow-sm relative overflow-hidden group">
                   <div className="absolute right-0 top-0 p-3 bg-indigo-50 text-indigo-500 rounded-bl-2xl">
                     <Package className="w-5 h-5" />
                   </div>
                   <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Activos en Bodega</p>
                   <h3 className="text-2xl font-black text-black">
                      Q {products.reduce((s, p) => s + ((p.cost || 0) * ((p.stock !== undefined && p.stock !== -1) ? p.stock : 0)), 0).toLocaleString()}
                   </h3>
                   <p className="text-[9px] text-gray-400 mt-2 font-bold uppercase tracking-tighter">Valor total de tu mercancía</p>
                </div>

                {/* 3. ALERTA STOCK BAJO (FUNCIONAL) */}
                <button 
                  onClick={() => { setActiveTab('inventory'); setSearchTerm("!!!LOW!!!"); }}
                  className={`p-6 rounded-[2rem] shadow-sm relative overflow-hidden group text-left transition-all hover:shadow-xl hover:-translate-y-1 border-2 ${
                    products.filter(p => (p.stock ?? 0) !== -1 && (p.stock ?? 0) < 3).length > 0 ? 'bg-orange-50 border-orange-100' : 'bg-white border-zinc-100'
                  }`}
                >
                   <div className={`absolute right-0 top-0 p-3 rounded-bl-2xl ${
                     products.filter(p => (p.stock ?? 0) !== -1 && (p.stock ?? 0) < 3).length > 0 ? 'bg-orange-500 text-white' : 'bg-zinc-50 text-zinc-400'
                   }`}>
                     <ShieldAlert className="w-5 h-5" />
                   </div>
                   <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                     products.filter(p => (p.stock ?? 0) !== -1 && (p.stock ?? 0) < 3).length > 0 ? 'text-orange-600' : 'text-zinc-400'
                   }`}>Stock Crítico</p>
                   <h3 className="text-2xl font-black text-black">
                      {products.filter(p => (p.stock ?? 0) !== -1 && (p.stock ?? 0) < 3).length} Items
                   </h3>
                   <p className="text-[9px] text-zinc-400 mt-2 font-bold uppercase tracking-tighter">Productos por agotarse</p>
                </button>

                {/* 4. Ganancia NETA Real */}
                <div className="bg-black p-6 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                   <div className="absolute right-0 top-0 p-3 bg-white/10 text-white rounded-bl-2xl">
                     <Sparkles className="w-5 h-5 animate-pulse" />
                   </div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Utilidad Neta</p>
                   <h3 className="text-2xl font-black text-white">
                      Q {(
                        finanzas.filter(f => f.tipo === 'ingreso').reduce((s, f) => s + f.monto, 0) - 
                        finanzas.filter(f => f.tipo === 'egreso').reduce((s, f) => s + f.monto, 0) -
                        orderRequests.filter(r => r.estado === 'aprobado').reduce((s, r) => s + r.items.reduce((ss, i) => ss + ((i.product?.cost || 0) * (i.quantity || 1)), 0), 0)
                      ).toLocaleString()}
                   </h3>
                   <p className="text-[9px] text-green-400 mt-2 font-bold uppercase tracking-tighter">¡Ganancia libre real! 🚀</p>
                </div>
             </div>

            {/* SECCIÓN DE EGRESOS (GASTOS) */}
            <div className="bg-gray-50 border border-gray-200 rounded-[2.5rem] p-6 sm:p-8">
               <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-sm font-black text-black uppercase tracking-tight">Control de Gastos y Movimientos</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Registra envíos, gasolina o compras extras</p>
                  </div>
                  <button 
                    onClick={() => setShowExpenseForm(!showExpenseForm)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all flex items-center gap-2"
                  >
                     <Plus className={`w-3 h-3 transition-transform ${showExpenseForm ? 'rotate-45' : ''}`} />
                     {showExpenseForm ? 'Cancelar' : 'Registrar Gasto'}
                  </button>
               </div>

               {showExpenseForm && (
                 <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-8 p-6 bg-white border border-red-100 rounded-3xl animate-in zoom-in-95 duration-200">
                    <div className="sm:col-span-4">
                       <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Monto (Q)</label>
                       <input 
                         type="number"
                         value={expenseForm.monto}
                         onChange={e => setExpenseForm({...expenseForm, monto: e.target.value})}
                         placeholder="Ej: 50.00"
                         className="w-full px-4 py-3 bg-red-50/50 border border-red-100 rounded-xl text-sm font-bold text-red-900" 
                       />
                    </div>
                    <div className="sm:col-span-6">
                       <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Concepto del Gasto</label>
                       <input 
                         type="text"
                         value={expenseForm.concepto}
                         onChange={e => setExpenseForm({...expenseForm, concepto: e.target.value})}
                         placeholder="Ej: Pago de envío Moto Express..."
                         className="w-full px-4 py-3 bg-red-50/50 border border-red-100 rounded-xl text-sm font-bold text-red-900" 
                       />
                    </div>
                    <div className="sm:col-span-2 flex items-end">
                       <button 
                         onClick={async () => {
                            if (!expenseForm.monto || !expenseForm.concepto) return;
                            await addFinanza({ 
                              tipo: 'egreso', 
                              monto: parseFloat(expenseForm.monto), 
                              concepto: expenseForm.concepto,
                              pedido_id: null
                            });
                            setExpenseForm({ monto: "", concepto: "" });
                            setShowExpenseForm(false);
                            addToast("¡Gasto registrado en el libro contable!", "success");
                         }}
                         className="w-full py-3.5 bg-red-600 text-white rounded-xl shadow-lg hover:bg-black transition-all"
                       >
                          <CheckSquare className="w-5 h-5 mx-auto" />
                       </button>
                    </div>
                 </div>
               )}

               <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2 hide-scrollbar">
                  {finanzas.map(f => (
                    <div key={f.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between group hover:border-indigo-200 transition-all">
                       <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-xl ${f.tipo === 'ingreso' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                             {f.tipo === 'ingreso' ? <ArrowUpRight className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                          </div>
                          <div>
                             <p className="text-xs font-black text-black uppercase tracking-tight truncate max-w-[200px] sm:max-w-none">{f.concepto}</p>
                             <p className="text-[9px] text-gray-400 font-bold">{new Date(f.created_at).toLocaleDateString()} · {new Date(f.created_at).toLocaleTimeString()}</p>
                          </div>
                       </div>
                       <span className={`text-sm font-black ${f.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'}`}>
                          {f.tipo === 'ingreso' ? '+' : '-'} Q {f.monto.toFixed(2)}
                       </span>
                    </div>
                  ))}
                  {finanzas.length === 0 && <p className="text-center py-6 text-xs text-gray-400 font-bold uppercase tracking-widest italic">Aún no hay movimientos contables hoy.</p>}
               </div>
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
               <div className="flex flex-col">
                  <span className="text-sm font-black text-black">
                     ESTADO DE STOCK ({products.length})
                  </span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Control de Bodega Digital</span>
               </div>
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products
                .filter(p => {
                  if (searchTerm === "!!!LOW!!!") return (p.stock ?? 0) !== -1 && (p.stock ?? 0) < 3;
                  return p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase());
                })
                .map(product => {
                  const hasImage = product.images && product.images.length > 0;
                  return (
                    <div key={product.id} className="flex gap-4 p-4 border border-gray-100 rounded-2xl hover:shadow-lg transition-all bg-white relative group">
                       <div className="w-20 h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 relative">
                          {hasImage ? (
                             <img src={product.images![0]} className="w-full h-full object-cover mix-blend-multiply" alt="" />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center bg-gray-100"><Package className="w-6 h-6 text-gray-300"/></div>
                          )}
                       </div>
                       <div className="flex-1 flex flex-col justify-center min-w-0 pr-16 relative">
                           <h3 className="text-sm font-bold text-gray-900 truncate leading-tight">{product.name}</h3>
                           <span className="text-[10px] font-black uppercase text-indigo-500 tracking-widest mt-1 mb-2 block truncate">{product.category} {product.supplier ? `· ${product.supplier}` : ''}</span>
                           <div className="flex items-center gap-4">
                              <span className="text-lg font-black text-black tracking-tighter">Q {product.price.toFixed(2)}</span>
                              
                              {/* STOCK BADGE */}
                              {product.stock !== undefined && (
                                <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                                  product.stock === -1 ? 'bg-indigo-50 text-indigo-600 border-indigo-200' :
                                  product.stock === 0 ? 'bg-red-50 text-red-600 border-red-200' :
                                  product.stock < 5 ? 'bg-amber-50 text-amber-600 border-amber-200 animate-pulse' :
                                  'bg-green-50 text-green-600 border-green-200'
                                }`}>
                                  {product.stock === -1 ? '∞ Stock' : `Bodega: ${product.stock}`}
                                </div>
                              )}
                           </div>
                           
                           {/* COST DISPLAY (ERP ONLY) */}
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2">Inversión: Q {(product.cost || 0).toFixed(2)}</p>
                        </div>
                       
                       <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                            onClick={() => setEditingProduct(product)}
                            className="p-2.5 bg-gray-50 hover:bg-black hover:text-white text-gray-600 rounded-xl transition-colors shadow-sm"
                            title="Editar Publicación"
                         >
                            <Pencil className="w-4 h-4" />
                         </button>
                         <button 
                            onClick={() => {
                               if (window.confirm(`¿Seguro que quieres eliminar "${product.name}"? Esta acción borrará el producto de la tienda y no se puede deshacer.`)) {
                                 deleteProduct(product.id);
                               }
                            }}
                            className="p-2.5 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 rounded-xl transition-colors shadow-sm"
                            title="Eliminar Publicación"
                         >
                            <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                    </div>
                  );
              })}
              {products.length === 0 && (
                 <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400">
                    <Package className="w-12 h-12 mb-4 opacity-50" />
                    <p className="font-medium text-sm">No tienes productos en el inventario.</p>
                 </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'resets' && (
          <div className="p-6 sm:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
               <div>
                 <h2 className="text-xl font-black uppercase tracking-tight text-black flex items-center gap-2">
                   <ShieldCheck className="w-6 h-6 text-indigo-500" /> Solicitudes de Acceso
                 </h2>
                 <p className="text-xs text-gray-500 font-medium font-bold uppercase tracking-tight">Validación manual de contraseñas olvidadas</p>
               </div>
               <button 
                 onClick={fetchResetRequests}
                 className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-100 flex items-center gap-2"
               >
                 <ArrowUpRight className="w-4 h-4 text-gray-400 rotate-45" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Refrescar</span>
               </button>
             </div>

             {loadingResets ? (
               <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                 <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent mb-4" />
                 <p className="text-[10px] font-black uppercase tracking-widest">Buscando solicitudes...</p>
               </div>
             ) : resetRequests.length === 0 ? (
               <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                 <div className="bg-slate-50 p-6 rounded-[3rem]">
                   <ShieldAlert className="w-12 h-12 text-slate-200" />
                 </div>
                 <div className="space-y-1">
                   <p className="text-sm font-black text-slate-400 uppercase tracking-tight">Todo bajo control</p>
                   <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">No hay peticiones de recuperación pendientes</p>
                 </div>
               </div>
             ) : (
               <div className="grid grid-cols-1 gap-4">
                 {resetRequests.map((req) => (
                   <div key={req.id} className="bg-white border border-gray-100 p-6 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 group">
                     <div className="flex items-center gap-5">
                       <div className="bg-indigo-50 p-4 rounded-3xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                         <Key className="w-6 h-6" />
                       </div>
                       <div>
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">CÓDIGO: <span className="text-indigo-600 group-hover:text-indigo-400">#{req.token}</span></p>
                         <h3 className="text-base font-black text-black uppercase tracking-tight break-all">{req.email}</h3>
                         <div className="flex flex-wrap items-center gap-3 mt-2">
                            <div className="px-3 py-1 bg-amber-50 rounded-full flex items-center gap-1.5 border border-amber-100">
                               <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                               <span className="text-[9px] font-black text-amber-600 uppercase">Punto: {req.punto_encuentro}</span>
                            </div>
                            <span className="text-[9px] text-gray-300 font-bold uppercase tracking-[0.2em]">{new Date(req.created_at).toLocaleDateString()}</span>
                         </div>
                       </div>
                     </div>
                     <button
                       onClick={() => handleApproveReset(req.id)}
                       className="w-full lg:w-auto bg-black text-white font-black text-[10px] uppercase tracking-[0.2em] px-8 py-4 rounded-2xl shadow-lg hover:shadow-indigo-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                     >
                       <ShieldCheck className="w-4 h-4" /> Aprobar Acceso
                     </button>
                   </div>
                 ))}
               </div>
             )}

             <div className="bg-amber-50/50 p-6 rounded-[2.5rem] border border-amber-100 flex items-start gap-4">
                <div className="bg-amber-100 p-2 rounded-xl mt-1">
                   <ShieldAlert className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                   <p className="text-[11px] font-black text-amber-900 uppercase tracking-tight leading-none">Recordatorio de Seguridad</p>
                   <p className="text-[10px] text-amber-700 leading-relaxed mt-2 font-medium">
                     Solo aprueba estas solicitudes si el cliente te ha contactado por WhatsApp y has verificado su identidad. Al aprobar, el cliente podrá cambiar su contraseña inmediatamente desde su navegador.
                   </p>
                </div>
             </div>
          </div>
        )}


      </div>
      
      {editingProduct && (
         <EditProductModal 
           product={editingProduct} 
           onClose={() => setEditingProduct(null)} 
         />
      )}
    </div>
  );
}
