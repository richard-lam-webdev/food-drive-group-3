# Utiliser une image officielle de Node.js comme base
FROM node:18-alpine

# Créer et définir le répertoire de travail dans le container
WORKDIR /app

# Copier le package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le reste du projet dans le container
COPY . .

# Exposer le port 3000
EXPOSE 3000

# Lancer Next.js en mode développement
CMD ["npm", "run", "dev"]
