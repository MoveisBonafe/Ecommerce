import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { Plus, Edit, ToggleLeft, ToggleRight } from 'lucide-react';

export function PricingTab() {
  const { pricingTables } = useData();

  const lojaTables = pricingTables.filter(table => table.userType === 'loja');
  const restauranteTables = pricingTables.filter(table => table.userType === 'restaurante');

  const formatMultiplier = (multiplier: number) => {
    const percentage = (multiplier - 1) * 100;
    return percentage === 0 ? 'Preço base' : `+${percentage.toFixed(0)}%`;
  };

  const renderPricingSection = (tables: typeof pricingTables, title: string, color: string) => (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {tables.map((table) => (
          <Card key={table.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{table.name}</h4>
                    <Badge className={table.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {table.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{table.description}</p>
                  <p className="text-sm font-medium text-gray-700">
                    Multiplicador: {table.multiplier.toFixed(2)} ({formatMultiplier(table.multiplier)})
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm" className={table.isActive ? 'text-gray-600' : 'text-green-600'}>
                    {table.isActive ? (
                      <ToggleRight className="h-5 w-5" />
                    ) : (
                      <ToggleLeft className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tabelas de Preço</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Tabela
        </Button>
      </div>

      {pricingTables.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Nenhuma tabela de preço configurada ainda.</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Configurar Primeira Tabela
          </Button>
        </div>
      ) : (
        <>
          {renderPricingSection(lojaTables, 'Tabelas para Lojas', 'blue')}
          {renderPricingSection(restauranteTables, 'Tabelas para Restaurantes', 'green')}
        </>
      )}
    </div>
  );
}
