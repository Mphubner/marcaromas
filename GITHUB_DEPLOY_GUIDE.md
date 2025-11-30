# Guia de Deploy para GitHub

## 📝 Passo a Passo

### 1. Verificar arquivos sensíveis

Certifique-se de que o `.gitignore` está protegendo arquivos sensíveis:

```bash
# Verificar se .env está sendo ignorado
git status
# NÃO deve aparecer .env na lista
```

### 2. Adicionar arquivos ao staging

```bash
# Adicionar todos os arquivos (exceto os ignorados)
git add .

# Ver o que será commitado
git status
```

### 3. Fazer primeiro commit

```bash
git commit -m "chore: initial commit - Marc Aromas platform"
```

### 4. Criar repositório no GitHub

1. Acesse [github.com](https://github.com)
2. Clique em "New repository"
3. Nome: `marcaromas` ou nome de sua escolha
4. Descrição: "Plataforma e-commerce premium para velas aromáticas artesanais"
5. **Importante**: NÃO inicialize com README (já temos um)
6. Clique  "Create repository"

### 5. Conectar repositório local ao GitHub

```bash
# Adicionar remote
git remote add origin https://github.com/SEU-USUARIO/marcaromas.git

# Verificar remote
git remote -v

# Push inicial (primeira vez)
git branch -M main
git push -u origin main
```

### 6. Verificar no GitHub

Acesse seu repositório e verifique:
- ✅ Arquivos foram enviados
- ✅ README.md está sendo exibido
- ✅ .env NÃO está no repositório
- ✅ node_modules NÃO está no repositório

## 🔒 Segurança

### Antes de fazer push, SEMPRE verifique:

```bash
# Ver arquivos que serão commitados
git status

# Ver conteúdo exact que será enviado
git diff --staged
```

### ⚠️ NUNCA commite:

- ❌ Arquivos `.env`
- ❌ Senhas, tokens, API keys
- ❌ `node_modules/`
- ❌ Arquivos de banco de dados
- ❌ Uploads de usuários
- ❌ Certificados SSL (.pem, .key)

### Se você acidentalmente commitou algo sensível:

```bash
# Remover arquivo do último commit (NÃO fazer se já deu push)
git reset HEAD~1
git add .
git commit -m "chore: fix commit"

# Se JÁ deu push - URGENTE
# 1. Revogue TODAS as chaves/tokens expostos
# 2. Use BFG Repo Cleaner ou git filter-branch
# 3. Force push (cuidado!)
```

## 📦 Commits Subsequentes

```bash
# Adicionar mudanças
git add .

# Commit com mensagem descritiva
git commit -m "feat: adiciona sistema de cupons"

# Push para GitHub
git push
```

## 🌿 Branches

### Criar branch para feature:

```bash
# Criar e mudar para nova branch
git checkout -b feature/nome-da-feature

# Trabalhar normalmente
git add .
git commit -m "feat: implementa X"

# Push da branch
git push -u origin feature/nome-da-feature
```

### Merge via Pull Request:

1. Acesse o repositório no GitHub
2. Vá em "Pull Requests"
3. "New Pull Request"
4. Selecione sua branch
5. Descreva as mudanças
6. "Create Pull Request"
7. Aguarde review (se estiver em equipe)
8. "Merge Pull Request"

## 🔄 Mantendo o projeto atualizado

```bash
# Puxar atualizações do GitHub
git pull

# Se houver conflitos
# 1. Resolva os conflitos manualmente
# 2. git add .
# 3. git commit -m "fix: resolve merge conflicts"
```

## 📊 Tags e Releases

### Criar uma release:

```bash
# Tag uma versão
git tag -a v1.0.0 -m "Release v1.0.0 - Initial launch"

# Push da tag
git push origin v1.0.0
```

No GitHub:
1. Vá em "Releases"
2. "Create a new release"
3. Selecione a tag
4. Adicione release notes
5. Publique

## 🚀 Deploy Automático (CI/CD)

Considere configurar GitHub Actions para deploy automático.

Exemplo `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        cd backend && npm install
        cd ../frontend && npm install
    
    - name: Run tests
      run: npm test
    
    - name: Deploy to production
      # Adicione seu script de deploy
      run: echo "Deploy to your hosting"
```

## ✅ Checklist Final

Antes de tornar o repositório público:

- [ ] `.gitignore` configurado corretamente
- [ ] Nenhum arquivo `.env` commitado
- [ ] README.md completo e atualizado
- [ ] CONTRIBUTING.md criado
- [ ] LICENSE adicionado
- [ ] Remover comentários sensíveis do código
- [ ] Atualizar URLs hardcoded
- [ ] Testar clone fresh e setup
- [ ] Atualizar PLATFORM_DOCUMENTATION.md se necessário

## 📞 Ajuda

Se tiver problemas:
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [GitHub Support](https://support.github.com/)

---

**Importante**: Este é um projeto privado. Não compartilhe credenciais ou dados sensíveis no repositório!
