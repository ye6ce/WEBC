
import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { Product, StoreTheme, CartItem, SaleRecord, Category, Order, WilayaDeliveryPrice, Notification, SectionConfig, Language } from './types';
import { INITIAL_DELIVERY_PRICES } from './constants';

// --- CONFIGURE YOUR ADMIN CREDENTIALS HERE ---
const ADMIN_CONFIG = {
  username: 'admin',
  password: 'password123'
};

interface AppContextType {
  products: Product[];
  categories: Category[];
  theme: StoreTheme;
  cart: CartItem[];
  sales: SaleRecord[];
  orders: Order[];
  deliveryPrices: WilayaDeliveryPrice[];
  notifications: Notification[];
  language: Language;
  isAdminAuthenticated: boolean;
  t: (key: string) => string;
  toggleLanguage: () => void;
  loginAdmin: (user: string, pass: string) => boolean;
  logoutAdmin: () => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  updateTheme: (theme: Partial<StoreTheme>) => void;
  addToCart: (product: Product, variantId?: string) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  submitOrder: (order: Omit<Order, 'id' | 'status' | 'date'>) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  updateDeliveryPrices: (prices: WilayaDeliveryPrice[]) => void;
  notify: (message: string, type?: Notification['type']) => void;
  removeNotification: (id: string) => void;
}

