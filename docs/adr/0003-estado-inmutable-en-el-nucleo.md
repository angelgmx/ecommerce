# ADR-0003: Estado inmutable en el núcleo

- **Estado:** aceptada
- **Fecha:** 2026-11-12
- **Fase:** 1

> Las operaciones del dominio son funciones puras: reciben un estado y devuelven otro. Si algo falla a mitad, no quedan datos a medias.

## Contexto

El carrito y el catálogo cambian constantemente. Si una función modifica el array que recibe, cualquier otro código que lo comparta ve el cambio sin esperarlo, y un error a mitad de una operación deja los datos en un estado intermedio.

## Opciones consideradas

| Opción | A favor | En contra |
| --- | --- | --- |
| Modificar el original (`push`, `sort`, asignación) | Menos memoria, más directo | Efectos secundarios difíciles de rastrear |
| **Devolver siempre un estado nuevo** | Sin sorpresas, fácil de probar, mismo modelo que React | Se crean copias |

## Decisión

**Ninguna función del núcleo modifica lo que recibe.**

1. Se usan `map`, `filter`, `toSorted` y spread en lugar de `push`, `splice`, `sort` o asignar propiedades.
2. Los datos fijos se marcan `readonly`, también los arrays internos de tipos como `Pedido`.
3. Las copias son superficiales: lo que no cambia se reutiliza.

## Consecuencias

**Positivas:** un fallo deja intacto el estado anterior; los tests comparan entrada y salida sin preocuparse de efectos intermedios; la tienda web (fase 7) detecta cambios comparando referencias.

**Negativas:** se crean estructuras nuevas en cada operación (irrelevante con carritos de pocas líneas), y la copia superficial no protege objetos anidados modificados a mano.

## Implementación

`carrito.ts`, `catalogo.ts` (`toSorted`), `catalogo-remoto.ts` (devuelve copias) y `pedido.ts` (tipos `readonly`; las transiciones de estado crean un pedido nuevo). Cubierto por los tests de inmutabilidad de cada módulo.
