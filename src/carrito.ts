/**
 * Carrito de la compra: una lista de líneas con el producto y sus unidades.
 * Las funciones nunca modifican el carrito que reciben: devuelven uno nuevo.
 */

/** Una línea del carrito. Guarda solo el id: el nombre y el precio ya están en el catálogo. */
export type LineaCarrito = {
    productoId: number;
    cantidad: number;
};

/** Alias de tipo: Carrito es otro nombre para «array de LineaCarrito». */
export type Carrito = LineaCarrito[];

/**
 * Mete unidades de un producto en el carrito.
 * Si no estaba, crea una línea nueva al final; si ya estaba, suma la cantidad.
 */
export function anadir(carrito: Carrito, productoId: number, cantidad: number): Carrito {
    // some: ¿hay alguna línea con este producto? Devuelve true o false.
    const estaEnCarrito = carrito.some(linea => linea.productoId === productoId);

    if (!estaEnCarrito) {
        // Spread de array: copia todas las líneas y añade la nueva al final.
        return [...carrito, { productoId, cantidad }];
    }

    // map: recorre todas las líneas y devuelve un array nuevo del mismo tamaño.
    return carrito.map(linea => {
        if (linea.productoId === productoId) {
            // Spread de objeto: copia la línea y pisa la cantidad con la suma.
            return { ...linea, cantidad: linea.cantidad + cantidad };
        }
        // Las demás salen tal cual: son las mismas, no copias.
        return linea;
    });
}

/**
 * Saca un producto del carrito.
 * filter se queda con las líneas que NO son ese producto; si no estaba, el carrito sale igual.
 */
export function quitar(carrito: Carrito, productoId: number): Carrito {
    return carrito.filter(linea => linea.productoId !== productoId);
}

/**
 * Pone la cantidad exacta de un producto (sustituye, no suma).
 * Con 0 o menos, quita la línea. Si el producto no está, el carrito sale igual.
 */
export function cambiarCantidad(carrito: Carrito, productoId: number, cantidad: number): Carrito {
    if (cantidad <= 0) {
        return quitar(carrito, productoId);
    }

    return carrito.map(linea => {
        if (linea.productoId === productoId) {
            return { ...linea, cantidad };
        }
        return linea;
    });
}

const vacio: Carrito = [];

const conUno = anadir(vacio, 1, 2);
console.log("Añadir producto 1 (x2):", conUno, "| antes:", vacio);

const conDos = anadir(conUno, 3, 1);
console.log("Añadir producto 3 (x1):", conDos, "| antes:", conUno);

const sumado = anadir(conDos, 1, 1);
console.log("Volver a añadir el 1 (+1, tiene que sumar):", sumado, "| antes:", conDos);

const cambiado = cambiarCantidad(sumado, 3, 5);
console.log("Cambiar el 3 a 5 unidades:", cambiado, "| antes:", sumado);

const aCero = cambiarCantidad(cambiado, 3, 0);
console.log("Cambiar el 3 a 0 (tiene que desaparecer):", aCero, "| antes:", cambiado);

const sinElUno = quitar(cambiado, 1);
console.log("Quitar el 1:", sinElUno, "| antes:", cambiado);

const sinCambios = quitar(cambiado, 99);
console.log("Quitar el 99, que no está (sale igual):", sinCambios, "| antes:", cambiado);
