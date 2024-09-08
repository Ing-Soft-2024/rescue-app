import { AntDesign } from "@expo/vector-icons"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { Pressable, Text } from "react-native"

export const GoogleComponent = () => {

    const googleSignIn = async () => {
        try {
            const userInfo = await GoogleSignin.signIn();
            console.log(userInfo);

        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Pressable
            style={({ pressed }) => ({
                display: 'flex',
                padding: 10,
                backgroundColor: pressed ? 'rgba(0, 0, 0, 0.1)' : 'white',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 5,
                borderRadius: 5,
            })}

            onPress={() => googleSignIn()}
        >
            <AntDesign name="google" size={18} color="black" />
            <Text style={{ fontSize: 16 }}>Iniciar sesión con Google</Text>
        </Pressable>
    )
}