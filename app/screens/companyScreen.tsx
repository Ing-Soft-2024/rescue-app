import { CategoryTab } from '@/src/components/commerce/CategoryTab';
import { Header } from '@/src/components/product/ProductHeader';
import { ProductType } from '@/src/types/product.type';
import { useFocusEffect, useRouter, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import { CategoryList } from '../../components/CategoryList';
import { commerceDetailsConsumer } from '@/src/services/client';

export default function CompanyScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  
  const [company, setCompany] = useState({
    name: '',
    address: '',
    avgRating: 0,
    products: [] as ProductType[],
  });

  useFocusEffect(
    React.useCallback(() => {
      const fetchCompanyData = async () => {
        try {
          setIsLoading(true);
          console.log("Fetching company with ID:", id);
          
          const companyData = await commerceDetailsConsumer.consume('GET', {
            params: { id: Number(id) },
          });

          console.log("Received company data:", companyData);

          if (companyData) {
            setCompany({
              name: companyData.name || 'Nombre no disponible',
              address: companyData.address || 'Dirección no disponible',
              avgRating: companyData.avgRating || 0,
              products: companyData.products || [],
            });
          }
        } catch (error) {
          console.error("Error fetching company data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      if (id) {
        fetchCompanyData();
      } else {
        console.error("No ID provided");
        setIsLoading(false);
      }
    }, [id])
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D4685E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{company.name}</Text>
        <Text style={styles.address}>{company.address}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>Calificación: {company.avgRating.toFixed(1)}</Text>
          <Text style={styles.ratingText}>★</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Productos Disponibles</Text>
      
      <FlatList
        data={[1]}
        renderItem={({ item }) => (
          <CategoryList
            categoryTitle="Productos"
            products={company.products}
          />
        )}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    color: '#333',
    marginRight: 4,
  },
  ratingText: {
    fontSize: 16,
    color: '#D4685E',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    padding: 20,
    backgroundColor: 'white',
    marginTop: 10,
  },
});
