# 🚀 Guia de Deploy no Easypanel (Hostinger VPS)

**Projeto:** Andreia Molina - Conteúdo Exclusivo  
**Data:** 22 de novembro de 2025

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter:

1. ✅ Conta no GitHub
2. ✅ Acesso ao Easypanel instalado na VPS Hostinger
3. ✅ Chaves de API:
   - Brevo API Key (para envio de emails)
   - LXPay API Key e Secret (para pagamentos PIX)
4. ✅ Domínio configurado (opcional, mas recomendado)

---

## 🎯 Visão Geral do Processo

O deploy no Easypanel é muito mais simples que o deploy tradicional. O Easypanel gerencia automaticamente:

- ✅ Build da aplicação via Docker
- ✅ Gerenciamento de containers
- ✅ Banco de dados MySQL
- ✅ Variáveis de ambiente
- ✅ SSL/HTTPS automático
- ✅ Logs e monitoramento
- ✅ Atualizações via GitHub

**Tempo estimado:** 20-30 minutos

---

## 📦 Etapa 1: Preparar Repositório no GitHub

### 1.1 Criar Repositório

1. Acesse [GitHub](https://github.com) e faça login
2. Clique em **"New repository"**
3. Configure o repositório:
   - **Nome:** `andreia-molina-exclusive`
   - **Visibilidade:** Private (recomendado)
   - **Não** inicialize com README (já temos um)
4. Clique em **"Create repository"**

### 1.2 Fazer Upload do Código

No seu computador, abra o terminal na pasta do projeto e execute:

```bash
# Inicializar git (se ainda não foi feito)
git init

# Adicionar todos os arquivos
git add .

# Fazer commit inicial
git commit -m "Initial commit - Andreia Molina Exclusive"

# Adicionar repositório remoto (substitua SEU-USUARIO)
git remote add origin https://github.com/SEU-USUARIO/andreia-molina-exclusive.git

# Fazer push para GitHub
git branch -M main
git push -u origin main
```

**✅ Pronto!** Seu código está no GitHub.

---

## 🗄️ Etapa 2: Criar Banco de Dados no Easypanel

### 2.1 Acessar Easypanel

1. Acesse o Easypanel da sua VPS (geralmente `https://seu-ip:3000` ou `https://panel.seudominio.com`)
2. Faça login com suas credenciais

### 2.2 Criar Serviço MySQL

1. No painel lateral, clique em **"Services"**
2. Clique em **"Create Service"**
3. Selecione **"MySQL"**
4. Configure:
   - **Service Name:** `andreia-mysql`
   - **MySQL Root Password:** Crie uma senha forte (anote!)
   - **Database Name:** `andreia_molina`
   - **MySQL User:** `andreia`
   - **MySQL Password:** Crie uma senha forte (anote!)
5. Clique em **"Create"**

### 2.3 Anotar String de Conexão

Após criar o banco, você verá a string de conexão. Ela será algo como:

```
mysql://andreia:SUA_SENHA@andreia-mysql:3306/andreia_molina
```

**⚠️ IMPORTANTE:** Anote essa string, você vai precisar dela!

---

## 🌐 Etapa 3: Criar Aplicação no Easypanel

### 3.1 Criar Novo App

1. No Easypanel, clique em **"Apps"**
2. Clique em **"Create App"**
3. Selecione **"From GitHub"**

### 3.2 Conectar GitHub

1. Se for a primeira vez, você precisará autorizar o Easypanel a acessar seus repositórios
2. Clique em **"Connect GitHub"**
3. Autorize o acesso
4. Selecione o repositório **`andreia-molina-exclusive`**

### 3.3 Configurar Build

1. **App Name:** `andreia-molina`
2. **Branch:** `main`
3. **Build Method:** `Dockerfile`
4. **Dockerfile Path:** `./Dockerfile` (padrão)
5. **Port:** `3000`

### 3.4 Configurar Variáveis de Ambiente

Clique em **"Environment Variables"** e adicione as seguintes variáveis:

#### Banco de Dados
```
DATABASE_URL=mysql://andreia:SUA_SENHA_MYSQL@andreia-mysql:3306/andreia_molina
```
*(Use a string de conexão que você anotou na Etapa 2)*

#### Servidor
```
NODE_ENV=production
PORT=3000
```

#### URL da Aplicação
```
VITE_APP_URL=https://seudominio.com
```
*(Ou use o domínio fornecido pelo Easypanel temporariamente)*

#### Brevo (Email)
```
BREVO_API_KEY=sua_chave_brevo_aqui
```

#### LXPay (Pagamentos)
```
LXPAY_API_KEY=sua_chave_publica_lxpay
LXPAY_API_SECRET=sua_chave_secreta_lxpay
```

#### JWT Secret
```
JWT_SECRET=gere_uma_senha_forte_aleatoria_de_pelo_menos_32_caracteres
```

**💡 Dica:** Para gerar JWT_SECRET forte, use um gerador online como [RandomKeygen](https://randomkeygen.com/)

### 3.5 Criar Aplicação

1. Revise todas as configurações
2. Clique em **"Create App"**
3. O Easypanel começará a fazer build da aplicação

**⏱️ Aguarde:** O primeiro build pode levar 5-10 minutos.

---

## 🗄️ Etapa 4: Aplicar Migrações do Banco

Após o build ser concluído, você precisa aplicar as migrações do banco de dados.

### 4.1 Acessar Console do Container

1. No Easypanel, vá para o app **`andreia-molina`**
2. Clique na aba **"Console"** ou **"Terminal"**
3. Isso abrirá um terminal dentro do container

### 4.2 Executar Migrações

No terminal do container, execute:

```bash
pnpm db:push
```

Você verá mensagens indicando que as tabelas estão sendo criadas. Aguarde até ver a mensagem de sucesso.

**✅ Pronto!** O banco de dados está configurado.

---

## 🌍 Etapa 5: Configurar Domínio (Opcional)

### 5.1 Adicionar Domínio no Easypanel

1. No app **`andreia-molina`**, vá para a aba **"Domains"**
2. Clique em **"Add Domain"**
3. Digite seu domínio: `andreiamolina.com` (ou subdomínio como `app.andreiamolina.com`)
4. O Easypanel mostrará um IP para apontar

### 5.2 Configurar DNS

No painel do seu provedor de domínio (GoDaddy, Registro.br, etc):

1. Crie um registro **A** apontando para o IP fornecido pelo Easypanel
2. Aguarde propagação DNS (1-24 horas, geralmente 1-2 horas)

### 5.3 Ativar SSL

1. Após a propagação DNS, volte ao Easypanel
2. Na aba **"Domains"**, clique em **"Enable SSL"**
3. O Easypanel gerará automaticamente um certificado Let's Encrypt

**✅ Pronto!** Seu site está com HTTPS ativado.

---

## ✅ Etapa 6: Verificar Funcionamento

### 6.1 Acessar o Site

Abra seu navegador e acesse:
- Domínio configurado: `https://andreiamolina.com`
- Ou domínio temporário do Easypanel: `https://andreia-molina.easypanel.host`

### 6.2 Testar Funcionalidades

1. **Home:** Deve carregar a página inicial
2. **Produtos:** Devem aparecer os produtos cadastrados
3. **Admin:** Acesse `/admin/login` e faça login

### 6.3 Verificar Logs

No Easypanel, vá para a aba **"Logs"** para ver os logs da aplicação em tempo real.

Se houver erros, eles aparecerão aqui.

---

## 🔄 Etapa 7: Atualizar a Aplicação

Sempre que você fizer mudanças no código:

### 7.1 Fazer Push para GitHub

```bash
git add .
git commit -m "Descrição das mudanças"
git push origin main
```

### 7.2 Deploy Automático

O Easypanel detectará automaticamente as mudanças e fará um novo deploy!

**Ou manualmente:**
1. No Easypanel, vá para o app
2. Clique em **"Rebuild"**

---

## 🎨 Etapa 8: Configurações Adicionais

### 8.1 Criar Usuário Admin

Para acessar o painel administrativo, você precisa criar um usuário admin no banco.

1. Acesse o console do MySQL no Easypanel
2. Execute:

```sql
-- Gerar hash da senha (use bcrypt online ou no Node.js)
-- Exemplo: senha "admin123" = hash "$2a$10$..."

INSERT INTO admins (username, password, createdAt) 
VALUES ('admin', '$2a$10$SEU_HASH_AQUI', NOW());
```

**💡 Dica:** Use um gerador de hash bcrypt online como [bcrypt-generator.com](https://bcrypt-generator.com/)

### 8.2 Cadastrar Produtos

1. Acesse `/admin/login`
2. Faça login com o usuário criado
3. Vá para **"Produtos"** e cadastre seus produtos
4. Faça upload das imagens e arquivos

### 8.3 Configurar Email Sender no Brevo

1. Acesse o painel do Brevo
2. Vá para **"Senders"**
3. Adicione e verifique o email `noreply@seudominio.com`
4. Atualize o código em `server/brevo.ts` se necessário

---

## 🐛 Solução de Problemas

### Problema: Build falha no Easypanel

**Solução:**
1. Verifique os logs de build
2. Certifique-se de que todos os arquivos estão no GitHub
3. Verifique se o `Dockerfile` está correto

### Problema: Aplicação não conecta ao banco

**Solução:**
1. Verifique a variável `DATABASE_URL`
2. Certifique-se de que o serviço MySQL está rodando
3. Verifique se o nome do serviço MySQL está correto (`andreia-mysql`)

### Problema: Emails não estão sendo enviados

**Solução:**
1. Verifique a variável `BREVO_API_KEY`
2. Verifique se o email sender está verificado no Brevo
3. Veja os logs para mensagens de erro

### Problema: Pagamentos PIX não funcionam

**Solução:**
1. Verifique as variáveis `LXPAY_API_KEY` e `LXPAY_API_SECRET`
2. Certifique-se de que está usando as credenciais de produção
3. Verifique os logs para erros da API LXPay

---

## 📊 Monitoramento

### Logs em Tempo Real

No Easypanel:
1. Vá para o app
2. Clique em **"Logs"**
3. Veja os logs em tempo real

### Métricas

O Easypanel mostra automaticamente:
- CPU usage
- Memory usage
- Network traffic
- Uptime

---

## 🔐 Segurança

### Checklist de Segurança

- ✅ Todas as senhas são fortes e únicas
- ✅ Variáveis de ambiente estão configuradas (não no código)
- ✅ SSL/HTTPS está ativado
- ✅ Repositório GitHub é privado
- ✅ Senhas de admin são hasheadas com bcrypt
- ✅ JWT_SECRET é forte e aleatório

---

## 📞 Suporte

Se você encontrar problemas:

1. **Logs do Easypanel:** Primeira fonte de informação
2. **Documentação do Easypanel:** [docs.easypanel.io](https://docs.easypanel.io)
3. **GitHub Issues:** Crie uma issue no repositório
4. **Suporte Hostinger:** Para problemas com a VPS

---

## ✨ Próximos Passos

Após o deploy bem-sucedido:

1. ✅ Cadastrar produtos
2. ✅ Testar fluxo de compra completo
3. ✅ Configurar backup do banco de dados
4. ✅ Configurar monitoramento de uptime
5. ✅ Adicionar analytics (Google Analytics, etc)

---

**🎉 Parabéns!** Seu site está no ar e funcionando!
