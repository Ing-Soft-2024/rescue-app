import { useSession } from "@/src/context/session.context";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Redirect, Stack, Tabs } from "expo-router";
import { Button, Pressable, View, Text } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { FontAwesome5 } from '@expo/vector-icons';
import { OrdersProvider } from "@/src/context/ordersContext";


export default function AppLayout() {
    const { session } = useSession();

    if (!session) return <Redirect href={"/login-screen"} />;

    return (
        // <Stack screenOptions={{ headerTitle: "", headerShown: true, headerBackVisible: false }}>
        //     <Stack.Screen name="index" />
        //     <Stack.Screen name="companyScreen" />
        //     <Stack.Screen name="productScreen" />
        //     <Stack.Screen name="googleMapScreen" options={{
        //         headerBackVisible: true,
        //         header: ({ navigation, back }) => {
        //             return (
        //                 <View style={{ padding: 10, position: "absolute", paddingTop: 27 }}>
        //                     {navigation.canGoBack() && <Pressable onPress={navigation.goBack} style={{
        //                         position: "absolute",
        //                         top: 20,
        //                         left: 10,
        //                         backgroundColor: "rgba(0, 0, 0, 0.5)",
        //                         padding: 8,
        //                         borderRadius: 20,
        //                     }}>
        //                         <Ionicons name="arrow-back" size={24} color="white">
        //                         </Ionicons>
        //                     </Pressable>}
        //                 </View>
        //             )
        //         },
        //     }} />
        // </Stack>
        <OrdersProvider>
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
                    name="productScreen"
                    options={{
                        title: 'Product',
                        tabBarIcon: ({ color }) => <FontAwesome5 size={28} name="barcode" color={color} />,
                        href: null
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
        </OrdersProvider>
    );
}