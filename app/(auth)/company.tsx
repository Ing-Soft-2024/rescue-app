import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function company() {
    const router = useRouter();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Company Profile</Text>
          <Button title="Go to Home" onPress={() => router.push('../screens/HomeScreen')} />
        </View>
      );
}





