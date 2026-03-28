"use client";

import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Upload, Plus, DollarSign, Package, CheckSquare, Square } from "lucide-react";

export default function AdminDashboard() {
  const { user, isAdmin, authLoading, addProduct } = useStore();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [hasSizes, setHasSizes] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    subCategory: "",
    filterTag: "Ninguno (Predeterminado)",
    supplier: "",
    delivery_date: "",
    description: "",
    sizes: ""
  });

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

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      alert("Por favor completa los campos obligatorios (Nombre, Precio, Categoría)");
      return;
    }

    setLoading(true);
    try {
      await addProduct({
        name: formData.name,
        price: parseFloat(formData.price),
        image: "", // Placeholder for now, later Cloudinary
        category: formData.category,
        filterTag: formData.filterTag === "Ninguno (Predeterminado)" ? undefined : formData.filterTag,
        supplier: formData.supplier,
        delivery_date: formData.delivery_date,
        description: formData.description,
        sizes: hasSizes ? formData.sizes.split(",").map(s => s.trim()) : undefined
      });
      alert("¡Producto publicado con éxito!");
      setFormData({
        name: "",
        price: "",
        category: "",
        subCategory: "",
        filterTag: "Ninguno (Predeterminado)",
        supplier: "",
        delivery_date: "",
        description: "",
        sizes: ""
      });
      setHasSizes(false);
    } catch (error: any) {
      alert("Error al publicar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-white p-3 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-5 sm:p-10 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black flex items-center gap-3">
              <Package className="w-5 h-5 sm:w-6 h-6"/> Admin Panel
            </h1>
            <p className="text-[10px] sm:text-sm text-gray-500 mt-1 sm:mt-2 font-medium">Gestor de Contenidos Sincronizado</p>
          </div>
          <div className="hidden sm:block">
            <span className="px-4 py-2 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest rounded-full">Sincronizado con Supabase</span>
          </div>
        </div>
        
        <form className="p-6 sm:p-10 space-y-8" onSubmit={handlePublish}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Fotografía del Producto</label>
                <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-2xl w-full aspect-[4/5] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-colors">
                   <Upload className="w-10 h-10 text-gray-400 mb-4" />
                   <span className="text-sm font-semibold text-gray-600">Tocar para Explorar Nube</span>
                   <span className="text-xs text-gray-400 mt-1">Soporta JPG, PNG, WEBP</span>
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
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">Precio de Venta (Quetzales)</label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="number" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="0.00" 
                      className="w-full border border-gray-300 bg-white pl-10 pr-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black transition-shadow shadow-sm" 
                    />
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-black text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-1">Revista / Proveedor de Origen</label>
                  <select 
                    value={formData.supplier}
                    onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                    className="w-full border-2 border-indigo-200 bg-indigo-50/50 px-4 py-3.5 rounded-xl text-sm font-black focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 shadow-sm cursor-pointer text-indigo-900 appearance-none"
                  >
                    <option value="">Seleccionar Catálogo...</option>
                    <option value="Scentia">Scentia</option>
                    <option value="L'Bel / Ésika / Cyzone">L'Bel / Ésika / Cyzone</option>
                    <option value="Arabela">Arabela</option>
                    <option value="Avon">Avon</option>
                    <option value="Cklass">Cklass</option>
                    <option value="Boutique Independiente">Boutique Independiente</option>
                  </select>
               </div>
               <div>
                  <label className="block text-xs font-black text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-1">Fecha de Ingreso / Entrega</label>
                  <input 
                    type="text" 
                    value={formData.delivery_date}
                    onChange={(e) => setFormData({...formData, delivery_date: e.target.value})}
                    placeholder="Ej. Entrega Inmediata  o  Viene el 15 de Mayo" 
                    className="w-full border-2 border-indigo-200 bg-white px-4 py-3.5 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-shadow shadow-sm text-indigo-900" 
                  />
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div>
               <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">1. Categoría Principal</label>
               <select 
                 value={formData.category}
                 onChange={(e) => setFormData({...formData, category: e.target.value})}
                 className="w-full border border-gray-300 bg-white px-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black appearance-none shadow-sm cursor-pointer"
               >
                 <option value="">Seleccionar...</option>
                 <option value="Perfumería y Lociones">Perfumería y Lociones</option>
                 <option value="Maquillaje y Rostro">Maquillaje y Rostro</option>
                 <option value="Cuidado Personal">Cuidado Personal</option>
                 <option value="Hogar y Cocina">Hogar y Cocina</option>
                 <option value="Ropa, Calzado y Accesorios">Ropa, Calzado y Accesorios</option>
                 <option value="Salud y Suplementos">Salud y Suplementos</option>
               </select>
             </div>
             <div>
               <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">2. Sub-Categoría (Línea Específica)</label>
               <select 
                 value={formData.subCategory}
                 onChange={(e) => setFormData({...formData, subCategory: e.target.value})}
                 className="w-full border border-gray-300 bg-white px-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black appearance-none shadow-sm cursor-pointer"
               >
                 <option value="">-- Perfumería y Colonias --</option>
                 <option value="Lociones de Hombre">Lociones de Hombre</option>
                 <option value="Perfumes de Mujer">Perfumes de Mujer</option>
                 <option value="Colonias Refrescantes">Colonias Refrescantes</option>
                 <option value="">-- Maquillaje y Facial --</option>
                 <option value="Labiales y Polvos">Labiales y Polvos</option>
                 <option value="Cremas Faciales y Sueros">Cremas Faciales y Sueros</option>
                 <option value="">-- Cuidado Personal --</option>
                 <option value="Cremas Corporales y Talcos">Cremas Corporales y Talcos</option>
                 <option value="Shampoo y Tratamiento Capilar">Shampoo y Tratamiento Capilar</option>
                 <option value="">-- Hogar y Bienestar --</option>
                 <option value="Cocina Pro (Utensilios, Sartenes)">Cocina Pro (Utensilios, Sartenes)</option>
                 <option value="Suplementos (Omega, Colágeno)">Suplementos (Omega, Colágeno)</option>
                 <option value="">-- Ropa y Vestimenta --</option>
                 <option value="Ropa Interior, Boxers y Fajas">Ropa Interior, Boxers y Fajas</option>
                 <option value="Camisas, Playeras y Sudaderos">Camisas, Playeras y Sudaderos</option>
                 <option value="Ropa y Artículos de Bebé">Ropa y Artículos de Bebé</option>
                 <option value="Zapatos y Calzado">Zapatos y Calzado</option>
                 <option value="Relojes y Joyería">Relojes y Joyería</option>
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
      </div>
    </div>
  );
}
