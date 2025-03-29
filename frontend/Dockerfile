# Build Angular app
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Serve Angular app with nginx and custom configuration
FROM nginx:stable-alpine
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Use your custom configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

