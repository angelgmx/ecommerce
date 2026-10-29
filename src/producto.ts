type Producto = {
    nombre: string;
    precio: number;
    stock: number;
};

const camiseta: Producto = { nombre: "Camiseta", precio: 1990, stock: 10};
console.log(`${camiseta.nombre}: ${(camiseta.precio / 100).toFixed(2)} €`);