# 🚀 Guia Completo de Deploy na Hostinger VPS

**Guia simples e direto para colocar o site Andreia Molina no ar**

Autor: Manus AI  
Data: 19 de novembro de 2025

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter:

- ✅ Acesso SSH à VPS da Hostinger (srv791967.hstgr.cloud - IP: 212.85.22.73)
- ✅ Senha de root ou usuário com permissões sudo
- ✅ Chaves de API (Brevo, LXPay, etc)
- ✅ 30-40 minutos de tempo disponível

---

## 🎯 Resumo do Processo

O deploy será feito em 3 etapas principais. Cada etapa tem comandos prontos para copiar e colar, tornando o processo simples e rápido.

| Etapa | Descrição | Tempo Estimado |
|-------|-----------|----------------|
| 1. Setup Inicial | Configurar servidor (apenas primeira vez) | 15-20 min |
| 2. Configuração do Banco | Criar banco de dados MySQL | 5 min |
| 3. Deploy do Site | Subir aplicação | 10-15 min |

---

## 📦 Etapa 1: Setup Inicial do Servidor

Esta etapa precisa ser executada **apenas uma vez** no servidor novo. Se você já fez isso antes, pule para a Etapa 2.

### 1.1 Conectar ao Servidor via SSH

Abra o terminal (ou PuTTY no Windows) e conecte-se ao servidor. Você precisará da senha fornecida pela Hostinger.

```bash
ssh root@212.85.22.73
```

Quando solicitado, digite a senha do servidor. Na primeira conexão, você verá uma mensagem perguntando se confia no servidor - digite `yes` e pressione Enter.

### 1.2 Executar Script de Setup

Agora vamos baixar e executar o script que configura tudo automaticamente. Este script instala Node.js, pnpm, PM2, MySQL e configura o firewall.

```bash
# Baixar o script de setup
curl -o setup-server.sh https://raw.githubusercontent.com/seu-usuario/seu-repo/main/setup-server.sh

# Dar permissão de execução
chmod +x setup-server.sh

# Executar o script
./setup-server.sh
```

O script vai instalar automaticamente os seguintes componentes essenciais para o funcionamento do site:

- **Node.js 22.x**: Ambiente de execução JavaScript necessário para rodar o servidor
- **pnpm**: Gerenciador de pacotes rápido e eficiente
- **PM2**: Gerenciador de processos que mantém o site sempre no ar
- **MySQL Server**: Banco de dados para armazenar produtos, pedidos e usuários
- **Git**: Sistema de controle de versão para baixar o código
- **Firewall (UFW)**: Configurado para permitir apenas portas necessárias (SSH, HTTP, HTTPS, aplicação)

Aguarde cerca de 10-15 minutos enquanto o script executa. Você verá mensagens coloridas indicando o progresso de cada etapa.

---

## 🗄️ Etapa 2: Configurar Banco de Dados MySQL

Após o setup inicial, é necessário criar o banco de dados que armazenará todos os dados do site (produtos, pedidos, usuários, etc).

### 2.1 Executar Configuração Segura do MySQL

O MySQL vem com configurações padrão que não são seguras. Vamos corrigir isso executando o assistente de configuração segura.

```bash
sudo mysql_secure_installation
```

O assistente fará várias perguntas. Responda conforme indicado abaixo para garantir a segurança do banco de dados:

1. **"Enter current password for root"**: Pressione Enter (não há senha ainda)
2. **"Set root password?"**: Digite `Y` e crie uma senha forte (anote esta senha!)
3. **"Remove anonymous users?"**: Digite `Y`
4. **"Disallow root login remotely?"**: Digite `Y`
5. **"Remove test database?"**: Digite `Y`
6. **"Reload privilege tables now?"**: Digite `Y`

### 2.2 Criar Banco de Dados e Usuário

Agora vamos criar o banco de dados específico para o site e um usuário dedicado com permissões apropriadas.

```bash
# Entrar no MySQL como root
sudo mysql -u root -p
```

Digite a senha que você criou no passo anterior. Você verá o prompt do MySQL (`mysql>`). Agora execute os comandos abaixo, um por vez:

