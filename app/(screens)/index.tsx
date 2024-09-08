import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function homeScreen() {
    const router = useRouter();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Button title="Go to company profile" onPress={() => router.push('./companyScreen')} />
        </View>
      );

}