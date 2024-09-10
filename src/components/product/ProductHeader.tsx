import { Ionicons } from '@expo/vector-icons';
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  imageUrl: string;
  onBackPress?: () => void;
  onSharePress?: () => void;
  onFavoritePress?: () => void;
}

export function Header({
  imageUrl,
  onBackPress,
  onSharePress,
  onFavoritePress,
}: HeaderProps) {
  return (
    <View style={styles.container}>
      {/* Imagen de fondo */}
      <Image source={{ uri: imageUrl }} style={styles.image} />

      {/* Botón de volver atrás */}
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      {/* Botones de compartir y agregar a favoritos */}
      <View style={styles.rightButtons}>
        <TouchableOpacity onPress={onSharePress} style={styles.iconButton}>
          <Ionicons name="share-social" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onFavoritePress} style={styles.iconButton}>
          <Ionicons name="heart" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200, // Altura fija para el header
    position: "relative", // Para posicionar los botones sobre la imagen
  },
  image: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 8,
    borderRadius: 20,
  },
  rightButtons: {
    position: "absolute",
    top: 20,
    right: 10,
    flexDirection: "row",
  },
  iconButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
});