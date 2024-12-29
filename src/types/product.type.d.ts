export type ProductType = {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    businessId: number;
    stock: number;
    categories: Array<{ name: string, description: string }>;
}

//el productScreen tiene un productType propio, y ese es el que se le agrega al carrito. no deberia usar este?