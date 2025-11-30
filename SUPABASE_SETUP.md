# 🗄️ Guia de Configuração Supabase

## 📋 Sobre

O Supabase fornece um banco de dados PostgreSQL totalmente gerenciado com recursos adicionais como autenticação, armazenamento e APIs em tempo real. Este guia mostra como conectar sua aplicação Marc Aromas ao Supabase.

## 🚀 Passo a Passo

### 1. Criar Projeto no Supabase

1. Acesse [Supabase](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Preencha:
   - **Name**: Marc Aromas (ou outro nome)
   - **Database Password**: Crie uma senha FORTE e **GUARDE-A**
   - **Region**: Escolha a mais próxima (ex: South America (São Paulo))
   - **Pricing Plan**: Free (ou Pro se necessário)
5. Clique em "Create new project"
6. Aguarde ~2 minutos para o projeto ser criado

### 2. Obter Credenciais

Na dashboard do seu projeto Supabase:

#### A) Connection Strings (Database)

1. Vá em **Settings** (⚙️) > **Database**
2. Role até **Connection string**
3. Selecione **URI** no dropdown

Você verá algo assim:
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Copie esta URL** - será sua `DATABASE_URL`

4. Role um pouco mais e encontre **Connection pooling**
5. Copie também a **Direct connection** (porta 5432):
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**Copie esta URL** - será sua `DIRECT_URL`

#### B) API Keys

1. Vá em **Settings** (⚙️) > **API**
2. Você verá:
   - **Project URL**: `https://[PROJECT-REF].supabase.co`
   - **anon public**: Uma chave longa começando com `eyJ...`
   - **service_role secret**: Outra chave longa (⚠️ SECRETA)

3. Copie estas 3 informações

### 3. Configurar Backend (.env)

No arquivo `backend/.env` (crie se não existir, copie do `.env.example`):

```env
# Database - Supabase PostgreSQL
DATABASE_URL="postgresql://postgres.abcdefg:[SUA-SENHA]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.abcdefg:[SUA-SENHA]@db.abcdefg.supabase.co:5432/postgres"

# Supabase API
SUPABASE_URL="https://abcdefg.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Substitua**:
- `[SUA-SENHA]`: A senha que você criou no passo 1
- `abcdefg`: Seu PROJECT-REF
- As chaves anon e service_role pelas suas

### 4. Rodar Migrações

Com as credenciais configuradas, rode as migrations para criar as tabelas:

```bash
cd backend

# Aplicar todas as migrations
npx prisma migrate deploy

# OU se quiser criar nova migration
npx prisma migrate dev

# Gerar o Prisma Client
npx prisma generate
```

### 5. (Opcional) Popular Banco com Dados

Se você tiver um seed script:

```bash
npx prisma db seed
```

### 6. Testar Conexão

Inicie o backend:

```bash
npm run dev
```

Se conectou com sucesso, você verá:
```
✓ Database connected successfully
Server running on http://localhost:5001
```

## 🔍 Verificar no Supabase

1. Vá para a dashboard do Supabase
2. Clique em **Table Editor** (🗂️)
3. Você deve ver todas as suas tabelas criadas!

## ⚙️ Configurações Importantes

### Connection Pooling

O Supabase usa **PgBouncer** em modo transaction por padrão:

- ✅ **Usar pooling** (porta 6543) para a aplicação (`DATABASE_URL`)
- ✅ **Usar direct** (porta 5432) para migrations (`DIRECT_URL`)

### Limites

**Free Plan**:
- 500 MB de banco de dados
- 2 GB de bandwidth
- 50.000 autenticações/mês
- Pausa após 1 semana de inatividade

**Pro Plan** ($25/mês):
- 8 GB de banco
- 250 GB de bandwidth
- 100.000 autenticações/mês
- Sem pausa de inatividade

## 🛡️ Segurança

### ⚠️ IMPORTANTE

1. **NUNCA** commite o arquivo `.env` com credenciais reais
2. **NUNCA** compartilhe sua `SERVICE_ROLE_KEY` (ela tem acesso total)
3. Use `ANON_KEY` no frontend (é segura para expor)
4. Use `SERVICE_ROLE_KEY` apenas no backend

### Row Level Security (RLS)

O Supabase tem RLS (Row Level Security) ativado. Como estamos usando Prisma, você pode:

**Opção 1**: Desabilitar RLS (mais simples)
```sql
-- No SQL Editor do Supabase
ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" DISABLE ROW LEVEL SECURITY;
-- Repita para todas as tabelas
```

**Opção 2**: Configurar políticas RLS (mais seguro)
- Crie policies no Supabase para cada tabela
- Use a SERVICE_ROLE_KEY no backend (bypassa RLS)

## 🔧 Troubleshooting

### Erro: "Password authentication failed"

- Verifique se a senha no `.env` está correta
- A senha pode conter caracteres especiais que precisam ser URL-encoded

### Erro: "Connection timeout"

- Verifique se a região está correta na URL
- Teste a conexão no SQL Editor do Supabase primeiro

### Prisma não reconhece DIRECT_URL

- Certifique-se que o `schema.prisma` tem:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### Erro ao fazer migration

- Use `DIRECT_URL` (porta 5432) ao invés da pooled
- Certifique-se que está usando `npx prisma migrate deploy`

## 📊 Monitoramento

No Supabase Dashboard:

- **Database** > **Database Health**: Ver uso de CPU, memória, conexões
- **Logs**: Ver queries em tempo real
- **Reports**: Analytics de uso

## 🚀 Produção

Para deploy em produção:

1. Configure as mesmas variáveis de ambiente no seu host (Vercel, Railway, etc)
2. Use a connection string de **produção** (não a local)
3. Considere upgrade para Pro plan se tiver tráfego alto

## 📚 Recursos

- [Supabase Docs](https://supabase.com/docs)
- [Prisma + Supabase](https://www.prisma.io/docs/guides/database/supabase)
- [Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)

---

**Pronto!** Seu Marc Aromas agora está rodando com Supabase! 🎉
