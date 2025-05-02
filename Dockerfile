# Imagem base do Node
FROM node:22.1.0

# Definindo diretório de trabalho
WORKDIR /usr/src/app

# Copiando package.json e package-lock.json
COPY package*.json ./

# Instalando dependências
RUN npm install

# Copiando restante do projeto
COPY . .

# Build da aplicação Next.js
RUN npm run build

# Expondo a porta 3000
EXPOSE 3000

# Comando para iniciar o servidor Next.js em produção
CMD ["npm", "start"]
