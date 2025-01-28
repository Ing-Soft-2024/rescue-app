import { orderConsumer } from "@/src/services/client";
import { useSession } from "@/src/context/session.context";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { useFocusEffect } from '@react-navigation/native';

export default function HistoryScreen() {
    const [orders, setOrders] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const { session } = useSession();
    const router = useRouter();

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            if (!session?.user?.id) {
                console.error("No user ID available");
                return;
            }

            console.log("Fetching orders for user:", session.user.id);
            const resp = await orderConsumer.consume('GET', { 
                queryParams: { 
                    userId: Number(session.user.id)
                } 
            });
            
            console.log("Orders response:", resp);
            setOrders(resp);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchOrders();
        }, [session?.user?.id])
    );

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'completed_cash':
            case 'completed_mercadopago':
                return '#4CAF50'; // Green for completed orders
            case 'pending':
                return '#FFC107'; // Yellow for pending
            case 'accepted':
                return '#2196F3'; // Blue for accepted
            case 'canceled':
                return '#F44336'; // Red for canceled
            default:
                return '#757575'; // Grey for other statuses
        }
    };

    const getStatusText = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'completed_cash':
                return 'Completado (Efectivo)';
            case 'completed_mercadopago':
                return 'Completado (MercadoPago)';
            case 'pending':
                return 'Pendiente';
            case 'accepted':
                return 'Aceptado';
            case 'canceled':
                return 'Cancelado';
            default:
                return status;
        }
    };

    const renderOrderItem = ({ item }: { item: any }) => (
        <View style={styles.orderItem}>
            <View style={styles.orderHeader}>
                <Text style={styles.date}>
                    Fecha: {new Date(item.createdAt).toLocaleDateString()}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>
                        {getStatusText(item.status)}
                    </Text>
                </View>
            </View>
            <Text style={styles.businessId}>
                Comercio: {item.business?.name || 'No disponible'}
            </Text>
            <Text style={styles.price}>
                Precio Total: ${Number(item.totalPrice).toFixed(2)}
            </Text>

            <View style={styles.orderItemsContainer}>
                {item.order_items?.map((orderItem: any, index: number) => (
                    <View key={index} style={styles.orderItemDetail}>
                        <Text style={styles.productId}>
                            Producto: {orderItem.product?.name || 'No disponible'}
                        </Text>
                        <Text style={styles.quantity}>
                            Cantidad: {orderItem.quantity}
                        </Text>
                        <Text style={styles.price}>
                            Precio por unidad: ${Number(orderItem.price).toFixed(2)}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#D4685E" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {orders.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No tienes órdenes anteriores</Text>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    contentContainerStyle={styles.listContainer}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    renderItem={renderOrderItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
    listContainer: {
        padding: 15,
        gap: 10,
    },
    orderItem: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eee',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    date: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
        color: '#333',
    },
    businessId: {
        fontSize: 16,
        marginBottom: 5,
        color: '#666',
    },
    price: {
        fontSize: 16,
        color: '#D4685E',
        fontWeight: '500',
    },
    separator: {
        height: 10,
    },
    orderItemsContainer: {
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
    },
    orderItemDetail: {
        marginBottom: 8,
        paddingLeft: 10,
        borderLeftWidth: 2,
        borderLeftColor: '#D4685E',
    },
    productId: {
        fontSize: 14,
        color: '#333',
    },
    quantity: {
        fontSize: 14,
        color: '#666',
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
});
