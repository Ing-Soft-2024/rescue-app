import React, { useEffect, useState, useContext, useRef } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, Region, MapPressEvent } from 'react-native-maps';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { userLocationContext } from '../../src/context/userLocationContext';
import { commerceConsumer } from '@/src/services/client'; // Traemos toda la lista de comercios

interface MarkerData {
    coordinate: {
        latitude: number;
        longitude: number;
    };
    key: string;
    title: string; // Nombre del comercio
}

interface GoogleMapProps {
    onMapPress: (event: MapPressEvent) => void;
}

export default function GoogleMap({ onMapPress }: GoogleMapProps) {

    const [mapRegion, setMapRegion] = useState<Region | null>(null);
    const [isUserInteracting, setIsUserInteracting] = useState(false);

    const [markers, setMarkers] = useState<MarkerData[]>([]);

    const userLocation = useContext(userLocationContext);

    const fetchCommerces = async () => {
        try {
            const commerces = await commerceConsumer.consume('GET');

            const mappedCommerces = commerces.map((commerce: any) => ({
                coordinate: {
                    latitude: commerce.latitude,
                    longitude: commerce.longitude,
                },
                key: commerce.id.toString(),
                title: commerce.name,
            }));
            setMarkers(mappedCommerces);
        } catch (error) {
            console.error("Error fetching commerces:", error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchCommerces();
        }, [])
    );

    useEffect(() => {
        if (!isUserInteracting && userLocation?.location) {
            setMapRegion((prevRegion) => {
                if (!prevRegion) {
                    return {
                        latitude: userLocation.location!.coords.latitude,
                        longitude: userLocation.location!.coords.longitude,
                        latitudeDelta: 0.0522,
                        longitudeDelta: 0.0421,
                    };
                }
                return prevRegion;
            });
        }
    }, [userLocation?.location, isUserInteracting]);

    const handleRegionChange = () => {
        setIsUserInteracting(true);
    };

    const defaultRegion = {
        latitude: -34.6055045,
        longitude: -58.3736717,
        latitudeDelta: 0.0522,
        longitudeDelta: 0.0421,
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

    return (
        <View style={styles.container}>
            {mapRegion ? (
                <>
                    <MapView
                        style={styles.map}
                        provider={PROVIDER_GOOGLE}
                        showsUserLocation={true}
                        initialRegion={mapRegion}
                        region={mapRegion || defaultRegion}
                        onPress={onMapPress}
                    >
                        {/* {userLocation?.location && (
                            <Marker
                                coordinate={{
                                    latitude: userLocation.location.coords.latitude,
                                    longitude: userLocation.location.coords.longitude,
                                }}
                            />
                        )} */}

                        {markers.map((marker) => ( // Pines de los comercios
                            <Marker
                                key={marker.key}
                                coordinate={marker.coordinate}
                                title={marker.title}
                            />
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
                </>
            ) : (
                <View style={styles.loadingContainer}>
                    <Text>Loading map...</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        borderRadius: 8,
    },
    map: {
        width: "100%",
        height: "100%",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
