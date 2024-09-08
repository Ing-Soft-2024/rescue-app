import { View, Text, Button, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

export default function homeScreen() {
    const router = useRouter();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Button title="Go to company profile" onPress={() => router.push('./companyScreen')} />

          {/* agregarle a cada componente de la barra lateral, el router de cada Screen*/}

        </View>
      );

}