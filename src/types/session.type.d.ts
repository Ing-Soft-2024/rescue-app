import { AuthMethods } from "../services/auth";
import { User } from "./user.type";

export type Session = {
    user: User;
    token: string;  //creo que no se usa
    isGuest?: boolean;

    /**
     * Unix timestamp in milliseconds
     */
    expiresAt: number;
    method: AuthMethods;
    accessToken?: string;
    idToken?: string;  // JWT token
}

type SignInWithCredentials = (method: "Credentials", opts: { email: string, password: string }) => Promise<void>;
type SignInWithSSO = (method: Exclude<AuthMethods, "Credentials">) => Promise<void>;

type SignInWithType =
    SignInWithSSO
    & SignInWithCredentials;

export type SessionContextType = {
    session?: Session;

    signInWith: SignInWithType;
    signOut: () => void;
}