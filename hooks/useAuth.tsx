"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { doc, onSnapshot, setDoc, Unsubscribe } from "firebase/firestore";
import { auth, db } from "@/utils/firebase.browser";
import { User } from "@/app/type/auth";

type AuthContextValue = {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    logIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, confirmPassword: string, userName: string) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop";

const getErrorMessage = (e: unknown): string => {
    const code = (e as { code?: string })?.code;
    switch (code) {
        case "auth/email-already-in-use": return "An account with this email already exists";
        case "auth/invalid-email": return "Please enter a valid email";
        case "auth/weak-password": return "Password must be at least 6 characters";
        case "auth/invalid-credential": return "Wrong email or password";
        case "auth/too-many-requests": return "Too many attempts, try again later";
        default: return e instanceof Error ? e.message : "Something went wrong";
    }
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let unsubProfile: Unsubscribe | null = null;

        const unsubAuth = onAuthStateChanged(auth, (fbUser) => {
            unsubProfile?.();
            unsubProfile = null;

            if (!fbUser) {
                setUser(null);
                setLoading(false);
                return;
            }

            unsubProfile = onSnapshot(
                doc(db, "users", fbUser.uid),
                (snap) => {
                    setUser(snap.exists() ? { ...(snap.data() as Omit<User, "id">), id: fbUser.uid } : null);
                    setLoading(false);
                },
                (err) => {
                    console.log("Profile listener error", err);
                    setLoading(false);
                }
            );
        });

        return () => {
            unsubProfile?.();
            unsubAuth();
        };
    }, []);

    const logIn = async (email: string, password: string) => {
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (e) {
            setError(getErrorMessage(e));
            throw e;
        }
    };

    const signUp = async (email: string, password: string, confirmPassword: string, userName: string) => {
        setError(null);
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            throw new Error("Passwords do not match");
        }
        try {
            const { user: fbUser } = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", fbUser.uid), {
                userName,
                email,
                avatar: DEFAULT_AVATAR,
                theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
                followerCount: 0,
                followingCount: 0,
                postCount: 0,
            });
        } catch (e) {
            setError(getErrorMessage(e));
            throw e;
        }
    };

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                isAuthenticated: user !== null,
                logIn,
                signUp,
                logout,
                clearError: () => setError(null),
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}
