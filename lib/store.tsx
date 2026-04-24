"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from "react";
import { Product } from "./mockData";
import { supabase } from "./supabase";
import { User } from "@supabase/supabase-js";

export interface CartItem {
  product: Product;
  size?: string;
  quantity: number;
}

interface Profile {
  id: string;
  rol: string | null;
  nombre_completo: string | null;
  avatar_url: string | null;
  celular: string | null;
  direccion: string | null;
  punto_encuentro: string | null;
  dpi: string | null;
}

export interface Order {
  id: string;
  cliente_id: string | null;
  nombre_cliente: string;
  items: { 
    id: string; 
    name: string; 
    price: number; 
    quantity: number; 
    size?: string 
  }[];
  total: number;
  anticipo: number;
  inversion: number;
  ganancia: number;
  estado: 'pendiente' | 'recibido' | 'preparacion' | 'en_transito' | 'listo_entrega' | 'cancelado';
  tipo_entrega: 'domicilio' | 'punto_encuentro';
  ubicacion_entrega: string | null;
  codigo_seguimiento: string | null;
  fecha_entrega: string | null;
  visto: boolean;
  created_at: string;
}

export interface OrderRequest {
  id: string;
  user_id: string | null;
  cliente_nombre: string;
  cliente_telefono: string;
  cliente_email: string | null;
  items: any[];
  total: number;
  anticipo: number;
  tipo_entrega: string;
  ubicacion: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  visto: boolean;
  created_at: string;
}

export interface Finanza {
  id: string;
  tipo: 'ingreso' | 'egreso';
  monto: number;
  concepto: string;
  pedido_id: string | null;
  created_at: string;
}

