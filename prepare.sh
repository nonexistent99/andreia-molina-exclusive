#!/bin/bash

echo "========================================="
echo "🛠️ Preparando ambiente para build..."
echo "========================================="

# Criar pastas necessárias para o backend
echo "📁 Criando pastas fundamentais..."
mkdir -p client/public/assets
mkdir -p uploads
mkdir -p tmp
mkdir -p storage

# Exportar variáveis de ambiente diretamente no ambiente Nixpacks
echo "🔧 Configurando variáveis automaticamente..."

export PUBLIC_DIR="client/public"
export ASSETS_DIR="client/public/assets"
export UPLOAD_DIR="uploads"
export TMP_DIR="tmp"
export STORAGE_DIR="storage"

echo "✔️ Ambiente preparado com sucesso!"
