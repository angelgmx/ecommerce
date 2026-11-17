# Fase 2 · API REST

- **Estado:** siguiente
- **Fechas:** 24 nov – 4 dic 2026
- **Versión al cerrar:** `v0.2.0`
- **Decisiones:** [ADR-0004 NestJS](../adr/0004-nestjs-para-la-api.md) · [ADR-0007 Zod en la API](../adr/0007-validacion-con-zod-en-la-api.md) · [ADR-0008 Monorepo](../adr/0008-monorepo-con-npm-workspaces.md) (propuesta)

## Objetivo

Exponer el núcleo por HTTP con NestJS, de modo que un cliente pueda gestionar el catálogo y comprar con un carrito, sin que el núcleo pase a depender del framework.

## Alcance

**Dentro:**

- Catálogo: consultar, crear, editar y retirar productos.
- Carrito: crear uno, añadir productos, cambiar cantidades, quitar líneas, aplicar un cupón y consultar el total.
- Validación de toda entrada, errores con un formato común y documentación OpenAPI.
- Configuración por entorno y tests e2e de cada operación.

**Fuera:**

| Queda fuera | Fase |
| --- | --- |
| Persistencia: los datos viven en memoria y se pierden al reiniciar | 3 |
| Autenticación y permisos: cualquiera puede crear productos | 4 |
| Checkout y pedidos por HTTP | 5 |
| Paginación | 5 |

## Requisitos funcionales

| ID | Requisito | Reglas de negocio |
| --- | --- | --- |
| **RF-01** | Listar el catálogo | Filtrable por categoría y ordenable por precio. Sin resultados no es un error: lista vacía. |
| **RF-02** | Consultar un producto | Si no existe, se indica claramente. |
| **RF-03** | Crear un producto | Las reglas de [ADR-0006](../adr/0006-el-producto-sale-del-esquema-de-zod.md). El identificador lo asigna el sistema; los campos desconocidos se descartan. Se devuelven todos los fallos a la vez. |
| **RF-04** | Editar un producto | Edición parcial: solo cambian los campos enviados, que cumplen las mismas reglas que al crear. El identificador no se puede cambiar. |
| **RF-05** | Retirar un producto | Retirar uno que no existe se indica claramente. Los carritos que lo contengan dejan de sumarlo. |
| **RF-06** | Crear un carrito | Empieza vacío. Quien lo crea recibe un identificador para usarlo después. |
| **RF-07** | Consultar un carrito | Líneas con nombre, precio unitario, cantidad e importe, y subtotal en céntimos. |
| **RF-08** | Añadir un producto al carrito | Cantidad entera mayor que 0; el producto debe existir; la cantidad total no puede superar el stock. Si ya estaba, se suma. |
| **RF-09** | Cambiar la cantidad de una línea | Sustituye, no suma. Con 0 se quita la línea. Mismas reglas de stock. |
| **RF-10** | Quitar una línea | Quitar un producto que no está no es un error. |
| **RF-11** | Total con cupón | Códigos sin distinguir mayúsculas ni espacios. Un cupón inexistente se rechaza; el total nunca es negativo. |

## Requisitos no funcionales

| ID         | Requisito                                                                                                                                                                     |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **RNF-01** | Toda entrada (cuerpo, parámetros de ruta y *query*) se valida antes de llegar a la lógica, con los esquemas de Zod ([ADR-0007](../adr/0007-validacion-con-zod-en-la-api.md)). |
| **RNF-02** | Todas las respuestas de error comparten un formato y nunca exponen trazas internas.                                                                                           |
| **RNF-03** | Cada error del dominio se traduce a un código HTTP por su clase, en un único punto.                                                                                           |
| **RNF-04** | La API está documentada con OpenAPI y se puede probar desde `/docs`.                                                                                                          |
| **RNF-05** | La configuración (puerto, entorno) se lee del entorno; el repositorio incluye `.env.example` y ningún secreto.                                                                |
| **RNF-06** | Cada requisito funcional tiene tests e2e de su caso correcto y de sus errores.                                                                                                |
| **RNF-07** | El núcleo sigue sin dependencias de NestJS y sus 97 tests siguen pasando.                                                                                                     |
| **RNF-08** | Ningún cambio entra en `main` sin pull request.                                                                                                                               |

## Plan de trabajo

Cada tarea se desarrolla en su propia rama y entra en `main` mediante pull request.

### 2.1 · Contrato de la API

Diseñar la API antes de implementarla.

**Entregable:** `docs/arquitectura/api.md` con, para cada requisito: método, ruta, cuerpo de entrada, respuesta, códigos de estado y ejemplos. Incluye el formato común de error y la tabla que relaciona cada error del dominio con su código HTTP.

**Criterios de aceptación:**
- Cubre RF-01 a RF-11.
- Los recursos se nombran como sustantivos en plural y en el idioma del dominio.
- Cada operación indica todos sus posibles códigos de estado.
- `ErrorCarrito`, `CuponNoValido`, `ProductoNoEncontrado` y los errores de validación tienen un código asignado y justificado.

