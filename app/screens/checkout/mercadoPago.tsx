import { useOrders } from "@/src/context/ordersContext";
import { mercadoPagoConsumer, orderDetailsConsumer } from "@/src/services/client";
import { initMercadoPago } from "@mercadopago/sdk-react";
import { useFocusEffect, useRouter } from "expo-router";
import { openAuthSessionAsync } from "expo-web-browser";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function MercadoPagoScreen() {
    if (!process.env['EXPO_PUBLIC_MERCADOPAGO_PUBLIC_KEY'])
        throw new Error('MERCADOPAGO_PUBLIC_KEY is not set');
    initMercadoPago(process.env['EXPO_PUBLIC_MERCADOPAGO_PUBLIC_KEY'], { locale: 'es-AR', });

    const [isLoading, setIsLoading] = React.useState(true);
    const [checkoutURL, setCheckoutURL] = React.useState<string | null>(null);

    const router = useRouter();
    const { orderQR } = useOrders();


    useFocusEffect(
        React.useCallback(() => {
            const createPreference = async () => {
                setIsLoading(true);
                console.log("Creating Mercado Pago preference");
                
                if (!orderQR) {
                    console.warn("No orderQR found");
                    setIsLoading(false);
                    return null;
                }

                const orderId = Number(orderQR.split('=')[1]);
                console.log("Processing order:", orderId);

                const getOrderResponse = await orderDetailsConsumer.consume('GET', {
                    params: { id: orderId }
                }).catch((error) => {
                    console.error("Error fetching order:", error);
                    return null;
                });

                if (!getOrderResponse) {
                    setIsLoading(false);
                    return null;
                }

                console.log("Current order status:", getOrderResponse.status);

                // Only proceed if the order is not already completed
                if (getOrderResponse.status === 'completed_mercadopago') {
                    console.log("Order already completed, redirecting to success");
                    router.replace("/screens/checkout/success");
                    setIsLoading(false);
                    return null;
                }

                const response = await mercadoPagoConsumer.consume('POST', {
                    data: {
                        orderId: orderId
                    }
                });

                setIsLoading(false);
                if (!response) {
                    console.warn("No response from Mercado Pago");
                    return null;
                }
                
                console.log("Mercado Pago checkout URL received");
                return response.checkoutURL;
            }

            createPreference()
                .then((url) => {
                    if (url) {
                        console.log("Opening Mercado Pago browser");
                        openAuthSessionAsync(url, "myapp://screens/checkout/")
                            .then((res) => {
                                console.log("Browser session result:", res.type);
                                if (res.type !== 'success') return;

                                if (res.url.includes("success")) {
                                    console.log("Payment successful, navigating to success screen");
                                    // Use replace instead of navigate to prevent going back
                                    router.replace("/screens/checkout/success");
                                } else if (res.url.includes("failure")) {
                                    console.log("Payment failed, navigating to failure screen");
                                    router.replace("/screens/checkout/failure");
                                }
                            })
                            .catch((error) => {
                                console.error("Error in auth session:", error);
                            });
                    }
                });
        }, [])
    );

    return ( <View />)
}

const styles = StyleSheet.create({
    webView: {
        
        height: '100%',
        width: '100%',
    }
});