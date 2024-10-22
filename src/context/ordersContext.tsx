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
            // cancelOrder: (index) => setOrders((prev) => prev.filter((_, i) => i !== index)),
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