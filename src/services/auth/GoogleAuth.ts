// import { Session } from "@/src/types/session.type";
// import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Session } from "@/src/types/session.type";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
    webClientId: '140859937803-l3n5bcs1lcrhjbjnupmol1ars421hm8v.apps.googleusercontent.com',
});

export class GoogleAuth {
    static async signIn(): Promise<Session> {
        const response = await GoogleSignin.signIn();
        const tokens = await GoogleSignin.getTokens();
        
        return {
            user: {
                email: response.user.email,
                name: response.user.name,
                id: response.user.id,
                photoURL: response.user.photo,
            },
            method: "Google",
            idToken: tokens.idToken,
        } as Session;
    }

    static async signOut() {
        console.log("Sign out with Google");
    }

    static async refreshSession(session: Session): Promise<Session> {
        console.log("Refresh session with Google");
        return { ...session } as Session;
    }
}