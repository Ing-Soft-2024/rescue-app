import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ProductDescriptionProps {
  category: string;
  description: string;
  title: string;
  price: string;
}

export function ProductDescription({
  category,
  description,
  title,
  price,
}: ProductDescriptionProps) {
  return (
    <View style={styles.container}>

      <Text style={styles.category}>{category}</Text>
      {/* Título más grande y precio */}
      <View style={styles.titlePriceContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.price}>{price}</Text>
      </View>

      {/* Descripción sin caja */}
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginVertical: 12,
  },
  category: {
    fontSize: 12, // Tamaño pequeño para la categoría
    color: "#888", // Color gris para dar menor prominencia
    marginBottom: 5, // Espacio entre la categoría y el título
  },
  titlePriceContainer: {
    flexDirection: "row", // Alinear el título y el precio en fila
    justifyContent: "space-between", // El título a la izquierda y el precio a la derecha
    alignItems: "center", // Alinear verticalmente al centro
    marginBottom: 10,
  },
  title: {
    fontSize: 24, // Aumentar el tamaño del título
    fontWeight: "bold",
    color: "#333",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF", // Color azul para destacar el precio
  },
  description: {
    fontSize: 16,
    color: "#333",
  },
});