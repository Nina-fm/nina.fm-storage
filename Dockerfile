# Utilise l'image Node officielle en Alpine pour la légèreté
FROM node:18-alpine

# Définit le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copie package.json + package-lock.json puis installe les dépendances
COPY package*.json ./
RUN npm install --production

# Copie le reste du code
COPY . .

# Crée le dossier d'uploads (sera monté depuis le volume)
RUN mkdir -p ${UPLOAD_PATH:-storage}

# Expose le port sur lequel tourne Express
EXPOSE 3000

# Définit la commande de démarrage
CMD [ "node", "index.js" ]