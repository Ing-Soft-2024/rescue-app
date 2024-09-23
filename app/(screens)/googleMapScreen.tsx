import React, {useEffect, useState, useContext, useRef} from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, Region } from 'react-native-maps';
import { Platform, Text, StyleSheet, View, ScrollView } from 'react-native';
import { userLocationContext } from '../../src/context/userLocationContext';


export default function GoogleMapScreen() {
    const scrollViewRef = useRef<ScrollView>(null);
    const [mapRegion, setmapRegion] = useState<Region | null>(null);

    //const {location, setLocation} = useContext(userLocationContext);
    const userLocation = useContext(userLocationContext);

    // Muestra el circulito de la ubicación actual
    useEffect(() => {
        if (userLocation?.location) {
            setmapRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0522,
                longitudeDelta: 0.0421,
            });
        }
    },[userLocation?.location]);

    return (
        <View style={styles.container}>
            <MapView style={styles.map} 
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            region={mapRegion}
            >
                
                <marker />
            </MapView>
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
});

