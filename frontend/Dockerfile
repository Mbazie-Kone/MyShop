# Usa Nginx per servire Angular
FROM nginx:alpine
COPY --from=build /app/dist/frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf  # 👈 Aggiunge la configurazione personalizzata

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

