"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "./mockData";

export interface CartItem {
  product: Product;
  size?: string;
  quantity: number;
}

type StoreContextType = {
  isLeftSidebarOpen: boolean;
  setIsLeftSidebarOpen: (val: boolean) => void;
  isCartOpen: boolean;
  setIsCartOpen: (val: boolean) => void;
  cart: CartItem[];
  addToCart: (product: Product, size?: string) => void;
  removeFromCart: (productId: string, size?: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (val: boolean) => void;
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
    setIsCartOpen(true); // Open cart when adding an item
  };

  const removeFromCart = (productId: string, size?: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.size === size)));
  };

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
