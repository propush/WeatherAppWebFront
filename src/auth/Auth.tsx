import {createContext, useEffect, useState} from "react";

export type AuthType = ({
    token: string | null, setToken: (token: string | null) => void,
}) | null;

export const AuthContext = createContext<AuthType>(null);

export const useAuth = (): AuthType => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        if (token === null) {
            console.log('Deleting token');
            localStorage.removeItem('token');
        } else {
            console.log('Token updated:', token);
            localStorage.setItem('token', token);
        }
    }, [token]);

    return {token, setToken};
};

export function extractTokenOrThrow(auth: AuthType): string {
    const token = auth?.token ?? null;
    if (token === null) {
        throw new Error("No token provided");
    }
    return token;
}
