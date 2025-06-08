import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';

export function PromotionsTab() {
  const { promotions } = useData();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isPromotionActive = (promotion: typeof promotions[0]) => {
    const now = new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);
    
    return promotion.isActive && now >= startDate && now <= endDate;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gerenciar Promoções</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Promoção
        </Button>
      </div>

      {promotions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Nenhuma promoção cadastrada ainda.</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeira Promoção
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {promotions.map((promotion) => (
            <Card key={promotion.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{promotion.title}</h3>
                      <Badge 
                        className={isPromotionActive(promotion) 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {isPromotionActive(promotion) ? 'Ativa' : 'Inativa'}
                      </Badge>
                      {promotion.discountPercentage && (
                        <Badge className="bg-orange-100 text-orange-800">
                          {promotion.discountPercentage}% OFF
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{promotion.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}</span>
                      </div>
                      <div>
                        Usuários: {promotion.userTypes.join(', ')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
