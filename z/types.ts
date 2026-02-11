
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  bannerText: string;
  heroImage: string;
  fontFamily: 'serif' | 'sans';
}

export interface Order {
  id: string;
  items: { productId: string; name: string; quantity: number; price: number }[];
  total: number;
  customer: {
    name: string;
    phone: string;
    wilaya: string;
    commune: string;
    deliveryType: 'home' | 'desk';
  };
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface StoreState {
  products: Product[];
  categories: Category[];
  theme: ThemeConfig;
  orders: Order[];
}

export interface CartItem extends Product {
  quantity: number;
}
