import type { Producto } from "./producto.ts";
import { buscarPorId } from "./catalogo.ts";
import type { Carrito } from "./carrito.ts";
import { anadir, cambiarCantidad } from "./carrito.ts";

// Comprueba cada operación contra el catálogo antes de llamar a carrito.ts.

// Error propio del carrito: permite distinguir en un catch los fallos del carrito de cualquier otro.
export class ErrorCarrito extends Error {
    constructor(mensaje: string) {
        super(mensaje);
        this.name = "ErrorCarrito";
    }
}

// Añade unidades de un producto al carrito si la cantidad es válida, el producto existe
// y hay stock para lo que ya había más lo nuevo. Si no, lanza un ErrorCarrito.
export function anadirSeguro(catalogo: Producto[], carrito: Carrito, productoId: number, cantidad: number): Carrito {
    // a) la cantidad no es un número entero mayor que 0
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
        throw new ErrorCarrito(`La cantidad debe ser un número entero mayor que 0 (recibido: ${cantidad})`);
    }

    // b) el producto no existe en el catálogo
    const producto = buscarPorId(catalogo, productoId);
    if (producto === undefined) {
        throw new ErrorCarrito(`El producto ${productoId} no existe`);
    }

    // c) no hay stock suficiente
    const productoCesta = carrito.find(c => c.productoId === productoId);
    const yaEnCesta = productoCesta?.cantidad ?? 0;
    const total = yaEnCesta + cantidad;
    if (total > producto.stock) {
        throw new ErrorCarrito(`No hay stock suficiente de ${producto.nombre}`);
    }

    // si todo es correcto se añade
    return anadir(carrito, productoId, cantidad);
}

// Sustituye la cantidad de un producto del carrito (0 lo quita) si la cantidad es válida,
// el producto existe y hay stock para la cantidad nueva. Si no, lanza un ErrorCarrito.
export function cambiarCantidadSeguro(catalogo: Producto[], carrito: Carrito, productoId: number, cantidad: number): Carrito {
    // a) cantidad: entero, y aquí 0 SÍ vale
    if (!Number.isInteger(cantidad) || cantidad < 0) {
        throw new ErrorCarrito(`La cantidad debe ser un número entero mayor o igual que 0 (recibido: ${cantidad})`);
    }

    // b) el producto existe en el catálogo
    const producto = buscarPorId(catalogo, productoId);
    if (producto === undefined) {
        throw new ErrorCarrito(`El producto ${productoId} no existe en el catálogo`);
    }

    // c) stock: si vamos a dejar unidades, no pueden pasar del stock
    if (cantidad > producto.stock) {
        throw new ErrorCarrito(`No hay stock suficiente de "${producto.nombre}": pides ${cantidad}, quedan ${producto.stock}`);
    }

    // todo correcto → delegamos en cambiarCantidad (0 quita la línea, no es error)
    return cambiarCantidad(carrito, productoId, cantidad);
}
