import React from 'react';
import { View, Text, Button, FlatList, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header'; 
import { ProductTemp, ProductTempProps } from "../../components/ProductTemp";
import { CategoryTab } from '@/components/CategoryTab';
import { CompanyDataTab } from '@/components/CompanyDataTab';

interface Product {
  id: string;
  title: string;
  color: string;
}

export default function CompanyScreen() {
  const router = useRouter();

  const screen = "Company";
  
  const navigateToIndex = () => {
    router.push('./(screens)/index.tsx');  
};
  // Datos de la empresa (ejemplo)
  // Ver como implementar el listado de los productos de cada empresa
  const company = {
    name: 'ITBA',
    ubication: 'San Martin 202',
    rating: 4,
    products: [
      // categoryTab (insertar las tablas horizontales)
      { id: '1', title: 'Product 1', color: "#0f0" },
      { id: '2', title: 'Product 2', color: "#0f0" }
    ]
  };

  // Renderizado de cada producto
  const renderProduct = ({ item }: { item: Product }) => (
    <CategoryTab arr={company.products}/>
  );

  return (
    <View style={{ flex: 1 }}>
      <Header onPressButton={navigateToIndex} screenName={screen} />

      {/* <View style={styles.imageContainer}>
        <Image source={{ uri: -company.image- }} style={styles.image} />
      </View> */}

      <CompanyDataTab 
        companyName={company.name} 
        location={company.ubication} 
        rating={company.rating}
      />

      <FlatList
        data={company.products}  // Datos de productos
        renderItem={renderProduct} 
        keyExtractor={(item) => item.id}  // Clave única para cada producto
        contentContainerStyle={styles.flatListContainer}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  // image: {
  //   width: 150,
  //   height: 150,
  //   borderRadius: 75,
  // },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  flatListContainer: {
    paddingHorizontal: 20,
  },
  buttonContainer: {
    padding: 20,
    alignItems: 'center',
  },
});







