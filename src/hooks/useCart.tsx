import React, { useMemo, useState } from "react";
import { View, Text, Button } from 'react-native';
import { ProductType } from "../types/product.type";

type CartItemType = {
    product: ProductType;
    quantity: number;
    subtotal: number;
};

export default function useCart() {
    const [cart, setCart] = useState<CartItemType[]>([]);

    const total = useMemo(() => cart.reduce((acc, curr) => acc + curr.subtotal, 0), [ cart ]);

    const updateCart = (index: number, quantity: number) => {
        setCart((prev) => 
          prev.map((item, i) => {
            if (i !== index) return item;
            return {
              ...item,
              quantity,  // Actualizamos la cantidad
              subtotal: item.product.price * quantity  // Recalculamos el subtotal
            };
          })
        );
      };

      return {
        cart,
        addToCart: ({ product , quantity }: { product: ProductType, quantity: number}) =>  setCart((prev) => [...prev, { product, quantity, subtotal: product.price * quantity }]),
        removeFromCart: (index: number) => setCart((prev) => prev.filter((_, i) => i !== index)),
        clearCart: () => setCart([]),
        updateCart,
        total
      };
}
