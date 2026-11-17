<div align="center">

<img src="docs/assets/portada.png" alt="openecommerce: plantilla open source para montar tu propia tienda online" width="100%">

<br>

**Una tienda online que es tuya de verdad: tu código, tus datos y tus clientes.**

![Estado](https://img.shields.io/badge/estado-en%20construcción-2747D6?style=flat-square&labelColor=1B1916)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-2747D6?style=flat-square&logo=typescript&logoColor=white&labelColor=1B1916)
![NestJS](https://img.shields.io/badge/NestJS-API-E0533A?style=flat-square&logo=nestjs&logoColor=white&labelColor=1B1916)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-datos-9ED9BC?style=flat-square&logo=postgresql&logoColor=white&labelColor=1B1916)
![Licencia](https://img.shields.io/badge/licencia-MIT-B9A7F2?style=flat-square&labelColor=1B1916)

[Qué es](#qué-es) · [Hoja de ruta](#hoja-de-ruta) · [Cómo está hecho](#cómo-está-hecho) · [Empezar](#empezar) · [Documentación](docs/README.md)

</div>

<br>

## Qué es

**openecommerce** es una plantilla open source para montar una tienda online sin empezar de cero y sin depender de una plataforma cerrada. La descargas, la configuras y vendes lo tuyo: catálogo, carrito, usuarios, pedidos y pagos.

El foco está en el **backend**: una API sólida, segura y bien probada, pensada para los problemas que aparecen cuando una tienda vende de verdad.

| El problema | Cómo lo resuelve |
| --- | --- |
| `0.1 + 0.2` no da `0.3` y los totales se descuadran | Todos los precios van en **céntimos enteros** |
| Dos personas compran la última unidad a la vez | **Transacciones** y control de stock en la base de datos |
| Stripe avisa dos veces del mismo pago | **Webhooks idempotentes**: cobrar una vez, aunque el aviso llegue dos |
| Un error en el carrito deja datos a medias | El dominio **nunca modifica el original**: cada operación devuelve un estado nuevo |
| Un producto cambia de precio y los pedidos antiguos dejan de cuadrar | Cada pedido **copia nombre y precio** en el momento de la compra |

> [!NOTE]
> El proyecto está en construcción y avanza por fases. Este README se actualiza al cerrar cada una.

## Hoja de ruta

**Fase 1 · Núcleo del dominio** <sub>completada · v0.1.0</sub>

- [x] Modelo de producto con precios en céntimos
- [x] Catálogo: buscar por id, filtrar por categoría y ordenar por precio
- [x] Carrito inmutable: añadir, quitar y cambiar cantidad
- [x] Comprobaciones del carrito con errores propios
- [x] Catálogo asíncrono con caché
- [x] Subtotal, descuentos y cupones
- [x] Pedido inmutable: checkout desde el carrito y estados pendiente → pagado → enviado
- [x] TypeScript estricto en todo el núcleo
- [x] Repositorio genérico en memoria
- [x] Validación de datos externos con Zod
- [x] 97 tests con Vitest y cobertura del 98 %

**Siguientes fases** · [hoja de ruta completa](docs/roadmap/README.md)

- [ ] **API REST** con NestJS: validación, errores coherentes y documentación con Swagger
- [ ] **Base de datos:** PostgreSQL con Prisma
- [ ] **Usuarios:** registro, login con JWT, roles y seguridad (OWASP)
- [ ] **Pedidos:** transacciones, control de stock y concurrencia
- [ ] **Pagos** con Stripe: checkout y webhooks idempotentes
- [ ] **Colas y caché** con Redis
- [ ] **Tienda web** con Next.js y shadcn/ui, y panel de administración
- [ ] **Producción:** Docker, CI con GitHub Actions y despliegue en AWS

## Cómo está hecho

![El núcleo: un módulo por responsabilidad](docs/assets/diagramas/estructura-src.png)

Cada módulo tiene sus tests al lado (`*.test.ts`).

El núcleo no depende de ningún framework: son funciones puras en TypeScript. Cuando llegue NestJS, la API envolverá este núcleo en lugar de reescribirlo. Más detalle en la [arquitectura](docs/arquitectura/README.md).

![Capas de openecommerce](docs/assets/diagramas/arquitectura-capas.png)

### Stack

| Capa | Tecnología |
| --- | --- |
| Lenguaje | TypeScript en modo `strict` |
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
npm test
```

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Ejecuta el proyecto |
| `npm run check` | Revisa los tipos con TypeScript |
| `npm test` | Ejecuta los tests en modo vigilancia |
| `npm run coverage` | Ejecuta los tests una vez y comprueba la cobertura mínima |

Cada módulo se puede ejecutar por separado con Node, por ejemplo `node src/catalogo-remoto.ts`.

## Decisiones de diseño

Cada decisión importante se documenta como un ADR (*Architecture Decision Record*): qué problema había, qué opciones se valoraron, cuál se eligió y qué se pierde con ella. Registro completo en [`docs/adr`](docs/adr/README.md).

| Decisión | ADR |
| --- | --- |
| Un inquilino por instalación | [0002](docs/adr/0002-un-inquilino-por-instalacion.md) |
| Estado inmutable en el núcleo | [0003](docs/adr/0003-estado-inmutable-en-el-nucleo.md) |
| NestJS para la API | [0004](docs/adr/0004-nestjs-para-la-api.md) |
| PostgreSQL como base de datos | [0005](docs/adr/0005-postgresql-como-base-de-datos.md) |
| Tipos derivados de los esquemas de Zod | [0006](docs/adr/0006-el-producto-sale-del-esquema-de-zod.md) |

## Contribuir

Las ideas y los fallos encontrados son bienvenidos: abre un *issue* contando qué esperabas y qué pasó. Para cambios de código, lee la [guía de contribución](CONTRIBUTING.md).

## Licencia

[MIT](LICENSE): puedes usarlo, modificarlo y venderlo, siempre que mantengas el aviso de copyright.

<br>

<div align="center">

Hecho por **[Ángel Gómez](https://github.com/angelgmx)**

</div>
