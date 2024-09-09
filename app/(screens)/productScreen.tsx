import { View, Text, Button, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

export default function productScreen() {
    const router = useRouter();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Product</Text>
          <Button title="Go back to Home" onPress={() => router.push('./index')} />
        </View>
      );
}