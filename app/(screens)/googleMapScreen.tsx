import React, { useEffect, useState, useContext, useRef } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Button } from 'react-native';
import { userLocationContext } from '../../src/context/userLocationContext';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import GoogleMap from "../../components/maps/GoogleMap"

export default function GoogleMapScreen() {
    const router = useRouter();

    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
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
        <View>
            <View style={styles.buttonContainer}>
                <Button title="Go back" onPress={onPressBack} />
            </View>

            <userLocationContext.Provider value={{ location, setLocation }}>
                <Text>{text}</Text>
            </userLocationContext.Provider>

            <GoogleMap />
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        alignSelf: 'flex-start',
        marginLeft: 10, 
        marginTop: 10, 
    }
});