import { AddToCart } from '@/src/components/product/ProductAddToCart';
import { ProductDescription } from '@/src/components/product/ProductDescription';
import { Header } from '@/src/components/product/ProductHeader';
import { useOrders } from "@/src/context/ordersContext";
import { ProductType } from '@/src/types/product.type';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

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
  const {
    addToCart
  } = useOrders();
  const [showSuccessCard, setShowSuccessCard] = useState(false);

  const product: ProductType = {
    name: "Hamburguesa de carne",
    description: "Hamburguesa de carne 100% vacuna.\nIncluye queso, pepinillos, tomate y lechuga.",
    price: 9.99,
    category: "Fast Food",
    image: "https://arc-anglerfish-arc2-prod-abccolor.s3.amazonaws.com/public/FJQXM5JUU5FFHDDCNZLOSDZGSY.jpg",
    productId: 1,
  };

  return (
    <View style={styles.container}>
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
