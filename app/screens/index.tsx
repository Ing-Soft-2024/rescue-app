import { useOrders } from '@/src/context/ordersContext';
import { useSession } from '@/src/context/session.context';
import { nearUserConsumer, orderConsumer } from '@/src/services/client';
import { ProductType } from '@/src/types/product.type';
import { useRouter } from 'expo-router';
import React, { useContext } from 'react';
import { Button, FlatList, Pressable, RefreshControl, Text, View, Alert, ActivityIndicator } from 'react-native';
import { CategoryList } from '../../components/CategoryList';
import { SearchBar } from '../../components/SearchBar';
import { userLocationContext } from '@/src/context/userLocationContext';
import * as Location from 'expo-location';
import { checkInternetConnection, NO_INTERNET_MESSAGE } from '@/src/utils/networkUtils';
import { useFocusEffect } from '@react-navigation/native';


type CategoryProducts = {
  [key: string]: ProductType[];
};

export default function homeScreen() {
  const { signOut, session } = useSession();
  const { location } = useContext(userLocationContext);
  const [categorizedProducts, setCategorizedProducts] = React.useState<CategoryProducts>({});
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchText, setSearchText] = React.useState('');
  const router = useRouter();
  const { cart, total, orderQR, setOrderQR, clearCart } = useOrders();

  const getCurrentCoordinates = async () => {
    if (location?.coords) {
      
      return {
        userLatitude: location.coords.latitude,
        userLongitude: location.coords.longitude
      };
    }

    // Try to get network-based location if GPS is not available
    try {
      const networkLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Lowest, // Lower accuracy allows for network-based location
        mayShowUserSettingsDialog: false // Prevents GPS permission prompt
      });

      
      return {
        userLatitude: networkLocation.coords.latitude,
        userLongitude: networkLocation.coords.longitude
      };
    } catch (error) {
      console.error('Error getting network location:', error);
      return null;
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getInitialData();
    }, [session?.user?.id])
  );

  const getInitialData = async () => {
    await getCurrentOrder();
    await fetchProducts();
  };

  const getCurrentOrder = async () => {
    try {
      const resp = await orderConsumer.consume('GET', { 
        queryParams: { 
          userId: Number(session?.user.id)
        } 
      });
      
      // Find pending order
      
      const pendingOrder = resp.find((order: any) => 
        order.status === "pending" || order.status === "accepted"
      );
      
      
      if (pendingOrder) {
        const QR = "rescueapp-bussiness://scan/scannedOrder?id=" + pendingOrder.id;
        setOrderQR(QR);
      } else {
        setOrderQR("");
      }
    } catch (error) {
      console.error('Error fetching current order:', error);
    }
  };

  const fetchProducts = async () => {
    const isConnected = await checkInternetConnection();
    if (!isConnected) {
      Alert.alert('Error de Conexión', NO_INTERNET_MESSAGE);
      return;
    }

    const coordinates = await getCurrentCoordinates();

    if (!coordinates) {
      Alert.alert('Error de Ubicación', 'No se pudo determinar tu ubicación. Algunas funciones pueden estar limitadas.');
      return;
    }

    try {
      const res = await nearUserConsumer.consume('GET', {
        queryParams: {
          ...coordinates,
          search: searchText
        }
      });
      
      const productsByCategory = res.reduce((acc: CategoryProducts, product: ProductType) => {
        const category = product.categories[0]?.name;
        if (!category) return acc;
        
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(product);
        return acc;
      }, {});
      
      setCategorizedProducts(productsByCategory);
    } catch (error) {
      if (!await checkInternetConnection()) {
        Alert.alert('Error de Conexión', NO_INTERNET_MESSAGE);
      } else {
        console.error('Error fetching nearby products:', error);
        Alert.alert('Error', 'No se pudieron cargar los productos cercanos');
      }
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchProducts();
    setIsRefreshing(false);
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const handleRefreshSearch = () => {
    fetchProducts();
  };
  
  React.useEffect(() => {
    setIsLoading(true);
    getInitialData().finally(() => setIsLoading(false));
  }, [location]);

 

  const viewOrder = () => {
    router.push("/screens/QRScreen");
  };

  const handleSignOut = async () => {
    clearCart();
    setOrderQR("");
    await signOut();
  };

  console.log('Session data:', session);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#D4685E" />
      ) : (
        <>
          <Text style={{ 
            fontSize: 24, 
            fontWeight: 'bold', 
            color: '#D4685E',
            padding: 16,
            textAlign: 'left'
          }}>
            ¡Bienvenido {session?.user?.firstName ? `${session.user.firstName}` : session?.user?.email || 'Usuario'}!
          </Text>

          <View style={{ paddingHorizontal: 10 }}>
            <SearchBar 
              onSearch={handleSearch}
              onRefresh={handleRefreshSearch}
              value={searchText}
            />
          </View>

          {orderQR != "" && 
            <Pressable 
              style={{padding: 10, backgroundColor: "#D4685E", borderRadius: 10}} 
              onPress={viewOrder}
            >
              <Text style={{fontSize: 20, color: 'white'}}>
                Presiona aqui para ver el Estado de tu orden
              </Text>
            </Pressable>
          }
          
          <FlatList
            data={Object.entries(categorizedProducts)}
            renderItem={({ item: [categoryName, products] }) => 
              products.length > 0 ? (
                <CategoryList
                  categoryTitle={categoryName}
                  products={products}
                />
              ) : null
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
              onPress={handleSignOut} 
              color="#D4685E" 
            />
          </View>
        </>
      )}
    </View>
  );
}

