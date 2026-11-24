# Contrato de la API

- **Estado:** propuesta · [tarea 2.1](../roadmap/fase-2-api.md#21--contrato-de-la-api)
- **Fase:** 2
- **Decisiones:** [ADR-0004](../adr/0004-nestjs-para-la-api.md) · [ADR-0007](../adr/0007-validacion-con-zod-en-la-api.md) · [ADR-0009](../adr/0009-sku-unico-por-producto.md) (propuesta)

Qué ofrece la API y cómo responde. Este documento fija el diseño; la implementación lo sigue.
## Convenciones

- **URL base:** `http://localhost:3000` en desarrollo, sin prefijo.
- **Recursos:** sustantivos en plural, en español, en minúsculas y sin tildes (`/productos`, `/carritos/{id}/lineas`).
- **Formato:** las peticiones con cuerpo y todas las respuestas van en JSON, con la cabecera `Content-Type: application/json`. Los campos, en camelCase (`productoId`).
- **Identificadores:** los productos, enteros positivos; los carritos, UUID. En los ejemplos se abrevian (`abc`).
- **Importes:** enteros en céntimos (`1999` son 19,99 €).
- **Fechas:** texto ISO 8601 en UTC (`2026-11-24T10:30:00.000Z`).

## Formato de error

Todas las respuestas de error tienen la misma forma:

- `codigo`: identificador fijo del error, en mayúsculas con guiones bajos (`CUPON_NO_VALIDO`). Es lo que lee el front para decidir qué hacer.
- `mensaje`: qué ha fallado, para una persona.
- `estado`: el código HTTP de la respuesta (`400`, `404`, `409` o `500`).
- `detalles` *(opcional)*: en los errores de validación, la lista de campos que fallan y por qué.

Error de validación:

```json
{
  "codigo": "VALIDACION_FALLIDA",
  "mensaje": "Los datos de la petición no son válidos",
  "estado": 400,
  "detalles": [
    { "campo": "cantidad", "motivo": "debe ser un entero mayor que 0" },
    { "campo": "productoId", "motivo": "debe ser un entero positivo" }
  ]
}
```

Error del dominio:

```json
{
  "codigo": "CUPON_NO_VALIDO",
  "mensaje": "El cupón GRATIS no existe",
  "estado": 400
}
```

## Errores del dominio

Cada error del núcleo se traduce a un código HTTP en un solo sitio, el filtro de excepciones. Cualquier error que no esté en esta tabla responde `500` con el código `ERROR_INTERNO` y sin detalles.

| Error                                 | `codigo`                 | HTTP  | Cuándo                                                                                | Por qué ese código                                                                                |
| ------------------------------------- | ------------------------ | ----- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Validación de Zod                     | `VALIDACION_FALLIDA`     | `400` | Falta un campo o un valor no cumple el esquema                                        | La petición está mal formada; repetirla igual fallará siempre                                     |
| `CuponNoValido`                       | `CUPON_NO_VALIDO`        | `400` | El cupón de la query no existe                                                        | Es un valor no válido de la petición, como un `orden` desconocido; no es el recurso de la ruta    |
| `ProductoNoEncontrado`                | `PRODUCTO_NO_ENCONTRADO` | `404` | El producto no existe en el catálogo, se pida desde `/productos` o desde un carrito   | Es el mismo hecho en los dos casos: un solo error, del catálogo                                   |
| `ErrorCarrito` · `CANTIDAD_NO_VALIDA` | `CANTIDAD_NO_VALIDA`     | `400` | La cantidad no es un entero mayor que 0 al añadir, o mayor o igual que 0 al cambiarla | Es un valor incorrecto de la petición; Zod lo para antes y el núcleo lo repite por seguridad      |
| `ErrorCarrito` · `STOCK_INSUFICIENTE` | `STOCK_INSUFICIENTE`     | `409` | La cantidad del carrito supera el stock                                               | La petición es correcta, pero choca con el estado actual del catálogo; puede funcionar más tarde  |
| Carrito no encontrado *(API)*         | `CARRITO_NO_ENCONTRADO`  | `404` | El carrito de la ruta no existe                                                       | Es el recurso de la ruta; lo detecta el servicio al buscarlo, porque el núcleo no guarda carritos |

Todos salen del núcleo salvo el marcado *(API)*. `ErrorCarrito` lleva un campo `motivo` con una unión de literales: el filtro lo trata con un `switch` y TypeScript avisa si aparece un motivo sin traducir. `ErrorPedido` entra en la tabla en la fase 5.

## Endpoints

El detalle de cada endpoint (tipos, esquemas y ejemplos) se genera con OpenAPI y se consulta en `/docs`. Aquí se fija el diseño.

Los parámetros con `?` son opcionales. Los de ruta van entre llaves en la propia ruta.

### Códigos de estado

| Código | Significado                                       | Ejemplo                     |
| ------ | ------------------------------------------------- | --------------------------- |
| `200`  | Correcto, con respuesta                           | Consultar un producto       |
| `201`  | Creado                                            | Crear un carrito            |
| `204`  | Correcto, sin respuesta                           | Retirar un producto         |
| `400`  | Petición no válida: formato o valores incorrectos | Añadir con `cantidad` `0`   |
| `404`  | El recurso no existe                              | `/productos/999`            |
| `409`  | Conflicto con el estado actual                    | Cantidad mayor que el stock |

### Operaciones

| RF  | Operación                        | Método   | Ruta                                 | Query                  | Cuerpo                                       | Éxito          | Errores             |
| --- | -------------------------------- | -------- | ------------------------------------ | ---------------------- | -------------------------------------------- | -------------- | ------------------- |
| 01  | Listar el catálogo               | `GET`    | `/productos`                         | `categoria?`, `orden?` | —                                            | `200` lista    | `400`               |
| 02  | Consultar un producto            | `GET`    | `/productos/{id}`                    | —                      | —                                            | `200` producto | `400`, `404`        |
| 03  | Crear un producto                | `POST`   | `/productos`                         | —                      | `nombre`, `precio`, `stock`, `categoria`     | `201` producto | `400`               |
| 04  | Editar un producto               | `PATCH`  | `/productos/{id}`                    | —                      | `nombre?`, `precio?`, `stock?`, `categoria?` | `200` producto | `400`, `404`        |
| 05  | Retirar un producto              | `DELETE` | `/productos/{id}`                    | —                      | —                                            | `204`          | `400`, `404`        |
| 06  | Crear un carrito                 | `POST`   | `/carritos`                          | —                      | —                                            | `201` carrito  | —                   |
| 07  | Consultar un carrito             | `GET`    | `/carritos/{id}`                     | —                      | —                                            | `200` carrito  | `400`, `404`        |
| 08  | Añadir un producto al carrito    | `POST`   | `/carritos/{id}/lineas`              | —                      | `productoId`, `cantidad`                     | `201` carrito  | `400`, `404`, `409` |
| 09  | Cambiar la cantidad de una línea | `PATCH`  | `/carritos/{id}/lineas/{productoId}` | —                      | `cantidad`                                   | `200` carrito  | `400`, `404`, `409` |
| 10  | Quitar una línea                 | `DELETE` | `/carritos/{id}/lineas/{productoId}` | —                      | —                                            | `204`          | `400`, `404`        |
| 11  | Consultar el total               | `GET`    | `/carritos/{id}/total`               | `cupon?`               | —                                            | `200` desglose | `400`, `404`        |

## Productos

- **Listar (RF-01):** `orden` acepta `precio` y `-precio`; sin él, por `id`. A igual precio, desempata por `id`.
- **Consultar (RF-02):** devuelve el producto. El `id` con formato no válido responde `400`; si no existe, `404`.
- **Crear (RF-03):** el `id` lo asigna el sistema. `nombre` no puede estar vacío; `precio` es un entero en céntimos mayor que 0; `stock`, un entero mayor o igual que 0; `categoria`, una de `camisetas`, `pantalones`, `zapatillas`, `gorras` o `sudaderas`. Hasta la fase 3 se permiten duplicados ([ADR-0009](../adr/0009-sku-unico-por-producto.md)).
- **Editar (RF-04):** cambia solo los campos enviados, con las mismas reglas que al crear. Un cuerpo vacío responde `400`.
- **Retirar (RF-05):** borra el producto del catálogo. Los carritos que lo tenían no lo suman en el total, y el checkout los rechaza.

## Carritos

Un carrito se devuelve como `{ id, lineas }`, y cada línea como `{ productoId, cantidad }`.

- **Crear (RF-06):** crea un carrito vacío con un `id` único y devuelve el carrito completo.
- **Consultar (RF-07):** devuelve el carrito con sus líneas. El `id` con formato no válido responde `400`; si no existe, `404`.
- **Añadir (RF-08):** si el producto ya está en el carrito, suma la cantidad a la de la línea; no crea una línea nueva. `cantidad` es un entero mayor que 0. Si el producto no existe en el catálogo responde `404`; si la cantidad total supera el stock, `409`.
- **Cambiar cantidad (RF-09):** sustituye la cantidad de la línea, no la suma. `cantidad` es un entero mayor o igual que 0; con `0` se quita la línea y se devuelve el carrito sin ella. Si el carrito o la línea no existen responde `404`; si la cantidad supera el stock, `409`.
- **Quitar (RF-10):** elimina la línea del producto y responde sin cuerpo. Si el producto no estaba en el carrito también responde `204`: el resultado es el mismo. Solo responde `404` si el carrito no existe.
- **Consultar el total (RF-11):** devuelve `subtotal`, `descuento` y `total`, en céntimos. Sin `cupon`, `descuento` vale `0` y `total` es igual a `subtotal`. El `total` nunca es negativo. El código del cupón no distingue mayúsculas ni espacios. Un cupón que no existe responde `400`.

### Ejemplo

Añadir dos unidades del producto `104` a un carrito vacío:

```bash
curl -X POST http://localhost:3000/carritos/abc/lineas \
  -H "Content-Type: application/json" \
  -d '{"productoId": 104, "cantidad": 2}'
```

Respuesta `201`:

```json
{
  "id": "abc",
  "lineas": [{ "productoId": 104, "cantidad": 2 }]
}
```
