import { useOrders } from '@/src/context/ordersContext';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View, Text, Button, FlatList } from 'react-native';
import { ProductCard } from "@/src/components/product/ProductCard";


export default function ShoppingCartScreen() {
    const router = useRouter();

    const { addToCart, cart, removeFromCart, updateCart } = useOrders();

    const screen = "Shopping Cart";

    const onPressBack = () => {
        router.back();
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <View>
                    <Text style={{ fontSize: 40, fontWeight: 'bold', paddingTop: 20, color: "#D4685E" }} >Shopping Cart</Text>
                    <Text style={{ fontSize: 20, paddingTop: 30, paddingBottom: 30, color: "#D4685E" }}>
                        This is your shopping cart.
                    </Text>
                    <Button title="Add item" onPress={() => addToCart({
                        product: {
                            id: 1,
                            name: "Product 1",
                            description: "Description 1",
                            price: 10,
                            image: "https://via.placeholder.com/150"
                        },
                        quantity: 1,
                        subtotal: 10
                    })}>
                    </Button>
                    {/* <Button title="Remove item" onPress={() => removeFromCart}></Button> */}
                    {/* <Button title="Update cart" onPress={() => updateCart}></Button> */}
                </View>
                <FlatList
                    data={cart}
                    // horizontal={true}
                    contentContainerStyle={styles.listContainer}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    renderItem={({ item }) => (
                        <ProductCard product={item.product} />
                    )}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, index) => index.toString()}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // width: 300,
        // height: 200,
        // backgroundColor: "grey",
        // marginBottom: 10,
        padding: 10,
        borderRadius: 10,
        margin: 10,
    },
    listContainer: {
        alignItems: "center", // Center items horizontally within the FlatList
    },

    title: {
        fontSize: 20,
        paddingVertical: 5,
    },
    separator: {
        width: 10, // Adjust the width of the separator if needed
    },
});