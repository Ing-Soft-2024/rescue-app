// import React, {useEffect, useState, useContext, useRef} from 'react';
// import MapView, { PROVIDER_GOOGLE, Marker, Region } from 'react-native-maps';
// import { Platform, Text, StyleSheet, View, ScrollView } from 'react-native';
// import { userLocationContext } from '../../src/context/userLocationContext';


// export default function GoogleMapScreen() {
//     const scrollViewRef = useRef<ScrollView>(null);
//     const [mapRegion, setmapRegion] = useState<Region | null>(null);

//     //const {location, setLocation} = useContext(userLocationContext);
//     const userLocation = useContext(userLocationContext);

//     // Muestra el circulito de la ubicación actual
//     useEffect(() => {
//         if (userLocation?.location) {
//             setmapRegion({
//                 latitude: location.coords.latitude,
//                 longitude: location.coords.longitude,
//                 latitudeDelta: 0.0522,
//                 longitudeDelta: 0.0421,
//             });
//         }
//     },[userLocation?.location]);

//     return (
//         <View style={styles.container}>
//             <MapView style={styles.map} 
//             provider={PROVIDER_GOOGLE}
//             showsUserLocation={true}
//             region={mapRegion}
//             >

//                 <marker />
//             </MapView>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         marginTop: 15,
//         borderRadius: 8,
//     },
//     map: {
//         width: '100%',
//         height: '100%',
//     },
// });


import React, { useEffect, useState, useContext, useRef } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, Region } from 'react-native-maps';
import { ScrollView, StyleSheet, View } from 'react-native';
import { userLocationContext } from '../../src/context/userLocationContext';

export default function GoogleMapScreen() {
    const scrollViewRef = useRef<ScrollView>(null);
    const [mapRegion, setMapRegion] = useState<Region | null>(null);

    const userLocation = useContext(userLocationContext);

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

    // Provide a default region if mapRegion is null
    const defaultRegion = {
        latitude: 37.78825, // Default latitude
        longitude: -122.4324, // Default longitude
        latitudeDelta: 0.0522,
        longitudeDelta: 0.0421,
    };

    return (
        <View style={styles.container}>
            {mapRegion ? (
                <MapView
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    showsUserLocation={true}
                    region={mapRegion}
                >
                    <Marker
                        coordinate={{
                            latitude: userLocation?.location ? userLocation.location.coords.latitude : 0.0,
                            longitude: userLocation?.location ? userLocation.location.coords.longitude : 0.0,
                        }}
                    />
                </MapView>
            ) : (
                // Optionally show a loading spinner or placeholder
                <View style={styles.loadingContainer}>

                </View>
            )}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
