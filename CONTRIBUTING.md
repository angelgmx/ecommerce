# Contribuir

Gracias por el interés en openecommerce. Esta guía explica cómo proponer cambios.

## Antes de empezar

- Lee la [arquitectura](docs/arquitectura/README.md): las reglas de negocio viven en el núcleo y no dependen de ningún framework.
- Para cambios grandes, abre primero un *issue* y coméntalo antes de escribir código.

## Entorno

**Requisitos:** Node.js 24 o superior y npm.

```bash
git clone https://github.com/angelgmx/ecommerce.git
cd ecommerce
npm install
npm test
```

## Flujo de trabajo

1. Crea una rama desde `main` con un nombre descriptivo: `feat/carrito-api`, `fix/redondeo-cupon`.
2. Haz commits pequeños siguiendo [Conventional Commits](https://www.conventionalcommits.org/es/).
3. Antes de abrir el pull request:
   - `npm run check` compila sin errores.
   - `npm test` pasa.
   - `npm run coverage` mantiene la cobertura por encima del 80 %.
4. Abre el pull request contra `main` y rellena la plantilla.

## Criterios de un cambio

- El núcleo no importa nada de infraestructura (NestJS, base de datos, HTTP).
- Ninguna función del núcleo modifica lo que recibe ([ADR-0003](docs/adr/0003-estado-inmutable-en-el-nucleo.md)).
- Los importes van en céntimos enteros.
- Todo dato externo se valida en la frontera con Zod.
- Cada comportamiento nuevo llega con tests, incluidos sus casos de error.
- Una decisión difícil de deshacer se documenta con un [ADR](docs/adr/README.md).
