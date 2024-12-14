// import { Session } from "@/src/types/session.type";
// import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Session } from "@/src/types/session.type";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
    webClientId: '140859937803-l3n5bcs1lcrhjbjnupmol1ars421hm8v.apps.googleusercontent.com',
});

export class GoogleAuth {
    static async signIn(): Promise<Session> {
        console.log("Sign in with Google");
        const response = await GoogleSignin.signIn().catch((err) => {
            throw new Error("Hubo un error al iniciar sesión con Google");
        });

        // Get tokens
        const tokens = await GoogleSignin.getTokens();
        
        console.log(response);
        if (!response) throw new Error("Hubo un error al iniciar sesión con Google");
        
        return {
            user: {
                email: response.user.email,
                name: response.user.name,
                id: response.user.id,
                photoURL: response.user.photo,
            },
            method: "Google",
            accessToken: tokens.accessToken,
            idToken: tokens.idToken, // This is the JWT token
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