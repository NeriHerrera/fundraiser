# Fundraiser — Página de muestra dockerizada

Sitio estático con Nginx, listo para ser publicado detrás de Traefik en el dominio configurado.

## Requisitos

- Docker/Docker Desktop
- Traefik ejecutándose con el provider de Docker y una red Docker compartida (por ejemplo `traefik` o `proxy`).
- DNS del dominio apuntando al host donde corre Traefik.

## Estructura

- `site/` — HTML/CSS/JS de la página
- `Dockerfile` — Imagen basada en `nginx:alpine`
- `docker-compose.yml` — Servicio con labels de Traefik
- `.env` — Variables para dominio/red/entrypoints/resolver

## Configuración rápida

1) Verifica el nombre de la red de Traefik:

```bash
docker network ls
```

2) Ajusta `.env` si es necesario:

- `DOMAIN=fundraiser.com.ar`
- `TRAEFIK_NETWORK=traefik` (cámbialo al nombre real si difiere)
- `ENTRYPOINT_WEB=web` y `ENTRYPOINT_WEBSECURE=websecure` (ajusta a tu Traefik)
- `CERT_RESOLVER=letsencrypt` (ajusta al resolver configurado en Traefik)

3) Construye y levanta el servicio:

```bash
docker compose up -d --build
```

4) Comprueba que Traefik detectó el router/servicio:

- Panel de Traefik (si lo tienes habilitado), o
- Logs del contenedor: `docker compose logs -f`

## HTTPS y redirección

El `docker-compose.yml` crea:

- Un router HTTPS en `${ENTRYPOINT_WEBSECURE}` con TLS y `certresolver`.
- Un router HTTP en `${ENTRYPOINT_WEB}` que redirige a HTTPS.

Si aún no tienes certificados automáticos, puedes comentar las labels `tls.*` para servir solo HTTP.

## Agregar `www`

Para incluir `www.fundraiser.com.ar`, agrega otra condición en la regla del router, por ejemplo:

```yaml
- "traefik.http.routers.${PROJECT_NAME}.rule=Host(`${DOMAIN}`) || Host(`www.${DOMAIN}`)"
```

Asegúrate de tener el registro DNS de `www` apuntando al mismo host.

## Desarrollo

- Edita archivos en `site/` y vuelve a construir: `docker compose up -d --build`.
- Para bajar el servicio: `docker compose down`.

---

Hecho con cariño para un arranque rápido detrás de Traefik.
