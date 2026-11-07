/**
 * Modelo de producto de la tienda.
 * Los precios se guardan en céntimos (enteros) para evitar errores de redondeo.
 */

export type Categoria = "camisetas" | "pantalones" | "zapatillas" | "gorras" | "sudaderas";

export type Producto = {
    id: number;
    nombre: string;
    /** Precio en céntimos: 1990 son 19,90 €. */
    precio: number;
    stock: number;
    categoria: Categoria;
};
