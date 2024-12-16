import { useOrders } from "@/src/context/ordersContext";
import { orderDetailsConsumer } from "@/src/services/client";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function QRScreen() {
    const router = useRouter();
    const { orderQR, total } = useOrders();
    const [paymentBtns, setPaymentBtns] = useState<boolean>(false);
    const intervalref = React.useRef<NodeJS.Timeout>();

    useEffect(() => {
        if(!paymentBtns) return;
        clearInterval(intervalref.current);
    }, [paymentBtns]);

    useEffect(() => {
        const fetchOrderStatus = async () => {
            if(!orderQR) {
                intervalref.current && clearInterval(intervalref.current);
                setPaymentBtns(false);
                return;
            }
            try {
                const response = await orderDetailsConsumer.consume('GET', {
                    params: { id: Number(orderQR.split('=')[1]) }
                });
                if (response.status === "scanned") {
                    setPaymentBtns(true);
                }
            } catch (error) {
                console.error("Error fetching order status:", error);
            }
        };

        intervalref.current = setInterval(fetchOrderStatus, 5000);
        return () => clearInterval(intervalref.current);
    }, [orderQR]);

    async function handleCashPayment() {
        setPaymentBtns(false);
        router.push("./checkout/success");
    }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                {(orderQR && !paymentBtns) && (
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
                
                {paymentBtns && (
                    <View style={styles.paymentContainer}>
                        <Text style={styles.paymentTitle}>Selecciona tu método de pago</Text>
                        <Text style={styles.totalAmount}>Total a pagar: ${total.toFixed(2)}</Text>
                        <TouchableOpacity 
                            style={[styles.paymentButton, styles.mpButton]}
                            onPress={() => router.push("./checkout/mercadoPago")}
                        >
                            <Text style={styles.buttonText}>Mercado Pago</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.paymentButton, styles.cashButton]}
                            onPress={handleCashPayment}
                        >
                            <Text style={styles.buttonText}>Pagar en efectivo</Text>
                        </TouchableOpacity>
                    </View>
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
        width: '100%',
        padding: 15,
        borderRadius: 10,
        marginVertical: 8,
        alignItems: 'center',
    },
    mpButton: {
        backgroundColor: '#009EE3', // Mercado Pago blue
    },
    cashButton: {
        backgroundColor: '#4CAF50', // Green for cash
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});