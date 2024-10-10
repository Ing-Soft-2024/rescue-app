//@ts-ignore
import { colors, globalStyles } from "@/src/global-style";
import StorageController from "@/src/services/storage/controller/storage.controller";
import { ProductType } from "@/src/types/product.type";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";

// import { colors, globalStyles } from "@src/global-style";
// import { useCommerceImage } from "@hooks/useCommerceImage";
// import { ObjectToBase64 } from "@utils/base64";
// import { Chip } from "@interface/chip";


export const ProductCard = ({ product }: { product: ProductType }) => {
    let router = useRouter();

    const [image, setImage] = React.useState<string>("https://picsum.photos/200");
    const [imageLoading, setImageLoading] = React.useState<boolean>(true);
    React.useEffect(() => {
        if (!product.image) return;
        StorageController.download(product.image)
            .then(setImage)
            .then(() => setImageLoading(false));
    }, []);

    return (
        <Pressable
            onPress={() => router.push('/(screens)/productScreen')}
            style={{
                flexDirection: "column",
                gap: 12,

                width: 207,
                height: "auto"
            }}>
            <View style={{
                backgroundColor: colors.neutral[100],
                width: "100%",
                height: 120,
                borderRadius: 6,
                overflow: "hidden",
            }}>
                <View style={StyleSheet.absoluteFillObject} >
                    <ActivityIndicator size="small" color="#D4685E" />
                </View>
                <Image source={{ uri: image }} style={{ ...StyleSheet.absoluteFillObject }} />
            </View>

            <View style={{
                flexDirection: "column",
                gap: 8
            }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8
                }}>
                    <Text style={[globalStyles.text.md, globalStyles.text.semiBold]}>{product.name}</Text>

                    {/* TODO: Make discount visible only when available. */}
                    {/* <Chip title="-15%" /> */}
                </View>

                <Text style={[globalStyles.text.sm, globalStyles.text.medium]}>
                    {product.description}
                </Text>
            </View>

            <View style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4
            }}>
                {/* TODO: Same here. */}
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
        </Pressable>
    );
}