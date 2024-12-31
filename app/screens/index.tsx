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

  const getCurrentCoordinates = () => {
    if (location?.coords) {
      return {
        userLatitude: location.coords.latitude,
        userLongitude: location.coords.longitude
      };
    }
    return null;
  };

  const fetchProducts = async () => {
    const coordinates = getCurrentCoordinates();

    if (!coordinates) {
      Alert.alert('Location Required', 'Please enable location services to see nearby products');
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
      console.error('Error fetching nearby products:', error);
      Alert.alert('Error', 'Failed to fetch nearby products');
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
    fetchProducts().finally(() => setIsLoading(false));
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
          <Text style={{ 
            fontSize: 24, 
            fontWeight: 'bold', 
            color: '#D4685E',
            padding: 16,
            textAlign: 'left'
          }}>
            ¡Bienvenido {session?.user.firstName}!
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
                Presiona aqui para ver el QR de tu orden
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
              onPress={signOut} 
              color="#D4685E" 
            />
          </View>
        </>
      )}
    </View>
  );
}

