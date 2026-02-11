
export interface Category {
  id: string;
  name: string;
  description: string;
  image?: string;
}

export type VariantDisplayType = 'color' | 'radio' | 'select';

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  color?: string;
  image?: string;
  type: 'color' | 'standard';
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Quote {
  id: string;
  text: string;
  sender: string;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images: string[];
  categoryId: string;
  variants: ProductVariant[];
  variantDisplayType: VariantDisplayType;
  rating: number;
  reviewCount: number;
  reviews: Review[];
}

export interface CartItem extends Product {
  selectedVariant?: ProductVariant;
  quantity: number;
}

export type DesignStyle = 'style1' | 'style2' | 'style3' | 'style4' | 'style5' | 'style6';
export type AnimationType = 'none' | 'fade' | 'slide' | 'zoom' | 'bounce';
export type Roundness = 'none' | 'sm' | 'md' | 'lg' | 'full';
export type Alignment = 'left' | 'center' | 'right';
export type Language = 'fr' | 'ar';

export interface SectionConfig {
  style: DesignStyle;
  bgColor: string;
  textColor: string;
  title: string;
  subtitle: string;
  animation: AnimationType;
  isVisible: boolean;
  alignment: Alignment;
  bgImageUrl?: string;
}

export type SectionType = 'hero' | 'categories' | 'featured' | 'quotes' | 'banner' | 'features';

export interface StoreTheme {
  storeName: string;
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  cardBgColor: string;
  cardTextColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
  cardRoundness: Roundness;
  buttonRoundness: Roundness;
  language: Language;
  
  sectionOrder: SectionType[];
  
  hero: SectionConfig & { buttonText: string; buttonLink: string; };
  categories: SectionConfig;
  featured: SectionConfig;
  features: SectionConfig & {
    f1Title: string; f1Desc: string;
    f2Title: string; f2Desc: string;
    f3Title: string; f3Desc: string;
  };
  quotes: SectionConfig & { items: Quote[] };
  banner: SectionConfig;
  footer: SectionConfig & {
    description: string;
    showLogoCenter: boolean;
  };

  headerBgColor: string;
  headerTextColor: string;
  headerType: 'classic' | 'minimal' | 'centered';
  showRatings: boolean;
  
  socialFacebook?: string;
  socialInstagram?: string;
  socialTikTok?: string;
  socialWhatsApp?: string;
}

export interface WilayaDeliveryPrice {
  wilaya: string;
  domicile: number;
  bureau: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  wilaya: string;
  commune: string;
  address?: string;
  deliveryType: 'domicile' | 'bureau';
  deliveryFee: number;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

export interface SaleRecord {
  id: string;
  date: string;
  amount: number;
  items: number;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}
