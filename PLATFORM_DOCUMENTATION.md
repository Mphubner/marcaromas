# Marc Aromas - Documentação Completa da Plataforma
**Versão 1.0 | Novembro 2025**

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Páginas Públicas](#páginas-públicas)
4. [Área do Usuário](#área-do-usuário)
5. [Painel Administrativo](#painel-administrativo)
6. [Funcionalidades Principais](#funcionalidades-principais)
7. [Integrações](#integrações)
8. [Pendências e Melhorias](#pendências-e-melhorias)

---

## 🎯 Visão Geral

**Marc Aromas** é uma plataforma e-commerce completa especializada em velas aromáticas artesanais, com modelo de negócio híbrido que combina:

- **E-commerce Tradicional**: Venda de produtos avulsos
- **Clube de Assinaturas**: Assinaturas mensais de boxes temáticas
- **Sistema de Presentes**: Funcionalidade para presentear assinaturas
- **Programa de Indicações**: Sistema de referral com recompensas
- **Conteúdo Exclusivo**: Blog e conteúdo premium para assinantes

### Stack Tecnológico

**Frontend:**
- React 18 com Vite
- TailwindCSS + shadcn/ui
- Framer Motion (animações)
- TanStack Query (gerenciamento de estado)
- React Router DOM

**Backend:**
- Node.js + Express
- PostgreSQL + Prisma ORM
- Mercado Pago (pagamentos)
- Nodemailer (emails)
- JWT (autenticação)

---

## 🏗️ Arquitetura do Sistema

### Estrutura de Diretórios

```
marcaromas/
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── context/       # Contextos React
│   │   ├── services/      # APIs e serviços
│   │   └── lib/          # Utilitários
│   └── public/
├── backend/
│   ├── src/
│   │   ├── controllers/   # Lógica de negócio
│   │   ├── routes/       # Rotas da API
│   │   ├── services/     # Serviços (email, MP)
│   │   ├── middlewares/  # Auth, erros, etc.
│   │   └── utils/        # Funções auxiliares
│   └── prisma/           # Schema do banco
```

### Banco de Dados (34 Modelos)

**Principais entidades:**
- User, Product, Order, Subscription
- Cart, CartItem, Gift, Plan
- Referral, ReferralCode, ReferralConversion
- Content, ContentBlock, Review
- Coupon, Achievement, Notification

---

## 🌐 Páginas Públicas

### 1. **Home** (`/`)
**Arquivo:** `HomePage.jsx`

**Funcionalidades:**
- Hero carousel com 4 slides animados
- Seção "Como Funciona" com 4 steps
- Galeria de produtos em destaque
- Seção de depoimentos/reviews
- Newsletter signup
- CTAs para clube e loja

**Tecnologias:**
- Swiper.js para carousel
- Intersection Observer para animações
- React Query para buscar produtos

---

### 2. **Loja** (`/loja`)
**Arquivo:** `LojaPage.jsx`

**Funcionalidades:**
- Grid de produtos com paginação
- Filtros por categoria e preço
- Ordenação (preço, nome, popularidade)
- Busca por nome/descrição
- Cards de produtos com hover effects
- Badge "Em Destaque" e "Esgotado"
- Adicionar ao carrinho direto

**Dados exibidos:**
- Imagem, nome, preço, descrição curta
- Avaliações (stars)
- Estoque disponível

---

### 3. **Clube de Assinaturas** (`/clube`)
**Arquivo:** `ClubePage.jsx`

**Funcionalidades:**
- Apresentação dos planos disponíveis
- Cards de planos com detalhes:
  - Preço mensal
  - Itens incluídos
  - Benefícios exclusivos
- FAQ interativo (8 perguntas)
- Box do mês em destaque
- CTA para assinar
- Depoimentos de assinantes

**Destaques:**
- Plano "Mais Popular" destacado
- Comparação de benefícios
- Garantia de satisfação

---

### 4. **Presentear** (`/presentear`) ⭐ NOVO
**Arquivo:** `PresentePage.jsx`

**Funcionalidades:**
- **Seleção de Plano**: Visual premium dos planos
- **Duração**: Slider para escolher meses (1-12)
  - Descontos progressivos: 3m (5%), 6m (10%), 12m (15%)
- **Dados do Presenteador**: Nome, email, telefone, CPF
- **Dados do Presenteado**: 
  - Info pessoal (nome, email, telefone)
  - Endereço completo de entrega
- **Mensagem Personalizada**:
  - 4 templates prontos
  - Preview do cartão digital
  - Opção de agendar envio
- **Produtos Extras**: Adicionar itens da loja
- **Resumo**: Cálculo com descontos e parcelamento

**Fluxo:**
1. Hero inspirador
2. Seleção passo a passo
3. Progressive disclosure
4. Validação completa
5. Checkout integrado

---

### 5. **Produto** (`/produto/:slug`)
**Arquivo:** `ProdutoPage.jsx`

**Funcionalidades:**
- Galeria de imagens do produto
- Informações detalhadas:
  - Nome, descrição completa
  - Preço, comparativo de preço
  - Tags e categoria
  - Família aromática
  - Notas de aroma
  - Ingredientes
  - Tempo de queima
  - Dimensões e peso
- Seletor de quantidade
- Adicionar ao carrinho
- Adicionar à wishlist
- Reviews e avaliações
- Produtos relacionados
- FAQ do produto

---

### 6. **Box do Mês** (`/box/:slug`)
**Arquivo:** `BoxProductPage.jsx`

**Funcionalidades:**
- Tema do mês
- Itens incluídos
- Valor total vs preço do box
- Benefícios exclusivos
- Playlist Spotify do mês
- Dicas de ritual aromático
- Galeria de imagens
- Compra avulsa do box

---

### 7. **Blog/Aromaterapia** (`/aromaterapia`)
**Arquivo:** `AromaterapiaPage.jsx`

**Funcionalidades:**
- Grid de posts do blog
- Filtro por categoria
- Tags de interesse
- Busca por título
- Preview de posts
- Tempo de leitura estimado
- Imagem de capa
- CTA para ler mais

---

### 8. **Post do Blog** (`/blog/:slug`)
**Arquivo:** `BlogPostPage.jsx`

**Funcionalidades:**
- Conteúdo completo do post
- Imagem de destaque
- Autor e data
- Tags relacionadas
- Compartilhamento social
- Posts relacionados
- Comentários (se ativo)

---

### 9. **Sobre** (`/sobre`)
**Arquivo:** `SobrePage.jsx`

**Funcionalidades:**
- História da marca
- Missão, visão e valores
- Processo artesanal
- Equipe
- Diferenciais
- Sustentabilidade

---

### 10. **Contato** (`/contato`)
**Arquivo:** `ContatoPage.jsx`

**Funcionalidades:**
- Formulário de contato:
  - Nome, email, telefone
  - Assunto
  - Mensagem
- Informações de contato
- Redes sociais
- FAQ rápido
- Mapa de localização (se aplicável)

---

### 11. **Carrinho** (`/carrinho`)
**Arquivo:** `CarrinhoPage.jsx`

**Funcionalidades:**
- Lista de produtos no carrinho
- Atualizar quantidade
- Remover item
- Calcular subtotal
- Cupom de desconto
- Frete estimado
- Total do pedido
- Continuar comprando
- Finalizar compra

**Validações:**
- Estoque disponível
- Valor mínimo de pedido
- Cupom válido

---

### 12. **Login/Cadastro** (`/login`)
**Arquivo:** `LoginPage.jsx`

**Funcionalidades:**
- Login com email/senha
- Login com Google OAuth
- Cadastro novo usuário
- Recuperação de senha
- Validações de formulário
- Redirecionamento pós-login

---

## 👤 Área do Usuário
*Rotas protegidas - requerem autenticação*

### 1. **Dashboard** (`/dashboard`)
**Arquivo:** `Dashboard.jsx`

**Funcionalidades:**
- Visão geral da conta
- Status da assinatura
- Próximas entregas
- Pontos de fidelidade
- Conquistas recentes
- Indicações ativas
- Pedidos recentes
- Notificações importantes

**Widgets:**
- Card de assinatura
- Próxima entrega
- Saldo de créditos
- Rankings e conquistas

---

### 2. **Minha Assinatura** (`/minha-assinatura`)
**Arquivo:** `MinhaAssinatura.jsx`

**Funcionalidades:**
- Detalhes do plano atual
- Data da próxima cobrança
- Histórico de entregas
- Método de pagamento
- Endereço de entrega
- Gerenciar assinatura:
  - Pausar/retomar
  - Cancelar
  - Alterar plano
  - Atualizar endereço

**Informações exibidas:**
- Status (ativa, pausada, cancelada)
- Boxes recebidas
- Próxima box
- Valor mensal

---

### 3. **Minhas Compras** (`/minhas-compras`)
**Arquivo:** `MinhasCompras.jsx`

**Funcionalidades:**
- Lista de todos os pedidos
- Filtro por status
- Detalhes do pedido:
  - Número do pedido
  - Data da compra
  - Produtos
  - Valor total
  - Status atual
- Rastreamento de entrega
- Download de nota fiscal
- Solicitar suporte

**Status possíveis:**
- Pendente, Pago, Processando
- Enviado, Entregue
- Cancelado, Reembolsado

---

### 4. **Rastreamento** (Acessível via pedido)
**Arquivo:** `OrderTracking.jsx`

**Funcionalidades:**
- Timeline de status do pedido
- Código de rastreamento
- Transportadora
- Previsão de entrega
- Histórico de movimentações
- Link para rastreio externo

---

### 5. **Perfil** (`/perfil`)
**Arquivo:** `PerfilPage.jsx`

**Funcionalidades:**
- Dados pessoais:
  - Nome, email, telefone
  - CPF, data de nascimento
- Foto de perfil
- Alterar senha
- Gerenciar endereços
- Métodos de pagamento
- Preferências de notificação
- Deletar conta

---

### 6. **Endereços** (Seção do perfil)
**Arquivo:** `Addresses.jsx`

**Funcionalidades:**
- Lista de endereços cadastrados
- Adicionar novo endereço
- Editar endereço existente
- Excluir endereço
- Definir endereço padrão
- Busca de CEP (ViaCEP)

**Campos:**
- CEP, rua, número, complemento
- Bairro, cidade, estado
- Ponto de referência

---

### 7. **Métodos de Pagamento** (Seção do perfil)
**Arquivo:** `PaymentMethods.jsx`

**Funcionalidades:**
- Cartões cadastrados
- Adicionar novo cartão
- Remover cartão
- Definir cartão padrão
- PIX (geração de QR code)

---

### 8. **Perfil de Aromas** (`/perfil-aromas`)
**Arquivo:** `PerfilAromas.jsx`

**Funcionalidades:**
- Quiz de preferências aromáticas
- Famílias de aromas favoritas
- Intensidade preferida
- Notas favoritas
- Ocasiões de uso
- Aromas para evitar
- Recomendações personalizadas
- Histórico de aromas experimentados

**Famílias aromáticas:**
- Floral, Cítrico, Amadeirado
- Oriental, Verde, Frutado

---

### 9. **Minhas Conquistas** (`/minhas-conquistas`)
**Arquivo:** `MinhasConquistas.jsx`

**Funcionalidades:**
- Grid de conquistas/badges
- Conquistas desbloqueadas
- Conquistas bloqueadas (preview)
- Progresso para próximas conquistas
- Recompensas ganhas
- Ranking de pontos

**Tipos de conquistas:**
- Primeira compra
- 10 boxes recebidas
- Indicou 5 amigos
- Review completo
- Perfil completo

---

### 10. **Indicações** (`/indicacoes`)
**Arquivo:** `Indicacoes.jsx`

**Funcionalidades:**
- **Código de indicação** personalizado
- **Link de compartilhamento**
- **Estatísticas**:
  - Cliques no link
  - Cadastros realizados
  - Conversões (compras)
  - Total ganho
- **Histórico de indicações**
- **Programa de recompensas**:
  - Desconto para indicado
  - Crédito para indicador
  - Tiers de recompensa
- **Compartilhamento social**:
  - WhatsApp, Instagram, Facebook
  - Email, copiar link
  - QR Code

**Recompensas:**
- R$ 20 de desconto para indicado
- R$ 20 de crédito para indicador
- Bônus progressivo (3+, 5+, 10+ indicações)

---

### 11. **Conteúdo Exclusivo** (`/conteudo-exclusivo`)
**Arquivo:** `ConteudoExclusivo.jsx`

**Funcionalidades:**
- Biblioteca de conteúdos premium
- Filtro por tipo:
  - Artigos, Vídeos, Palestras
  - Receitas de aromaterapia
  - Meditações guiadas
- Conteúdo bloqueado por plano
- Preview de conteúdo
- Histórico de visualizações
- Favoritar conteúdo

**Acesso:**
- Assinantes ativos
- Por nível de plano

---

### 12. **Post Exclusivo** (`/conteudo-exclusivo/:slug`)
**Arquivo:** `ExclusiveContentPost.jsx`

**Funcionalidades:**
- Conteúdo completo rico:
  - Texto formatado
  - Imagens, vídeos
  - Playlists Spotify
  - Citações
  - Galerias
- Downloads (PDFs, imagens)
- Comentários exclusivos
- Compartilhar com assinantes

---

### 13. **Notificações** (Modal/Página)
**Arquivo:** `Notifications.jsx`

**Funcionalidades:**
- Lista de notificações
- Categorias:
  - Pedidos, Assinaturas
  - Indicações, Conquistas
  - Promoções, Conteúdo novo
- Marcar como lida
- Excluir notificação
- Configurar preferências

---

### 14. **Wishlist** (Lista de Desejos)
**Arquivo:** `Wishlist.jsx`

**Funcionalidades:**
- Produtos salvos
- Remover da lista
- Mover para carrinho
- Compartilhar lista
- Notificar quando em promoção

---

### 15. **Suporte** (Seção integrada)
**Arquivo:** `Support.jsx`

**Funcionalidades:**
- Histórico de tickets
- Abrir novo ticket
- Chat ao vivo (se ativo)
- FAQ contextual
- Base de conhecimento

---

## 🔐 Painel Administrativo
*Rotas protegidas - requerem `isAdmin: true`*

### Acesso: `/admin/*`
**Arquivo base:** `admin/Admin.jsx`

### Páginas Administrativas (54 arquivos)

#### 1. **Dashboard Admin**
- Métricas gerais
- Vendas do dia/mês
- Novos assinantes
- Pedidos pendentes
- Gráficos de performance

#### 2. **Gestão de Produtos**
**Arquivos:** `ProductsManagement.jsx`, `ProductForm.jsx`, `ProductEdit.jsx`

**Funcionalidades:**
- Lista de todos os produtos
- Criar novo produto
- Editar produto existente
- Deletar produto
- Gerenciar estoque
- Upload de imagens
- SEO (título, descrição, keywords)
- Categorização e tags
- Variações de produto
- Controle de disponibilidade

**Campos:**
- Nome, slug, descrição
- Preço, preço comparativo
- Família aromática, notas
- Ingredientes, tempo de queima
- Dimensões, peso, SKU
- Imagens (múltiplas)

---

#### 3. **Gestão de Boxes**
**Arquivos:** `BoxesManagement.jsx`, `BoxForm.jsx`

**Funcionalidades:**
- Criar box mensal
- Tema e descrição
- Itens incluídos
- Imagens do box
- Playlist do mês
- Dicas de ritual
- Publicar/despublicar
- Histórico de boxes

---

#### 4. **Gestão de Pedidos**
**Arquivos:** `OrdersManagement.jsx`, `OrderDetail.jsx`

**Funcionalidades:**
- Lista de todos os pedidos
- Filtros avançados:
  - Por status, data, cliente
  - Por valor, forma de pagamento
- Detalhes completos do pedido
- Atualizar status:
  - Confirmar pagamento
  - Marcar como enviado
  - Adicionar código de rastreio
  - Marcar como entregue
  - Cancelar/reembolsar
- Notas internas
- Histórico de ações
- Imprimir nota fiscal
- Gerar etiqueta de envio

**Integrações:**
- Melhor Envio (cotação, etiquetas)
- Mercado Pago (status pagamento)

---

#### 5. **Gestão de Assinaturas**
**Arquivos:** `SubscriptionsManagement.jsx`

**Funcionalidades:**
- Lista de assinaturas
- Filtros por status
- Detalhes da assinatura
- Ações manuais:
  - Pausar/reativar
  - Cancelar
  - Alterar próximo envio
  - Modificar endereço
  - Atualizar pagamento
- Histórico de cobranças
- Histórico de entregas
- Notas do cliente

---

#### 6. **Gestão de Clientes**
**Arquivos:** `CustomersManagement.jsx`, `CustomerDetail.jsx`

**Funcionalidades:**
- Lista de clientes
- Busca por nome, email, CPF
- Perfil completo do cliente:
  - Dados pessoais
  - Histórico de compras
  - Assinaturas ativas
  - Indicações realizadas
  - Tickets de suporte
  - Notas internas
- Estatísticas do cliente:
  - LTV (Lifetime Value)
  - Ticket médio
  - Frequência de compra
- Segmentação de clientes

---

#### 7. **Gestão de Planos**
**Arquivos:** `PlansManagement.jsx`, `PlanForm.jsx`

**Funcionalidades:**
- Criar/editar planos
- Definir preço mensal
- Itens incluídos
- Benefícios exclusivos
- Percentual de desconto
- Imagens do plano
- Ativar/desativar plano
- Ordem de exibição

---

#### 8. **Gestão de Cupons**
**Arquivos:** `CouponsManagement.jsx`, `CouponForm.jsx`

**Funcionalidades:**
- Criar cupons de desconto
- Tipos:
  - Percentual
  - Valor fixo
  - Frete grátis
- Configurações:
  - Código do cupom
  - Valor/percentual
  - Compra mínima
  - Valor máximo de desconto
  - Limite de uso total
  - Limite por usuário
  - Data início/fim
  - Usuários específicos
  - Produtos/categorias específicas
- Estatísticas de uso
- Ativar/desativar

---

#### 9. **Gestão de Conteúdo/Blog**
**Arquivos:** `ContentManagement.jsx`, `ContentEditor.jsx`, `ContentVersions.jsx`

**Funcionalidades:**
- Editor de conteúdo rico
- Tipos de conteúdo:
  - Blog post público
  - Conteúdo exclusivo
- Blocos de conteúdo:
  - Texto, Heading
  - Imagem, Galeria
  - Vídeo (YouTube)
  - Áudio (Spotify)
  - Citação, Divisor, Código
- Controle de acesso (planos necessários)
- Agendamento de publicação
- SEO otimizado
- Tags e categorização
- Versionamento de conteúdo
- Preview antes de publicar
- Estatísticas de visualização

---

#### 10. **Gestão de Reviews**
**Arquivos:** `ReviewsManagement.jsx`

**Funcionalidades:**
- Aprovar/reprovar reviews
- Moderar comentários
- Responder reviews
- Reportar reviews
- Estatísticas de reviews
- Reviews pendentes
- Reviews por produto

---

#### 11. **Programa de Indicações**
**Arquivos:** `ReferralsManagement.jsx`, `ReferralProgramManager.jsx`

**Funcionalidades:**
- Configurar programas
- Tipos de recompensa:
  - Fixo, Percentual
  - Recorrente, Híbrido
  - Por tiers
- Regras de ativação:
  - Signup, Primeira compra
  - Compra, Assinatura
- Limites e durações
- Estatísticas globais:
  - Total de indicações
  - Taxa de conversão
  - Valor gerado
- Gerenciar payouts
- Status de conversões
- Mencões em redes sociais

---

#### 12. **Analytics e Relatórios**
**Arquivos:** `AnalyticsDashboard.jsx`, `Reports.jsx`

**Funcionalidades:**
- Dashboard de métricas
- Gráficos interativos:
  - Vendas por período
  - Novos clientes
  - Assinaturas ativas
  - Taxa de churn
  - Produtos mais vendidos
  - Categorias populares
- Relatórios exportáveis:
  - Vendas (CSV, PDF)
  - Clientes
  - Estoque
  - Financeiro
- Filtros personalizados
- Comparação de períodos

---

#### 13. **Configurações do Site**
**Arquivos:** `SiteSettings.jsx`, `PageSettings.jsx`

**Funcionalidades:**
- Configurações gerais:
  - Nome da loja
  - Logo, favicon
  - Cores da marca
  - Redes sociais
- Banners e promoções
- Hero carousel (homepage)
- Newsletter
- Pixels de rastreamento
- Scripts customizados

---

#### 14. **Gestão de Notificações**
**Arquivos:** `NotificationsManagement.jsx`

**Funcionalidades:**
- Enviar notificações em massa
- Notificações segmentadas
- Templates de notificação
- Histórico de envios
- Estatísticas de abertura

---

#### 15. **Upload de Imagens**
**Arquivos:** `UploadManager.jsx`

**Funcionalidades:**
- Upload de imagens/arquivos
- Galeria de mídia
- Organização por pasta
- Redimensionamento automático
- Otimização de imagens
- CDN integration (se configurado)

---

#### 16. **Gestão de Envios**
**Arquivos:** `ShippingManagement.jsx`

**Funcionalidades:**
- Integração Melhor Envio
- Cotação de frete
- Geração de etiquetas
- Rastreamento de entregas
- Regras de frete

---

#### 17. **Logs e Webhooks**
**Arquivos:** `WebhookLogs.jsx`, `SystemLogs.jsx`

**Funcionalidades:**
- Logs de webhooks
- Logs de sistema
- Logs de erros
- Debug de integrações

---

## ⚙️ Funcionalidades Principais

### 1. **Sistema de Autenticação**

**Métodos:**
- Email/Senha com JWT
- Google OAuth 2.0
- Recuperação de senha
- Sessão persistente

**Segurança:**
- Senha hash com bcrypt
- Tokens JWT
- Refresh tokens
- CORS configurado

---

### 2. **Carrinho de Compras**

**Funcionalidades:**
- Adicionar/remover produtos
- Atualizar quantidade
- Persistência (localStorage + backend)
- Sincronização entre dispositivos (usuário logado)
- Validação de estoque
- Aplicação de cupons
- Cálculo de frete

**Context:** `CartContext.jsx`

---

### 3. **Checkout Multi-Step**

**Fluxos:**

**Checkout Produto** (`/checkout-produto`):
1. Endereço de entrega
2. Forma de pagamento
3. Revisão e confirmação

**Checkout Assinatura** (`/checkout`):
1. Seleção de plano
2. Endereço
3. Pagamento
4. Confirmação

**Checkout Presente** (`/presentear`):
- Fluxo especial documentado acima

**Integrações:**
- Mercado Pago (PIX, Cartão, Boleto)
- Parcelamento (até 12x)
- Cálculo automático

---

### 4. **Sistema de Pagamentos**

**Gateway:** Mercado Pago

**Métodos:**
- PIX (instantâneo)
- Cartão de Crédito (parcelado)
- Boleto Bancário

**Funcionalidades:**
- Checkout Pro
- Checkout Transparente
- Assinaturas recorrentes
- Webhooks IPN
- Parcelamento configurável
- Gestão de status

**Status de Pagamento:**
- Pendente → Pago → Processando → Enviado → Entregue
- Falha → Cancelado → Reembolsado

---

### 5. **Sistema de Assinaturas**

**Modelo:**
- Renovação automática mensal
- Múltiplos planos
- Pause/resume
- Cancelamento

**Gerenciamento:**
- Cliente: pausar, cancelar, trocar plano
- Admin: gerenciar manualmente

**Webhooks:**
- Cobrança bem-sucedida
- Falha de pagamento
- Cancelamento

---

### 6. **Programa de Indicações**

**Tipos de Programa:**
- Fixo (valor fixo por conversão)
- Percentual (% sobre compra)
- Recorrente (% mensal sobre assinatura)
- Híbrido
- Por tiers (recompensas crescentes)

**Rastreamento:**
- Cliques no link
- Cadastros (signups)
- Conversões (compras)
- Redes sociais (mentions)

**Payouts:**
- PIX, Transferência bancária
- Créditos na loja
- Cupons de desconto

**Models:** `ReferralProgram`, `ReferralCode`, `ReferralClick`, `ReferralConversion`, `ReferralPayout`

---

### 7. **Sistema de Presentes** 🎁

**Fluxo Completo:**
1. Seleção de plano e duração
2. Dados do presenteador
3. Dados e endereço do presenteado
4. Mensagem personalizada
5. Produtos extras (opcional)
6. Pagamento
7. **Email automático com cartão digital**
8. Ativação da assinatura

**Email:**
- Template HTML responsivo
- Cartão digital animado
- Mensagem do presenteador
- Detalhes do presente
- CTA para acessar

**Agendamento:**
- Envio imediato ou agendado
- Webhook automático após pagamento

---

### 8. **CMS de Conteúdo**

**Tipos:**
- Blog posts públicos
- Conteúdo exclusivo para assinantes

**Editor:**
- Blocos modulares
- Rich media (images, videos, Spotify)
- Versionamento
- Preview
- Agendamento

**Models:** `Content`, `ContentBlock`, `ContentVersion`

---

### 9. **Sistema de Notificações**

**Canais:**
- In-app (notificações na plataforma)
- Email (nodemailer)
- Push (futuro)

**Tipos:**
- Pedido confirmado
- Pedido enviado
- Assinatura renovada
- Nova conquista
- Indicação convertida
- Novo conteúdo disponível

---

### 10. **Busca e Filtros**

**Produtos:**
- Busca por nome/descrição
- Filtro por categoria
- Filtro por faixa de preço
- Filtro por família aromática
- Ordenação (preço, nome, popularidade)

**Conteúdo:**
- Busca por título
- Filtro por categoria/tags
- Filtro por tipo

---

## 🔌 Integrações

### 1. **Mercado Pago**
**Serviço:** `mercadopago.service.js`

- Checkout Pro (redirect)
- Checkout Transparente
- Assinaturas (PreApproval)
- Webhooks IPN
- Installments (parcelamento)

### 2. **Melhor Envio**
**Serviço:** `melhorenvio.controller.js`

- Cotação de frete
- Geração de etiquetas
- Rastreamento

### 3. **ViaCEP**
- Consulta de CEP
- Preenchimento automático de endereço

### 4. **Google OAuth**
**Config:** `googleAuth.js`

- Login social
- Cadastro simplificado

### 5. **Email (Nodemailer)**
**Serviço:** `email.service.js`

- SMTP Gmail
- Templates HTML
- Notificações transacionais

---

## ⚠️ Pendências e Melhorias

### 🔴 PENDÊNCIAS CRÍTICAS

#### 1. **Email de Presentes**
**Status:** ⚠️ **Implementado, mas precisa configuração SMTP**

**Pendente:**
- Configurar credenciais SMTP no `.env`:
```env
SMTP_USER=email@gmail.com
SMTP_PASS=senha-de-app-google
```

**Como fazer:**
1. Acessar [myaccount.google.com/security](https://myaccount.google.com/security)
2. Ativar verificação em 2 etapas
3. Gerar "Senha de app"
4. Usar senha de app no `.env`

---

#### 2. **Envio de Boxes (Assinatura)**
**Status:** 🔴 **NÃO IMPLEMENTADO**

**Necessário:**
- Job queue para processar entregas mensais
- Lógica para criar pedidos automaticamente
- Integração com estoque
- Notificação ao cliente

**Sugestão:**
- Usar Bull Queue ou Agenda.js
- Cron job diário verificando `nextBilling` das assinaturas
- Criar Order automaticamente
- Gerar etiqueta via Melhor Envio

---

#### 3. **Gestão de Estoque Robusto**
**Status:** ⚠️ **BÁSICO** 

**Pendente:**
- Reserva de estoque no carrinho (tempo limitado)
- Notificação de estoque baixo (admin)
- Histórico de movimentação de estoque
- Inventário físico vs sistema
- Alerta "produto voltou ao estoque"

---

#### 4. **Sistema de Reviews**
**Status:** ⚠️ **PARCIAL**

**Implementado:**
- Model Review
- Aprovação manual (admin)
- Exibição em produtos

**Pendente:**
- Upload de fotos em reviews
- Helpful counter (útil/não útil)
- Resposta da loja
- Filtro de reviews
- Verificação de compra

---

#### 5. **Rastreamento Completo**
**Status:** ⚠️ **BÁSICO**

**Implementado:**
- Salvar código de rastreio
- Exibir para cliente

**Pendente:**
- Webhook de atualizações da transportadora
- Notificação por SMS/Email de mudança de status
- Integração completa Melhor Envio
- Mapa de rastreamento

---

### 🟡 MELHORIAS IMPORTANTES

#### 1. **Performance**

**Frontend:**
- [ ] Implementar SSR com Next.js
- [ ] Code splitting mais agressivo
- [ ] Lazy load de imagens (blur placeholder)
- [ ] PWA (Service Workers)
- [ ] Caching otimizado

**Backend:**
- [ ] Redis para caching
- [ ] Query optimization (N+1 problems)
- [ ] CDN para static assets
- [ ] Database indexing review
- [ ] Rate limiting

---

#### 2. **SEO e Marketing**

- [ ] Meta tags dinâmicas por página
- [ ] Sitemap.xml automático
- [ ] Schema.org markup (produtos, reviews)
- [ ] Open Graph completo
- [ ] Google Analytics 4
- [ ] Facebook Pixel
- [ ] Google Tag Manager
- [ ] Blog com conteúdo SEO-friendly

---

#### 3. **Mobile App**

**Sugestão:** React Native ou Flutter

**Funcionalidades:**
- Mesmo catálogo e features
- Notificações push
- Biometria para login
- Offline mode parcial
- Deep linking

---

#### 4. **Checkout**

**Melhorias:**
- [ ] Checkout em 1 página (opcional)
- [ ] Salvar cartão (tokenização segura)
- [ ] Checkout como visitante
- [ ] Amazon Pay / Apple Pay
- [ ] Pagar com créditos de indicação
- [ ] Estimativa de entrega na hora

---

#### 5. **Gamificação**

**Expandir Sistema de Conquistas:**
- [ ] Mais badges e níveis
- [ ] Leaderboard mensal
- [ ] Desafios semanais
- [ ] Recompensas exclusivas
- [ ] Sistema de XP
- [ ] Títulos e emblemas
- [ ] Conquistas sociais

---

#### 6. **Personalização**

**Recomendações:**
- [ ] IA/ML para recomendação de produtos
- [ ] "Clientes que compraram também..."
- [ ] Email marketing segmentado
- [ ] Descontos personalizados
- [ ] Baseado no perfil de aromas

**Quiz Aromático:**
- [ ] Mais detalhes no quiz
- [ ] Recomendação de produtos
- [ ] Sugestão de planos

---

#### 7. **Comunidade**

- [ ] Fórum de usuários
- [ ] Grupos de discussão
- [ ] Receitas compartilhadas
- [ ] Reviews com fotos
- [ ] Instagram feed integrado
- [ ] UGC (User Generated Content)

---

#### 8. **Admin Dashboard**

**Melhorias:**
- [ ] Gráficos mais detalhados
- [ ] Exportação de relatórios
- [ ] Ações em massa (bulk actions)
- [ ] Templates de email customizáveis
- [ ] Backup automático
- [ ] Auditoria de ações (activity log)
- [ ] Multi-idioma
- [ ] Multi-moeda

---

#### 9. **Automações**

- [ ] Email marketing automatizado:
  - Carrinho abandonado
  - Reengajamento
  - Win-back campaigns
  - Aniversário
- [ ] Chatbot básico
- [ ] Respostas automáticas FAQ
- [ ] Renovação de assinatura com lembrete

---

#### 10. **Integrações Adicionais**

**CRM:**
- [ ] RD Station
- [ ] HubSpot
- [ ] ActiveCampaign

**Logística:**
- [ ] Correios
- [ ] Loggi
- [ ] Outras transportadoras

**Pagamento:**
- [ ] PagSeguro (alternativa)
- [ ] PayPal
- [ ] Pix Parcelado

**Analytics:**
- [ ] Hotjar (heatmaps)
- [ ] Mixpanel
- [ ] Amplitude

---

### 🟢 MELHORIAS FUTURAS (Nice to Have)

#### 1. **Marketplace**
- Permitir artesãos parceiros venderem
- Comissão por venda
- Curadoria de produtos

#### 2. **Assinatura Flex**
- Cliente monta sua box
- Escolhe produtos todo mês
- Frequência flexível

#### 3. **Gift Cards**
- Venda de vale-presente
- Saldo em conta
- Presentear com voucher

#### 4. **Workshops e Eventos**
- Venda de ingressos
- Workshops online
- Eventos presenciais

#### 5. **Atacado/B2B**
- Portal para revendedores
- Preços diferenciados
- Pedido mínimo

#### 6. **Internacionalização**
- Multi-idioma
- Multi-moeda
- Envio internacional

---

## 📊 Resumo Técnico

### Páginas Totais: ~54
- Públicas: 12
- Usuário: 15
- Admin: 27+

### API Endpoints: ~32 rotas principais
- Auth, Products, Orders, Subscriptions
- Cart, Payment, Plans, Gifts
- Referrals, Content, Reviews
- Analytics, Upload, Shipping

### Models Prisma: 34 tabelas
- Usuários e Auth
- E-commerce (produtos, pedidos, cart)
- Assinaturas e Planos
- Indicações (6 models)
- CMS e Conteúdo (3 models)
- Analytics e Logs

### Integrações: 5
- Mercado Pago
- Melhor Envio
- Google OAuth
- ViaCEP
- Nodemailer (SMTP)

---

## 🚀 Roadmap Sugerido

### Q1 2026
1. ✅ Sistema de presentes (CONCLUÍDO)
2. Configurar SMTP e testar emails
3. Implementar envio automático de boxes
4. Melhorar sistema de reviews
5. Otimizações de performance

### Q2 2026
1. Gamificação expandida
2. Recomendações inteligentes
3. Checkout otimizado
4. PWA / Mobile app MVP

### Q3 2026
1. Marketplace de artesãos
2. Workshops online
3. Comunidade e fórum

### Q4 2026
1. Internacionalização
2. B2B/Atacado
3. Expansões baseadas em dados

---

## 📞 Suporte Técnico

**Documentação**: Este arquivo  
**Repositório**: Github (privado)  
**Stack**: React + Node.js + PostgreSQL  
**Deploy**: [A definir]  

---

**Documento criado em:** 29/11/2025  
**Versão:** 1.0  
**Autor:** Documentação Técnica Marc Aromas  

---

*Este documento deve ser atualizado conforme novas funcionalidades são implementadas ou modificadas.*
