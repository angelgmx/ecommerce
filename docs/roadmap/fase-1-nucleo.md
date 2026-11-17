# Fase 1 · Núcleo del dominio

- **Estado:** completada
- **Fechas:** 5 – 17 nov 2026
- **Decisiones:** [ADR-0002](../adr/0002-un-inquilino-por-instalacion.md) · [ADR-0003](../adr/0003-estado-inmutable-en-el-nucleo.md) · [ADR-0006](../adr/0006-el-producto-sale-del-esquema-de-zod.md)

## Objetivo

Implementar la lógica de la tienda (catálogo, carrito, descuentos y pedido) en TypeScript puro, sin framework ni base de datos, para que las reglas de negocio se puedan probar de forma aislada y reutilizar desde cualquier capa.

## Resultado

| Métrica | Valor |
| --- | --- |
| Módulos del dominio | 9 |
| Tests unitarios | 97 |
| Cobertura de líneas | 98,4 % |
| Dependencias de ejecución | 1 (Zod) |

## Entregables

### Modelo y catálogo

- [x] Producto con precios en céntimos enteros y categorías cerradas.
- [x] Catálogo: buscar por id, filtrar por categoría y ordenar por precio sin modificar el original.
- [x] Catálogo asíncrono con caché encapsulada en una *closure*.

### Carrito y descuentos

- [x] Carrito inmutable: añadir, quitar y cambiar cantidad.
- [x] Comprobaciones de cantidad, existencia y stock con un error propio (`ErrorCarrito`).
- [x] Subtotal, descuentos por porcentaje con redondeo al céntimo y cupones (porcentaje o importe fijo) con total nunca negativo.

### Pedido

- [x] Checkout que vuelve a validar el carrito y copia nombre y precio de cada línea.
- [x] Ciclo de vida `pendiente → pagado → enviado`, solo hacia delante, con `ErrorPedido`.

### Infraestructura del dominio

- [x] Contrato `Repositorio<T>` genérico y su implementación en memoria.
- [x] Validación de productos externos con Zod; tipos derivados del esquema.
- [x] TypeScript estricto en todo el núcleo.

### Calidad

- [x] Tests unitarios con Vitest para todos los módulos, incluidos casos límite y de error.
- [x] Tests de inmutabilidad: ninguna operación modifica su entrada.
- [x] Umbral de cobertura del 80 % que hace fallar la ejecución si no se alcanza.

## Criterios de aceptación

- [x] `npm run check` compila sin errores en modo estricto.
- [x] `npm test` pasa todos los tests.
- [x] `npm run coverage` supera el 80 % en líneas, ramas, funciones y sentencias.
- [x] El núcleo no depende de ningún framework ni librería de infraestructura.

## Pendiente para fases posteriores

- El stock no se descuenta al hacer checkout: requiere transacciones ([fase 5](fase-5-pedidos.md)).
- Los cupones no tienen caducidad ni límite de usos: se añadirán cuando se gestionen desde la base de datos.
- SKU como referencia de negocio del producto ([ADR-0006](../adr/0006-el-producto-sale-del-esquema-de-zod.md)).
