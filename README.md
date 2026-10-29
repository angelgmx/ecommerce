<div align="center">

# ecommerce

**Plantilla open source para montar tu propia tienda online.**
Backend en TypeScript y NestJS, pensado para que cualquiera lo descargue, lo configure y venda lo suyo.

![Estado](https://img.shields.io/badge/estado-en%20desarrollo-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-backend-E0234E?logo=nestjs&logoColor=white)
![Licencia](https://img.shields.io/badge/licencia-MIT-green)

</div>

---

## Qué es

Una tienda online completa que puedes usar como punto de partida: catálogo, carrito, usuarios, pedidos y pagos. La idea es que no tengas que empezar de cero ni depender de una plataforma cerrada.

El foco está en el **backend**: una API sólida, segura y bien probada, que aguante los casos reales de una tienda (stock que se agota mientras dos personas compran, pagos que llegan dos veces, pedidos que hay que deshacer).

> **Estado actual:** en construcción. El proyecto avanza por fases y este README se actualiza con cada una.

## Hoja de ruta

- [ ] **Núcleo del dominio:** catálogo, carrito y descuentos en TypeScript puro, con tests
- [ ] **API REST** con NestJS: validación, errores coherentes y documentación con Swagger
- [ ] **Base de datos:** PostgreSQL con Prisma
- [ ] **Usuarios:** registro, login con JWT, roles y seguridad (OWASP)
- [ ] **Pedidos:** transacciones, control de stock y concurrencia
- [ ] **Pagos** con Stripe: checkout y webhooks idempotentes
- [ ] **Colas y caché** con Redis
- [ ] **Tienda web** con Next.js y shadcn/ui, y panel de administración
- [ ] **Producción:** Docker, CI con GitHub Actions y despliegue en AWS

## Stack

| Capa | Tecnología |
| --- | --- |
| Lenguaje | TypeScript (modo `strict`) |
| Backend | NestJS |
| Base de datos | PostgreSQL + Prisma |
| Pagos | Stripe |
| Caché y colas | Redis |
| Frontend | Next.js + shadcn/ui |
| Tests | Vitest |
| Infraestructura | Docker, GitHub Actions y AWS |

## Empezar

**Requisitos:** Node.js 24 o superior y npm.

```bash
git clone https://github.com/angelgmx/ecommerce.git
cd ecommerce
npm install
npm run dev
```

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Ejecuta el proyecto |
| `npm run check` | Revisa los tipos con TypeScript |

## Decisiones de diseño

Las decisiones importantes (por qué los precios se guardan en céntimos, por qué esta arquitectura…) se documentan como ADR en `docs/adr/` a medida que se toman.

## Contribuir

Las ideas y los fallos encontrados son bienvenidos: abre un *issue* contando qué esperabas y qué pasó. Para cambios de código, abre primero un *issue* para comentarlo.

## Licencia

[MIT](LICENSE): puedes usarlo, modificarlo y venderlo, siempre que mantengas el aviso de copyright.

---

<div align="center">

Hecho por **[Ángel Gómez](https://github.com/angelgmx)**

</div>
