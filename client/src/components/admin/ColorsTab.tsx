import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { Plus, Edit, Trash2 } from 'lucide-react';

export function ColorsTab() {
  const { colors } = useData();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gerenciar Cores</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Cor
        </Button>
      </div>

      {colors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Nenhuma cor cadastrada ainda.</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Primeira Cor
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {colors.map((color) => (
            <Card key={color.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-gray-200"
                  style={{ backgroundColor: color.hexValue }}
                />
                <h3 className="font-medium text-gray-900 text-sm mb-2">{color.name}</h3>
                <p className="text-xs text-gray-500 mb-3">{color.hexValue}</p>
                
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" className="flex-1 p-1">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 p-1">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
