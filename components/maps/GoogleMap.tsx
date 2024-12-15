import React, { useEffect, useState, useContext } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, Region, MapPressEvent, Callout } from 'react-native-maps';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { userLocationContext } from '@/src/context/userLocationContext';
import { useRouter } from 'expo-router';
import { commerceConsumer } from '@/src/services/client';

interface MarkerData {
    coordinate: {
        latitude: number;
        longitude: number;
    };
    key: string;
    title: string;
}

interface GoogleMapProps {
    onMapPress: (event: MapPressEvent) => void;
}

export default function GoogleMap({ onMapPress }: GoogleMapProps) {

    const [mapRegion, setMapRegion] = useState<Region>({
        latitude: -34.6055045,
        longitude: -58.3736717,
        latitudeDelta: 0.0522,
        longitudeDelta: 0.0421,
    });

    const [markers, setMarkers] = useState<MarkerData[]>([]);
    const userLocation = useContext(userLocationContext);
    const router = useRouter();

    const goToCommerce = (commerceId: string) => {
        router.push(`/screens/companyScreen?id=${commerceId}`);
    };

    const fetchCommerces = async () => {
        try {
            const commerces = await commerceConsumer.consume('GET');
            const mappedCommerces = commerces.map((commerce: any) => ({
                coordinate: {
                    latitude: parseFloat(commerce.latitude),
                    longitude: parseFloat(commerce.longitude),
                },
                key: commerce.id.toString(),
                title: commerce.name,
            }));

            console.log("Commerces:", mappedCommerces);
            setMarkers(mappedCommerces);
        } catch (error: any) {
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        console.error("Bad Request: Verificar los parámetros enviados.");
                        break;
                    case 401:
                        console.error("Unauthorized: No autorizado.");
                        break;
                    case 404:
                        console.error("Not Found: No se encontraron comercios.");
                        break;
                    case 500:
                        console.error("Server Error: Ocurrió un problema en el servidor.");
                        break;
                    default:
                        console.error("Error desconocido:", error.response.status);
                }
            } else {
                console.error("Error fetching commerces (maps):", error.message);
            }
        }
    };

    // Add this useEffect to fetch commerces when component mounts
    useEffect(() => {
        fetchCommerces();
    }, []);

    // Update map region when user location changes
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

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                region={mapRegion}
                onPress={onMapPress}
            >
                {markers.map((marker) => (
                    <Marker
                        key={marker.key}
                        coordinate={marker.coordinate}
                        title={marker.title}
                    >
                        <Callout onPress={() => goToCommerce(marker.key)}>
                            <View style={styles.calloutContainer}>
                                <Text style={styles.calloutTitle}>{marker.title}</Text>
                                <TouchableOpacity
                                    style={styles.calloutButton}
                                >
                                    <Text style={styles.calloutButtonText}>Ver detalles</Text>
                                </TouchableOpacity>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    calloutContainer: {
        padding: 10,
        width: 200,
    },
    calloutTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    calloutButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 5,
    },
    calloutButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});