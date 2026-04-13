"use client";

import { useStore } from "@/lib/store";
import { CATEGORY_MAPPING, Product } from "@/lib/mockData";
import { useState } from "react";
import { X, CheckSquare, Square, Trash2, ImagePlus, Calendar, Eye, Save, Plus } from "lucide-react";

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
}

export function EditProductModal({ product, onClose }: EditProductModalProps) {
  const { updateProduct, uploadProductImages, addToast } = useStore();
  
  const [loading, setLoading] = useState(false);
  const [hasSizes, setHasSizes] = useState(!!product.sizes && product.sizes.length > 0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(product.images || []);
  const [isImagesModified, setIsImagesModified] = useState(false);

  const [formData, setFormData] = useState({
    name: product.name || "",
    price: product.price ? product.price.toString() : "",
    category: product.category || "",
    subCategory: product.subCategory || "",
    filterTag: product.filterTag || "Ninguno (Predeterminado)",
    supplier: product.supplier || "",
    delivery_date: product.delivery_date || "",
    description: product.description || "",
    sizes: product.sizes ? product.sizes.join(", ") : ""
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (!isImagesModified) {
        // First modification: clear existing server images to upload fresh ones
        setIsImagesModified(true);
        setPreviews([]);
        setSelectedFiles([]);
      }
      
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
      
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    if (!isImagesModified) {
        // If they start removing existing images, flag it as modified and start from scratch 
        // Or just let them clear the array entirely
        setIsImagesModified(true);
        const newPreviews = previews.filter((_, i) => i !== index);
        setPreviews(newPreviews);
        return;
    }
    
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      addToast("Por favor completa los campos obligatorios", "error");
      return;
    }

    if (previews.length === 0) {
      addToast("Por favor incluye al menos una fotografía", "error");
      return;
    }

    setLoading(true);
    try {
      let finalImages = product.images;

      // Only upload new images if they modified the images
      if (isImagesModified && selectedFiles.length > 0) {
        finalImages = await uploadProductImages(selectedFiles);
      } else if (isImagesModified && selectedFiles.length === 0) {
          addToast("Debes añadir imágenes.", "error");
          setLoading(false);
          return;
      }

      await updateProduct(product.id, {
        name: formData.name,
        price: parseFloat(formData.price),
        images: finalImages,
        category: formData.category,
        subCategory: formData.subCategory,
        filterTag: formData.filterTag === "Ninguno (Predeterminado)" ? undefined : formData.filterTag,
        supplier: formData.supplier,
        delivery_date: formData.delivery_date,
        description: formData.description,
        sizes: hasSizes ? formData.sizes.split(",").map(s => s.trim()).filter(s => s !== "") : undefined
      });
      addToast("¡Producto actualizado con éxito!", "success");
      onClose();
    } catch (error: Error | any) {
      addToast("Error al actualizar: " + (error.message || "Error desconocido"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl flex flex-col shadow-[0_40px_120px_-20px_rgba(0,0,0,0.6)] overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] relative max-h-[96vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-xl font-black text-black uppercase tracking-tight">Editar Producto</h2>
            <p className="text-xs text-gray-500 font-medium tracking-wide">Actualización en tiempo real con Supabase</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 bg-white shadow-sm border border-gray-100 rounded-full text-black hover:bg-black hover:text-white transition-all transform hover:rotate-90"
          >
             <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Form Container Scrollable */}
        <div className="overflow-y-auto w-full p-6 sm:p-10 hide-scrollbar">
            <form className="space-y-8" onSubmit={handlePublish}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center justify-between">
                        Galería de Fotos 
                        {isImagesModified && <span className="text-[9px] bg-red-100 text-red-600 px-2 py-1 rounded">MODIFICADO</span>}
                    </label>
                    
                    {previews.length === 0 ? (
                    <label className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-3xl w-full aspect-[4/5] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-all group relative overflow-hidden">
                        <input type="file" multiple accept="image/jpeg, image/png, image/webp" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        <div className="p-4 bg-white rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                        <ImagePlus className="w-8 h-8 text-indigo-500" />
                        </div>
                        <span className="text-sm font-black text-gray-900 uppercase tracking-tight">Anular fotos y subir nuevas</span>
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
                        <label className="relative aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                            <input type="file" multiple accept="image/jpeg, image/png, image/webp" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                            <Plus className="w-6 h-6 text-gray-400" />
                            <span className="text-[9px] font-black text-gray-400 uppercase mt-1">Reemplazar Todo</span>
                        </label>
                        </div>
                    </div>
                    )}
                </div>
                </div>

                <div className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">Nombre Público</label>
                    <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full border border-gray-300 bg-white px-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black transition-shadow shadow-sm" 
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">Precio de Venta (Quetzales)</label>
                    <div className="relative">
                        <span className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold flex items-center justify-center text-xs">Q</span>
                        <input 
                        type="number" 
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full border border-gray-300 bg-white pl-10 pr-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black transition-shadow shadow-sm" 
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
                    className="w-full border border-gray-300 bg-white px-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black transition-shadow shadow-sm resize-none" 
                />
                </div>
            </div>

            {/* SIZING MODULE */}
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
                
                {hasSizes && (
                    <div className="mt-5 animate-in slide-in-from-top-2 fade-in duration-300">
                    <input 
                        type="text" 
                        value={formData.sizes}
                        onChange={(e) => setFormData({...formData, sizes: e.target.value})}
                        placeholder="Ej. S, M, L, XL   o   38, 39, 40, 41" 
                        className="w-full border-2 border-indigo-200 bg-white px-4 py-3 rounded-xl text-sm font-bold text-black focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm" 
                    />
                    </div>
                )}
            </div>

            <div className="pt-8 flex justify-end">
                <button 
                type="submit"
                disabled={loading}
                className={`w-full sm:w-auto bg-black text-white font-black tracking-widest uppercase text-sm px-12 py-4 rounded-xl shadow-[0_5px_15px_-3px_rgba(0,0,0,0.3)] hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white" />
                ) : (
                    <Save className="w-5 h-5"/>
                )}
                {loading ? "Guardando..." : "Guardar Cambios"}
                </button>
            </div>
            </form>
        </div>
      </div>
    </div>
  );
}
