//@ts-ignore
import { useOrders } from "@/src/context/ordersContext";
import { colors, globalStyles } from "@/src/global-style";
import StorageController from "@/src/services/storage/controller/storage.controller";
import { ProductType } from "@/src/types/product.type";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import ImageCacheService from '@/src/services/cache/imageCache';

interface ProductItemProps {
    product: ProductType;
    onRemove?: () => void;
    onUpdateQuantity?: (newQuantity: number) => void;
    initialQuantity?: number;
}

export const ProductItem = ({ product, onRemove, onUpdateQuantity, initialQuantity }: ProductItemProps) => {
    const router = useRouter();
    const { orderQR, getProductQuantityInCart } = useOrders();
    const quantity = initialQuantity ?? getProductQuantityInCart(product.id);

    const [image, setImage] = React.useState<string>("");
    const [imageLoading, setImageLoading] = React.useState<boolean>(true);

    useFocusEffect(
        React.useCallback(() => {
            setImageLoading(true);
            if (!product.image) {
                setImage("https://picsum.photos/200");
                setImageLoading(false);
                return;
            }

            const loadImage = async () => {
                try {
                    const cachedImage = await ImageCacheService.getImage(product.id, product.image);
                    setImage(cachedImage);
                } catch (error) {
                    console.log('Error loading image:', error);
                    setImage("https://picsum.photos/200");
                } finally {
                    setImageLoading(false);
                }
            };

            loadImage();
        }, [product.id, product.image])
    );

    const handleQuantityUpdate = (newQuantity: number) => {
        if (orderQR) return;
        if (newQuantity > product.stock) {
            Alert.alert('Error', 'No hay suficiente stock disponible');
            return;
        }
        onUpdateQuantity?.(newQuantity);
    };

    return (
        <Pressable
            onPress={() => router.push(`/screens/productScreen/${product.id}`)}
            style={{
                flexDirection: "row",
                gap: 12,
                width: "100%",
                height: "auto",
                backgroundColor: "#fff",
                borderRadius: 6,
                padding: 2,
            }}>
            <View style={{
                backgroundColor: colors.neutral[100],
                width: 90,
                height: 90,
                borderRadius: 6,
                overflow: "hidden",
                position: "relative",
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {imageLoading ? (
                    <ActivityIndicator size="small" color="#D4685E" />
                ) : image ? (
                    <Image 
                        source={{ uri: image }} 
                        style={StyleSheet.absoluteFillObject}
                    />
                ) : null}
                {quantity > 0 && (
                    <View style={styles.quantityBadge}>
                        <Text style={styles.quantityText}>{quantity}</Text>
                    </View>
                )}
            </View>

            <View>
                <View style={{
                    flexDirection: "row",
                    gap: 20,
                    justifyContent: "space-between",
                    flex: 1,
                    width: "100%"
                }}>
                    <View style={{
                        flexDirection: "row",
                        gap: 8
                    }}>
                        <Text style={[globalStyles.text.lg, globalStyles.text.semiBold]}>{product.name}</Text>
                    </View>
                </View>

                <View style={{
                    flexDirection: "row",
                    gap: 4
                }}>
                    <Text style={[globalStyles.text.lg, globalStyles.text.semiBold]}>{
                        new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(product.price)
                    }</Text>
                </View>

                <View style={styles.quantityContainer}>
                    <TouchableOpacity 
                        style={[
                            styles.quantityButton,
                            (quantity <= 1 || Boolean(orderQR)) && { opacity: 0.5 }
                        ]}
                        onPress={() => handleQuantityUpdate(quantity - 1)}
                        disabled={quantity <= 1 || Boolean(orderQR)}
                    >
                        <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    
                    <Text style={styles.quantityText}>{quantity}</Text>
                    
                    <TouchableOpacity 
                        style={[
                            styles.quantityButton,
                            (quantity >= product.stock || Boolean(orderQR)) && { opacity: 0.5 }
                        ]}
                        onPress={() => handleQuantityUpdate(quantity + 1)}
                        disabled={quantity >= product.stock || Boolean(orderQR)}
                    >
                        <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                </View>

                <Pressable
                    style={[
                        styles.actionButtons,
                        Boolean(orderQR) && { opacity: 0.5 }
                    ]}
                    onPress={onRemove}
                    disabled={Boolean(orderQR)}
                >
                    <Text style={styles.actionButtontext}>Eliminar</Text>
                    <MaterialIcons name="delete" size={24} color="#FFF" />
                </Pressable>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    actionButtons: {
        flexDirection: "row",
        gap: 4,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#D4685E",
        padding: 4,
        borderRadius: 6,
        width: 100,
        height: 30
    },
    actionButtontext: {
        color: "#FFF",
        fontSize: 12,
        fontWeight: "bold",
    },
    quantityBadge: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: '#D4685E',
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
    },
    quantityText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginVertical: 10,
    },
    quantityButton: {
        backgroundColor: '#D4685E',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.5,
    }
});