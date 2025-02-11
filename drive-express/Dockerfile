# ---------- Stage 1: Builder ----------
    FROM node:20-alpine AS builder
    WORKDIR /app
    
    # Installer OpenSSL 
    RUN apk add --no-cache openssl
    
    COPY package*.json ./
    RUN npm ci
    
    COPY . .
    
    # Générer le client Prisma 
    RUN npx prisma generate
    
    # Compiler l'application Next.js en production
    RUN npm run build
    
    # ---------- Stage 2: Runner ----------
    FROM node:20-alpine AS runner
    WORKDIR /app
    
    # Installer OpenSSL dans l'image finale
    RUN apk add --no-cache openssl
    
    # Copier les dépendances compilées et le build depuis l'étape builder
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/package.json ./package.json
    
    # Définir la variable d'environnement en production
    ENV NODE_ENV=production
    
    # Exposer le port utilisé par l'application (ici 3000)
    EXPOSE 3000
    
    # Commande de démarrage : ici, "next start" démarre l’application Next.js en mode production
    CMD ["npm", "run", "dev"]