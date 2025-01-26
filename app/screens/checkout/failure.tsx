import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function FailureScreen() {
    const router = useRouter();

    useEffect(() => {
        // Automatically redirect after 3 seconds
        const timeout = setTimeout(() => {
            router.replace("/screens/QRScreen");
        }, 3000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.errorText}>El pago no pudo ser procesado</Text>
            <Text style={styles.subText}>Serás redirigido para intentar nuevamente...</Text>
            <TouchableOpacity 
                style={styles.button}
                onPress={() => router.replace("/screens/QRScreen")}
            >
                <Text style={styles.buttonText}>Volver ahora</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#D4685E',
        marginBottom: 10,
        textAlign: 'center',
    },
    subText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#D4685E',
        padding: 15,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});