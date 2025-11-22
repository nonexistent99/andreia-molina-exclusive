# 📋 Análise Completa do Código - Andreia Molina Exclusive

**Data da Análise:** 22 de novembro de 2025  
**Projeto:** Andreia Molina - Plataforma de Conteúdo Exclusivo  
**Tecnologias:** React + TypeScript + Express + MySQL + Drizzle ORM

---

## ✅ Resumo Executivo

O projeto está **funcional e bem estruturado**, com arquitetura full-stack moderna. A aplicação é uma plataforma de e-commerce para venda de conteúdo digital exclusivo com pagamento via PIX (integração LXPay) e envio de emails transacionais (integração Brevo).

### Status Geral: ✅ APROVADO

**Pontos Fortes:**
- Arquitetura bem organizada (client/server/shared)
- TypeScript em todo o código
- ORM moderno (Drizzle) com migrações versionadas
- Integração completa com APIs externas (Brevo, LXPay)
- Sistema de autenticação admin implementado
- Gerenciamento de produtos e order bumps
- Sistema de download com links temporários e limitados
- Scripts de deploy automatizados

**Pontos de Atenção Identificados:**
1. ⚠️ Configuração do Easypanel precisa ser criada
2. ⚠️ Variáveis de ambiente precisam ser ajustadas para produção
3. ⚠️ Alguns ajustes necessários no código para compatibilidade com Easypanel
4. ⚠️ Email sender precisa ser configurado com domínio verificado no Brevo

---

## 🏗️ Arquitetura do Projeto

### Estrutura de Diretórios

```
andreia-molina-exclusive/
├── client/                 # Frontend React
│   ├── public/            # Arquivos estáticos
│   └── src/
│       ├── components/    # Componentes reutilizáveis
│       ├── pages/         # Páginas da aplicação
│       ├── hooks/         # Custom hooks
│       ├── contexts/      # Context providers
│       └── lib/           # Utilitários
├── server/                # Backend Express
│   ├── _core/            # Núcleo do servidor
│   ├── routers.ts        # Rotas tRPC
│   ├── admin-*.ts        # Rotas de administração
│   ├── brevo.ts          # Integração Brevo
│   ├── lxpay.ts          # Integração LXPay
│   ├── db.ts             # Funções de banco de dados
│   └── webhook.ts        # Webhook handler
├── drizzle/              # Schema e migrações do banco
├── shared/               # Código compartilhado
└── scripts de deploy
```

### Stack Tecnológico

**Frontend:**
- React 19.1.1
- TypeScript 5.9.3
- Wouter (roteamento)
- TanStack Query (gerenciamento de estado)
- tRPC (comunicação type-safe com backend)
- Tailwind CSS 4.1.14
- Radix UI (componentes)
- Framer Motion (animações)

**Backend:**
- Node.js 22.x
- Express 4.21.2
- TypeScript
- tRPC 11.6.0
- Drizzle ORM 0.44.5
- MySQL2 3.15.0
- Axios (HTTP client)
- bcryptjs (hash de senhas)
- jsonwebtoken (autenticação)

**Build & Deploy:**
- Vite 7.1.7
- esbuild 0.25.0
- pnpm 10.15.1
- PM2 (gerenciamento de processos)

---

## 🔍 Análise Detalhada por Módulo

### 1. Backend (Server)

#### ✅ server/_core/index.ts
**Status:** Funcional  
**Descrição:** Servidor Express principal com configuração completa

**Funcionalidades:**
- Configuração de middlewares (body-parser, cookie-parser)
- Registro de rotas OAuth, admin, webhooks, tRPC
- Suporte para desenvolvimento (Vite) e produção (arquivos estáticos)
- Detecção automática de porta disponível
- Limite de 50MB para uploads

**Código-chave:**
```typescript
const preferredPort = parseInt(process.env.PORT || "3000");
const port = await findAvailablePort(preferredPort);
```

#### ✅ server/db.ts
**Status:** Funcional  
**Descrição:** Camada de acesso a dados com funções CRUD

**Funcionalidades implementadas:**
- Gestão de usuários (upsert, busca por openId)
- Gestão de produtos (CRUD completo)
- Gestão de pedidos (criação, busca, atualização de status)
- Transações de pagamento (integração com LXPay)
- Links de download (criação, validação, controle de acessos)
- Logs de email (rastreamento de envios)

**Conexão com banco:**
```typescript
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
```

#### ✅ server/routers.ts
**Status:** Funcional  
**Descrição:** Rotas tRPC com lógica de negócio

