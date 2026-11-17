# Fase 8 · Calidad y entrega

- **Estado:** pendiente
- **Fechas:** 15 – 24 feb 2027
- **Versión al cerrar:** `v0.8.0`

## Objetivo

Poder cambiar el código sin miedo y que la tienda arranque igual en cualquier máquina.

## Entregables

- [ ] Estrategia de tests por niveles revisada, con el flujo de compra cubierto de extremo a extremo.
- [ ] Imágenes Docker de producción (multietapa, sin dependencias de desarrollo, usuario sin privilegios).
- [ ] `docker compose` con API, web, PostgreSQL y Redis.
- [ ] Integración continua con GitHub Actions: tipos, lint, tests y cobertura en cada pull request.
- [ ] Protección de `main`: no se fusiona con la CI en rojo.

## Criterios de aceptación

- `docker compose up` levanta la tienda completa desde un clon limpio.
- Un pull request con un test roto no se puede fusionar.
