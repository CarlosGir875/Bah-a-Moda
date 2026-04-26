"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from "react";
import { Product } from "./mockData";
import { supabase } from "./supabase";
import { User } from "@supabase/supabase-js";

export interface CartItem {
  product: Product; size?: string; quantity: number;
}

interface Profile {
  id: string; rol: string | null; nombre_completo: string | null;
  avatar_url: string | null; celular: string | null; direccion: string | null;
  punto_encuentro: string | null; dpi: string | null;
}

export interface Order {
  id: string; cliente_id: string | null; nombre_cliente: string;
  items: any[]; total: number; anticipo: number; inversion: number; ganancia: number;
  estado: string; tipo_entrega: string; ubicacion_entrega: string | null;
  codigo_seguimiento: string | null; fecha_entrega: string | null; visto: boolean; created_at: string;
}

export interface OrderRequest {
  id: string; user_id: string | null; cliente_nombre: string; cliente_telefono: string;
  cliente_email: string | null; items: any[]; total: number; anticipo: number;
  tipo_entrega: string; ubicacion: string; estado: string; visto: boolean; created_at: string;
}

export interface Toast {
  id: string; message: string; type: 'success' | 'error' | 'info';
}

type StoreContextType = {
  isLeftSidebarOpen: boolean; setIsLeftSidebarOpen: (v: boolean) => void;
  isCartOpen: boolean; setIsCartOpen: (v: boolean) => void;
  cart: CartItem[]; addToCart: (p: Product, s?: string) => void;
  removeFromCart: (id: string, s?: string) => void; clearCart: () => void;
  selectedCategory: string; setSelectedCategory: (c: string) => void;
  selectedFilter: string; setSelectedFilter: (f: string) => void;
  searchQuery: string; setSearchQuery: (q: string) => void;
  isAuthModalOpen: boolean; setIsAuthModalOpen: (v: boolean) => void;
  isProfileModalOpen: boolean; setIsProfileModalOpen: (v: boolean) => void;
  isTrackingOpen: boolean; setIsTrackingOpen: (v: boolean) => void;
  products: Product[]; fetchProducts: () => Promise<void>;
  addProduct: (p: any) => Promise<void>; updateProduct: (id: string, u: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>; uploadProductImages: (f: File[]) => Promise<string[]>;
  user: User | null; profile: Profile | null; isAdmin: boolean; authLoading: boolean;
  signIn: (e: string, p: string) => Promise<void>;
  signUp: (e: string, p: string, f: string, m?: any) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (u: any) => Promise<void>;
  resetPassword: (e: string) => Promise<void>;
  uploadAvatar: (f: File) => Promise<string>;
  updateUserPassword: (p: string) => Promise<void>;
  userOrders: Order[]; adminOrders: Order[]; fetchUserOrders: () => Promise<void>; fetchAllOrders: () => Promise<void>;
  updateOrderStatus: (id: string, s: string) => Promise<void>;
  updateOrderDetails: (id: string, u: any) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  allUsers: Profile[]; fetchAllUsers: () => Promise<void>;
  orderRequests: OrderRequest[]; createOrderRequest: (d: any, r?: any) => Promise<void>; fetchOrderRequests: () => Promise<void>;
  reservasHorarios: any[]; fetchReservasHorarios: () => Promise<void>;
  approveOrderRequest: (id: string) => Promise<void>;
  rejectOrderRequest: (id: string) => Promise<void>;
  markRequestAsSeen: (id: string) => Promise<void>;
  markOrderAsSeen: (id: string) => Promise<void>;
  finanzas: any[]; fetchFinanzas: () => Promise<void>;
  addFinanza: (f: any) => Promise<void>;
  toasts: Toast[]; addToast: (m: string, t?: 'success'|'error'|'info') => void; removeToast: (id: string) => void;
  isInitialLoading: boolean;
  appError: string | null; retryInit: () => void;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Todo");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [appError, setAppError] = useState<string | null>(null);
  const [retryCounter, setRetryCounter] = useState(0);

  const [products, setProducts] = useState<Product[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [adminOrders, setAdminOrders] = useState<Order[]>([]);
  const [orderRequests, setOrderRequests] = useState<OrderRequest[]>([]);
  const [finanzas, setFinanzas] = useState<any[]>([]);
  const [reservasHorarios, setReservasHorarios] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<Profile[]>([]);

  const retryInit = useCallback(() => {
    setAppError(null);
    setIsInitialLoading(true);
    setRetryCounter(c => c + 1);
  }, []);

  const addToast = useCallback((message: string, type: 'success'|'error'|'info' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id: string) => setToasts(p => p.filter(t => t.id !== id)), []);

  const fetchProducts = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setProducts(data.map((p: any) => ({
        id: p.id, name: p.name, price: p.price, cost: p.cost || 0, stock: p.stock ?? 1,
        images: p.image_urls || [], category: p.category, subCategory: p.sub_category,
        filterTag: p.filter_tag, supplier: p.supplier, delivery_date: p.delivery_date, description: p.description, sizes: p.sizes || []
      })));
    } catch (e) { 
      console.warn("Fetch products failed", e); 
      throw e; 
    }
  }, []);

  const fetchProfile = useCallback(async (uid: string) => {
    try {
      const { data, error } = await supabase.from('cliente_perfiles').select('*').eq('id', uid).maybeSingle();
      if (error) throw error;
      if (data) { 
        setProfile(data as Profile);
        setIsAdmin(data.rol === 'admin'); // RELY ONLY ON DB ROLE
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
    } catch (e) { 
      console.warn("Fetch profile failed", e); 
      throw e; 
    }
  }, []);

  const fetchOrderRequests = useCallback(async () => {
    const { data } = await supabase.from('solicitudes_pedidos').select('*').order('created_at', { ascending: false });
    if (data) setOrderRequests(data);
  }, []);

  const fetchAllOrders = useCallback(async () => {
    const { data } = await supabase.from('pedidos').select('*').order('created_at', { ascending: false });
    if (data) setAdminOrders(data);
  }, []);

  const fetchUserOrders = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('pedidos').select('*').eq('cliente_id', user.id).order('created_at', { ascending: false });
    if (data) setUserOrders(data);
  }, [user]);

  const fetchFinanzas = useCallback(async () => {
    const { data } = await supabase.from('finanzas').select('*').order('created_at', { ascending: false });
    if (data) setFinanzas(data);
  }, []);

  const fetchReservasHorarios = useCallback(async () => {
    const { data } = await supabase.from('reservas_horarios').select('*').order('fecha', { ascending: true });
    if (data) setReservasHorarios(data);
  }, []);

  const fetchAllUsers = useCallback(async () => {
    const { data } = await supabase.from('cliente_perfiles').select('*').order('nombre_completo', { ascending: true });
    if (data) setAllUsers(data);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setAuthLoading(false); throw error; }
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string, metadata?: any) => {
    const res = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, fullName, ...metadata }) });
    if (!res.ok) throw new Error("Error en registro");
    await signIn(email, password);
  }, [signIn]);

  const signOut = useCallback(async () => { 
    await supabase.auth.signOut();
    setUser(null); setProfile(null); setIsAdmin(false); setAuthLoading(false);
  }, []);

  const updateProfile = useCallback(async (u: any) => {
    if (!user) return;
    try {
      await supabase.from('cliente_perfiles').update(u).eq('id', user.id);
      await fetchProfile(user.id);
    } catch (e) { console.error("Update profile failed", e); }
  }, [user, fetchProfile]);

  const resetPassword = useCallback(async (e: string) => { await supabase.auth.resetPasswordForEmail(e, { redirectTo: `${window.location.origin}/` }); }, []);
  const updateUserPassword = useCallback(async (p: string) => { await supabase.auth.updateUser({ password: p }); }, []);
  
  const uploadAvatar = useCallback(async (f: File) => {
    if (!user) return "";
    const path = `avatars/${user.id}-${Date.now()}`;
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 60000)); // 60 segundos para móviles con fotos HD
    try {
      await Promise.race([supabase.storage.from('avatars').upload(path, f), timeoutPromise]);
      const url = supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl;
      await updateProfile({ avatar_url: url });
      return url;
    } catch (err) { throw err; }
  }, [user, updateProfile]);

  const addProduct = useCallback(async (p: any) => {
    await supabase.from('products').insert([{ ...p, image_urls: p.images, sub_category: p.subCategory, filter_tag: p.filterTag }]);
    await fetchProducts();
  }, [fetchProducts]);

  const updateProduct = useCallback(async (id: string, u: any) => {
    await supabase.from('products').update({ ...u, image_urls: u.images, sub_category: u.subCategory, filter_tag: u.filterTag }).eq('id', id);
    await fetchProducts();
  }, [fetchProducts]);

  const deleteProduct = useCallback(async (id: string) => {
    await supabase.from('products').delete().eq('id', id);
    await fetchProducts();
  }, [fetchProducts]);

  const uploadProductImages = useCallback(async (files: File[]) => {
    const urls: string[] = [];
    for (const f of files) {
      const path = `${Date.now()}-${f.name}`;
      await supabase.storage.from('products').upload(path, f);
      urls.push(supabase.storage.from('products').getPublicUrl(path).data.publicUrl);
    }
    return urls;
  }, []);

  const createOrderRequest = useCallback(async (data: any, res?: any) => {
    const { data: ins, error } = await supabase.from('solicitudes_pedidos').insert([{ ...data, estado: 'pendiente', visto: false }]).select('id').single();
    if (!error && res && ins) await supabase.from('reservas_horarios').insert([{ ...res, solicitud_id: ins.id, estado: 'bloqueado' }]);
    await fetchOrderRequests();
    addToast("✅ Pedido registrado", "success");
  }, [fetchOrderRequests, addToast]);

  const approveOrderRequest = useCallback(async (id: string) => {
    const req = orderRequests.find(r => r.id === id);
    if (!req) return;
    const inv = req.items.reduce((s: number, i: any) => s + ((products.find(p => p.id === i.id)?.cost || 0) * i.quantity), 0);
    const { error } = await supabase.from('pedidos').insert([{
      cliente_id: req.user_id, nombre_cliente: req.cliente_nombre, items: req.items, total: req.total,
      anticipo: req.anticipo, inversion: inv, estado: 'recibido', tipo_entrega: req.tipo_entrega,
      ubicacion_entrega: req.ubicacion, visto: false
    }]);
    if (!error) {
      await supabase.from('solicitudes_pedidos').update({ estado: 'aprobado' }).eq('id', id);
      await fetchOrderRequests(); await fetchAllOrders();
      addToast("✅ Pedido aprobado", "success");
    }
  }, [orderRequests, products, fetchOrderRequests, fetchAllOrders, addToast]);

  const deleteOrder = useCallback(async (id: string) => {
    await supabase.from('pedidos').delete().eq('id', id);
    await supabase.from('solicitudes_pedidos').delete().eq('id', id);
    await fetchAllOrders(); await fetchOrderRequests();
    addToast("🗑️ Registro eliminado", "success");
  }, [fetchAllOrders, fetchOrderRequests, addToast]);

  const updateOrderStatus = useCallback(async (id: string, s: string) => {
    await supabase.from('pedidos').update({ estado: s }).eq('id', id);
    await fetchAllOrders();
  }, [fetchAllOrders]);

  const updateOrderDetails = useCallback(async (id: string, u: any) => {
    await supabase.from('pedidos').update(u).eq('id', id);
    await fetchAllOrders();
  }, [fetchAllOrders]);

  const markRequestAsSeen = useCallback(async (id: string) => {
    await supabase.from('solicitudes_pedidos').update({ visto: true }).eq('id', id);
    await fetchOrderRequests();
  }, [fetchOrderRequests]);

  const markOrderAsSeen = useCallback(async (id: string) => {
    await supabase.from('pedidos').update({ visto: true }).eq('id', id);
    await fetchAllOrders();
  }, [fetchAllOrders]);

  useEffect(() => {
    let isMounted = true;

    // Temporizador de seguridad ajustado a 8s (suficiente para cold starts normales)
    const safetyTimer = setTimeout(() => {
      if (isMounted && isInitialLoading) {
        setAppError("La base de datos está tardando en responder. Por favor, reintenta.");
        setIsInitialLoading(false);
      }
    }, 8000); 

    const init = async () => {
      try {
        setAppError(null);

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw new Error("Error verificando sesión: " + sessionError.message);

        if (isMounted) setUser(session?.user ?? null);

        const fetchPromises = [
          (async () => {
            // Bucle de reintento de 15 segundos para dar tiempo a Supabase a despertar
            let retries = 5;
            while (retries > 0) {
              try {
                const { data, error } = await supabase.from('products').select('id').limit(1);
                if (error) throw error;
                if (data && data.length > 0) {
                  await fetchProducts();
                  return;
                }
              } catch (e) {
                console.warn("Supabase wake-up attempt failed, retrying...", e);
              }
              await new Promise(res => setTimeout(res, 2000)); // Esperar 2 segundos por intento
              retries--;
            }
            // Último intento
            await fetchProducts();
          })().catch(e => { throw new Error("Base de datos dormida o inaccesible."); }),
          fetchReservasHorarios().catch(e => { throw new Error("Error cargando horarios."); })
        ];

        if (session?.user) {
          fetchPromises.push(fetchProfile(session.user.id).catch(e => { throw new Error("Error cargando perfil."); }));
        }

        const results = await Promise.allSettled(fetchPromises);
        
        const errors = results
          .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
          .map(r => r.reason?.message || "Error desconocido");

        if (errors.length > 0) throw new Error(errors.join(" | "));

      } catch (err: any) {
        console.error("Initialization error:", err);
        if (isMounted) setAppError(err.message || "Error crítico de conexión.");
      } finally {
        if (isMounted) {
          setAuthLoading(false);
          setIsInitialLoading(false);
          clearTimeout(safetyTimer);
        }
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id).catch(() => {});
      } else {
        setProfile(null); 
        setIsAdmin(false);
      }
      setAuthLoading(false);
    });

    return () => { 
      isMounted = false; 
      subscription.unsubscribe(); 
    };
  }, [fetchProducts, fetchReservasHorarios, fetchProfile, retryCounter]);

  const contextValue = useMemo(() => ({
    isLeftSidebarOpen, setIsLeftSidebarOpen, isCartOpen, setIsCartOpen, cart,
    addToCart: (p: any, s?: any) => { setCart(prev => [...prev, { product: p, size: s, quantity: 1 }]); setIsCartOpen(true); },
    removeFromCart: (id: string, s?: string) => setCart(prev => prev.filter(i => !(i.product.id === id && i.size === s))),
    clearCart: () => setCart([]), selectedCategory, setSelectedCategory, selectedFilter, setSelectedFilter,
    searchQuery, setSearchQuery, isAuthModalOpen, setIsAuthModalOpen, isProfileModalOpen, setIsProfileModalOpen,
    isTrackingOpen, setIsTrackingOpen, products, fetchProducts, addProduct, updateProduct, deleteProduct,
    uploadProductImages, user, profile, isAdmin, authLoading, signIn, signUp, signOut, updateProfile, resetPassword,
    uploadAvatar, updateUserPassword, createOrder: async () => {}, userOrders, adminOrders, fetchUserOrders, fetchAllOrders,
    updateOrderStatus, updateOrderDetails, deleteOrder, allUsers, fetchAllUsers, orderRequests, createOrderRequest,
    fetchOrderRequests, reservasHorarios, fetchReservasHorarios, approveOrderRequest,
    rejectOrderRequest: async (id: string) => { await supabase.from('solicitudes_pedidos').update({ estado: 'rechazado' }).eq('id', id); await fetchOrderRequests(); },
    markRequestAsSeen, markOrderAsSeen, finanzas, fetchFinanzas,
    addFinanza: async (f: any) => { await supabase.from('finanzas').insert([f]); await fetchFinanzas(); },
    toasts, addToast, removeToast, isInitialLoading, appError, retryInit
  }), [
    isLeftSidebarOpen, isCartOpen, cart, selectedCategory, selectedFilter, searchQuery, isAuthModalOpen, 
    isProfileModalOpen, isTrackingOpen, products, user, profile, isAdmin, authLoading, userOrders, 
    adminOrders, allUsers, orderRequests, reservasHorarios, finanzas, toasts, isInitialLoading, appError, retryInit,
    fetchProducts, addProduct, updateProduct, deleteProduct, uploadProductImages, signIn, signUp, 
    signOut, updateProfile, resetPassword, uploadAvatar, updateUserPassword, fetchUserOrders, 
    fetchAllOrders, updateOrderStatus, updateOrderDetails, deleteOrder, fetchAllUsers, 
    createOrderRequest, fetchOrderRequests, fetchReservasHorarios, approveOrderRequest, 
    markRequestAsSeen, markOrderAsSeen, fetchFinanzas, addToast, removeToast
  ]);

  return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}
