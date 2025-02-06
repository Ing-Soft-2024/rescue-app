import { useOrders } from "@/src/context/ordersContext";
import { mercadoPagoConsumer, orderDetailsConsumer } from "@/src/services/client";
import { useRouter } from "expo-router";
import { openAuthSessionAsync } from "expo-web-browser";
import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator, BackHandler } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { commerceDetailsConsumer } from "@/src/services/client";

export default function QRScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const { orderQR, total, setOrderQR, clearCart } = useOrders();
    const [paymentBtns, setPaymentBtns] = useState<boolean>(false);
    const [accepted, setAccepted] = useState<boolean>(false);
    const intervalRef = React.useRef<NodeJS.Timeout>();
    const [response, setResponse] = useState<any>(null);
    const [businessData, setBusinessData] = useState<any>(null);

    React.useEffect(() => {
        if (!orderQR) {
            setBusinessData(null);
        }
    }, [orderQR]);

    useFocusEffect(
        React.useCallback(() => {
            const fetchBusinessDetails = async (businessId: number) => {
                try {
                    const businessResponse = await commerceDetailsConsumer.consume('GET', {
                        params: { id: businessId, type: 'business' }
                    });
                    setBusinessData(businessResponse);
                } catch (error) {
                    console.error("Error fetching business details:", error);
                }
            };

            const fetchOrderStatus = async () => {
                try {
                    const orderId = orderQR ? Number(orderQR.split('=')[1]) : null;
                    if (!orderId) {
                        setBusinessData(null);
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                        }
                        return;
                    }

                    const response = await orderDetailsConsumer.consume('GET', {
                        params: { id: orderId }
                    });
                    
                    if (response.businessId) {
                        fetchBusinessDetails(response.businessId);
                    }

                    if (response.status === "scanned") {
                        setPaymentBtns(true);
                        setAccepted(true);
                    } else if (response.status === "accepted") {
                        setPaymentBtns(false);
                        setAccepted(true);
                    } else {
                        setAccepted(false);
                        setPaymentBtns(false);
                    }
                } catch (error) {
                    console.error("Error fetching order status:", error);
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                }
            };

            fetchOrderStatus();

            intervalRef.current = setInterval(() => {
                fetchOrderStatus();
            }, 5000);

            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = undefined;
                }
                setBusinessData(null);
            };
        }, [orderQR])
    );

    useFocusEffect(
        useCallback(() => {
            const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
                // Prevent going back if payment buttons are shown
                if (paymentBtns && accepted) {
                    return true; // Prevents default back behavior
                }
                return false; // Allows default back behavior
            });

            return () => backHandler.remove();
        }, [paymentBtns, accepted])
    );

    React.useEffect(() => {
        if (paymentBtns && accepted) {
            navigation.setOptions({
                tabBarStyle: { display: 'none' }
            });
        } else {
            navigation.setOptions({
                tabBarStyle: { display: 'flex' }
            });
        }
    }, [paymentBtns, accepted]);

    async function handleCashPayment() {
        try {
            if (!orderQR) return;
            
            const orderId = Number(orderQR.split('=')[1]);
            await orderDetailsConsumer.consume('PATCH', {
                params: { id: orderId },
                data: {
                    status: "completed_cash"
                }
            });
            
            setPaymentBtns(false);
            router.push("./checkout/success");
        } catch (error) {
            console.error("Error processing cash payment:", error);
            Alert.alert('Error', 'Hubo un error al procesar el pago en efectivo');
        }
    }

    async function handleMercadoPagoPayment() {
        if (!orderQR) return;
        
        try {
            const orderId = Number(orderQR.split('=')[1]);
            const response = await mercadoPagoConsumer.consume('POST', {
                data: {
                    orderId: orderId
                }
            });

            if (!response || !response.checkoutURL) {
                Alert.alert('Error', 'No se pudo crear el pago con Mercado Pago');
                return;
            }

            const result = await openAuthSessionAsync(
                response.checkoutURL, 
                "myapp://screens/checkout/"
            );

            if (result.type === 'success') {
                if (result.url.includes("success")) {
                    router.navigate("/screens/checkout/success");
                    await orderDetailsConsumer.consume('PATCH', {
                        params: { id: orderId },
                        data: {
                            status: "completed_mercadopago"
                        }
                    });

                } else if (result.url.includes("failure")) {
                    router.navigate("/screens/checkout/failure");
                }
            }
        } catch (error) {
            console.error("Error processing Mercado Pago payment:", error);
            Alert.alert('Error', 'Hubo un error al procesar el pago');
        }
    }

    const handleCancelOrder = async () => {
        try {
            if (!orderQR) return;
            
            const orderId = Number(orderQR.split('=')[1]);
            await orderDetailsConsumer.consume('PATCH', {
                params: { id: orderId },
                data: {
                    status: "cancelled"
                }
            });
            
            clearCart();
            setOrderQR("");
            router.replace("/screens/");
        } catch (error) {
            console.error("Error canceling order:", error);
            Alert.alert('Error', 'No se pudo cancelar la orden');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                {businessData && (
                    <View style={styles.businessDetails}>
                        <Text style={styles.businessName}>{businessData.name}</Text>
                        <Text style={styles.businessAddress}>
                            {businessData.streetName} {businessData.streetNumber}
                        </Text>
                        <Text style={styles.businessCity}>
                            {businessData.city}, {businessData.country}
                        </Text>
                    </View>
                )}
                {(!paymentBtns && !accepted && orderQR) && (
                    <>
                        <ActivityIndicator size="large" color="#D4685E" />
                        <Text style={styles.instructions}>
                            Esperando que el comercio acepte tu pedido...
                        </Text>
                    </>
                )}
                {(!paymentBtns && accepted && orderQR) && (
                    <>
                        <View style={styles.qrContainer}>
                            <QRCode
                                value={orderQR}
                                size={200}
                            />
                        </View>
                        <Text style={styles.instructions}>
                            Muestra este QR al comercio para retirar tu pedido
                        </Text>
                    </>
                )}
                {(paymentBtns && accepted && orderQR) && (
                    <>
                        <Text style={styles.paymentTitle}>
                            Selecciona tu método de pago
                        </Text>
                        <View style={styles.paymentContainer}>
                            <TouchableOpacity 
                                style={styles.paymentButton} 
                                onPress={handleCashPayment}
                            >
                                <Text style={styles.paymentButtonText}>
                                    Pagar en efectivo
                                </Text>
                            </TouchableOpacity>
                            {businessData?.hasMercadoPago && (
                                <TouchableOpacity 
                                    style={styles.paymentButton}
                                    onPress={handleMercadoPagoPayment}
                                >
                                    <Text style={styles.paymentButtonText}>
                                        Pagar con MercadoPago
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </>
                )}
                {(!paymentBtns && (accepted || !accepted) && orderQR) && (
                    <TouchableOpacity 
                        style={styles.cancelButton}
                        onPress={handleCancelOrder}
                    >
                        <Text style={styles.cancelButtonText}>
                            Cancelar Orden
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 30,
        width: '90%',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    qrContainer: {
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    instructions: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10,
        lineHeight: 24,
    },
    paymentContainer: {
        width: '100%',
        alignItems: 'center',
    },
    paymentTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#D4685E',
        marginBottom: 20,
        textAlign: 'center',
    },
    paymentButton: {
        backgroundColor: '#D4685E',
        padding: 15,
        borderRadius: 10,
        marginVertical: 5,
        width: '100%',
    },
    paymentButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600',
    },
    businessDetails: {
        width: '100%',
        marginBottom: 20,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    businessName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    businessAddress: {
        fontSize: 16,
        color: '#666',
        marginBottom: 2,
    },
    businessCity: {
        fontSize: 16,
        color: '#666',
    },
    cancelButton: {
        backgroundColor: '#ff4444',
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
        width: '100%',
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600',
    },
});