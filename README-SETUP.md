# Andreia Molina - Conteúdo Exclusivo

Site de vendas com checkout integrado à API Pix da Lxpay e sistema de envio de email via Brevo.

## 🚀 Funcionalidades

- ✅ Landing page com design chamativo (rosa/roxo/dourado)
- ✅ Sistema de produtos com 3 pacotes
- ✅ Checkout completo com validação
- ✅ Integração com Lxpay para pagamento Pix
- ✅ Sistema de envio de emails via Brevo
- ✅ Geração automática de links de download
- ✅ Controle de acesso e expiração de links
- ✅ Gatilhos de venda estratégicos

## 🔧 Configuração Inicial

### 1. Credenciais da API

As seguintes credenciais já foram configuradas:
- `LXPAY_API_KEY` - Chave da API Lxpay
- `LXPAY_API_SECRET` - Secret da API Lxpay
- `BREVO_API_KEY` - Chave da API Brevo

Para atualizar, acesse: **Management UI → Settings → Secrets**

### 2. Configurar Webhook da Lxpay

No painel da Lxpay, configure o webhook para:
```
https://seu-dominio.manus.space/api/webhooks/lxpay
```

Este webhook é necessário para:
- Confirmar pagamentos automaticamente
- Atualizar status dos pedidos
- Enviar emails com links de download

### 3. Configurar Email Sender na Brevo

No painel da Brevo:
1. Acesse **Senders** → **Add a New Sender**
2. Adicione e verifique seu email (ex: noreply@seudominio.com)
3. Atualize o email em `server/brevo.ts` linha 31

### 4. Upload de Conteúdo dos Pacotes

Para cada produto, você precisa:

1. **Preparar o arquivo ZIP** com o conteúdo (fotos e vídeos)
2. **Fazer upload para S3** usando o script:

```bash
# Exemplo de upload
node -e "
const { storagePut } = require('./server/storage.ts');
const fs = require('fs');

async function upload() {
  const buffer = fs.readFileSync('caminho/para/pacote.zip');
  const result = await storagePut('products/pacote-premium.zip', buffer, 'application/zip');
  console.log('URL:', result.url);
  console.log('Key:', result.key);
}
upload();
"
```

3. **Atualizar o produto no banco** com a URL e key do arquivo:

```sql
UPDATE products 
SET downloadUrl = 'URL_DO_S3', 
    fileKey = 'products/pacote-premium.zip'
WHERE id = 1;
```

Ou use o Management UI → Database para editar diretamente.

## 📊 Fluxo de Compra

1. **Cliente acessa o site** → Visualiza pacotes
2. **Seleciona um pacote** → Vai para checkout
3. **Preenche dados** → Nome, email, telefone
4. **Recebe QR Code Pix** → Página de pagamento
5. **Paga via Pix** → Confirmação automática via webhook
6. **Recebe email** → Com link de download exclusivo
7. **Acessa link** → Faz download do conteúdo

## 🎨 Personalização

### Cores e Branding

As cores principais estão em `client/src/index.css`:
- **Primary (Rosa)**: `oklch(60% 0.25 340)`
- **Secondary (Roxo)**: `oklch(50% 0.20 300)`
- **Accent (Dourado)**: `oklch(75% 0.15 85)`

### Logo

Para atualizar o logo:
1. Edite `client/src/const.ts` → `APP_LOGO`
2. No Management UI, vá em **Settings → General** para atualizar o favicon

### Conteúdo

- **Hero**: `client/src/components/Hero.tsx`
- **Pacotes**: `client/src/components/Packages.tsx`
- **Sobre**: `client/src/components/About.tsx`
- **FAQ**: `client/src/components/FAQ.tsx`

## 📧 Templates de Email

Os templates estão em `server/brevo.ts`:
- `getOrderConfirmationEmailTemplate` - Email de confirmação do pedido
- `getDownloadLinkEmailTemplate` - Email com link de download

Personalize conforme necessário.

## 🔒 Segurança

- ✅ Pagamentos processados via Pix (Lxpay)
- ✅ Links de download únicos e temporários
- ✅ Controle de número máximo de downloads
- ✅ Expiração automática de links
- ✅ Validação de tokens

## 📱 Suporte

Para dúvidas ou problemas:
- Email: suporte@andreiamolina.com
- Configure este email no FAQ e Footer

## 🚀 Deploy

1. **Salve um checkpoint** no Management UI
2. **Clique em Publish** no header
3. **Configure domínio personalizado** (opcional) em Settings → Domains

## 📝 Notas Importantes

### API da Lxpay

A implementação atual usa uma estrutura genérica baseada em padrões comuns de APIs de pagamento Pix. Você pode precisar ajustar:

- `server/lxpay.ts` - Endpoints e estrutura de dados conforme documentação real da Lxpay
- URL base da API (atualmente: `https://api.lxpay.com.br/v1`)

### Testes

Antes de ir ao ar:
1. ✅ Teste o fluxo completo de compra
2. ✅ Verifique se os emails estão sendo enviados
3. ✅ Confirme que o webhook está funcionando
4. ✅ Teste os links de download
5. ✅ Valide a expiração e limites

## 🎯 Próximos Passos

1. **Upload do conteúdo real** dos pacotes para S3
2. **Configurar webhook** no painel da Lxpay
3. **Verificar email sender** na Brevo
4. **Testar fluxo completo** em ambiente de desenvolvimento
5. **Publicar** quando tudo estiver funcionando

---

**Desenvolvido com ❤️ para Andreia Molina**