### 2.2 · Monorepo

Separar el núcleo y la API en paquetes ([ADR-0008](../adr/0008-monorepo-con-npm-workspaces.md)).

**Entregable:** el núcleo en `packages/nucleo` como `@openecommerce/nucleo`, un proyecto NestJS vacío en `apps/api` como `@openecommerce/api`, y scripts en la raíz que ejecutan `check` y `test` en todos los paquetes.

**Criterios de aceptación:**
- El historial de los ficheros del núcleo se conserva (`git mv`).
- `npm test` en la raíz ejecuta los tests del núcleo y de la API.
- La API importa el núcleo por nombre de paquete y arranca con `npm run start:dev -w @openecommerce/api`.
- El ADR-0008 pasa a `aceptada`.

### 2.3 · Catálogo: lectura

**Entregable:** módulo `productos` con controlador y servicio que implementan RF-01 y RF-02 sobre el repositorio en memoria del núcleo, registrado como proveedor e inyectado en el servicio.

**Criterios de aceptación:**
- El servicio recibe el repositorio por inyección de dependencias, no lo crea.
- El controlador no contiene lógica: traduce la petición y delega.
- Los parámetros de ruta y de *query* se validan (un id no numérico no llega al servicio).

### 2.4 · Catálogo: escritura

**Entregable:** RF-03, RF-04 y RF-05.

**Criterios de aceptación:**
- La validación usa los esquemas del núcleo; el esquema de edición se deriva del de creación.
- Un cuerpo inválido devuelve todos los fallos con el campo prefijado.
- Los campos desconocidos no llegan a guardarse.
- Los identificadores nuevos no se repiten aunque se hayan retirado productos.

### 2.5 · Errores coherentes

**Entregable:** un filtro de excepciones global que traduce los errores del dominio según la tabla de 2.1 y aplica el formato común.

**Criterios de aceptación:**
- Ningún servicio ni controlador construye respuestas de error a mano.
- Un error no previsto devuelve `500` con el formato común y sin detalles internos, y queda registrado en el log.

### 2.6 · Carrito

**Entregable:** módulo `carritos` con RF-06 a RF-11, que usa el módulo `productos` para consultar el catálogo, y un ADR sobre dónde vive el carrito entre peticiones.

**Criterios de aceptación:**
- Las reglas de stock, cantidad y cupones las aplica el núcleo (`carrito-seguro.ts`, `descuentos.ts`); el servicio solo orquesta.
- `productos` exporta lo que `carritos` necesita, y nada más.
- ADR-0009 escrito y aceptado.

### 2.7 · Configuración y documentación

**Entregable:** configuración con `@nestjs/config`, `.env.example` y documentación OpenAPI servida en `/docs`.

**Criterios de aceptación:**
- La aplicación falla al arrancar si falta una variable obligatoria o tiene un valor inválido.
- `.env` está en `.gitignore`.
- Todas las operaciones aparecen en `/docs` con sus esquemas de entrada, generados a partir de Zod.

### 2.8 · Tests e2e

**Entregable:** tests e2e con Vitest y Supertest para cada requisito funcional y un test del flujo completo: crear un producto, crear un carrito, añadir el producto, aplicar un cupón y comprobar el total.

**Criterios de aceptación:**
- Cada test arranca una aplicación limpia: ningún test depende de los datos de otro.
- La configuración de los tests registra los mismos pipes y filtros que `main.ts`.
- Se cubren los errores de cada operación, no solo el caso correcto.

### 2.9 · Cierre

**Entregable:** versión `v0.2.0`.

**Criterios de aceptación:**
- Definición de terminado de la [hoja de ruta](README.md) cumplida.
- README con la sección «Empezar» actualizada al monorepo y a la API.
- Entrada `0.2.0` en el CHANGELOG y etiqueta `v0.2.0` en git.

## Notas técnicas

Comprobado con las versiones de noviembre de 2026 (Node 26, NestJS 12, Zod 4.6, Vitest):

- NestJS 12 genera proyectos **solo ESM** con Vitest: las importaciones relativas de la API terminan en `.js` y los mocks son `vi.fn()`.
- `StandardSchemaValidationPipe` (incluido en `@nestjs/common`) valida con esquemas de Zod declarados en `@Body({ schema })`, `@Param('id', { schema })` y `@Query({ schema })`. Los parámetros de ruta llegan como texto: hace falta coerción.
- `@nestjs/swagger` genera los esquemas OpenAPI a partir de Zod 4.2+ sin configuración adicional.
- Node ejecuta los `.ts` del núcleo directamente cuando la API lo importa como paquete del workspace, así que el núcleo no necesita paso de compilación.
- Los tests e2e crean la aplicación con `Test.createTestingModule`, que no ejecuta `main.ts`: pipes y filtros globales se registran también en el test.
