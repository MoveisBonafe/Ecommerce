import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus, Minus, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useData } from '@/contexts/DataContext';
import type { Product, Color, PricingTable } from '@/types';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColorId, setSelectedColorId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();
  const { addItem } = useCart();
  const { colors, pricingTables } = useData();

  if (!product) return null;

  // Get available colors for this product
  const availableColors = colors.filter(color => 
    product.colors.includes(color.id)
  );

  // Set default selected color if not set
  if (!selectedColorId && availableColors.length > 0) {
    setSelectedColorId(availableColors[0].id);
  }

  const selectedColor = colors.find(color => color.id === selectedColorId);

  // Get pricing tables for current user
  const userPricingTables = pricingTables.filter(table => 
    table.userType === user?.type && table.isActive
  );

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const calculatePrice = (basePrice: number, multiplier: number) => {
    return basePrice * multiplier;
  };

  const handleAddToCart = () => {
    if (!selectedColor) return;

    addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0],
      colorId: selectedColor.id,
      colorName: selectedColor.name,
      unitPrice: product.basePrice,
      quantity: quantity,
    });

    onClose();
  };

  const handleWhatsAppOrder = () => {
    if (!selectedColor) return;

    const message = `Olá! Gostaria de fazer um pedido:

*Produto:* ${product.name}
*Cor:* ${selectedColor.name}
*Quantidade:* ${quantity}
*Preço unitário:* R$ ${product.basePrice.toFixed(2)}
*Total:* R$ ${(product.basePrice * quantity).toFixed(2)}

*Descrição:* ${product.description}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {product.name}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-80 object-cover rounded-lg"
              />
              
              {product.images.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80"
                    onClick={nextImage}
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
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                      currentImageIndex === index 
                        ? 'border-primary' 
                        : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Descrição</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Cor</h3>
                <div className="flex gap-2 mb-2">
                  {availableColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColorId(color.id)}
                      className={`w-10 h-10 rounded-full border-2 ${
                        selectedColorId === color.id
                          ? 'border-gray-900'
                          : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color.hexValue }}
                      title={color.name}
                    />
                  ))}
                </div>
                {selectedColor && (
                  <p className="text-sm text-gray-600">
                    Cor selecionada: {selectedColor.name}
                  </p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Quantidade</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-medium w-12 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Pricing Options */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Opções de Preço</h3>
              <div className="space-y-2">
                {userPricingTables.map((table, index) => (
                  <div
                    key={table.id}
                    className={`p-3 rounded-lg border ${
                      index === 0 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{table.name}</span>
                      <span className="text-lg font-bold text-green-600">
                        R$ {calculatePrice(product.basePrice, table.multiplier).toFixed(2)}
                      </span>
                    </div>
                    {index === 0 && (
                      <Badge variant="secondary" className="mt-1">
                        À Vista
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleAddToCart}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={!selectedColor}
              >
                Adicionar ao Carrinho
              </Button>
              
              <Button 
                variant="outline"
                onClick={handleWhatsAppOrder}
                className="w-full border-green-600 text-green-600 hover:bg-green-50"
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