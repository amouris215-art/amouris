export interface Category {
  id: string;
  name_fr: string;
  name_ar: string;
  slug: string;
  image?: string;
}

export interface Brand {
  id: string;
  name_fr: string;
  name_ar: string;
  logo: string;
}

export interface Collection {
  id: string;
  name_fr: string;
  name_ar: string;
  cover_image?: string;
}

export interface Tag {
  id: string;
  name_fr: string;
  name_ar: string;
  slug: string;
  show_on_homepage?: boolean;
  homepage_order?: number;
}

export type ProductType = 'perfume' | 'flacon';

export interface BaseProduct {
  id: string;
  product_type: ProductType;
  name_fr: string;
  name_ar: string;
  slug: string;
  description_fr: string;
  description_ar: string;
  category_id: string;
  brand_id?: string | null;
  collection_id?: string | null;
  tag_ids: string[];
  images: string[];
  status: 'active' | 'draft';
  created_at: string;
}

export interface PerfumeProduct extends BaseProduct {
  product_type: 'perfume';
  price_per_gram: number; // DZD
  stock_grams: number;
}

export interface FlaconVariant {
  id: string;
  size: string; // e.g., '30ml', '50ml', '100ml'
  color: string; // Hex color code or name
  shape: string; // e.g., 'carré', 'rond', 'atomiseur'
  price: number; // DZD
  stock: number;
}

export interface FlaconProduct extends BaseProduct {
  product_type: 'flacon';
  variants: FlaconVariant[];
}

export type Product = PerfumeProduct | FlaconProduct;

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  shop_name?: string;
  phone: string; 
  wilaya: string;
  commune: string;
  status: 'active' | 'frozen';
  joined_at: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid';

export interface OrderItem {
  product_id: string;
  variant_id?: string; // For flacons
  quantity: number; // Grams for perfume, units for flacons
  unit_price: number;
  name_fr: string;
  name_ar: string;
}

export interface Order {
  id: string;
  order_number: string; // e.g., AM-100234
  customer_id: string | 'guest'; // 'guest' for guests
  guest_info?: {
    first_name: string;
    last_name: string;
    phone: string;
    wilaya: string;
  };
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  amount_paid: number;
  created_at: string;
  updated_at: string;
  notes?: string;
  invoice_url?: string;
}

export interface Invoice {
  id: string;
  invoice_number: string; // e.g., FAC-00123
  order_id: string;
  issue_date: string;
}
