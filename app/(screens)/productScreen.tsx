import { AddToCart } from '@/src/components/product/ProductAddToCart';
import { ProductDescription } from '@/src/components/product/ProductDescription';
import { Header } from '@/src/components/product/ProductHeader';
import { useOrders } from "@/src/context/ordersContext";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type ProductType = {
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
};

export default function ProductLayout() {

  const router = useRouter();
  const {
    addToCart
  } = useOrders();

  const product: ProductType = {
    title: "Hamburguesa de carne",
    description: "Hamburguesa de carne 100% vacuna.\nIncluye queso, pepinillos, tomate y lechuga.",
    price: 9.99,
    category: "Fast Food",
    imageUrl: "https://arc-anglerfish-arc2-prod-abccolor.s3.amazonaws.com/public/FJQXM5JUU5FFHDDCNZLOSDZGSY.jpg",
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header con imagen y botones */}
        <Header
          imageUrl={product.imageUrl}
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
          title={product.title}
          price={product.price}
        />

        {/* Banner inferior para agregar al carrito */}
        <AddToCart onAddToCartPress={() => addToCart({ product, quantity: 1 })} />
      </ScrollView>
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
});
