// import { authMethods, isValidAuthMethod } from "@/auth/index";
import { AuthMethods, isValidAuthMethod } from "../services/auth";
import { Session, SessionContextType } from "@/src/types/session.type";
import { useRouter } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { SecureStorage } from "../services/secure.storage";

const SessionContext = React.createContext<SessionContextType | undefined>(undefined);
export const useSession = () => {
    const context = React.useContext(SessionContext);
    if (context === undefined) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
}

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();

    const [session, setSession] = React.useState<Session>();

    // Load session from secure store
    const getSessionFromSecureStore = async () => {
        const session = await SecureStorage.getItemAsync("session");
        if (!session) return undefined;
        return JSON.parse(session);
    }

    const refreshSession = (session?: Session) => {
        if (!session || session.expiresAt > Date.now()) return;

        authMethods[session.method].refreshSession(session)
            .then(setSession)
            .catch(console.error);
    }

    React.useEffect(() => {
        getSessionFromSecureStore().then(setSession);

        const interval = setInterval(() => refreshSession(session), 1000 * 60);
        return () => {
            clearInterval(interval);
        }
    }, []);

    React.useEffect(() => {
        if (Platform.OS !== "web") return;

        const scriptTag = document.createElement('script');
        scriptTag.src = 'https://accounts.google.com/gsi/client';
        scriptTag.async = true;
        scriptTag.onload = () => {
            //   setLoaded(true);
        };
        scriptTag.onerror = () => {
            console.error('Failed to load Google One-tap script');
        };

        document.body.appendChild(scriptTag);
    }, []);

    React.useEffect(() => {
        if (!session) return router.replace("/login-screen");
        router.replace("/(screens)/");
    }, [session])

    return (
        <SessionContext.Provider value={{
            session,
            signInWith: async (method, opt?) => {
                if (!isValidAuthMethod(method)) throw Error("Invalid sign in method");

                authMethods[method].signIn(opt)
                    .then((session) => {
                        if (!session) return;
                        setSession(session);

                        // Save session to secure store, persisting the session
                        SecureStorage
                            .setItemAsync("session", JSON.stringify(session));
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            },
            signOut: () => {
                if (!session) return;
                // if (!isValidAuthMethod(session.method)) throw Error("Invalid sign out method");
                authMethods["Google"].signOut()
                    .then(() => {
                        setSession(undefined);

                        // Remove session from secure store
                        SecureStorage
                            .deleteItemAsync("session");
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            },
        }} >
            {children}
        </SessionContext.Provider>
    );
};