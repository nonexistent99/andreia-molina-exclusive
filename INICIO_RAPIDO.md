# 🚀 Início Rápido - Deploy em 30 Minutos

Este guia resume os passos essenciais para colocar o site no ar rapidamente usando Easypanel.

---

## 📋 O Que Você Precisa (5 minutos)

Antes de começar, tenha em mãos:

1. **Conta GitHub** - [Criar conta](https://github.com/signup)
2. **Acesso ao Easypanel** - URL fornecida pela Hostinger
3. **Chave Brevo** - [Obter em app.brevo.com](https://app.brevo.com/settings/keys/api)
4. **Chaves LXPay** - Obter no painel LXPay
5. **Senha forte para JWT** - [Gerar aqui](https://randomkeygen.com/)

---

## 🎯 Passo a Passo Rápido

### 1️⃣ GitHub (5 minutos)

```bash
# No terminal, na pasta do projeto:
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/SEU-USUARIO/andreia-molina.git
git push -u origin main
```

### 2️⃣ Banco de Dados no Easypanel (3 minutos)

1. Acesse Easypanel → **Services** → **Create Service**
2. Escolha **MySQL**
3. Configure:
   - Nome: `andreia-mysql`
   - Database: `andreia_molina`
   - User: `andreia`
   - Password: (crie uma senha forte)
4. **Anote a string de conexão!**

### 3️⃣ Aplicação no Easypanel (10 minutos)

1. Easypanel → **Apps** → **Create App**
2. Conecte ao GitHub e selecione o repositório
3. Configure:
   - Build: `Dockerfile`
   - Port: `3000`
4. **Adicione as variáveis de ambiente:**

```env
DATABASE_URL=mysql://andreia:SENHA@andreia-mysql:3306/andreia_molina
NODE_ENV=production
PORT=3000
VITE_APP_URL=https://seudominio.com
BREVO_API_KEY=sua_chave_brevo
LXPAY_API_KEY=sua_chave_lxpay
LXPAY_API_SECRET=seu_secret_lxpay
JWT_SECRET=senha_forte_aleatoria_32_caracteres
```

5. Clique em **Create**

### 4️⃣ Aplicar Migrações (2 minutos)

Após o build:

1. Easypanel → App → **Console**
2. Execute: `pnpm db:push`

### 5️⃣ Criar Admin (5 minutos)

1. Gere hash bcrypt da senha em [bcrypt-generator.com](https://bcrypt-generator.com/)
2. No console do MySQL:

```sql
INSERT INTO admins (username, password, createdAt) 
VALUES ('admin', 'SEU_HASH_BCRYPT', NOW());
```

### 6️⃣ Configurar Domínio (5 minutos - opcional)

1. Easypanel → App → **Domains** → **Add Domain**
2. No provedor de domínio, crie registro A apontando para o IP
3. Aguarde propagação DNS
4. Ative SSL no Easypanel

---

## ✅ Verificar Funcionamento

1. Acesse `https://seudominio.com`
2. Faça login em `/admin/login`
3. Cadastre um produto
4. Teste uma compra

---

## 🆘 Problemas Comuns

**Build falha?**
→ Verifique logs no Easypanel

**Não conecta ao banco?**
→ Verifique `DATABASE_URL`

**Emails não enviam?**
→ Verifique `BREVO_API_KEY` e email sender verificado

---

## 📚 Documentação Completa

Para informações detalhadas, consulte:

- **[DEPLOY_EASYPANEL.md](./DEPLOY_EASYPANEL.md)** - Guia completo de deploy
- **[CHECKLIST_DEPLOY.md](./CHECKLIST_DEPLOY.md)** - Checklist pré-deploy
- **[ANALISE_CODIGO.md](./ANALISE_CODIGO.md)** - Análise técnica do código
- **[README.md](./README.md)** - Documentação do projeto

---

**🎉 Pronto! Seu site está no ar!**
