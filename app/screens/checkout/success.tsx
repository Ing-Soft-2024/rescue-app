import { useOrders } from "@/src/context/ordersContext";
import { commerceConsumer, commerceDetailsConsumer, orderDetailsConsumer } from "@/src/services/client";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, Text, View, TextInput } from "react-native";

import uuid from 'react-native-uuid';

export default function SuccessScreen() {

    const { setOrderQR,orderQR,clearCart } = useOrders();
    const router = useRouter();
    const seconds = 5;
    const [rating, setRating] = React.useState("");
    const generateUUID = () => {
        return uuid.v4();
    }


    //const waitSeconds = () => new Promise(resolve => setTimeout(resolve, seconds * 1000));
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
               // router.canGoBack() && router.back();
               // router.navigate("/screens/");
            };
            updateState();
        }, [])
    );

    async function handleSubmission() {
        
        var response = await commerceDetailsConsumer.consume('PATCH', {
            params: { id: 1 },
            data:
            {
               rating: Number(rating)
            }
        }).catch((error) => {
            console.log("el error es:" + error);
            return null;
        });
        console.log("Rating: ", rating);
        router.navigate("/screens/");
    }
   
    
    return (
        <View>
            <Text style={{fontSize: 20, color: 'black'}}>Tu orden ha sido completada exitosamente</Text>
            <Text style={{fontSize: 20, color: 'black'}}>Dejanos una valoracion de tu pedido</Text>
            <TextInput keyboardType="numeric"
                        onChangeText={setRating}></TextInput>

            <Pressable style={{padding: 10, backgroundColor: "#D4685E", borderRadius: 10}} onPress={handleSubmission}>
                <Text style={{fontSize: 20, color: 'black'}}>Enviar</Text>
            </Pressable>

            <Pressable style={{padding: 10, backgroundColor: "#D4685E", borderRadius: 10}} onPress={() => router.navigate("/screens/")}>
                <Text style={{fontSize: 20, color: 'white'}}>Saltear este paso</Text>
            </Pressable>
        </View>
       
    );
}

