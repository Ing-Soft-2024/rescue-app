import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';

const CategoryList = ({ categories }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item.name && styles.selectedCategoryButton,
      ]}
      onPress={() => handleCategoryPress(item)}
    >
      <Text style={styles.categoryButtonText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }) => (
    <View style={styles.productContainer}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.currentPrice}</Text>
      {item.oldPrice && (
        <Text style={styles.oldPrice}>${item.oldPrice}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        horizontal
        keyExtractor={(item) => item.name}
        renderItem={renderCategoryItem}
        style={styles.categoryList}
      />

      {selectedCategory && (
        <FlatList
          data={selectedCategory.products}
          keyExtractor={(item) => item.name}
          renderItem={renderProductItem}
          style={styles.productList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  categoryList: {
    marginBottom: 16,
  },
  categoryButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    borderRadius: 8,
  },
  selectedCategoryButton: {
    backgroundColor: '#0000ff',
  },
  categoryButtonText: {
    color: '#000',
    fontSize: 16,
  },
  productContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  productImage: {
    width: 100,
    height: 100,
    backgroundColor: '#e0e0e0',
    marginBottom: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  oldPrice: {
    fontSize: 14,
    color: '#888',
    textDecorationLine: 'line-through',
  },
  productList: {
    marginTop: 16,
  },
});

export default CategoryList;