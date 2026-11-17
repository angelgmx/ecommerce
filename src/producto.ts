/**
 * Modelo de producto de la tienda.
 * Los precios se guardan en céntimos (enteros) para evitar errores de redondeo.
 */
import { z } from "zod";

export const EsquemaCategoria = z.enum(["camisetas", "pantalones", "zapatillas", "gorras", "sudaderas"]);

export const EsquemaProducto = z.object({
    id: z.number().int().positive(),
    nombre: z.string().min(1),
    /** Precio en céntimos: 1990 son 19,90 €. */
    precio: z.number().int().positive(),
    stock: z.number().int().nonnegative(),
    categoria: EsquemaCategoria,
});

/** Lo que llega de fuera: el id lo pone el sistema (ADR-006). */
export const EsquemaNuevoProducto = EsquemaProducto.omit({ id: true });

export type Categoria = z.infer<typeof EsquemaCategoria>;
export type Producto = z.infer<typeof EsquemaProducto>;
export type NuevoProducto = z.infer<typeof EsquemaNuevoProducto>;

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
