# Build stage
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Runtime stage - nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist/your-angular-project-name /usr/share/nginx/html

# Copia config personalizzata nginx (opzionale)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
