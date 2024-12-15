import { Session } from "@/src/types/session.type";
import zod from "zod";

const CredentialsAuthSchema = zod.object({
    "email": zod.string().email(),
    "password": zod.string(),
})

export class CredentialsAuth {
    constructor() { }

    static async signIn(credentials: { email: string, password: string }): Promise<Session> {
        // Here you might want to do some local validation
        return {
            user: {
                email: credentials.email,
                name: '', // Will be filled by backend
                id: '',  // Will be filled by backend
            },
            method: "Credentials",
            idToken: '', // Will be filled by backend
        } as Session;
    }

    static async signOut(): Promise<void> {
        console.log("Sign out with credentials");
    }

    static async refreshSession(session: Session): Promise<Session> {
        console.log("Refresh session with credentials");
        return { ...session } as Session;
    }
}