```sql
-- Criar o banco de dados
CREATE DATABASE andreia_molina CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar usuário com senha forte (TROQUE 'SuaSenhaForteAqui123!' por uma senha real)
CREATE USER 'andreia'@'localhost' IDENTIFIED BY 'SuaSenhaForteAqui123!';

-- Dar todas as permissões ao usuário no banco
GRANT ALL PRIVILEGES ON andreia_molina.* TO 'andreia'@'localhost';

-- Aplicar as mudanças
FLUSH PRIVILEGES;

-- Sair do MySQL
EXIT;
```

**⚠️ IMPORTANTE**: Anote a senha que você criou para o usuário `andreia`. Você vai precisar dela no próximo passo!

---

## 🌐 Etapa 3: Deploy do Site

Agora vamos baixar o código do site e colocá-lo no ar. Esta etapa pode ser repetida sempre que você quiser atualizar o site.

### 3.1 Clonar o Projeto

Primeiro, vamos baixar o código do site para o servidor. Você tem duas opções:

**Opção A: Usando Git (recomendado se o código está no GitHub)**

```bash
# Ir para o diretório home
cd ~

# Clonar o repositório
git clone https://github.com/seu-usuario/andreia-molina-exclusive.git

# Entrar no diretório do projeto
cd andreia-molina-exclusive
```

**Opção B: Fazer upload manual via SFTP**

Se você não tem o código no GitHub, pode fazer upload usando FileZilla ou WinSCP. Conecte-se ao servidor usando as mesmas credenciais SSH e faça upload da pasta do projeto para `/root/andreia-molina-exclusive`.

### 3.2 Configurar Variáveis de Ambiente

As variáveis de ambiente contêm informações sensíveis como senhas e chaves de API. Vamos criar o arquivo `.env.production` com todas as configurações necessárias.

```bash
# Copiar o arquivo de exemplo
cp .env.production.example .env.production

# Editar o arquivo com o editor nano
nano .env.production
```

O editor nano vai abrir. Use as setas do teclado para navegar e edite as seguintes linhas com seus dados reais:

```env
# Banco de Dados - USE A SENHA QUE VOCÊ CRIOU NO PASSO 2.2
DATABASE_URL="mysql://andreia:SuaSenhaForteAqui123!@localhost:3306/andreia_molina"

# URL do seu site - Por enquanto use o IP, depois você pode configurar um domínio
VITE_APP_URL="http://212.85.22.73:3000"

# Chaves de API - Copie do seu ambiente de desenvolvimento
BREVO_API_KEY="sua_chave_brevo_aqui"
LXPAY_API_KEY="sua_chave_lxpay_aqui"
LXPAY_API_SECRET="seu_secret_lxpay_aqui"

# JWT Secret - Gere uma senha aleatória forte (pode usar um gerador online)
JWT_SECRET="gere_uma_senha_forte_aleatoria_de_pelo_menos_32_caracteres"

# Mantenha o restante das variáveis como está no arquivo de exemplo
```

Após editar, pressione `Ctrl + X`, depois `Y`, depois `Enter` para salvar e sair.

**📝 Dica**: Para gerar uma senha forte para JWT_SECRET, você pode usar este comando no terminal:

```bash
openssl rand -base64 32
```

### 3.3 Executar Deploy Automatizado

Agora vem a parte mais fácil! Criamos um script que faz tudo automaticamente: instala dependências, faz build, aplica migrações do banco e inicia o site.

```bash
# Dar permissão de execução ao script
chmod +x deploy.sh

# Executar o deploy
./deploy.sh
```

O script vai executar automaticamente as seguintes etapas:

1. **Instalar dependências**: Baixa todas as bibliotecas necessárias (pnpm install)
2. **Build do projeto**: Compila o código para produção (pnpm run build)
3. **Aplicar migrações**: Cria todas as tabelas no banco de dados (pnpm db:push)
4. **Iniciar aplicação**: Sobe o site usando PM2 para gerenciamento de processos

Aguarde cerca de 5-10 minutos. Você verá mensagens coloridas indicando o progresso. Ao final, você verá uma mensagem de sucesso com o status da aplicação.

---

## ✅ Verificar se o Site Está no Ar

Após o deploy, você pode verificar se tudo está funcionando corretamente de várias formas.

### Verificar Status da Aplicação

