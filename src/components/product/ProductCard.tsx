//@ts-ignore
import { colors, globalStyles } from "@/src/global-style";
import { ProductType } from "@/src/types/product.type";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

// import { colors, globalStyles } from "@src/global-style";
// import { useCommerceImage } from "@hooks/useCommerceImage";
// import { ObjectToBase64 } from "@utils/base64";
// import { Chip } from "@interface/chip";


export const ProductCard = ({ product }: { product: ProductType }) => {
    let router = useRouter();

    return (
        <Pressable
            onPress={() => {
                // router.push(`/product/${encodedProduct}`);
            }}
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
                <Image src={""} style={{ ...StyleSheet.absoluteFillObject }} />
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
                    color: colors.neutral[300],
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