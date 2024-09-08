import { Button, KeyboardAvoidingView, Platform, TextInput, View, FlatList } from "react-native";
import { AppleSignInComponent } from "./(screens)/components/apple.component";
import { GoogleComponent } from "./(screens)/components/google.component";
import { useRouter } from 'expo-router';

export default function AuthLayout() {
    const router = useRouter();

    const navigateToIndex = () => {
        router.push('./(screens)/index.tsx');  // lleva al usuario a la pantalla de home (index)
    };

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
                    // onPress={navigateToIndex}
                />
            </View>

            <View style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 5,
            }}>
                <GoogleComponent />
                <AppleSignInComponent />
            </View>

        </KeyboardAvoidingView>
    )
}