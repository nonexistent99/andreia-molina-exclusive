#!/bin/bash

# Script para aplicar migrações do banco de dados
# Usado no Easypanel antes de iniciar a aplicação

set -e

echo "🗄️  Aplicando migrações do banco de dados..."

# Verificar se DATABASE_URL está configurada
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Erro: DATABASE_URL não está configurada"
    exit 1
fi

# Aplicar migrações
pnpm db:push

echo "✅ Migrações aplicadas com sucesso!"
