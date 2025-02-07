import { useOrders } from "@/src/context/ordersContext";
import { commerceConsumer, commerceDetailsConsumer, orderDetailsConsumer } from "@/src/services/client";
import { useFocusEffect, useRouter, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SuccessScreenMercadoPago() {
    const { setOrderQR, clearCart } = useOrders();
    const router = useRouter();
    const { businessId, orderId } = useLocalSearchParams<{ businessId: string, orderId: string }>();
    const [rating, setRating] = React.useState("");
    const [isSubmittingRating, setIsSubmittingRating] = useState(false);

    const logToStorage = async (message: string) => {
        try {
            const currentTime = new Date().toISOString();
            const logMessage = `${currentTime}: ${message}\n`;
            const existingLogs = await AsyncStorage.getItem('mp_success_logs') || '';
            await AsyncStorage.setItem('mp_success_logs', existingLogs + logMessage);
        } catch (error) {
            console.error('Error logging to storage:', error);
        }
    };

    const readLogs = async () => {
        try {
            const logs = await AsyncStorage.getItem('mp_success_logs');
            console.log('Stored logs:', logs);
            await AsyncStorage.setItem('mp_success_logs', '');
        } catch (error) {
            console.error('Error reading logs:', error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            const updateState = async () => {
                try {
                    await logToStorage('Screen mounted, executing updateState');
                    
                    if (!orderId || !businessId) {
                        await logToStorage('No orderId or businessId found in URL params');
                        router.replace("/screens/");
                        return;
                    }

                    await logToStorage(`Processing success for order: ${orderId}`);

                    const orderDetails = await orderDetailsConsumer.consume('GET', {
                        params: { id: Number(orderId) }
                    });

                    if (!orderDetails) {
                        await logToStorage('No order details found');
                        router.replace("/screens/");
                        return;
                    }

                    await logToStorage(`Current order status: ${orderDetails.status}`);

                    if (orderDetails.status !== "completed_mercadopago" && 
                        orderDetails.status !== "completed_cash" && 
                        orderDetails.status !== "cancelled") {
                        
                        await logToStorage(`About to update order status for order: ${orderId}`);
                        
                        const updateResponse = await orderDetailsConsumer.consume('PATCH', {
                            params: { id: Number(orderId) },
                            data: {
                                status: "completed_mercadopago"
                            }
                        });

                        await logToStorage(`Update response received: ${JSON.stringify(updateResponse)}`);
                        
                        if (updateResponse) {
                            await logToStorage(`Successfully updated order: ${orderId}`);
                            setOrderQR("");
                            clearCart();
                        } else {
                            await logToStorage(`Failed to update order: ${orderId}`);
                            router.replace("/screens/");
                        }
                    } else {
                        await logToStorage(`Order already in final state: ${orderDetails.status}`);
                        setOrderQR("");
                        clearCart();
                    }
                } catch (error) {
                    await logToStorage(`Error in success screen: ${error}`);
                    Alert.alert('Error', 'No se pudo actualizar el estado de la orden');
                    router.replace("/screens/");
                }
            };

            updateState();
            
            return () => {
                logToStorage('Screen unmounted');
            };
        }, [orderId, businessId])
    );

    useEffect(() => {
        readLogs();
    }, []);

    const validateRating = (value: string) => {
        const numValue = parseInt(value);
        return !isNaN(numValue) && numValue >= 1 && numValue <= 5;
    };

    const handleRatingChange = (text: string) => {
        // Only allow numbers 1-5
        if (text === "" || (parseInt(text) >= 1 && parseInt(text) <= 5)) {
            setRating(text);
        }
    };

    async function handleSubmission() {
        if (!businessId) {
            console.error("No business ID available");
            return;
        }

        if (!validateRating(rating)) {
            Alert.alert('Error', 'Por favor ingrese una calificación del 1 al 5');
            return;
        }

        setIsSubmittingRating(true);
        try {
            await commerceDetailsConsumer.consume('PATCH', {
                params: { id: businessId },
                data: {
                    rating: parseInt(rating)
                }
            });
            router.navigate("/screens/");
        } catch (error) {
            console.error("Error submitting rating:", error);
            Alert.alert('Error', 'No se pudo enviar la calificación');
        } finally {
            setIsSubmittingRating(false);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.successIcon}>
                    <AntDesign name="checkcircle" size={60} color="#4CAF50" />
                </View>

                <Text style={styles.title}>¡Orden Completada!</Text>
                <Text style={styles.subtitle}>
                    Tu pedido ha sido completado exitosamente
                </Text>

                <View style={styles.ratingContainer}>
                    <Text style={styles.ratingTitle}>
                        ¿Cómo calificarías tu experiencia?
                    </Text>
                    <TextInput 
                        keyboardType="numeric"
                        onChangeText={handleRatingChange}
                        value={rating}
                        placeholder="Califica del 1 al 5"
                        placeholderTextColor="#999"
                        style={styles.input}
                        maxLength={1}
                        editable={!isSubmittingRating}
                    />
                </View>

                <TouchableOpacity 
                    style={[
                        styles.submitButton,
                        isSubmittingRating && styles.submitButtonDisabled
                    ]}
                    onPress={handleSubmission}
                    disabled={isSubmittingRating}
                >
                    {isSubmittingRating ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text style={styles.submitButtonText}>Enviar Valoración</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.skipButton}
                    onPress={() => router.navigate("/screens/")}
                    disabled={isSubmittingRating}
                >
                    <Text style={styles.skipButtonText}>Saltear este paso</Text>
                </TouchableOpacity>
            </View>

            {__DEV__ && (
                <TouchableOpacity 
                    style={styles.debugButton}
                    onPress={readLogs}
                >
                    <Text style={styles.debugButtonText}>View Logs</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
        justifyContent: 'center',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 30,
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
    successIcon: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    ratingContainer: {
        width: '100%',
        marginBottom: 20,
    },
    ratingTitle: {
        fontSize: 18,
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
        marginVertical: 10,
        width: '100%',
    },
    submitButton: {
        backgroundColor: '#D4685E',
        borderRadius: 10,
        padding: 15,
        width: '100%',
        alignItems: 'center',
    },
    submitButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    skipButton: {
        backgroundColor: '#D4685E',
        borderRadius: 10,
        padding: 15,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    skipButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    submitButtonDisabled: {
        opacity: 0.7,
    },
    mercadoPagoDisabled: {
        opacity: 0.7,
    },
    debugButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#666',
        padding: 10,
        borderRadius: 5,
    },
    debugButtonText: {
        color: 'white',
    },
});

