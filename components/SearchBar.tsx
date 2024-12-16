import React from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  onSearch: (text: string) => void;
  onRefresh: () => void;
  value: string;
}

export const SearchBar = ({ onSearch, onRefresh, value }: SearchBarProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Buscar productos..."
          placeholderTextColor="#666"
          value={value}
          onChangeText={onSearch}
        />
      </View>
      <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
        <Ionicons name="refresh" size={24} color="#D4685E" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    marginRight: 8,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#f5f5f5',
  },
  refreshButton: {
    padding: 5,
  },
});


