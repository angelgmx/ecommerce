import { describe, it, expect } from "vitest";
import { buscarPorId, filtrarPorCategoria, ordenarPorPrecio } from "./catalogo.ts";
import type { Producto } from "./producto.ts";

const productos: Producto[] = [
    { id: 1, nombre: "Camiseta", precio: 1990, stock: 10, categoria: "camisetas" },
    { id: 2, nombre: "Sudadera", precio: 3990, stock: 4, categoria: "sudaderas" },
    { id: 3, nombre: "Camiseta básica", precio: 1290, stock: 15, categoria: "camisetas" },
];

describe("buscarPorId", () => {
    it("devuelve el producto con ese id", () => {
        const producto = buscarPorId(productos, 2);

        expect(producto?.nombre).toBe("Sudadera");
    });

    it("devuelve undefined si el id no existe", () => {
        expect(buscarPorId(productos, 99)).toBeUndefined();
    });

    it("devuelve undefined con el catálogo vacío", () => {
        expect(buscarPorId([], 1)).toBeUndefined();
    });
});

describe("filtrarPorCategoria", () => {
    it("devuelve solo los productos de esa categoría", () => {
        const camisetas = filtrarPorCategoria(productos, "camisetas");

        expect(camisetas.map(p => p.id)).toEqual([1, 3]);
    });

    it("devuelve una lista vacía si no hay productos de esa categoría", () => {
        expect(filtrarPorCategoria(productos, "gorras")).toEqual([]);
    });
});

describe("ordenarPorPrecio", () => {
    it("ordena de más barato a más caro", () => {
        const ordenados = ordenarPorPrecio(productos);

        expect(ordenados.map(p => p.precio)).toEqual([1290, 1990, 3990]);
    });

    it("no modifica el catálogo original", () => {
        const ordenados = ordenarPorPrecio(productos);

        expect(ordenados).not.toBe(productos);
        expect(productos.map(p => p.id)).toEqual([1, 2, 3]);
    });

    it("con el catálogo vacío devuelve una lista vacía", () => {
        expect(ordenarPorPrecio([])).toEqual([]);
    });
});
