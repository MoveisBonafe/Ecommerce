import { Card, CardContent } from '@/components/ui/card';
import type { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
  isSelected?: boolean;
  onClick: (categoryId: string) => void;
}

export function CategoryCard({ category, isSelected = false, onClick }: CategoryCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary border-primary' : 'border-gray-200'
      }`}
      onClick={() => onClick(category.id)}
    >
      <CardContent className="p-4 text-center">
        <i className={`${category.icon} text-2xl mb-2 ${
          isSelected ? 'text-primary' : 'text-gray-400'
        }`} />
        <h3 className={`font-medium ${
          isSelected ? 'text-primary' : 'text-gray-900'
        }`}>
          {category.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {category.productCount} produto{category.productCount !== 1 ? 's' : ''}
        </p>
      </CardContent>
    </Card>
  );
}
