import { describe, it, expect } from "vitest";
import { anadirSeguro, cambiarCantidadSeguro, ErrorCarrito } from "./carrito-seguro.ts";
import type { Carrito } from "./carrito.ts";
import type { Producto } from "./producto.ts";

const productos: Producto[] = [
    { id: 1, nombre: "Camiseta", precio: 1990, stock: 10, categoria: "camisetas" },
    { id: 2, nombre: "Zapatillas", precio: 5990, stock: 3, categoria: "zapatillas" },
];

describe("anadirSeguro", () => {
    it("añade si la cantidad es válida, el producto existe y hay stock", () => {
        const nuevo = anadirSeguro(productos, [], 1, 2);

        expect(nuevo).toEqual([{ productoId: 1, cantidad: 2 }]);
    });

    it("deja llegar justo al stock", () => {
        const nuevo = anadirSeguro(productos, [], 2, 3);

        expect(nuevo).toEqual([{ productoId: 2, cantidad: 3 }]);
    });

    it.each([
        ["0", 0],
        ["negativa", -1],
        ["con decimales", 1.5],
        ["NaN", Number.NaN],
    ])("rechaza una cantidad %s", (_, cantidad) => {
        expect(() => anadirSeguro(productos, [], 1, cantidad)).toThrow(ErrorCarrito);
    });

    it("rechaza un producto que no existe", () => {
        expect(() => anadirSeguro(productos, [], 99, 1)).toThrow("El producto 99 no existe");
    });

    it("rechaza pasar del stock", () => {
        expect(() => anadirSeguro(productos, [], 2, 4)).toThrow(/stock suficiente/);
    });

    it("cuenta lo que ya había en el carrito para el stock", () => {
        const carrito: Carrito = [{ productoId: 2, cantidad: 2 }];

        expect(() => anadirSeguro(productos, carrito, 2, 2)).toThrow(/stock suficiente/);
    });

    it("si falla, el carrito original no cambia", () => {
        const carrito: Carrito = [{ productoId: 2, cantidad: 2 }];

        expect(() => anadirSeguro(productos, carrito, 2, 5)).toThrow(ErrorCarrito);
        expect(carrito).toEqual([{ productoId: 2, cantidad: 2 }]);
    });
});

describe("cambiarCantidadSeguro", () => {
    it("sustituye la cantidad", () => {
        const carrito: Carrito = [{ productoId: 1, cantidad: 2 }];

        const nuevo = cambiarCantidadSeguro(productos, carrito, 1, 7);

        expect(nuevo).toEqual([{ productoId: 1, cantidad: 7 }]);
    });

    it("con 0 quita la línea en vez de dar error", () => {
        const carrito: Carrito = [{ productoId: 1, cantidad: 2 }];

        const nuevo = cambiarCantidadSeguro(productos, carrito, 1, 0);

        expect(nuevo).toEqual([]);
    });

    it("no suma lo que ya había: el stock se compara con la cantidad nueva", () => {
        const carrito: Carrito = [{ productoId: 2, cantidad: 2 }];

        const nuevo = cambiarCantidadSeguro(productos, carrito, 2, 3);

        expect(nuevo).toEqual([{ productoId: 2, cantidad: 3 }]);
    });

    it.each([
        ["negativa", -1],
        ["con decimales", 2.5],
    ])("rechaza una cantidad %s", (_, cantidad) => {
        expect(() => cambiarCantidadSeguro(productos, [], 1, cantidad)).toThrow(ErrorCarrito);
    });

    it("rechaza un producto que no existe", () => {
        expect(() => cambiarCantidadSeguro(productos, [], 99, 1)).toThrow(/no existe/);
    });

    it("rechaza pasar del stock", () => {
        expect(() => cambiarCantidadSeguro(productos, [], 2, 4)).toThrow(/pides 4, quedan 3/);
    });
});
