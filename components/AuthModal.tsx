"use client";

import { useState, useEffect } from "react";
import { X, User, LogIn, UserPlus, Package } from "lucide-react";
import { useStore } from "@/lib/store";

export function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, signIn, signUp, resetPassword, updateUserPassword } = useStore();
  const [mode, setMode] = useState<"login" | "register" | "reset" | "new-password">("login");
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "", 
    confirmPassword: "", 
    name: "",
    telefono: "",
    direccion: "",
    punto_encuentro: ""
  });
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [emailConfirmSent, setEmailConfirmSent] = useState(false);

  // Detect recovery flow
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash.includes("type=recovery") || hash.includes("access_token=")) {
        setMode("new-password");
        setIsAuthModalOpen(true);
      }
    }
  }, [setIsAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        await signIn(formData.email, formData.password);
        setIsAuthModalOpen(false);
      } else if (mode === "register") {
        await signUp(formData.email, formData.password, formData.name, {
          telefono: formData.telefono,
          direccion: formData.direccion,
          punto_encuentro: formData.punto_encuentro
        });
        setIsAuthModalOpen(false);
      } else if (mode === "reset") {
        await resetPassword(formData.email);
        setResetSent(true);
      } else if (mode === "new-password") {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Las contraseñas no coinciden");
        }
        await updateUserPassword(formData.password);
        alert("¡Contraseña actualizada con éxito! Ya puedes iniciar sesión.");
        setMode("login");
      }
    } catch (error: any) {
      // Special case: email confirmation required — show success screen instead of error
      if (error.message === 'EMAIL_CONFIRMATION_REQUIRED') {
        setEmailConfirmSent(true);
        return;
      }
      alert(error.message || "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
        onClick={() => setIsAuthModalOpen(false)}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden pointer-events-auto animate-in zoom-in-95 fade-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-black text-white rounded-xl p-2">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black uppercase tracking-tight text-black">
                  {mode === "login" ? "Iniciar Sesión" : mode === "register" ? "Crear Cuenta" : "Recuperar Acceso"}
                </h2>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Bahía Moda</p>
              </div>
            </div>
            <button onClick={() => setIsAuthModalOpen(false)} className="p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          {emailConfirmSent ? (
            <div className="p-8 text-center space-y-4 animate-in fade-in duration-500">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📧</span>
              </div>
              <h3 className="text-lg font-black uppercase tracking-tighter text-black">¡Cuenta creada!</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Enviamos un correo de confirmación a <strong>{formData.email}</strong>.<br/>
                Revisa tu bandeja de entrada (y el spam) y haz clic en el enlace para activar tu cuenta.
              </p>
              <button 
                onClick={() => setIsAuthModalOpen(false)}
                className="w-full bg-black text-white font-black text-[10px] uppercase tracking-widest py-4 rounded-xl hover:bg-gray-900 transition-all"
              >
                Entendido, revisar correo
              </button>
            </div>
          ) : mode === "reset" && resetSent ? (
            <div className="p-8 text-center space-y-4 animate-in fade-in duration-500">
               <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📧</span>
               </div>
               <h3 className="text-lg font-black uppercase tracking-tighter text-black">¡Correo Enviado!</h3>
               <p className="text-xs text-gray-500 leading-relaxed">
                 Hemos enviado un enlace de recuperación a <strong>{formData.email}</strong>. Revisa tu bandeja de entrada.
               </p>
               <button 
                onClick={() => setMode("login")}
                className="w-full bg-black text-white font-black text-[10px] uppercase tracking-widest py-4 rounded-xl hover:bg-gray-900 transition-all"
               >
                 Volver al Inicio
               </button>
            </div>
          ) : (
            <div className="max-h-[70vh] overflow-y-auto px-6 py-4 custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "register" && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 px-1">Nombre Completo *</label>
                      <input
                        required
                        type="text"
                        placeholder="Ej. María García"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 px-1">WhatsApp / Celular *</label>
                      <input
                        required
                        type="tel"
                        placeholder="Ej. 3045-8921"
                        value={formData.telefono}
                        onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                        className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 px-1">Dirección de Casa (Opcional)</label>
                      <input
                        type="text"
                        placeholder="Barrio El Centro, Casa #..."
                        value={formData.direccion}
                        onChange={e => setFormData({ ...formData, direccion: e.target.value })}
                        className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 px-1">Punto de Encuentro Seguro *</label>
                      <input
                        required
                        type="text"
                        placeholder="Ej. Parque Central, Super 24..."
                        value={formData.punto_encuentro}
                        onChange={e => setFormData({ ...formData, punto_encuentro: e.target.value })}
                        className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
                      />
                    </div>
                  </>
                )}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Correo Electrónico</label>
                <input
                  required
                  type="email"
                  placeholder="tuemail@gmail.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>
              {mode !== "reset" && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500">Contraseña</label>
                    {mode === "login" && (
                      <button 
                        type="button"
                        onClick={() => setMode("reset")}
                        className="text-[9px] font-black uppercase tracking-tighter text-indigo-600 hover:underline"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    )}
                  </div>
                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-black text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-gray-900 transition-all flex items-center justify-center gap-2 mt-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white" />
                ) : (
                  mode === "login" ? <LogIn className="w-4 h-4" /> : mode === "register" ? <UserPlus className="w-4 h-4" /> : "Enviar Instrucciones"
                )}
                {loading ? "Procesando..." : (mode === "login" ? "Entrar a mi Cuenta" : mode === "register" ? "Crear Cuenta Gratis" : "Recuperar Contraseña")}
              </button>
            </form>
          </div>
        )
      }

          {/* Beneficios de tener cuenta */}
          {mode === "register" && (
            <div className="px-6 pb-5">
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Beneficios gratuitos</p>
                <ul className="space-y-2">
                  {["Ver historial de todos tus pedidos", "Datos de entrega pre-llenados", "Acceso a preventa exclusiva"].map(b => (
                    <li key={b} className="flex items-center gap-2 text-xs font-medium text-gray-600">
                      <Package className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Toggle */}
          <div className="px-6 pb-6 text-center">
            <p className="text-xs text-gray-500">
              {mode === "login" ? "¿No tienes cuenta?" : mode === "register" ? "¿Ya tienes cuenta?" : "¿Ya recordaste?"}
              {" "}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setResetSent(false);
                }}
                className="font-black text-black underline underline-offset-2 hover:no-underline transition-all"
              >
                {mode === "login" ? "Crear una gratis" : "Inicia sesión"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
