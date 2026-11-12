/**
 * Subtotal del carrito y descuentos: por porcentaje o con un cupón que escribe el cliente.
 * Todos los importes van en céntimos enteros.
 */

import type { Producto } from "./producto.ts";
import { buscarCupon } from "./producto.ts";
import type { Carrito } from "./carrito.ts";
import { buscarPorId } from "./catalogo.ts";

// Si una línea apunta a un producto que ya no está en el catálogo, no suma nada.
function subtotal(catalogo: Producto[], carrito: Carrito): number {
    const total = carrito.reduce((acc, linea) => {
        const producto = buscarPorId(catalogo, linea.productoId);
        if (producto === undefined) return acc;
        return acc + producto.precio * linea.cantidad;
    }, 0);

    return total;
}

function aplicarDescuento(totalCentimos: number, porcentaje: number): number {
    if(porcentaje < 0 || porcentaje > 100) {
        throw new Error(`El porcentaje debe estar entre 0 y 100 (recibido: ${porcentaje})`)
    }
    const descuento = Math.round(totalCentimos / 100 * porcentaje);
    return totalCentimos - descuento;
}
export class CuponNoValido extends Error {
    constructor(mensaje: string) {
        super(mensaje);
        this.name = "CuponNoValido";
    }
}

/**
 * Subtotal del carrito con el cupón aplicado.
 * Lanza CuponNoValido si el código no existe. Nunca devuelve un total negativo.
 */
export function totalConCupon(catalogo: Producto[], carrito: Carrito, codigo: string): number {
    const cupon = buscarCupon(codigo);
    if(cupon === undefined) {
        throw new CuponNoValido(`El cupón ${codigo} no existe`);
    }
    const base = subtotal(catalogo, carrito);

    switch (cupon.tipo) {
        case "porcentaje":
            return aplicarDescuento(base, cupon.valor);
        case "fijo":
            return Math.max(0, base - cupon.valor);
    }
}
