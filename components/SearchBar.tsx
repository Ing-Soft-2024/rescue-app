import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface SearchBarProps {
  val?: string;
  onChange?: (text: string) => any;
}

export function SearchBar({ val, onChange }: SearchBarProps) {
  return (
    <View style={styles.input}>
      <AntDesign name="search1" size={16} color="#D4685E" />
      <TextInput
        value={val}
        style={{
          flex: 1,
          fontSize: 16,
        }}
        placeholder="Type Here"
        onChangeText={(newText) => onChange?.(newText)}
      ></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -6,
  },

  input: {
    flexDirection: "row",
    height: 40,
    width: "100%",
    margin: 12,
    // borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    padding: 10,
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fafafa",
    borderRadius: 30,
    overflow: "hidden",
    fontSize: 20,
  },
});