**Endpoints principais:**
- `auth.me` - Obter usuário atual
- `auth.logout` - Fazer logout
- `products.list` - Listar produtos ativos
- `products.getById` - Buscar produto por ID
- `products.getOrderBump` - Buscar order bump do produto
- `orders.create` - Criar pedido (com envio de email)
- `orders.getByNumber` - Buscar pedido por número
- `payment.createPixCharge` - Criar cobrança PIX
- `payment.checkStatus` - Verificar status do pagamento
- `downloads.validate` - Validar link de download
- `downloads.download` - Realizar download (incrementa contador)

**Fluxo de compra implementado:**
1. Cliente cria pedido → Email de confirmação enviado
2. Sistema gera cobrança PIX via LXPay
3. Webhook recebe confirmação de pagamento
4. Sistema gera link de download temporário
5. Email com link de download é enviado ao cliente

#### ✅ server/brevo.ts
**Status:** Funcional (precisa configurar email sender)  
**Descrição:** Integração com Brevo para envio de emails transacionais

**Funcionalidades:**
- Envio de emails via API Brevo
- Template de confirmação de pedido
- Template de link de download

**⚠️ Atenção:**
```typescript
sender: {
  name: "Andreia Molina Exclusive",
  email: "noreply@andreiamolina.com", // Precisa ser verificado no Brevo
}
```

#### ✅ server/lxpay.ts
**Status:** Funcional (precisa configurar credenciais)  
**Descrição:** Integração com LXPay para pagamentos PIX

**Funcionalidades:**
- Criação de cobrança PIX
- Verificação de status de pagamento
- Processamento de webhooks

**API Endpoint:** `https://api.lxpay.com.br/api/v1/gateway/pix/receive`

**⚠️ Observação:** O valor é enviado em centavos no banco, mas a API LXPay espera em reais. Verificar conversão:
```typescript
// No routers.ts, linha 212:
amount: order.amountInCents, // ⚠️ Pode precisar dividir por 100
```

#### ✅ server/admin-auth.ts & admin-routes.ts
**Status:** Funcional  
**Descrição:** Sistema de autenticação para área administrativa

**Funcionalidades:**
- Login com username/password
- Hash de senhas com bcryptjs
- Geração de JWT
- Middleware de autenticação

#### ✅ server/model-crud-routes.ts & model-public-routes.ts
**Status:** Funcional  
**Descrição:** Gestão de modelos (múltiplas páginas de vendas)

**Funcionalidades:**
- CRUD de modelos
- Associação de produtos a modelos
- Customização de cores e imagens por modelo
- Rotas públicas para exibição

#### ✅ server/product-crud-routes.ts
**Status:** Funcional  
**Descrição:** Gestão de produtos

**Funcionalidades:**
- CRUD completo de produtos
- Upload de imagens
- Associação com order bumps
- Controle de produtos ativos/inativos

#### ✅ server/orderbump-routes.ts
**Status:** Funcional  
**Descrição:** Gestão de order bumps (ofertas adicionais no checkout)

**Funcionalidades:**
- CRUD de order bumps
- Associação com modelos específicos ou global
- Ordenação customizada

---

### 2. Frontend (Client)

#### ✅ client/src/App.tsx
**Status:** Funcional  
**Descrição:** Componente raiz com roteamento

**Rotas implementadas:**
- `/` - Home
- `/checkout/:productId` - Checkout
- `/payment/:orderNumber` - Pagamento PIX
- `/success/:orderNumber` - Página de sucesso
- `/download/:token` - Download de conteúdo
- `/admin/*` - Área administrativa
- `/modelo/:slug` - Página de modelo específico

#### ✅ Páginas Principais

**Home:** Listagem de produtos em destaque  
**Checkout:** Formulário de dados do cliente  
**Payment:** Exibição de QR Code PIX e código copia-cola  
**Success:** Confirmação de compra  
**Download:** Validação e download de conteúdo  
**AdminDashboard:** Painel administrativo  
**ModelPage:** Página customizada por modelo

---

### 3. Banco de Dados (Drizzle)

#### ✅ drizzle/schema.ts
**Status:** Funcional  
**Descrição:** Schema completo do banco de dados

**Tabelas implementadas:**

1. **users** - Usuários autenticados
   - Campos: id, openId, name, email, loginMethod, role, timestamps

2. **products** - Produtos/Pacotes
   - Campos: id, name, description, priceInCents, originalPriceInCents, imageUrl, features, isFeatured, isActive, orderBumpId, accessLink, downloadUrl, fileKey, timestamps

3. **orders** - Pedidos
   - Campos: id, orderNumber, productId, orderBumpId, customerName, customerEmail, customerPhone, customerDocument, amountInCents, status, paymentMethod, timestamps, paidAt

