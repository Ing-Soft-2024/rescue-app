//@ts-ignore
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


export const ProductItem = ({ product, onRemove }: { product: ProductType, onRemove: () => void  }) => {
    let router = useRouter();

    const [image, setImage] = React.useState<string>("https://picsum.photos/200");
    const [imageLoading, setImageLoading] = React.useState<boolean>(true);
    useFocusEffect(
        React.useCallback(() => {
            console.log(product.image);
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
            }}>
                <View style={StyleSheet.absoluteFillObject} >
                    <ActivityIndicator size="small" color="#D4685E" />
                </View>
                <Image source={{ uri: image }} style={{ ...StyleSheet.absoluteFillObject }} />
            </View>

            <View>
                <View style={{
                    flexDirection: "row",
                    gap: 20,
                    justifyContent: "space-between",
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
                        new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(product.price * 0.85)
                    }</Text>
                    <Text style={[globalStyles.text.sm, globalStyles.text.medium,
                    {
                        color: "#D4685E",
                        textDecorationLine: "line-through"
                    }]}>
                        {
                            new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(product.price)
                        }
                    </Text>
                </View>

                <View style={{
                    flexDirection: "row",

                }}>
                    {/* Buttons */}
                    <Pressable
                        style={styles.actionButtons}
                        onPress={() => console.log("Add to cart")}
                    >
                        <MaterialIcons name="add" size={24} color="#D4685E" />
                    </Pressable>

                    <Pressable
                        style={styles.actionButtons}
                        onPress={onRemove}
                    >
                        <MaterialIcons name="remove" size={24} color="#D4685E" />
                    </Pressable>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    actionButtons: {

    }
})