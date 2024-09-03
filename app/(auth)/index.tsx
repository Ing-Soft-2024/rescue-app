import { Button, KeyboardAvoidingView, Platform, TextInput, View } from "react-native";
import { AppleSignInComponent } from "./components/apple.component";
import { GoogleComponent } from "./components/google.component";
export default function AuthLayout() {
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
                <AppleSignInComponent />
            </View>
        </KeyboardAvoidingView>
    )
}