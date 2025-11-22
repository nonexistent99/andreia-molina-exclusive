#!/bin/bash

# Script de Deploy Automatizado para Hostinger VPS
# Este script facilita o deploy do site na VPS

set -e  # Para o script se houver erro

echo "🚀 Iniciando deploy do site Andreia Molina..."
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verifica se está no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: Execute este script no diretório raiz do projeto${NC}"
    exit 1
fi

# 1. Instalar dependências
echo -e "${YELLOW}📦 Instalando dependências...${NC}"
pnpm install --frozen-lockfile

# 2. Build do projeto
echo -e "${YELLOW}🔨 Fazendo build do projeto...${NC}"
pnpm run build

# 3. Aplicar migrações do banco de dados
echo -e "${YELLOW}🗄️  Aplicando migrações do banco de dados...${NC}"
pnpm db:push

# 4. Criar diretório de logs se não existir
mkdir -p logs

# 5. Parar aplicação anterior (se existir)
echo -e "${YELLOW}🛑 Parando aplicação anterior...${NC}"
pm2 stop andreia-molina-exclusive 2>/dev/null || echo "Nenhuma aplicação anterior encontrada"

# 6. Iniciar aplicação com PM2
echo -e "${YELLOW}▶️  Iniciando aplicação com PM2...${NC}"
pm2 start ecosystem.config.js

# 7. Salvar configuração do PM2
echo -e "${YELLOW}💾 Salvando configuração do PM2...${NC}"
pm2 save

# 8. Configurar PM2 para iniciar no boot
echo -e "${YELLOW}🔄 Configurando PM2 para iniciar automaticamente...${NC}"
pm2 startup systemd -u $USER --hp $HOME 2>/dev/null || echo "PM2 startup já configurado"

echo ""
echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
echo ""
echo "📊 Status da aplicação:"
pm2 status

echo ""
echo "📝 Para ver os logs em tempo real:"
echo "   pm2 logs andreia-molina-exclusive"
echo ""
echo "🌐 Seu site está rodando em:"
echo "   http://212.85.22.73:3000"
echo ""
