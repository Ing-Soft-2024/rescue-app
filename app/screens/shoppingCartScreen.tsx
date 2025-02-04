import { ProductItem } from "@/src/components/product/ProductItem";
import { useOrders } from '@/src/context/ordersContext';
import { useSession } from "@/src/context/session.context";
import { orderConsumer, commerceConsumer } from "@/src/services/client";

import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, Alert, ActivityIndicator } from "react-native";
import uuid from 'react-native-uuid';



export default function ShoppingCartScreen() {

    const { session } = useSession();




    const [checkoutURL, setcheckoutURL] = useState<string | null>(null);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [businessData, setBusinessData] = useState<any>(null);

    if (!process.env['EXPO_PUBLIC_MERCADOPAGO_PUBLIC_KEY']) {
        console.log('EXPO_PUBLIC_MERCADOPAGO_PUBLIC_KEY is not set', process.env['EXPO_PUBLIC_MERCADOPAGO_PUBLIC_KEY']);
        throw new Error('MERCADOPAGO_PUBLIC_KEY is not set');
    }
    const generateUUID = () => {
        return uuid.v4();
    }

    // initMercadoPago('TEST-3000e8dc-02f3-4588-a548-279fa11c7ee3', {locale: 'es-AR',});
    const router = useRouter();

    const { cart, removeFromCart, total, setOrderQR, orderQR, updateCartItem } = useOrders();

    console.log("Cart product business data:", cart[0]?.product?.business);
    console.log("Cart product businessId:", cart[0]?.product?.businessId);

    useEffect(() => {
        const fetchBusinessData = async () => {
            if (cart[0]?.product?.businessId) {
                try {
                    console.log("Fetching business data for ID:", cart[0].product.businessId);
                    const response = await commerceConsumer.consume('GET', {
                        params: { id: cart[0].product.businessId }
                    });
                    console.log("Business data response:", response);
                    // Find the specific business in the array
                    const business = response.find((b: any) => b.id === cart[0].product.businessId);
                    setBusinessData(business);
                } catch (error) {
                    console.error('Error fetching business data:', error);
                }
            } else {
                setBusinessData(null);
            }
        };

        fetchBusinessData();
    }, [cart]); // Changed dependency to include all cart changes

    async function payWithMercadoPago() {
        // Clear any existing orderQR first
        setOrderQR("");
        
        if (!session?.user.id) {
            Alert.alert('Error', 'Usuario no identificado');
            return;
        }

        setIsCreatingOrder(true);
        try {
            const orderData = {
                userId: session.user.id,
                businessId: cart[0]?.product.businessId || 1,
                status: "pending",
                cart
            };

            const response = await orderConsumer.consume('POST', {
                data: orderData
            });

            if (!response) {
                Alert.alert('Error', 'No se pudo crear la orden');
                return;
            }

            const orderId = response.orderId;
            if (!orderId) {
                Alert.alert('Error', 'No se pudo obtener el ID de la orden');
                return;
            }

            // Set the new QR code
            const QR = "rescueapp-bussiness://scan/scannedOrder?id=" + orderId;
            setOrderQR(QR);
            
            router.push("./QRScreen");

        } catch (error) {
            console.error("Error creating order:", error);
            Alert.alert('Error', 'Hubo un error al crear la orden');
        } finally {
            setIsCreatingOrder(false);
        }
    }

    const handleUpdateQuantity = (productId: number, newQuantity: number) => {
        if (newQuantity < 1) return; // Prevent negative quantities
        updateCartItem(productId, newQuantity);
    };

    return (
        <View style={styles.container}>
            {/* Business Details at the top */}
            {!orderQR && cart[0]?.product && businessData && (
                <View style={styles.businessInfoContainer}>
                    <Text style={styles.businessName}>{businessData.name}</Text>
                    <Text style={styles.businessAddress}>
                        {[
                            businessData.streetName && businessData.streetNumber 
                                ? `${businessData.streetName} ${businessData.streetNumber}`
                                : businessData.streetName,
                            businessData.city,
                            businessData.country
                        ].filter(Boolean).join(', ')}
                    </Text>
                    <View style={styles.businessDetailsRow}>
                        <Text style={styles.businessRating}>
                            {businessData.avgRating 
                                ? `★ ${businessData.avgRating.toFixed(1)}`
                                : 'Sin calificaciones'}
                        </Text>
                        {!businessData.hasMercadoPago && (
                            <Text style={styles.paymentInfoText}>
                                Solo efectivo
                            </Text>
                        )}
                    </View>
                </View>
            )}

            {/* Empty Cart Message */}
            {cart.length === 0 &&
                <Text style={{ fontSize: 23, paddingTop: 75, paddingBottom: 30, paddingLeft: 50, color: "#D4685E" }}>
                    Tu carrito está vacío
                </Text>
            }

            {/* Product List */}
            <FlatList
                data={cart}
                contentContainerStyle={styles.listContainer}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderItem={({ item, index }) => (
                    <ProductItem 
                        product={item.product} 
                        initialQuantity={item.quantity}
                        onRemove={() => {
                            if (!orderQR) {
                                removeFromCart(item.product.id)
                            }
                        }}
                        onUpdateQuantity={(newQuantity) => handleUpdateQuantity(item.product.id, newQuantity)}
                    />
                )}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
            />

            {/* Bottom Total and Checkout Section */}
            {cart.length >= 1 &&
                <View style={styles.bottomContainer}>
                    <Text style={styles.totalText}>
                        Total: {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(total)}
                    </Text>
                    {!orderQR && cart[0]?.product && (
                        <Pressable
                            onPress={payWithMercadoPago}
                            style={[
                                styles.mercadoPago,
                                isCreatingOrder && styles.mercadoPagoDisabled
                            ]}
                            disabled={isCreatingOrder}
                        >
                            {isCreatingOrder ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Text style={styles.buttonText}>
                                    Confirmar pedido
                                </Text>
                            )}
                        </Pressable>
                    )}
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listContainer: {
        padding: 5,
        gap: 8,
        paddingTop: 2,
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
    mercadoPagoDisabled: {
        backgroundColor: "#ccc",
    },
    paymentInfoContainer: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 5,
        marginRight: 10,
    },
    paymentInfoText: {
        color: '#666',
        fontSize: 28,
        fontStyle: 'italic',
        fontWeight: 'bold',
    },
    businessInfoContainer: {
        backgroundColor: '#f8f8f8',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginBottom: 0,
    },
    businessName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    businessAddress: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    businessDetailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    businessRating: {
        fontSize: 14,
        color: '#D4685E',
        fontWeight: '600',
    },
    bottomContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 10,
    },
    totalText: {
        padding: 10,
        fontSize: 16,
        fontWeight: "semibold",
    },
    buttonText: {
        fontSize: 16,
        color: "white",
        fontWeight: "semibold",
    },
});



