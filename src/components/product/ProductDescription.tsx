import React from "react";
import { StyleSheet, Text, View } from "react-native";

type ProductType = {
  title: string;
  description: string;
  price: string;
  category: string;
};

interface ProductDescriptionProps {
  title: string;
  description: string;
  price: number;
  category: string;
}

export function ProductDescription({ title, description, price, category }: ProductDescriptionProps) {
  return (
    <View style={styles.container}>

      <Text style={styles.category}>{category}</Text>

      <View style={styles.titlePriceContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.price}>{
          new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(price)
        }</Text>
      </View>

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