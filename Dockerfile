# Dockerfile para Easypanel - Andreia Molina Exclusive
# Multi-stage build para otimizar o tamanho da imagem

# Stage 1: Build
FROM node:22-alpine AS builder

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@10.15.1 --activate

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar código fonte
COPY . .

# Build do projeto (frontend + backend)
RUN pnpm run build

# Stage 2: Production
FROM node:22-alpine

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@10.15.1 --activate

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e pnpm-lock.yaml
COPY --chown=nodejs:nodejs package.json pnpm-lock.yaml ./
COPY --chown=nodejs:nodejs patches ./patches

# Instalar apenas dependências de produção
RUN pnpm install --frozen-lockfile --prod

# Copiar build do stage anterior
COPY --chown=nodejs:nodejs --from=builder /app/dist ./dist
COPY --chown=nodejs:nodejs --from=builder /app/drizzle ./drizzle
COPY --chown=nodejs:nodejs --from=builder /app/server ./server
COPY --chown=nodejs:nodejs --from=builder /app/shared ./shared

# Criar diretório de logs
RUN mkdir -p logs && chown nodejs:nodejs logs

# Mudar para usuário não-root
USER nodejs

# Expor porta
EXPOSE 3000

# Variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=3000

# Comando de inicialização
CMD ["node", "dist/index.js"]
