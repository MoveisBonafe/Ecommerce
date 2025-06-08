import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Eye, EyeOff, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function GitHubTab() {
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if token exists in localStorage
    const savedToken = localStorage.getItem('github_token');
    if (savedToken) {
      setToken(savedToken);
      setIsConnected(true);
    }
  }, []);

  const handleSaveToken = async () => {
    if (!token.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um token válido do GitHub.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Save to localStorage for now
      localStorage.setItem('github_token', token);
      setIsConnected(true);
      
      toast({
        title: "Sucesso",
        description: "Token do GitHub salvo com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar o token. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveToken = () => {
    localStorage.removeItem('github_token');
    setToken('');
    setIsConnected(false);
    
    toast({
      title: "Token removido",
      description: "Token do GitHub foi removido com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Configuração do GitHub</h2>
          <p className="text-gray-600">Configure o token de acesso ao GitHub para integração.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            Token de Acesso GitHub
          </CardTitle>
          <CardDescription>
            Configure seu Personal Access Token do GitHub para habilitar a integração com repositórios.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isConnected && (
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-md border border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700">Token configurado com sucesso</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="github-token">Personal Access Token</Label>
            <div className="relative">
              <Input
                id="github-token"
                type={showToken ? "text" : "password"}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => setShowToken(!showToken)}
              >
                {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Como obter um Personal Access Token:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Acesse GitHub.com → Settings → Developer settings</li>
                  <li>Clique em "Personal access tokens" → "Tokens (classic)"</li>
                  <li>Clique em "Generate new token (classic)"</li>
                  <li>Selecione os escopos necessários (repo, admin:repo_hook)</li>
                  <li>Copie o token gerado</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSaveToken} 
              disabled={isLoading || !token.trim()}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isLoading ? 'Salvando...' : 'Salvar Token'}
            </Button>
            
            {isConnected && (
              <Button 
                variant="outline" 
                onClick={handleRemoveToken}
                className="flex items-center gap-2"
              >
                Remover Token
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status da Integração</CardTitle>
          <CardDescription>
            Informações sobre a conexão com o GitHub.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm font-medium">Status da Conexão</span>
              <span className={`text-sm ${isConnected ? 'text-green-600' : 'text-gray-500'}`}>
                {isConnected ? 'Conectado' : 'Não conectado'}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm font-medium">Última Atualização</span>
              <span className="text-sm text-gray-500">
                {isConnected ? 'Agora' : 'Nunca'}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">Funcionalidades Disponíveis</span>
              <span className="text-sm text-gray-500">
                {isConnected ? 'Todas' : 'Limitadas'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}