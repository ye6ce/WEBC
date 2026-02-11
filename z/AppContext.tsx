
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StoreState, Product, CartItem, Order } from './types';
import { INITIAL_STATE } from './constants';
import { fetchStoreData, saveStoreData } from './services/api';

interface AppContextType {
  state: StoreState;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateTheme: (newTheme: Partial<StoreState['theme']>) => void;
  upsertProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  placeOrder: (order: Order) => Promise<boolean>;
  syncData: () => Promise<void>;
  isLoading: boolean;
  isAdmin: boolean;
  setAdmin: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<StoreState>(INITIAL_STATE);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const syncData = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchStoreData();
    setState(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    syncData();
  }, [syncData]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const updateTheme = (newTheme: Partial<StoreState['theme']>) => {
    setState(prev => ({ ...prev, theme: { ...prev.theme, ...newTheme } }));
  };

  const upsertProduct = (product: Product) => {
    setState(prev => {
      const exists = prev.products.find(p => p.id === product.id);
      const newProducts = exists 
        ? prev.products.map(p => p.id === product.id ? product : p)
        : [...prev.products, product];
      return { ...prev, products: newProducts };
    });
  };

  const deleteProduct = (productId: string) => {
    setState(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== productId)
    }));
  };

  const placeOrder = async (order: Order) => {
    const newState = { ...state, orders: [order, ...state.orders] };
    const success = await saveStoreData(newState);
    if (success) setState(newState);
    return success;
  };

  const handleManualSync = async () => {
    setIsLoading(true);
    await saveStoreData(state);
    setIsLoading(false);
  };

  return (
    <AppContext.Provider value={{
      state,
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      updateTheme,
      upsertProduct,
      deleteProduct,
      placeOrder,
      syncData: handleManualSync,
      isLoading,
      isAdmin,
      setAdmin: setIsAdmin
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
