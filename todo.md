# Project TODO - Sistema Admin Multi-Modelo

## Sistema de Autenticação Admin
- [x] Criar tabela de admins no banco de dados
- [x] Implementar sistema de login simples (user/password)
- [x] Criar middleware de proteção de rotas admin
- [ ] Criar página de login admin

## Schema do Banco de Dados
- [x] Criar tabela `models` com campos: id, name, slug, primaryColor, secondaryColor, accentColor, heroImage, aboutText, etc
- [x] Criar tabela `model_products` para produtos customizados por modelo
- [x] Executar migração do banco

## Painel Admin
- [ ] Criar layout do painel admin
- [ ] Criar dashboard com lista de modelos
- [ ] Criar formulário de adicionar/editar modelo
- [ ] Implementar upload de imagens
- [ ] Implementar seletor de cores
- [ ] Criar gerenciamento de produtos por modelo

## Páginas Dinâmicas
- [ ] Criar rota dinâmica /modelo/[slug]
- [ ] Adaptar landing page atual para receber dados dinâmicos
- [ ] Implementar sistema de cores customizáveis
- [ ] Testar múltiplas páginas de modelos

## Testes e Validação
- [ ] Testar login admin
- [ ] Testar criação de modelo
- [ ] Testar edição de cores e textos
- [ ] Testar páginas dinâmicas funcionando
- [ ] Validar design mantido em todas as páginas

## Correção de Bug - Autenticação
- [ ] Corrigir redirecionamento após login (loop de login)
- [ ] Verificar configuração de cookies
- [ ] Testar fluxo completo de login → dashboard

## Criar Formulário de Modelos
- [x] Criar página /admin/models/new para criar modelo
- [x] Criar página /admin/models/edit/:id para editar modelo
- [x] Adicionar rotas no App.tsx
- [ ] Testar criação e edição de modelos (próximo)

## Correções Urgentes
- [x] Verificar rota do botão de editar no dashboard
- [x] Criar página dinâmica /modelo/[slug]
- [ ] Testar visualização de modelo criado (próximo)

## Sistema de Edição de Pacotes
- [x] Criar rotas de API para CRUD de produtos (listar, criar, editar, deletar)
- [x] Implementar upload de imagens de pacotes usando S3
- [x] Criar página /admin/products com lista de todos os pacotes
- [x] Criar formulário de edição de pacote (nome, descrição, preços, features)
- [x] Adicionar editor de features (lista de itens)
- [x] Implementar preview de imagem ao fazer upload
- [x] Adicionar toggle para ativar/desativar pacote
- [x] Adicionar toggle para marcar como "destaque"
- [x] Testar edição completa de pacotes

## Header/Footer Dinâmicos e Customização por Modelo
- [x] Adicionar campo instagramUrl na tabela models
- [x] Modificar Header para usar nome da modelo atual
- [x] Modificar Footer para usar nome da modelo e link do Instagram customizado
- [x] Testar header/footer em páginas de modelos diferentes

## Sistema de Order Bump
- [x] Criar tabela orderBumps no schema
- [x] Adicionar rotas de API para CRUD de order bumps
- [x] Criar interface de edição de order bumps no admin
- [ ] Vincular order bumps a modelos específicas (feito via campo modelId)
- [ ] Implementar exibição de order bump na página de checkout
- [ ] Adicionar lógica para aplicar order bump ao pedido

## Vinculação de Pacotes por Modelo
- [x] Modificar interface de edição de modelo para selecionar pacotes
- [x] Adicionar interface para reordenar pacotes (drag and drop ou números)
- [x] Atualizar página da modelo para respeitar ordem dos pacotes
- [x] Testar vinculação e ordenação de pacotes

## Correções
- [x] Modificar formulário de order bump para usar URL de imagem em vez de upload

## Vinculação de Order Bump às Modelos
- [x] Adicionar campo orderBumpId na tabela models
- [x] Criar seleção de order bump no formulário de edição de modelo
- [x] Atualizar backend para salvar vínculo de order bump
- [x] Testar vinculação de order bump à modelo

## Refatoração: Order Bump por Produto
- [x] Remover campo orderBumpId da tabela models
- [x] Adicionar campo orderBumpId na tabela products
- [x] Aplicar migração no banco de dados
- [x] Remover seleção de order bump do formulário de modelo (AdminModelForm.tsx)
- [x] Adicionar seleção de order bump no formulário de produto (ProductFormPage.tsx)
- [x] Atualizar backend de produtos para salvar orderBumpId
- [x] Testar vinculação de order bump por produto

## Exibição de Order Bump no Checkout
- [x] Buscar order bump vinculado ao produto no checkout
- [x] Criar componente visual de order bump com imagem, nome, descrição e preço
- [x] Adicionar checkbox "Adicionar ao pedido"
- [x] Implementar atualização automática do total quando order bump é marcado
- [x] Integrar order bump ao processamento de pagamento
- [x] Testar order bump no checkout

## Fluxo de Pós-Compra e Redirecionamento
- [x] Adicionar campo accessLink na tabela products
- [x] Adicionar campo accessLink na tabela orderBumps
- [x] Adicionar campo accessLink no formulário de edição de produtos
- [ ] Adicionar campo accessLink no formulário de edição de order bumps
- [ ] Criar webhook de confirmação de pagamento (/api/webhook/payment)
- [ ] Implementar envio de e-mail via Brevo com links de acesso
- [ ] Criar template de e-mail de confirmação de compra
- [ ] Implementar lógica de redirecionamento após pagamento confirmado
- [ ] Criar página de sucesso (/success) com redirecionamento automático
- [ ] Testar fluxo completo de compra com e-mail e redirecionamento

## Melhorias no Checkout e Pós-Compra
- [x] Tornar campo de e-mail opcional no checkout
- [x] Adicionar campo accessLink no formulário de edição de order bumps
- [x] Adicionar campo deliveryDescription (descrição do que será entregue) em orderBumps
- [x] Criar página de sucesso com 2 botões de redirecionamento (pacote e order bump)
- [x] Adicionar campo orderBumpId na tabela orders
- [x] Criar endpoint /api/orders/success/:orderNumber
- [ ] Testar fluxo completo de compra com e sem order bump

## Deploy na Hostinger VPS
- [x] Criar arquivo .env.production com variáveis de ambiente
- [x] Criar script de deploy automatizado
- [x] Criar ecosystem.config.js para PM2
- [x] Criar guia passo-a-passo de deploy
- [x] Documentar configuração de banco de dados MySQL
- [x] Documentar configuração de domínio e SSL

## Configuração Git e GitHub
- [ ] Criar .gitignore adequado para excluir arquivos pesados
- [ ] Verificar e remover arquivos grandes do repositório
- [ ] Inicializar repositório Git
- [ ] Criar primeiro commit
- [ ] Fornecer instruções de upload para GitHub

## Correção de Bug - Geração de PIX em Produção
- [ ] Verificar logs do servidor para identificar erro
- [ ] Validar credenciais da API LXPay em produção
- [ ] Testar geração de PIX no checkout
- [ ] Verificar se pedido está sendo criado no banco de dados
- [ ] Validar fluxo completo de checkout
