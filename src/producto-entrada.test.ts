import { describe, it, expect } from "vitest";
import { leerNuevoProducto } from "./producto-entrada.ts";

const gorra = { nombre: "Gorra", precio: 1500, stock: 3, categoria: "gorras" };

describe("leerNuevoProducto", () => {
    describe("acepta", () => {
        it("un producto con todos los campos correctos", () => {
            const resultado = leerNuevoProducto(JSON.stringify(gorra));

            expect(resultado).toEqual({ valido: true, producto: gorra });
        });

        it("un producto con stock 0", () => {
            const resultado = leerNuevoProducto(JSON.stringify({ ...gorra, stock: 0 }));

            expect(resultado.valido).toBe(true);
        });

        it("un producto con campos de más, pero los quita", () => {
            const resultado = leerNuevoProducto(JSON.stringify({ ...gorra, descuento: 90 }));

            expect(resultado).toEqual({ valido: true, producto: gorra });
        });
    });

    describe("rechaza un texto que no es JSON", () => {
        it.each([
            ["mal escrito", "{nombre: 'Camiseta'}"],
            ["vacío", ""],
        ])("%s", (_, texto) => {
            expect(leerNuevoProducto(texto)).toEqual({
                valido: false,
                errores: ["el JSON no es válido"],
            });
        });
    });

    describe("rechaza un JSON que no es un objeto", () => {
        it.each([
            ["null", "null"],
            ["un array", "[1, 2]"],
            ["un número", "123"],
        ])("%s", (_, texto) => {
            const resultado = leerNuevoProducto(texto);

            expect(resultado.valido).toBe(false);
            if (!resultado.valido) {
                expect(resultado.errores).toHaveLength(1);
                expect(resultado.errores[0]).toMatch(/expected object/);
            }
        });
    });

    describe("rechaza campos incorrectos", () => {
        it("un objeto vacío da un error por cada campo, no se para en el primero", () => {
            const resultado = leerNuevoProducto("{}");

            expect(resultado.valido).toBe(false);
            if (!resultado.valido) {
                expect(resultado.errores).toHaveLength(4);
            }
        });

        it.each([
            ["nombre vacío", { nombre: "" }, "nombre"],
            ["nombre que es un número", { nombre: 123 }, "nombre"],
            ["precio 0", { precio: 0 }, "precio"],
            ["precio negativo", { precio: -5 }, "precio"],
            ["precio con decimales", { precio: 9.99 }, "precio"],
            ["precio como texto", { precio: "100" }, "precio"],
            ["stock negativo", { stock: -1 }, "stock"],
            ["stock con decimales", { stock: 2.5 }, "stock"],
            ["categoría que no es de la tienda", { categoria: "juguetes" }, "categoria"],
        ])("%s", (_, cambio, campo) => {
            const resultado = leerNuevoProducto(JSON.stringify({ ...gorra, ...cambio }));

            expect(resultado.valido).toBe(false);
            if (!resultado.valido) {
                expect(resultado.errores).toHaveLength(1);
                expect(resultado.errores[0]).toMatch(new RegExp(`^${campo}: `));
            }
        });
    });
});
