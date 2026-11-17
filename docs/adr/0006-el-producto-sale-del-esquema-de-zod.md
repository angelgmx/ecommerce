# ADR-0006: El tipo Producto se deriva del esquema de Zod

- **Estado:** aceptada
- **Fecha:** 2026-11-16
- **Fase:** 1

> Todo lo que entra se valida con Zod y los tipos se derivan del esquema, de modo que tipo y validación no pueden contradecirse. El identificador lo genera el sistema, nunca el cliente.

## Contexto

Los productos empiezan a llegar desde fuera (panel de administración, API, ficheros) como JSON. Los tipos de TypeScript desaparecen al ejecutar, así que no protegen frente a datos inválidos: hace falta validar en tiempo de ejecución.

Al validar aparecen dos descripciones del mismo producto: el tipo escrito a mano y las reglas de validación. Si una cambia y la otra no, el código compila pero acepta o rechaza lo que no debe.

Además, hay que decidir si el `id` lo envía quien crea el producto o lo asigna el sistema.

## Opciones consideradas

| Opción | A favor | En contra |
| --- | --- | --- |
| **Esquema de Zod como única fuente; tipos derivados** | Tipo y validación siempre de acuerdo | Los tipos dependen de una librería |
| Tipo y esquema escritos por separado | Tipos sin dependencias | Dos fuentes que divergen sin aviso del compilador |
| Tipo a mano con *type guards* propios | Sin librerías | Código repetitivo, no acumula errores, mismas dos fuentes |

Sobre el identificador:

| Opción | A favor | En contra |
| --- | --- | --- |
| **Lo asigna el sistema** | Imposible sobrescribir un producto existente o provocar colisiones | El esquema de entrada difiere del de la entidad |
| Lo envía el cliente | Un solo esquema | Permite pisar productos con `guardar` |

## Decisión

**El esquema de Zod es la única fuente de verdad del producto, y el `id` lo asigna el sistema.**

1. `Producto` y `Categoria` se derivan del esquema con `z.infer`.
2. Lo que llega de fuera (`NuevoProducto`) se deriva del mismo esquema sin `id` (`.omit`).
3. Esquemas y tipos viven en `producto.ts`.
4. La validación no lanza: devuelve el producto o la lista de errores por campo. Un JSON mal formado se convierte en un error más.
5. Los campos desconocidos se descartan en lugar de rechazarse.

## Consecuencias

**Positivas:** una frontera clara (si se tiene un `Producto`, ya está validado) y todos los errores de entrada en una sola pasada.

**Negativas:** el modelo depende de Zod. Con la base de datos (fase 3) el ORM generará su propio modelo y habrá que decidir cómo convive con el esquema.

**Pendiente:** el SKU, referencia de negocio que sí elige la tienda.

## Implementación

`src/producto.ts` (esquemas y tipos derivados) y `src/producto-entrada.ts` (`leerNuevoProducto`), cubiertos por `src/producto-entrada.test.ts`.
