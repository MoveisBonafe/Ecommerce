import { useState } from 'react';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { CategoryCard } from '@/components/CategoryCard';
import { CartSidebar } from '@/components/CartSidebar';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Megaphone } from 'lucide-react';
import type { Product } from '@/types';

export function StoreDashboard() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { user } = useAuth();
  const { products, categories, promotions, announcements, isLoading, error } = useData();

  if (!user) return null;

  const activePromotions = promotions.filter(
    promo => promo.isActive && promo.userTypes.includes(user.type)
  );

  const activeAnnouncements = announcements.filter(
    announcement => announcement.isActive && announcement.userTypes.includes(user.type)
  );

  const filteredProducts = products.filter(product => {
    if (!product.isActive) return false;
    
    const matchesCategory = !selectedCategoryId || product.categoryId === selectedCategoryId;
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const handleOpenProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onToggleCart={() => setIsCartOpen(!isCartOpen)} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando produtos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onToggleCart={() => setIsCartOpen(!isCartOpen)} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onToggleCart={() => setIsCartOpen(!isCartOpen)} />

      {/* Promotions/Announcements Banner */}
      {(activePromotions.length > 0 || activeAnnouncements.length > 0) && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center text-center">
              <Megaphone className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-sm font-medium">
                {activePromotions[0]?.title || activeAnnouncements[0]?.title}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Categorias</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                isSelected={selectedCategoryId === category.id}
                onClick={(categoryId) => 
                  setSelectedCategoryId(selectedCategoryId === categoryId ? null : categoryId)
                }
              />
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Produtos Disponíveis</h2>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {selectedCategoryId && (
            <div className="mt-4">
              <Badge 
                variant="secondary" 
                className="cursor-pointer"
                onClick={() => setSelectedCategoryId(null)}
              >
                {categories.find(cat => cat.id === selectedCategoryId)?.name} ✕
              </Badge>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenModal={handleOpenProductModal}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum produto encontrado.</p>
            {(selectedCategoryId || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedCategoryId(null);
                  setSearchTerm('');
                }}
                className="text-primary hover:underline mt-2"
              >
                Limpar filtros
              </button>
            )}
          </div>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={handleCloseProductModal}
      />

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
}
