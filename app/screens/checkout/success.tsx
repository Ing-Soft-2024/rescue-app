import { useOrders } from "@/src/context/ordersContext";
import { commerceConsumer, commerceDetailsConsumer, orderDetailsConsumer } from "@/src/services/client";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, Text, View, TextInput } from "react-native";

export default function SuccessScreen() {
    const { setOrderQR, orderQR, clearCart } = useOrders();
    const router = useRouter();
    const [rating, setRating] = React.useState("");
    const [businessId, setBusinessId] = React.useState<number | null>(null);

    useFocusEffect(
        React.useCallback(() => {
            const updateState = async () => {
                try {
                    // First get the order details to get the businessId
                    const orderId = Number(orderQR.split('=')[1]);
                    const orderDetails = await orderDetailsConsumer.consume('GET', {
                        params: { id: orderId }
                    });

                    // Store the businessId for rating
                    setBusinessId(orderDetails.businessId);

                    // Update order status
                    let response = await orderDetailsConsumer.consume('PATCH', {
                        params: { id: orderId },
                        data: {
                            status: "completed"
                        }
                    });

                    console.log("update state to complete: ", response.status);
                    setOrderQR("");
                    clearCart();
                } catch (error) {
                    console.error("Error updating order:", error);
                }
            };
            updateState();
        }, [])
    );

    async function handleSubmission() {
        if (!businessId) {
            console.error("No business ID available");
            return;
        }

        try {
            const response = await commerceDetailsConsumer.consume('PATCH', {
                params: { id: businessId },
                data: {
                    rating: Number(rating)
                }
            });
            console.log("Rating submitted:", rating);
            router.navigate("/screens/");
        } catch (error) {
            console.error("Error submitting rating:", error);
        }
    }

    return (
        <View>
            <Text style={{fontSize: 20, color: 'black'}}>Tu orden ha sido completada exitosamente</Text>
            <Text style={{fontSize: 20, color: 'black'}}>Dejanos una valoracion de tu pedido</Text>
            <TextInput 
                keyboardType="numeric"
                onChangeText={setRating}
                style={{
                    borderWidth: 1,
                    borderColor: '#D4685E',
                    borderRadius: 5,
                    padding: 10,
                    marginVertical: 10
                }}
            />

            <Pressable 
                style={{padding: 10, backgroundColor: "#D4685E", borderRadius: 10, marginVertical: 10}} 
                onPress={handleSubmission}
            >
                <Text style={{fontSize: 20, color: 'black'}}>Enviar</Text>
            </Pressable>

            <Pressable 
                style={{padding: 10, backgroundColor: "#D4685E", borderRadius: 10}} 
                onPress={() => router.navigate("/screens/")}
            >
                <Text style={{fontSize: 20, color: 'white'}}>Saltear este paso</Text>
            </Pressable>
        </View>
    );
}

