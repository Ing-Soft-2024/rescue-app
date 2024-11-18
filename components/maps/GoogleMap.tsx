import React, { useEffect, useState, useContext, useRef } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, Region, MapPressEvent } from 'react-native-maps';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { userLocationContext } from '../../src/context/userLocationContext';
import { commerceDetailsConsumer } from '@/src/services/client';
import { red } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';


interface MarkerData {
    coordinate: {
        latitude: number;
        longitude: number;
    };
    key: string;
    title: string; // nombre del comercio
}

// interface GoogleMapProps {
//     markersData: MarkerData[]; // Recibe los marcadores como props
//     onMapPress: (event: MapPressEvent) => void; // Recibe la función para manejar el evento de agregar pines
// }

interface GoogleMapProps {
    onMapPress: (event: MapPressEvent) => void;
}


export default function GoogleMap({ onMapPress }: GoogleMapProps) {
    const scrollViewRef = useRef<ScrollView>(null);
    const [mapRegion, setMapRegion] = useState<Region | null>(null);
    const [isUserInteracting, setIsUserInteracting] = useState(false);

    const [markers, setMarkers] = useState<MarkerData[]>([]);

    const userLocation = useContext(userLocationContext);

    const [company, setCompany] = React.useState({
        name: '',
        latitude: 0,
        longitude: 0,
    });

    // const fetchCompanyData = async () => {
    //     try {
    //         const companyData = await commerceDetailsConsumer.consume('GET', {
    //             params: { id: 1 }
    //         });
    //         setCompany(companyData);
    //     } catch (error) {
    //         console.error("Error fetching company data:", error);
    //     }
    // };

    // useFocusEffect(
    //     React.useCallback(() => {
    //         fetchCompanyData();
    //     }, []) // Empty dependency array to run only when screen comes into focus
    // );

    const fetchCommerces = async () => {
        try {
            const commerces = await commerceDetailsConsumer.consume('GET', {
                params: { id: 1 } // le paso el id de 1 comercio. 
            });
            const mappedCommerces = commerces.map((commerce: any) => ({
                coordinate: {
                    latitude: commerce.latitude,
                    longitude: commerce.longitude,
                },
                key: commerce.id.toString(),
                title: commerce.name,
            }));
            setMarkers(mappedCommerces); // Actualizo el estado con los marcadores
        } catch (error) {
            console.error('Error fetching commerces:', error);
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
                // Solo actualiza si prevRegion no está definido
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

    // const handleRegionChangeComplete = (region: Region) => {
    //     setMapRegion(region);
    //     setIsUserInteracting(false);
    // };


    // Provide a default region if mapRegion is null
    const defaultRegion = {
        latitude: -34.6055045, // Default latitude
        longitude: -58.3736717, // Default longitude
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
            return prevRegion; // Si prevRegion es null, lo dejamos como está
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
            return prevRegion; // Si prevRegion es null, lo dejamos como está
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
                        region={mapRegion}
                        onPress={onMapPress}
                    //    onRegionChange={handleRegionChange}
                    // onRegionChangeComplete={handleRegionChangeComplete}
                    // onRegionChangeComplete={(region) => setMapRegion(region)}
                    >
                        {userLocation?.location && (
                            <Marker
                                coordinate={{
                                    latitude: userLocation.location.coords.latitude,
                                    longitude: userLocation.location.coords.longitude,
                                }}
                            />
                        )}
                        {markers.map((marker) => (
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
    zoomControls: {
        position: 'absolute',
        bottom: 30,
        right: 10,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 8,
        padding: 5,
    },
    zoomButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
        backgroundColor: "#5d6d7e",
        borderRadius: 20,
    },
    zoomText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
});