import { describe, it, expect } from "vitest";
import { RepositorioEnMemoria, editarProducto, listarResumen } from "./repositorio.ts";
import { ProductoNoEncontrado } from "./catalogo-remoto.ts";
import type { Producto } from "./producto.ts";

const camiseta: Producto = { id: 1, nombre: "Camiseta", precio: 1990, stock: 10, categoria: "camisetas" };
const gorra: Producto = { id: 2, nombre: "Gorra", precio: 999, stock: 5, categoria: "gorras" };

describe("RepositorioEnMemoria", () => {
    it("empieza vacío si no se le da nada", () => {
        expect(new RepositorioEnMemoria<Producto>().todos()).toEqual([]);
    });

    it("arranca con los elementos iniciales", () => {
        const repo = new RepositorioEnMemoria([camiseta, gorra]);

        expect(repo.todos()).toEqual([camiseta, gorra]);
    });

    it("busca por id", () => {
        const repo = new RepositorioEnMemoria([camiseta, gorra]);

        expect(repo.buscarPorId(2)).toEqual(gorra);
        expect(repo.buscarPorId(99)).toBeUndefined();
    });

    it("guardar crea si no existe", () => {
        const repo = new RepositorioEnMemoria<Producto>();

        repo.guardar(camiseta);

        expect(repo.todos()).toEqual([camiseta]);
    });

    it("guardar sustituye si ya existe, sin duplicar", () => {
        const repo = new RepositorioEnMemoria([camiseta]);

        repo.guardar({ ...camiseta, precio: 1500 });

        expect(repo.todos()).toEqual([{ ...camiseta, precio: 1500 }]);
    });

    it("borrar devuelve true si existía y lo quita", () => {
        const repo = new RepositorioEnMemoria([camiseta, gorra]);

        expect(repo.borrar(1)).toBe(true);
        expect(repo.todos()).toEqual([gorra]);
    });

    it("borrar devuelve false si no existía", () => {
        const repo = new RepositorioEnMemoria([camiseta]);

        expect(repo.borrar(99)).toBe(false);
    });

    it("vale también para ids de texto", () => {
        const repo = new RepositorioEnMemoria([{ id: "a1", total: 100 }]);

        expect(repo.buscarPorId("a1")).toEqual({ id: "a1", total: 100 });
    });
});

describe("editarProducto", () => {
    it("cambia solo los campos indicados y lo guarda", () => {
        const repo = new RepositorioEnMemoria([camiseta]);

        const editado = editarProducto(repo, 1, { precio: 1500 });

        expect(editado).toEqual({ ...camiseta, precio: 1500 });
        expect(repo.buscarPorId(1)).toEqual(editado);
    });

    it("no modifica el producto original", () => {
        const repo = new RepositorioEnMemoria([camiseta]);

        editarProducto(repo, 1, { stock: 0 });

        expect(camiseta.stock).toBe(10);
    });

    it("lanza ProductoNoEncontrado si el id no existe", () => {
        const repo = new RepositorioEnMemoria([camiseta]);

        expect(() => editarProducto(repo, 99, { precio: 1 })).toThrow(ProductoNoEncontrado);
    });
});

describe("listarResumen", () => {
    it("devuelve solo id, nombre y precio", () => {
        const repo = new RepositorioEnMemoria([camiseta, gorra]);

        expect(listarResumen(repo)).toEqual([
            { id: 1, nombre: "Camiseta", precio: 1990 },
            { id: 2, nombre: "Gorra", precio: 999 },
        ]);
    });
});
