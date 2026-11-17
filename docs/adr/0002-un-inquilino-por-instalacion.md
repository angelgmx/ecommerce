# ADR-0002: Un inquilino por instalación

- **Estado:** aceptada
- **Fecha:** 2026-11-12
- **Fase:** 1

> Cada tienda despliega su propia instalación. El multi-inquilino solo compensa en un SaaS, y su riesgo principal (que un cliente vea datos de otro) no aporta nada a una plantilla.

## Contexto

Hay que decidir si cada tienda tiene su propia instalación (un inquilino) o si muchas tiendas comparten una (multi-inquilino, como Shopify). La decisión afecta a todas las capas: usuarios, pagos, dominios, caché y cada consulta a la base de datos.

## Opciones consideradas

| Opción | A favor | En contra |
| --- | --- | --- |
| **Un inquilino por instalación** | Simple; imposible mezclar datos entre tiendas | Cada tienda mantiene y actualiza su despliegue |
| Multi-inquilino con columna `tiendaId` | Una instalación para todas | Una consulta sin filtro expone datos de otra tienda |
| Multi-inquilino con *row-level security* | La base de datos filtra sola | Compleja de configurar y depurar |
| Base de datos o esquema por tienda | Aislamiento fuerte | Migraciones y costes multiplicados |

## Decisión

**Un inquilino.** Quien usa la plantilla la despliega con su propia base de datos y su propia cuenta de Stripe. El multi-inquilino es el modelo de una plataforma que vende tiendas, y este proyecto no lo es.

Para no cerrar la puerta a un cambio futuro:

1. Todo acceso a datos pasa por repositorios (`Repositorio<T>`): un filtro por tienda se añadiría en un único punto.
2. La configuración de la tienda se lee de fuera del código.
3. Las claves de caché llevan prefijo, ampliable con la tienda.
4. El núcleo no tiene estado global: las funciones reciben los datos por parámetro.

## Consecuencias

**Positivas:** modelo de datos, autenticación, pagos y caché más sencillos; ningún riesgo de fuga de datos entre tiendas.

**Negativas:** no se puede ofrecer como servicio a varias tiendas desde un único despliegue.

## Implementación

`src/repositorio.ts` (acceso a datos centralizado) y funciones del núcleo sin estado global.
