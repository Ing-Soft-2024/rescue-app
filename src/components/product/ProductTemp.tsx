import { Text, View, StyleSheet, ColorValue } from "react-native";

export interface ProductTempProps {
  id: string;
  //img: Image;
  title: string;
  color: ColorValue;
}

export function ProductTemp({ id, title, color }: ProductTempProps) {
  return (
    <View style={[styles.box, { backgroundColor: color }]}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 10,
  },
  box: {
    height: 180,
    width: 100,
    backgroundColor: "#0f0",
  },
});
