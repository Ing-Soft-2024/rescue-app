import { useOrders } from "@/src/context/ordersContext";
import { orderConsumer } from "@/src/services/client";
import { router, useRouter } from "expo-router";
import { useEffect } from "react";
import { Text } from "react-native";
import uuid from 'react-native-uuid';

export default function SuccessScreen() {

    const { setOrderQR } = useOrders();
    const router = useRouter();

    const generateUUID = () => {
        return uuid.v4();
    }

    useEffect(() => {
        const fetchData = async () => {
            var response = await orderConsumer.consume('POST', {
                data:
                {
                    userId: 1,
                    businessId:1,
                    status: "pending",	
                }
            }).catch((error) => {
                console.log("el error es:" + error);
                return null;
            });
            const QR = "rescueapp://scannedOrder?id=" + response.orderId;
            setOrderQR(QR);
            console.log("sucess id:",QR);

            const timer = setTimeout(() => {
                router.push("../QRScreen");
            }, 5000); // 5 seconds timer

            return () => clearTimeout(timer); // Clear the timer if the component unmounts
        };

        fetchData();
    }, []);

    
    return (<Text>Success</Text>);
}

