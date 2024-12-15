import React, { useEffect, useState, useContext } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, Region, MapPressEvent, Callout } from 'react-native-maps';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { userLocationContext } from '@/src/context/userLocationContext';
import { router, useRouter } from 'expo-router';
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
    markersData: MarkerData[];
    onMapPress: (event: MapPressEvent) => void;
}

export default function GoogleMap({ markersData, onMapPress }: GoogleMapProps) {
    const { location } = useContext(userLocationContext);
    const router = useRouter();
    const [isUserInteracting, setIsUserInteracting] = useState(false);
    const [markers, setMarkers] = useState<MarkerData[]>([]);

    const [mapRegion, setMapRegion] = useState<Region>({
        latitude: location?.coords.latitude || -34.6055045,
        longitude: location?.coords.longitude || -58.3736717,
        latitudeDelta: 0.0522,
        longitudeDelta: 0.0421,
    });


    const goToCommerce = (commerceId: string) => {
        router.push(`/screens/companyScreen?id=${commerceId}`);
    };
    
    const handleZoomIn = () => {
        setMapRegion((prevRegion) => {
            if (prevRegion) {
                return {
                    ...prevRegion,
                    latitudeDelta: prevRegion.latitudeDelta / 2,
                    longitudeDelta: prevRegion.longitudeDelta / 2,
                };
            }
            return prevRegion;
        });
    };
    
    const handleZoomOut = () => {
        setMapRegion((prevRegion) => {
            if (prevRegion) {
                return {
                    ...prevRegion,
                    latitudeDelta: prevRegion.latitudeDelta * 2,
                    longitudeDelta: prevRegion.longitudeDelta * 2,
                };
            }
            return prevRegion;
        });
    };

    const handleMarkerPress = (commerceId: string) => {
        router.push(`/screens/companyScreen?id=${commerceId}`);
    };

    const fetchCommerces = async () => {
        try {
            const commerces = await commerceConsumer.consume('GET');
            const mappedCommerces = commerces.map((commerce: any) => ({
                coordinate: {
                    latitude: parseFloat(commerce.latitude),
                    longitude: parseFloat(commerce.longitude)
                },
                key: commerce.id.toString(),
                title: commerce.name
            }));
            setMarkers(mappedCommerces);
        } catch (error) {
            console.error('Error fetching commerces:', error);
        }
    };

    useEffect(() => {
        fetchCommerces();
    }, []);

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

            <View style={styles.zoomControls}>
                <TouchableOpacity onPress={handleZoomIn} style={styles.zoomButton}>
                    <Text style={styles.zoomText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleZoomOut} style={styles.zoomButton}>
                    <Text style={styles.zoomText}>-</Text>
                </TouchableOpacity>
            </View>

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

    zoomControls: {
        position: "absolute",
        bottom: 30,
        right: 10,
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: 8,
        padding: 5,
    },
    zoomButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 5,
        backgroundColor: "#5d6d7e",
        borderRadius: 20,
    },
    zoomText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },
});