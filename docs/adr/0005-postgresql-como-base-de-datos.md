# ADR-0005: PostgreSQL como base de datos

- **Estado:** aceptada
- **Fecha:** 2026-11-12
- **Fase:** 3

> Una tienda es relacional y necesita transacciones. Las restricciones críticas, como el stock no negativo, viven también en la base de datos: es la última línea de defensa.

## Contexto

Los datos de una tienda son relacionales: productos con categorías, usuarios con pedidos, pedidos con líneas. Crear un pedido y descontar el stock debe ocurrir entero o no ocurrir, y dos compras simultáneas de la última unidad no pueden completarse ambas.

## Opciones consideradas

| Opción | A favor | En contra |
| --- | --- | --- |
| **PostgreSQL** | Transacciones sólidas, `CHECK`, bloqueos de fila, JSONB si hace falta | El esquema se mantiene con migraciones |
| MySQL | Muy extendida | Menos tipos y restricciones que PostgreSQL |
| MongoDB | Esquema flexible | El modelo es relacional; relaciones y transacciones menos naturales |

## Decisión

**PostgreSQL.** El ORM se decide en un ADR propio en la fase 3.

1. Las reglas importantes se duplican en la base de datos: `CHECK (stock >= 0)`, claves foráneas y `NOT NULL`.
2. Los importes se guardan como enteros en céntimos (`INTEGER`), igual que en el código.

## Consecuencias

**Positivas:** los datos quedan protegidos aunque el código falle; transacciones para los pedidos y bloqueos para la concurrencia; disponible como servicio gestionado en AWS (RDS).

**Negativas:** cada cambio de esquema necesita una migración, y el desarrollo local requiere un servidor de base de datos (Docker).
