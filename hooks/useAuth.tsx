import { User } from "@/app/type/auth";
import { firebaseService } from "@/services/firebaseService";
import { useEffect, useState } from "react";

interface AuthState {
    user: User | null,
    loading: boolean,
    error: string | null
}

const STORAGE_KEY = "user";

export const useAuth = () => {
    const [state, setState] = useState<AuthState>({
        user: null,
        loading: true,
        error: null
    });

    const logIn = async (emailOrUsername: string, password: string) => {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
            const users = await firebaseService.getAll<User>("users");
            const match = users.find((user: User) =>
                (user.userName === emailOrUsername || user.email === emailOrUsername) && user.password === password
            );
            if (!match)
                throw new Error("Invalid Credentials");
            setState((prev) => ({ ...prev, loading: false, error: null }));
            localStorage.setItem(STORAGE_KEY, JSON.stringify(match));
            return match;
        } catch (error) {
            const message = error instanceof Error ? error.message : "Login Failed";
            setState((prev) => ({ ...prev, user: null, loading: false, error: message }));
            throw error;
        }
    };

    const signUp = async (email: string, password: string, userName: string) => {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
            const users = await firebaseService.getAll<User>("users");
            console.log(users);
            const alreadyPresent = users.find((user: User) => { return (user.userName === userName || user.email === email) }
            );
            if (alreadyPresent) {
                throw new Error("Account with this username or email already exist");
            }
            const user = await firebaseService.add<User>("users", { userName, email, password });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
            return user;
        } catch (error) {
            const message = error instanceof Error ? error.message : "Login Failed";
            setState((prev) => ({ ...prev, user: null, loading: false, error: message }));
            throw error;
        }
    }

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
            setState((prev) => ({ ...prev, user: JSON.parse(stored), loading: false, error: null }));
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
        logout
    };


}