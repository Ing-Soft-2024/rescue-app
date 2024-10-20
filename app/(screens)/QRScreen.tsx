import { useOrders } from "@/src/context/ordersContext";
import { orderConsumer, orderDetailsConsumer } from "@/src/services/client";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import uuid from 'react-native-uuid';

export default function QRScreen() {
    const router = useRouter();
  
    const { orderQR} = useOrders();
  
    const onPressBack = () => {
      router.back();
    };

    useEffect(() => {
        const fetchOrderStatus = async () => {
            try {
                const response = await orderDetailsConsumer.consume('GET', {
                    params: { id: Number(orderQR.split('=')[1])} // Extract order ID from orderQR
                });
                // if (response.status !== orderStatus) {
                //     fetchOrderStatus(response.status);
                // }
                if(response.status === "scanned"){
                    router.push("./(checkout)/mercadoPago");    //por ahora hacerlo desde swagger el updateState
                }
                
            } catch (error) {
                console.error("Error fetching order status:", error);
            }
            
        };

        const interval = setInterval(fetchOrderStatus, 5000); // Fetch order status every 5 seconds

        return () => clearInterval(interval); // Clear interval on component unmount
    },);

    // useEffect(() => {
    //     if (orderStatus !== "pending") {
    //         // Handle status change (e.g., navigate to a different screen)
    //         console.log("Order status changed:", orderStatus);
    //     }
    // }, [orderStatus]);

    
    console.log(orderQR);
    return (
        <View style={styles.QR}>
            {orderQR &&
            <QRCode
                value={orderQR}
                size={200}/>  }
            <Text style={styles.text}>Muestra este QR al comercio para retirar tu pedido. Por ahora updatear estado con swagger</Text>
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