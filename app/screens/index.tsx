import { useOrders } from '@/src/context/ordersContext';
import { useSession } from '@/src/context/session.context';
import { productConsumer } from '@/src/services/client';
import { ProductType } from '@/src/types/product.type';
import { useRouter } from 'expo-router';
import React from 'react';
import { Button, FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { CategoryList } from '../../components/CategoryList';
import { SearchBar } from '../../components/SearchBar';

export default function homeScreen() {
  const { signOut } = useSession();

  const [category, setCategory] = React.useState<ProductType[]>([]);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const onRefresh = () => {
    setIsRefreshing(true);
    productConsumer.consume('GET')
      .then(setCategory)
      .finally(() => setIsRefreshing(false));
  }
  
  React.useEffect(() => {
    productConsumer.consume('GET')
      .then(setCategory);
  }, [])

  
    const router = useRouter();
  const { cart, total,orderQR } = useOrders();

  const sampleProduct: ProductType = {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    name: "Item",
    description: "Description of the item",
    price: 100,
    image: ''
  };
  const viewOrder = () => {
    // router.push("./(checkout)/mercadoPago");
    router.push("/screens/QRScreen");
 }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ paddingHorizontal: 10 }}>
        <SearchBar />
      </View>

    
      {orderQR != "" && 
      <Pressable style={{padding: 10, backgroundColor: "#D4685E", borderRadius: 10}} onPress={viewOrder}>
      <Text style={{fontSize: 20, color: 'white'}}>Presiona aqui para ver el QR de tu orden</Text>
      </Pressable>}
      
      <FlatList
        data={[1]}
        renderItem={({ item }) =>
          <CategoryList
            categoryTitle={`Comidas`}
            products={category}
          />
        }

        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      />
      <View>
        <Button title="Cerrar sesión" onPress={signOut} color="#D4685E" />
      </View>
    </View >
  );
}

