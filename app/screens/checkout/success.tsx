import { useOrders } from "@/src/context/ordersContext";
import { orderConsumer, orderDetailsConsumer } from "@/src/services/client";
import { router, useFocusEffect, useRouter } from "expo-router";
import React from "react";
import { useEffect } from "react";
import { Text } from "react-native";
import uuid from 'react-native-uuid';

export default function SuccessScreen() {

    const { setOrderQR,orderQR,clearCart } = useOrders();
    const router = useRouter();

    const generateUUID = () => {
        return uuid.v4();
    }
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
                router.navigate("/screens/");
            };
            updateState();
        }, [])
    );
   
    
    return (<Text>Success</Text>);
}

