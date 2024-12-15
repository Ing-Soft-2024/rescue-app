import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { } from '@/src/services/client'; // POST del user

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    const onPressBack = () => {
        router.back();
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleRegister = () => {
        // POST del user en la API

        console.log('Registering user:', { name, email, password });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crear cuenta</Text>

            <TextInput
                placeholder="Nombre"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />

            <TextInput
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
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

            <Pressable style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.registerButtonText}>Registrarse</Text>
            </Pressable>

            <Pressable onPress={onPressBack}>
                <Text style={{ textAlign: 'center', marginTop: 20 }}>Ya tengo una cuenta</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
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
        padding: 10,
        borderRadius: 5,
        fontSize: 16,
        marginBottom: 10,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
        marginBottom: 10,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
    },
    passwordInput: {
        flex: 1,
        padding: 10,
        fontSize: 16,
    },
    toggleButton: {
        padding: 10,
    },
    registerButton: {
        marginTop: 20,
        backgroundColor: '#D4685E',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    registerButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});