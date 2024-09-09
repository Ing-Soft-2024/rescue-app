import { useSession } from "@/src/context/session.context";
import { Redirect, Stack } from "expo-router";

export default function AppLayout() {
    const { session } = useSession();

    if (!session) return <Redirect href={"/login-screen"} />;

    return (
        <Stack screenOptions={{ headerTitle: "Login", headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="companyScreen" />
            <Stack.Screen name="productScreen" />
        </Stack>
    );
}