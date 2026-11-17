# ADR-0008: Monorepo con npm workspaces

- **Estado:** propuesta
- **Fecha:** 2026-11-17
- **Fase:** 2

> El núcleo y la API se separan en dos paquetes del mismo repositorio. La API depende del núcleo como de cualquier librería, y el núcleo no puede importar nada de la API.

## Contexto

Hasta la fase 1 el repositorio contiene solo el núcleo en `src/`. NestJS genera un proyecto con su propio `package.json`, su configuración de TypeScript y sus scripts. Hay que decidir cómo conviven ambos sin que el núcleo pase a depender del framework.

Restricciones técnicas comprobadas:

- NestJS 12 es solo ESM y compila con TypeScript; el núcleo usa importaciones con extensión `.ts` y se ejecuta directamente con Node (eliminación de tipos nativa).
- Node ejecuta los ficheros `.ts` de un paquete enlazado por workspace, porque resuelve el enlace a su ruta real fuera de `node_modules`.

## Opciones consideradas

| Opción | A favor | En contra |
| --- | --- | --- |
| **npm workspaces: `packages/nucleo` y `apps/api`** | Frontera explícita entre paquetes; cada uno con sus dependencias y scripts; estructura estándar de monorepo | Reorganizar el repositorio |
| Proyecto Nest en una carpeta que importa `../src` | Sin mover nada | Rutas relativas entre proyectos; nada impide que el núcleo importe de la API |
| Repositorios separados | Aislamiento total | Publicar el núcleo como paquete para cada cambio; cambios coordinados en dos repos |
| Todo en un único proyecto Nest | Una sola configuración | El núcleo acaba mezclado con el framework |

## Decisión

**npm workspaces.**

```
ecommerce/
├── package.json          workspaces: ["packages/*", "apps/*"]
├── packages/nucleo/      @openecommerce/nucleo
└── apps/api/             @openecommerce/api → depende de @openecommerce/nucleo
```

1. El núcleo expone sus módulos con `exports` en su `package.json`; la API los importa por nombre de paquete (`@openecommerce/nucleo/producto`), nunca por ruta relativa.
2. Cada paquete conserva sus scripts (`test`, `check`); la raíz los ejecuta en todos con `--workspaces`.
3. El núcleo no declara dependencias de NestJS ni de nada de infraestructura.

## Consecuencias

**Positivas:** la regla de dependencias de la [arquitectura](../arquitectura/README.md) queda impuesta por la estructura; la fase 7 añade `apps/web` sin reorganizar nada.

**Negativas:** un movimiento de ficheros en el historial de git y una configuración más que mantener en la raíz.
