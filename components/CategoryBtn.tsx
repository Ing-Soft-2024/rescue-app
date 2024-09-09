import {
  Text,
  View,
  StyleSheet,
  ColorValue,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useRef } from "react";

export interface CategoryBtnProps {
  title: string;
  //tab: ;
  scrollView: ScrollView;
}

export function CategoryBtn({ title, tab, scrollView }: CategoryBtnProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const targetRef = useRef<View>(null);

  const scrollToElement = () => {
    if (targetRef.current && scrollViewRef.current) {
      targetRef.current.measure((x, y, width, height, pageX, pageY) => {
        scrollViewRef.current.scrollTo({ y: pageY, animated: true });
      });
    }
  };

  return (
    <View style={styles.box}>
      <Pressable onPress={scrollToElement}>
        <Text style={styles.text}>{title}</Text>
      </Pressable>
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
