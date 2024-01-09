import {createContext, useEffect, useState} from "react";

export type AuthType = ({
    token: string | null, setToken: (token: string | null) => void,
    authError: AuthError | null, setAuthError: (error: AuthError | null) => void
}) | null;

export type AuthError = { status: number, message: string };

export const AuthContext = createContext<AuthType>(null);

export const useAuth = (): AuthType => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [authError, setAuthError] = useState<AuthError | null>(null);

    useEffect(() => {
        if (token === null) {
            console.log('Deleting token');
            localStorage.removeItem('token');
        } else {
            console.log('Token updated:', token);
            localStorage.setItem('token', token);
        }
    }, [token]);

    return {token, setToken, authError, setAuthError};
};

export function extractTokenOrThrow(auth: AuthType): string {
    const token = auth?.token ?? null;
    if (token === null) {
        auth?.setAuthError({status: 0, message: "No token provided"});
        throw new Error("No token provided");
    }
    return token;
}
