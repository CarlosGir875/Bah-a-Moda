"use client";
import { useState } from "react";
import { Upload, Plus, DollarSign, Package, CheckSquare, Square } from "lucide-react";

export default function AdminDashboard() {
  const [hasSizes, setHasSizes] = useState(false);

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-[#f1f2f3] p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-6 sm:p-10 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-black flex items-center gap-3">
              <Package className="w-6 h-6"/> Panel de Administración
            </h1>
            <p className="text-sm text-gray-500 mt-2 font-medium">Cascarón del Gestor de Contenidos (CMS). Aquí subirás tus fotos a Cloudinary.</p>
          </div>
          <div className="hidden sm:block">
            <span className="px-4 py-2 bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest rounded-full">Modo Offline</span>
          </div>
        </div>
        
        <form className="p-6 sm:p-10 space-y-8" onSubmit={(e) => e.preventDefault()}>
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
                  <input type="text" placeholder="Ej. Zapatos Formales de Cuero..." className="w-full border border-gray-300 bg-white px-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black transition-shadow shadow-sm" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">Precio de Venta (Quetzales)</label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="number" placeholder="0.00" className="w-full border border-gray-300 bg-white pl-10 pr-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black transition-shadow shadow-sm" />
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-black text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-1">Revista / Proveedor de Origen</label>
                  <select className="w-full border-2 border-indigo-200 bg-indigo-50/50 px-4 py-3.5 rounded-xl text-sm font-black focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 shadow-sm cursor-pointer text-indigo-900 appearance-none">
                    <option>Seleccionar Catálogo...</option>
                    <option>Scentia</option>
                    <option>L'Bel / Ésika / Cyzone</option>
                    <option>Arabela</option>
                    <option>Avon</option>
                    <option>Cklass</option>
                    <option>Boutique Independiente</option>
                  </select>
               </div>
               <div>
                  <label className="block text-xs font-black text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-1">Fecha de Ingreso / Entrega</label>
                  <input type="text" placeholder="Ej. Entrega Inmediata  o  Viene el 15 de Mayo" className="w-full border-2 border-indigo-200 bg-white px-4 py-3.5 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-shadow shadow-sm text-indigo-900" />
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div>
               <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">1. Categoría Principal</label>
               <select className="w-full border border-gray-300 bg-white px-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black appearance-none shadow-sm cursor-pointer">
                 <option>Seleccionar...</option>
                 <option>Perfumería y Lociones</option>
                 <option>Maquillaje y Rostro</option>
                 <option>Cuidado Personal</option>
                 <option>Hogar y Cocina</option>
                 <option>Ropa, Calzado y Accesorios</option>
                 <option>Salud y Suplementos</option>
               </select>
             </div>
             <div>
               <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">2. Sub-Categoría (Línea Específica)</label>
               <select className="w-full border border-gray-300 bg-white px-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black appearance-none shadow-sm cursor-pointer">
                 <option>-- Perfumería y Colonias --</option>
                 <option>Lociones de Hombre</option>
                 <option>Perfumes de Mujer</option>
                 <option>Colonias Refrescantes</option>
                 <option>-- Maquillaje y Facial --</option>
                 <option>Labiales y Polvos</option>
                 <option>Cremas Faciales y Sueros</option>
                 <option>-- Cuidado Personal --</option>
                 <option>Cremas Corporales y Talcos</option>
                 <option>Shampoo y Tratamiento Capilar</option>
                 <option>-- Hogar y Bienestar --</option>
                 <option>Cocina Pro (Utensilios, Sartenes)</option>
                 <option>Suplementos (Omega, Colágeno)</option>
                 <option>-- Ropa y Vestimenta --</option>
                 <option>Ropa Interior, Boxers y Fajas</option>
                 <option>Camisas, Playeras y Sudaderos</option>
                 <option>Ropa y Artículos de Bebé</option>
                 <option>Zapatos y Calzado</option>
                 <option>Relojes y Joyería</option>
               </select>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div>
               <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Etiqueta Rápida (Botones Superiores)</label>
               <select className="w-full border border-gray-300 bg-white px-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black appearance-none shadow-sm cursor-pointer">
                 <option>Ninguno (Predeterminado)</option>
                 <option>🔥 Ofertas Estrella</option>
                 <option>✨ Nuevos Ingresos</option>
                 <option>🎁 Combos Especiales</option>
                 <option>💎 Alta Gama (Premium)</option>
               </select>
             </div>
             <div>
               <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Descripción Detallada</label>
               <textarea rows={2} placeholder="Ingresa los mililitros, colores o características especiales del producto..." className="w-full border border-gray-300 bg-white px-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black transition-shadow shadow-sm resize-none" />
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
            <button className="w-full sm:w-auto bg-black text-white font-black tracking-widest uppercase text-sm px-12 py-4 rounded-xl shadow-[0_5px_15px_-3px_rgba(0,0,0,0.3)] hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:bg-gray-900 transition-all duration-300 flex items-center justify-center gap-2">
              <Plus className="w-5 h-5"/> Publicar y Sincronizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
