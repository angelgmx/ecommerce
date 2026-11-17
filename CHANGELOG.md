# Changelog

Cambios relevantes de cada versión. Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/); el proyecto sigue [versionado semántico](https://semver.org/lang/es/).

## [Sin publicar]

### Añadido

- Documentación técnica en `docs/`: arquitectura, hoja de ruta por fases y registro de decisiones (ADR).

## [0.1.0] - 2026-11-17

Núcleo del dominio en TypeScript puro ([fase 1](docs/roadmap/fase-1-nucleo.md)).

### Añadido

- Modelo de producto con precios en céntimos, validado con Zod y con los tipos derivados del esquema.
- Catálogo con búsqueda, filtro por categoría y orden por precio; versión asíncrona con caché.
- Carrito inmutable con comprobaciones de cantidad, existencia y stock.
- Subtotal, descuentos y cupones de porcentaje o importe fijo.
- Pedido con checkout desde el carrito y ciclo de vida `pendiente → pagado → enviado`.
- Repositorio genérico en memoria.
- 97 tests unitarios con Vitest y umbral de cobertura del 80 %.

[Sin publicar]: https://github.com/angelgmx/ecommerce/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/angelgmx/ecommerce/releases/tag/v0.1.0
