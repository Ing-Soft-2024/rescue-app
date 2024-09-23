import { useSession } from '@/src/context/session.context';
import { ProductType } from '@/src/types/product.type';
import { useRouter } from 'expo-router';
import { Button, FlatList, View, Text } from 'react-native';
import { CategoryList } from '../../components/CategoryList';
import { SearchBar } from '../../components/SearchBar';
import { userLocationContext } from '../../src/context/userLocationContext';
import { useState, useEffect } from 'react';

export default function homeScreen() {
  const router = useRouter();
  const { signOut } = useSession();


  const sampleProduct: ProductType = {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    name: "Item",
    description: "Description of the item",
    price: 100,
    image: ''
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ paddingHorizontal: 10 }}>
        <SearchBar />
      </View>
      <FlatList
        data={[1, 2, 3, 4, 5]}
        renderItem={({ item }) =>
          <CategoryList
            categoryTitle={`Category ${item}`}
            products={Array.from({ length: 5 }, () => sampleProduct)}
          />
        }
      />
      <View>
        <Button title="Go to company profile" onPress={() => router.push('./companyScreen')} />
        <Button title="Go to google map" onPress={() => router.push('./googleMapScreen')} />
        <Button title="Cerrar sesión" onPress={signOut} />
      </View>
    </View >
  );
}

