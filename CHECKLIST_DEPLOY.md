# ✅ Checklist Pré-Deploy - Andreia Molina Exclusive

Use este checklist para garantir que tudo está configurado corretamente antes do deploy.

---

## 📋 Antes de Começar

### Contas e Acessos

- [ ] Conta GitHub criada
- [ ] Acesso ao Easypanel da VPS Hostinger
- [ ] Acesso ao painel Brevo
- [ ] Acesso ao painel LXPay
- [ ] Domínio registrado (opcional, mas recomendado)

---

## 🔑 Credenciais e Chaves

### Brevo (Emails)

- [ ] Conta Brevo criada
- [ ] API Key gerada em https://app.brevo.com/settings/keys/api
- [ ] Email sender verificado (ex: noreply@seudominio.com)
- [ ] Templates de email testados

### LXPay (Pagamentos)

- [ ] Conta LXPay criada
- [ ] API Key (pública) gerada
- [ ] API Secret (privada) gerada
- [ ] Webhook configurado (URL: https://seudominio.com/api/webhooks/lxpay)
- [ ] Ambiente de produção ativado (não sandbox)

### JWT Secret

- [ ] Senha forte gerada (mínimo 32 caracteres)
- [ ] Anotada em local seguro

---

## 📦 Código e Repositório

### Preparação do Código

- [ ] Código revisado e testado localmente
- [ ] Todas as dependências instaladas (`pnpm install`)
- [ ] Build local funciona (`pnpm build`)
- [ ] Testes passando (`pnpm test`)
- [ ] TypeScript sem erros (`pnpm check`)

### Arquivos Necessários

- [ ] `Dockerfile` presente
- [ ] `.dockerignore` presente
- [ ] `.env.example` presente
- [ ] `README.md` presente
- [ ] `DEPLOY_EASYPANEL.md` presente
- [ ] `.gitignore` configurado corretamente

### Arquivos Sensíveis

- [ ] `.env` NÃO está no repositório
- [ ] Senhas e chaves NÃO estão no código
- [ ] `.gitignore` inclui `.env*`

### GitHub

- [ ] Repositório criado no GitHub
- [ ] Código enviado para GitHub (`git push`)
- [ ] Branch `main` está atualizada
- [ ] Repositório é privado (recomendado)

---

## 🗄️ Banco de Dados

### MySQL no Easypanel

- [ ] Serviço MySQL criado no Easypanel
- [ ] Nome do banco: `andreia_molina`
- [ ] Usuário criado: `andreia`
- [ ] Senha forte definida
- [ ] String de conexão anotada

### Schema

- [ ] Arquivo `drizzle/schema.ts` revisado
- [ ] Todas as tabelas necessárias definidas
- [ ] Migrações geradas (`pnpm db:push` local)

---

## 🌐 Easypanel

### Aplicação

- [ ] App criado no Easypanel
- [ ] Conectado ao repositório GitHub correto
- [ ] Branch `main` selecionada
- [ ] Build method: `Dockerfile`
- [ ] Porta: `3000`

### Variáveis de Ambiente

Todas as variáveis abaixo configuradas no Easypanel:

- [ ] `DATABASE_URL`
- [ ] `NODE_ENV=production`
- [ ] `PORT=3000`
- [ ] `VITE_APP_URL`
- [ ] `BREVO_API_KEY`
- [ ] `LXPAY_API_KEY`
- [ ] `LXPAY_API_SECRET`
- [ ] `JWT_SECRET`

### Build e Deploy

- [ ] Primeiro build concluído com sucesso
- [ ] Logs de build verificados (sem erros)
- [ ] Container está rodando
- [ ] Migrações aplicadas (`pnpm db:push` no console)

---

## 🌍 Domínio e SSL

### Configuração de Domínio

- [ ] Domínio adicionado no Easypanel
- [ ] Registro DNS A criado
- [ ] Apontando para IP correto
- [ ] Propagação DNS concluída (pode levar até 24h)

### SSL/HTTPS

- [ ] SSL ativado no Easypanel
- [ ] Certificado Let's Encrypt gerado
- [ ] Site acessível via HTTPS
- [ ] Redirecionamento HTTP → HTTPS funcionando

---

## 👤 Usuário Admin

### Criação

- [ ] Hash de senha gerado (bcrypt)
- [ ] Usuário admin inserido no banco
- [ ] Login testado em `/admin/login`
- [ ] Acesso ao dashboard funcionando

---

## 🧪 Testes Funcionais

### Frontend

- [ ] Home carrega corretamente
- [ ] Produtos aparecem na listagem
- [ ] Página de produto individual funciona
- [ ] Checkout abre e formulário funciona
- [ ] Design responsivo (mobile/desktop)

### Checkout e Pagamento

- [ ] Formulário de checkout valida campos
- [ ] Pedido é criado ao submeter
- [ ] Email de confirmação é recebido
- [ ] Página de pagamento exibe QR Code PIX
- [ ] Código copia-cola funciona

### Pagamento e Entrega

- [ ] Pagamento PIX é processado
- [ ] Webhook recebe confirmação
- [ ] Status do pedido é atualizado
- [ ] Link de download é gerado
- [ ] Email com link é enviado
- [ ] Download funciona corretamente

### Área Admin

- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] CRUD de produtos funciona
- [ ] Upload de imagens funciona
- [ ] CRUD de modelos funciona
- [ ] CRUD de order bumps funciona

