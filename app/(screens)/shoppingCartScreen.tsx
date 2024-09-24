import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View, Text } from 'react-native';

export default function ShoppingCartScreen() {
    const router = useRouter();

    const screen = "Shopping Cart";

    const onPressBack = () => {
        router.back();
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <View>
                    <Text style={{ fontSize: 40 }} >Shopping Cart</Text>
                    <Text style={{ fontSize: 20 , paddingTop: 25 }}>
                        This is the shopping cart screen.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 20,
    },
});