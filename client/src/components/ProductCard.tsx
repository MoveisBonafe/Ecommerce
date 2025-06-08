import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import type { Product, PricingTable } from '@/types';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
}

export function ProductCard({ product, onOpenModal }: ProductCardProps) {
  const { user } = useAuth();
  const { categories, pricingTables } = useData();

  const category = categories.find(cat => cat.id === product.categoryId);
  const userPricingTables = pricingTables.filter(
    pt => pt.userType === user?.type && pt.isActive
  );

  const renderPricing = () => {
    if (user?.type === 'restaurante') {
      return (
        <div className="mt-3">
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-3 rounded-lg text-center">
            <p className="text-sm font-medium">Preço Especial Restaurante</p>
            <p className="text-2xl font-bold">R$ {product.basePrice.toFixed(2)}</p>
            <p className="text-xs opacity-90">Pagamento À Vista</p>
          </div>
        </div>
      );
    }

    if (user?.type === 'loja') {
      const aVistaTable = userPricingTables.find(pt => pt.name === 'À Vista');
      const otherTables = userPricingTables.filter(pt => pt.name !== 'À Vista').slice(0, 4);

      return (
        <div className="mt-3 space-y-2">
          {aVistaTable && (
            <div className="bg-green-50 p-2 rounded border border-green-200">
              <p className="text-sm font-medium text-green-800">À Vista</p>
              <p className="text-lg font-bold text-green-600">
                R$ {(product.basePrice * aVistaTable.multiplier).toFixed(2)}
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            {otherTables.slice(0, 2).map((table) => (
              <div key={table.id} className="bg-gray-50 p-2 rounded text-center">
                <p className="text-gray-600">{table.name}</p>
                <p className="font-semibold">
                  R$ {(product.basePrice * table.multiplier).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          
          {otherTables.length > 2 && (
            <div className="bg-gray-50 p-2 rounded text-center">
              <p className="text-xs text-gray-600">{otherTables[2].name}</p>
              <p className="font-semibold">
                R$ {(product.basePrice * otherTables[2].multiplier).toFixed(2)}
              </p>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {user?.type === 'restaurante' && (
          <Badge className="absolute top-4 left-4 bg-green-600 hover:bg-green-700">
            Preço Especial
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{category?.name || 'Categoria'}</p>
        
        {renderPricing()}
        
        <Button
          className="w-full mt-4"
          onClick={() => onOpenModal(product)}
        >
          Ver Detalhes
        </Button>
      </CardContent>
    </Card>
  );
}
