import { orderConsumer } from "@/src/services/client";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import { useFocusEffect } from '@react-navigation/native';

export default function HistoryScreen() {
    const [orders, setOrders] = React.useState<any[]>([]);
    const router = useRouter();

    const fetchOrders = async () => {
        try {
            const resp = await orderConsumer.consume('GET', { queryParams: { userId: '1' } });
            console.log("ORDENES ", resp);
            setOrders(resp);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchOrders();
        }, [])
    );

    const renderOrderItem = ({ item }: { item: any }) => (
        <View style={styles.orderItem}>
            <Text style={styles.date}>Fecha: {new Date(item.createdAt).toLocaleDateString()}</Text>
            <Text style={styles.businessId}>Comercio: {item.business.name}</Text>
            <Text style={styles.price}>Precio Total: ${item.totalPrice.toFixed(2)}</Text>

            <View style={styles.orderItemsContainer}>
                {item.order_items.slice(0, 3).map((orderItem: any, index: number) => (
                    <View key={index} style={styles.orderItemDetail}>
                        <Text style={styles.productId}>Producto: {orderItem.product.name}</Text>
                        <Text style={styles.quantity}>Cantidad: {orderItem.quantity}</Text>
                        <Text style={styles.price}>Precio por unidad: ${orderItem.price.toFixed(2)}</Text>
                    </View>
                ))}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={orders}
                contentContainerStyle={styles.listContainer}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {
        padding: 5,
        gap: 10,
    },
    orderItem: {
        padding: 10,
        backgroundColor: "#f9f9f9",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    date: {
        fontSize: 18,
        marginBottom: 5,
    },
    businessId: {
        fontSize: 14,
        marginBottom: 5,
        color: "#333",
    },
    price: {
        fontSize: 14,
        color: "#333",
    },
    separator: {
        height: 10,
    },
    orderItemsContainer: {
        marginTop: 10,
    },
    orderItemDetail: {
        marginBottom: 5,
    },
    productId: {
        fontSize: 12,
    },
    quantity: {
        fontSize: 12,
    },
});