---

## 📧 Emails

### Templates

- [ ] Email de confirmação de pedido testado
- [ ] Email de link de download testado
- [ ] Design responsivo (mobile/desktop)
- [ ] Links funcionam corretamente
- [ ] Informações corretas (nome, pedido, etc)

### Configuração

- [ ] Sender email verificado no Brevo
- [ ] Emails não caem em spam
- [ ] Taxa de entrega monitorada

---

## 🔐 Segurança

### Checklist de Segurança

- [ ] Todas as senhas são fortes e únicas
- [ ] JWT_SECRET é aleatório e forte
- [ ] HTTPS está ativado
- [ ] Variáveis sensíveis estão no Easypanel (não no código)
- [ ] Repositório GitHub é privado
- [ ] Senhas de admin são hasheadas
- [ ] CORS configurado corretamente
- [ ] Rate limiting considerado (opcional)

---

## 📊 Monitoramento

### Logs

- [ ] Logs do Easypanel acessíveis
- [ ] Sem erros críticos nos logs
- [ ] Logs de email verificados
- [ ] Logs de pagamento verificados

### Métricas

- [ ] CPU usage normal
- [ ] Memory usage normal
- [ ] Uptime monitorado
- [ ] Alertas configurados (opcional)

---

## 🎨 Conteúdo

### Produtos

- [ ] Pelo menos 1 produto cadastrado
- [ ] Imagens de produtos carregadas
- [ ] Preços configurados corretamente
- [ ] Descrições completas
- [ ] Arquivos de download carregados

### Modelos (se aplicável)

- [ ] Pelo menos 1 modelo cadastrado
- [ ] Cores customizadas
- [ ] Imagens hero e about carregadas
- [ ] Produtos associados ao modelo

### Order Bumps (se aplicável)

- [ ] Order bumps cadastrados
- [ ] Associados aos produtos corretos
- [ ] Preços configurados

---

## 📱 Integrações

### LXPay

- [ ] Webhook configurado no painel LXPay
- [ ] URL do webhook: `https://seudominio.com/api/webhooks/lxpay`
- [ ] Teste de pagamento realizado
- [ ] Confirmação de pagamento funcionando

### Brevo

- [ ] Domínio verificado
- [ ] SPF/DKIM configurados
- [ ] Teste de envio realizado
- [ ] Taxa de entrega monitorada

---

## 🚀 Pós-Deploy

### Primeiras Horas

- [ ] Monitorar logs por 1-2 horas
- [ ] Fazer teste de compra completo
- [ ] Verificar recebimento de emails
- [ ] Testar download de conteúdo

### Primeira Semana

- [ ] Monitorar uptime
- [ ] Verificar performance
- [ ] Coletar feedback de usuários
- [ ] Ajustar conforme necessário

### Backup

- [ ] Configurar backup automático do banco
- [ ] Testar restauração de backup
- [ ] Documentar processo de backup

---

## 📞 Contatos de Emergência

### Suporte Técnico

- [ ] Contato Hostinger anotado
- [ ] Contato Brevo anotado
- [ ] Contato LXPay anotado
- [ ] Desenvolvedor disponível

---

## ✅ Aprovação Final

- [ ] Todos os itens acima verificados
- [ ] Testes completos realizados
- [ ] Stakeholders aprovaram
- [ ] Backup inicial criado
- [ ] Documentação completa

---

**Data de Deploy:** ___/___/______  
**Responsável:** _________________  
**Aprovado por:** _________________

---

**🎉 Pronto para o deploy!**
