import { Stack } from "expo-router";

export default function AuthLayout() {

    return (
        <Stack screenOptions={{ headerTitle: "Login", headerShown: false }}>
            <Stack.Screen name="index" />
        </Stack>
    )
}