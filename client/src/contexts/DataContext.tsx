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
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}
