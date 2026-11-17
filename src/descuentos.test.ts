import { describe, it, expect } from "vitest";
import { subtotal, totalConCupon, CuponNoValido } from "./descuentos.ts";
import type { Carrito } from "./carrito.ts";
import type { Producto } from "./producto.ts";

const productos: Producto[] = [
    { id: 1, nombre: "Camiseta", precio: 1990, stock: 10, categoria: "camisetas" },
    { id: 2, nombre: "Gorra", precio: 999, stock: 5, categoria: "gorras" },
];

describe("subtotal", () => {
    it("suma precio por cantidad de cada línea", () => {
        const carrito: Carrito = [
            { productoId: 1, cantidad: 2 },
            { productoId: 2, cantidad: 1 },
        ];

        expect(subtotal(productos, carrito)).toBe(4979);
    });

    it("el carrito vacío vale 0", () => {
        expect(subtotal(productos, [])).toBe(0);
    });

    it("ignora un producto que ya no está en el catálogo", () => {
        const carrito: Carrito = [
            { productoId: 1, cantidad: 1 },
            { productoId: 99, cantidad: 3 },
        ];

        expect(subtotal(productos, carrito)).toBe(1990);
    });
});

describe("totalConCupon", () => {
    const dosCamisetas: Carrito = [{ productoId: 1, cantidad: 2 }];

    it("aplica un cupón de porcentaje", () => {
        expect(totalConCupon(productos, dosCamisetas, "VERANO20")).toBe(3184);
    });

    it("redondea el descuento al céntimo", () => {
        const unaGorra: Carrito = [{ productoId: 2, cantidad: 1 }];

        expect(totalConCupon(productos, unaGorra, "VERANO20")).toBe(799);
    });

    it("aplica un cupón fijo", () => {
        expect(totalConCupon(productos, dosCamisetas, "AHORRA5")).toBe(3480);
    });

    it("un cupón fijo mayor que el carrito deja el total en 0, nunca negativo", () => {
        expect(totalConCupon(productos, dosCamisetas, "MEGADTO")).toBe(0);
    });

    it("acepta el código en minúsculas y con espacios", () => {
        expect(totalConCupon(productos, dosCamisetas, "  verano20 ")).toBe(3184);
    });

    it("con el carrito vacío el total es 0", () => {
        expect(totalConCupon(productos, [], "AHORRA5")).toBe(0);
    });

    it("rechaza un cupón que no existe", () => {
        expect(() => totalConCupon(productos, dosCamisetas, "GRATIS")).toThrow(CuponNoValido);
    });
});
