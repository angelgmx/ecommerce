# ADR-0007: Validación con Zod también en la API

- **Estado:** aceptada
- **Fecha:** 2026-11-17
- **Fase:** 2

> La API valida con los mismos esquemas de Zod que el núcleo, mediante el `StandardSchemaValidationPipe` de NestJS. Un solo sistema de validación y una sola fuente de verdad por modelo.

## Contexto

NestJS valida tradicionalmente con DTOs: clases decoradas con `class-validator`. El núcleo ya describe sus modelos con esquemas de Zod ([ADR-0006](0006-el-producto-sale-del-esquema-de-zod.md)). Usar DTOs supondría describir el mismo producto dos veces, con dos librerías, en dos capas.

Desde NestJS 12, los decoradores `@Body()`, `@Param()` y `@Query()` aceptan cualquier esquema compatible con [Standard Schema](https://standardschema.dev/), Zod incluido, y `@nestjs/swagger` genera OpenAPI a partir de esquemas de Zod 4.2+ sin configuración.

## Opciones consideradas

| Opción | A favor | En contra |
| --- | --- | --- |
| **Zod con `StandardSchemaValidationPipe`** | Reutiliza los esquemas del núcleo; tipos inferidos; sin clases ni metadatos de reflexión | Menos ejemplos en tutoriales que `class-validator` |
| DTOs con `class-validator` | El enfoque más extendido en NestJS | Duplica cada modelo; dos librerías de validación; las reglas pueden divergir |
| Validar a mano en los servicios | Sin dependencias | Repetitivo y fácil de olvidar |

## Decisión

**Los esquemas de Zod del núcleo son los contratos de entrada de la API.**

1. `StandardSchemaValidationPipe` se registra de forma global.
2. Los controladores declaran el esquema en el decorador: `@Body({ schema: EsquemaNuevoProducto })`.
3. Los esquemas específicos de transporte (parámetros de ruta, *query strings*, que siempre llegan como texto) se definen en la API con coerción (`z.coerce.number()`), no en el núcleo.
4. No se instala `class-validator` ni `class-transformer`.

## Consecuencias

**Positivas:** cambiar una regla del producto actualiza a la vez el núcleo, la API y la documentación OpenAPI. Los errores de validación llegan con el campo prefijado (`precio: …`), igual que en el núcleo.

**Negativas:** los esquemas del núcleo pasan a formar parte del contrato público de la API; un cambio en ellos es un cambio de API.

## Implementación

Registro global del pipe en `main.ts` y en la configuración de los tests e2e; esquemas en los decoradores de cada controlador.
