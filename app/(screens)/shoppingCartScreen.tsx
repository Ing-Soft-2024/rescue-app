import { useOrders } from '@/src/context/ordersContext';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View, Text, Button, FlatList, Linking } from 'react-native';
import { ProductCard } from "@/src/components/product/ProductCard";
import {initMercadoPago, Wallet} from '@mercadopago/sdk-react';
import { useState } from 'react';
import { mercadoPagoConsumer } from '@/src/services/client';
import MercadoPagoWebBrowser from '@/src/components/checkout/MercadoPagoWebBrowser';
import { openBrowserAsync } from 'expo-web-browser';
import { parse } from '@babel/core';



export default function ShoppingCartScreen() {

    const [checkoutURL, setcheckoutURL] = useState<string | null>(null);

    if(!process.env['EXPO_PUBLIC_MERCADOPAGO_PUBLIC_KEY']){
        console.log('EXPO_PUBLIC_MERCADOPAGO_PUBLIC_KEY is not set', process.env['EXPO_PUBLIC_MERCADOPAGO_PUBLIC_KEY']);
        throw new Error('MERCADOPAGO_PUBLIC_KEY is not set');
    }

    initMercadoPago(process.env['EXPO_PUBLIC_MERCADOPAGO_PUBLIC_KEY'], {locale: 'es-AR',});
   // initMercadoPago('TEST-3000e8dc-02f3-4588-a548-279fa11c7ee3', {locale: 'es-AR',});
    const router = useRouter();

    const { addToCart, cart, removeFromCart, updateCart } = useOrders();

    const screen = "Shopping Cart";

    const onPressBack = () => {
        router.back();
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <View>
                    <Text style={{ fontSize: 40, paddingTop: 20 }} >Shopping Cart</Text>
                    <Text style={{ fontSize: 20, paddingTop: 30, paddingBottom: 30 }}>
                        This is your shopping cart.
                    </Text>
                    <Button title="Add item" onPress={() => addToCart({ 
                        product: { 
                            id: 1, 
                            name: "Product 1", 
                            description: "Description 1", 
                            price: 10, 
                            image: "https://via.placeholder.com/150" 
                        }, 
                        quantity: 1,
                        subtotal: 10
                    })}>
                    </Button>
                    {/* <Button title="Remove item" onPress={() => removeFromCart}></Button> */}
                    {/* <Button title="Update cart" onPress={() => updateCart}></Button> */}
                </View>
                <FlatList
                    data={cart}
                    // horizontal={true}
                    contentContainerStyle={styles.listContainer}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    renderItem={({ item }) => (
                        <ProductCard product={item.product} />
                    )}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, index) => index.toString()}
                />
            </ScrollView>
            <Button title='continuar' onPress={Payment}></Button>
            {/* {checkoutURL && <MercadoPagoWebBrowser url={checkoutURL} />} */}
            {/* <Button title='Deep link' onPress={() => Linking.openURL("https://docs.expo.io")}></Button> */}
            {checkoutURL && <Button title="Pagar" onPress={() => openBrowserAsync(checkoutURL)}></Button>} 
            
        </View>
    );

   

    async function Payment() {
        const checkoutURL = await createPreference();
        if(Boolean(checkoutURL)){
            console.log("setting preference id");
              setcheckoutURL(checkoutURL);
        }
        else{
            console.log("URL is null");
        }
    };

}



async function createPreference() {
    //const consumer = mercadoPagoConsumer;
    //const response = await consumer.createPreference({
    var response = await mercadoPagoConsumer.consume('POST',{
        data:
        {  
            orderId: 2,
            quantity: 1,
            productId: 1,
            price: 10,
        }
    }).catch((error) => {
        console.log(error);
        return null;
    });
    console.log("API Response:", response);
    console.log("return "+ response.checkoutURL);
    return response.checkoutURL;
}



const styles = StyleSheet.create({
    container: {
      // width: 300,
      // height: 200,
      // backgroundColor: "grey",
      // marginBottom: 10,
      padding: 10,
      borderRadius: 10,
      margin: 10,
    },
    listContainer: {
      alignItems: "center", // Center items horizontally within the FlatList
    },
  
    title: {
      fontSize: 20,
      paddingVertical: 5,
    },
    separator: {
      width: 10, // Adjust the width of the separator if needed
    },
  });


