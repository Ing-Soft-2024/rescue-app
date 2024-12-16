import { ProductItem } from "@/src/components/product/ProductItem";
import { useOrders } from '@/src/context/ordersContext';
import { useSession } from "@/src/context/session.context";
import { orderConsumer } from "@/src/services/client";

import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, Alert } from "react-native";
import uuid from 'react-native-uuid';



export default function ShoppingCartScreen() {

    const { session } = useSession();
    
        
   

    const [checkoutURL, setcheckoutURL] = useState<string | null>(null);

    if (!process.env['EXPO_PUBLIC_MERCADOPAGO_PUBLIC_KEY']) {
        console.log('EXPO_PUBLIC_MERCADOPAGO_PUBLIC_KEY is not set', process.env['EXPO_PUBLIC_MERCADOPAGO_PUBLIC_KEY']);
        throw new Error('MERCADOPAGO_PUBLIC_KEY is not set');
    }
    const generateUUID = () => {
        return uuid.v4();
    }

    // initMercadoPago('TEST-3000e8dc-02f3-4588-a548-279fa11c7ee3', {locale: 'es-AR',});
    const router = useRouter();

    const { addToCart, cart, removeFromCart, total, setOrderQR, orderQR } = useOrders();


    async function payWithMercadoPago() {
        if(orderQR != ""){
            router.push("./QRScreen");
            return;
        }
        
        if (!session?.user.id) {
            Alert.alert('Error', 'Usuario no identificado');
            return;
        }

        try {
            // Format the order data according to the model
            const orderData = {
                userId: session.user.id,
                businessId: cart[0]?.product.businessId || 1, // Get businessId from first product
                status: "pending",
                cart
            };

            console.log("Sending order data:", orderData);

            const response = await orderConsumer.consume('POST', {
                data: orderData
            });

            if (!response) {
                Alert.alert('Error', 'No se pudo crear la orden');
                return;
            }

            console.log("Response from server:", response);

            const orderId = response.orderId;
            if (!orderId) {
                Alert.alert('Error', 'No se pudo obtener el ID de la orden');
                return;
            }

            const QR = "rescueappbussiness://scan/scannedOrder?id=" + orderId; 
            setOrderQR(QR);
            router.push("./QRScreen");
            
        } catch (error) {
            console.error("Error creating order:", {
                error,
                requestData: {
                    userId: session.user.id,
                    businessId: cart[0]?.product.businessId || 1,
                    status: "pending",
                    cart
                }
            });
            Alert.alert('Error', 'Hubo un error al crear la orden');
        }
    }

    return (
        <View style={styles.container}>
            {/* <ScrollView style={{ flex: 1, minHeight: "auto" }}> */}
                <View>
                    {/* <Text style={{ fontSize: 40, fontWeight: 'bold', paddingTop: 20, color: "#D4685E" }} >Shopping Cart</Text> */}
                    {cart.length === 0 &&
                        <Text style={{ fontSize: 20, paddingTop: 30, paddingBottom: 30, color: "#D4685E" }}>
                            Your shopping cart is empty :(
                        </Text>}
                    {/* <View style={styles.Botones}>

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
                        <Button title="Remove item" onPress={() => removeFromCart(0)}></Button>
                    </View> */}

                    {/* <Button title="Update cart" onPress={() => updateCart}></Button> */}
                </View>
                <FlatList
                    data={cart}
                    // horizontal={true}
                    contentContainerStyle={styles.listContainer}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    renderItem={({ item, index }) => (
                        <ProductItem product={item.product} onRemove={() => {
                            if(!orderQR){
                                removeFromCart(index)
                            }
                        }} />
                    )}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, index) => index.toString()}
                />

            {/* </ScrollView> */}

            {cart.length >= 1 &&
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#fff",
                        padding: 10,
                    }}
                >
                    <Text
                        style={{
                            padding: 10,
                            fontSize: 16,
                            fontWeight: "semibold",
                        }}
                    >
                        Total: {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(total)}
                    </Text>
                    {!orderQR && <Pressable
                        onPress={payWithMercadoPago}
                        style={styles.mercadoPago}
                    >
                        <Text style={{ fontSize: 16, color: "white", fontWeight: "semibold" }}>
                            Confirmar pedido
                        </Text>
                    </Pressable>}
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 5,
    },
    listContainer: {
        padding: 5,
        gap: 10,
    },
    Botones: {
        flexDirection: "row",
        justifyContent: "center",
    },

    mercadoPago: {
        flex: 1,
        backgroundColor: "#D4685E",
        borderRadius: 10,
        padding: 10,
        alignItems: "center",

    },
    title: {
        fontSize: 20,
        paddingVertical: 5,
    },
    separator: {
        width: 10, // Adjust the width of the separator if needed
    },

});



