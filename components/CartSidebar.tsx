"use client";

import { useState, useEffect } from "react";
import { X, Trash2, ShoppingBag, ArrowLeft, Send } from "lucide-react";
import { useStore } from "@/lib/store";

export function CartSidebar() {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, user, profile, createOrder, clearCart } = useStore();
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "form">("cart");
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryType, setDeliveryType] = useState<"domicilio" | "punto">("domicilio");
  const [formData, setFormData] = useState({
    nombre: "",
    celular: "",
    ubicacion: "",
    horario: ""
  });

  // Auto-fill from profile
  useEffect(() => {
    if (user && profile && checkoutStep === "form") {
      setFormData(prev => ({
        ...prev,
        nombre: prev.nombre || profile.nombre_completo || "",
        celular: prev.celular || profile.telefono || "",
        ubicacion: prev.ubicacion || profile.punto_encuentro || profile.direccion || ""
      }));
    }
  }, [user, profile, checkoutStep]);

  const cartTotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const depositAmount = cartTotal * 0.5;
  const pendingBalance = cartTotal - depositAmount;

  const confirmAndSendWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // 1. Guardar en Base de Datos (Si el usuario esta logueado o como invitado)
      const orderItems = cart.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        size: item.size
      }));

      await createOrder({
        cliente_id: user?.id || null,
        nombre_cliente: formData.nombre,
        items: orderItems,
        total: cartTotal,
        anticipo: depositAmount,
        inversion: 0, 
        estado: 'pendiente', 
        tipo_entrega: deliveryType === 'domicilio' ? 'domicilio' : 'punto_encuentro',
        ubicacion_entrega: formData.ubicacion,
      });

      // 2. Preparar WhatsApp
      const phoneNumber = "50230000000"; // Reemplazar con el WhatsApp real sin '+'
      const itemsText = cart.map((item) => {
        const pName = item.product.name ? item.product.name : `Producto Bahía ${item.product.category}`;
        return `- ${item.quantity}x ${pName} ${item.size ? `(Talla: ${item.size})` : ''}`;
      }).join("%0A");

      const totalMsg = 
        `🌟 *SOLICITUD DE RESERVA - BAHÍA MODA*%0A` +
        `------------------------%0A` +
        `*👤 Cliente:* ${formData.nombre}%0A` +
        `*📱 Celular:* ${formData.celular}%0A` +
        `*🚚 Entrega:* ${deliveryType === 'domicilio' ? 'A Domicilio' : '📍 Punto de Encuentro (Seguro)'}%0A` +
        `*📍 Dirección/Punto:* ${formData.ubicacion}%0A` +
        `*⏰ Horario:* ${formData.horario}%0A` +
        `------------------------%0A` +
        `*🛒 Mi Compra:*%0A${itemsText}%0A` +
        `------------------------%0A` +
        `📦 Valor Total: Q${cartTotal.toFixed(2)}%0A` +
        `💳 *Anticipo Seguridad (50%): Q${depositAmount.toFixed(2)}*%0A` +
        `🚚 Saldo Contra Entrega: Q${pendingBalance.toFixed(2)}%0A%0A` +
        `_Hola Bahía Moda, quiero coordinar mi pedido en el Puerto. Ya tengo mis datos listos._`;

      window.open(`https://wa.me/${phoneNumber}?text=${totalMsg}`, '_blank');
      
      clearCart();
      setIsCartOpen(false);
      setTimeout(() => setCheckoutStep("cart"), 500);
    } catch (err: unknown) {
      alert("Error al procesar pedido: " + (err instanceof Error ? err.message : "Error desconocido"));
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

                <div className="flex items-center justify-between mb-4 px-3">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Saldo Contra Entrega</span>
                  <span className="text-xs font-black text-gray-800">Q{pendingBalance.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => setCheckoutStep("form")}
                  className="w-full bg-black text-white font-bold tracking-widest uppercase text-[11px] sm:text-xs py-4 rounded-xl hover:bg-gray-900 shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                  Solicitar Reserva (Paso 1/2)
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

              <form id="checkout-form" onSubmit={confirmAndSendWhatsApp} className="space-y-6">
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
              {/* Form submit link layer */}
              <button
                type="submit"
                form="checkout-form"
                disabled={isProcessing}
                className={`w-full bg-[#25D366] text-white font-bold tracking-widest uppercase text-xs py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#128C7E] shadow-xl shadow-[#25D366]/20 transition-all transform hover:-translate-y-0.5 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isProcessing ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                {isProcessing ? "Procesando Pedido..." : "Coordinar Reserva por WhatsApp"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
