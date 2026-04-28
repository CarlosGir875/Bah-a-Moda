"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, Package, Calendar, ShieldCheck, ArrowLeft, Loader2, QrCode } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
        // Extraer el código después del guion (ej: de BM-CC106 extrae CC106)
        // O si pasan el ID completo, usarlo tal cual
        const rawId = id.toString();
        const searchId = rawId.includes('-') ? rawId.split('-')[1].toLowerCase() : rawId.toLowerCase();
        
        if (!searchId) {
          setError(true);
          return;
        }

        // Búsqueda inteligente: buscamos pedidos cuyo ID EMPIECE con ese código
        const { data: pedido, error: err } = await supabase
          .from('pedidos')
          .select('*')
          .ilike('id', `${searchId}%`)
          .limit(1)
          .single();

        if (pedido) {
          setOrder(pedido);
        } else {
          // Si no está en pedidos, intentar buscar en solicitudes (respaldo)
          const { data: solicitud } = await supabase
            .from('solicitudes')
            .select('*')
            .ilike('id', `${searchId}%`)
            .limit(1)
            .single();

          if (solicitud) {
            setOrder(solicitud);
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
        <div className="relative">
          <Loader2 className="w-16 h-16 text-slate-900 animate-spin mb-4" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[8px] font-black uppercase text-slate-900">BM</span>
          </div>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400 mt-4">Validando con el Servidor Central...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-2xl border border-rose-100 max-w-sm"
        >
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6 mx-auto">
            <ShieldCheck className="w-10 h-10 text-rose-500 opacity-30" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter mb-4 text-slate-900">ERROR DE AUTENTICIDAD</h1>
          <p className="text-sm text-zinc-500 mb-8 leading-relaxed">Este código no coincide con ningún pedido oficial de Bahía Moda. Por favor, verifique que su recibo sea original.</p>
          <Link href="/" className="inline-block px-10 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all active:scale-95">
            Volver al Inicio
          </Link>
        </motion.div>
      </div>
    );
  }

  const nightBlue = "#0f172a";
  const champagneGold = "#c49a6c";

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center py-12 px-4 sm:px-6">
      {/* LUXURY VERIFICATION INTERFACE */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-[0_50px_120px_rgba(0,0,0,0.15)] overflow-hidden border border-[#e5e4e2] relative"
      >
        {/* Decorative elements similar to PDF */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#c49a6c]/5 rounded-bl-full -z-0" />
        
        {/* Header - PDF Style */}
        <div className="bg-[#0f172a] p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/5 border border-[#c49a6c]/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-serif italic font-black text-[#c49a6c]">BM</span>
            </div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.8em] text-[#c49a6c] mb-3">Bahía Moda Exclusive</h2>
            <h1 className="text-3xl font-serif italic font-black text-white tracking-tighter">Certificado Digital</h1>
          </div>
        </div>

        {/* Verification Badge */}
        <div className="flex justify-center -mt-6 relative z-20">
          <div className="bg-white px-8 py-3 rounded-full border border-emerald-100 shadow-xl flex items-center gap-3">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">PEDIDO ORIGINAL VERIFICADO</span>
          </div>
        </div>

        {/* Order Content */}
        <div className="p-8 sm:p-12">
          {/* Main Info Box */}
          <div className="bg-slate-50 rounded-[2rem] p-8 mb-8 border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">CÓDIGO OFICIAL</p>
                <p className="text-2xl font-black text-slate-900 uppercase tracking-tighter">#{id}</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">ESTADO</p>
                <span className="text-[9px] font-black uppercase px-4 py-1.5 bg-[#0f172a] text-[#c49a6c] rounded-lg tracking-widest">
                  {order.estado || 'PROCESANDO'}
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-4">
                <CheckCircle2 className="w-4 h-4 text-[#c49a6c]" />
                <p className="text-sm font-bold text-slate-700">CLIENTE: <span className="font-black text-slate-900 uppercase">{order.cliente_nombre}</span></p>
              </div>
              <div className="flex items-center gap-4">
                <Calendar className="w-4 h-4 text-[#c49a6c]" />
                <p className="text-sm font-bold text-slate-700">FECHA: <span className="font-black text-slate-900 uppercase">{new Date(order.created_at).toLocaleDateString()}</span></p>
              </div>
            </div>
          </div>

          {/* Items Table - PDF Replica */}
          <div className="mb-10">
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 text-center">Resumen de Inversión</h4>
            <div className="space-y-4">
              {order.items?.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#c49a6c]" />
                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">{item.quantity}x {item.name}</span>
                  </div>
                  <span className="font-serif font-black text-slate-900">Q{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals - PDF Style */}
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full" />
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#c49a6c]/60">Total</span>
              <span className="text-xl font-serif italic text-[#c49a6c]">Q{Number(order.total).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Abonado</span>
              <span className="text-lg font-serif italic text-emerald-400">- Q{Number(order.anticipo).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-black uppercase tracking-[0.2em] text-white">Saldo Restante</span>
              <span className="text-3xl font-serif font-black text-white tracking-tighter">Q{(order.total - order.anticipo).toFixed(2)}</span>
            </div>
          </div>

          {/* Footer - PDF Style */}
          <div className="mt-10 text-center">
             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed mb-8">
               Esta información proviene directamente de los servidores maestros de Bahía Moda. Si los datos en el papel difieren de esta pantalla, el documento ha sido alterado.
             </p>
             <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-[1px] bg-[#e5e4e2] mb-2" />
                <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.5em]">BM-AUTH-PROTOCOL-v1.6</p>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Back to shop */}
      <Link href="/" className="mt-12 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-slate-900 transition-all">
        <ArrowLeft className="w-5 h-5" /> Volver a Bahía Moda
      </Link>
    </div>
  );
}
