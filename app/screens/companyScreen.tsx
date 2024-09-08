import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function companyScreen() {
    const router = useRouter();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Company Profile</Text>
          <Button title="Go back to Home" onPress={() => router.push('.//homeScreen')} />
        </View>
      );
}





