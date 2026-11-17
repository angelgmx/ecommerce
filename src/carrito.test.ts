import { describe, it, expect } from "vitest";
import { anadir, quitar, cambiarCantidad, type Carrito } from "./carrito.ts";

describe("anadir", () => {
    it("crea una línea nueva si el producto no estaba", () => {
        const carrito: Carrito = [];

        const nuevo = anadir(carrito, 1, 2);

        expect(nuevo).toEqual([{ productoId: 1, cantidad: 2 }]);
    });

    it("pone la línea nueva al final", () => {
        const carrito: Carrito = [{ productoId: 1, cantidad: 2 }];

        const nuevo = anadir(carrito, 3, 1);

        expect(nuevo).toEqual([
            { productoId: 1, cantidad: 2 },
            { productoId: 3, cantidad: 1 },
        ]);
    });

    it("suma la cantidad si el producto ya estaba", () => {
        const carrito: Carrito = [{ productoId: 1, cantidad: 2 }];

        const nuevo = anadir(carrito, 1, 3);

        expect(nuevo).toEqual([{ productoId: 1, cantidad: 5 }]);
    });

    it("no toca las demás líneas", () => {
        const carrito: Carrito = [
            { productoId: 1, cantidad: 2 },
            { productoId: 2, cantidad: 1 },
        ];

        const nuevo = anadir(carrito, 1, 1);

        expect(nuevo[1]).toEqual({ productoId: 2, cantidad: 1 });
    });

    it("no modifica el carrito original", () => {
        const carrito: Carrito = [{ productoId: 1, cantidad: 2 }];

        const nuevo = anadir(carrito, 1, 3);

        expect(nuevo).not.toBe(carrito);
        expect(carrito).toEqual([{ productoId: 1, cantidad: 2 }]);
    });
});

describe("quitar", () => {
    it("saca la línea del producto", () => {
        const carrito: Carrito = [
            { productoId: 1, cantidad: 2 },
            { productoId: 2, cantidad: 1 },
        ];

        const nuevo = quitar(carrito, 1);

        expect(nuevo).toEqual([{ productoId: 2, cantidad: 1 }]);
    });

    it("deja el carrito igual si el producto no estaba", () => {
        const carrito: Carrito = [{ productoId: 1, cantidad: 2 }];

        const nuevo = quitar(carrito, 99);

        expect(nuevo).toEqual([{ productoId: 1, cantidad: 2 }]);
    });

    it("con el carrito vacío devuelve un carrito vacío", () => {
        expect(quitar([], 1)).toEqual([]);
    });

    it("no modifica el carrito original", () => {
        const carrito: Carrito = [{ productoId: 1, cantidad: 2 }];

        const nuevo = quitar(carrito, 1);

        expect(nuevo).not.toBe(carrito);
        expect(carrito).toEqual([{ productoId: 1, cantidad: 2 }]);
    });
});

describe("cambiarCantidad", () => {
    it("sustituye la cantidad, no la suma", () => {
        const carrito: Carrito = [{ productoId: 1, cantidad: 2 }];

        const nuevo = cambiarCantidad(carrito, 1, 5);

        expect(nuevo).toEqual([{ productoId: 1, cantidad: 5 }]);
    });

    it("con 0 quita la línea", () => {
        const carrito: Carrito = [{ productoId: 1, cantidad: 2 }];

        const nuevo = cambiarCantidad(carrito, 1, 0);

        expect(nuevo).toEqual([]);
    });

    it("con una cantidad negativa también quita la línea", () => {
        const carrito: Carrito = [{ productoId: 1, cantidad: 2 }];

        const nuevo = cambiarCantidad(carrito, 1, -3);

        expect(nuevo).toEqual([]);
    });

    it("deja el carrito igual si el producto no estaba", () => {
        const carrito: Carrito = [{ productoId: 1, cantidad: 2 }];

        const nuevo = cambiarCantidad(carrito, 99, 4);

        expect(nuevo).toEqual([{ productoId: 1, cantidad: 2 }]);
    });

    it("no modifica el carrito original", () => {
        const carrito: Carrito = [{ productoId: 1, cantidad: 2 }];

        const nuevo = cambiarCantidad(carrito, 1, 5);

        expect(nuevo).not.toBe(carrito);
        expect(carrito).toEqual([{ productoId: 1, cantidad: 2 }]);
    });
});