```bash
# Ver status do PM2
pm2 status

# Ver logs em tempo real
pm2 logs andreia-molina-exclusive
```

O comando `pm2 status` deve mostrar a aplicação com status "online" e uptime crescente. Se mostrar "errored" ou "stopped", algo deu errado - veja a seção de Solução de Problemas abaixo.

### Acessar o Site no Navegador

Abra seu navegador e acesse:

```
http://212.85.22.73:3000
```

Você deve ver a página inicial do site Andreia Molina carregando normalmente. Se aparecer erro de conexão, verifique se o firewall está configurado corretamente:

```bash
sudo ufw status
```

Deve mostrar que a porta 3000 está permitida.

---

## 🔄 Como Atualizar o Site (Deploy Futuro)

Quando você fizer mudanças no código e quiser atualizar o site, o processo é muito mais simples. Basta seguir estes passos:

```bash
# 1. Conectar ao servidor
ssh root@212.85.22.73

# 2. Ir para o diretório do projeto
cd ~/andreia-molina-exclusive

# 3. Baixar as últimas mudanças (se usando Git)
git pull origin main

# 4. Executar o script de deploy novamente
./deploy.sh
```

Pronto! O site será atualizado automaticamente em poucos minutos, sem downtime significativo.

---

## 🌍 Configurar Domínio Personalizado (Opcional)

Se você quiser usar um domínio próprio (como `andreiamolina.com`) em vez do IP, siga estes passos adicionais.

### 4.1 Apontar Domínio para o Servidor

No painel de controle do seu provedor de domínio (GoDaddy, Registro.br, etc), crie um registro A apontando para o IP do servidor:

| Tipo | Nome | Valor | TTL |
|------|------|-------|-----|
| A | @ | 212.85.22.73 | 3600 |
| A | www | 212.85.22.73 | 3600 |

Aguarde até 24 horas para a propagação DNS (geralmente leva 1-2 horas).

### 4.2 Instalar Nginx como Proxy Reverso

O Nginx vai permitir que você use a porta 80 (HTTP padrão) e 443 (HTTPS) em vez da porta 3000.

```bash
# Instalar Nginx
sudo apt install -y nginx

# Criar configuração do site
sudo nano /etc/nginx/sites-available/andreia-molina
```

Cole a seguinte configuração (substitua `seudominio.com` pelo seu domínio real):

```nginx
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Salve (`Ctrl + X`, `Y`, `Enter`) e ative a configuração:

```bash
# Criar link simbólico
sudo ln -s /etc/nginx/sites-available/andreia-molina /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

### 4.3 Configurar SSL/HTTPS com Let's Encrypt

Para ter HTTPS (cadeado verde no navegador), use o Certbot para obter um certificado SSL gratuito.

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obter certificado SSL (substitua pelo seu domínio)
sudo certbot --nginx -d seudominio.com -d www.seudominio.com
```

O Certbot vai fazer algumas perguntas. Responda conforme indicado:

1. **Email**: Digite seu email (para avisos de renovação)
2. **Termos de serviço**: Digite `Y` para aceitar
3. **Compartilhar email**: Digite `N` (opcional)
4. **Redirect HTTP to HTTPS**: Digite `2` para redirecionar automaticamente

Pronto! Seu site agora tem HTTPS e pode ser acessado em `https://seudominio.com`.

### 4.4 Atualizar Variável de Ambiente

Não esqueça de atualizar a URL no arquivo `.env.production`:

```bash
nano .env.production
```

Mude de:
```env
VITE_APP_URL="http://212.85.22.73:3000"
```

Para:
```env
VITE_APP_URL="https://seudominio.com"
```

Salve e reinicie a aplicação:

```bash
pm2 restart andreia-molina-exclusive
```

---

## 🔧 Solução de Problemas Comuns

Aqui estão soluções para os problemas mais frequentes que podem ocorrer durante o deploy.

### Problema: Site não carrega (erro de conexão)

**Causa**: Firewall bloqueando a porta ou aplicação não iniciada.

**Solução**:

```bash
# Verificar se a aplicação está rodando
pm2 status

# Se estiver "stopped", iniciar novamente
pm2 start ecosystem.config.js

# Verificar firewall
sudo ufw status

# Se a porta 3000 não estiver permitida, adicionar
sudo ufw allow 3000/tcp
```

