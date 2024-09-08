import { Stack } from "expo-router";

export default function AppLayout() {

    return (
        <Stack screenOptions={{ headerTitle: "Login", headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="companyScreen" />
            <Stack.Screen name="productScreen" />
        </Stack>
    );
}