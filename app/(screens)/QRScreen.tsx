import { useRouter } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import uuid from 'react-native-uuid';

export default function QRScreen() {
    const router = useRouter();
  
    const screen = "QR";
  
    const onPressBack = () => {
      router.back();
    };

    const generateUUID = () => {
        return uuid.v4();
    }

    const id: string = generateUUID() as string;
    console.log(id);
    return (
        <View style={styles.QR}>
            <QRCode
                value={id}
                size={200}/>
            <Text style={styles.text}>Muestra este QR al comercio para retirar tu pedido</Text>
        </View>
    );

    


}
const styles = StyleSheet.create({
    QR: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 25,
        textAlign: 'center',
    },
});