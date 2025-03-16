import { Session } from "@/src/types/session.type";

export class GuestAuth {
    static async signIn(): Promise<Session> {
        console.log("Sign in as guest");
        return {
            token: "guest", 
            isGuest: true,
            expiresAt: Date.now() + 1000 * 60 * 60 * 24,
            method: "Guest",
            user: {
                id: 0, // Changed to number to match Session type
                name: "Guest",
                email: ""
            }
        };
    }

    static async signOut() {
        console.log("Sign out as guest");
    }

    static async refreshSession(session: Session): Promise<Session> {
        console.log("Refresh session as guest");
        return { ...session } as Session;
    }
}