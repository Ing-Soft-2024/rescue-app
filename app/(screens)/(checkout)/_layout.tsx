import { Stack } from "expo-router";

export default function CheckoutLayout() {
    return (
        <Stack
            screenOptions={{
                presentation: 'modal',
            }}
        >
            {/* Make default screen to be the (screens)/ screen */}
            {/* This is to avoid the need to specify the default screen in the Stack.Screen options */}
            <Stack.Screen
                name="mercadoPago"
                options={{
                    title: 'Mercado Pago',
                }}
            />
            <Stack.Screen name="success" />
            <Stack.Screen name="failure" />
        </Stack>
    );
}