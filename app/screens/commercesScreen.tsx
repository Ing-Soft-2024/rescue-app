import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { commerceConsumer } from '@/src/services/client';
import { checkInternetConnection, NO_INTERNET_MESSAGE } from '@/src/utils/networkUtils';

interface Commerce {
  id: number;
  name: string;
  streetName: string;
  streetNumber: string;
  city: string;
  country: string;
  avgRating: number | null;
}

export default function CommercesScreen() {
  const [commerces, setCommerces] = useState<Commerce[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCommerces();
  }, []);

  const fetchCommerces = async () => {
    const isConnected = await checkInternetConnection();
    if (!isConnected) {
      Alert.alert('Error de Conexión', NO_INTERNET_MESSAGE);
      setIsLoading(false);
      return;
    }

    try {
      const response = await commerceConsumer.consume('GET');
      const sortedCommerces = response.sort((a: Commerce, b: Commerce) => 
        a.name.localeCompare(b.name)
      );
      setCommerces(sortedCommerces);
    } catch (error) {
      console.error('Error fetching commerces:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCommerceItem = ({ item }: { item: Commerce }) => {
    const fullAddress = [
      item.streetName && item.streetNumber ? `${item.streetName} ${item.streetNumber}` : null,
      item.city,
      item.country
    ].filter(Boolean).join(', ');

    return (
      <TouchableOpacity 
        style={styles.commerceItem}
        onPress={() => router.push({
          pathname: '/screens/companyScreen',
          params: { id: item.id }
        })}
      >
        <Text style={styles.commerceName}>{item.name}</Text>
        <Text style={styles.commerceAddress}>{fullAddress || 'Sin dirección'}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>
            Calificación: {item.avgRating ? item.avgRating.toFixed(1) : 'Sin calificaciones'}
          </Text>
          {item.avgRating && <Text style={styles.ratingText}>★</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D4685E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={commerces}
        renderItem={renderCommerceItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
  listContainer: {
    padding: 15,
  },
  commerceItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  commerceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  commerceAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#333',
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#D4685E',
  },
  separator: {
    height: 10,
  },
}); 