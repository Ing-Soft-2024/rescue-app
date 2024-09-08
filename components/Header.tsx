import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface HeaderProps {
  onPressButton: () => void; 
  screenName: string;       
}

export function HeaderComp ({ onPressButton, screenName }: HeaderProps) {
  return (
    <View style={styles.headerContainer}>
      <Button title="Back" onPress={onPressButton} />
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
});

