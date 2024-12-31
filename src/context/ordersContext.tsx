import { createContext, useContext, useState } from "react";
import { Alert } from "react-native";

interface CartItem {
    product: any;
    quantity: number;
    subtotal: number;
}

interface OrdersContextType {
    cart: CartItem[];
    currentCommerceId: number | null;
    total: number;
    orderQR: string;
    addToCart: (props: { product: any; quantity: number }) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    setOrderQR: (qr: string) => void;
    getProductQuantityInCart: (productId: number) => number;
    updateCartItem: (productId: number, newQuantity: number) => void;
}

const OrdersContext = createContext<OrdersContextType>({
    cart: [],
    currentCommerceId: null,
    total: 0,
    orderQR: "",
    addToCart: () => { },
    removeFromCart: () => { },
    clearCart: () => { },
    setOrderQR: () => { },
    getProductQuantityInCart: () => 0,
    updateCartItem: () => { },
});

export function OrdersProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [currentCommerceId, setCurrentCommerceId] = useState<number | null>(null);
    const [orderQR, setOrderQR] = useState("");

    const getProductQuantityInCart = (productId: number): number => {
        const item = cart.find(item => item.product.id === productId);
        return item ? item.quantity : 0;
    };

    const addToCart = ({ product, quantity }: { product: any; quantity: number }) => {
        if (currentCommerceId && product.commerceId !== currentCommerceId) {
            Alert.alert(
                "Different Commerce",
                "You can only add products from the same commerce in a single order. Would you like to clear your cart and add this item?",
                [
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    {
                        text: "Clear Cart & Add",
                        onPress: () => {
                            setCart([{ product, quantity, subtotal: product.price * quantity }]);
                            setCurrentCommerceId(product.commerceId);
                        }
                    }
                ]
            );
            return;
        }

        if (!currentCommerceId) {
            setCurrentCommerceId(product.commerceId);
        }

        const existingItem = cart.find(item => item.product.id === product.id);
        
        if (existingItem) {
            setCart(cart.map(item =>
                item.product.id === product.id
                    ? { ...item, quantity: item.quantity + quantity, subtotal: (item.quantity + quantity) * item.product.price }
                    : item
            ));
        } else {
            setCart([...cart, { product, quantity, subtotal: product.price * quantity }]);
        }
    };

    const removeFromCart = (productId: string) => {
        setCart(cart.filter(item => item.product.id !== productId));
        if (cart.length === 1) {
            setCurrentCommerceId(null);
        }
    };

    const clearCart = () => {
        setCart([]);
        setCurrentCommerceId(null);
        setOrderQR("");
    };

    const total = cart.reduce((acc, item) => acc + item.subtotal, 0);

    const updateCartItem = (productId: number, newQuantity: number) => {
        setCart(cart.map(item => 
            item.product.id === productId
                ? { ...item, quantity: newQuantity, subtotal: item.product.price * newQuantity }
                : item
        ));
    };

    return (
        <OrdersContext.Provider value={{
            cart,
            currentCommerceId,
            total,
            orderQR,
            addToCart,
            removeFromCart,
            clearCart,
            setOrderQR,
            getProductQuantityInCart,
            updateCartItem,
        }}>
            {children}
        </OrdersContext.Provider>
    );
}

export const useOrders = () => useContext(OrdersContext);