import React, { createContext, useState } from "react";

import useCart from "../hooks/useCart";

type OrdersContextType = {
    cart: any;
    clearCart: () => void;
    addToCart: ({ product, quantity }: { product: any, quantity: number }) => void;
    removeFromCart: (index: number) => void;
    updateCart: (index: number, quantity: number) => void;
    total: number;
    orderQR: string; 
    setOrderQR: (note: string) => void;

    orders: OrdersDataType[];
    // cancelOrder: (index: number) => void;
    confirmOrder: (payment: number) => void;
    getOrder: (index: number) => OrdersDataType | false;
    getProductQuantityInCart: (productId: number) => number;
};

export const OrdersContext = createContext<OrdersContextType>({} as OrdersContextType);

export const useOrders = () => React.useContext(OrdersContext);

type OrdersDataType = {
    bill: {
        item: any;
        total: number;
    };
    status: string;
    payment: number;
};

export const OrdersProvider = ({ children }: { children: React.ReactNode }) => {
    // let { commerceRef } = useCommerce(); 

    // let { data: ordersData, collectionObserver, addDocument } = useFirestoreCollection(collection(commerceRef, "orders"));
    // TODO: Add a filter to get only the orders of the current session.
    const [orders, setOrders] = useState<OrdersDataType[]>([]);
    const [orderQR, setOrderQR] = useState<string>("");

    let { cart, clearCart, addToCart, removeFromCart, updateCart, total } = useCart();

    const getProductQuantityInCart = (productId: number): number => {
        return cart.reduce((total: number, item: any) => {
            if (item.product.id === productId) {
                return total + item.quantity;
            }
            console.log("GET PRODUCT QUANTITY IN CART", total);
            return total;
        }, 0);
    };

    return (
        <OrdersContext.Provider value={{
            cart,
            clearCart,
            addToCart,
            removeFromCart,
            updateCart,
            total,
            orderQR,
            setOrderQR,
            orders,
            getProductQuantityInCart,
            confirmOrder: (payment: number) => {
                // addDocument({ bill: { item: cart, total }, status: "pending", payment: payment });
                clearCart();
            },
            getOrder: (index: number) => index < orders.length && orders[index],
        }}>
            {children}
        </OrdersContext.Provider>
    )
};