# ADR-0009: SKU único por producto

- **Estado:** propuesta
- **Fecha:** 2026-11-23
- **Fase:** 3

> Cada producto tendrá un código SKU único. Crear un producto con un SKU que ya existe se rechaza con `409 Conflict`. Se implementa en la fase 3, cuando la base de datos pueda garantizar la unicidad.

## Contexto

Al diseñar el contrato de la API ([tarea 2.1](../roadmap/fase-2-api.md#21--contrato-de-la-api)) surge la pregunta de qué ocurre si se crea un producto que ya existe.

Hoy no hay forma de detectarlo:

- El `id` lo asigna el sistema ([ADR-0006](0006-el-producto-sale-del-esquema-de-zod.md)), así que cada `POST /productos` crea uno nuevo.
- Ningún campo del producto es único: dos productos pueden tener el mismo nombre.

El resultado es que un reintento del cliente o un error de quien gestiona el catálogo crea duplicados sin aviso.

## Opciones consideradas

| Opción | A favor | En contra |
| --- | --- | --- |
| **Sin regla: se permiten duplicados** | Nada que implementar | Duplicados silenciosos en el catálogo |
| **Nombre único** | No añade campos | Dos productos distintos pueden llamarse igual («Camiseta» en dos colores) |
| **SKU único** (*Stock Keeping Unit*) | Estándar del comercio: identifica cada variante de producto; lo usan inventarios, proveedores y marketplaces | Un campo más que el cliente debe enviar |

## Decisión

**SKU único**, a partir de la fase 3.

1. El producto gana un campo `sku`: texto obligatorio, normalizado a mayúsculas y sin espacios.
2. La unicidad la garantiza la base de datos con una restricción `UNIQUE`, no solo el código.
3. `POST /productos` con un SKU existente responde `409 Conflict`: la petición es válida, pero choca con el estado actual del catálogo.
4. Hasta la fase 3, la API permite duplicados y `POST /productos` solo responde `201` o `400`.

## Consecuencias

**Positivas:** el catálogo no acumula duplicados; el SKU servirá para importar productos y para integrarse con proveedores.

**Negativas:** cambia el esquema del producto, sus tests y el contrato de la API; los datos de ejemplo necesitan un SKU.

## Implementación

Pendiente de la fase 3: `EsquemaProducto`, la migración con la restricción `UNIQUE` y la fila de RF-03 en [`api.md`](../arquitectura/api.md).
