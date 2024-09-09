import React from "react";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { Header } from '@/src/components/product/ProductHeader';
import { ProductDescription } from '@/src/components/product/ProductDescription';
import { AddToCart } from '@/src/components/product/ProductAddToCart';

type ProductType = {
  title: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
};

export default function ProductLayout() {

  const router = useRouter();

  const product: ProductType = {
    title: "Hamburguesa de carne",
    description: "Hamburguesa de carne 100% vacuna.\nIncluye queso, pepinillos, tomate y lechuga.",
    price: "$9.99",
    category: "Fast Food",
    imageUrl: "https://arc-anglerfish-arc2-prod-abccolor.s3.amazonaws.com/public/FJQXM5JUU5FFHDDCNZLOSDZGSY.jpg",
  };

  return (
    <View style={styles.container}>
      {/* Header con imagen y botones */}
      <Header
        imageUrl={product.imageUrl}
        onBackPress={() => router.back()}
        onSharePress={() => console.log("Share pressed")}
        onFavoritePress={() => console.log("Favorite pressed")}
      />

      {/* Detalles del producto */}
      <ProductDescription
        category={product.category}
        description={product.description}
        title={product.title}
        price={product.price}

      />

      {/* Banner inferior para agregar al carrito */}
      <AddToCart onAddToCartPress={() => console.log("Añadido al carrito")} />
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
  header: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 20,
  },
});
