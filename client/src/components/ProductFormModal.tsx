import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import type { Product, Category, Color } from '@/types';

interface ProductFormModalProps {
  product?: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductFormModal({ product, isOpen, onClose }: ProductFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: 0,
    categoryId: '',
    images: [''],
    colors: [] as string[],
    isActive: true,
  });

  const { categories, colors, addProduct, updateProduct } = useData();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        basePrice: product.basePrice,
        categoryId: product.categoryId,
        images: product.images,
        colors: product.colors,
        isActive: product.isActive,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        basePrice: 0,
        categoryId: '',
        images: [''],
        colors: [],
        isActive: true,
      });
    }
  }, [product, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (product) {
        await updateProduct(product.id, formData);
        toast({
          title: "Sucesso",
          description: "Produto atualizado com sucesso!",
        });
      } else {
        await addProduct(formData);
        toast({
          title: "Sucesso",
          description: "Produto criado com sucesso!",
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar produto. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleColorToggle = (colorId: string) => {
    const newColors = formData.colors.includes(colorId)
      ? formData.colors.filter(id => id !== colorId)
      : [...formData.colors, colorId];
    setFormData({ ...formData, colors: newColors });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Editar Produto' : 'Novo Produto'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Produto</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="basePrice">Preço Base (R$)</Label>
            <Input
              id="basePrice"
              type="number"
              step="0.01"
              min="0"
              value={formData.basePrice}
              onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Imagens (URLs)</Label>
            <div className="space-y-2">
              {formData.images.map((image, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder={`URL da imagem ${index + 1}`}
                  />
                  {formData.images.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeImageField(index)}
                    >
                      Remover
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addImageField}
              >
                Adicionar Imagem
              </Button>
            </div>
          </div>

          <div>
            <Label>Cores Disponíveis</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {colors.map((color) => (
                <div key={color.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={color.id}
                    checked={formData.colors.includes(color.id)}
                    onCheckedChange={() => handleColorToggle(color.id)}
                  />
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: color.hexValue }}
                  />
                  <Label htmlFor={color.id} className="text-sm">
                    {color.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
            />
            <Label htmlFor="isActive">Produto ativo</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : (product ? 'Atualizar' : 'Criar')}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}