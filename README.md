# marcaromas
Plataforma Ecomerce da Marc

Plataforma de E-commerce da Marc Aromas.

## Sobre o Projeto

Este projeto é uma aplicação full-stack para uma loja virtual, construída com as seguintes tecnologias:

- **Backend**: Node.js, Express, Prisma, PostgreSQL.
- **Frontend**: React, Vite (inferido).
- **Pagamentos**: Integração com Mercado Pago e Stripe.
- **Containerização**: Docker e Docker Compose.

## Como Rodar (Desenvolvimento)

1.  **Clone o repositório:**
    ```bash
    git clone <url-do-repositorio>
    cd marcaromas/backend
    ```

2.  **Crie o arquivo de ambiente:**
    Copie o arquivo `.env.example` para `.env` e preencha as variáveis de ambiente necessárias.

3.  **Inicie os contêineres Docker:**
    ```bash
    docker-compose up --build
    ```

4.  A API estará disponível em `http://localhost:5000`.
