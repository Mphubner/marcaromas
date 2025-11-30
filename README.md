# 🕯️ Marc Aromas - Plataforma E-commerce Premium

> Plataforma completa de e-commerce para velas aromáticas artesanais com sistema de assinaturas, programa de indicações e conteúdo exclusivo.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-blueviolet.svg)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 📋 Sobre o Projeto

**Marc Aromas** é uma plataforma full-stack moderna que combina e-commerce tradicional com um modelo de assinatura (clube) para entrega mensal de velas aromáticas exclusivas. O projeto oferece uma experiência premium com funcionalidades avançadas de gamificação, personalização e engajamento do cliente.

### ✨ Principais Funcionalidades

- 🛍️ **E-commerce Completo**: Catálogo de produtos, carrinho, checkout multi-step
- 📦 **Clube de Assinaturas**: Boxes mensais temáticas com renovação automática
- 🎁 **Sistema de Presentes**: Presenteie assinaturas com cartão digital e agendamento
- 💰 **Programa de Indicações**: Sistema de referral com recompensas e tiers
- 🎯 **Perfil de Aromas**: Questionário personalizado e recomendações inteligentes
- 🏆 **Gamificação**: Conquistas, badges, pontos de fidelidade
- 📱 **Conteúdo Exclusivo**: Blog, artigos premium, meditações guiadas
- 💳 **Múltiplos Métodos de Pagamento**: PIX, Cartão (parcelado), Boleto
- 📊 **Painel Administrativo Completo**: Gestão de pedidos, produtos, clientes, analytics

## 🏗️ Arquitetura

### Stack Tecnológico

**Frontend:**
```
├── React 18 (Vite)
├── TailwindCSS + shadcn/ui
├── Framer Motion (animações)
├── TanStack Query (state management)
├── React Router DOM
└── Lucide Icons
```

**Backend:**
```
├── Node.js + Express
├── PostgreSQL (Database)
├── Prisma ORM
├── JWT (Auth)
├── Nodemailer (Email)
└── Mercado Pago SDK
```

**Integrações:**
- 🔐 **Autenticação**: JWT + Google OAuth
- 💳 **Pagamentos**: Mercado Pago (PIX, Cartão, Boleto, Assinaturas)
- 📧 **Email**: Nodemailer (SMTP)
- 📦 **Envios**: Melhor Envio API
- 📍 **CEP**: ViaCEP

### Estrutura do Projeto

```
marcaromas/
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/        # Páginas (36 públicas/usuário + 27 admin)
│   │   ├── context/      # Context API (Auth, Cart, Preferences)
│   │   ├── services/     # API clients
│   │   └── lib/         # Utilitários
│   └── package.json
│
├── backend/               # Node.js API
│   ├── src/
│   │   ├── controllers/  # Lógica de negócio (30 controllers)
│   │   ├── routes/      # Rotas da API (32 endpoints)
│   │   ├── services/    # Serviços externos
│   │   ├── middlewares/ # Auth, error handling
│   │   └── utils/       # Helpers
│   ├── prisma/
│   │   ├── schema.prisma # Database schema (34 models)
│   │   └── migrations/   # Database migrations
│   └── package.json
│
├── uploads/              # Arquivos uploaded (gitignored)
├── PLATFORM_DOCUMENTATION.md  # Documentação completa (1000+ linhas)
└── README.md            # Este arquivo
```

## 🚀 Começando

### Pré-requisitos

- Node.js 18+ 
- PostgreSQL 15+
- npm ou yarn
- Conta Mercado Pago (para pagamentos)
- Conta Google Cloud (para OAuth - opcional)

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/marcaromas.git
   cd marcaromas
   ```

2. **Configure o Backend**
   ```bash
   cd backend
   npm install
   
   # Copie e configure o .env
   cp .env.example .env
   # Edite .env com suas credenciais
   ```

3. **Configure o Banco de Dados**
   ```bash
   # Execute as migrations
   npx prisma migrate deploy
   
   # (Opcional) Seed do banco com dados de exemplo
   npx prisma db seed
   ```

4. **Configure o Frontend**
   ```bash
   cd ../frontend
   npm install
   
   # Copie e configure o .env
   cp .env.example .env
   ```

5. **Inicie os servidores**
   
   **Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   # Rodando em http://localhost:5001
   ```
   
   **Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   # Rodando em http://localhost:5174
   ```

### Configuração de Variáveis de Ambiente

#### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/marcaromas"

# JWT
JWT_SECRET="seu-secret-jwt-aqui"

# URLs
FRONTEND_URL="http://localhost:5174"
BACKEND_URL="http://localhost:5001"

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN="seu-access-token"
MERCADOPAGO_PUBLIC_KEY="sua-public-key"

# Google OAuth (opcional)
GOOGLE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="seu-client-secret"

# SMTP (Email)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="sua-senha-de-app"
```

#### Frontend (.env)

```env
VITE_API_URL="http://localhost:5001"
VITE_MERCADOPAGO_PUBLIC_KEY="sua-public-key"
```

### Guias de Configuração

#### Configurar Mercado Pago

