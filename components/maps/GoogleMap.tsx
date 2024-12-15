import React, { useEffect, useState, useContext, useRef } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, Region, MapPressEvent } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { userLocationContext } from '../../src/context/userLocationContext';
import { commerceConsumer } from '@/src/services/client';

interface MarkerData {
    coordinate: {
        latitude: number;
        longitude: number;
    };
    key: string;
}

interface GoogleMapProps {
    markersData: MarkerData[];
    onMapPress: (event: MapPressEvent) => void;
}

export default function GoogleMap({ markersData, onMapPress }: GoogleMapProps) {
    const { location } = useContext(userLocationContext);

    const initialRegion: Region = {
        latitude: location?.coords.latitude || -34.6037,
        longitude: location?.coords.longitude || -58.3816,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={initialRegion}
                showsUserLocation={true}
                onPress={onMapPress}
            >
                {markersData.map((marker) => (
                    <Marker
                        key={marker.key}
                        coordinate={marker.coordinate}
                    />
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
        width: "100%",
        height: "100%",
    },
});
