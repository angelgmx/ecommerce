/**
 * Catálogo remoto: las mismas consultas que catalogo.ts, pero cada una tarda 200 ms
 * y devuelve una promesa, como si los datos vinieran de una base de datos o de otro servidor.
 */

import type { Producto } from "./producto.ts";
import { catalogo, buscarPorId } from "./catalogo.ts";

/** Devuelve una promesa que se cumple pasados `ms` milisegundos. No da ningún valor. */
function esperar(ms: number): Promise<void> {
    // new Promise recibe una función con `resolve`: llamarla cumple la promesa.
    return new Promise((resolve) => {
        // setTimeout deja resolve en la cola de tareas y lo ejecuta cuando pasan los ms.
        setTimeout(resolve, ms);
    });
}

/** Pide el catálogo completo. Tarda 200 ms y devuelve una copia. */
async function obtenerCatalogo(): Promise<Producto[]> {
    // await pausa esta función (no el programa) hasta que la espera termina.
    await esperar(200);
    // Copia con spread: quien la reciba puede modificarla sin tocar el catálogo original.
    return [...catalogo];
}

/** Error específico de «el producto que pides no existe en el catálogo». */
export class ProductoNoEncontrado extends Error {
    constructor(mensaje: string) {
        // super llama al constructor de Error, que guarda el mensaje.
        super(mensaje);
        // name sirve para distinguirlo en un catch y aparece en la consola.
        this.name = "ProductoNoEncontrado";
    }
}

/**
 * Pide un producto al catálogo remoto. Si no existe, lanza ProductoNoEncontrado.
 * Lanza en vez de devolver undefined porque «obtener» promete que te lo da.
 */
export async function obtenerProducto(id: number): Promise<Producto> {
    await esperar(200);
    // Reutiliza la búsqueda de catalogo.ts: Producto o undefined.
    const producto = buscarPorId(catalogo, id);
    if (producto === undefined) {
        // Dentro de una función async, throw rechaza la promesa que devuelve.
        throw new ProductoNoEncontrado(`El producto ${id} no existe en el catálogo`);
    }
    // Después del if, TypeScript ya sabe que producto es Producto y no undefined.
    return producto;
}

/**
 * Crea una función que pide el catálogo solo la primera vez y después lo devuelve
 * guardado, sin esperar. El guardado vive en una closure: nadie de fuera puede tocarlo.
 */
export function crearCatalogoConCache(): () => Promise<Producto[]> {
    // Variable local de esta función: sigue viva mientras exista la función de dentro.
    let cache: Producto[] | undefined;

    // Devuelve una función que «recuerda» cache aunque crearCatalogoConCache ya haya terminado.
    return async function obtenerCatalogoConCache(): Promise<Producto[]> {
        if (cache === undefined) {
            // Solo la primera llamada paga los 200 ms.
            cache = await obtenerCatalogo();
        }
        // Copia para que quien la reciba no pueda modificar lo que hay en la caché.
        return [...cache];
    };
}
