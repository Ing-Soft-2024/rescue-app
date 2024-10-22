import { useOrders } from "@/src/context/ordersContext";
import { orderConsumer, orderDetailsConsumer } from "@/src/services/client";
import { useRouter } from "expo-router";
import React from "react";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import QRCode from "react-native-qrcode-svg";
import uuid from 'react-native-uuid';

export default function QRScreen() {
    const router = useRouter();
    const { orderQR } = useOrders();
    const [paymentBtns, setPaymentBtns] = useState<boolean>(false);
    const intervalref = React.useRef<NodeJS.Timeout>();

    const onPressBack = () => {
        router.back();
    };
    useEffect(() => {
        if(!paymentBtns) return;

        clearInterval(intervalref.current);
       
    }, [paymentBtns]);

    useEffect(() => {
        const fetchOrderStatus = async () => {
            if(!orderQR) 
            {
                intervalref.current && clearInterval(intervalref.current);
                setPaymentBtns(false);
                return;
            }
            try {
                const response = await orderDetailsConsumer.consume('GET', {
                    params: { id: Number(orderQR.split('=')[1]) } // Extract order ID from orderQR
                });
                if (response.status === "scanned") {
                    setPaymentBtns(true); // Enable payment buttons when order is scanned
                }
            } catch (error) {
                console.error("Error fetching order status:", error);
            }
        };

        intervalref.current = setInterval(fetchOrderStatus, 5000); // Fetch order status every 5 seconds

        return () => clearInterval(intervalref.current); // Clear interval on component unmount
    }, [orderQR]);

    async function handleCashPayment() {
        setPaymentBtns(false);
        router.push("./checkout/success");
    }

    return (
        <View style={styles.QR}>
            {(orderQR && !paymentBtns) &&
                <QRCode
                    value={orderQR}
                    size={200} />}
            {!paymentBtns && <Text style={styles.text}>Muestra este QR al comercio para retirar tu pedido. Por ahora updatear estado con swagger</Text>}
            {paymentBtns && <Button title="Mercado Pago" onPress={() => router.push("./checkout/mercadoPago")} />}
            {paymentBtns && <Button title="Pagar en efectivo" onPress={handleCashPayment} />}
        </View>
    );
}

const styles = StyleSheet.create({
    QR: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 25,
        textAlign: 'center',
    },
});