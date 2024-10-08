
import { useOrders } from "@/src/context/ordersContext";
import { mercadoPagoConsumer } from "@/src/services/client";
import { initMercadoPago } from "@mercadopago/sdk-react";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import WebView, { WebViewNavigation } from "react-native-webview";

export default function MercadoPagoScreen() {
    if (!process.env['EXPO_PUBLIC_MERCADOPAGO_PUBLIC_KEY'])
        throw new Error('MERCADOPAGO_PUBLIC_KEY is not set');
    initMercadoPago(process.env['EXPO_PUBLIC_MERCADOPAGO_PUBLIC_KEY'], { locale: 'es-AR', });

    const [isLoading, setIsLoading] = React.useState(true);
    const [checkoutURL, setCheckoutURL] = React.useState<string | null>(null);

    const router = useRouter();


    const {
        cart,
        clearCart,
        addToCart,
        removeFromCart,
        updateCart,
        total,
        confirmOrder,
        getOrder,
    } = useOrders();

    React.useEffect(() => {
        const createPreference = async () => {
            var response = await mercadoPagoConsumer.consume('POST', {
                data:
                {
                    orderId: 5,
                    quantity: 1,
                    productId: 1,
                    price: 10,
                }
            }).catch((error) => {
                console.log(error);
                return null;
            });
            console.log("API Response:", response);
            console.log("return " + response.checkoutURL);
            return response.checkoutURL;
        }

        createPreference().then(setCheckoutURL).then(() => setIsLoading(false));

    }, []);

    const handleWebViewNavigation = (event: WebViewNavigation) => {
        // Cambio de url empieza con rescue://
        // Si empieza con rescue:// me fjo si trae algún parámetro
        // Si es success = true, se redirige al success
        // Si es success = false, se redirige al failure
        // Si es pending = true, se pone un spinner
        const url = event.url;
        if (!url || !url.startsWith("rescue://")) return;

        const parsedUrl = new URL(url);
        const params = new URLSearchParams(parsedUrl.searchParams);

        const [success, pending] = [
            params.get("success") == "true",
            params.get("pending") == "true"
        ]

        if (success) {
            console.log("Redirecting to success");

            // confirmOrder(...);
            // router.push("/(screens)/(checkout)/success");
            return;
        }
        else if (pending) {
            console.log("Pending");
            return;
        }

        // Ocurre un error.
    }

    return (
        <WebView
            source={{ uri: 'https://www.mercadopago.com.ar' }}
            onNavigationStateChange={handleWebViewNavigation}

            style={styles.webView}
        />
    )
}

const styles = StyleSheet.create({
    webView: {

    }
});