/**
 * Catálogo de la tienda: los productos disponibles y las consultas sobre ellos.
 * Las funciones reciben el catálogo por parámetro y nunca lo modifican.
 */

import type { Producto, Categoria } from "./producto.ts";

const catalogo: Producto[] = [
    { id: 1, nombre: "Camiseta",        precio: 1990, stock: 10, categoria: "camisetas" },
    { id: 2, nombre: "Sudadera",        precio: 3990, stock: 4,  categoria: "sudaderas" },
    { id: 3, nombre: "Vaqueros",        precio: 4990, stock: 7,  categoria: "pantalones" },
    { id: 4, nombre: "Zapatillas",      precio: 5990, stock: 3,  categoria: "zapatillas" },
    { id: 5, nombre: "Camiseta básica", precio: 1290, stock: 15, categoria: "camisetas" },
];

/** Devuelve el producto con ese id, o `undefined` si no existe. */
function buscarPorId(catalogo: Producto[], id: number): Producto | undefined {
    return catalogo.find(p => p.id === id);
}

/** Devuelve los productos de una categoría; lista vacía si no hay ninguno. */
function filtrarPorCategoria(catalogo: Producto[], categoria: Categoria): Producto[] {
    return catalogo.filter(p => p.categoria === categoria);
}

/** Devuelve una copia ordenada de más barato a más caro, sin tocar el original. */
function ordenarPorPrecio(catalogo: Producto[]): Producto[] {
    return catalogo.toSorted((a, b) => a.precio - b.precio);
}

// Pruebas manuales: cada consulta con un caso normal y uno sin resultados.

console.log("— buscarPorId —");
console.log(buscarPorId(catalogo, 2));
console.log(buscarPorId(catalogo, 99));

const producto = buscarPorId(catalogo, 99);
if (producto === undefined) {
    console.log("No existe ningún producto con ese id");
} else {
    console.log(producto.nombre);
}

console.log("\n— filtrarPorCategoria —");
console.log(filtrarPorCategoria(catalogo, "camisetas"));
console.log(filtrarPorCategoria(catalogo, "gorras"));

console.log("\n— ordenarPorPrecio —");
console.log(ordenarPorPrecio(catalogo).map(p => `${p.nombre}: ${p.precio}`));

console.log("\n— catálogo original, sin cambios —");
console.log(catalogo.map(p => `${p.nombre}: ${p.precio}`));