4. **paymentTransactions** - Transações de pagamento
   - Campos: id, orderId, transactionId, pixCode, pixQrCode, status, amountInCents, expiresAt, webhookData, timestamps

5. **downloadLinks** - Links de download temporários
   - Campos: id, orderId, token, productId, expiresAt, downloadCount, maxDownloads, isActive, timestamps, lastAccessedAt

6. **emailLogs** - Logs de emails enviados
   - Campos: id, orderId, recipientEmail, emailType, status, brevoMessageId, errorMessage, createdAt

7. **admins** - Administradores
   - Campos: id, username, password, createdAt, lastLoginAt

8. **models** - Modelos (múltiplas páginas)
   - Campos: id, name, slug, title, subtitle, description, primaryColor, secondaryColor, accentColor, heroImageUrl, aboutImageUrl, instagramUrl, isActive, timestamps

9. **modelProducts** - Produtos por modelo
   - Campos: id, modelId, productId, displayOrder, customPrice, customName, customDescription, createdAt

10. **orderBumps** - Order bumps
    - Campos: id, name, description, priceInCents, originalPriceInCents, imageUrl, accessLink, deliveryDescription, modelId, isActive, displayOrder, timestamps

**Migrações:** 14 migrações aplicadas (0000 a 0013)

---

### 4. Configuração e Deploy

#### ✅ package.json
**Status:** Funcional  
**Scripts disponíveis:**
```json
{
  "dev": "NODE_ENV=development tsx watch server/_core/index.ts",
  "build": "vite build && esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
  "start": "NODE_ENV=production node dist/index.js",
  "check": "tsc --noEmit",
  "db:push": "drizzle-kit generate && drizzle-kit migrate"
}
```

#### ✅ vite.config.ts
**Status:** Funcional  
**Configuração:**
- Build output: `dist/public`
- Aliases configurados (@, @shared, @assets)
- Servidor configurado para aceitar hosts externos

#### ✅ drizzle.config.ts
**Status:** Funcional  
**Configuração:**
- Dialeto: MySQL
- Schema: `./drizzle/schema.ts`
- Output: `./drizzle`
- Credenciais: `DATABASE_URL` do .env

#### ✅ ecosystem.config.js
**Status:** Funcional (para PM2)  
**Configuração:**
- Nome: `andreia-molina-exclusive`
- Script: `server/_core/index.ts`
- Interpreter: `node --import tsx`
- Instâncias: 1
- Auto-restart: true
- Logs: `./logs/`

#### ✅ deploy.sh
**Status:** Funcional (para VPS tradicional)  
**Etapas:**
1. Instalar dependências (`pnpm install --frozen-lockfile`)
2. Build (`pnpm run build`)
3. Migrações (`pnpm db:push`)
4. Parar aplicação anterior
5. Iniciar com PM2
6. Salvar configuração PM2

---

## 🐛 Problemas Identificados e Correções Necessárias

### 1. ⚠️ Conversão de Valores para LXPay

**Problema:** O banco armazena valores em centavos, mas a API LXPay pode esperar em reais.

**Localização:** `server/routers.ts`, linha 212

**Código atual:**
```typescript
const pixCharge = await lxpay.createPixCharge({
  amount: order.amountInCents, // ⚠️ Pode estar errado
  // ...
});
```

**Correção necessária:**
```typescript
const pixCharge = await lxpay.createPixCharge({
  amount: order.amountInCents / 100, // Converter para reais
  // ...
});
```

### 2. ⚠️ Email Sender não Verificado

**Problema:** O email sender precisa ser verificado no Brevo.

**Localização:** `server/brevo.ts`, linha 34-36

**Ação necessária:**
1. Verificar domínio no painel Brevo
2. Atualizar email sender para um email verificado
3. Ou usar email fornecido pelo Brevo

### 3. ⚠️ Configuração do Easypanel

**Problema:** O projeto está configurado para deploy tradicional com PM2, mas você quer usar Easypanel.

**Solução:** Criar arquivo `Dockerfile` e `docker-compose.yml` para Easypanel.

### 4. ⚠️ Variáveis de Ambiente

**Problema:** Arquivo `.env.production.example` tem placeholders que precisam ser preenchidos.

**Variáveis obrigatórias:**
- `DATABASE_URL` - String de conexão MySQL
- `BREVO_API_KEY` - Chave API Brevo
- `LXPAY_API_KEY` - Chave pública LXPay
- `LXPAY_API_SECRET` - Chave secreta LXPay
- `JWT_SECRET` - Senha forte aleatória
- `VITE_APP_URL` - URL do site em produção

---

## 🔧 Correções Aplicadas

Vou agora aplicar as correções necessárias para garantir que o código funcione perfeitamente.
