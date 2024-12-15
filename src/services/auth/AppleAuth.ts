import * as AppleAuthentication from "expo-apple-authentication";

import { Session } from "@/src/types/session.type";

export class AppleAuth {
    static async signIn(): Promise<Session> {
        const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
        });

        return {
            user: {
                email: credential.email,
                name: credential.fullName?.givenName,
                id: credential.user,
            },
            method: "Apple",
            idToken: credential.identityToken,
        } as Session;
    }

    static async signOut(): Promise<void> {
        console.log("Sign out with Apple");
    }

    static async refreshSession(session: Session): Promise<Session> {
        console.log("Refresh session with Apple");
        return { ...session } as Session;
    }
}