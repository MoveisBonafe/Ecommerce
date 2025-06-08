import { z } from "zod";

// User types
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
  type: z.enum(['admin', 'loja', 'restaurante']),
  createdAt: z.string(),
});

export type User = z.infer<typeof userSchema>;

export const insertUserSchema = userSchema.omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;

// Category schema
export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  productCount: z.number().default(0),
  createdAt: z.string(),
});

export type Category = z.infer<typeof categorySchema>;

export const insertCategorySchema = categorySchema.omit({ id: true, createdAt: true, productCount: true });
export type InsertCategory = z.infer<typeof insertCategorySchema>;

// Color schema
export const colorSchema = z.object({
  id: z.string(),
  name: z.string(),
  hexValue: z.string(),
  createdAt: z.string(),
});

export type Color = z.infer<typeof colorSchema>;

export const insertColorSchema = colorSchema.omit({ id: true, createdAt: true });
export type InsertColor = z.infer<typeof insertColorSchema>;

// Pricing table schema
export const pricingTableSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  multiplier: z.number(),
  userType: z.enum(['loja', 'restaurante']),
  isActive: z.boolean().default(true),
  createdAt: z.string(),
});

export type PricingTable = z.infer<typeof pricingTableSchema>;

export const insertPricingTableSchema = pricingTableSchema.omit({ id: true, createdAt: true });
export type InsertPricingTable = z.infer<typeof insertPricingTableSchema>;

// Product schema
export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  basePrice: z.number(),
  categoryId: z.string(),
  images: z.array(z.string()),
  colors: z.array(z.string()),
  isActive: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Product = z.infer<typeof productSchema>;

export const insertProductSchema = productSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;

// Promotion schema
export const promotionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  discountPercentage: z.number().optional(),
  categoryIds: z.array(z.string()),
  userTypes: z.array(z.enum(['loja', 'restaurante'])),
  startDate: z.string(),
  endDate: z.string(),
  isActive: z.boolean().default(true),
  createdAt: z.string(),
});

export type Promotion = z.infer<typeof promotionSchema>;

export const insertPromotionSchema = promotionSchema.omit({ id: true, createdAt: true });
export type InsertPromotion = z.infer<typeof insertPromotionSchema>;

// Announcement schema
export const announcementSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  userTypes: z.array(z.enum(['admin', 'loja', 'restaurante'])),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  isActive: z.boolean().default(true),
  createdAt: z.string(),
});

export type Announcement = z.infer<typeof announcementSchema>;

export const insertAnnouncementSchema = announcementSchema.omit({ id: true, createdAt: true });
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;

// Cart item schema
export const cartItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  productName: z.string(),
  productImage: z.string(),
  colorId: z.string(),
  colorName: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  totalPrice: z.number(),
});

export type CartItem = z.infer<typeof cartItemSchema>;

// Order schema
export const orderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  items: z.array(cartItemSchema),
  total: z.number(),
  status: z.enum(['pending', 'sent', 'confirmed']).default('pending'),
  whatsappSent: z.boolean().default(false),
  createdAt: z.string(),
});

export type Order = z.infer<typeof orderSchema>;

export const insertOrderSchema = orderSchema.omit({ id: true, createdAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
