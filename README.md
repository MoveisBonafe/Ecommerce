# Sistema de Vendas - Móveis

Plataforma e-commerce para vendas de móveis com controle de acesso baseado em funções, múltiplas tabelas de preços e integração com WhatsApp.

## Funcionalidades

- ✅ Sistema de autenticação com 3 tipos de usuário (Admin, Loja, Restaurante)
- ✅ Catálogo de produtos com categorias e variações de cores
- ✅ Tabelas de preços diferenciadas (5 para lojas, 1 para restaurantes)
- ✅ Carrinho de compras com integração WhatsApp
- ✅ Painel administrativo completo
- ✅ Design responsivo compatível com GitHub Pages
- ✅ Fallback para localStorage quando GitHub API não disponível

## Deploy no GitHub Pages

### 1. Preparar o Repositório

```bash
# Clone ou faça fork deste repositório
git clone [seu-repositorio]
cd [nome-do-repositorio]

# Crie a estrutura de dados necessária
mkdir -p docs/data

# Crie os arquivos JSON iniciais (vazios por enquanto)
echo "[]" > docs/data/users.json
echo "[]" > docs/data/products.json
echo "[]" > docs/data/categories.json
echo "[]" > docs/data/colors.json
echo "[]" > docs/data/pricing-tables.json
echo "[]" > docs/data/promotions.json
echo "[]" > docs/data/announcements.json

# Faça commit das mudanças
git add .
git commit -m "Add initial data structure for GitHub Pages"
git push origin main
```

### 2. Configurar GitHub Pages

1. Vá para **Settings** → **Pages** no seu repositório
2. Em **Source**, selecione **Deploy from a branch**
3. Escolha **main** branch e **/ (root)** folder
4. Clique em **Save**

### 3. Obter Token GitHub

1. Vá para [GitHub Settings](https://github.com/settings/tokens)
2. Clique em **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. Clique em **Generate new token (classic)**
4. Dê um nome descritivo (ex: "Furniture Store Data Access")
5. Selecione as permissões:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `public_repo` (Access public repositories)
6. Clique em **Generate token**
7. **IMPORTANTE**: Copie o token imediatamente (você não verá novamente)

### 4. Configurar no Sistema

1. Acesse sua aplicação no GitHub Pages
2. Faça login com qualquer uma das contas demo:
   - **Admin**: admin@furniture.com / admin123
   - **Loja**: loja@furniture.com / loja123
   - **Restaurante**: restaurante@furniture.com / rest123

3. Clique no ícone do GitHub no header (cinza = não configurado, verde = configurado)
4. Preencha:
   - **Usuário/Organização**: seu username do GitHub
   - **Repositório**: nome do seu repositório
   - **Token**: o token gerado no passo 3

### 5. Build para Produção

```bash
# Instalar dependências
npm install

# Build para produção
npm run build

# Os arquivos serão gerados na pasta 'dist'
# Para GitHub Pages, você pode usar GitHub Actions ou fazer build local
```

### 6. Configuração Opcional com GitHub Actions

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: \${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## Contas Demo

O sistema inclui 3 contas de demonstração:

| Tipo | Email | Senha | Acesso |
|------|-------|-------|---------|
| Admin | admin@furniture.com | admin123 | Painel administrativo completo |
| Loja | loja@furniture.com | loja123 | 5 tabelas de preços + carrinho |
| Restaurante | restaurante@furniture.com | rest123 | 1 tabela especial + carrinho |

## Estrutura de Dados

O sistema usa arquivos JSON no GitHub para persistência:

```
docs/data/
├── users.json          # Usuários do sistema
├── products.json       # Catálogo de produtos
├── categories.json     # Categorias de produtos
├── colors.json         # Variações de cores
├── pricing-tables.json # Tabelas de preços
├── promotions.json     # Promoções ativas
└── announcements.json  # Avisos/comunicados
```

## Tecnologias Utilizadas

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Componentes**: Radix UI + shadcn/ui
- **Roteamento**: Wouter
- **Estado**: React Query + Context API
- **Build**: Vite
- **Hospedagem**: GitHub Pages
- **Persistência**: GitHub API + localStorage fallback

## Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## Segurança

- ❌ Nunca faça commit do token GitHub no código
- ✅ Use o modal de configuração na aplicação para inserir credenciais
- ✅ Token é armazenado apenas na sessão atual
- ✅ Sistema funciona offline com localStorage como fallback

## Suporte

Para dúvidas ou problemas:
1. Verifique se o token GitHub tem as permissões corretas
2. Confirme que a estrutura `docs/data/` existe no repositório
3. Teste primeiro com localStorage (sem configurar GitHub)
4. Verifique o console do navegador para erros específicos

---

**Nota**: Este sistema foi projetado especificamente para GitHub Pages e pequenas empresas que precisam de uma solução simples e eficaz para vendas online.