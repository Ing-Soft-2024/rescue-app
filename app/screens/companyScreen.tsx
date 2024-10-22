// import HeaderComp from '@/components/Header';
import { CategoryTab } from '@/src/components/commerce/CategoryTab';
import { Header } from '@/src/components/product/ProductHeader';
import { ProductType } from '@/src/types/product.type';
import { useRouter } from 'expo-router';
import { default as React, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { CategoryList } from '../../components/CategoryList';
import { CompanyDataTab } from '../../components/CompanyDataTab';

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

  const scrollViewRef = useRef<ScrollView>(null);
  const sectionRefs = {
    section1: useRef<View>(null),
    section2: useRef<View>(null),
    section3: useRef<View>(null),
    section4: useRef<View>(null),
    section5: useRef<View>(null),
  };

  // const navigateToIndex = () => {
  //     router.push('./(screens)/index.tsx');  
  // };
  // Datos de la empresa (ejemplo)
  // Ver como implementar el listado de los productos de cada empresa

  const arr1: ProductType[] = [
    {
      id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      name: "First Item",
      description: "Description of the first item",
      price: 100,
      image: "https://picsum.photos/200",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      name: "Second Item",
      description: "Description of the second item",
      price: 200,
      image: "https://picsum.photos/200",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d72",
      name: "Third Item",
      description: "Description of the third item",
      price: 300,
      image: "https://picsum.photos/200",
    },
    {
      id: "158694a0f-3da1-471f-bd96-145571e29d72",
      name: "Fourth Item",
      description: "Description of the fourth item",
      price: 400,
      image: "https://picsum.photos/200",
    },
    {
      id: "586943a0f-3da1-471f-bd96-145571e29d72",
      name: "Fifth Item",
      description: "Description of the fifth item",
      price: 500,
      image: "https://picsum.photos/200",
    },
  ];

  const company = {
    name: 'ITBA',
    ubication: 'San Martin 202',
    rating: 4,
    products: [
      <CategoryList products={arr1} />
    ]
  };

  // Renderizado de cada producto
  // const renderProduct = ({ item }: { item: Product }) => (
  //   <CategoryList arr={company.products}/>
  // );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer} ref={scrollViewRef}>

        <Header onBackPress={onPressBack} imageUrl='https://picsum.photos/200' />


        {/* <View style={styles.imageContainer}>
        <Image source={{ uri: -company.image- }} style={styles.image} />
      </View> */}

        <CompanyDataTab
          companyName={company.name}
          location={company.ubication}
          rating={company.rating}
        />
        <CategoryTab arr={[
          { title: 'tab1', tab: sectionRefs.section1, scrollView: scrollViewRef },
          { title: 'tab2', tab: sectionRefs.section2, scrollView: scrollViewRef },
          { title: 'tab3', tab: sectionRefs.section3, scrollView: scrollViewRef },
          { title: 'tab4', tab: sectionRefs.section4, scrollView: scrollViewRef },
          { title: 'tab5', tab: sectionRefs.section5, scrollView: scrollViewRef },
        ]} />
        <View ref={sectionRefs.section1}>
          <CategoryList products={arr1} />
        </View >
        <View ref={sectionRefs.section2}>
          <CategoryList products={arr1} />
        </View>
        <View ref={sectionRefs.section3}>
          <CategoryList products={arr1} />
        </View>
        <View ref={sectionRefs.section4}>
          <CategoryList products={arr1} />
        </View>
        <View ref={sectionRefs.section5}>
          <CategoryList products={arr1} />
        </View>


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
    paddingHorizontal: 0,
    paddingBottom: 20, // Añadir espacio al final del scroll
  },
});