1. Crie uma conta em [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
2. Acesse suas [credenciais](https://www.mercadopago.com.br/developers/panel/credentials)
3. Copie `Access Token` e `Public Key`
4. Cole no `.env` do backend

#### Configurar Google OAuth (Opcional)

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto
3. Ative a API "Google+ API"
4. Crie credenciais OAuth 2.0
5. Configure authorized redirect URI: `http://localhost:5001/api/auth/google/callback`
6. Copie Client ID e Client Secret para `.env`

#### Configurar Email (SMTP Gmail)

1. Acesse [Segurança da Conta Google](https://myaccount.google.com/security)
2. Ative verificação em 2 etapas
3. Gere uma "Senha de app"
4. Use a senha gerada no `SMTP_PASS` do `.env`

## 📚 Documentação

- **[Documentação Completa da Plataforma](PLATFORM_DOCUMENTATION.md)** - Guia detalhado de todas as funcionalidades, páginas, APIs e pendências
- **[Schema do Banco de Dados](backend/prisma/schema.prisma)** - Modelos Prisma com 34 tabelas
- **[Rotas da API](backend/src/routes/)** - 32 arquivos de rotas organizados por recurso

### Endpoints Principais

```
POST   /api/auth/login              # Login
POST   /api/auth/register           # Cadastro
GET    /api/products                # Listar produtos
POST   /api/cart                    # Adicionar ao carrinho
POST   /api/orders                  # Criar pedido
POST   /api/subscriptions           # Criar assinatura
POST   /api/gifts                   # Criar presente
GET    /api/referrals/code          # Obter código de indicação
POST   /api/payment/pix             # Gerar PIX
POST   /api/payment/credit-card     # Pagar com cartão
```

Ver documentação completa de endpoints em `PLATFORM_DOCUMENTATION.md`

## 🎨 Funcionalidades Destacadas

### 1. Sistema de Presentes 🎁

Fluxo completo para presentear assinaturas:
- Seleção de plano e duração (1-12 meses)
- Descontos progressivos (3m: 5%, 6m: 10%, 12m: 15%)
- Mensagem personalizada com templates
- Preview do cartão digital
- Agendamento de envio
- Email automático com cartão HTML responsivo
- Integração com pagamento e checkout

### 2. Programa de Indicações 💰

Sistema completo de referral:
- Código personalizado por usuário
- Rastreamento de cliques, cadastros e conversões
- Múltiplos tipos de recompensa (fixo, percentual, recorrente, tiers)
- Dashboard de estatísticas
- Compartilhamento social facilitado
- Gestão de payouts

### 3. Clube de Assinaturas 📦

- Múltiplos planos com benefícios exclusivos
- Renovação automática via Mercado Pago
- Boxes mensais temáticas
- Pausar/retomar/cancelar assinatura
- Histórico completo de entregas
- Gestão de endereço e forma de pagamento

### 4. Gamificação e Conquistas 🏆

- Sistema de pontos de fidelidade
- Badges e conquistas
- Níveis de usuário
- Recompensas por ações (primeira compra, indicações, reviews)
- Dashboard de progresso

## 🛠️ Scripts Disponíveis

### Backend

```bash
npm run dev          # Inicia servidor em modo desenvolvimento
npm start            # Inicia servidor em produção
npm run migrate      # Roda migrations do Prisma
npm run seed         # Popula banco com dados de exemplo
```

### Frontend

```bash
npm run dev          # Inicia dev server (Vite)
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Lint do código
```

## 🧪 Testes

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📦 Deploy

### Backend (Sugestões)

- **Railway / Render**: Deploy direto do GitHub
- **Heroku**: Com PostgreSQL addon
- **DigitalOcean App Platform**: Com managed database
- **AWS EC2**: Com RDS PostgreSQL

### Frontend (Sugestões)

- **Vercel**: Deploy automático (recomendado para Vite)
- **Netlify**: Configuração simples
- **Cloudflare Pages**: Performance otimizada
- **AWS S3 + CloudFront**: Escalável

### Variáveis de Ambiente em Produção

Não esqueça de configurar todas as variáveis do `.env.example` no seu provedor de deploy!

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Roadmap

### Q1 2026
- [x] Sistema de presentes completo
- [ ] Envio automático de boxes (job queue)
- [ ] Sistema de reviews com fotos
- [ ] Otimizações de performance

### Q2 2026
- [ ] PWA / Mobile app
- [ ] Recomendações com IA/ML
- [ ] Checkout one-page
- [ ] Gamificação expandida

### Q3 2026
- [ ] Marketplace de artesãos
- [ ] Workshops online
- [ ] Comunidade e fórum

Ver roadmap completo em `PLATFORM_DOCUMENTATION.md`

## ⚠️ Pendências Conhecidas

- **Email SMTP**: Configurar credenciais para produção
- **Envio de Boxes**: Implementar job queue para entregas automáticas
- **Rastreamento**: Webhooks de transportadora
- **Reviews**: Upload de fotos e helpful counter

Ver lista completa de pendências em `PLATFORM_DOCUMENTATION.md`

## 📄 Licença

Este projeto está sob a licença MIT. Ver arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

- **Desenvolvimento**: [Seu Nome]
- **Design**: [Nome do Designer]
- **Produto**: [Nome do PM]

## 📞 Contato

- **Website**: [marcaromas.com.br](https://marcaromas.com.br)
- **Email**: contato@marcaromas.com.br
- **Instagram**: [@marcaromas](https://instagram.com/marcaromas)

---

<p align="center">
  Feito com ❤️ e 🕯️ pela equipe Marc Aromas
</p>
