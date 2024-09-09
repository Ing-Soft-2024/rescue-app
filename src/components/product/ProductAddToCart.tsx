import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface AddToCartProps {
  onAddToCartPress: () => void;
}

export function AddToCart({ onAddToCartPress }: AddToCartProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onAddToCartPress} style={styles.button}>
        <Text style={styles.buttonText}>Añadir al carrito</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007AFF", // Color azul para el botón
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});