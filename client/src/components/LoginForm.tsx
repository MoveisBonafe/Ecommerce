import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Store, Shield, Utensils } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(email, password);
    
    if (!success) {
      setError('Credenciais inválidas. Verifique seu email e senha.');
    }

    setIsLoading(false);
  };

  const handleDemoLogin = async (userType: string) => {
    setIsLoading(true);
    setError('');

    let demoEmail = '';
    let demoPassword = '';

    switch (userType) {
      case 'admin':
        demoEmail = 'admin@furniture.com';
        demoPassword = 'admin123';
        break;
      case 'loja':
        demoEmail = 'loja@furniture.com';
        demoPassword = 'loja123';
        break;
      case 'restaurante':
        demoEmail = 'restaurante@furniture.com';
        demoPassword = 'rest123';
        break;
    }

    const success = await login(demoEmail, demoPassword);
    
    if (!success) {
      setError('Erro ao fazer login de demonstração.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary rounded-xl flex items-center justify-center">
            <Store className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Sistema de Vendas</h2>
          <p className="mt-2 text-sm text-gray-600">Móveis e Decoração</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Fazer Login</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6 border-t pt-6">
              <p className="text-xs text-gray-500 text-center mb-4">
                Acesso de demonstração:
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleDemoLogin('admin')}
                  disabled={isLoading}
                >
                  <Shield className="h-4 w-4 mr-2 text-red-600" />
                  Administrador
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleDemoLogin('loja')}
                  disabled={isLoading}
                >
                  <Store className="h-4 w-4 mr-2 text-blue-600" />
                  Usuário Loja (5 Tabelas de Preço)
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleDemoLogin('restaurante')}
                  disabled={isLoading}
                >
                  <Utensils className="h-4 w-4 mr-2 text-green-600" />
                  Usuário Restaurante (1 Tabela de Preço)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
