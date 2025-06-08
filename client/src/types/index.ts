export * from '@shared/schema';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id' | 'totalPrice'>) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

export interface DataContextType {
  products: Product[];
  categories: Category[];
  colors: Color[];
  pricingTables: PricingTable[];
  promotions: Promotion[];
  announcements: Announcement[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface ProductWithPricing extends Product {
  pricing: {
    [key: string]: number;
  };
}

export interface SelectedProduct {
  product: Product;
  selectedColor: Color;
  quantity: number;
}

import type { User, CartItem, Product, Category, Color, PricingTable, Promotion, Announcement } from '@shared/schema';
