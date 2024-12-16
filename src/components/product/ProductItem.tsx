//@ts-ignore
import { useOrders } from "@/src/context/ordersContext";
import { colors, globalStyles } from "@/src/global-style";
import StorageController from "@/src/services/storage/controller/storage.controller";
import { ProductType } from "@/src/types/product.type";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";

// import { colors, globalStyles } from "@src/global-style";
// import { useCommerceImage } from "@hooks/useCommerceImage";
// import { ObjectToBase64 } from "@utils/base64";
// import { Chip } from "@interface/chip";

interface ProductItemProps {
    product: ProductType;
    onRemove?: () => void;
}

export const ProductItem = ({ product, onRemove }: ProductItemProps) => {
    const router = useRouter();
    const { getProductQuantityInCart } = useOrders();
    const quantity = getProductQuantityInCart(product.id);

    const [image, setImage] = React.useState<string>("https://picsum.photos/200");
    const [imageLoading, setImageLoading] = React.useState<boolean>(true);
    useFocusEffect(
        React.useCallback(() => {
            if (!product.image) return;
            StorageController.download(product.image)
                .then(setImage)
                .catch(() => setImage("https://picsum.photos/200"))
                .then(() => setImageLoading(false));
        }, [])
    );

    return (
        <Pressable
            onPress={() => router.push(`/screens/productScreen/${product.id}`)}
            style={{
                // flex: 1,
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
                position: "relative"
            }}>
                {imageLoading && (
                    <View style={StyleSheet.absoluteFillObject}>
                        <ActivityIndicator size="small" color="#D4685E" />
                    </View>
                )}

                <Image source={{ uri: image }} style={{ ...StyleSheet.absoluteFillObject }} />
                {/* <Image 
                    source={{ uri: image }} 
                    style={{ ...StyleSheet.absoluteFillObject }} 
                    onLoad={() => setImageLoading(false)}
                /> */}
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
                        // alignItems: "center",
                        gap: 8
                    }}>
                        <Text style={[globalStyles.text.lg, globalStyles.text.semiBold]}>{product.name}</Text>

                        {/* TODO: Make discount visible only when available. */}
                        {/* <Chip title="-15%" /> */}
                    </View>
                </View>

                <View style={{
                    flexDirection: "row",
                    // alignItems: "center",
                    gap: 4
                }}>
                    <Text style={[globalStyles.text.lg, globalStyles.text.semiBold]}>{
                               new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(product.price)
                    }</Text>
                    {/* <Text style={[globalStyles.text.sm, globalStyles.text.medium,
                    {
                        color: "#D4685E",
                        textDecorationLine: "line-through"
                    }]}>
                        {
                            new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(product.price)
                        }
                    </Text> */}
                </View>

                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flex: 1,
                }}>
                    {/* Buttons */}
                    {/* <Pressable
                        style={styles.actionButtons}
                        onPress={() => console.log("Add to cart")}
                    >
                        <MaterialIcons name="add" size={24} color="#D4685E" />
                    </Pressable> */}
                    {/* <Text>
                       cantidad:  {quantity}
                    </Text> */}

                    <Pressable
                        style={styles.actionButtons}
                        onPress={onRemove}
                    >
                        <Text style={styles.actionButtontext}>Eliminar</Text>
                        <MaterialIcons name="delete" size={24} color="#FFF" />
                    </Pressable>
                </View>
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
})