### Problema: Erro "Cannot connect to database"

**Causa**: Credenciais do banco de dados incorretas no `.env.production`.

**Solução**:

```bash
# Verificar se o MySQL está rodando
sudo systemctl status mysql

# Se não estiver, iniciar
sudo systemctl start mysql

# Testar conexão manualmente
mysql -u andreia -p andreia_molina

# Se der erro, verificar se o usuário existe
sudo mysql -u root -p
```

No MySQL, execute:

```sql
SELECT User, Host FROM mysql.user WHERE User='andreia';
```

Se não aparecer nada, recrie o usuário (volte ao passo 2.2).

### Problema: Erro "Port 3000 already in use"

**Causa**: Já existe outra aplicação usando a porta 3000.

**Solução**:

```bash
# Ver o que está usando a porta 3000
sudo lsof -i :3000

# Parar a aplicação antiga
pm2 stop all

# Ou matar o processo diretamente (substitua PID pelo número mostrado)
kill -9 PID

# Iniciar novamente
pm2 start ecosystem.config.js
```

### Problema: Site mostra erro 500 (Internal Server Error)

**Causa**: Erro no código ou variáveis de ambiente faltando.

**Solução**:

```bash
# Ver logs detalhados do erro
pm2 logs andreia-molina-exclusive --lines 50

# Verificar se todas as variáveis de ambiente estão configuradas
cat .env.production
```

Procure no log por mensagens de erro específicas. Geralmente indicam qual variável está faltando ou qual parte do código está com problema.

### Problema: Migrações do banco falharam

**Causa**: Banco de dados não acessível ou schema incompatível.

**Solução**:

```bash
# Verificar conexão com o banco
mysql -u andreia -p andreia_molina

# Se conectar, sair e tentar aplicar migrações manualmente
exit

# Aplicar migrações
pnpm db:push
```

Se continuar dando erro, pode ser necessário limpar o banco e recomeçar:

```bash
# ATENÇÃO: Isso vai apagar todos os dados!
sudo mysql -u root -p

DROP DATABASE andreia_molina;
CREATE DATABASE andreia_molina CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Aplicar migrações novamente
pnpm db:push
```

---

## 📊 Comandos Úteis do PM2

O PM2 é o gerenciador de processos que mantém o site sempre no ar. Aqui estão os comandos mais úteis para gerenciar a aplicação.

```bash
# Ver status de todas as aplicações
pm2 status

# Ver logs em tempo real
pm2 logs andreia-molina-exclusive

# Ver logs das últimas 100 linhas
pm2 logs andreia-molina-exclusive --lines 100

# Parar a aplicação
pm2 stop andreia-molina-exclusive

# Reiniciar a aplicação
pm2 restart andreia-molina-exclusive

# Remover a aplicação do PM2
pm2 delete andreia-molina-exclusive

# Ver uso de CPU e memória
pm2 monit

# Salvar configuração atual do PM2
pm2 save

# Ver lista de aplicações salvas
pm2 list
```

---

## 🎉 Próximos Passos

Agora que o site está no ar, você pode:

1. **Acessar o painel admin** em `http://212.85.22.73:3000/admin/login` e fazer login
2. **Cadastrar modelos** e produtos pelo painel administrativo
3. **Configurar order bumps** para aumentar as vendas
4. **Testar o fluxo de compra** completo (checkout, PIX, redirecionamento)
5. **Configurar um domínio personalizado** (veja seção 4)
6. **Configurar HTTPS** para segurança (veja seção 4.3)
7. **Configurar webhook de pagamento** para processar pedidos automaticamente

---

## 📞 Suporte

Se você encontrar problemas não cobertos neste guia, você pode:

- Verificar os logs detalhados: `pm2 logs andreia-molina-exclusive --lines 200`
- Consultar a documentação do PM2: https://pm2.keymetrics.io/docs/usage/quick-start/
- Consultar a documentação do MySQL: https://dev.mysql.com/doc/
- Entrar em contato com o suporte da Hostinger: https://www.hostinger.com.br/contato

---

**Última atualização**: 19 de novembro de 2025  
**Versão do guia**: 1.0  
**Autor**: Manus AI
