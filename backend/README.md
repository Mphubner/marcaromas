# Marc Aromas - Backend (Parte 3)

Requisitos:
- Node 18+ / npm
- Docker (opcional)
- PostgreSQL (opcional, usado via docker-compose)

1) Copie .env.example para .env e preencha variáveis (DATABASE_URL, MERCADOPAGO_ACCESS_TOKEN, JWT_SECRET)

2) Instalar dependências:
   npm install

3) Gerar client Prisma e rodar migration:
   npx prisma generate
   npx prisma migrate dev --name init

4) Rodar em dev:
   npm run dev
   -> servidor em http://localhost:5000

5) Teste endpoints:
   GET http://localhost:5000/api/products
   POST http://localhost:5000/api/payments/start  (body: { items: [{ name, price, quantity }] })

6) Rodando com Docker:
   docker compose up --build

7) Webhook Mercado Pago:
   - Acesse painel Mercado Pago e registre o endpoint:
     https://<sua-url>/api/payments/webhook
   - Em produção, use Render/NGROK para testar inicialmente e valide eventos conforme docs do Mercado Pago.
