import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { obtenerProducto, crearCatalogoConCache, ProductoNoEncontrado } from "./catalogo-remoto.ts";
import { catalogo } from "./catalogo.ts";

beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    vi.useRealTimers();
});

describe("obtenerProducto", () => {
    it("devuelve el producto pasados 200 ms", async () => {
        const promesa = obtenerProducto(1);

        await vi.advanceTimersByTimeAsync(200);

        await expect(promesa).resolves.toEqual(catalogo[0]);
    });

    it("rechaza con ProductoNoEncontrado si el id no existe", async () => {
        const promesa = obtenerProducto(99);
        const comprobacion = expect(promesa).rejects.toThrow(ProductoNoEncontrado);

        await vi.advanceTimersByTimeAsync(200);

        await comprobacion;
    });
});

describe("crearCatalogoConCache", () => {
    it("la primera vez espera 200 ms y devuelve el catálogo", async () => {
        const obtener = crearCatalogoConCache();

        const promesa = obtener();
        await vi.advanceTimersByTimeAsync(200);

        await expect(promesa).resolves.toEqual(catalogo);
    });

    it("la segunda vez responde sin esperar", async () => {
        const obtener = crearCatalogoConCache();
        const primera = obtener();
        await vi.advanceTimersByTimeAsync(200);
        await primera;

        const segunda = await obtener();

        expect(segunda).toEqual(catalogo);
    });

    it("cada llamada devuelve una copia: modificarla no toca la caché", async () => {
        const obtener = crearCatalogoConCache();
        const primera = obtener();
        await vi.advanceTimersByTimeAsync(200);
        const copia = await primera;

        copia.pop();

        expect(await obtener()).toHaveLength(catalogo.length);
    });
});
