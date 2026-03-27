"use client";

import { useState } from "react";
import { X, User, LogIn, UserPlus, Package } from "lucide-react";
import { useStore } from "@/lib/store";

export function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen } = useStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to Supabase Auth on Phase 2
    alert("Conectar a Supabase Auth ¡próximamente!");
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
                  {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
                </h2>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Bahía Moda</p>
              </div>
            </div>
            <button onClick={() => setIsAuthModalOpen(false)} className="p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Nombre Completo</label>
                <input
                  required
                  type="text"
                  placeholder="Ej. María García"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>
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
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Contraseña</label>
              <input
                required
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-gray-900 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {mode === "login" ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              {mode === "login" ? "Entrar a mi Cuenta" : "Crear Cuenta Gratis"}
            </button>
          </form>

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
              {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
              {" "}
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
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
