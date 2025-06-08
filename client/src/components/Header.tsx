import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Store, Shield, Utensils, ShoppingCart, LogOut, Github } from 'lucide-react';
import { GitHubConfigModal } from './GitHubConfigModal';
import { configureGitHub, isGitHubConfigured } from '@/lib/github';
import { useState } from 'react';

interface HeaderProps {
  onToggleCart?: () => void;
}

export function Header({ onToggleCart }: HeaderProps) {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [showGitHubConfig, setShowGitHubConfig] = useState(false);

  if (!user) return null;

  const getUserIcon = () => {
    switch (user.type) {
      case 'admin':
        return <Shield className="h-4 w-4 text-white" />;
      case 'loja':
        return <Store className="h-4 w-4 text-white" />;
      case 'restaurante':
        return <Utensils className="h-4 w-4 text-white" />;
      default:
        return <Store className="h-4 w-4 text-white" />;
    }
  };

  const getUserBadgeColor = () => {
    switch (user.type) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'loja':
        return 'bg-blue-100 text-blue-800';
      case 'restaurante':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserTypeLabel = () => {
    switch (user.type) {
      case 'admin':
        return 'Administrador';
      case 'loja':
        return 'Loja';
      case 'restaurante':
        return 'Restaurante';
      default:
        return user.type;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                user.type === 'admin' ? 'bg-red-600' :
                user.type === 'loja' ? 'bg-blue-600' : 'bg-green-600'
              }`}>
                {getUserIcon()}
              </div>
              <span className="font-bold text-gray-900">Sistema Vendas</span>
            </div>
            <Badge className={getUserBadgeColor()}>
              {getUserTypeLabel()}
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            {/* GitHub Configuration Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowGitHubConfig(true)}
              className={`${isGitHubConfigured() ? 'text-green-600' : 'text-gray-400'}`}
              title="Configurar GitHub"
            >
              <Github className="h-5 w-5" />
            </Button>

            {user.type !== 'admin' && onToggleCart && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleCart}
                className="relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            )}
            
            <Button variant="ghost" onClick={logout} className="flex items-center space-x-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </div>

      {/* GitHub Configuration Modal */}
      <GitHubConfigModal
        isOpen={showGitHubConfig}
        onClose={() => setShowGitHubConfig(false)}
        onSave={(config) => {
          configureGitHub(config);
          // Optional: Show success message
        }}
      />
    </header>
  );
}
