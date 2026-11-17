import { describe, it, expect } from "vitest";
import { checkout, pagar, enviar, ErrorPedido } from "./pedido.ts";
import { ErrorCarrito } from "./carrito-seguro.ts";
import type { Carrito } from "./carrito.ts";
import type { Producto } from "./producto.ts";

const productos: Producto[] = [
    { id: 1, nombre: "Camiseta", precio: 1990, stock: 10, categoria: "camisetas" },
    { id: 2, nombre: "Gorra", precio: 999, stock: 2, categoria: "gorras" },
];

const carrito: Carrito = [
    { productoId: 1, cantidad: 2 },
    { productoId: 2, cantidad: 1 },
];

describe("checkout", () => {
    it("crea un pedido pendiente con el total del carrito", () => {
        const pedido = checkout(productos, carrito);

        expect(pedido.estado).toBe("pendiente");
        expect(pedido.total).toBe(4979);
    });

    it("copia nombre y precio de cada producto en sus líneas", () => {
        const pedido = checkout(productos, carrito);

        expect(pedido.lineas).toEqual([
            { productoId: 1, nombre: "Camiseta", precioUnitario: 1990, cantidad: 2 },
            { productoId: 2, nombre: "Gorra", precioUnitario: 999, cantidad: 1 },
        ]);
    });

    it("da a cada pedido un id distinto", () => {
        expect(checkout(productos, carrito).id).not.toBe(checkout(productos, carrito).id);
    });

    it("el pedido no cambia si después cambia el precio en el catálogo", () => {
        const pedido = checkout(productos, carrito);
        const catalogoNuevo = productos.map(p => ({ ...p, precio: p.precio * 2 }));

        checkout(catalogoNuevo, carrito);

        expect(pedido.lineas[0]?.precioUnitario).toBe(1990);
    });

    it("rechaza el carrito vacío", () => {
        expect(() => checkout(productos, [])).toThrow("El carrito está vacío");
    });

    it("rechaza un producto que ya no existe", () => {
        expect(() => checkout(productos, [{ productoId: 99, cantidad: 1 }])).toThrow(ErrorCarrito);
    });

    it("rechaza si falta stock", () => {
        expect(() => checkout(productos, [{ productoId: 2, cantidad: 3 }])).toThrow(/pides 3, quedan 2/);
    });
});

describe("pagar y enviar", () => {
    it("un pedido pendiente pasa a pagado", () => {
        const pedido = checkout(productos, carrito);

        expect(pagar(pedido).estado).toBe("pagado");
    });

    it("un pedido pagado pasa a enviado", () => {
        const pagado = pagar(checkout(productos, carrito));

        expect(enviar(pagado).estado).toBe("enviado");
    });

    it("no modifica el pedido original", () => {
        const pedido = checkout(productos, carrito);

        const pagado = pagar(pedido);

        expect(pagado).not.toBe(pedido);
        expect(pedido.estado).toBe("pendiente");
    });

    it("no deja pagar dos veces", () => {
        const pagado = pagar(checkout(productos, carrito));

        expect(() => pagar(pagado)).toThrow(ErrorPedido);
    });

    it("no deja enviar un pedido sin pagar", () => {
        const pedido = checkout(productos, carrito);

        expect(() => enviar(pedido)).toThrow(ErrorPedido);
    });

    it("no deja enviar dos veces", () => {
        const enviado = enviar(pagar(checkout(productos, carrito)));

        expect(() => enviar(enviado)).toThrow(ErrorPedido);
    });
});
