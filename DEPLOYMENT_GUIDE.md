# 🚀 Guia de Deploy com Custo ZERO - Marc Aromas

## 📊 Comparação de Opções (Free Tier)

### Análise das Plataformas

| Plataforma | Tipo | Free Tier | Prós | Contras |
|------------|------|-----------|------|---------|
| **Vercel** | Frontend | ✅ Excelente | Deploy automático, CDN global, SSL, domínio custom | Limite de 100GB bandwidth |
| **Railway** | Backend | ✅ Bom | $5 crédito/mês, fácil setup, PostgreSQL incluso | Após crédito, precisa pagar |
| **Render** | Backend | ✅ Limitado | 750h/mês grátis, SSL, PostgreSQL | Dorme após inatividade, lento startup |
| **Heroku** | Backend | ❌ Acabou | - | Free tier removido em 2022 |
| **Fly.io** | Backend | ✅ Bom | 3 VMs pequenas grátis, rápido | Configuração mais complexa |
| **Cyclic** | Backend | ✅ Excelente | Serverless, sem dormir, fácil | Limitado a Node.js, sem WebSocket |
| **Cloudflare Pages** | Frontend | ✅ Excelente | Unlimited requests, Workers grátis | Curva de aprendizado |
| **Supabase** | Database | ✅ Bom | 500MB, backups, dashboard | Pausa após 1 semana inativo |

---

## 🎯 RECOMENDAÇÃO OFICIAL

### Opção 1: **Máxima Performance** (Recomendado)

```
📱 Frontend  → Vercel (deploy automático)
🔧 Backend   → Railway (melhor free tier)
🗄️ Database  → Supabase (já configurado)
🌐 Domínio   → GoDaddy → apontar para Vercel + Railway
```

**Por que?**
- ✅ Railway: $5 crédito/mês grátis (suficiente para baixo/médio tráfego)
- ✅ Não dorme (diferente do Render)
- ✅ Deploy fácil via GitHub
- ✅ Suporte a variáveis de ambiente
- ✅ SSL automático

### Opção 2: **100% Gratuito Permanente**

```
📱 Frontend  → Vercel
🔧 Backend   → Cyclic.sh (serverless)
🗄️ Database  → Supabase
```

**Por que?**
- ✅ Cyclic: Verdadeiramente gratuito e sem dormir
- ✅ Serverless: escala automaticamente
- ✅ Deploy via GitHub fácil
- ⚠️ Limitação: cold starts (primeira request pode levar 2-3s)

### Opção 3: **Mais Controle**

```
📱 Frontend  → Cloudflare Pages
🔧 Backend   → Cloudflare Workers (API Routes)
🗄️ Database  → Supabase
```

**Por que?**
- ✅ Tudo em um ecossistema (Cloudflare)
- ✅ Performance global excelente
- ✅ 100% gratuito
- ⚠️ Workers tem limitações (não roda todo Node.js)

---

## 🚀 Tutorial de Deploy

# OPÇÃO 1: Vercel + Railway + Supabase (RECOMENDADO)

## 📦 Preparação (Uma vez)

### 1. Preparar Repositório

```bash
# Certifique-se que está tudo commitado
git status
git add .
git commit -m "chore: prepare for deployment"

# Push para GitHub
git push origin main
```

### 2. Criar contas (se não tiver)

