"use client";

import { useStore } from "@/lib/store";
import { useState, useMemo } from "react";
import { 
  Search, 
  ArrowLeft, 
  Package, 
  User, 
  Phone, 
  MapPin, 
  Calendar,
  ExternalLink,
  ChevronRight,
  Filter,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { generateInvoicePDF } from "@/lib/invoiceGenerator";

export default function AdminSearchPage() {
  const { adminOrders, orderRequests, fetchAllOrders, fetchOrderRequests, isAdmin } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Consolidar todos los registros (Pedidos y Solicitudes)
  const allRecords = useMemo(() => {
    const combined = [
      ...adminOrders.map(o => ({ ...o, type: 'pedido' })),
      ...orderRequests.map(r => ({ ...r, type: 'solicitud' }))
    ];
    // Eliminar duplicados si el ID es el mismo
    const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
    return unique;
  }, [adminOrders, orderRequests]);

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return allRecords.filter(item => {
      const idStr = item.id.toLowerCase();
      const shortId = item.id.split('-')[0].toLowerCase();
      const nombre = (item.nombre_cliente || item.cliente_nombre || "").toLowerCase();
      const telefono = (item.cliente_telefono || "").toLowerCase();
      
      return idStr.includes(query) || 
             shortId.includes(query) || 
             nombre.includes(query) || 
             telefono.includes(query) ||
             `bm-${shortId}`.includes(query);
    });
  }, [allRecords, searchQuery]);

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'pendiente') return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase">Pendiente</span>;
    if (s === 'recibido' || s === 'aprobado') return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase">Confirmado</span>;
    if (s === 'en_transito') return <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase">En Ruta</span>;
    if (s === 'listo_entrega') return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase">Entregado</span>;
    return <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase">{status}</span>;
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header Estilo Premium */}
      <div className="bg-white border-b border-zinc-100 pt-16 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-black mb-6 transition-all">
            <ArrowLeft className="w-3 h-3" /> Panel de Control
          </Link>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-black mb-4">Buscador Maestro</h1>
          <p className="text-sm font-bold text-zinc-400 uppercase tracking-[0.2em] mb-10">Localiza cualquier recibo o pedido al instante</p>
          
          <div className="relative">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400">
              <Search className="w-6 h-6" />
            </div>
            <input 
              type="text"
              placeholder="Pega el No. de Recibo (ej: BM-5D22) o el nombre del cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border-2 border-transparent focus:border-black focus:bg-white rounded-[2rem] py-6 pl-16 pr-8 text-lg font-bold transition-all outline-none shadow-inner"
              autoFocus
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-12">
        {searchQuery.trim() === "" ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-zinc-100">
               <Filter className="w-10 h-10 text-zinc-200" />
            </div>
            <h3 className="text-zinc-300 font-black uppercase tracking-[0.3em]">Esperando búsqueda...</h3>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[3rem] border border-zinc-100 shadow-sm">
            <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h3 className="text-xl font-black uppercase tracking-tight">No se encontró el registro</h3>
            <p className="text-zinc-400 font-bold mt-2">Verifica que el número del recibo sea correcto</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center px-4">
               <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{filteredResults.length} Coincidencias encontradas</span>
            </div>
            
            {filteredResults.map((item: any) => {
              const shortId = item.id.split('-')[0].toUpperCase();
              return (
                <div key={item.id} className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 shadow-sm hover:shadow-xl transition-all group">
                   <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex items-start gap-6">
                        <div className="w-16 h-16 bg-zinc-950 rounded-2xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                          <Package className="w-8 h-8" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-black uppercase tracking-tighter">#BM-{shortId}</h3>
                            {getStatusBadge(item.estado)}
                          </div>
                          <p className="text-sm font-bold text-zinc-500 mb-4">{item.nombre_cliente || item.cliente_nombre}</p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase">
                              <Calendar className="w-3.5 h-3.5" /> {new Date(item.created_at).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase">
                              <Phone className="w-3.5 h-3.5" /> {item.cliente_telefono || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap md:flex-col justify-end gap-2">
                        <button 
                          onClick={() => generateInvoicePDF(item)}
                          className="flex items-center gap-2 bg-zinc-100 hover:bg-black hover:text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                          <Download className="w-4 h-4" /> Recibo PDF
                        </button>
                        {item.comprobante_url && (
                          <button 
                            onClick={() => window.open(item.comprobante_url, '_blank')}
                            className="flex items-center gap-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-emerald-100"
                          >
                            <Eye className="w-4 h-4" /> Ver Depósito
                          </button>
                        )}
                        <Link 
                          href={item.type === 'pedido' ? '/admin/orders' : '/admin/requests'}
                          className="flex items-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-indigo-100"
                        >
                          Ir a Gestión <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                   </div>
                   
                   <div className="mt-8 pt-8 border-t border-zinc-50 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-zinc-400">
                        <MapPin className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase truncate max-w-[300px]">{item.ubicacion_entrega || item.ubicacion || 'Puerto San José'}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-zinc-300 uppercase mb-1">Total del Registro</p>
                        <p className="text-2xl font-black font-mono">Q{item.total}</p>
                      </div>
                   </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
