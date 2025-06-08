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
  
  // Product operations
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Category operations
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'productCount'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Color operations
  addColor: (color: Omit<Color, 'id' | 'createdAt'>) => Promise<void>;
  updateColor: (id: string, color: Partial<Color>) => Promise<void>;
  deleteColor: (id: string) => Promise<void>;
  
  // Pricing operations
  addPricingTable: (table: Omit<PricingTable, 'id' | 'createdAt'>) => Promise<void>;
  updatePricingTable: (id: string, table: Partial<PricingTable>) => Promise<void>;
  deletePricingTable: (id: string) => Promise<void>;
  
  // Promotion operations
  addPromotion: (promotion: Omit<Promotion, 'id' | 'createdAt'>) => Promise<void>;
  updatePromotion: (id: string, promotion: Partial<Promotion>) => Promise<void>;
  deletePromotion: (id: string) => Promise<void>;
  
  // Announcement operations
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => Promise<void>;
  updateAnnouncement: (id: string, announcement: Partial<Announcement>) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
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
