import React from "react";
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  StatusBar,
  View,
} from "react-native";
import { CategoryBtn, CategoryBtnProps } from "./CategoryBtn";

export interface CategoryTabProps {
  arr: CategoryBtnProps[];
}

export function CategoryTab({ arr }: CategoryTabProps) {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={arr}
        horizontal={true}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <CategoryBtn
            title={item.title}
            tab={item.tab}
            scrollView={item.scrollView}
          />
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
    margin: 10,
  },
  listContainer: {
    alignItems: "center", // Center items horizontally within the FlatList
  },

  title: {
    fontSize: 32,
  },
  separator: {
    width: 20, // Adjust the width of the separator if needed
  },
});
