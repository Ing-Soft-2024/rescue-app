import { useOrders } from "@/src/context/ordersContext";
import { commerceConsumer, commerceDetailsConsumer, orderDetailsConsumer } from "@/src/services/client";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { AntDesign } from '@expo/vector-icons';

export default function SuccessScreen() {
    const { setOrderQR, orderQR, clearCart } = useOrders();
    const router = useRouter();
    const [rating, setRating] = React.useState("");
    const [businessId, setBusinessId] = React.useState<number | null>(null);
    const [isSubmittingRating, setIsSubmittingRating] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            const updateState = async () => {
                try {
                    const orderId = Number(orderQR.split('=')[1]);
                    const orderDetails = await orderDetailsConsumer.consume('GET', {
                        params: { id: orderId }
                    });
                    setBusinessId(orderDetails.businessId);

                    let response = await orderDetailsConsumer.consume('PATCH', {
                        params: { id: orderId },
                        data: {
                            status: "completed"
                        }
                    });

                    console.log("update state to complete: ", response.status);
                    setOrderQR("");
                    clearCart();
                } catch (error) {
                    console.error("Error updating order:", error);
                }
            };
            updateState();
        }, [])
    );

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
    }
});

