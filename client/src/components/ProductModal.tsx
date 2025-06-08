import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useData } from '@/contexts/DataContext';
import { WhatsAppService } from '@/lib/whatsapp';
import { Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product, Color } from '@/types';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColorId, setSelectedColorId] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { user } = useAuth();
  const { addItem } = useCart();
  const { colors, pricingTables } = useData();

  if (!product || !user) return null;

  const availableColors = colors.filter(color => 
    product.colors.includes(color.id)
  );

  const selectedColor = colors.find(color => color.id === selectedColorId) || availableColors[0];

  const userPricingTables = pricingTables.filter(
    pt => pt.userType === user.type && pt.isActive
  );

  // Set default selected color when product changes
  if (selectedColorId === '' && availableColors.length > 0) {
    setSelectedColorId(availableColors[0].id);
  }

  const handleImageChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentImageIndex(prev => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex(prev => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleAddToCart = () => {
    if (!selectedColor) return;

    const price = user.type === 'restaurante' 
      ? product.basePrice 
      : product.basePrice * (userPricingTables[0]?.multiplier || 1);

    addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0],
      colorId: selectedColor.id,
      colorName: selectedColor.name,
      quantity,
      unitPrice: price,
    });

    onClose();
  };

  const handleWhatsAppOrder = () => {
    if (!selectedColor) return;

    const price = user.type === 'restaurante' 
      ? product.basePrice 
      : product.basePrice * (userPricingTables[0]?.multiplier || 1);

    WhatsAppService.sendSingleItemOrder(
      product.name,
      selectedColor.name,
      quantity,
      price,
      user
    );

    onClose();
  };

  const renderPricing = () => {
    if (user.type === 'restaurante') {
      return (
        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-900 mb-3">Preço Especial</h3>
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-lg text-center">
            <p className="text-sm font-medium">Preço Especial Restaurante</p>
            <p className="text-2xl font-bold">R$ {product.basePrice.toFixed(2)}</p>
            <p className="text-xs opacity-90">Pagamento À Vista</p>
          </div>
        </div>
      );
    }

    if (user.type === 'loja') {
      return (
        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-900 mb-3">Opções de Preço</h3>
          <div className="space-y-2">
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-green-800">À Vista</span>
                <span className="text-lg font-bold text-green-600">
                  R$ {product.basePrice.toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {userPricingTables.slice(1, 3).map((table) => (
                <div key={table.id} className="bg-gray-50 p-2 rounded text-center">
                  <p className="text-xs text-gray-600">{table.name}</p>
                  <p className="font-semibold">
                    R$ {(product.basePrice * table.multiplier).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            
            {userPricingTables.length > 3 && (
              <div className="bg-gray-50 p-2 rounded text-center">
                <p className="text-xs text-gray-600">{userPricingTables[3].name}</p>
                <p className="font-semibold">
                  R$ {(product.basePrice * userPricingTables[3].multiplier).toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="relative mb-4">
              <img
                src={product.images[currentImageIndex]}
                alt={`${product.name} - Vista ${currentImageIndex + 1}`}
                className="w-full h-64 object-cover rounded-lg"
              />
              {product.images.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={() => handleImageChange('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={() => handleImageChange('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} - Miniatura ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                      index === currentImageIndex ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Descrição</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Cor</h3>
                <div className="flex gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColorId(color.id)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColorId === color.id ? 'border-primary' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color.hexValue }}
                      title={color.name}
                    />
                  ))}
                </div>
                {selectedColor && (
                  <p className="text-sm text-gray-500 mt-2">
                    Cor selecionada: {selectedColor.name}
                  </p>
                )}
              </div>
            )}

            {/* Quantity Selection */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Quantidade</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-semibold min-w-8 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Pricing */}
            {renderPricing()}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleAddToCart}
                disabled={!selectedColor}
              >
                Adicionar ao Carrinho
              </Button>
              <Button
                variant="outline"
                className="w-full border-green-600 text-green-600 hover:bg-green-50"
                onClick={handleWhatsAppOrder}
                disabled={!selectedColor}
              >
                Comprar via WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
