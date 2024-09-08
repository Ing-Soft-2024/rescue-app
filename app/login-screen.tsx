import { AppleIDButton } from '@/src/components/auth/appleid.button';
import { GoogleComponent } from '@/src/components/auth/google.button';
import { useSession } from '@/src/context/session.context';
import { Button, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";

export default function AuthLayout() {
    const { signInWith } = useSession();

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'center',
                // alignItems: 'center',
                gap: 10,
                padding: 10,
            }}
        >
            <View style={{
                height: 100,
                backgroundColor: 'red',
                width: 200,
                alignSelf: 'center',
            }} />

            <View style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
            }}>
                <TextInput
                    placeholder="Email"
                    style={{
                        backgroundColor: 'white',
                        padding: 10,
                        borderRadius: 5,
                        fontSize: 16,
                    }}
                />

                <TextInput
                    placeholder="Password"
                    style={{
                        backgroundColor: 'white',
                        padding: 10,
                        borderRadius: 5,
                        fontSize: 16,
                    }}
                    textContentType="password"
                />
                <Button
                    title="Login"
                    onPress={() => { }}
                />
            </View>

            <View style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 5,
            }}>
                <GoogleComponent />
                <AppleIDButton />
            </View>

            <Pressable
                style={({ pressed }) => ({
                    marginTop: 40,
                    padding: 10,
                    alignItems: 'center',
                    borderRadius: 5,
                    backgroundColor: pressed ? "#ddd" : "#fafafa",
                })}
                onPress={() => signInWith("Guest")}
            >
                <Text style={{
                    color: "#aaa",
                    fontSize: 16,
                }} >Iniciar sesión como invitado</Text>
            </Pressable>
        </KeyboardAvoidingView>
    )
}