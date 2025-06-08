import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Settings, AlertCircle } from 'lucide-react';

interface GitHubConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: { token: string; owner: string; repo: string }) => void;
  currentConfig?: {
    owner: string;
    repo: string;
  };
}

export function GitHubConfigModal({ isOpen, onClose, onSave, currentConfig }: GitHubConfigModalProps) {
  const [token, setToken] = useState('');
  const [owner, setOwner] = useState(currentConfig?.owner || '');
  const [repo, setRepo] = useState(currentConfig?.repo || '');

  const handleSave = () => {
    if (token && owner && repo) {
      onSave({ token, owner, repo });
      setToken(''); // Clear token from memory
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="w-5 h-5" />
            Configuração GitHub
          </DialogTitle>
          <DialogDescription>
            Configure os dados do GitHub para sincronizar com o repositório
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Importante
              </CardTitle>
              <CardDescription className="text-xs">
                O token será usado apenas nesta sessão e não será salvo permanentemente
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="space-y-3">
            <div>
              <Label htmlFor="owner">Nome do usuário/organização</Label>
              <Input
                id="owner"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="seu-usuario"
              />
            </div>

            <div>
              <Label htmlFor="repo">Nome do repositório</Label>
              <Input
                id="repo"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="nome-do-repositorio"
              />
            </div>

            <div>
              <Label htmlFor="token">Token de acesso</Label>
              <Input
                id="token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Crie um token em: GitHub Settings → Developer settings → Personal access tokens
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!token || !owner || !repo}
              className="flex-1"
            >
              <Settings className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}