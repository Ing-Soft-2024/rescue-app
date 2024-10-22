export type ProductType = {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
}

//el productScreen tiene un productType propio, y ese es el que se le agrega al carrito. no deberia usar este?