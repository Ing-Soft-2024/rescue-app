import { useSession } from "@/src/context/session.context";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Redirect, Stack } from "expo-router";
import { Button, Pressable, View } from "react-native";

export default function AppLayout() {
    const { session } = useSession();

    if (!session) return <Redirect href={"/login-screen"} />;

    return (
        <Stack screenOptions={{ headerTitle: "", headerShown: true, headerBackVisible: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="companyScreen" />
            <Stack.Screen name="productScreen" />
            <Stack.Screen name="googleMapScreen" options={{
                headerBackVisible: true,
                header: ({ navigation, back }) => {
                    return (
                        <View style={{ padding: 10, position: "absolute", paddingTop: 27 }}>
                            {navigation.canGoBack() && <Pressable onPress={navigation.goBack} style={{
                                position: "absolute",
                                top: 20,
                                left: 10,
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                padding: 8,
                                borderRadius: 20,
                            }}>
                                <Ionicons name="arrow-back" size={24} color="white">
                                </Ionicons>
                            </Pressable>}
                        </View>
                    )
                },
            }} />
        </Stack>
    );
}