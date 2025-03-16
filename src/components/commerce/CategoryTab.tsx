import React from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View
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
        renderItem={({ item, index }) => (
          <CategoryBtn
            title={item.title}
            tab={item.tab}
            scrollView={item.scrollView}
          />
        )}

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
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  listContainer: {
    alignItems: "center", // Center items horizontally within the FlatList
  },

  title: {
    fontSize: 32,
  },
  separator: {
    width: 5, // Adjust the width of the separator if needed
  },
});
