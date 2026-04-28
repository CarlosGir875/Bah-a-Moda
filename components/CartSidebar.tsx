"use client";

import { useState, useEffect } from "react";
import { X, Trash2, ShoppingBag, ArrowLeft, Send, Check, Package } from "lucide-react";
import { useStore } from "@/lib/store";

// Eliminado generateTimeSlots para simplificar el flujo

export function CartSidebar() {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, user, profile, createOrderRequest, clearCart, addToast, setIsProfileModalOpen } = useStore();
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "form" | "success">("cart");
  const [isProcessing, setIsProcessing] = useState(false);
  const deliveryType = "domicilio";
  
  const [formData, setFormData] = useState({
    nombre: "",
    celular: "",
    ubicacion: "",
    horario: "Pendiente",
    planPago: "50" as "50" | "100" 
  });

  // Auto-fill form if user is logged in
  useEffect(() => {
    if (user && profile && isCartOpen) {
      setFormData(prev => ({
        ...prev,
        nombre: profile.nombre_completo || "",
        celular: profile.celular || "",
        ubicacion: profile.punto_encuentro || profile.direccion || ""
      }));
    }
  }, [user, profile, isCartOpen]);

  const cartTotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const isGalaPlan = formData.planPago === "100";
  const depositAmount = isGalaPlan ? cartTotal : cartTotal * 0.5;
  const pendingBalance = isGalaPlan ? 0 : cartTotal * 0.5;

  const confirmAndSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const orderItems = cart.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        size: item.size,
        supplier: item.product.supplier 
      }));

      // INTENTAR GUARDAR EN DB (Silent Catch para no bloquear WhatsApp)
      try {
        await createOrderRequest({
          user_id: user?.id || null,
          cliente_nombre: formData.nombre,
          cliente_telefono: formData.celular,
          cliente_email: user?.email || null,
          items: orderItems,
          total: cartTotal,
          anticipo: depositAmount,
          tipo_entrega: deliveryType === 'domicilio' ? 'domicilio' : 'punto_encuentro',
          ubicacion: `${formData.ubicacion}`,
        }, {
          fecha: new Date().toISOString().split('T')[0],
          hora_inicio: 'Pendiente',
          estado: 'bloqueado'
        });
      } catch (dbErr) {
        console.warn("DB Silently Failed - Moving to WhatsApp:", dbErr);
      }

      // WHATSAPP ES PRIORIDAD TOTAL
      const phoneNumber = "50242721798";
      const itemsList = cart.map(item => 
        `▪ ${item.quantity}x ${item.product.name} ${item.size ? `(Talla: ${item.size})` : ''} - Q${(item.product.price * item.quantity).toFixed(2)}`
      ).join('\n');

      const shortId = (user?.id || 'GUEST').substring(0, 4).toUpperCase();
      const orderId = `#BM-${shortId}${Math.floor(Math.random() * 100)}`;

      const rawMessage = `${isGalaPlan ? '🚀 *[PEDIDO GALA - PAGO TOTAL]* 🚀' : '🌟 *SOLICITUD DE RESERVA - BAHÍA MODA* 🌟'}\n` +
        `------------------------------------------\n` +
        `🆔 *ID:* ${orderId}\n` +
        `👤 *Cliente:* ${formData.nombre}\n` +
        `${user?.email ? `✉️ *Correo:* ${user.email}\n` : ''}` +
        `📱 *WhatsApp:* ${formData.celular}\n` +
        `🏠 *Dirección:* ${formData.ubicacion}\n` +
        `💳 *Plan:* ${isGalaPlan ? 'PAGO TOTAL (100%)' : 'RESERVA (50%)'}\n` +
        `------------------------------------------\n\n` +
        `🛍️ *PRODUCTOS:* \n${itemsList}\n\n` +
        `💰 *INVERSIÓN:* \n` +
        `*   *Total a Depositar:* Q${depositAmount.toFixed(2)}\n` +
        `*   *Saldo Contra Entrega:* Q${pendingBalance.toFixed(2)}${isGalaPlan ? ' (¡Pagado!)' : ''}\n\n` +
        `------------------------------------------\n` +
        `⚠️ *ACCIÓN REQUERIDA:* Favor enviar fotografía del comprobante de depósito/transferencia para validar su pedido.\n\n` +
        `_Hola Bahía Moda, acabo de enviar mi solicitud desde la web. ¡Espero vuestra confirmación!_`;

      const encodedMessage = encodeURIComponent(rawMessage);
      
      // Bloqueo y cierre inmediato para evitar duplicados
      window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
      
      clearCart();
      setIsCartOpen(false); // Sacarlo del carrito de inmediato
      setCheckoutStep("cart"); // Resetear para la próxima vez
      
      // Abrir el perfil para que vea su pedido registrado
      setTimeout(() => {
        setIsProfileModalOpen(true);
        addToast("🚀 ¡Pedido enviado! Revisa tu historial.", "success");
      }, 500);

    } catch (err: unknown) {
      addToast("Hubo un problema al procesar el pedido.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 transition-opacity"
          onClick={() => { setIsCartOpen(false); setCheckoutStep("cart"); }}
        />
      )}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
          {checkoutStep === "form" ? (
             <button onClick={() => setCheckoutStep("cart")} className="flex items-center text-sm font-bold text-gray-500 hover:text-black transition-colors gap-2">
               <ArrowLeft className="w-4 h-4" /> Atrás
             </button>
          ) : (
            <h2 className="text-xl font-black uppercase tracking-widest text-black flex items-center gap-3">
              <ShoppingBag className="w-5 h-5"/> Tu Bolsa
            </h2>
          )}
          <button
            onClick={() => { setIsCartOpen(false); setCheckoutStep("cart"); }}
            className="p-2 text-gray-400 hover:text-black hover:bg-white rounded-full transition-colors shadow-sm"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {checkoutStep === "cart" ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <ShoppingBag className="w-16 h-16 mb-4 text-gray-200" />
                  <p className="font-medium tracking-wide">Tu bolsa está vacía</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {cart.map((item) => (
                    <li key={`${item.product.id}-${item.size}`} className="flex gap-4 border-b border-gray-50 pb-4">
                      <div className="relative w-20 h-24 flex-shrink-0 bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100 shadow-sm">
                        {item.product.images && item.product.images.length > 0 ? (
                          <img 
                            src={item.product.images[0]} 
                            alt={item.product.name} 
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-300 font-bold text-[8px] uppercase tracking-widest text-center px-1 leading-tight italic">
                            Bahía<br/>Moda
                          </span>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{item.product.category}</p>
                          <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2">
                            {item.product.name || `Caja Estructural de Diseño`}
                          </h3>
                          {item.size && (
                            <p className="text-xs text-gray-500 mt-1 font-medium bg-gray-100 w-max px-2 py-0.5 rounded">Talla: {item.size}</p>
                          )}
                        </div>
                        <div className="flex items-end justify-between mt-2">
                          <p className="text-sm font-black text-black">
                            Q{item.product.price} <span className="text-xs text-gray-400 font-normal">x{item.quantity}</span>
                          </p>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.size)}
                            className="p-1.5 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50 flex flex-col gap-3">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200/60">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total del Pedido</span>
                  <span className="text-lg font-black text-black">Q{cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                  <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Reserva Seguridad (50%)</span>
                  <span className="text-sm font-black text-indigo-700">Q{depositAmount.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => setCheckoutStep("form")}
                  className="w-full bg-black text-white font-bold tracking-widest uppercase text-[11px] sm:text-xs py-4 rounded-xl hover:bg-gray-900 shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                  Continuar a Datos de Envío
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white">
               <div className="mb-6">
                 <h3 className="text-lg font-black uppercase tracking-tight text-gray-900 mb-1">Datos de Entrega</h3>
                 <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                   Tu pedido será enviado por WhatsApp para confirmación inmediata.
                 </p>
              </div>

              <form id="checkout-form" onSubmit={confirmAndSendRequest} className="space-y-6">
                  <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tipo de Entrega</p>
                    <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      🏠 Envío a Domicilio (Puerto San José)
                    </p>
                  </div>

                  {/* PLAN DE PAGO SELECTION */}
                  <div className="pt-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Plan de Pago</label>
                    <div className="grid grid-cols-2 gap-3">
                       <button 
                         type="button"
                         onClick={() => setFormData({...formData, planPago: "50"})}
                         className={`p-4 rounded-2xl border-2 transition-all flex flex-col gap-1 items-start ${
                           formData.planPago === "50" ? 'bg-indigo-50 border-indigo-600 shadow-md' : 'bg-white border-gray-100'
                         }`}
                       >
                         <span className={`text-[10px] font-black uppercase tracking-widest ${formData.planPago === "50" ? 'text-indigo-600' : 'text-gray-400'}`}>Depósito / Transferencia 50%</span>
                         <span className="text-sm font-bold text-gray-900">Q{pendingBalance.toFixed(2)} Hoy</span>
                       </button>
                       <button 
                         type="button"
                         onClick={() => setFormData({...formData, planPago: "100"})}
                         className={`p-4 rounded-2xl border-2 transition-all flex flex-col gap-1 items-start ${
                           formData.planPago === "100" ? 'bg-emerald-50 border-emerald-600 shadow-md' : 'bg-white border-gray-100'
                         }`}
                       >
                         <span className={`text-[10px] font-black uppercase tracking-widest ${formData.planPago === "100" ? 'text-emerald-600' : 'text-gray-400'}`}>Total / Transferencia 100%</span>
                         <span className="text-sm font-bold text-gray-900">Pago Único Gala</span>
                       </button>
                    </div>
                  </div>

                  {/* FICHA ELEGANTE DINÁMICA */}
                  <div className={`p-6 rounded-[2rem] border-2 transition-all duration-500 animate-in slide-in-from-top-2 ${
                    isGalaPlan 
                    ? 'bg-gradient-to-br from-emerald-900 to-black border-emerald-500 shadow-2xl' 
                    : 'bg-white border-indigo-100 shadow-lg'
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${isGalaPlan ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white'}`}>
                        {isGalaPlan ? <Check className="w-6 h-6" /> : <Package className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${isGalaPlan ? 'text-emerald-400' : 'text-indigo-600'}`}>
                          {isGalaPlan ? 'Despacho Gala' : 'Reserva Garantizada'}
                        </h4>
                        <p className={`text-[11px] font-bold ${isGalaPlan ? 'text-white' : 'text-gray-900'}`}>
                          {isGalaPlan ? 'Protocolo Cliente Gala' : 'Protocolo Estándar'}
                        </p>
                      </div>
                    </div>
                    <p className={`text-[11px] font-medium leading-relaxed ${isGalaPlan ? 'text-emerald-100/60' : 'text-gray-500'}`}>
                      {isGalaPlan 
                        ? 'Tu pedido será procesado inmediatamente. Al terminar, envía tu comprobante para validar tu prioridad.' 
                        : 'Tu pedido será reservado con el 50%. Envía tu comprobante para iniciar la gestión.'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Nombre Completo</label>
                    <input required type="text" placeholder="Ej. Ana Pérez" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="w-full border border-gray-100 bg-gray-50 px-5 py-4 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black transition-all" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-2">
                      Ubicación / Punto de Encuentro
                    </label>
                    <textarea required placeholder="Indica tu dirección o punto de encuentro..." rows={2} value={formData.ubicacion} onChange={e => setFormData({...formData, ubicacion: e.target.value})} className="w-full border border-gray-100 bg-gray-50 px-5 py-4 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black resize-none transition-all" />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Celular de Contacto</label>
                    <input required type="tel" placeholder="Ej. 4567 8910" value={formData.celular} onChange={e => setFormData({...formData, celular: e.target.value})} className="w-full border border-gray-100 bg-gray-50 px-5 py-4 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black transition-all" />
                  </div>
                  
                  <div className="mt-8 bg-slate-900 border border-white/10 p-6 rounded-[2rem] text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Send className="w-6 h-6 text-indigo-400" />
                      </div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-2">Protocolo de Seguridad</h4>
                      <p className="text-[11px] font-bold text-white/60 leading-relaxed">
                        TU PEDIDO SERÁ VALIDADO POR NUESTRO EQUIPO. MANTENTE ATENTO A LAS NOTIFICACIONES PARA COMPLETAR TU ENTREGA EXCLUSIVA.
                      </p>
                    </div>
                  </div>
               </form>
            </div>

            <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50 relative">
              <button
                type="submit"
                form="checkout-form"
                disabled={isProcessing}
                className={`w-full bg-black text-white font-bold tracking-widest uppercase text-xs py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-900 shadow-xl transition-all transform hover:-translate-y-0.5 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Send className="w-5 h-5" />
                {isProcessing ? "Abriendo WhatsApp..." : "Enviar Pedido a Bahía Moda"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
