# Hoja de ruta

El proyecto avanza por fases. Cada una cierra con un entregable funcional, probado y documentado; una fase no empieza hasta que la anterior cumple su definición de terminado.

| Fase | Entregable | Estado | Fechas |
| --- | --- | --- | --- |
| [0 · Bases](fase-0-bases.md) | Repositorio público con licencia y convenciones | ✅ completada | 29 oct – 4 nov 2026 |
| [1 · Núcleo del dominio](fase-1-nucleo.md) | Lógica de la tienda en TypeScript puro, con tests | ✅ completada | 5 – 17 nov 2026 |
| [2 · API REST](fase-2-api.md) | API de productos y carrito con NestJS | 🔜 siguiente | 24 nov – 4 dic 2026 |
| [3 · Persistencia](fase-3-persistencia.md) | PostgreSQL con Prisma y migraciones | pendiente | 7 – 21 dic 2026 |
| [4 · Usuarios y seguridad](fase-4-usuarios-y-seguridad.md) | Registro, login con JWT, roles y revisión OWASP | pendiente | 22 dic 2026 – 5 ene 2027 |
| [5 · Pedidos](fase-5-pedidos.md) | Pedidos transaccionales sin sobreventa | pendiente | 7 – 18 ene 2027 |
| [6 · Pagos y colas](fase-6-pagos-y-colas.md) | Stripe con webhooks, caché y colas con Redis | pendiente | 19 – 28 ene 2027 |
| [7 · Tienda web](fase-7-tienda-web.md) | Tienda y panel de administración con Next.js | pendiente | 29 ene – 12 feb 2027 |
| [8 · Calidad y entrega](fase-8-calidad-y-entrega.md) | Tests por niveles, Docker y CI | pendiente | 15 – 24 feb 2027 |
| [9 · Despliegue y plantilla](fase-9-despliegue-y-plantilla.md) | AWS, observabilidad y versión 1.0.0 | pendiente | 25 feb – 18 mar 2027 |

## Definición de terminado

Aplica a todas las fases, además de los criterios propios de cada una:

- El código compila en modo estricto y todos los tests pasan.
- La cobertura del código nuevo supera el 80 %.
- Cada decisión difícil de deshacer tiene su [ADR](../adr/README.md).
- El README y esta hoja de ruta reflejan el estado real.
- La fase queda marcada con una etiqueta de versión (`v0.N.0`) y su entrada en el [CHANGELOG](../../CHANGELOG.md).
