import { Ionicons } from '@expo/vector-icons';
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View, ActivityIndicator } from "react-native";

interface HeaderProps {
  imageUrl?: string;
  onBackPress: () => void;
  onSharePress: () => void;
  onFavoritePress: () => void;
  isImageLoading?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  imageUrl,
  onBackPress,
  onSharePress,
  onFavoritePress,
  isImageLoading
}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.imageContainer, styles.placeholderBackground]}>
        {isImageLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#D4685E" />
          </View>
        ) : (
          imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
            />
          )
        )}

        {/* Botón de volver atrás */}
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.rightButtons}>
          {/* ... buttons ... */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200, // Altura fija para el header
    position: "relative", // Para posicionar los botones sobre la imagen
    backgroundColor: "#FBF0EF"
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
  imageContainer: {
    position: 'relative',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1
  },
  placeholderBackground: {
    backgroundColor: '#f5f5f5',
  },
});