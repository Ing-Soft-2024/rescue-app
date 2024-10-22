import { AddToCart } from '@/src/components/product/ProductAddToCart';
import { ProductDescription } from '@/src/components/product/ProductDescription';
import { Header } from '@/src/components/product/ProductHeader';
import { useOrders } from "@/src/context/ordersContext";
import { productDetailsConsumer } from '@/src/services/client';
import StorageController from '@/src/services/storage/controller/storage.controller';
import { ProductType } from '@/src/types/product.type';
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

// export type ProductType = {
//   title: string;
//   description: string;
//   price: number;
//   category: string;
//   imageUrl: string;
//   productId: number;
// };

export default function ProductLayout() {

  const router = useRouter();
  const params = useLocalSearchParams();
  const [product, setProduct] = React.useState<ProductType>({} as ProductType);
  const [isLoading, setIsLoading] = React.useState(true);

  const {
    addToCart
  } = useOrders();
  const [showSuccessCard, setShowSuccessCard] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
        console.log(params);
        if(!params.id) return;

        setIsLoading(true);
        productDetailsConsumer.consume('GET', {
            params: { id: Number(params.id) }
        }).then((product) => {
          if (!product.image) return;
          StorageController.download(product.image)
            .then(image => setProduct({
                ...product,
                image
            }))
            .catch(() => router.dismissAll())
            .then(() => setIsLoading(false));

        });
  
    }, [params.id])
);

  return (
    <View style={styles.container}>
        { isLoading &&
            <View style={{
                flex: 1,
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                backgroundColor: "#3339",
                zIndex: 1200,
            }}>
                <ActivityIndicator size="small" color="white" />
            </View>
        }
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header con imagen y botones */}
        <Header
          imageUrl={product.image}
          onBackPress={() => router.back()}
          onSharePress={() => console.log("Share pressed")}
          onFavoritePress={() => console.log("Favorite pressed")}
        />

        <View>
          <Text
            style={styles.link}
            onPress={() => router.push('./companyScreen')}
          >
            View Company
          </Text>
        </View>

        {/* Detalles del producto */}
        <ProductDescription
          category={product.category}
          description={product.description}
          title={product.name}
          price={product.price}
        />

        {/* Banner inferior para agregar al carrito */}
        {!showSuccessCard && (
        <AddToCart onAddToCartPress={() => {
          addToCart({ product, quantity: 1 });
          setShowSuccessCard(true);
          setTimeout(() => setShowSuccessCard(false), 3000);
          }} />
        )}
      </ScrollView>
      {showSuccessCard && (
        <View style={styles.successCard}>
          <Text style={styles.successText}>Added to cart successfully!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-start", // Alinear todo al principio (arriba)
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start', // Alinear todo al principio (arriba)
    paddingBottom: 80, // Espacio inferior para el botón
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 20,
  },
  link: {
    color: '#D4685E',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  successCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 5,
    right: 0,
    backgroundColor: '#2bc253',
    padding: 10,
    alignItems: 'center',
  },
  successText: {
    color: '#fff',
    fontSize: 16,
  },
});
