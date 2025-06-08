import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { github, DATA_PATHS } from '@/lib/github';
import type { 
  Product, 
  Category, 
  Color, 
  PricingTable, 
  Promotion, 
  Announcement,
  DataContextType 
} from '@/types';

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [pricingTables, setPricingTables] = useState<PricingTable[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let productsData: Product[] = [];
      let categoriesData: Category[] = [];
      let colorsData: Color[] = [];
      let pricingTablesData: PricingTable[] = [];
      let promotionsData: Promotion[] = [];
      let announcementsData: Announcement[] = [];

      try {
        // Try GitHub first
        productsData = await github.readJsonFile<Product[]>(DATA_PATHS.products) || [];
        categoriesData = await github.readJsonFile<Category[]>(DATA_PATHS.categories) || [];
        colorsData = await github.readJsonFile<Color[]>(DATA_PATHS.colors) || [];
        pricingTablesData = await github.readJsonFile<PricingTable[]>(DATA_PATHS.pricingTables) || [];
        promotionsData = await github.readJsonFile<Promotion[]>(DATA_PATHS.promotions) || [];
        announcementsData = await github.readJsonFile<Announcement[]>(DATA_PATHS.announcements) || [];
      } catch (githubError) {
        console.warn('GitHub API not available, using localStorage fallback');
        // Fallback to localStorage
        productsData = JSON.parse(localStorage.getItem('furniture_store_products') || '[]');
        categoriesData = JSON.parse(localStorage.getItem('furniture_store_categories') || '[]');
        colorsData = JSON.parse(localStorage.getItem('furniture_store_colors') || '[]');
        pricingTablesData = JSON.parse(localStorage.getItem('furniture_store_pricing_tables') || '[]');
        promotionsData = JSON.parse(localStorage.getItem('furniture_store_promotions') || '[]');
        announcementsData = JSON.parse(localStorage.getItem('furniture_store_announcements') || '[]');
      }

      setProducts(productsData || []);
      setCategories(categoriesData || []);
      setColors(colorsData || []);
      setPricingTables(pricingTablesData || []);
      setPromotions(promotionsData || []);
      setAnnouncements(announcementsData || []);

      // Initialize default data if empty
      await initializeDefaultData(
        categoriesData,
        colorsData,
        pricingTablesData,
        productsData
      );

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Erro ao carregar dados. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  const initializeDefaultData = async (
    existingCategories: Category[] | null,
    existingColors: Color[] | null,
    existingPricingTables: PricingTable[] | null,
    existingProducts: Product[] | null
  ) => {
    try {
      // Initialize categories
      if (!existingCategories || existingCategories.length === 0) {
        const defaultCategories: Category[] = [
          {
            id: 'cat-1',
            name: 'Beliches',
            icon: 'fas fa-bed',
            productCount: 0,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'cat-2',
            name: 'Camas',
            icon: 'fas fa-bed',
            productCount: 0,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'cat-3',
            name: 'Banquetas',
            icon: 'fas fa-chair',
            productCount: 2,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'cat-4',
            name: 'Cadeiras',
            icon: 'fas fa-chair',
            productCount: 0,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'cat-5',
            name: 'Mesas',
            icon: 'fas fa-table',
            productCount: 0,
            createdAt: new Date().toISOString(),
          },
        ];

        try {
          await github.writeJsonFile(
            DATA_PATHS.categories,
            defaultCategories,
            'Initialize default categories'
          );
        } catch (githubError) {
          localStorage.setItem('furniture_store_categories', JSON.stringify(defaultCategories));
        }
        setCategories(defaultCategories);
      }

      // Initialize colors
      if (!existingColors || existingColors.length === 0) {
        const defaultColors: Color[] = [
          {
            id: 'color-1',
            name: 'Madeira Natural',
            hexValue: '#D2691E',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'color-2',
            name: 'Madeira Escura',
            hexValue: '#654321',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'color-3',
            name: 'Madeira Clara',
            hexValue: '#F4A460',
            createdAt: new Date().toISOString(),
          },
        ];

        try {
          await github.writeJsonFile(
            DATA_PATHS.colors,
            defaultColors,
            'Initialize default colors'
          );
        } catch (githubError) {
          localStorage.setItem('furniture_store_colors', JSON.stringify(defaultColors));
        }
        setColors(defaultColors);
      }

      // Initialize pricing tables
      if (!existingPricingTables || existingPricingTables.length === 0) {
        const defaultPricingTables: PricingTable[] = [
          {
            id: 'pricing-1',
            name: 'À Vista',
            description: 'Preço base',
            multiplier: 1.0,
            userType: 'loja',
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'pricing-2',
            name: '30 dias',
            description: 'Preço base + 2%',
            multiplier: 1.02,
            userType: 'loja',
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'pricing-3',
            name: '30/60',
            description: 'Preço base + 4%',
            multiplier: 1.04,
            userType: 'loja',
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'pricing-4',
            name: '30/60/90',
            description: 'Preço base + 6%',
            multiplier: 1.06,
            userType: 'loja',
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'pricing-5',
            name: '30/60/90/120',
            description: 'Preço base + 8%',
            multiplier: 1.08,
            userType: 'loja',
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'pricing-6',
            name: 'Especial Restaurante',
            description: 'Preço especial para restaurantes',
            multiplier: 1.0,
            userType: 'restaurante',
            isActive: true,
            createdAt: new Date().toISOString(),
          },
        ];

        try {
          await github.writeJsonFile(
            DATA_PATHS.pricingTables,
            defaultPricingTables,
            'Initialize default pricing tables'
          );
        } catch (githubError) {
          localStorage.setItem('furniture_store_pricing_tables', JSON.stringify(defaultPricingTables));
        }
        setPricingTables(defaultPricingTables);
      }

      // Initialize products
      if (!existingProducts || existingProducts.length === 0) {
        const defaultProducts: Product[] = [
          {
            id: 'product-1',
            name: 'Banqueta 50 cm',
            description: 'Banqueta em madeira maciça com design moderno e resistente. Ideal para restaurantes, bares e estabelecimentos comerciais.',
            basePrice: 47.00,
            categoryId: 'cat-3',
            images: [
              'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
              'https://images.unsplash.com/photo-1581539250439-c96689b516dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
              'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
            ],
            colors: ['color-1', 'color-2', 'color-3'],
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'product-2',
            name: 'Banqueta 70 cm',
            description: 'Banqueta alta em madeira maciça, perfeita para balcões e bancadas altas.',
            basePrice: 56.00,
            categoryId: 'cat-3',
            images: [
              'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
              'https://images.unsplash.com/photo-1581539250439-c96689b516dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
            ],
            colors: ['color-1', 'color-2'],
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];

        try {
          await github.writeJsonFile(
            DATA_PATHS.products,
            defaultProducts,
            'Initialize default products'
          );
        } catch (githubError) {
          localStorage.setItem('furniture_store_products', JSON.stringify(defaultProducts));
        }
        setProducts(defaultProducts);
      }

    } catch (error) {
      console.error('Error initializing default data:', error);
    }
  };

  // Product CRUD operations
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: `product-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);

    try {
      await github.writeJsonFile(DATA_PATHS.products, updatedProducts, 'Add new product');
    } catch (error) {
      localStorage.setItem('furniture_store_products', JSON.stringify(updatedProducts));
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    const updatedProducts = products.map(product =>
      product.id === id
        ? { ...product, ...productData, updatedAt: new Date().toISOString() }
        : product
    );
    setProducts(updatedProducts);

    try {
      await github.writeJsonFile(DATA_PATHS.products, updatedProducts, `Update product ${id}`);
    } catch (error) {
      localStorage.setItem('furniture_store_products', JSON.stringify(updatedProducts));
    }
  };

  const deleteProduct = async (id: string) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);

    try {
      await github.writeJsonFile(DATA_PATHS.products, updatedProducts, `Delete product ${id}`);
    } catch (error) {
      localStorage.setItem('furniture_store_products', JSON.stringify(updatedProducts));
    }
  };

  // Category CRUD operations
  const addCategory = async (categoryData: Omit<Category, 'id' | 'createdAt' | 'productCount'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`,
      productCount: 0,
      createdAt: new Date().toISOString(),
    };

    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);

    try {
      await github.writeJsonFile(DATA_PATHS.categories, updatedCategories, 'Add new category');
    } catch (error) {
      localStorage.setItem('furniture_store_categories', JSON.stringify(updatedCategories));
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    const updatedCategories = categories.map(category =>
      category.id === id ? { ...category, ...categoryData } : category
    );
    setCategories(updatedCategories);

    try {
      await github.writeJsonFile(DATA_PATHS.categories, updatedCategories, `Update category ${id}`);
    } catch (error) {
      localStorage.setItem('furniture_store_categories', JSON.stringify(updatedCategories));
    }
  };

  const deleteCategory = async (id: string) => {
    const updatedCategories = categories.filter(category => category.id !== id);
    setCategories(updatedCategories);

    try {
      await github.writeJsonFile(DATA_PATHS.categories, updatedCategories, `Delete category ${id}`);
    } catch (error) {
      localStorage.setItem('furniture_store_categories', JSON.stringify(updatedCategories));
    }
  };

  // Color CRUD operations
  const addColor = async (colorData: Omit<Color, 'id' | 'createdAt'>) => {
    const newColor: Color = {
      ...colorData,
      id: `color-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const updatedColors = [...colors, newColor];
    setColors(updatedColors);

    try {
      await github.writeJsonFile(DATA_PATHS.colors, updatedColors, 'Add new color');
    } catch (error) {
      localStorage.setItem('furniture_store_colors', JSON.stringify(updatedColors));
    }
  };

  const updateColor = async (id: string, colorData: Partial<Color>) => {
    const updatedColors = colors.map(color =>
      color.id === id ? { ...color, ...colorData } : color
    );
    setColors(updatedColors);

    try {
      await github.writeJsonFile(DATA_PATHS.colors, updatedColors, `Update color ${id}`);
    } catch (error) {
      localStorage.setItem('furniture_store_colors', JSON.stringify(updatedColors));
    }
  };

  const deleteColor = async (id: string) => {
    const updatedColors = colors.filter(color => color.id !== id);
    setColors(updatedColors);

    try {
      await github.writeJsonFile(DATA_PATHS.colors, updatedColors, `Delete color ${id}`);
    } catch (error) {
      localStorage.setItem('furniture_store_colors', JSON.stringify(updatedColors));
    }
  };

  // Pricing Table CRUD operations
  const addPricingTable = async (tableData: Omit<PricingTable, 'id' | 'createdAt'>) => {
    const newTable: PricingTable = {
      ...tableData,
      id: `pricing-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const updatedTables = [...pricingTables, newTable];
    setPricingTables(updatedTables);

    try {
      await github.writeJsonFile(DATA_PATHS.pricingTables, updatedTables, 'Add new pricing table');
    } catch (error) {
      localStorage.setItem('furniture_store_pricing_tables', JSON.stringify(updatedTables));
    }
  };

  const updatePricingTable = async (id: string, tableData: Partial<PricingTable>) => {
    const updatedTables = pricingTables.map(table =>
      table.id === id ? { ...table, ...tableData } : table
    );
    setPricingTables(updatedTables);

    try {
      await github.writeJsonFile(DATA_PATHS.pricingTables, updatedTables, `Update pricing table ${id}`);
    } catch (error) {
      localStorage.setItem('furniture_store_pricing_tables', JSON.stringify(updatedTables));
    }
  };

  const deletePricingTable = async (id: string) => {
    const updatedTables = pricingTables.filter(table => table.id !== id);
    setPricingTables(updatedTables);

    try {
      await github.writeJsonFile(DATA_PATHS.pricingTables, updatedTables, `Delete pricing table ${id}`);
    } catch (error) {
      localStorage.setItem('furniture_store_pricing_tables', JSON.stringify(updatedTables));
    }
  };

  // Promotion CRUD operations
  const addPromotion = async (promotionData: Omit<Promotion, 'id' | 'createdAt'>) => {
    const newPromotion: Promotion = {
      ...promotionData,
      id: `promo-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const updatedPromotions = [...promotions, newPromotion];
    setPromotions(updatedPromotions);

    try {
      await github.writeJsonFile(DATA_PATHS.promotions, updatedPromotions, 'Add new promotion');
    } catch (error) {
      localStorage.setItem('furniture_store_promotions', JSON.stringify(updatedPromotions));
    }
  };

  const updatePromotion = async (id: string, promotionData: Partial<Promotion>) => {
    const updatedPromotions = promotions.map(promotion =>
      promotion.id === id ? { ...promotion, ...promotionData } : promotion
    );
    setPromotions(updatedPromotions);

    try {
      await github.writeJsonFile(DATA_PATHS.promotions, updatedPromotions, `Update promotion ${id}`);
    } catch (error) {
      localStorage.setItem('furniture_store_promotions', JSON.stringify(updatedPromotions));
    }
  };

  const deletePromotion = async (id: string) => {
    const updatedPromotions = promotions.filter(promotion => promotion.id !== id);
    setPromotions(updatedPromotions);

    try {
      await github.writeJsonFile(DATA_PATHS.promotions, updatedPromotions, `Delete promotion ${id}`);
    } catch (error) {
      localStorage.setItem('furniture_store_promotions', JSON.stringify(updatedPromotions));
    }
  };

  // Announcement CRUD operations
  const addAnnouncement = async (announcementData: Omit<Announcement, 'id' | 'createdAt'>) => {
    const newAnnouncement: Announcement = {
      ...announcementData,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const updatedAnnouncements = [...announcements, newAnnouncement];
    setAnnouncements(updatedAnnouncements);

    try {
      await github.writeJsonFile(DATA_PATHS.announcements, updatedAnnouncements, 'Add new announcement');
    } catch (error) {
      localStorage.setItem('furniture_store_announcements', JSON.stringify(updatedAnnouncements));
    }
  };

  const updateAnnouncement = async (id: string, announcementData: Partial<Announcement>) => {
    const updatedAnnouncements = announcements.map(announcement =>
      announcement.id === id ? { ...announcement, ...announcementData } : announcement
    );
    setAnnouncements(updatedAnnouncements);

    try {
      await github.writeJsonFile(DATA_PATHS.announcements, updatedAnnouncements, `Update announcement ${id}`);
    } catch (error) {
      localStorage.setItem('furniture_store_announcements', JSON.stringify(updatedAnnouncements));
    }
  };

  const deleteAnnouncement = async (id: string) => {
    const updatedAnnouncements = announcements.filter(announcement => announcement.id !== id);
    setAnnouncements(updatedAnnouncements);

    try {
      await github.writeJsonFile(DATA_PATHS.announcements, updatedAnnouncements, `Delete announcement ${id}`);
    } catch (error) {
      localStorage.setItem('furniture_store_announcements', JSON.stringify(updatedAnnouncements));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const value: DataContextType = {
    products,
    categories,
    colors,
    pricingTables,
    promotions,
    announcements,
    isLoading,
    error,
    refetch: fetchData,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    addColor,
    updateColor,
    deleteColor,
    addPricingTable,
    updatePricingTable,
    deletePricingTable,
    addPromotion,
    updatePromotion,
    deletePromotion,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}