- [Vercel](https://vercel.com) - Login com GitHub
- [Railway](https://railway.app) - Login com GitHub
- [Supabase](https://supabase.com) - Já tem ✅

---

## 🎨 FRONTEND - Vercel

### Passo 1: Configurar .env de produção

Crie `frontend/.env.production`:

```env
VITE_API_URL=https://seu-backend.up.railway.app
VITE_MERCADOPAGO_PUBLIC_KEY=seu-public-key-aqui
```

**⚠️ Importante**: NÃO commite este arquivo! Vamos configurar no Vercel.

### Passo 2: Deploy no Vercel

1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Clique em "**Add New**" > "**Project**"
3. Selecione seu repositório `marcaromas` do GitHub
4. Configure:

```yaml
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

5. **Environment Variables** (clique em "Add"):
   ```
   VITE_API_URL = https://seu-backend.up.railway.app
   VITE_MERCADOPAGO_PUBLIC_KEY = APP_USR-xxxxx
   ```

6. Clique em "**Deploy**"

7. Aguarde ~2 minutos

8. ✅ Frontend no ar! URL: `https://marcaromas.vercel.app`

### Passo 3: Domínio Custom (GoDaddy)

1. No Vercel, vá em **Settings** > **Domains**
2. Adicione: `www.marcaromas.com.br` e `marcaromas.com.br`
3. Vercel vai mostrar os DNS para configurar
4. No GoDaddy:
   - Vá em **DNS Management**
   - Adicione record **A**: `@` → `76.76.21.21`
   - Adicione record **CNAME**: `www` → `cname.vercel-dns.com`
5. Aguarde propagação (até 48h, geralmente 1-2h)
6. ✅ Site no seu domínio!

---

## 🔧 BACKEND - Railway

### Passo 1: Deploy no Railway

1. Acesse [Railway](https://railway.app/dashboard)
2. Clique em "**New Project**"
3. Selecione "**Deploy from GitHub repo**"
4. Escolha `marcaromas`
5. Railway detecta automaticamente (Node.js)

### Passo 2: Configurar

1. Clique no serviço criado
2. Vá em **Settings**:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start` (ou `node src/server.js`)
   - **Build Command**: Deixe vazio (npm install já roda)

### Passo 3: Variables de Ambiente

1. Vá em **Variables**
2. Clique em "**New Variable**" e adicione:

```env
NODE_ENV=production
PORT=5001

DATABASE_URL=sua-url-supabase-pooled
DIRECT_URL=sua-url-supabase-direct

JWT_SECRET=seu-jwt-secret-forte

FRONTEND_URL=https://marcaromas.vercel.app

MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxx
MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxx

GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
GOOGLE_CALLBACK_URL=https://seu-backend.up.railway.app/api/auth/google/callback

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app

SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx
```

### Passo 4: Deploy

1. Clique em "**Deploy**"
2. Aguarde build (~3-5 min)
3. Railway gera URL: `https://seu-app.up.railway.app`

### Passo 5: Rodar Migrations

**Opção A - Via Railway CLI** (recomendado)

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link ao projeto
railway link

# Rodar migration
railway run npx prisma migrate deploy
```

**Opção B - Via Supabase SQL Editor**

Cole o SQL gerado pelas migrations diretamente no Supabase.

### Passo 6: Domínio Custom (Opcional)

1. No Railway, vá em **Settings** > **Domains**
2. Clique em "**Add Custom Domain**"
3. Digite: `api.marcaromas.com.br`
4. Railway mostra o CNAME
5. No GoDaddy, adicione:
   - **CNAME**: `api` → `xxx.up.railway.app`

---

## 🗄️ DATABASE - Supabase

Já configurado! ✅ (ver `SUPABASE_SETUP.md`)

---

## 🔄 Deploy Automático (CI/CD)

### Configuração

Após setup inicial, **todo push para main** = deploy automático:

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
```

- ⚡ Vercel rebuilda frontend automático
- ⚡ Railway rebuilda backend automático

---

## 🧪 Testar Deploy

### 1. Verificar Frontend

```
https://marcaromas.vercel.app
```

Deve carregar a homepage

### 2. Verificar Backend

```
https://seu-backend.up.railway.app/api
```

Deve retornar:
```json
{
  "ok": true,
  "env": "mercadopago"
}
```

### 3. Testar API

```bash
curl https://seu-backend.up.railway.app/api/products
```

Deve retornar lista de produtos

---

## ⚙️ Configurações Importantes

### CORS

Certifique-se que `backend/src/app.js` tem:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5174',
    'https://marcaromas.vercel.app',
    'https://www.marcaromas.com.br',
    'https://marcaromas.com.br'
  ],
  credentials: true
}));
```

### Variáveis de Ambiente - Vercel

Atualize `VITE_API_URL`:
- Development: `http://localhost:5001`
- Production: `https://seu-backend.up.railway.app`

### Webhooks Mercado Pago

Atualize a notification_url para:
```
https://seu-backend.up.railway.app/api/webhooks/mercadopago
```

---

## 💰 Custos Estimados (Grátis!)

### Mês 1-6 (Baixo tráfego)

| Serviço | Custo |
|---------|-------|
| Vercel (Frontend) | **$0** |
| Railway (Backend) | **$0** (dentro do crédito) |
| Supabase (Database) | **$0** |
| **Total** | **$0/mês** |

### Após crescimento (Médio tráfego)

| Serviço | Custo |
|---------|-------|
| Vercel Pro | $20/mês (se ultrapassar 100GB) |
| Railway | $5-20/mês (conforme uso) |
| Supabase Pro | $25/mês (se ultrapassar 500MB) |
| **Total** | **$0-65/mês** |

---

## 📊 Monitoramento

### Vercel
- Dashboard > Analytics
- Veja: Requests, Bandwidth, Edge Network

### Railway
- Dashboard > Metrics
- Veja: CPU, Memory, Network

### Supabase
- Dashboard > Database
- Veja: Connections, Size, Queries

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to database"

✅ **Solução**: Verifique `DATABASE_URL` no Railway
- Use a URL **pooled** (porta 6543)
- Certifique-se que tem `?pgbouncer=true`

### Erro: "CORS policy blocked"

✅ **Solução**: Adicione domínio Vercel no CORS do backend

### Frontend não carrega API

✅ **Solução**: 
1. Verifique `VITE_API_URL` no Vercel
2. Teste backend direto no navegador
3. Verifique logs no Railway

### Migration fails

✅ **Solução**: Use `DIRECT_URL` (porta 5432) para migrations

---

## 🚀 Alternativa: Cyclic (100% Free)

Se preferir **zero custos garantidos**:

### Deploy Backend no Cyclic

1. Acesse [Cyclic.sh](https://cyclic.sh)
2. Login com GitHub
3. "**Connect Repo**" > `marcaromas`
4. Selecione `backend/` como root
5. Adicione env vars (igual Railway)
6. Deploy!

**Vantagens**:
- ✅ Grátis pra sempre
- ✅ Não dorme
- ✅ Deploy rápido

**Desvantagens**:
- ⚠️ Cold starts (2-3s primeira request)
- ⚠️ Serverless (não ideal para WebSockets)

---

## ✅ Checklist de Deploy

- [ ] Código no GitHub (branch main)
- [ ] `.env.example` atualizado
- [ ] Frontend deployado no Vercel
- [ ] Backend deployado no Railway/Cyclic
- [ ] Variáveis de ambiente configuradas
- [ ] Migrations rodadas no Supabase
- [ ] CORS configurado
- [ ] Domínio apontado (GoDaddy)
- [ ] SSL ativo (automático)
- [ ] Webhooks atualizados (Mercado Pago)
- [ ] Testes realizados
- [ ] Monitoramento ativo

---

## 📞 Recursos

- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Cyclic Docs](https://docs.cyclic.sh)
- [Supabase Docs](https://supabase.com/docs)

---

**Tempo estimado de deploy completo**: 1-2 horas

**Pronto!** Sua aplicação estará no ar com custo ZERO e performance profissional! 🎉
