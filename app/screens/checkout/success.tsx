import { useOrders } from "@/src/context/ordersContext";
import { orderDetailsConsumer } from "@/src/services/client";
import { useFocusEffect, useRouter } from "expo-router";
import React from "react";
import { Text } from "react-native";
import uuid from 'react-native-uuid';

export default function SuccessScreen() {

    const { setOrderQR,orderQR,clearCart } = useOrders();
    const router = useRouter();
    const seconds = 5;
    const generateUUID = () => {
        return uuid.v4();
    }

    const waitSeconds = () => new Promise(resolve => setTimeout(resolve, seconds * 1000));
    useFocusEffect(
        React.useCallback(() => {
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
                router.canGoBack() && router.back();
                router.navigate("/screens/");
            };
            updateState();
        }, [])
    );
   
    
    return (<Text>Success</Text>);
}

