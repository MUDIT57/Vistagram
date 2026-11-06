import { User } from "@/app/type/auth";
import { useEffect, useState } from "react";
import { firebaseService } from "@/services/firebaseService";
import { auth } from "@/utils/firebase.browser"
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

const STORAGE_KEY = "user";

export const useAuth = () => {
    const [state, setState] = useState<AuthState>({
        user: null,
        loading: true,
        error: null,
    });

    const logIn = async (emailOrUsername: string, password: string) => {
        console.log("Inside LogIn");
        setState((prev) => ({ ...prev, loading: true, error: null }));
        return signInWithEmailAndPassword(auth, emailOrUsername, password)
            .then((userCredential) => {
                console.log("Inside signInWithEmailAndPassword");
                const user = userCredential.user;
                setState((prev) => ({ ...prev, loading: false, error: null }));
                localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
                console.log(user);
                return user;
            })
            .catch((error) => {
                console.log("Inside Catch signInWithEmailAndPassword");
                const errorCode = error.code;
                const errorMessage = error.message;
                setState((prev) => ({
                    ...prev,
                    user: null,
                    loading: false,
                    error: errorMessage,
                }));
                throw error;
            });
    };

    const signUp = async (email: string, password: string, confirmPassword: string, userName: string) => {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const isPasswordSame = password === confirmPassword;
                if (!isPasswordSame) {
                    throw new Error("Password do not match");
                }
                const user = userCredential.user;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
                return user;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setState((prev) => ({
                    ...prev,
                    user: null,
                    loading: false,
                    error: errorMessage,
                }));
                throw error;
            });
    };

    const logout = () => {
        localStorage.clear();
        setState((prev) => ({ ...prev, user: null, loading: false, error: null }));
    };

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            setState((prev) => ({ ...prev, loading: false }));
            return;
        }
        try {
            setState((prev) => ({
                ...prev,
                user: JSON.parse(stored),
                loading: false,
                error: null,
            }));
        } catch {
            localStorage.removeItem(STORAGE_KEY);
            setState((prev) => ({ ...prev, loading: false }));
        }
    }, []);

    return {
        ...state,
        isAuthenticated: state.user !== null,
        logIn,
        signUp,
        logout,
    };
};
