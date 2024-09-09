import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  onBackPress: () => void;
  screenName: string;       
}

export default function HeaderComp ({ onBackPress, screenName }: HeaderProps) {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.headerText}> { screenName } </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    // backgroundColor: '#6200EE',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,  // El texto toma todo el espacio disponible
    textAlign: 'center', 
    marginRight: 50, 
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 8,
    borderRadius: 20,
  },
});

