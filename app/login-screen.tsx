import { AppleIDButton } from '@/src/components/auth/appleid.button';
import { GoogleComponent } from '@/src/components/auth/google.button';
import { useSession } from '@/src/context/session.context';
import { useRouter } from 'expo-router';
import { Button, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View, Image, StyleSheet } from "react-native";
import logo from '../assets/images/reskue-logo.png';
// import { useFonts } from 'expo-font';
// import AppLoading from 'expo-app-loading';
import { useFonts, Bungee_400Regular } from '@expo-google-fonts/bungee';


export default function AuthLayout() {
    const { signInWith } = useSession();
    const router = useRouter();

    const navigateToIndex = () => {
        //router.push('./(screens)/index.tsx');  // lleva al usuario a la pantalla de home (index)
        router.push('./(screens)/homeScreen');  // lleva al usuario a la pantalla de home (index)
    };

    const [fontsLoaded] = useFonts({
        Bungee: Bungee_400Regular,
    });

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'center',
                // alignItems: 'center',
                gap: 10,
                backgroundColor: '#fafafa',
                padding: 10,
            }}
        >
            {/* <Image
                source={require('../assets/images/reskue-logo.png')}
                style={{
                    height: 120,
                    width: 220,
                    alignSelf: 'center',
                    marginTop: 40,
                    resizeMode: 'contain' // Para mantener la relación de aspecto
                }}
            />

            <Text style={{
                fontFamily: 'Bungee', // tira error con Tilt Neon
                fontSize: 38,
                alignSelf: 'center',
                color: '#D4685E',
                marginTop: 10,
                marginBottom: 20,
            }}>
                reskue
            </Text> */}

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
                <TextInput
                    placeholder="Email"
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
                />

                <View style={styles.containerButton}>
                    <Pressable style={styles.button} onPress={() => { }}>
                        <Text style={styles.buttonText}>Iniciar sesión</Text>
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
                <GoogleComponent />
                <AppleIDButton />
            </View>

            <Pressable
                style={({ pressed }) => ({
                    marginTop: 30,
                    padding: 10,
                    alignItems: 'center',
                    borderRadius: 5,
                    backgroundColor: pressed ? "#ddd" : "#fafafa",
                })}
               // onPress={() => signInWith("Guest")}
               onPress={navigateToIndex}
            >
                <Text style={{
                    color: "#D4685E",
                    fontSize: 16,
                    paddingTop: 10,
                    paddingBottom: 10
                }} >Iniciar sesión como invitado</Text>
            </Pressable>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fafafa',
        padding: 10,
        marginTop: 20,
    },
    logoContainer: {
        height: 100,
        width: 200,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: 40,
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
});