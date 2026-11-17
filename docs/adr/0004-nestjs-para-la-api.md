# ADR-0004: NestJS para la API

- **Estado:** aceptada
- **Fecha:** 2026-11-12
- **Fase:** 2

> NestJS por estructura: módulos e inyección de dependencias, como Spring. La lógica de negocio no depende de él: es un adaptador, no los cimientos.

## Contexto

El núcleo necesita exponerse por HTTP con validación, errores coherentes, autenticación, documentación y tests. Hacerlo a mano es posible, pero repetitivo, y cada proyecto acaba con una estructura distinta.

## Opciones consideradas

| Opción | A favor | En contra |
| --- | --- | --- |
| Express | Mínimo y muy conocido | Sin estructura: todo se decide y se monta a mano |
| Fastify o Hono | Rápidos y modernos | Igual de libres que Express |
| **NestJS** | Módulos, inyección de dependencias, validación, OpenAPI y testing integrados | Más piezas y decoradores; curva de entrada |

## Decisión

**NestJS.** Impone una estructura que se mantiene cuando el proyecto crece, y es habitual en equipos de backend con Node.

Para no usarlo como una caja negra, antes de adoptarlo se construye un servidor equivalente con el módulo `node:http`, sin framework.

## Consecuencias

**Positivas:** estructura estándar, validación y documentación OpenAPI casi sin código, y una forma clara de probar cada pieza.

**Negativas:** más mecanismos implícitos (decoradores, inyección) que hay que entender para depurar, y un paso de compilación que el núcleo no necesita. Se mitiga manteniendo las reglas de negocio fuera de Nest: sus servicios llaman al núcleo, no lo contienen.
