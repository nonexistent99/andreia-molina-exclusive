# 💎 Andreia Molina - Plataforma de Conteúdo Exclusivo

Plataforma de e-commerce para venda de conteúdo digital exclusivo com pagamento via PIX e entrega automatizada por email.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-22.x-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 🚀 Funcionalidades

### Para Clientes
- ✅ Navegação de produtos com design moderno e responsivo
- ✅ Checkout simplificado com formulário otimizado
- ✅ Pagamento via PIX com QR Code e código copia-cola
- ✅ Confirmação de pagamento em tempo real
- ✅ Recebimento automático de link de download por email
- ✅ Download seguro com links temporários e limitados
- ✅ Suporte a Order Bumps (ofertas adicionais no checkout)

### Para Administradores
- ✅ Painel administrativo completo
- ✅ Gestão de produtos (CRUD completo)
- ✅ Gestão de modelos (múltiplas páginas de vendas)
- ✅ Gestão de order bumps
- ✅ Upload de imagens e arquivos
- ✅ Customização de cores e layout por modelo
- ✅ Visualização de pedidos e transações

### Integrações
- ✅ **LXPay** - Pagamentos PIX
- ✅ **Brevo** - Envio de emails transacionais
- ✅ **AWS S3** - Armazenamento de arquivos (opcional)

---

## 🛠️ Tecnologias

### Frontend
- **React** 19.1.1 - Biblioteca UI
- **TypeScript** 5.9.3 - Tipagem estática
- **Vite** 7.1.7 - Build tool
- **Tailwind CSS** 4.1.14 - Estilização
- **Radix UI** - Componentes acessíveis
- **Framer Motion** - Animações
- **TanStack Query** - Gerenciamento de estado
- **tRPC** - API type-safe

### Backend
- **Node.js** 22.x - Runtime
- **Express** 4.21.2 - Framework web
- **TypeScript** - Tipagem estática
- **Drizzle ORM** 0.44.5 - ORM
- **MySQL** 8.0 - Banco de dados
- **tRPC** 11.6.0 - API type-safe
- **JWT** - Autenticação

### DevOps
- **Docker** - Containerização
- **Easypanel** - Deploy e gerenciamento
- **pnpm** - Gerenciador de pacotes
- **GitHub** - Controle de versão

---

## 📋 Pré-requisitos

- Node.js 22.x ou superior
- pnpm 10.x ou superior
- MySQL 8.0 ou superior
- Conta Brevo (para emails)
- Conta LXPay (para pagamentos)

---

## 🚀 Deploy

### Opção 1: Easypanel (Recomendado)

Para deploy no Easypanel (Hostinger VPS), siga o guia completo:

📖 **[DEPLOY_EASYPANEL.md](./DEPLOY_EASYPANEL.md)**

### Opção 2: VPS Tradicional

Para deploy em VPS tradicional com PM2, siga o guia:

📖 **[GUIA-DEPLOY-HOSTINGER.md](./GUIA-DEPLOY-HOSTINGER.md)**

---

## 💻 Desenvolvimento Local

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/andreia-molina-exclusive.git
cd andreia-molina-exclusive
```

### 2. Instalar Dependências

```bash
pnpm install
```

### 3. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e preencha com seus dados:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais.

### 4. Configurar Banco de Dados

Crie um banco MySQL local:

```sql
CREATE DATABASE andreia_molina CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Aplique as migrações:

```bash
pnpm db:push
```

### 5. Iniciar Servidor de Desenvolvimento

```bash
pnpm dev
```

O servidor estará disponível em `http://localhost:3000`

---

## 📁 Estrutura do Projeto

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
│   ├── schema.ts         # Definição das tabelas
│   └── migrations/       # Arquivos de migração
├── shared/               # Código compartilhado
├── Dockerfile            # Configuração Docker
├── docker-compose.yml    # Compose para dev local
└── package.json          # Dependências e scripts
```

---

## 🗄️ Banco de Dados

### Tabelas Principais

- **users** - Usuários autenticados
- **products** - Produtos/Pacotes
- **orders** - Pedidos
- **paymentTransactions** - Transações de pagamento
- **downloadLinks** - Links de download temporários
- **emailLogs** - Logs de emails enviados
- **admins** - Administradores
- **models** - Modelos (múltiplas páginas)
- **modelProducts** - Produtos por modelo
- **orderBumps** - Order bumps

### Migrações

As migrações são gerenciadas pelo Drizzle Kit. Para aplicar:

```bash
pnpm db:push
```

---

## 🔐 Segurança

- ✅ Senhas hasheadas com bcrypt
- ✅ JWT para autenticação
- ✅ Variáveis de ambiente para credenciais
- ✅ HTTPS obrigatório em produção
- ✅ Validação de inputs com Zod
- ✅ Links de download temporários e limitados
- ✅ CORS configurado
- ✅ Rate limiting (recomendado adicionar)

---

## 📧 Emails Transacionais

O sistema envia automaticamente:

1. **Confirmação de Pedido** - Enviado ao criar pedido
2. **Link de Download** - Enviado após confirmação de pagamento

Templates HTML responsivos estão em `server/brevo.ts`

---

## 💳 Fluxo de Pagamento

1. Cliente seleciona produto e preenche dados
2. Sistema cria pedido e envia email de confirmação
3. Sistema gera cobrança PIX via LXPay
4. Cliente paga via PIX
5. Webhook recebe confirmação de pagamento
6. Sistema gera link de download temporário
7. Email com link é enviado ao cliente
8. Cliente acessa link e faz download

---

## 🧪 Testes

```bash
# Executar testes
pnpm test

# Verificar tipos TypeScript
pnpm check
```

---

## 📝 Scripts Disponíveis

```bash
pnpm dev          # Iniciar servidor de desenvolvimento
pnpm build        # Build para produção
pnpm start        # Iniciar servidor de produção
pnpm check        # Verificar tipos TypeScript
pnpm format       # Formatar código com Prettier
pnpm test         # Executar testes
pnpm db:push      # Aplicar migrações do banco
```

---

## 🐛 Solução de Problemas

### Erro de conexão com banco

Verifique se:
- MySQL está rodando
- `DATABASE_URL` está correta
- Banco de dados foi criado
- Migrações foram aplicadas

### Emails não estão sendo enviados

Verifique se:
- `BREVO_API_KEY` está correta
- Email sender está verificado no Brevo
- Veja os logs para mensagens de erro

### Pagamentos não funcionam

Verifique se:
- `LXPAY_API_KEY` e `LXPAY_API_SECRET` estão corretas
- Está usando credenciais de produção (não sandbox)
- Webhook está configurado no painel LXPay

---

## 📊 Análise de Código

Para ver a análise completa do código:

📖 **[ANALISE_CODIGO.md](./ANALISE_CODIGO.md)**

---

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

## 👥 Suporte

Para dúvidas e suporte:

- 📧 Email: suporte@andreiamolina.com
- 📱 WhatsApp: (XX) XXXXX-XXXX
- 🌐 Site: https://andreiamolina.com

---

## 🎉 Agradecimentos

Desenvolvido com ❤️ para Andreia Molina

**Versão:** 1.0.0  
**Última atualização:** 22 de novembro de 2025
