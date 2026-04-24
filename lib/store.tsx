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
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const ADMIN_EMAILS = ["bahiamodapuerto@gmail.com", "carlosgironmejia@gmail.com"];

export function StoreProvider({ children }: { children: ReactNode }) {
  // Navigation UI
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Todo");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  // Auth & Profile
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Business Data
  const [products, setProducts] = useState<Product[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [adminOrders, setAdminOrders] = useState<Order[]>([]);
  const [orderRequests, setOrderRequests] = useState<OrderRequest[]>([]);
  const [finanzas, setFinanzas] = useState<any[]>([]);
  const [reservasHorarios, setReservasHorarios] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<Profile[]>([]);

  // 1. HELPER: Admin Check
  const checkAdminStatus = useCallback((u: User | null, p: Profile | null) => {
    if (!u) return false;
    return ADMIN_EMAILS.includes(u.email || "") || p?.rol === 'admin';
  }, []);

  // 2. UTILS
  const addToast = useCallback((message: string, type: 'success'|'error'|'info' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id: string) => setToasts(p => p.filter(t => t.id !== id)), []);

  // 3. DATA FETCHERS (Optimized with less frequent calls)
  const fetchProducts = useCallback(async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data.map((p: any) => ({
      id: p.id, name: p.name, price: p.price, cost: p.cost || 0, stock: p.stock ?? 1,
      images: p.image_urls || [], category: p.category, subCategory: p.sub_category,
      filterTag: p.filter_tag, supplier: p.supplier, delivery_date: p.delivery_date, description: p.description, sizes: p.sizes || []
    })));
  }, []);

  const fetchProfile = useCallback(async (uid: string) => {
    const { data } = await supabase.from('cliente_perfiles').select('*').eq('id', uid).maybeSingle();
    if (data) { 
      const p = data as Profile;
      setProfile(p);
      // Dual check for admin
      setIsAdmin(ADMIN_EMAILS.includes(user?.email || "") || p.rol === 'admin');
    }
  }, [user]);

  const fetchOrderRequests = useCallback(async () => {
    if (!isAdmin) return;
    const { data } = await supabase.from('solicitudes_pedidos').select('*').order('created_at', { ascending: false });
    if (data) setOrderRequests(data);
  }, [isAdmin]);

  const fetchAllOrders = useCallback(async () => {
    if (!isAdmin) return;
    const { data } = await supabase.from('pedidos').select('*').order('created_at', { ascending: false });
    if (data) setAdminOrders(data);
  }, [isAdmin]);

  const fetchUserOrders = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('pedidos').select('*').eq('cliente_id', user.id).order('created_at', { ascending: false });
    if (data) setUserOrders(data);
  }, [user]);

  const fetchFinanzas = useCallback(async () => {
    if (!isAdmin) return;
    const { data } = await supabase.from('finanzas').select('*').order('created_at', { ascending: false });
    if (data) setFinanzas(data);
  }, [isAdmin]);

  const fetchReservasHorarios = useCallback(async () => {
    const { data } = await supabase.from('reservas_horarios').select('*').order('fecha', { ascending: true });
    if (data) setReservasHorarios(data);
  }, []);

  const fetchAllUsers = useCallback(async () => {
    if (!isAdmin) return;
    const { data } = await supabase.from('cliente_perfiles').select('*').order('nombre_completo', { ascending: true });
    if (data) setAllUsers(data);
  }, [isAdmin]);

  // 4. AUTH ACTIONS
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
    await supabase.from('cliente_perfiles').update(u).eq('id', user.id);
    await fetchProfile(user.id);
  }, [user, fetchProfile]);

  const resetPassword = useCallback(async (e: string) => { await supabase.auth.resetPasswordForEmail(e, { redirectTo: `${window.location.origin}/` }); }, []);
  const updateUserPassword = useCallback(async (p: string) => { await supabase.auth.updateUser({ password: p }); }, []);
  
  const uploadAvatar = useCallback(async (f: File) => {
    if (!user) return "";
    const path = `avatars/${user.id}-${Date.now()}`;
    await supabase.storage.from('avatars').upload(path, f);
    const url = supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl;
    await updateProfile({ avatar_url: url });
    return url;
  }, [user, updateProfile]);

  // 5. PRODUCT ACTIONS
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

  // 6. ORDER ACTIONS
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

  // 7. INITIALIZATION & RECOVERY (Optimized)
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      // Parallel fetch essential data
      await Promise.all([fetchProducts(), fetchReservasHorarios()]);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (isMounted) {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
          setIsAdmin(ADMIN_EMAILS.includes(session.user.email || ""));
        }
        setAuthLoading(false);
      }
    };

    init();

    // Session Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsAdmin(ADMIN_EMAILS.includes(session.user.email || ""));
        await fetchProfile(session.user.id);
      } else {
        setProfile(null); setIsAdmin(false);
      }
      setAuthLoading(false);
    });

    // Subscriptions (Only for Admin to save resources on mobile)
    let ch: any = null;
    if (isAdmin) {
      ch = supabase.channel('db-admin')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'solicitudes_pedidos' }, () => fetchOrderRequests())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos' }, () => fetchAllOrders())
        .subscribe();
    }

    const safetyTimer = setTimeout(() => { if (isMounted) setIsInitialLoading(false); }, 1500);

    return () => { 
      isMounted = false;
      subscription.unsubscribe(); 
      if (ch) supabase.removeChannel(ch);
      clearTimeout(safetyTimer);
    };
  }, [fetchProducts, fetchReservasHorarios, fetchProfile, fetchOrderRequests, fetchAllOrders, isAdmin]);

  // MEMOIZE CONTEXT VALUE
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
    toasts, addToast, removeToast, isInitialLoading
  }), [
    isLeftSidebarOpen, isCartOpen, cart, selectedCategory, selectedFilter, searchQuery, isAuthModalOpen, 
    isProfileModalOpen, isTrackingOpen, products, user, profile, isAdmin, authLoading, userOrders, 
    adminOrders, allUsers, orderRequests, reservasHorarios, finanzas, toasts, isInitialLoading,
    fetchProducts, addProduct, updateProduct, deleteProduct, uploadProductImages, signIn, signUp, 
    signOut, updateProfile, resetPassword, uploadAvatar, updateUserPassword, fetchUserOrders, 
    fetchAllOrders, updateOrderStatus, updateOrderDetails, deleteOrder, fetchAllUsers, 
    createOrderRequest, fetchOrderRequests, fetchReservasHorarios, approveOrderRequest, 
    markRequestAsSeen, markOrderAsSeen, fetchFinanzas, addToast, removeToast
  ]);

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}
