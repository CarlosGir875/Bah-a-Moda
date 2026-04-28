"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, Package, Calendar, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function VerifyOrderPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // El id viene como BM-XXXXX. Extraemos la parte XXXXX
        const shortId = id.toString().split('-')[1]?.toLowerCase();
        
        if (!shortId) {
          setError(true);
          return;
        }

        // Buscamos en pedidos y solicitudes
        const { data: pedido, error: err1 } = await supabase
          .from('pedidos')
          .select('*')
          .ilike('id', `${shortId}%`)
          .single();

        if (pedido) {
          setOrder({ ...pedido, type: 'PEDIDO OFICIAL' });
        } else {
          const { data: solicitud, error: err2 } = await supabase
            .from('solicitudes')
            .select('*')
            .ilike('id', `${shortId}%`)
            .single();
          
          if (solicitud) {
            setOrder({ ...solicitud, type: 'SOLICITUD REGISTRADA' });
          } else {
            setError(true);
          }
        }
      } catch (err) {
        console.error("Error verificando pedido:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Verificando Autenticidad...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6 border border-rose-100">
          <ShieldCheck className="w-10 h-10 text-rose-500 opacity-20" />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tighter mb-2">Orden No Encontrada</h1>
        <p className="text-sm text-zinc-500 mb-8 max-w-xs">No pudimos validar este código. Asegúrate de que el recibo sea original de Bahía Moda.</p>
        <Link href="/" className="px-8 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">
          Volver a la Tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.1)] overflow-hidden border border-white"
      >
        {/* Header Premium */}
        <div className="bg-slate-900 p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 border border-white/10 rounded-full mb-4">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-400 mb-2">Autenticidad Verificada</h2>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Bahía Moda</h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-start mb-8 border-b border-dashed border-slate-200 pb-6">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">ID DE ORDEN</p>
              <p className="text-xl font-black text-slate-900 uppercase tracking-tighter">#{id}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">TIPO</p>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">{order.type}</p>
            </div>
          </div>

          <div className="space-y-6 mb-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cliente</p>
                <p className="text-sm font-bold text-slate-900">{order.nombre_cliente || order.cliente_nombre}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Estado Actual</p>
                <p className="text-sm font-black text-emerald-600 uppercase tracking-widest">{order.estado || 'Procesando'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fecha de Registro</p>
                <p className="text-sm font-bold text-slate-900">{new Date(order.created_at).toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 mb-10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Invertido</span>
              <span className="text-2xl font-black text-slate-900 font-mono text-right">Q{Number(order.total).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-emerald-600">
              <span className="text-[10px] font-black uppercase tracking-widest">Anticipo Validado</span>
              <span className="text-lg font-black font-mono text-right">- Q{Number(order.anticipo).toFixed(2)}</span>
            </div>
          </div>

          <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
            Este certificado garantiza que el producto adquirido es una pieza auténtica gestionada por la cadena de suministro exclusiva de Bahía Moda.
          </p>
        </div>
      </motion.div>

      <Link href="/" className="mt-12 inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">
        <ArrowLeft className="w-4 h-4" /> Volver a Bahía Moda
      </Link>
    </div>
  );
}
