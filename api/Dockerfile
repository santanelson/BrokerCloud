FROM node:20-alpine AS builder

WORKDIR /app

# Copia pacotes e instala dependências
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

# Copia o resto do código
COPY . .

# Gera o Prisma client e faz o build do TypeScript
RUN npx prisma generate
RUN npm run build

# Imagem final de produção
FROM node:20-alpine

WORKDIR /app

# Copia apenas os arquivos necessários do build anterior
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

# Na inicialização, executa as migrações e roda a API
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
