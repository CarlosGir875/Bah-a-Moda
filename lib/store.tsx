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
  telefono: string | null;
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
  estado: 'recibido' | 'preparacion' | 'en_transito' | 'listo_entrega' | 'cancelado';
  tipo_entrega: 'domicilio' | 'punto_encuentro';
  ubicacion_entrega: string | null;
  created_at: string;
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
  allUsers: Profile[];
  fetchAllUsers: () => Promise<void>;
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

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('category', { ascending: true })
      .order('sub_category', { ascending: true })
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error);
      return;
    }
    
    if (data) {
      // Mapping database naming (snake_case) to frontend naming (camelCase)
      const mappedProducts = data.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        images: p.image_urls || [],
        category: p.category,
        subCategory: p.sub_category,
        filterTag: p.filter_tag,
        supplier: p.supplier,
        delivery_date: p.delivery_date,
        description: p.description,
        sizes: p.sizes || []
      }));
      setProducts(mappedProducts);
    }
  }, []);

  const addProduct = useCallback(async (product: Omit<Product, 'id'>) => {
    const { error } = await supabase
      .from('products')
      .insert([{
        name: product.name,
        price: product.price,
        image_urls: product.images,
        category: product.category,
        sub_category: product.subCategory,
        filter_tag: product.filterTag,
        supplier: product.supplier,
        delivery_date: product.delivery_date,
        description: product.description,
        sizes: product.sizes
      }]);
    
    if (error) throw error;
    await fetchProducts(); // Refresh list
  }, [fetchProducts]);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    // Map frontend fields to DB snake_case fields
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.images !== undefined) dbUpdates.image_urls = updates.images;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.subCategory !== undefined) dbUpdates.sub_category = updates.subCategory;
    if (updates.filterTag !== undefined) dbUpdates.filter_tag = updates.filterTag;
    if (updates.supplier !== undefined) dbUpdates.supplier = updates.supplier;
    if (updates.delivery_date !== undefined) dbUpdates.delivery_date = updates.delivery_date;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.sizes !== undefined) dbUpdates.sizes = updates.sizes;

    const { error } = await supabase
      .from('products')
      .update(dbUpdates)
      .eq('id', id);

    if (error) throw error;
    await fetchProducts();
  }, [fetchProducts]);

  const deleteProduct = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchProducts();
  }, [fetchProducts]);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('cliente_perfiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('CRITICAL: Error fetching profile detail:', JSON.stringify(error, null, 2));
      return;
    }

    if (data) {
      setProfile(data as Profile);
      setIsAdmin(data.rol === 'admin');
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id).finally(() => setAuthLoading(false));
      } else {
        setAuthLoading(false);
      }
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Avoid re-triggering loading states on TOKEN_REFRESHED (which happens on window focus)
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        setUser(session?.user ?? null);
        if (session?.user) {
          setAuthLoading(true);
          fetchProfile(session.user.id).finally(() => setAuthLoading(false));
        } else {
          setProfile(null);
          setIsAdmin(false);
          setAuthLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setIsAdmin(false);
        setAuthLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProducts, fetchProfile]);

  // Final check for initial loading
  useEffect(() => {
    // We only wait for auth to finish. 
    // If products are slow or empty, we still want to show the app.
    if (!authLoading) {
      const timer = setTimeout(() => setIsInitialLoading(false), 1500); 
      return () => clearTimeout(timer);
    }
  }, [authLoading]);


  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) await fetchProfile(data.user.id);
  }, [fetchProfile]);

  const signUp = useCallback(async (email: string, password: string, fullName: string, metadata?: Partial<Profile>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          ...metadata
        },
      },
    });
    if (error) throw error;

    // Helper to create/update profile in cliente_perfiles
    const upsertProfile = async (userId: string) => {
      const { error: profileError } = await supabase
        .from('cliente_perfiles')
        .upsert({
          id: userId,
          nombre_completo: fullName,
          telefono: metadata?.telefono ?? null,
          direccion: metadata?.direccion ?? null,
          punto_encuentro: metadata?.punto_encuentro ?? null,
          rol: 'cliente',
        }, { onConflict: 'id' });

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }
    };

    // If session is null, try auto-sign-in (happens when email confirm is disabled but Supabase still delays session)
    if (!data.session) {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (!signInError && signInData.user) {
        await upsertProfile(signInData.user.id);
        await fetchProfile(signInData.user.id);
        return;
      }
      // Last resort: show confirmation screen
      throw new Error('EMAIL_CONFIRMATION_REQUIRED');
    }

    if (data.user) {
      await upsertProfile(data.user.id);
      await fetchProfile(data.user.id);
    }
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Omit<Profile, 'id' | 'rol'>>) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('cliente_perfiles')
      .update(updates)
      .eq('id', user.id);
    
    if (error) throw error;
    await fetchProfile(user.id);
  }, [user, fetchProfile]);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/`,
    });
    if (error) throw error;
  }, []);

  const uploadAvatar = useCallback(async (file: File) => {
    if (!user) throw new Error("No user logged in");

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    await updateProfile({ avatar_url: publicUrl });
    return publicUrl;
  }, [user, updateProfile]);

  const uploadProductImages = useCallback(async (files: File[]) => {
    if (!user) throw new Error("No user logged in");

    const urls: string[] = [];

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error for file:", file.name, uploadError);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);
      
      urls.push(publicUrl);
    }

    return urls;
  }, [user]);

  const updateUserPassword = useCallback(async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  }, []);

  const addToCart = (product: Product, size?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.size === size);
      if (existing) {
        return prev.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, size, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size?: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.size === size)));
  };

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [adminOrders, setAdminOrders] = useState<Order[]>([]);
  const [allUsers, setAllUsers] = useState<Profile[]>([]);

  const fetchAllUsers = useCallback(async () => {
    const { data, error } = await supabase
      .from('cliente_perfiles')
      .select('*')
      .order('nombre_completo', { ascending: true });
    
    if (error) {
      console.error("Error fetching users:", error);
      return;
    }
    setAllUsers(data || []);
  }, []);

  const fetchUserOrders = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .eq('cliente_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`ERROR (User:${user.id}): fetchUserOrders failed:`, JSON.stringify(error, null, 2));
      return;
    }
    setUserOrders(data || []);
  }, [user]);

  const fetchAllOrders = useCallback(async () => {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching admin orders:", error);
      return;
    }
    setAdminOrders(data || []);
  }, []);

  const createOrder = useCallback(async (orderData: Omit<Order, 'id' | 'created_at' | 'ganancia'>) => {
    const { error } = await supabase
      .from('pedidos')
      .insert([orderData]);
    
    if (error) throw error;
    await fetchUserOrders();
  }, [fetchUserOrders]);

  const updateOrderStatus = useCallback(async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('pedidos')
      .update({ estado: newStatus })
      .eq('id', orderId);
    
    if (error) throw error;
    await fetchAllOrders();
  }, [fetchAllOrders]);

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user, fetchUserOrders]);

  return (
    <StoreContext.Provider
      value={{
        isLeftSidebarOpen,
        setIsLeftSidebarOpen,
        isCartOpen,
        setIsCartOpen,
        cart,
        addToCart,
        removeFromCart,
        selectedCategory,
        setSelectedCategory,
        selectedFilter,
        setSelectedFilter,
        searchQuery,
        setSearchQuery,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        products,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        uploadProductImages,
        user,
        profile,
        isAdmin,
        authLoading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        resetPassword,
        uploadAvatar,
        updateUserPassword,
        createOrder,
        userOrders,
        adminOrders,
        fetchUserOrders,
        fetchAllOrders,
        updateOrderStatus,
        allUsers,
        fetchAllUsers,
        clearCart,
        isInitialLoading
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}
