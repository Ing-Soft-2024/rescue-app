import { ProductCard } from "@/src/components/product/ProductCard";
import { ProductType } from "@/src/types/product.type";
import React from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from "react-native";

interface CategoryListProps {
  categoryTitle?: string;
  products: ProductType[];
}

export function CategoryList({ categoryTitle, products: arr }: CategoryListProps) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{categoryTitle}</Text>
      <FlatList
        data={arr}
        horizontal={true}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <ProductCard product={item} />
        )}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // width: 300,
    // height: 200,
    // backgroundColor: "grey",
    // marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    margin: 10,
  },
  listContainer: {
    alignItems: "center", // Center items horizontally within the FlatList
  },

  title: {
    fontSize: 20,
    paddingVertical: 5,
    color: "#D4685E",
  },
  separator: {
    width: 10, // Adjust the width of the separator if needed
  },
});
