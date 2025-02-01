# Usa Node.js per costruire l'app Angular
FROM node:18 AS build
WORKDIR /app

# Copia i file di dipendenze
COPY package.json package-lock.json ./
RUN npm install

# Copia tutto il codice sorgente
COPY . .

# Costruisce l'app Angular in modalità produzione
RUN npm run build --configuration=production

# Usa Nginx per servire l'app Angular
FROM nginx:alpine
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Espone la porta 80 per il traffico HTTP
EXPOSE 80

# Avvia Nginx
CMD ["nginx", "-g", "daemon off;"]
