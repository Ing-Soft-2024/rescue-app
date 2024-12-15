import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Alert, Platform } from 'react-native';
import { userLocationContext } from '../../src/context/userLocationContext';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import GoogleMap from "../../components/maps/GoogleMap";

interface MarkerData {
    coordinate: Location.LocationObjectCoords;
    key: string;
}

export default function GoogleMapScreen() {
    const router = useRouter();
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [markers, setMarkers] = useState<MarkerData[]>([]);
    const locationWatchId = useRef<number | null>(null);

    useEffect(() => {
        let isMounted = true;

        const setupLocation = async () => {
            try {
                // Request permissions
                let { status: foregroundStatus } = 
                    await Location.requestForegroundPermissionsAsync();
                
                if (foregroundStatus !== 'granted') {
                    Alert.alert(
                        "Permission Denied",
                        "Please enable location services to use this feature"
                    );
                    return;
                }

                // Check if location services are enabled
                let enabled = await Location.hasServicesEnabledAsync();
                if (!enabled) {
                    Alert.alert(
                        "Location Services Disabled",
                        "Please enable location services in your device settings"
                    );
                    return;
                }

                // Get initial location
                const initialLocation = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });
                
                if (isMounted) {
                    setLocation(initialLocation);
                }

                // Start watching position
                locationWatchId.current = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.Balanced,
                        timeInterval: 10000, // Update every 10 seconds
                        distanceInterval: 10, // Update every 10 meters
                    },
                    (newLocation) => {
                        if (isMounted) {
                            setLocation(newLocation);
                        }
                    }
                ).then(subscriber => {
                    return subscriber.remove;
                });

            } catch (error) {
                console.error('Error getting location:', error);
                if (isMounted) {
                    // Set default location
                    setLocation({
                        coords: {
                            latitude: -34.6055045,
                            longitude: -58.3736717,
                            altitude: null,
                            accuracy: null,
                            altitudeAccuracy: null,
                            heading: null,
                            speed: null,
                        },
                        timestamp: Date.now(),
                    } as Location.LocationObject);
                }
            }
        };

        setupLocation();

        // Cleanup function
        return () => {
            isMounted = false;
            if (locationWatchId.current) {
                locationWatchId.current();
            }
        };
    }, []);

    const handleMapPress = (event: any) => {
        const newMarker: MarkerData = {
            coordinate: event.nativeEvent.coordinate,
            key: Math.random().toString(),
        };
        setMarkers((currentMarkers) => [...currentMarkers, newMarker]);
    };

    return (
        <userLocationContext.Provider value={{ 
            location, 
            setLocation: (newLocation) => {
                setLocation(newLocation);
            }
        }}>
            <View style={styles.container}>
                <GoogleMap 
                    markersData={markers} 
                    onMapPress={handleMapPress}
                />
            </View>
        </userLocationContext.Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});