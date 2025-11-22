#!/bin/bash

# Script de Setup Inicial do Servidor Hostinger VPS
# Execute este script UMA VEZ no servidor novo

set -e

echo "🔧 Configurando servidor Hostinger VPS..."
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Atualizar sistema
echo -e "${YELLOW}📦 Atualizando sistema...${NC}"
sudo apt update && sudo apt upgrade -y

# 2. Instalar Node.js 22.x
echo -e "${YELLOW}📦 Instalando Node.js 22.x...${NC}"
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Instalar pnpm
echo -e "${YELLOW}📦 Instalando pnpm...${NC}"
sudo npm install -g pnpm

# 4. Instalar PM2
echo -e "${YELLOW}📦 Instalando PM2...${NC}"
sudo npm install -g pm2

# 5. Instalar MySQL (se ainda não instalado)
echo -e "${YELLOW}🗄️  Instalando MySQL Server...${NC}"
sudo apt install -y mysql-server

# 6. Iniciar e habilitar MySQL
echo -e "${YELLOW}▶️  Iniciando MySQL...${NC}"
sudo systemctl start mysql
sudo systemctl enable mysql

# 7. Instalar Git (se ainda não instalado)
echo -e "${YELLOW}📦 Instalando Git...${NC}"
sudo apt install -y git

# 8. Configurar firewall
echo -e "${YELLOW}🔥 Configurando firewall...${NC}"
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 3000/tcp  # Aplicação Node.js
sudo ufw --force enable

echo ""
echo -e "${GREEN}✅ Servidor configurado com sucesso!${NC}"
echo ""
echo "📝 Próximos passos:"
echo "1. Configure o banco de dados MySQL:"
echo "   sudo mysql_secure_installation"
echo ""
echo "2. Crie o banco de dados:"
echo "   sudo mysql"
echo "   CREATE DATABASE andreia_molina;"
echo "   CREATE USER 'andreia'@'localhost' IDENTIFIED BY 'sua_senha_forte';"
echo "   GRANT ALL PRIVILEGES ON andreia_molina.* TO 'andreia'@'localhost';"
echo "   FLUSH PRIVILEGES;"
echo "   EXIT;"
echo ""
echo "3. Clone o projeto e configure o .env.production"
echo ""
