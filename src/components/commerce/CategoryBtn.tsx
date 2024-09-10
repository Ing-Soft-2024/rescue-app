import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

export interface CategoryBtnProps {
  title: string;
  tab: React.RefObject<View>;
  scrollView: React.RefObject<ScrollView>;
}

export function CategoryBtn({ title, tab, scrollView }: CategoryBtnProps) {
  const scrollToComponent = () => {
    if (scrollView.current && tab.current) {
      tab.current.measureLayout(
        scrollView.current.getInnerViewNode(),
        (x, y) => {
          scrollView.current?.scrollTo({ y, animated: true });
        },
        () => {
          console.error("Measurement error");
        }
      );
    }
  };

  return (
    <View style={styles.box}>
      <Pressable onPress={scrollToComponent}>
        <Text style={styles.text}>{title}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
  },
  box: {
    // height: 20,
    // width: 30,
    // backgroundColor: "#0f0",
    padding: 10,
    borderBottomColor: "#000",
    borderBottomWidth: 1,
  },
});
