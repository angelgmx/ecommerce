/**
 * Guarda y busca datos sin que el resto de la app sepa dónde están.
 * Es el único sitio con estado; lo que entra y sale sigue siendo inmutable (ADR-003).
 */

import type { NuevoProducto, Producto } from "./producto.ts";
import { ProductoNoEncontrado } from "./catalogo-remoto.ts";

/** Contrato del almacén. Vale para cualquier cosa con id, sea number (Producto) o string (Pedido). */
interface Repositorio<Elemento extends { id: number | string }> {
    /** Todos los elementos, en un array de solo lectura. */
    todos(): readonly Elemento[];
    /** El elemento con ese id, o undefined si no existe. */
    buscarPorId(id: Elemento["id"]): Elemento | undefined;
    /** Lo crea si no existe y lo sustituye si ya existe. */
    guardar(elemento: Elemento): void;
    /** true si existía y lo ha borrado, false si no. */
    borrar(id: Elemento["id"]): boolean;
}

/**
 * Guarda productos o pedidos en memoria mientras no hay base de datos.
 * Usa un Map para encontrar cualquier elemento por su id al momento.
 * Cuando llegue PostgreSQL, otra clase ocupará su sitio sin tocar el resto del código.
 */
class RepositorioEnMemoria<Elemento extends { id: number | string }> implements Repositorio<Elemento> {
    private datos: Map<Elemento["id"], Elemento>;

    constructor(iniciales: Elemento[] = []) {
        this.datos = new Map();
        for (const elemento of iniciales) {
            this.datos.set(elemento.id, elemento);
        }
    }

    todos(): readonly Elemento[] {
        return [...this.datos.values()];
    }

    buscarPorId(id: Elemento["id"]): Elemento | undefined {
        return this.datos.get(id);
    }

    guardar(elemento: Elemento): void {
        this.datos.set(elemento.id, elemento);
    }

    borrar(id: Elemento["id"]): boolean {
        return this.datos.delete(id);
    }
}

// Partial: todos los campos opcionales. Al editar se cambia cualquiera menos el id.
type EdicionProducto = Partial<NuevoProducto>;
// Pick: solo los campos indicados. Lo justo para listar.
type ResumenProducto = Pick<Producto, "id" | "nombre" | "precio">;

/** Crea un producto nuevo con los cambios aplicados. Lanza ProductoNoEncontrado si el id no existe. */
function editarProducto(repo: Repositorio<Producto>, id: number, cambios: EdicionProducto): Producto {
    const producto = repo.buscarPorId(id);
    if (producto === undefined) {
        throw new ProductoNoEncontrado(`El producto ${id} no ha sido encontrado`);
    }
    const productoEditado = { ...producto, ...cambios };
    repo.guardar(productoEditado);
    return productoEditado;
}

/** Lista todos los productos con solo id, nombre y precio. */
function listarResumen(repo: Repositorio<Producto>): ResumenProducto[] {
    return repo.todos().map(producto => ({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
    }));
}
