import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { MapPressEvent } from 'react-native-maps';
import GoogleMap from "../../components/maps/GoogleMap";

interface MarkerData {
    coordinate: {
        latitude: number;
        longitude: number;
    };
    key: string;
    title: string;
}

export default function GoogleMapScreen() {
    const router = useRouter();
    const [markers, setMarkers] = useState<MarkerData[]>([]);

    const handleMapPress = (event: MapPressEvent) => {
        const newMarker: MarkerData = {
            coordinate: event.nativeEvent.coordinate,
            key: Math.random().toString(),
            title: `Location ${markers.length + 1}`
        };
        
        setMarkers((currentMarkers) => [...currentMarkers, newMarker]);
    };

    return (
        <GoogleMap 
            markersData={markers} 
            onMapPress={handleMapPress}
        />
    );
}
