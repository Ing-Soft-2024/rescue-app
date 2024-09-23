import React, { useEffect, useState, useContext, useRef } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, Region } from 'react-native-maps';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { userLocationContext } from '../../src/context/userLocationContext';

export default function GoogleMap() {
    const scrollViewRef = useRef<ScrollView>(null);
    const [mapRegion, setMapRegion] = useState<Region | null>(null);

    const userLocation = useContext(userLocationContext);

    useEffect(() => {
        if (userLocation?.location) {
            setMapRegion({
                latitude: userLocation.location.coords.latitude,
                longitude: userLocation.location.coords.longitude,
                latitudeDelta: 0.0522,
                longitudeDelta: 0.0421,
            });
        }
    }, [userLocation?.location]);

    // Provide a default region if mapRegion is null
    const defaultRegion = {
        latitude: 337.785834, // Default latitude
        longitude: -122.406417, // Default longitude
        latitudeDelta: 0.0522,
        longitudeDelta: 0.0421,
    };

    return (
        <View style={styles.container}>
            {mapRegion ? (
                <MapView
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    showsUserLocation={true}
                    region={mapRegion || defaultRegion}
                >
                    {userLocation?.location && (
                    <Marker
                        coordinate={{
                            latitude: userLocation?.location ? userLocation.location.coords.latitude : 0.0,
                            longitude: userLocation?.location ? userLocation.location.coords.longitude : 0.0,
                        }}
                    />
                    )}
                </MapView>
            ) : (
                // Optionally show a loading spinner or placeholder
                <View style={styles.loadingContainer}>
                    <Text>Loading map...</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 15,
        borderRadius: 8,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});