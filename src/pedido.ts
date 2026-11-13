/**
 * Pedido: convierte el carrito en un registro de la compra y lo hace avanzar por sus estados.
 *
 * El carrito está vivo (guarda solo ids y siempre usa el precio actual del catálogo).
 * El pedido es una foto: copia nombre y precio en el momento de comprar y ya no cambia.
 * Todos los importes van en céntimos enteros.
 */

import type { Producto } from "./producto.ts";
import type { Carrito } from "./carrito.ts";
import { anadir } from "./carrito.ts";
import { buscarPorId, catalogo } from "./catalogo.ts";
import { ErrorCarrito } from "./carrito-seguro.ts";
import { subtotal } from "./descuentos.ts";

/** Ciclo de vida de un pedido. Solo avanza: pendiente → pagado → enviado. */
export type EstadoPedido = "pendiente" | "pagado" | "enviado";

/**
 * Una fila del pedido. Copia nombre y precio del producto al comprar, para que el pedido
 * siga siendo correcto aunque el producto cambie de precio o se borre del catálogo.
 */
export type LineaPedido = {
    readonly productoId: number;
    readonly nombre: string;
    readonly precioUnitario: number;
    readonly cantidad: number;
};

/**
 * Registro de una compra. Todo es readonly, también el array de líneas por dentro:
 * un pedido no se edita, se crea uno nuevo con el cambio.
 */
export type Pedido = {
    readonly id: string;
    readonly lineas: readonly LineaPedido[];
    readonly total: number;
    readonly estado: EstadoPedido;
    readonly fechaCreacion: Date;
};

/** Error propio del pedido: permite distinguir en un catch sus fallos de los del carrito. */
export class ErrorPedido extends Error {
    constructor(mensaje: string) {
        super(mensaje);
        this.name = "ErrorPedido";
    }
}

/**
 * Convierte el carrito en un pedido pendiente.
 * Primero comprueba todo y después construye: si algo falla, no se crea nada a medias.
 * No descuenta stock; eso llegará con la base de datos y las transacciones.
 * Lanza ErrorCarrito si el carrito está vacío, un producto no existe o falta stock.
 */
export function checkout(catalogo: Producto[], carrito: Carrito): Pedido {
    if (carrito.length === 0) {
        throw new ErrorCarrito("El carrito está vacío");
    }

    // A diferencia de subtotal, aquí un producto inexistente no se ignora:
    // no se puede cobrar algo que ya no se vende.
    for (const linea of carrito) {
        const producto = buscarPorId(catalogo, linea.productoId);
        if (producto === undefined) {
            throw new ErrorCarrito(`El producto ${linea.productoId} no existe`);
        }
        if (linea.cantidad > producto.stock) {
            throw new ErrorCarrito(`No hay stock suficiente de "${producto.nombre}": pides ${linea.cantidad}, quedan ${producto.stock}`);
        }
    }

    // cada línea del carrito pasa a ser una línea con nombre y precio copiados.
    const lineas = carrito.map((linea): LineaPedido => {
        const producto = buscarPorId(catalogo, linea.productoId);
        if (producto === undefined) {
            throw new ErrorCarrito(`El producto ${linea.productoId} no existe`);
        }
        return {
            productoId: linea.productoId,
            nombre: producto.nombre,
            precioUnitario: producto.precio,
            cantidad: linea.cantidad,
        };
    });

    return {
        id: crypto.randomUUID(),
        lineas,
        total: subtotal(catalogo, carrito),
        estado: "pendiente",
        fechaCreacion: new Date(),
    };
}

/** Pasa un pedido pendiente a pagado. Devuelve uno nuevo; el original no cambia. */
export function pagar(pedido: Pedido): Pedido {
    if (pedido.estado !== "pendiente") {
        throw new ErrorPedido(`No se puede pagar un pedido en estado ${pedido.estado}`);
    }
    return { ...pedido, estado: "pagado" };
}

/** Pasa un pedido pagado a enviado. Devuelve uno nuevo; el original no cambia. */
export function enviar(pedido: Pedido): Pedido {
    if (pedido.estado !== "pagado") {
        throw new ErrorPedido(`No se puede enviar un pedido en estado ${pedido.estado}`);
    }
    return { ...pedido, estado: "enviado" };
}

