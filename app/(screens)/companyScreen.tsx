import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { CategoryList } from '../../components/CategoryList';
import { CompanyDataTab } from '../../components/CompanyDataTab';
import Header from '../../components/Header';
import { ProductTempProps } from "../../components/ProductTemp";

interface Product {
  id: string;
  title: string;
  color: string;
}

export default function CompanyScreen() {
  const router = useRouter();

  const screen = "Company";

  const onPressBack = () => {
    router.back();
  };

  // const navigateToIndex = () => {
  //     router.push('./(screens)/index.tsx');  
  // };
  // Datos de la empresa (ejemplo)
  // Ver como implementar el listado de los productos de cada empresa

  const arr1: ProductTempProps[] = [
    {
      id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      title: "First Item",
      color: "red",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      title: "Second Item",
      color: "green",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d72",
      title: "Third Item",
      color: "white",
    },
    {
      id: "158694a0f-3da1-471f-bd96-145571e29d72",
      title: "Fourth Item",
      color: "#0ff",
    },
    {
      id: "586943a0f-3da1-471f-bd96-145571e29d72",
      title: "Fifth Item",
      color: "white",
    },
  ];

  const company = {
    name: 'ITBA',
    ubication: 'San Martin 202',
    rating: 4,
    products: [
      <CategoryList arr={arr1} />
    ]
  };

  // Renderizado de cada producto
  // const renderProduct = ({ item }: { item: Product }) => (
  //   <CategoryList arr={company.products}/>
  // );

  return (
    <View style={{ flex: 1 }}>
      <Header onBackPress={onPressBack} screenName={screen} />


      {/* <View style={styles.imageContainer}>
        <Image source={{ uri: -company.image- }} style={styles.image} />
      </View> */}

      <CompanyDataTab
        companyName={company.name}
        location={company.ubication}
        rating={company.rating}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <CategoryList arr={arr1} />
        <CategoryList arr={arr1} />
        <CategoryList arr={arr1} />
        <CategoryList arr={arr1} />
      </ScrollView>


      {/* <FlatList
        data={company.products}  // Datos de productos
        renderItem={renderProduct} 
        keyExtractor={(item) => item.id}  // Clave única para cada producto
        contentContainerStyle={styles.flatListContainer}
      /> */}

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
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20, // Añadir espacio al final del scroll
  },
});







