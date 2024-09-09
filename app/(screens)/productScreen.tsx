import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Header } from '@/src/components/product/ProductHeader';
import { ProductDescription } from '@/src/components/product/ProductDescription';
import { AddToCart } from '@/src/components/product/ProductAddToCart';

export default function ProductLayout() {
  const productDescription = "Texto descriptivo del producto definido por el vendedor";
  const productImageUrl = "https://arc-anglerfish-arc2-prod-abccolor.s3.amazonaws.com/public/FJQXM5JUU5FFHDDCNZLOSDZGSY.jpg"; // URL de la imagen del producto
  const productTitle = "Hamburguesa de carne"; // El nombre del producto
  const productPrice = "$9.99"; // El precio del producto
  const productCategory = "Fast Food"; // Nueva categoría

  return (
    <View style={styles.container}>
      {/* Header con imagen y botones */}
      <Header
        imageUrl={productImageUrl}
        onBackPress={() => console.log("Back pressed")}
        onSharePress={() => console.log("Share pressed")}
        onFavoritePress={() => console.log("Favorite pressed")}
      />

      {/* Detalles del producto */}
      <ProductDescription
        category={productCategory}
        description={productDescription}
        title={productTitle}
        price={productPrice}
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
