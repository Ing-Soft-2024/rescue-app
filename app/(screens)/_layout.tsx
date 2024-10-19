import { useSession } from "@/src/context/session.context";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Redirect, Tabs } from "expo-router";
import { Pressable, Text, View } from "react-native";


export default function AppLayout() {
    const { session } = useSession();

   // if (!session) return <Redirect href={"/login-screen"} />;

    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: '#D4685E', tabBarInactiveTintColor: '#D4685E', tabBarStyle: { backgroundColor: 'white' }, }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                    tabBarLabel: ({ color }) => (
                        <Text style={{ color: '#D4685E' }}>Home</Text>
                    ),
                }}
            />


            <Tabs.Screen
                name="companyScreen"
                options={{
                    title: 'Company',
                    tabBarIcon: ({ color }) => <FontAwesome5 size={28} name="store" color={color} />,
                    href: null
                }}
            />
            <Tabs.Screen
                name="QRScreen"
                options={{
                    title: 'QRScreemn',
                    tabBarIcon: ({ color }) => <FontAwesome5 size={28} name="store" color={color} />,
                    href: null
                }}
            />
            <Tabs.Screen
                name="productScreen"
                options={{
                    title: 'Product',
                    tabBarIcon: ({ color }) => <FontAwesome5 size={28} name="barcode" color={color} />,
                    href: null
                }}
            />

            <Tabs.Screen
                name="(checkout)"
                options={{
                    href: null,
                    headerShown: false,
                }}
            />

            <Tabs.Screen
                name="googleMapScreen"
                options={{
                    title: 'Map',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="map" color={color} />,
                    tabBarStyle: { display: 'none' },
                    // headerBackVisible: true,
                    header: ({ navigation }) => {
                        return (
                            <View style={{ paddingTop: 40, padding: 10, position: "absolute" }}>
                                {navigation.canGoBack() && <Pressable onPress={navigation.goBack} style={{
                                    position: "absolute",
                                    top: 60,
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
                }}
            />
            <Tabs.Screen
                name="shoppingCartScreen"
                options={{
                    title: 'Cart',
                    tabBarIcon: ({ color }) => <FontAwesome5 size={28} name="shopping-cart" color={color} />,
                }}
            />
        </Tabs>
    );
}