import React from "react";
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  StatusBar,
  View,
} from "react-native";
import { ProductTemp, ProductTempProps } from "./ProductTemp";

interface CategoryTabProps {
  arr: ProductTempProps[];
}

export function CategoryTab({ arr }: CategoryTabProps) {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={arr}
        horizontal={true}
        ItemSeparatorComponent={View}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <ProductTemp title={item.title} id={item.id} color={item.color} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 200,
    backgroundColor: "grey",
    // marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
  listContainer: {
    alignItems: "center", // Center items horizontally within the FlatList
  },

  title: {
    fontSize: 32,
  },
});
