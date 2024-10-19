import { useOrders } from "@/src/context/ordersContext";
import { orderConsumer, orderDetailsConsumer } from "@/src/services/client";
import { router, useRouter } from "expo-router";
import { useEffect } from "react";
import { Text } from "react-native";
import uuid from 'react-native-uuid';

export default function SuccessScreen() {

    const { setOrderQR,orderQR,clearCart } = useOrders();
    const router = useRouter();

    const generateUUID = () => {
        return uuid.v4();
    }

    useEffect(() => {
        const updateState = async () => {
            let response = await orderDetailsConsumer.consume('PATCH', {
                params: { id: Number(orderQR.split('=')[1])},
                data:
                {
                  status: "completed"  
                }
            });
            console.log("update state to complete: ",response.status);
            setOrderQR("");
            clearCart();
        };
        updateState();
    }, []);

    
    return (<Text>Success</Text>);
}

