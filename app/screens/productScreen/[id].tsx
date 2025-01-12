import { AddToCart } from '@/src/components/product/ProductAddToCart';
import { ProductDescription } from '@/src/components/product/ProductDescription';
import { Header } from '@/src/components/product/ProductHeader';
import { useOrders } from "@/src/context/ordersContext";
import { productDetailsConsumer } from '@/src/services/client';
import StorageController from '@/src/services/storage/controller/storage.controller';
import { ProductType } from '@/src/types/product.type';
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { checkInternetConnection, NO_INTERNET_MESSAGE } from '@/src/utils/networkUtils';

// export type ProductType = {
//   title: string;
//   description: string;
//   price: number;
//   category: string;
//   imageUrl: string;
//   productId: number;
// };

export default function ProductLayout() {

  const router = useRouter();
  const params = useLocalSearchParams();
  const [product, setProduct] = React.useState<ProductType>({} as ProductType);
  const [isLoading, setIsLoading] = React.useState(true);

  const {
    addToCart,
    getProductQuantityInCart,
    orderQR,
    cart
  } = useOrders();
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [quantityInCart, setQuantityInCart] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      if (!params.id) return;

      const fetchProduct = async () => {
        setIsLoading(true);
        
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
          Alert.alert('Error de Conexión', NO_INTERNET_MESSAGE);
          setIsLoading(false);
          return;
        }

        try {
          const product = await productDetailsConsumer.consume('GET', {
            params: { id: Number(params.id) }
          });

          if (!product.image) return product;
          
          const productWithImage = await StorageController.download(product.image)
            .then(image => ({
              ...product,
              image
            }))
            .catch(() => product);

          setProduct(productWithImage);
        } catch (error) {
          if (!await checkInternetConnection()) {
            Alert.alert('Error de Conexión', NO_INTERNET_MESSAGE);
          } else {
            Alert.alert('Error', 'No se pudo cargar el producto');
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchProduct();
    }, [params.id])
  );
  

  const canAddToCart = () => {
    // First check if there's an active order
    if (orderQR) return false;
    
    // Then check product stock
    if (product.stock <= 0) return false;
    
    // Finally check if product is already in cart
    const productInCart = getProductQuantityInCart(Number(params.id));
    return productInCart === 0;
  };

  // Add a helper function to determine the banner message
  const getBannerMessage = () => {
    if (product.stock <= 0) {
      return "Sin stock";
    }
    return "Product already in cart";
  };

  return (
    <View style={styles.container}>
        { isLoading &&
            <View style={{
                flex: 1,
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                backgroundColor: "#3339",
                zIndex: 1200,
            }}>
                <ActivityIndicator size="small" color="white" />
            </View>
        }
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header con imagen y botones */}
        <Header
          imageUrl={product.image}
          onBackPress={() => router.back()}
          onSharePress={() => console.log("Share pressed")}
          onFavoritePress={() => console.log("Favorite pressed")}
        />

        <TouchableOpacity 
          style={styles.commerceButton}
          onPress={() => router.push({
            pathname: '/screens/companyScreen',
            params: { id: product.businessId }
          })}
        >
          <Text style={styles.commerceButtonText}>
            Ver Comercio
          </Text>
        </TouchableOpacity>

        {/* Detalles del producto */}
        <ProductDescription
          stock={product.stock}
          category={product.categories?.[0]?.name}
          description={product.description}
          title={product.name}
          price={product.price}
        />

        {/* Banner inferior para agregar al carrito */}
        {canAddToCart() ? (
            <AddToCart 
              onAddToCartPress={() => {
                const currentQuantity = getProductQuantityInCart(Number(params.id));
                if (currentQuantity === 0) {
                  addToCart({ 
                    product: {
                      ...product,
                      commerceId: product.businessId
                    }, 
                    quantity: 1 
                  });
                  setQuantityInCart(1);
                  setShowSuccessCard(true);
                  setTimeout(() => setShowSuccessCard(false), 3000);
                }
              }}
            />
        ) : (
            <View style={styles.outOfStockCard}>
              <Text style={styles.outOfStockText}>{getBannerMessage()}</Text>
            </View>
        )}
      </ScrollView>
      {showSuccessCard && (
        <View style={styles.successCard}>
          <Text style={styles.successText}>Added to cart successfully!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-start", // Alinear todo al principio (arriba)
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start', // Alinear todo al principio (arriba)
    paddingBottom: 80, // Espacio inferior para el botón
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 20,
  },
  link: {
    color: '#D4685E',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  successCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 5,
    right: 0,
    backgroundColor: '#2bc253',
    padding: 10,
    alignItems: 'center',
  },
  successText: {
    color: '#fff',
    fontSize: 16,
  },
  outOfStockCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ff4444',
    padding: 10,
    alignItems: 'center',
    zIndex: 4,
  },
  outOfStockText: {
    color: '#fff',
    fontSize: 16,
  },
  commerceButton: {
    backgroundColor: '#D4685E',
    padding: 10,
    margin: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  commerceButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
