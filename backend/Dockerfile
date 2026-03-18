# Dockerfile para o Backend - GZ Company
FROM node:20-alpine

# Instalar OpenSSL para compatibilidade com Prisma
RUN apk add --no-cache openssl

# Criar diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci --only=production

# Gerar Prisma Client
RUN npx prisma generate

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
