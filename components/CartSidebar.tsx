"use client";

import { useState, useEffect } from "react";
import { X, Trash2, ShoppingBag, ArrowLeft, Send } from "lucide-react";
import { useStore } from "@/lib/store";

export function CartSidebar() {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, user, profile, createOrderRequest, clearCart, addToast } = useStore();
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "form" | "success">("cart");
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryType, setDeliveryType] = useState<"domicilio" | "punto">("domicilio");
  const [formData, setFormData] = useState({
    nombre: "",
    celular: "",
    ubicacion: "",
    horario: ""
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
  const depositAmount = cartTotal * 0.5;
  const pendingBalance = cartTotal * 0.5;

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
        supplier: item.product.supplier // Añadido para distinguir comida/revista
      }));

      await createOrderRequest({
        user_id: user?.id || null,
        cliente_nombre: formData.nombre,
        cliente_telefono: formData.celular,
        cliente_email: user?.email || null,
        items: orderItems,
        total: cartTotal,
        anticipo: depositAmount,
        tipo_entrega: deliveryType === 'domicilio' ? 'domicilio' : 'punto_encuentro',
        ubicacion: formData.ubicacion,
      });

      clearCart();
      setCheckoutStep("success");
      
      // Enviar a WhatsApp opcionalmente para avisar
      const phoneNumber = "50242721798";
      const totalMsg = `🌟 *SOLICITUD ENVIADA - BAHÍA MODA*%0A_Hola, acabo de enviar mi solicitud desde la web. Quedo a la espera de confirmación._`;
      window.open(`https://wa.me/${phoneNumber}?text=${totalMsg}`, '_blank');

    } catch (err: unknown) {
      addToast("Error al enviar solicitud: " + (err instanceof Error ? err.message : "Error desconocido"), "error");
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
                            {item.product.name ? item.product.name : `Caja Estructural de Diseño`}
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

                <div className="flex items-center justify-between px-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Anticipo Reserva (50%)</span>
                  </div>
                  <span className="text-sm font-black text-indigo-600">Q{depositAmount.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between px-4 opacity-60">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Saldo Contra Entrega</span>
                  <span className="text-xs font-black text-gray-800">Q{pendingBalance.toFixed(2)}</span>
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
                 <div className="flex items-center justify-between mb-1">
                   <h3 className="text-lg font-black uppercase tracking-tight text-gray-900">Datos de Entrega</h3>
                   {!user && (
                     <span className="bg-amber-100 text-amber-700 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border border-amber-200">
                       Modo Invitado
                     </span>
                   )}
                 </div>
                 <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">
                   {user ? "Tus datos se guardarán en tu perfil." : "Tus datos no se guardarán (Compra única)."}
                 </p>
              </div>

              <form id="checkout-form" onSubmit={confirmAndSendRequest} className="space-y-6">
                 <div>
                   <label className="block text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Modo de Entrega</label>
                   <div className="grid grid-cols-2 gap-2">
                     <button 
                        type="button"
                        onClick={() => setDeliveryType("domicilio")}
                        className={`py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          deliveryType === 'domicilio' ? 'bg-black text-white border-black shadow-lg' : 'bg-white text-gray-400 border-gray-100'
                        }`}
                     >
                       A Domicilio
                     </button>
                     <button 
                        type="button"
                        onClick={() => setDeliveryType("punto")}
                        className={`py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          deliveryType === 'punto' ? 'bg-black text-white border-black shadow-lg' : 'bg-white text-gray-400 border-gray-100'
                        }`}
                     >
                       📍 Punto Seguro
                     </button>
                   </div>
                   {deliveryType === 'punto' && (
                     <p className="mt-3 text-[9px] font-bold text-indigo-600 bg-indigo-50 p-3 rounded-lg leading-relaxed border border-indigo-100">
                       💡 RECOMENDACIÓN: Si vives en una zona de difícil acceso, elige un punto público (Parque, Super 24, Muelle) por seguridad de todos.
                     </p>
                   )}
                 </div>

                 <div>
                   <label className="block text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Nombre Completo</label>
                   <input required type="text" placeholder="Ej. Ana Pérez" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="w-full border border-gray-100 bg-gray-50 px-5 py-4 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black transition-all" />
                 </div>
                 
                 <div>
                   <label className="block text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-2">
                     {deliveryType === 'domicilio' ? 'Barrio / Colonia en el Puerto' : 'Punto de Encuentro Acordado'}
                   </label>
                   <textarea required placeholder={deliveryType === 'domicilio' ? "Ej. Barrio El Centro, cerca de la iglesia..." : "Ej. Parque Central, frente al Super 24"} rows={2} value={formData.ubicacion} onChange={e => setFormData({...formData, ubicacion: e.target.value})} className="w-full border border-gray-100 bg-gray-50 px-5 py-4 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black resize-none transition-all" />
                 </div>

                 <div>
                   <label className="block text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Celular de Contacto</label>
                   <input required type="tel" placeholder="Ej. 4567 8910" value={formData.celular} onChange={e => setFormData({...formData, celular: e.target.value})} className="w-full border border-gray-100 bg-gray-50 px-5 py-4 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black transition-all" />
                 </div>
                 
                 <div>
                   <label className="block text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Horario de Entrega</label>
                   <input required type="text" placeholder="Ej. Mañana de 9am a 12pm" value={formData.horario} onChange={e => setFormData({...formData, horario: e.target.value})} className="w-full border border-gray-100 bg-gray-50 px-5 py-4 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black transition-all" />
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
                {isProcessing ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                {isProcessing ? "Enviando Solicitud..." : "Enviar Pedido a Bahía Moda"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
