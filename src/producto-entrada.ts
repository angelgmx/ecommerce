/**
 * Entrada de productos: convierte un texto JSON que llega de fuera en un producto del que fiarse.
 *
 * Los tipos de TypeScript desaparecen al ejecutar, así que no frenan un JSON con basura.
 * Aquí se comprueba con el esquema de Zod de producto.ts, que existe también en ejecución (ADR-006).
 * No lanza: devuelve el producto o la lista de lo que falla, para que un dato malo no tumbe la app.
 */

import { EsquemaNuevoProducto, type NuevoProducto } from "./producto.ts";

/** Sale bien con el producto validado, o sale mal con un mensaje por cada fallo. */
export type ResultadoEntrada =
    | { valido: true; producto: NuevoProducto }
    | { valido: false; errores: string[] };

/**
 * Lee un producto nuevo (sin id, lo pone el sistema) desde un texto JSON.
 *
 * 1. Convierte el texto en datos. Si no es JSON, JSON.parse lanza y se devuelve un único error.
 * 2. Comprueba esos datos con el esquema. Zod revisa todos los campos de una pasada.
 * 3. Si todo cumple, devuelve resultado.data: el producto tipado y sin los campos que sobran.
 * 4. Si no, convierte cada fallo de Zod en un texto «campo: motivo».
 *    Cuando falla el dato entero (null, un array…) no hay campo, y queda solo el motivo.
 */
export function leerNuevoProducto(texto: string): ResultadoEntrada {
    let datos: unknown;
    try {
        datos = JSON.parse(texto);
    } catch {
        return { valido: false, errores: ["el JSON no es válido"] };
    }

    const resultado = EsquemaNuevoProducto.safeParse(datos);
    if (resultado.success) {
        return { valido: true, producto: resultado.data };
    }

    const errores = resultado.error.issues.map(issue => {
        if (issue.path.length === 0) {
            return issue.message;
        }
        return `${issue.path.join(".")}: ${issue.message}`;
    });
    return { valido: false, errores };
}
