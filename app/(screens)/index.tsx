import { useSession } from '@/src/context/session.context';
import { productConsumer } from '@/src/services/client';
import { ProductType } from '@/src/types/product.type';
import React from 'react';
import { Button, FlatList, View, Text, Pressable } from 'react-native';
import { CategoryList } from '../../components/CategoryList';
import { SearchBar } from '../../components/SearchBar';
import { useOrders } from '@/src/context/ordersContext';
import { router, useRouter } from 'expo-router';
import { colors } from '@/src/global-style';

export default function homeScreen() {
  const { signOut } = useSession();

  const [category, setCategory] = React.useState<ProductType[]>([]);

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
    router.push("./QRScreen");
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
      />
      <View>
        <Button title="Cerrar sesión" onPress={signOut} color="#D4685E" />
      </View>
    </View >
  );
}

