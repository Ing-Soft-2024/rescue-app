import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { registerConsumer } from '@/src/services/client';

export default function RegisterScreen() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const onPressBack = () => {
        router.back();
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleRegister = async () => {
        if (!firstName || !lastName || !email || !password) {
            Alert.alert('Error', 'Por favor complete los campos obligatorios');
            return;
        }

        setIsLoading(true);
        try {
            const response = await registerConsumer.consume('POST', {
                data: {
                    firstName,
                    lastName,
                    email,
                    password,
                }
            });
            console.log('Registration successful:', response);
            Alert.alert('Éxito', 'Registro exitoso', [
                { text: 'OK', onPress: () => router.push('/login-screen') }
            ]);
        } catch (error) {
            console.error('Registration error:', error);
            Alert.alert('Error', 'No se pudo completar el registro');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Crear cuenta</Text>

                <TextInput
                    placeholder="Nombre"
                    value={firstName}
                    onChangeText={setFirstName}
                    style={styles.input}
                />

                <TextInput
                    placeholder="Apellido"
                    value={lastName}
                    onChangeText={setLastName}
                    style={styles.input}
                />

                <TextInput
                    placeholder="Correo electrónico"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <View style={styles.passwordContainer}>
                    <TextInput
                        placeholder="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        style={styles.passwordInput}
                    />
                    <Pressable onPress={togglePasswordVisibility} style={styles.toggleButton}>
                        <Text>{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
                    </Pressable>
                </View>


                <Pressable 
                    style={[styles.registerButton, isLoading && styles.registerButtonDisabled]} 
                    onPress={handleRegister}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text style={styles.registerButtonText}>Registrarse</Text>
                    )}
                </Pressable>

                <Pressable onPress={onPressBack}>
                    <Text style={styles.loginLink}>Ya tengo una cuenta</Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fafafa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#D4685E',
    },
    input: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 5,
        fontSize: 16,
        marginBottom: 15,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
        marginBottom: 15,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
    },
    passwordInput: {
        flex: 1,
        padding: 15,
        fontSize: 16,
    },
    toggleButton: {
        padding: 15,
    },
    registerButton: {
        backgroundColor: '#D4685E',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    registerButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginLink: {
        textAlign: 'center',
        marginTop: 20,
        color: '#8D6E63',
        fontSize: 16,
    },
    registerButtonDisabled: {
        opacity: 0.7,
    },
});