const translations: Record<Language, Record<string, string>> = {
  fr: {
    home: 'Accueil', shop: 'Boutique', cart: 'Panier', dashboard: 'Marchand', login: 'Connexion', contact: 'Contact', total: 'Total Final', confirm_order: 'Commander Maintenant', order_success: 'Commande Confirmée', add_to_cart: 'Ajouter au Panier', price: 'Prix', shipping: 'Livraison', domicile: 'Domicile', bureau: 'Bureau', variants: 'Options disponibles', colors: 'Couleurs', search: 'Rechercher', categories: 'Collections', all: 'Tout', no_results: 'Aucun résultat', back: 'Retour'
  },
  ar: {
    home: 'الرئيسية', shop: 'المتجر', cart: 'السلة', dashboard: 'لوحة التحكم', login: 'تسجيل الدخول', contact: 'اتصل بنا', total: 'المجموع النهائي', confirm_order: 'اطلب الآن', order_success: 'تم تأكيد الطلب', add_to_cart: 'أضف إلى السلة', price: 'السعر', shipping: 'التوصيل', domicile: 'للمنزل', bureau: 'للمكتب', variants: 'الخيارات المتاحة', colors: 'الألوان', search: 'بحث', categories: 'التصنيفات', all: 'الكل', no_results: 'لا توجد نتائج', back: 'رجوع'
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Persistence Helpers
const saveToLocal = (key: string, data: any) => localStorage.setItem(`lumina_${key}`, JSON.stringify(data));
const loadFromLocal = <T,>(key: string, fallback: T): T => {
  const data = localStorage.getItem(`lumina_${key}`);
  if (!data) return fallback;
  try { return JSON.parse(data) as T; } catch { return fallback; }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const defaultSection: SectionConfig = {
  style: 'style1', bgColor: '#ffffff', textColor: '#0f172a', title: 'Titre de Section', subtitle: 'Description courte.', animation: 'fade', isVisible: true, alignment: 'center'
};

const DEFAULT_THEME: StoreTheme = {
  storeName: 'Lumina Boutique',
  logoUrl: 'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?auto=format&fit=crop&q=80&w=200',
  primaryColor: '#6366f1',
  accentColor: '#fbbf24',
  backgroundColor: '#ffffff',
  textColor: '#1e293b',
  cardBgColor: '#ffffff',
  cardTextColor: '#0f172a',
  buttonBgColor: '#6366f1',
  buttonTextColor: '#ffffff',
  cardRoundness: 'lg',
  buttonRoundness: 'full',
  language: 'fr',
  headerBgColor: '#ffffff',
  headerTextColor: '#0f172a',
  headerType: 'classic',
  showRatings: true,
  sectionOrder: ['hero', 'categories', 'featured', 'quotes', 'banner', 'features'],
  hero: { ...defaultSection, bgColor: '#0f172a', textColor: '#ffffff', title: 'Nouvelle Collection', subtitle: 'L\'excellence à votre portée.', buttonText: 'Acheter', buttonLink: 'shop', bgImageUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2070' },
  categories: { ...defaultSection, title: 'Nos Collections', subtitle: 'Explorez nos univers.' },
  featured: { ...defaultSection, title: 'Meilleures Ventes', subtitle: 'Les produits que vous adorez.' },
  features: { ...defaultSection, bgColor: '#f8fafc', title: 'Pourquoi nous ?', subtitle: 'Service premium.', f1Title: 'Livraison 58 Wilayas', f1Desc: 'Rapide et fiable.', f2Title: 'Qualité Garantie', f2Desc: 'Produits testés.', f3Title: 'Support 24/7', f3Desc: 'À votre service.' },
  quotes: { ...defaultSection, bgColor: '#f3f4f6', title: 'Témoignages', subtitle: 'Vos retours.', items: [{ id: '1', text: "Service incroyable, je recommande !", sender: "Amine K." }] },
  banner: { ...defaultSection, isVisible: false, title: 'Offre Spéciale', subtitle: 'Profitez de -30% ce weekend.' },
  footer: { ...defaultSection, bgColor: '#0f172a', textColor: '#ffffff', title: 'Lumina', description: 'Votre boutique premium.', showLogoCenter: true },
  socialFacebook: '', socialInstagram: '', socialTikTok: '', socialWhatsApp: ''
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from LocalStorage
  const [categories, setCategories] = useState<Category[]>(() => loadFromLocal('categories', []));
  const [products, setProducts] = useState<Product[]>(() => loadFromLocal('products', []));
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(() => loadFromLocal('orders', []));
  const [sales, setSales] = useState<SaleRecord[]>(() => loadFromLocal('sales', []));
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => loadFromLocal('isAdmin', false));
  const [theme, setTheme] = useState<StoreTheme>(() => loadFromLocal('theme', DEFAULT_THEME));
  const [deliveryPrices, setDeliveryPrices] = useState<WilayaDeliveryPrice[]>(() => loadFromLocal('deliveryPrices', INITIAL_DELIVERY_PRICES));

  // Persistence Sync
  useEffect(() => saveToLocal('categories', categories), [categories]);
  useEffect(() => saveToLocal('products', products), [products]);
  useEffect(() => saveToLocal('orders', orders), [orders]);
  useEffect(() => saveToLocal('sales', sales), [sales]);
  useEffect(() => saveToLocal('isAdmin', isAdminAuthenticated), [isAdminAuthenticated]);
  useEffect(() => saveToLocal('theme', theme), [theme]);
  useEffect(() => saveToLocal('deliveryPrices', deliveryPrices), [deliveryPrices]);

  const t = useCallback((key: string) => translations[theme.language][key] || key, [theme.language]);
  const toggleLanguage = () => setTheme(prev => ({ ...prev, language: prev.language === 'fr' ? 'ar' : 'fr' }));

  const notify = useCallback((message: string, type: Notification['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeNotification(id), 4000);
  }, []);

  const removeNotification = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));

  const loginAdmin = useCallback((user: string, pass: string) => {
    if (user === ADMIN_CONFIG.username && pass === ADMIN_CONFIG.password) {
      setIsAdminAuthenticated(true);
      notify("Bienvenue, Administrateur.");
      return true;
    } else {
      notify("Identifiants incorrects.", "error");
      return false;
    }
  }, [notify]);

  const logoutAdmin = useCallback(() => {
    setIsAdminAuthenticated(false);
    notify("Déconnecté.", "info");
  }, [notify]);

  const addProduct = (p: Product) => { setProducts(prev => [...prev, p]); notify(`Produit ajouté.`); };
  const updateProduct = (up: Product) => { setProducts(prev => prev.map(p => p.id === up.id ? up : p)); notify("Produit mis à jour."); };
  const deleteProduct = (id: string) => { setProducts(prev => prev.filter(p => p.id !== id)); notify("Produit supprimé.", "info"); };
  const addCategory = (c: Category) => { setCategories(prev => [...prev, c]); notify(`Catégorie créée.`); };
  const updateCategory = (up: Category) => { setCategories(prev => prev.map(c => c.id === up.id ? up : c)); notify("Catégorie mise à jour."); };
  const deleteCategory = (id: string) => { setCategories(prev => prev.filter(c => c.id !== id)); notify("Catégorie supprimée.", "info"); };
  const updateTheme = (newT: Partial<StoreTheme>) => { setTheme(prev => ({ ...prev, ...newT })); notify("Design mis à jour."); };
  
  const addToCart = (product: Product, variantId?: string) => {
    const selectedVariant = product.variants.find(v => v.id === variantId);
    setCart(prev => {
      const idx = prev.findIndex(i => i.id === product.id && i.selectedVariant?.id === variantId);
      if (idx > -1) {
        const nc = [...prev]; nc[idx].quantity += 1; return nc;
      }
      return [...prev, { ...product, selectedVariant, quantity: 1 }];
    });
    notify("Ajouté au panier.");
  };

  const removeFromCart = (index: number) => { setCart(prev => prev.filter((_, i) => i !== index)); notify("Article retiré."); };
  const clearCart = () => setCart([]);
  
  const submitOrder = async (orderData: Omit<Order, 'id' | 'status' | 'date'>) => {
    const newOrder: Order = { ...orderData, id: Math.random().toString(36).substr(2, 6).toUpperCase(), status: 'pending', date: new Date().toISOString() };
    setOrders(prev => [newOrder, ...prev]);
    const newSale: SaleRecord = { id: newOrder.id, date: newOrder.date.split('T')[0], amount: newOrder.total, items: orderData.items.reduce((acc, i) => acc + i.quantity, 0) };
    setSales(prev => [newSale, ...prev]);
    notify("Commande validée !");
  };

  const updateOrderStatus = (id: string, status: Order['status']) => { setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o)); notify("Statut mis à jour."); };
  const updateDeliveryPrices = (prices: WilayaDeliveryPrice[]) => { setDeliveryPrices(prices); notify("Frais de livraison mis à jour."); };

  return (
    <AppContext.Provider value={{
      products, categories, theme, cart, sales, orders, deliveryPrices, notifications, language: theme.language, isAdminAuthenticated,
      t, toggleLanguage, loginAdmin, logoutAdmin,
      addProduct, updateProduct, deleteProduct, addCategory, updateCategory, deleteCategory,
      updateTheme, addToCart, removeFromCart, clearCart, submitOrder, updateOrderStatus, updateDeliveryPrices, notify, removeNotification
    }}>
      <div dir={theme.language === 'ar' ? 'rtl' : 'ltr'} className={theme.language === 'ar' ? 'font-arabic' : ''}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