export interface ReservaHorario {
  id: string;
  fecha: string; // YYYY-MM-DD
  hora_inicio: string; // HH:mm
  solicitud_id: string | null; // NULL if manual block
  estado: 'bloqueado' | 'disponible';
  created_at: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

type StoreContextType = {
  isLeftSidebarOpen: boolean;
  setIsLeftSidebarOpen: (val: boolean) => void;
  isCartOpen: boolean;
  setIsCartOpen: (val: boolean) => void;
  cart: CartItem[];
  addToCart: (product: Product, size?: string) => void;
  removeFromCart: (productId: string, size?: string) => void;
  clearCart: () => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (val: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (val: boolean) => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (val: boolean) => void;
  products: Product[];
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  uploadProductImages: (files: File[]) => Promise<string[]>;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  authLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, metadata?: Partial<Profile>) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Omit<Profile, 'id' | 'rol'>>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  updateUserPassword: (password: string) => Promise<void>;
  createOrder: (orderData: Omit<Order, 'id' | 'created_at' | 'ganancia'>) => Promise<void>;
  userOrders: Order[];
  adminOrders: Order[];
  fetchUserOrders: () => Promise<void>;
  fetchAllOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, newStatus: string) => Promise<void>;
  updateOrderDetails: (orderId: string, updates: Partial<Order>) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  allUsers: Profile[];
  fetchAllUsers: () => Promise<void>;
  orderRequests: OrderRequest[];
  createOrderRequest: (data: Omit<OrderRequest, 'id' | 'created_at' | 'estado' | 'visto'>, reserva?: Omit<ReservaHorario, 'id' | 'created_at' | 'solicitud_id'>) => Promise<void>;
  fetchOrderRequests: () => Promise<void>;
  reservasHorarios: ReservaHorario[];
  fetchReservasHorarios: () => Promise<void>;
  approveOrderRequest: (id: string) => Promise<void>;
  rejectOrderRequest: (id: string) => Promise<void>;
  markRequestAsSeen: (id: string) => Promise<void>;
  markOrderAsSeen: (id: string) => Promise<void>;
  finanzas: Finanza[];
  fetchFinanzas: () => Promise<void>;
  addFinanza: (finanza: Omit<Finanza, 'id' | 'created_at'>) => Promise<void>;
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  isInitialLoading: boolean;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("Todo");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  // States
  const [reservasHorarios, setReservasHorarios] = useState<ReservaHorario[]>([]);
  const [finanzas, setFinanzas] = useState<Finanza[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [adminOrders, setAdminOrders] = useState<Order[]>([]);
  const [allUsers, setAllUsers] = useState<Profile[]>([]);
  const [orderRequests, setOrderRequests] = useState<OrderRequest[]>([]);

  // 1. UTILS (TOASTS)
  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // 2. FETCHERS (ORDENADOS PARA EVITAR ERRORES DE DECLARACIÓN)
  const fetchProducts = useCallback(async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('category', { ascending: true })
      .order('sub_category', { ascending: true })
      .order('created_at', { ascending: false });
    
    if (data) {
      setProducts(data.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        cost: p.cost || 0,
        stock: p.stock !== null ? p.stock : 1,
        images: p.image_urls || [],
        category: p.category,
        subCategory: p.sub_category,
        filterTag: p.filter_tag,
        supplier: p.supplier,
        delivery_date: p.delivery_date,
        description: p.description,
        sizes: p.sizes || []
      })));
    }
  }, []);

  const fetchReservasHorarios = useCallback(async () => {
    const { data } = await supabase
      .from('reservas_horarios')
      .select('*')
      .order('fecha', { ascending: true })
      .order('hora_inicio', { ascending: true });
    if (data) setReservasHorarios(data as ReservaHorario[]);
  }, []);

  const fetchOrderRequests = useCallback(async () => {
    const { data } = await supabase
      .from('solicitudes_pedidos')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setOrderRequests(data || []);
  }, []);

  const fetchAllOrders = useCallback(async () => {
    const { data } = await supabase
      .from('pedidos')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setAdminOrders(data || []);
  }, []);

  const fetchUserOrders = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('pedidos')
      .select('*')
      .eq('cliente_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setUserOrders(data || []);
  }, [user]);

  const fetchFinanzas = useCallback(async () => {
    const { data } = await supabase
      .from('finanzas')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setFinanzas(data || []);
  }, []);

  const fetchAllUsers = useCallback(async () => {
    const { data } = await supabase
      .from('cliente_perfiles')
      .select('*')
      .order('nombre_completo', { ascending: true });
    if (data) setAllUsers(data || []);
  }, []);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('cliente_perfiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (data) {
      setProfile(data as Profile);
      setIsAdmin(data.rol === 'admin');
    }
  }, []);

  // 3. AUTH ACTIONS
  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) await fetchProfile(data.user.id);
  }, [fetchProfile]);

  const signUp = useCallback(async (email: string, password: string, fullName: string, metadata?: Partial<Profile>) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email, password, fullName,
        celular: (metadata as any)?.celular ?? null,
        direccion: metadata?.direccion ?? null,
        punto_encuentro: metadata?.punto_encuentro ?? null,
      }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) throw signInError;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null); setProfile(null); setIsAdmin(false);
  }, []);

  // 4. PRODUCT ACTIONS
  const addProduct = useCallback(async (product: Omit<Product, 'id'>) => {
    const { error } = await supabase.from('products').insert([{
      name: product.name, price: product.price, cost: product.cost || 0,
      stock: product.stock, image_urls: product.images, category: product.category,
      sub_category: product.subCategory, supplier: product.supplier,
      delivery_date: product.delivery_date, description: product.description, sizes: product.sizes
    }]);
    if (error) throw error;
    await fetchProducts();
  }, [fetchProducts]);

  const deleteProduct = useCallback(async (id: string) => {
    await supabase.from('products').delete().eq('id', id);
    await fetchProducts();
  }, [fetchProducts]);

  const uploadProductImages = useCallback(async (files: File[]) => {
    const urls: string[] = [];
    for (const file of files) {
      const fileName = `${Date.now()}-${Math.random()}`;
      const { error } = await supabase.storage.from('products').upload(fileName, file);
      if (!error) {
        const { data } = supabase.storage.from('products').getPublicUrl(fileName);
        urls.push(data.publicUrl);
      }
    }
    return urls;
  }, []);

  // 5. ORDER ACTIONS
  const createOrderRequest = useCallback(async (data: any, reserva?: any) => {
    try {
      const { data: insertedData, error } = await supabase.from('solicitudes_pedidos').insert([{ 
        ...data, user_id: data.user_id || null, estado: 'pendiente', visto: false 
      }]).select('id').single();
      if (error) throw error;
      if (reserva && insertedData) {
        await supabase.from('reservas_horarios').insert([{ ...reserva, solicitud_id: insertedData.id, estado: 'bloqueado' }]);
      }
      await fetchOrderRequests();
      addToast("✅ Pedido registrado", "success");
    } catch (err) { throw err; }
  }, [fetchOrderRequests, addToast]);

  const approveOrderRequest = useCallback(async (requestId: string) => {
    const request = orderRequests.find(r => r.id === requestId);
    if (!request) return;

    const inversionTotal = request.items.reduce((sum: number, item: any) => {
      const p = products.find(prod => prod.id === item.id);
      return sum + ((p?.cost || 0) * (item.quantity || 1));
    }, 0);

    const { error: orderError } = await supabase.from('pedidos').insert([{
      cliente_id: request.user_id, nombre_cliente: request.cliente_nombre,
      items: request.items, total: request.total, anticipo: request.anticipo,
      inversion: inversionTotal, estado: 'recibido', tipo_entrega: request.tipo_entrega,
      ubicacion_entrega: request.ubicacion, visto: false
    }]);

    if (!orderError) {
      await supabase.from('solicitudes_pedidos').update({ estado: 'aprobado' }).eq('id', requestId);
      await fetchOrderRequests();
      await fetchAllOrders();
      addToast("✅ Pedido aprobado", "success");
    }
  }, [orderRequests, products, fetchOrderRequests, fetchAllOrders, addToast]);

  const deleteOrder = useCallback(async (recordId: string) => {
    await supabase.from('pedidos').delete().eq('id', recordId);
    await supabase.from('solicitudes_pedidos').delete().eq('id', recordId);
    await fetchAllOrders();
    await fetchOrderRequests();
    addToast("🗑️ Registro eliminado", "success");
  }, [fetchAllOrders, fetchOrderRequests, addToast]);

  const updateOrderStatus = useCallback(async (orderId: string, newStatus: string) => {
    await supabase.from('pedidos').update({ estado: newStatus }).eq('id', orderId);
    await fetchAllOrders();
  }, [fetchAllOrders]);

  const updateOrderDetails = useCallback(async (orderId: string, updates: any) => {
    await supabase.from('pedidos').update(updates).eq('id', orderId);
    await fetchAllOrders();
  }, [fetchAllOrders]);

  const addFinanza = useCallback(async (f: any) => {
    await supabase.from('finanzas').insert([f]);
    await fetchFinanzas();
  }, [fetchFinanzas]);

  // 6. INITIALIZATION & SUBSCRIPTIONS
  useEffect(() => {
    fetchProducts();
    fetchReservasHorarios();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id).finally(() => setAuthLoading(false));
      else setAuthLoading(false);
    });

    const channel = supabase.channel('db_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'solicitudes_pedidos' }, () => fetchOrderRequests())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos' }, () => fetchAllOrders())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchProducts, fetchReservasHorarios, fetchProfile, fetchOrderRequests, fetchAllOrders]);

  return (
    <StoreContext.Provider value={{
      isLeftSidebarOpen, setIsLeftSidebarOpen, isCartOpen, setIsCartOpen,
      cart, addToCart: (p: any, s?: any) => { setCart([...cart, { product: p, size: s, quantity: 1 }]); setIsCartOpen(true); },
      removeFromCart: (id: string, s?: string) => setCart(cart.filter(i => !(i.product.id === id && i.size === s))),
      clearCart: () => setCart([]),
      selectedCategory, setSelectedCategory, selectedFilter, setSelectedFilter,
      searchQuery, setSearchQuery, isAuthModalOpen, setIsAuthModalOpen,
      isProfileModalOpen, setIsProfileModalOpen, isTrackingOpen, setIsTrackingOpen,
      products, fetchProducts, addProduct, updateProduct: async () => {}, deleteProduct, uploadProductImages,
      user, profile, isAdmin, authLoading, signIn, signUp, signOut,
      updateProfile: async () => {}, resetPassword, uploadAvatar: async () => "", updateUserPassword,
      createOrder: async () => {}, userOrders, adminOrders, fetchUserOrders, fetchAllOrders,
      updateOrderStatus, updateOrderDetails, deleteOrder, allUsers, fetchAllUsers,
      orderRequests, createOrderRequest, fetchOrderRequests, reservasHorarios, fetchReservasHorarios,
      approveOrderRequest, rejectOrderRequest: async () => {}, markRequestAsSeen: async () => {},
      markOrderAsSeen: async () => {}, finanzas, fetchFinanzas, addFinanza,
      toasts, addToast, removeToast, isInitialLoading: authLoading
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}
