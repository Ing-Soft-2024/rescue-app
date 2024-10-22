
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
                // var response = null;

                console.log("la url es:" + orderQR);
                const id = Number(orderQR.split('=')[1]);
                var getOrderResponse = await orderDetailsConsumer.consume('GET', {
                    params: { id: id }
                }).catch((error) => {
                    console.log("el error es:" + error);
                    return null;
                });
                
                var response = await mercadoPagoConsumer.consume('POST', {
                    data:
                    {
                        orderId: id,
                        productId: 1,
                        quantity: 1,
                        price: getOrderResponse.total,
                    }
                }).catch((error) => {
                    console.log("el error es:" + error);
                    return null;
                });
                setIsLoading(false);

                if(!response) return null;

                console.log("la respuesta es:" + response.checkoutURL);
                return response.checkoutURL;
            }

            createPreference()
                .then((url) => {
                    setCheckoutURL(url);
                    if (url) {
                        openAuthSessionAsync(url, "myapp://screens/checkout/")
                            .then((res) => {
                                if(res.type !== 'success') return;

                                console.log("Redirecting to success");
                                if(res.url.includes("success")) router.navigate("/screens/checkout/success");
                                if(res.url.includes("failure")) router.navigate("/screens/checkout/failure");
                            })
                            .catch((error) => {
                                console.log("Error al abrir la sesión de autenticación", error);
                            });
                    }
                })
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