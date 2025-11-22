#!/usr/bin/env bash

echo "🔧 Removendo dependências antigas e travas..."
rm -rf node_modules pnpm-lock.yaml package-lock.json

echo "🧹 Limpando cache..."
npm cache clean --force || true
pnpm store prune || true

echo "📦 Reinstalando dependências..."
npm install --legacy-peer-deps

echo "🔧 Ajustando vite.config.ts..."
sed -i 's/@builder.io\/vite-plugin-jsx-loc//' vite.config.ts 2>/dev/null || true

echo "🗑️ Removendo plugin conflitante..."
npm uninstall @builder.io/vite-plugin-jsx-loc

echo "✨ Finalizado!"
