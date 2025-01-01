import { AppleIDButton } from '@/src/components/auth/appleid.button';
import { GoogleComponent } from '@/src/components/auth/google.button';
import { useSession } from '@/src/context/session.context';
import { useRouter } from 'expo-router';
import { Button, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View, Image, StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native";
import logo from '../assets/images/reskue-logo.png';
// import { useFonts } from 'expo-font';
// import AppLoading from 'expo-app-loading';
import { useFonts, Bungee_400Regular } from '@expo-google-fonts/bungee';
import { useState } from 'react';
import { checkInternetConnection, NO_INTERNET_MESSAGE } from '@/src/utils/networkUtils';


export default function AuthLayout() {
    const { signInWith } = useSession();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');


    const navigateToIndex = () => {
        router.push('./screens/');  // lleva al usuario a la pantalla de home (index)
        //router.push("/index");  
    };

    const [fontsLoaded] = useFonts({
        Bungee: Bungee_400Regular,
    });

    const handleLogin = async (email: string, password: string) => {
        setIsLoading(true);
        setError('');

        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            setError(NO_INTERNET_MESSAGE);
            setIsLoading(false);
            return;
        }

        if (!email || !password) {
            setError('Por favor, complete todos los campos');
            setIsLoading(false);
            return;
        }

        try {
            const session = await signInWith("Credentials", { email, password });
            
            if (!session) {
                setError('Error al iniciar sesión. Por favor, intente nuevamente.');
                return;
            }

        } catch (error: any) {
            console.error("Login failed:", error);
            if (!await checkInternetConnection()) {
                setError(NO_INTERNET_MESSAGE);
            } else if (error.message?.includes('401')) {
                setError('Credenciales inválidas. Por favor, verifique su email y contraseña.');
            } else {
                setError('El mail o la contraseña son incorrectos.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const navigateToRegister = () => {
        router.push('./register');  // Navigate to the register screen
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'center',
                gap: 10,
                backgroundColor: '#fafafa',
                padding: 10,
            }}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>
                    <Image
                        source={require('../assets/images/reskue-logo.png')}
                        style={styles.logoContainer}
                    />

                    <Text style={styles.appName}>
                        reskue
                    </Text>
                </View>

                <View style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 5,
                    marginTop: 20,
                }}>
                     {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : null}
                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        style={{
                            backgroundColor: 'white',
                            padding: 10,
                            borderRadius: 5,
                            fontSize: 16,
                            shadowColor: 'black',
                            shadowOpacity: 0.1,
                            shadowOffset: { width: 0, height: 1 },
                        }}
                    />

                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        style={{
                            backgroundColor: 'white',
                            padding: 10,
                            borderRadius: 5,
                            fontSize: 16,
                            shadowColor: 'black',
                            shadowOpacity: 0.1,
                            shadowOffset: { width: 0, height: 1 },
                        }}
                        textContentType="password"
                        secureTextEntry={true}
                    />

                    <View style={styles.containerButton}>
                        <Pressable 
                            style={[styles.button, isLoading && styles.buttonDisabled]} 
                            onPress={() => { handleLogin(email, password) }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Text style={styles.buttonText}>Iniciar sesión</Text>
                            )}
                        </Pressable>
                    </View>
                </View>

                <View style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: 5,
                    marginTop: 40,
                }}>
                    {/* <GoogleComponent />
                    <AppleIDButton /> */}
                </View>

                {/* <Pressable
                    style={({ pressed }) => ({
                        marginTop: 30,
                        padding: 10,
                        alignItems: 'center',
                        borderRadius: 5,
                        backgroundColor: pressed ? "#ddd" : "#fafafa",
                    })}
                    onPress={navigateToIndex}
                >
                    <Text style={{
                        color: "#D4685E",
                        fontSize: 16,
                        paddingTop: 1,
                        paddingBottom: 10
                    }}>
                        Iniciar sesión como invitado
                    </Text>
                </Pressable> */}

                <Pressable
                    style={({ pressed }) => ({
                        marginTop: 1,
                        padding: 10,
                        alignItems: 'center',
                        borderRadius: 5,
                        backgroundColor: pressed ? "#ddd" : "#fafafa",
                    })}
                    onPress={navigateToRegister}
                >
                    <Text style={{
                        color: "#8D6E63",
                        fontSize: 16,
                        paddingTop: 1,
                        paddingBottom: 10
                    }}>
                        Registrarse
                    </Text>
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
        flexDirection: 'column',
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fafafa',
        padding: 10,
        marginTop: 10,
    },
    logoContainer: {
        height: 100,
        width: 200,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: 30,
    },
    appName: {
        fontFamily: 'Bungee',
        fontSize: 32,
        color: '#D4685E',
        marginTop: 10,
    },
    containerButton: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    button: {
        borderWidth: 2,
        borderColor: '#D4685E',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        backgroundColor: '#D4685E',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    inputError: {
        borderWidth: 1,
        borderColor: '#D4685E',
    },
    errorText: {
        color: '#D4685E',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 10,
    },
});