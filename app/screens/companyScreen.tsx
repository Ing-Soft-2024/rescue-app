import { CategoryTab } from '@/src/components/commerce/CategoryTab';
import { Header } from '@/src/components/product/ProductHeader';
import { ProductType } from '@/src/types/product.type';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { CategoryList } from '../../components/CategoryList';
import { CompanyDataTab } from '../../components/CompanyDataTab';
import { commerceDetailsConsumer } from '@/src/services/client';

export default function CompanyScreen() {
  const router = useRouter();
  console.log("COMPANY SCREEN");

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

  const [company, setCompany] = React.useState({
    name: '',
    ubication: '',
    avgRating: 0,
    products: [],
  });
  const [arr1, setArr1] = React.useState<ProductType[]>([]);

  const fetchCompanyData = async () => {
    try {
      const companyData = await commerceDetailsConsumer.consume('GET', {
        params: { id: 1 }
      });
      setCompany(companyData);
      setArr1(companyData.products);
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCompanyData();
    }, []) // Empty dependency array to run only when screen comes into focus
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer} ref={scrollViewRef}>
        <Header onBackPress={onPressBack} imageUrl='https://picsum.photos/200' />
        <CompanyDataTab
          companyName={company.name}
          location={company.ubication}
          rating={company.avgRating}
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
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
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
    paddingBottom: 20, // Add space at the end of the scroll
  },
});
