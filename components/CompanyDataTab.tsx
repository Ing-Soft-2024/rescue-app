import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CompanyDataTabProps {
  companyName: string;
  location: string;
  rating: number;  // Rating numérico entre 0 y 5
}

export function CompanyDataTab ({ companyName, location, rating }: CompanyDataTabProps) {
  //  array de estrellas con base en el rating
  const stars = Array.from({ length: 5 }, (_, index) => index < rating);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
       
        <Text style={styles.companyName}>{companyName}</Text>

        <Text style={styles.location}>{location}</Text>
      </View>

      <View style={styles.ratingContainer}>
        {/* Rating con estrellas */}
        <View style={styles.starsContainer}>
          {stars.map((filled, index) => (
            <Text key={index} style={[styles.star, filled && styles.filledStar]}>
              ★
            </Text>
          ))}
        </View>
        
        {/* Valor numérico del rating */}
        <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Alinear elementos horizontalmente
    justifyContent: 'space-between', 
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 3,
    margin: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center', 
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: '#555',
  },
  ratingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  star: {
    fontSize: 20,
    color: 'white',
    marginRight: 2,
  },
  filledStar: {
    color: 'black',
  },
  ratingValue: {
    fontSize: 16,
    color: '#333',
  },
});

