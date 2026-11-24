# Decisiones de arquitectura (ADR)

Un ADR (*Architecture Decision Record*) documenta una decisión difícil de deshacer: el contexto, las opciones valoradas, la elegida y lo que se pierde con ella. Formato basado en [Michael Nygard](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions).

Los ficheros viven en esta carpeta numerados por orden cronológico; el registro los agrupa por la fase en la que se tomaron. Una decisión puede afectar a fases posteriores.

## Registro

### Fase 0 · Bases

| ADR | Decisión | Estado |
| --- | --- | --- |
| [0001](0001-licencia-mit.md) | Licencia MIT | ✅ aceptada |

### Fase 1 · Núcleo del dominio

| ADR | Decisión | Estado |
| --- | --- | --- |
| [0002](0002-un-inquilino-por-instalacion.md) | Un inquilino por instalación | ✅ aceptada |
| [0003](0003-estado-inmutable-en-el-nucleo.md) | Estado inmutable en el núcleo | ✅ aceptada |
| [0006](0006-el-producto-sale-del-esquema-de-zod.md) | El tipo Producto se deriva del esquema de Zod | ✅ aceptada |

### Fase 2 · API REST

| ADR | Decisión | Estado |
| --- | --- | --- |
| [0004](0004-nestjs-para-la-api.md) | NestJS para la API | ✅ aceptada |
| [0007](0007-validacion-con-zod-en-la-api.md) | Validación con Zod también en la API | ✅ aceptada |
| [0008](0008-monorepo-con-npm-workspaces.md) | Monorepo con npm workspaces | 📝 propuesta |
| — | Dónde vive el carrito entre peticiones | ⏳ pendiente |

### Fase 3 · Persistencia

| ADR | Decisión | Estado |
| --- | --- | --- |
| [0005](0005-postgresql-como-base-de-datos.md) | PostgreSQL como base de datos | ✅ aceptada |
| [0009](0009-sku-unico-por-producto.md) | SKU único por producto | 📝 propuesta |
| — | ORM: Prisma o alternativa | ⏳ pendiente |

### Fases 4 a 9

| Fase | Decisión | Estado |
| --- | --- | --- |
| 4 | Dónde se guarda el token de sesión | ⏳ pendiente |
| 5 | Cómo se evita vender más stock del que hay | ⏳ pendiente |
| 6 | Flujo de pago con Stripe | ⏳ pendiente |
| 6 | Procesamiento síncrono o mediante colas | ⏳ pendiente |
| 9 | Servicios de AWS | ⏳ pendiente |

## Proceso

1. Copiar [la plantilla](0000-plantilla.md) con el siguiente número libre. Los números no se reutilizan.
2. Se abre como `propuesta` y pasa a `aceptada` cuando se implementa.
3. Una decisión aceptada no se reescribe: si cambia, se crea un ADR nuevo y el anterior pasa a `sustituida por ADR-NNNN`.
4. Al crear un ADR se añade a este registro, en la fase en la que se toma.
