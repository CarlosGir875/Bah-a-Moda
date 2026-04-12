"use client";

import { useState, useEffect } from "react";
import { X, User, LogIn, UserPlus, Package, Eye, EyeOff, Check, Send } from "lucide-react";
import { useStore } from "@/lib/store";

export function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, signIn, signUp, resetPassword, updateUserPassword, addToast } = useStore();
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
  const [welcomeName, setWelcomeName] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetStep, setResetStep] = useState<"request" | "validation" | "new-password">("request");
  const [resetToken, setResetToken] = useState("");
  const [foundName, setFoundName] = useState("");

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
          celular: formData.telefono,
          direccion: formData.direccion,
          punto_encuentro: formData.punto_encuentro
        } as any);
        setWelcomeName(formData.name);
        // We don't close immediately to show the welcome screen
      } else if (mode === "reset") {
        if (resetStep === "request") {
          const res = await fetch('/api/auth/request-reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email, punto_encuentro: formData.punto_encuentro })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          
          setResetToken(data.token);
          setFoundName(data.nombre);
          setResetStep("validation");
          addToast("Datos verificados. Sigue el siguiente paso.", "success");
        } else if (resetStep === "validation") {
           // Verificar si ya fue aprovada
           const res = await fetch(`/api/auth/check-reset?email=${formData.email}&token=${resetToken}`);
           const data = await res.json();
           if (data.aprobada) {
             setResetStep("new-password");
             addToast("¡Solicitud aprobada! Ingresa tu nueva clave.", "success");
           } else {
             addToast("Tu solicitud sigue pendiente de aprobación por el Administrador.", "info");
           }
        } else if (resetStep === "new-password") {
          if (formData.password !== formData.confirmPassword) {
            throw new Error("Las contraseñas no coinciden");
          }
          const res = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              email: formData.email, 
              token: resetToken, 
              newPassword: formData.password 
            })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);

          addToast("¡Contraseña actualizada con éxito!", "success");
          setMode("login");
          setResetStep("request");
        }
      } else if (mode === "new-password") {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Las contraseñas no coinciden");
        }
        await updateUserPassword(formData.password);
        addToast("¡Contraseña actualizada con éxito!", "success");
        setMode("login");
      }
    } catch (error: any) {
      // Special case: email confirmation required — show success screen instead of error
      if (error.message === 'EMAIL_CONFIRMATION_REQUIRED') {
        setEmailConfirmSent(true);
        return;
      }
      addToast(error.message || "Ocurrió un error", "error");
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
                  {mode === "login" ? "Iniciar Sesión" : mode === "register" ? "Crear Cuenta" : mode === "new-password" ? "Nueva Contraseña" : "Recuperar Acceso"}
                </h2>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Bahía Moda</p>
              </div>
            </div>
            <button onClick={() => setIsAuthModalOpen(false)} className="p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          {welcomeName ? (
            <div className="p-10 text-center space-y-7 animate-in fade-in zoom-in duration-700 relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-black/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-black/5 rounded-full blur-3xl"></div>

              <div className="relative mx-auto w-24 h-24">
                <div className="absolute inset-0 bg-black rounded-full animate-ping opacity-10"></div>
                <div className="relative bg-black text-white rounded-full w-full h-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110 duration-500">
                  <User className="w-10 h-10" strokeWidth={1.2} />
                </div>
              </div>
              
              <div className="space-y-3 relative z-10">
                <h3 className="text-3xl font-black uppercase tracking-tighter text-black leading-none italic">
                  ¡BIENVENIDA!
                </h3>
                <p className="text-xl font-bold text-gray-900 uppercase tracking-tight">{welcomeName.split(' ')[0]}</p>
                <div className="h-0.5 w-12 bg-black mx-auto rounded-full"></div>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] pt-2">Ya eres parte de la familia <br/> Bahía Moda</p>
              </div>

              <div className="py-5 px-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center gap-4 text-left shadow-sm">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex-shrink-0">
                  <Package className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-black">Catálogo Completo</p>
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Haz tu primer pedido hoy</p>
                </div>
              </div>

              <button 
                onClick={() => {
                  setWelcomeName(null);
                  setIsAuthModalOpen(false);
                }}
                className="w-full bg-black text-white font-black text-xs uppercase tracking-[0.4em] py-6 rounded-[2rem] hover:bg-gray-900 transition-all shadow-2xl hover:scale-[1.02] active:scale-95 border-b-4 border-gray-800"
              >
                EMPEZAR A COMPRAR
              </button>
            </div>
          ) : emailConfirmSent ? (
            <div className="p-8 text-center space-y-4 animate-in fade-in duration-500">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-lg font-black uppercase tracking-tighter text-black">¡Cuenta Lista!</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Tu cuenta fue creada exitosamente.<br/>
                Ya puedes iniciar sesión con tu correo y contraseña.
              </p>
              <button 
                onClick={() => { setEmailConfirmSent(false); setMode("login"); }}
                className="w-full bg-black text-white font-black text-[10px] uppercase tracking-widest py-4 rounded-xl hover:bg-gray-900 transition-all"
              >
                Iniciar Sesión Ahora
              </button>
            </div>
          ) : mode === "reset" ? (
            <div className="max-h-[70vh] overflow-y-auto px-6 py-4 custom-scrollbar">
              {resetStep === "request" ? (
                <form onSubmit={handleSubmit} className="space-y-4 px-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center px-4 leading-none mb-6">
                    Validación de Seguridad
                  </p>
                  <p className="text-[11px] text-gray-500 leading-relaxed text-center px-4 mb-4">
                    Ingresa tu correo y tu <strong>Punto de Encuentro Seguro</strong> para validar tu identidad.
                  </p>
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
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Tu Punto de Encuentro Seguro</label>
                    <input
                      required
                      type="text"
                      placeholder="Ej. Frente a la muni..."
                      value={formData.punto_encuentro}
                      onChange={e => setFormData({ ...formData, punto_encuentro: e.target.value })}
                      className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white font-black text-xs uppercase tracking-widest py-5 rounded-2xl hover:bg-gray-900 transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
                  >
                    {loading ? "Verificando..." : "Validar Datos"}
                  </button>
                </form>
              ) : resetStep === "validation" ? (
                <div className="space-y-8 text-center py-4 px-2">
                  <div className="bg-indigo-50/50 p-8 rounded-[2.5rem] border border-indigo-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl -mr-12 -mt-12" />
                    <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.3em] mb-3">Tu Código Único</p>
                    <p className="text-4xl font-black text-indigo-600 tracking-[0.2em] italic">#{resetToken}</p>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-black text-black uppercase tracking-tight italic">¡HOLA {foundName.split(' ')[0]}!</h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed font-bold uppercase tracking-tight">
                      Tus datos coinciden. Ahora debes contactar al Administrador para que apruebe tu solicitud.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        const msg = `Hola Bahía Moda, soy ${foundName}. Olvidé mi clave de la cuenta ${formData.email}. Solicito aprobación para mi código de recuperación: #${resetToken}`;
                        window.open(`https://wa.me/50242721798?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      className="w-full bg-[#25D366] text-white font-black text-xs uppercase tracking-widest py-5 rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-green-100 hover:scale-[1.02]"
                    >
                      <Send className="w-4 h-4" /> Validar por WhatsApp
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest py-4 rounded-xl hover:bg-black transition-all"
                    >
                      {loading ? "Verificando Estado..." : "Ya hablé con el Admin, Continuar"}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 px-1 py-2">
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 mb-6 flex items-center gap-3">
                    <div className="bg-emerald-500 text-white p-1.5 rounded-full">
                      <Check className="w-3 h-3" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest leading-none">Solicitud Aprobada</p>
                        <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-tighter">Estás a un paso de recuperar tu acceso</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 px-1">Nueva Contraseña</label>
                      <div className="relative">
                        <input
                          required
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={e => setFormData({ ...formData, password: e.target.value })}
                          className="w-full border border-gray-200 bg-gray-50 px-4 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all pr-12 font-bold"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 px-1">Confirmar Contraseña</label>
                      <div className="relative">
                        <input
                          required
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="w-full border border-gray-200 bg-gray-50 px-4 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all pr-12 font-bold"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-gray-900 transition-all shadow-xl hover:shadow-2xl"
                  >
                    {loading ? "Actualizando..." : "ACTUALIZAR MI CLAVE"}
                  </button>
                </form>
              )}
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
              {mode !== "new-password" && (
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
              )}
              {mode !== "new-password" && (
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
                  <div className="relative">
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === "new-password" && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Confirmar Nueva Contraseña</label>
                  <div className="relative">
                    <input
                      required
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
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
                  mode === "login" ? <LogIn className="w-4 h-4" /> : mode === "register" ? <UserPlus className="w-4 h-4" /> : mode === "new-password" ? <Check className="w-4 h-4" /> : "Enviar Instrucciones"
                )}
                {loading ? "Procesando..." : (mode === "login" ? "Entrar a mi Cuenta" : mode === "register" ? "Crear Cuenta Gratis" : mode === "new-password" ? "Actualizar Contraseña" : "Recuperar Contraseña")}
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
