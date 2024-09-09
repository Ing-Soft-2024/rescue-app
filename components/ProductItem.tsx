import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ProductItem = ({ productType }) => {
  const { image, name, currentPrice, oldPrice } = productType;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
      </View>

      <Image source={{ uri: image }} style={styles.productImage} />

      <View style={styles.detailsContainer}>
        <Text style={styles.categoryText}>Categoría</Text>
        <Text style={styles.productName}>{name}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>${currentPrice}</Text>
          <TouchableOpacity style={styles.buyButton}>
            <Text style={styles.buyButtonText}>Comprar</Text>
          </TouchableOpacity>
        </View>

        {oldPrice && (
          <Text style={styles.oldPrice}>${oldPrice}</Text>
        )}

        <Text style={styles.description}>Descripción del producto</Text>
      </View>

      <View style={styles.relatedProductsContainer}>
        <Text style={styles.relatedTitle}>Productos relacionados</Text>
        {}
        <View style={styles.relatedProduct}>
          <View style={styles.relatedProductImage} />
          <Text style={styles.relatedProductName}>Nombre producto</Text>
          <Text style={styles.relatedProductPrice}>$ -</Text>
        </View>
        {/* Puedes agregar más productos relacionados como necesites */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    backgroundColor: 'transparent',
  },
  backText: {
    fontSize: 16,
    color: '#000',
  },
  productImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#e0e0e0',
  },
  detailsContainer: {
    padding: 16,
  },
  categoryText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  buyButton: {
    backgroundColor: '#0000ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  oldPrice: {
    fontSize: 18,
    color: '#888',
    textDecorationLine: 'line-through',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  relatedProductsContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  relatedProduct: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  relatedProductImage: {
    width: 100,
    height: 100,
    backgroundColor: '#999',
    marginBottom: 8,
  },
  relatedProductName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  relatedProductPrice: {
    fontSize: 14,
    color: '#888',
  },
});

export default ProductItem;