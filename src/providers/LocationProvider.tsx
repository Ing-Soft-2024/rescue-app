import React, { useEffect } from 'react';
import * as Location from 'expo-location';
import { userLocationContext } from '../context/userLocationContext';
import { Alert } from 'react-native';

export function LocationProvider({ children }: { children: React.ReactNode }) {
    const [location, setLocation] = React.useState<Location.LocationObject | null>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    "Permission Required",
                    "Please enable location services to see nearby products"
                );
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);

            // Set up location updates
            await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Balanced,
                    timeInterval: 5000,
                    distanceInterval: 10
                },
                (newLocation) => {
                    setLocation(newLocation);
                }
            );
        })();
    }, []);

    return (
        <userLocationContext.Provider value={{ location, setLocation }}>
            {children}
        </userLocationContext.Provider>
    );
} 