import React from 'react';
import { View, Text, Button, FlatList, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header'; 
import { ProductTemp, ProductTempProps } from "../../components/ProductTemp";

interface Product {
  id: string;
  name: string;
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
    name: 'TechCorp',
    ubication: 'San Martin 202',
    rating: '4.0'
    // image: 
    products: [
      // categoryTab (insertar las tablas horizontales)
    ],
  };

  // Renderizado de cada producto
  const renderProduct = ({ item }: { item: Product }) => (
    <ProductTemp productName={item.name} />
  );

  return (
    <View style={{ flex: 1 }}>
      <Header onPressButton={navigateToIndex} screenName={screen} />

      {/* <View style={styles.imageContainer}>
        <Image source={{ uri: -company.image- }} style={styles.image} />
      </View> */}

      <Text style={styles.companyName}>{company.name}</Text>

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







