# Fase 9 · Despliegue y plantilla

- **Estado:** pendiente
- **Fechas:** 25 feb – 18 mar 2027
- **Versión al cerrar:** `v1.0.0`
- **Decisiones:** prevista: servicios de AWS

## Objetivo

Desplegar la tienda en AWS y convertirla en una plantilla que cualquiera pueda instalar, configurar y extender.

## Entregables

### Despliegue

- [ ] Cuenta de AWS con usuarios y permisos mínimos.
- [ ] Base de datos gestionada y almacenamiento de ficheros.
- [ ] API y web en contenedores, con dominio y HTTPS.
- [ ] Despliegue automático desde `main`.
- [ ] Infraestructura documentada en `docs/arquitectura/despliegue.md`.

### Plantilla

- [ ] Configuración de la tienda (nombre, moneda, categorías) fuera del código.
- [ ] Puntos de extensión documentados.
- [ ] Guía de instalación y despliegue.
- [ ] Publicación de la versión `1.0.0`.

### Operación

- [ ] Logs estructurados con identificador de petición.
- [ ] Métricas de negocio y de sistema.
- [ ] Pruebas de carga del flujo de compra con resultados documentados.
- [ ] Documento de diseño: cómo escalaría la tienda ante un pico de tráfico.

## Criterios de aceptación

- Un usuario nuevo instala y despliega su tienda siguiendo solo la documentación.
- Un error en producción se puede rastrear desde la petición hasta el log.
