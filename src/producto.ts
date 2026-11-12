/**
 * Modelo de producto de la tienda.
 * Los precios se guardan en céntimos (enteros) para evitar errores de redondeo.
 */

export type Categoria = "camisetas" | "pantalones" | "zapatillas" | "gorras" | "sudaderas";
export type TipoCupon = "porcentaje" | "fijo";
export type Cupon =
    | { codigo: string; tipo: "porcentaje"; valor: number }
    | { codigo: string; tipo: "fijo"; valor: number };

/** Normaliza un código de cupón: quita espacios y pasa a mayúsculas. */
function normalizarCodigo(codigo: string): string {
    return codigo.trim().toUpperCase();
}

export const CUPONES: readonly Cupon[] = [
    { codigo: "VERANO20", tipo: "porcentaje", valor: 20 },
    { codigo: "AHORRA5",  tipo: "fijo",       valor: 500   }, // -5 €
    { codigo: "MEGADTO",  tipo: "fijo",       valor: 10000 }, // -100 € (mayor que un carrito barato)
];

export function buscarCupon(codigo: string): Cupon | undefined {
    const buscado = normalizarCodigo(codigo);
    return CUPONES.find(c => normalizarCodigo(c.codigo) === buscado);
}

export type Producto = {
    id: number;
    nombre: string;
    /** Precio en céntimos: 1990 son 19,90 €. */
    precio: number;
    stock: number;
    categoria: Categoria;
};
