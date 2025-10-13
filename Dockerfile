FROM nginx:1.27-alpine

# Copiamos el sitio estático
COPY ./site /usr/share/nginx/html

# Nginx ya expone el puerto 80 por defecto

