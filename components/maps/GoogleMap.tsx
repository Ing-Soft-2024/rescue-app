import React, { useEffect, useState, useContext, useRef } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, Region, MapPressEvent, LatLng } from 'react-native-maps';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { userLocationContext } from '../../src/context/userLocationContext';

interface MarkerData {
    coordinate: {
        latitude: number;
        longitude: number;
    };
    key: string;
}

interface GoogleMapProps {
    markersData: MarkerData[]; // Recibe los marcadores como props
    onMapPress: (event: MapPressEvent) => void; // Recibe la función para manejar el evento de agregar pines
}

export default function GoogleMap({ markersData, onMapPress }: GoogleMapProps) {
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

    const [markers, setMarkers] = useState<MarkerData[]>([]);


    const handleMapPress = (event: MapPressEvent) => {
        const newMarker: MarkerData = {
            coordinate: event.nativeEvent.coordinate,
            key: Math.random().toString(),
        };
        setMarkers((currentMarkers) => [...currentMarkers, newMarker]);
    };


    return (
        <View style={styles.container}>
            {mapRegion ? (
                <MapView
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    showsUserLocation={true}
                    region={mapRegion || defaultRegion}
                    onPress={onMapPress}
                >
                    {userLocation?.location && (
                        <Marker
                            coordinate={{
                                latitude: userLocation?.location ? userLocation.location.coords.latitude : 0.0,
                                longitude: userLocation?.location ? userLocation.location.coords.longitude : 0.0,
                            }}
                        />
                    )}
                    {markersData.map((marker) => (
                        <Marker
                            key={marker.key}
                            coordinate={marker.coordinate}
                            title="Nuevo Pin"
                        />
                    ))}

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
        //flex: 1,
        width: '100%',
        height: '100%',
        //marginTop: 15,
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