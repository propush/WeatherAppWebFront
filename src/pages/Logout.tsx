import {useContext, useEffect} from "react";
import {AuthContext} from "../auth/Auth.tsx";
import {Navigate} from "react-router-dom";

export function Logout() {
    const auth = useContext(AuthContext)!;
    useEffect(() => {
        auth.setToken(null);
    }, []);
    return <Navigate to="/"/>;
}
