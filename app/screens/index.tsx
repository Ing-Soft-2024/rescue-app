import { useOrders } from '@/src/context/ordersContext';
import { useSession } from '@/src/context/session.context';
import { nearUserConsumer } from '@/src/services/client';
import { ProductType } from '@/src/types/product.type';
import { useRouter } from 'expo-router';
import React, { useContext } from 'react';
import { Button, FlatList, Pressable, RefreshControl, Text, View, Alert, ActivityIndicator } from 'react-native';
import { CategoryList } from '../../components/CategoryList';
import { SearchBar } from '../../components/SearchBar';
import { userLocationContext } from '@/src/context/userLocationContext';

export default function homeScreen() {
  const { signOut } = useSession();
  const { location } = useContext(userLocationContext);
  const [category, setCategory] = React.useState<ProductType[]>([]);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const getCurrentCoordinates = () => {
    if (location?.coords) {
      return {
        userLatitude: location.coords.latitude,
        userLongitude: location.coords.longitude
      };
    }
    return null;
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    const coordinates = getCurrentCoordinates();

    if (!coordinates) {
      Alert.alert('Location Required', 'Please enable location services to see nearby products');
      setIsRefreshing(false);
      return;
    }

    try {
      const res = await nearUserConsumer.consume('GET', {
        queryParams: {
          ...coordinates,
        }
      });
      console.log(res);
      setCategory(res);
    } catch (error) {
      console.error('Error fetching nearby products:', error);
      Alert.alert('Error', 'Failed to fetch nearby products');
    } finally {
      setIsRefreshing(false);
    }
  };
  
  React.useEffect(() => {
    setIsLoading(true);
    const coordinates = getCurrentCoordinates();
    if (coordinates) {
      nearUserConsumer.consume('GET', {
        queryParams: {
          ...coordinates
        }
      })
        .then(setCategory)
        .catch(error => {
          console.error('Error fetching nearby products:', error);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [location]);

  const router = useRouter();
  const { cart, total, orderQR } = useOrders();

  const viewOrder = () => {
    router.push("/screens/QRScreen");
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#D4685E" />
      ) : (
        <>
          <View style={{ paddingHorizontal: 10 }}>
            <SearchBar />
          </View>

          {orderQR != "" && 
            <Pressable 
              style={{padding: 10, backgroundColor: "#D4685E", borderRadius: 10}} 
              onPress={viewOrder}
            >
              <Text style={{fontSize: 20, color: 'white'}}>
                Presiona aqui para ver el QR de tu orden
              </Text>
            </Pressable>
          }
          
          <FlatList
            data={[1]}
            renderItem={({ item }) =>
              <CategoryList
                categoryTitle={`Comidas`}
                products={category}
              />
            }
            refreshControl={
              <RefreshControl 
                refreshing={isRefreshing} 
                onRefresh={onRefresh} 
              />
            }
          />
          <View>
            <Button 
              title="Cerrar sesión" 
              onPress={signOut} 
              color="#D4685E" 
            />
          </View>
        </>
      )}
    </View>
  );
}

