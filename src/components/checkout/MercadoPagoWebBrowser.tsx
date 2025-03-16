import { StatusBar } from "expo-status-bar";
import {
	StyleSheet,
	Button,
	View
} from "react-native";
import { openBrowserAsync } from "expo-web-browser";




export default function MercadoPagoWebBrowser(url:any) {
    return (
        <View style={styles.container}>
            <Button title="Open Browser" onPress={() => openBrowserAsync(url)}></Button>
            <StatusBar style="auto" />
        </View>
    );
    

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});