import { useSession } from '@/src/context/session.context';
import { useRouter } from 'expo-router';
import { Button, View } from 'react-native';

export default function homeScreen() {
  const router = useRouter();
  const { signOut } = useSession();


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Go to company profile" onPress={() => router.push('./companyScreen')} />
      <Button title="Cerrar sesión" onPress={signOut} />
    </View>
  );

}