# ADR-0001: Licencia MIT

- **Estado:** aceptada
- **Fecha:** 2026-11-12
- **Fase:** 0

> Una plantilla solo es útil si se puede usar sin barreras legales. MIT no impone condiciones, a cambio de aceptar que alguien pueda cerrar una copia.

## Contexto

El proyecto es una plantilla para que cualquiera monte su tienda. Sin licencia, el código es visible pero nadie puede usarlo legalmente. Hay que decidir cuánta libertad se concede a quien lo use.

## Opciones consideradas

| Opción | A favor | En contra |
| --- | --- | --- |
| **MIT** | Corta, conocida, permite cualquier uso | Una copia puede cerrarse y venderse sin devolver mejoras |
| Apache 2.0 | Como MIT, con protección explícita frente a patentes | Más extensa y compleja |
| GPL / AGPL | Obliga a publicar los cambios (la AGPL, también si se ofrece como servicio) | Muchas empresas no pueden adoptarla |
| Sin licencia | Ninguno | El código no se puede usar |

## Decisión

**MIT.** El objetivo es que el mayor número de tiendas y empresas pueda adoptarla sin revisión legal.

## Consecuencias

**Positivas:** ninguna barrera para usar, modificar o comercializar la plantilla, que es lo que se espera de una base para proyectos propios.

**Negativas:** nadie está obligado a compartir sus mejoras; solo a conservar el aviso de copyright.

## Implementación

`LICENSE` en la raíz, `"license": "MIT"` en `package.json` y sección de licencia en el README.
