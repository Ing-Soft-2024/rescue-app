
import { useOrders } from "@/src/context/ordersContext";
import { mercadoPagoConsumer } from "@/src/services/client";
import { initMercadoPago } from "@mercadopago/sdk-react";
import { useRouter } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import React from "react";
import { ActivityIndicator, Button, StyleSheet, View } from "react-native";
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
        if (!isLoading) return;
        const createPreference = async () => {
            // var response = null;
            var response = await mercadoPagoConsumer.consume('POST', {
                data:
                {
                    // orderId: 1,
                    // quantity: cart.length,
                    // productId: cart[0].product.id,
                    // price: cart[0].product.price,
                    orderId: 1,
                    productId: 1,
                    quantity: 1,
                    price: 1
                }
            }).catch((error) => {
                console.log("el error es:" + error);
                return null;
            });

            setIsLoading(false);

            //setCheckoutURL("https://www.mercadopago.com.ar");
            //if (!response) return "https://www.mercadopago.com.ar";
            if(!response) return null;

            console.log("la respuesta es:" + response.checkoutURL);
            return response.checkoutURL;
        }

        createPreference()
            .then(setCheckoutURL)

            //  .then((url) => {
                   
            //     if (url) {
            //         console.log("la url seteada es:" + url);
            //         setCheckoutURL(url); 
            //        // setIsLoading(false);
            //     }
            // }); 
    }, [isLoading]);

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

    //if (isLoading) return null;
    return (
        //webView version

        // <View>
        //     <ActivityIndicator />
        //     <WebView
        //         //source={{ uri: checkoutURL ?? 'blank' }}
        //         source={{ uri: checkoutURL ?? 'https://www.mercadopago.com.ar' }}
        //         onNavigationStateChange={handleWebViewNavigation}

        //          style={styles.webView}
        //         onLoad={() => {setIsLoading(false)}}
        //         onError={() => {setIsLoading(false)}}
        //     />
        // </View>


        //openWebAsync version
        <View>
            {checkoutURL &&<Button title="Open Browser" onPress={() =>{console.log(checkoutURL); openBrowserAsync(checkoutURL)}}></Button>}
       
        </View>
    )
}

const styles = StyleSheet.create({
    webView: {
        
        height: '100%',
        width: '100%',
    }
});