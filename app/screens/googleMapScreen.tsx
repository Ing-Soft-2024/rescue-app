import React, { useEffect, useState, useContext, useRef } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { userLocationContext } from '../../src/context/userLocationContext';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import GoogleMap from "../../components/maps/GoogleMap"

interface MarkerData {
    coordinate: Location.LocationObjectCoords;
    key: string;
}

export default function GoogleMapScreen() {
    const router = useRouter();

    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [markers, setMarkers] = useState<MarkerData[]>([]);

    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg("Permission to access location was denied");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    const handleMapPress = (event: any) => {
        // Crea un nuevo pin basado en las coordenadas del evento
        const newMarker: MarkerData = {
            coordinate: event.nativeEvent.coordinate,
            key: Math.random().toString(),
        };
        
        setMarkers((currentMarkers) => [...currentMarkers, newMarker]);
    };

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    const onPressBack = () => {
        router.back();
    };

    return (
        <userLocationContext.Provider value={{ location, setLocation }}>
            <GoogleMap markersData={markers} onMapPress={handleMapPress}/>
        </userLocationContext.Provider>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        alignSelf: 'flex-start',
        marginLeft: 10,
        marginTop: 10,
    }
});